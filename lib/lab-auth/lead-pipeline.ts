/**
 * Magic link 経由でメアドが verify された後に走る処理:
 *   1. Resend Audience に contact 追加 (将来のメルマガ用)
 *   2. masatoman 自身に "new lead" 通知メール送信
 *
 * いずれもベストエフォート。 失敗してもユーザーログインは成功扱い。
 */

const FROM_NOREPLY = "井原誠斗 Lab <noreply@send.ihara-frontend.com>"
const FROM_NOTIFY = "井原誠斗 Lab <notify@send.ihara-frontend.com>"
const NOTIFY_TO = process.env.LEAD_NOTIFY_TO ?? "info@ihara-frontend.com"
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? ""

type ResendClient = {
  emails: {
    send: (params: {
      from: string
      to: string
      replyTo?: string
      subject: string
      text?: string
      html?: string
    }) => Promise<unknown>
  }
  contacts?: {
    create: (params: {
      audienceId: string
      email: string
      unsubscribed?: boolean
    }) => Promise<unknown>
  }
}

async function getResend(): Promise<ResendClient | null> {
  if (!process.env.RESEND_API_KEY) return null
  const { Resend } = await import("resend")
  return new Resend(process.env.RESEND_API_KEY) as unknown as ResendClient
}

export async function sendMagicLinkEmail(input: {
  email: string
  link: string
  ttlMinutes: number
}): Promise<{ ok: boolean; error?: string }> {
  const resend = await getResend()
  if (!resend) {
    console.warn("[lab-auth] RESEND_API_KEY 未設定 — magic link を console.log します")
    console.log(`[lab-auth] magic link for ${input.email}: ${input.link}`)
    return { ok: true }
  }

  const subject = "[井原誠斗 Lab] AI ツール ログイン用リンク"
  const text = `${input.email} 様

井原誠斗 Lab の AI ツールにログインするためのリンクです。
下のリンクを ${input.ttlMinutes} 分以内にクリックしてください。

${input.link}

クリックすると 30 日間 AI 機能 (補助金診断 / 事業計画ジェネ / 残業レポート / 証跡 OCR) が使えるようになります。

このメールに心当たりがない場合は無視してください。

────────────────
井原誠斗 (Ihara Frontend)
https://ihara-frontend.com
`

  try {
    await resend.emails.send({
      from: FROM_NOREPLY,
      to: input.email,
      subject,
      text,
    })
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown"
    console.error("[lab-auth] sendMagicLinkEmail failed:", msg)
    return { ok: false, error: msg }
  }
}

/**
 * verify 成功時のリード処理 (best effort, ノンブロッキング想定)
 */
export async function recordLead(input: { email: string }): Promise<void> {
  const resend = await getResend()
  if (!resend) return

  // 1. Audience に追加 (失敗しても無視)
  if (AUDIENCE_ID && resend.contacts) {
    try {
      await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email: input.email,
        unsubscribed: false,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown"
      console.warn("[lab-auth] Resend Audience 追加失敗:", msg)
    }
  }

  // 2. masatoman 自身に通知
  try {
    await resend.emails.send({
      from: FROM_NOTIFY,
      to: NOTIFY_TO,
      subject: `[Lab] new lead: ${input.email}`,
      text: `新しい AI ツール利用者が認証完了しました。

email: ${input.email}
timestamp: ${new Date().toLocaleString("ja-JP")}

Resend Audience に追加済み (${AUDIENCE_ID || "未設定"}).
`,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unknown"
    console.warn("[lab-auth] 通知メール送信失敗:", msg)
  }
}
