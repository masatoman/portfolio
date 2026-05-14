import { NextResponse } from "next/server"
import { randomUUID } from "node:crypto"
import { isAnthropicConfigured } from "@/lib/anthropic"
import { extractIssues } from "@/lib/lab-tools/issue-finder/llm"
import { analyzeRequestSchema, issueSchema } from "@/lib/lab-tools/issue-finder/schema"
import { SAMPLE_ISSUES } from "@/lib/lab-tools/issue-finder/sample-data"
import type { AnalyzeResponse, Issue, SubsidyTag } from "@/lib/lab-tools/issue-finder/types"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const parsed = analyzeRequestSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", message: parsed.error.issues[0]?.message },
      { status: 400 },
    )
  }

  if (!isAnthropicConfigured()) {
    const response: AnalyzeResponse = { mode: "sample", issues: SAMPLE_ISSUES }
    return NextResponse.json(response)
  }

  try {
    const { issues: raw, modelName } = await extractIssues(parsed.data.text)

    const issues: Issue[] = raw.map((r): Issue => {
      const candidate = {
        id: randomUUID(),
        title: r.title,
        painSummary: r.painSummary,
        episode: r.episode ?? null,
        emotionScore: clampScore(r.emotionScore),
        issueScore: clampScore(r.issueScore),
        solvabilityScore: clampScore(r.solvabilityScore),
        scoreReason: r.scoreReason || null,
        subsidyTags: normalizeSubsidyTags(r.subsidyTags ?? []),
        industryTags: r.industryTags ?? [],
        sourceUrl: parsed.data.sourceUrl ?? null,
        sourceExcerpt: r.sourceExcerpt ?? null,
        sourceType: parsed.data.sourceType ?? null,
        createdAt: new Date().toISOString(),
      }
      return issueSchema.parse(candidate)
    })

    const response: AnalyzeResponse = { mode: "ai", issues, modelName }
    return NextResponse.json(response)
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error"
    return NextResponse.json(
      { error: "claude_call_failed", message },
      { status: 502 },
    )
  }
}

function clampScore(n: number): number {
  if (Number.isNaN(n)) return 50
  return Math.max(0, Math.min(100, Math.round(n)))
}

const VALID_TAGS: ReadonlySet<SubsidyTag> = new Set([
  "it-introduction",
  "jizokuka",
  "monodzukuri",
  "saikochiku",
  "none",
])

function normalizeSubsidyTags(tags: string[]): SubsidyTag[] {
  const filtered = tags.filter((t): t is SubsidyTag => VALID_TAGS.has(t as SubsidyTag))
  return filtered.length > 0 ? filtered : ["none"]
}
