import { NextResponse } from "next/server"
import { z } from "zod"
import {
  createServiceClient,
  isServiceRoleConfigured,
  isSupabaseConfigured,
} from "@/lib/supabase/server"
import { rowToJob, type JobRow } from "@/lib/lab-tools/issue-finder/db"
import { expandQueries } from "@/lib/lab-tools/issue-finder/queries"

export const runtime = "nodejs"

const createJobSchema = z.object({
  profileId: z.string().min(1).max(64),
  role: z.string().min(1).max(128),
  samplingTarget: z.number().int().min(20).max(500).default(100),
  extraNotes: z.string().max(2000).optional(),
  // Deep Research 等で外部 LLM が返した本文をそのまま渡す場合
  rawInputText: z.string().max(200_000).optional(),
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

  // queries.json に存在する perspective かチェック (タイポ・捏造防止)
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

  try {
    const supabase = await createServiceClient()
    const { data, error } = await supabase
      .from("if_jobs")
      .insert({
        profile_id: parsed.data.profileId,
        role: parsed.data.role,
        sampling_target: parsed.data.samplingTarget,
        extra_notes: parsed.data.extraNotes ?? null,
        raw_input_text: parsed.data.rawInputText ?? null,
        status: "pending",
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
      .select("*")
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
    return NextResponse.json({ jobs: data.map((r) => rowToJob(r as JobRow)) })
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
