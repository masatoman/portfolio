import { NextResponse } from "next/server"
import { setSessionCookie } from "@/lib/lab-auth/cookie"
import { recordLead } from "@/lib/lab-auth/lead-pipeline"
import { isAuthSecretConfigured, verifyToken } from "@/lib/lab-auth/token"

export const runtime = "nodejs"

function errorRedirect(req: Request, reason: string): Response {
  const url = new URL("/lab", new URL(req.url).origin)
  url.searchParams.set("auth_error", reason)
  return NextResponse.redirect(url)
}

export async function GET(req: Request) {
  if (!isAuthSecretConfigured()) {
    return errorRedirect(req, "not_configured")
  }
  const token = new URL(req.url).searchParams.get("token") ?? ""
  if (!token) return errorRedirect(req, "missing_token")

  const verified = verifyToken(token, "magic-link")
  if (!verified.ok) return errorRedirect(req, verified.reason)

  await setSessionCookie(verified.payload.email)

  // リード記録 (best effort、 失敗してもログイン成功扱い)
  recordLead({ email: verified.payload.email }).catch(() => {})

  const successUrl = new URL("/lab", new URL(req.url).origin)
  successUrl.searchParams.set("auth_ok", "1")
  return NextResponse.redirect(successUrl)
}
