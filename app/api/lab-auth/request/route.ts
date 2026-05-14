import { NextResponse } from "next/server"
import { z } from "zod"
import { MAGIC_LINK_TTL_MS, createToken, isAuthSecretConfigured } from "@/lib/lab-auth/token"
import { sendMagicLinkEmail } from "@/lib/lab-auth/lead-pipeline"
import { checkRateLimit, rateLimitResponse } from "@/lib/lab-tools/rate-limit"

export const runtime = "nodejs"

const requestSchema = z.object({
  email: z.string().email().max(254),
  honeypot: z.string().optional(),
})

export async function POST(req: Request) {
  if (!isAuthSecretConfigured()) {
    return NextResponse.json(
      {
        error: "auth_not_configured",
        message: "LAB_AUTH_SECRET が未設定です (32 文字以上のランダム文字列)",
      },
      { status: 503 },
    )
  }

  const rl = checkRateLimit(req)
  if (!rl.ok) return rateLimitResponse(rl)

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 })
  }
  const parsed = requestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_failed", issues: parsed.error.issues },
      { status: 400 },
    )
  }

  // Honeypot 簡易 bot 対策: 隠しフィールドに値が入っていたら bot として静かに弾く
  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true, sent: false })
  }

  const email = parsed.data.email.trim().toLowerCase()
  const token = createToken({
    email,
    purpose: "magic-link",
    ttlMs: MAGIC_LINK_TTL_MS,
  })

  const origin =
    process.env.LAB_AUTH_BASE_URL ?? new URL(req.url).origin
  const link = `${origin}/api/lab-auth/verify?token=${encodeURIComponent(token)}`

  const result = await sendMagicLinkEmail({
    email,
    link,
    ttlMinutes: Math.round(MAGIC_LINK_TTL_MS / 60_000),
  })

  if (!result.ok) {
    return NextResponse.json(
      { error: "email_send_failed", message: result.error },
      { status: 502 },
    )
  }

  return NextResponse.json({
    ok: true,
    sent: true,
    message: `${email} 宛に ログイン用リンクを送信しました。 ${Math.round(MAGIC_LINK_TTL_MS / 60_000)} 分以内にクリックしてください。`,
  })
}
