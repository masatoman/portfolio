"use client"

import { useState } from "react"
import { Send, Loader2, AlertTriangle, Check } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact"

const NEON = {
  cyan: "#00f0ff",
  magenta: "#ff3df0",
  green: "#39ff14",
  amber: "#ffb800",
  red: "#ff3d5b",
}

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; message: string }
  | { kind: "error"; message: string }

export function ContactFormY2K() {
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  async function handleSubmit(formData: FormData) {
    setStatus({ kind: "submitting" })
    const result = await submitContactForm(formData)
    setStatus(
      result.success
        ? { kind: "success", message: result.message }
        : { kind: "error", message: result.message },
    )
  }

  const submitting = status.kind === "submitting"

  return (
    <form
      action={handleSubmit}
      className="relative font-variant-y2k-body p-7 sm:p-8 space-y-5 border-2"
      style={{
        borderColor: NEON.cyan,
        background:
          "linear-gradient(180deg, rgba(0,240,255,0.04), rgba(255,61,240,0.03))",
      }}
    >
      {/* corner brackets */}
      <span aria-hidden className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2" style={{ borderColor: NEON.green }} />
      <span aria-hidden className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2" style={{ borderColor: NEON.green }} />
      <span aria-hidden className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2" style={{ borderColor: NEON.green }} />
      <span aria-hidden className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2" style={{ borderColor: NEON.green }} />

      <div className="text-center mb-2 font-variant-y2k">
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: NEON.green }}>
          // form_v1
        </p>
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
          メールで そうだん
        </h3>
        <p className="mt-2 text-xs text-white/50 font-variant-y2k-body">
          24時間以内に お返事します
        </p>
      </div>

      <Field id="name" label="お名前" required>
        <input
          id="name"
          name="name"
          required
          disabled={submitting}
          placeholder="山田 太郎"
          className="w-full bg-black/40 px-4 py-3 text-sm border outline-none placeholder:text-white/30 focus:bg-black/60 transition-colors"
          style={{ borderColor: `${NEON.cyan}40`, color: "#fff" }}
        />
      </Field>

      <Field id="email" label="メールアドレス" required>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={submitting}
          placeholder="example@company.co.jp"
          className="w-full bg-black/40 px-4 py-3 text-sm border outline-none placeholder:text-white/30 focus:bg-black/60 transition-colors"
          style={{ borderColor: `${NEON.cyan}40`, color: "#fff" }}
        />
      </Field>

      <Field id="message" label="ご相談内容" required>
        <textarea
          id="message"
          name="message"
          required
          disabled={submitting}
          rows={5}
          placeholder="やりたいこと、困っていること、ご予算感などを 自由にどうぞ。"
          className="w-full bg-black/40 px-4 py-3 text-sm border outline-none placeholder:text-white/30 focus:bg-black/60 transition-colors resize-y"
          style={{ borderColor: `${NEON.cyan}40`, color: "#fff" }}
        />
      </Field>

      {status.kind === "success" && (
        <div
          className="flex items-start gap-3 p-4 border-2 text-sm"
          style={{ borderColor: NEON.green, background: "rgba(57,255,20,0.06)", color: NEON.green }}
        >
          <Check className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="font-variant-y2k-body">{status.message}</span>
        </div>
      )}
      {status.kind === "error" && (
        <div
          className="flex items-start gap-3 p-4 border-2 text-sm"
          style={{ borderColor: NEON.red, background: "rgba(255,61,91,0.06)", color: NEON.red }}
        >
          <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <span className="font-variant-y2k-body">{status.message}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest font-variant-y2k disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: `linear-gradient(90deg, ${NEON.cyan}, ${NEON.magenta})`,
          color: "#000",
          clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
        }}
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            送信中…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            [ send ]
          </>
        )}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block text-[10px] font-bold uppercase tracking-widest font-variant-y2k"
        style={{ color: NEON.cyan }}
      >
        {label}
        {required && <span style={{ color: NEON.magenta }}> *</span>}
      </label>
      {children}
    </div>
  )
}
