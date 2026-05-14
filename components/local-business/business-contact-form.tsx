"use client"

import { useState } from "react"
import { Send, Loader2 } from "lucide-react"
import { submitContactForm } from "@/app/actions/contact"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success"; message: string } | { kind: "error"; message: string }

export function BusinessContactForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const submitting = status.kind === "submitting"

  async function handleSubmit(formData: FormData) {
    setStatus({ kind: "submitting" })
    const result = await submitContactForm(formData)
    setStatus(result.success ? { kind: "success", message: result.message } : { kind: "error", message: result.message })
  }

  return (
    <form action={handleSubmit} className="rounded-[2rem] border border-[#e1d9cc] bg-white p-6 shadow-[0_20px_45px_rgba(31,42,55,0.08)] sm:p-8">
      <div className="mb-6">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-[#f3ede2] text-[#7a5c38]">
          <Send className="h-7 w-7" />
        </div>
        <h3 className="text-2xl font-semibold tracking-tight text-[#1f2a37]">まずはご相談ください</h3>
        <p className="mt-2 text-sm leading-7 text-[#5f6871]">制作のことでも、業務のことでも大丈夫です。通常24時間以内にご返信します。</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="business-name" className="text-[#4d5963]">お名前 <span className="text-[#a07038]">*</span></Label>
          <Input id="business-name" name="name" required disabled={submitting} className="h-12 rounded-2xl border-[#ded7ca] bg-[#fcfaf6] text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#a07038]" placeholder="例）山田 太郎" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business-company" className="text-[#4d5963]">会社名（任意）</Label>
          <Input id="business-company" name="company" disabled={submitting} className="h-12 rounded-2xl border-[#ded7ca] bg-[#fcfaf6] text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#a07038]" placeholder="例）株式会社OO工務店" />
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="business-email" className="text-[#4d5963]">メールアドレス <span className="text-[#a07038]">*</span></Label>
          <Input id="business-email" name="email" type="email" required disabled={submitting} className="h-12 rounded-2xl border-[#ded7ca] bg-[#fcfaf6] text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#a07038]" placeholder="例）example@domain.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="business-phone" className="text-[#4d5963]">電話番号（任意）</Label>
          <Input id="business-phone" name="phone" disabled={submitting} className="h-12 rounded-2xl border-[#ded7ca] bg-[#fcfaf6] text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#a07038]" placeholder="例）090-1234-5678" />
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="business-message" className="text-[#4d5963]">ご相談内容 <span className="text-[#a07038]">*</span></Label>
        <Textarea id="business-message" name="message" required disabled={submitting} rows={6} className="rounded-2xl border-[#ded7ca] bg-[#fcfaf6] text-slate-900 placeholder:text-slate-400 focus-visible:ring-[#a07038]" placeholder="今どこで手間がかかっているか、ホームページで気になっていることなどを教えてください。" />
      </div>

      {status.kind === "success" && (
        <Alert className="mt-4 border-emerald-200 bg-emerald-50 text-emerald-800">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}
      {status.kind === "error" && (
        <Alert className="mt-4 border-red-200 bg-red-50 text-red-700">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" disabled={submitting} className="mt-5 h-12 w-full rounded-full border-0 bg-[#7a5c38] text-base font-semibold text-white hover:bg-[#694d2d]">
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
