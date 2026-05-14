import { NextResponse, type NextRequest } from "next/server"
import { z } from "zod"
import { createClient } from "@supabase/supabase-js"

const VALID_SLUGS = [
  "estimate-organizer",
  "call-memo-board",
  "site-photo-organizer",
  "voice-daily-report",
  "receipt-expense-camera",
  "drawing-quick-viewer",
  "client-progress-page",
  "website-refresh",
] as const

const CONTACT_INTERESTS = [
  "want-results", // 投票結果を先に教えてほしい
  "want-test", // リリース前にテスト協力 OK
  "want-launch", // リリースしたら連絡してほしい
] as const

const REJECT_REASONS = [
  "fine-as-is", // 今のやり方で十分
  "pc-difficult", // パソコン苦手
  "input-burden", // 入力が面倒
  "boss-wont-adopt", // 社長が導入しない
  "unusable-onsite", // 現場で使えない
  "other", // その他
] as const

const voteSchema = z
  .object({
    voter_name: z.string().max(50).optional().nullable(),
    voter_role: z.string().max(50).optional().nullable(),
    selected_demos: z.array(z.enum(VALID_SLUGS)).max(3).optional().default([]),
    paid_demos: z.array(z.enum(VALID_SLUGS)).max(3).optional().default([]),
    contact_interest: z
      .array(z.enum(CONTACT_INTERESTS))
      .max(3)
      .optional()
      .default([]),
    contact_value: z.string().max(200).optional().nullable(),
    reject_reasons: z
      .array(z.enum(REJECT_REASONS))
      .max(6)
      .optional()
      .default([]),
    comment: z.string().max(1000).optional().nullable(),
  })
  .refine(
    (data) =>
      data.paid_demos.every((slug) => data.selected_demos.includes(slug)),
    {
      message: "paid_demos must be subset of selected_demos",
      path: ["paid_demos"],
    }
  )
  .refine(
    // 投票 1 件以上 OR 拒否理由 1 件以上 のどちらかが必要
    (data) =>
      data.selected_demos.length >= 1 || data.reject_reasons.length >= 1,
    {
      message: "either selected_demos or reject_reasons must have at least 1 item",
      path: ["selected_demos"],
    }
  )

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 })
  }

  const parsed = voteSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 }
    )
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 })
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  const ipAddress =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    null
  const userAgent = req.headers.get("user-agent") || null

  const { error } = await supabase.from("demo_votes").insert({
    voter_name: parsed.data.voter_name || null,
    voter_role: parsed.data.voter_role || null,
    selected_demos: parsed.data.selected_demos,
    paid_demos: parsed.data.paid_demos,
    contact_interest: parsed.data.contact_interest,
    contact_value: parsed.data.contact_value || null,
    reject_reasons: parsed.data.reject_reasons,
    comment: parsed.data.comment || null,
    ip_address: ipAddress,
    user_agent: userAgent,
  })

  if (error) {
    return NextResponse.json(
      { error: "database_error", message: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
