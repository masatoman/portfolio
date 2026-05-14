import { cookies } from "next/headers"
import {
  SESSION_TTL_MS,
  createToken,
  verifyToken,
  type VerifyResult,
} from "./token"

const COOKIE_NAME = "lab_session"

export async function setSessionCookie(email: string): Promise<void> {
  const token = createToken({ email, purpose: "session", ttlMs: SESSION_TTL_MS })
  const store = await cookies()
  store.set({
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  })
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE_NAME)
}

export async function getSessionCookie(): Promise<string | undefined> {
  const store = await cookies()
  return store.get(COOKIE_NAME)?.value
}

/**
 * cookie からセッションを検証して email を返す。
 * 未ログイン or 無効 cookie なら null。
 */
export async function getCurrentSessionEmail(): Promise<string | null> {
  const token = await getSessionCookie()
  if (!token) return null
  const result = verifyToken(token, "session")
  if (!result.ok) return null
  return result.payload.email
}

/**
 * Request からも取得 (middleware や Edge runtime 向け)。
 * Next.js 15 では `cookies()` が server context にしか効かないため、
 * API route からは Request 経由で取る方が確実。
 */
export function readSessionFromRequest(req: Request): VerifyResult & { token?: string } {
  const cookieHeader = req.headers.get("cookie") ?? ""
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`))
  if (!match) {
    return { ok: false, reason: "malformed" }
  }
  const token = decodeURIComponent(match[1])
  const r = verifyToken(token, "session")
  return { ...r, token }
}
