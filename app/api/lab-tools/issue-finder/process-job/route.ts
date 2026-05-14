import { NextResponse } from "next/server"
import { z } from "zod"
import {
  createServiceClient,
  isServiceRoleConfigured,
} from "@/lib/supabase/server"
import {
  computeIssueScore,
  DUPLICATE_TITLE_THRESHOLD,
  titleSimilarity,
} from "@/lib/lab-tools/issue-finder/scoring"
import {
  llmIssueSchema,
  subsidyTagSchema,
} from "@/lib/lab-tools/issue-finder/schema"

export const runtime = "nodejs"
export const maxDuration = 60

// SKILL からの POST。
// SKILL 自体は web_search してクラスタリングするだけ。
// このエンドポイントが Supabase 書き込み・重複検出・スコア再計算を担う。
// 認証は INTERNAL_KEY (SKILL の env と portfolio の env で共有)

const processJobSchema = z.object({
  jobId: z.string().uuid().optional(),
  // jobId が無ければ ad-hoc 実行 (collection_jobs を介さず直接 issues に書き込む)
  profileId: z.string(),
  role: z.string(),
  samplingTotal: z.number().int().nonnegative(),
  clusters: z
    .array(
      llmIssueSchema.extend({
        clusterSize: z.number().int().min(1),
        industryImpact: z.number().int().min(0).max(30).default(10),
        relatedQuotes: z
          .array(
            z.object({
              excerpt: z.string().max(400),
              sourceUrl: z.string().url().nullable(),
            }),
          )
          .default([]),
        sourceUrl: z.string().url().nullable().optional(),
        sourceType: z.string().nullable().optional(),
      }),
    )
    .min(1)
    .max(30),
})

export async function POST(req: Request) {
  // 1. 認証
  const internalKey = req.headers.get("x-internal-key")
  if (
    !process.env.ISSUE_FINDER_INTERNAL_KEY ||
    internalKey !== process.env.ISSUE_FINDER_INTERNAL_KEY
  ) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      { error: "supabase_not_configured" },
      { status: 503 },
    )
  }

  // 2. 入力 parse
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const parsed = processJobSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    )
  }

  const { jobId, profileId, role, samplingTotal, clusters } = parsed.data
  const supabase = await createServiceClient()
  const runDate = new Date().toISOString().slice(0, 10)

  // 3. 既存タイトル取得 (重複検出用、 過去 30 日同 perspective)
  const since = new Date()
  since.setUTCDate(since.getUTCDate() - 30)
  const { data: recent } = await supabase
    .from("if_issues")
    .select("id, title")
    .eq("profile_id", profileId)
    .eq("role", role)
    .gte("created_at", since.toISOString())
  const recentTitles: Array<{ id: string; title: string }> = recent ?? []

  // 4. クラスタごとに INSERT or skip 判定
  let inserted = 0
  let skipped = 0
  const skippedDetails: Array<{ title: string; reason: string }> = []

  for (const c of clusters) {
    const dup = recentTitles.find(
      (r) => titleSimilarity(r.title, c.title) >= DUPLICATE_TITLE_THRESHOLD,
    )
    if (dup) {
      skipped += 1
      skippedDetails.push({
        title: c.title,
        reason: `duplicate of issue ${dup.id.slice(0, 8)}`,
      })
      continue
    }

    const issueScore = computeIssueScore({
      clusterSize: c.clusterSize,
      samplingTotal,
      emotionScore: c.emotionScore,
      industryImpact: c.industryImpact,
    })

    const subsidyTags = (c.subsidyTags ?? [])
      .map((t) => subsidyTagSchema.safeParse(t))
      .filter((r) => r.success)
      .map((r) => r.data)

    const { error } = await supabase.from("if_issues").insert({
      title: c.title,
      pain_summary: c.painSummary,
      episode: c.episode ?? null,
      emotion_score: c.emotionScore,
      issue_score: issueScore,
      solvability_score: c.solvabilityScore,
      score_reason: c.scoreReason || null,
      subsidy_tags: subsidyTags.length > 0 ? subsidyTags : ["none"],
      industry_tags: c.industryTags ?? [],
      source_url: c.sourceUrl ?? null,
      source_excerpt: c.sourceExcerpt ?? null,
      source_type: c.sourceType ?? null,
      cluster_size: c.clusterSize,
      sampling_total: samplingTotal,
      related_quotes: c.relatedQuotes,
      profile_id: profileId,
      role,
      job_id: jobId ?? null,
      run_date: runDate,
    })

    if (error) {
      skipped += 1
      skippedDetails.push({ title: c.title, reason: error.message })
      continue
    }
    inserted += 1
  }

  // 5. jobId があれば collection_jobs を completed に
  if (jobId) {
    await supabase
      .from("if_jobs")
      .update({
        status: "completed",
        finished_at: new Date().toISOString(),
        issues_created: inserted,
        summary: {
          sampling_total: samplingTotal,
          clusters_input: clusters.length,
          inserted,
          skipped,
          skipped_details: skippedDetails,
        },
      })
      .eq("id", jobId)
  }

  return NextResponse.json({
    ok: true,
    inserted,
    skipped,
    skippedDetails,
    runDate,
  })
}
