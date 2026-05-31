import { NextResponse } from "next/server"
import { z } from "zod"
import {
  createServiceClient,
  isServiceRoleConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase/server"
import {
  JOB_LIST_COLUMNS,
  rowToJob,
  type JobRow,
} from "@/lib/lab-tools/issue-finder/db"
import { expandQueries } from "@/lib/lab-tools/issue-finder/queries"

export const runtime = "nodejs"

const createJobSchema = z.object({
  profileId: z.string().min(1).max(64),
  role: z.string().min(1).max(128),
  samplingTarget: z.number().int().min(20).max(500).default(100),
  extraNotes: z.string().max(2000).optional(),
  // Deep Research 等で外部 LLM が返した本文をそのまま渡す場合
  rawInputText: z.string().max(200_000).optional(),

  // ── ad-hoc モード (ChatGPT 等の gap 推薦切り口を queries.json 編集なしで投入) ──
  isAdhoc: z.boolean().optional().default(false),
  customRole: z.string().max(128).optional(),
  customKeywords: z.array(z.string().max(80)).max(30).optional().default([]),
  customWatchedTools: z.array(z.string().max(80)).max(20).optional().default([]),
  customExamplePhrases: z
    .array(z.string().max(200))
    .max(20)
    .optional()
    .default([]),
})

// 登録: ブラウザフォームから呼ばれる
export async function POST(req: Request) {
  if (!isServiceRoleConfigured()) {
    return NextResponse.json(
      {
        error: "supabase_not_configured",
        message:
          "Supabase 未設定です。 NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY を .env.local に設定してください",
      },
      { status: 503 },
    )
  }

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const parsed = createJobSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    )
  }

  // ad-hoc モードでなければ queries.json に存在する perspective かチェック
  // ad-hoc モードなら profileId は固定 4 種のいずれかであることだけ確認
  const ALLOWED_PROFILES = ["komuten", "financial-planner", "it-subsidy", "micro-corp"]
  if (parsed.data.isAdhoc) {
    if (!ALLOWED_PROFILES.includes(parsed.data.profileId)) {
      return NextResponse.json(
        {
          error: "unknown_profile",
          message: `ad-hoc モードでも profile は ${ALLOWED_PROFILES.join(" / ")} のいずれかである必要があります`,
        },
        { status: 400 },
      )
    }
    if (!parsed.data.customRole || parsed.data.customRole.trim().length === 0) {
      return NextResponse.json(
        {
          error: "missing_custom_role",
          message: "ad-hoc モードでは customRole が必須です",
        },
        { status: 400 },
      )
    }
    if (
      !parsed.data.customKeywords ||
      parsed.data.customKeywords.length === 0
    ) {
      return NextResponse.json(
        {
          error: "missing_custom_keywords",
          message:
            "ad-hoc モードでは customKeywords (入り口キーワード) が最低 1 つ必要です",
        },
        { status: 400 },
      )
    }
  } else {
    const allQueries = expandQueries()
    const exists = allQueries.some(
      (q) =>
        q.profileId === parsed.data.profileId && q.role === parsed.data.role,
    )
    if (!exists) {
      return NextResponse.json(
        {
          error: "unknown_perspective",
          message: `${parsed.data.profileId} / ${parsed.data.role} は queries.json に存在しません`,
        },
        { status: 400 },
      )
    }
  }

  try {
    const supabase = await createServiceClient()
    const { data, error } = await supabase
      .from("if_jobs")
      .insert({
        profile_id: parsed.data.profileId,
        role: parsed.data.isAdhoc
          ? (parsed.data.customRole as string)
          : parsed.data.role,
        sampling_target: parsed.data.samplingTarget,
        extra_notes: parsed.data.extraNotes ?? null,
        raw_input_text: parsed.data.rawInputText ?? null,
        status: "pending",
        is_adhoc: parsed.data.isAdhoc,
        custom_role: parsed.data.isAdhoc
          ? (parsed.data.customRole as string)
          : null,
        custom_keywords: parsed.data.isAdhoc
          ? parsed.data.customKeywords
          : [],
        custom_watched_tools: parsed.data.isAdhoc
          ? parsed.data.customWatchedTools
          : [],
        custom_example_phrases: parsed.data.isAdhoc
          ? parsed.data.customExamplePhrases
          : [],
      })
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json(
        {
          error: "supabase_insert_failed",
          message: error?.message ?? "unknown",
        },
        { status: 502 },
      )
    }

    return NextResponse.json({ job: rowToJob(data as JobRow) })
  } catch (err) {
    return NextResponse.json(
      {
        error: "exception",
        message: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 },
    )
  }
}

// 取得: フォーム下のジョブリスト + SKILL の pending 取得用
// ?status=pending&limit=1 のような form で SKILL から呼ばれる
export async function GET(req: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ jobs: [], note: "supabase_not_configured" })
  }

  const url = new URL(req.url)
  const status = url.searchParams.get("status")
  const limitRaw = url.searchParams.get("limit")
  const limit = Math.min(
    Math.max(Number.parseInt(limitRaw ?? "20", 10) || 20, 1),
    100,
  )

  try {
    const { createClient: createServerSupabase } = await import(
      "@/lib/supabase/server"
    )
    const supabase = await createServerSupabase()
    let query = supabase
      .from("if_jobs")
      .select(JOB_LIST_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query
    if (error || !data) {
      return NextResponse.json(
        { error: "supabase_select_failed", message: error?.message },
        { status: 502 },
      )
    }
    return NextResponse.json({
      jobs: data.map((r) => rowToJob(r as unknown as JobRow)),
    })
  } catch (err) {
    return NextResponse.json(
      {
        error: "exception",
        message: err instanceof Error ? err.message : "unknown",
      },
      { status: 500 },
    )
  }
}
