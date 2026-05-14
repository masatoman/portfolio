import { createHmac, timingSafeEqual } from "node:crypto"

/**
 * HMAC-SHA256 で署名された stateless トークン。
 *   payload (base64url) + "." + signature (base64url)
 *
 * 用途:
 *   - magic link token (短期 30 分、 メール内クリックで認証)
 *   - session cookie token (長期 30 日、 認証済みフラグ)
 */

type TokenPayload = {
  /** メールアドレス */
  email: string
  /** 用途識別 */
  purpose: "magic-link" | "session"
  /** 発行時刻 (ms epoch) */
  iat: number
  /** 有効期限 (ms epoch) */
  exp: number
}

const SECRET = (() => {
  const s = process.env.LAB_AUTH_SECRET
  if (!s || s.length < 32) {
    return undefined
  }
  return s
})()

export const MAGIC_LINK_TTL_MS = 30 * 60 * 1000           // 30 分
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000    // 30 日

export function isAuthSecretConfigured(): boolean {
  return Boolean(SECRET)
}

function b64urlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "")
}

function b64urlDecode(s: string): Buffer {
  const pad = (4 - (s.length % 4)) % 4
  const base64 = s.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat(pad)
  return Buffer.from(base64, "base64")
}

function sign(data: string): string {
  if (!SECRET) throw new Error("LAB_AUTH_SECRET is not configured")
  return b64urlEncode(createHmac("sha256", SECRET).update(data).digest())
}

export function createToken(input: {
  email: string
  purpose: TokenPayload["purpose"]
  ttlMs: number
}): string {
  if (!SECRET) throw new Error("LAB_AUTH_SECRET is not configured")
  const now = Date.now()
  const payload: TokenPayload = {
    email: input.email,
    purpose: input.purpose,
    iat: now,
    exp: now + input.ttlMs,
  }
  const payloadStr = b64urlEncode(Buffer.from(JSON.stringify(payload), "utf-8"))
  const sig = sign(payloadStr)
  return `${payloadStr}.${sig}`
}

export type VerifyResult =
  | { ok: true; payload: TokenPayload }
  | { ok: false; reason: "malformed" | "bad_signature" | "expired" | "wrong_purpose" }

export function verifyToken(
  token: string,
  expectedPurpose: TokenPayload["purpose"],
): VerifyResult {
  if (!SECRET) return { ok: false, reason: "bad_signature" }
  const parts = token.split(".")
  if (parts.length !== 2) return { ok: false, reason: "malformed" }
  const [payloadStr, sig] = parts

  const expected = sign(payloadStr)
  let sigOk = false
  try {
    const a = Buffer.from(sig)
    const b = Buffer.from(expected)
    if (a.length !== b.length) sigOk = false
    else sigOk = timingSafeEqual(a, b)
  } catch {
    sigOk = false
  }
  if (!sigOk) return { ok: false, reason: "bad_signature" }

  let payload: TokenPayload
  try {
    payload = JSON.parse(b64urlDecode(payloadStr).toString("utf-8"))
  } catch {
    return { ok: false, reason: "malformed" }
  }
  if (payload.purpose !== expectedPurpose) {
    return { ok: false, reason: "wrong_purpose" }
  }
  if (payload.exp < Date.now()) {
    return { ok: false, reason: "expired" }
  }
  return { ok: true, payload }
}
