"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Loader2 } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact"

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success"; message: string } | { kind: "error"; message: string }

export function ContactForm() {
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
      className="bg-white/5 rounded-lg p-6 sm:p-8 border border-white/20 space-y-4"
    >
      <div className="flex flex-col items-center text-center mb-4">
        <div className="bg-blue-500/20 p-4 rounded-full mb-4">
          <Send className="h-10 w-10 sm:h-12 sm:w-12 text-blue-300" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-white">メールでのお問い合わせ</h3>
        <p className="text-sm sm:text-base text-blue-100">
          法人案件・お見積もり向け / 24時間以内に返信
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-white">お名前 <span className="text-brand-accent">*</span></Label>
        <Input
          id="name"
          name="name"
          required
          disabled={submitting}
          className="bg-white/10 border-white/30 text-white placeholder:text-blue-200/60 focus-visible:ring-brand-accent"
          placeholder="山田 太郎"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">メールアドレス <span className="text-brand-accent">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          disabled={submitting}
          className="bg-white/10 border-white/30 text-white placeholder:text-blue-200/60 focus-visible:ring-brand-accent"
          placeholder="example@company.co.jp"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-white">お問い合わせ内容 <span className="text-brand-accent">*</span></Label>
        <Textarea
          id="message"
          name="message"
          required
          disabled={submitting}
          rows={5}
          className="bg-white/10 border-white/30 text-white placeholder:text-blue-200/60 focus-visible:ring-brand-accent"
          placeholder="プロジェクト概要、ご予算、希望納期などをお書きください。"
        />
      </div>

      {status.kind === "success" && (
        <Alert className="bg-emerald-500/20 border-emerald-400/40 text-emerald-50">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
      {status.kind === "error" && (
        <Alert className="bg-red-500/20 border-red-400/40 text-red-50">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white border-0 h-12 text-base font-semibold"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            送信中...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            送信する
          </>
        )}
      </Button>
    </form>
  )
}
