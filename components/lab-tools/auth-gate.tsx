"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Loader2, LogIn, LogOut, Mail, ShieldOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { LAB_NEON } from "@/lib/lab-tools/registry"

type Status =
  | { kind: "loading" }
  | { kind: "anonymous" }
  | { kind: "logged-in"; email: string }
  | { kind: "sent"; email: string }
  | { kind: "error"; message: string }

export function AuthGate() {
  const [status, setStatus] = useState<Status>({ kind: "loading" })
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const url = new URL(window.location.href)
    if (url.searchParams.get("auth_ok") === "1") {
      url.searchParams.delete("auth_ok")
      window.history.replaceState({}, "", url.toString())
    }
    const errParam = url.searchParams.get("auth_error")
    if (errParam) {
      url.searchParams.delete("auth_error")
      window.history.replaceState({}, "", url.toString())
      setStatus({ kind: "error", message: explainError(errParam) })
    }

    fetch("/api/lab-auth/me")
      .then((r) => r.json())
      .then((j: { email: string | null }) => {
        if (j.email) setStatus({ kind: "logged-in", email: j.email })
        else setStatus((s) => (s.kind === "error" ? s : { kind: "anonymous" }))
      })
      .catch(() => setStatus({ kind: "anonymous" }))
  }, [])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.includes("@") || submitting) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/lab-auth/request", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const body = await res.json().catch(() => ({}))
      if (!res.ok) {
        setStatus({
          kind: "error",
          message: body?.message || body?.error || `HTTP ${res.status}`,
        })
        return
      }
      setStatus({ kind: "sent", email })
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "unknown",
      })
    } finally {
      setSubmitting(false)
    }
  }

  async function onLogout() {
    await fetch("/api/lab-auth/logout", { method: "POST" })
    setStatus({ kind: "anonymous" })
    setEmail("")
  }

  if (status.kind === "loading") {
    return (
      <div className="border border-white/10 bg-black/30 px-4 py-3 flex items-center gap-2 text-[11px] font-mono text-white/40">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        loading auth...
      </div>
    )
  }

  if (status.kind === "logged-in") {
    return (
      <div
        className="border bg-black/40 px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
        style={{ borderColor: `${LAB_NEON.green}50` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: LAB_NEON.green }} />
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: LAB_NEON.green }}>
              ai feature on
            </p>
            <p className="text-xs font-mono text-white/70 truncate">{status.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white/60 hover:bg-white/10 hover:text-white transition"
        >
          <LogOut className="h-3 w-3" />
          logout
        </button>
      </div>
    )
  }

  if (status.kind === "sent") {
    return (
      <div
        className="border bg-black/40 px-5 py-4 flex items-start gap-3"
        style={{ borderColor: `${LAB_NEON.cyan}60` }}
      >
        <Mail className="h-5 w-5 shrink-0 mt-0.5" style={{ color: LAB_NEON.cyan }} />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: LAB_NEON.cyan }}>
            メールを送信しました
          </p>
          <p className="text-sm text-white/80">
            <span className="font-mono">{status.email}</span> 宛にログイン用リンクを送りました。
          </p>
          <p className="text-[11px] text-white/50 mt-1.5 leading-relaxed">
            30 分以内にメール内のリンクをクリックしてください。 届かない場合は迷惑メールフォルダもご確認ください。 リンクをクリックすると 30 日間 AI 機能が使えるようになります。
          </p>
          <button
            onClick={() => setStatus({ kind: "anonymous" })}
            className="mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40 hover:text-white underline"
          >
            別のメールで送り直す
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-white/10 bg-black/30 px-5 py-4 space-y-3">
      <div className="flex items-center gap-2">
        <ShieldOff className="h-4 w-4 text-white/50" />
        <p className="text-xs font-bold uppercase tracking-widest text-white/70">
          // ai feature is locked
        </p>
      </div>
      <p className="text-xs text-white/65 leading-relaxed">
        AI 機能 (実 API レスポンス) を使うには メールアドレスでログインしてください。 認証なしでは サンプル結果が返ります。
      </p>
      <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
        {/* honeypot */}
        <input
          type="text"
          name="honeypot"
          tabIndex={-1}
          autoComplete="off"
          className="absolute left-[-9999px]"
          aria-hidden
        />
        <Input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1 min-w-[220px] bg-black/60 border-white/15 text-white font-mono text-sm"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting || !email.includes("@")}
          className="inline-flex items-center gap-1.5 border border-[#00f0ff]/60 bg-[#00f0ff]/10 px-4 py-2 text-[11px] font-bold uppercase tracking-widest text-[#00f0ff] hover:bg-[#00f0ff]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <LogIn className="h-3.5 w-3.5" />}
          {submitting ? "sending..." : "send link"}
        </button>
      </form>
      {status.kind === "error" && (
        <p className="text-[11px] text-red-300 font-mono">エラー: {status.message}</p>
      )}
    </div>
  )
}

function explainError(reason: string): string {
  switch (reason) {
    case "expired":
      return "ログインリンクの有効期限 (30 分) が切れました。 もう一度送信してください。"
    case "bad_signature":
    case "malformed":
      return "リンクが壊れています。 もう一度送信してください。"
    case "wrong_purpose":
      return "リンクの種類が不正です。 もう一度送信してください。"
    case "missing_token":
      return "トークンがありません。 もう一度メールから開いてください。"
    case "not_configured":
      return "認証システムが未設定です (LAB_AUTH_SECRET)。"
    default:
      return reason
  }
}
