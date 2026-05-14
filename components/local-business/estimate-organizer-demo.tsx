"use client"

import { useMemo, useState } from "react"
import { FileUp, Loader2, Sparkles, Table2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { EstimateResponse } from "@/lib/local-business/estimate-organizer"

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "success"; data: EstimateResponse }
  | { kind: "error"; message: string }

export function EstimateOrganizerDemo() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  const response = status.kind === "success" ? status.data : null
  const modeLabel = useMemo(() => {
    if (!response) return null
    return response.mode === "ai" ? "AI抽出結果" : "サンプル整理結果"
  }, [response])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus({ kind: "loading" })

    try {
      const formData = new FormData()
      if (file) formData.append("file", file)

      const apiResponse = await fetch("/api/demos/estimate-organizer", {
        method: "POST",
        body: formData,
      })

      const payload = await apiResponse.json()
      if (!apiResponse.ok) {
        throw new Error(payload.message || "見積の整理に失敗しました。")
      }

      setStatus({ kind: "success", data: payload })
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "見積の整理に失敗しました。",
      })
    }
  }

  async function handleSample() {
    setStatus({ kind: "loading" })
    try {
      const apiResponse = await fetch("/api/demos/estimate-organizer?mode=sample", {
        method: "POST",
      })
      const payload = await apiResponse.json()
      if (!apiResponse.ok) {
        throw new Error(payload.message || "サンプルの読み込みに失敗しました。")
      }
      setStatus({ kind: "success", data: payload })
    } catch (error) {
      setStatus({
        kind: "error",
        message: error instanceof Error ? error.message : "サンプルの読み込みに失敗しました。",
      })
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef6ff] text-[#2f6fb6]">
            <FileUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#071b49]">PDFを整理して表にする</h2>
            <p className="text-sm font-bold text-[#5f6f89]">アップロードした見積書を、転記しやすい項目一覧に変えます。</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="estimate-pdf" className="text-sm font-black text-[#071b49]">見積書PDF</label>
            <Input
              id="estimate-pdf"
              type="file"
              accept="application/pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="h-12 rounded-xl border-slate-200 bg-[#fcfaf6] text-slate-900 file:mr-4 file:rounded-lg file:border-0 file:bg-[#eef6ff] file:px-3 file:py-2 file:font-bold file:text-[#2f6fb6]"
            />
            <p className="text-xs font-bold text-[#5f6f89]">APIキー未設定でも、サンプル結果で最後まで確認できます。</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={status.kind === "loading"} className="h-11 rounded-xl bg-[#f47b20] px-5 text-sm font-black text-white hover:bg-[#e36d15]">
              {status.kind === "loading" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  処理中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  整理する
                </>
              )}
            </Button>
            <Button type="button" variant="outline" onClick={handleSample} disabled={status.kind === "loading"} className="h-11 rounded-xl border-[#0d2b66] bg-white px-5 text-sm font-black text-[#071b49] hover:bg-white">
              サンプルを表示
            </Button>
          </div>
        </form>

        {status.kind === "error" && (
          <Alert className="mt-4 border-red-200 bg-red-50 text-red-700">
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}

        <div className="mt-6 rounded-[20px] border border-dashed border-[#d8e3f2] bg-[#f9fbff] p-5">
          <h3 className="text-sm font-black text-[#071b49]">想定している使いどころ</h3>
          <ul className="mt-3 space-y-2 text-sm font-bold leading-7 text-[#31466b]">
            <li>・PDF見積を見ながら基幹システムへ転記している</li>
            <li>・外注先ごとに書式が違い、項目整理に時間がかかる</li>
            <li>・まずは一覧にして、確認や転記の負担を減らしたい</li>
          </ul>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fff5e8] text-[#f47b20]">
              <Table2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#071b49]">整理結果</h2>
              <p className="text-sm font-bold text-[#5f6f89]">項目、数量、単価、金額が一覧で確認できます。</p>
            </div>
          </div>
          {modeLabel ? <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-black text-[#2f6fb6]">{modeLabel}</span> : null}
        </div>

        {response ? (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#f9fbff] p-4">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">Source</p>
              <p className="mt-1 text-sm font-black text-[#071b49]">{response.sourceName}</p>
              <p className="mt-2 text-sm font-bold leading-7 text-[#31466b]">{response.summary}</p>
            </div>
            <div className="overflow-x-auto rounded-2xl border border-[#d8e3f2]">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-[#f4f8ff] text-[#071b49]">
                  <tr>
                    {["項目", "数量", "単位", "単価", "金額", "備考"].map((label) => (
                      <th key={label} className="px-4 py-3 font-black">{label}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {response.items.map((item) => (
                    <tr key={`${item.name}-${item.amount}`} className="border-t border-[#e8eef8]">
                      <td className="px-4 py-3 font-black text-[#071b49]">{item.name}</td>
                      <td className="px-4 py-3 font-bold text-[#31466b]">{item.quantity}</td>
                      <td className="px-4 py-3 font-bold text-[#31466b]">{item.unit}</td>
                      <td className="px-4 py-3 font-bold text-[#31466b]">{item.unitPrice}</td>
                      <td className="px-4 py-3 font-bold text-[#31466b]">{item.amount}</td>
                      <td className="px-4 py-3 font-bold text-[#31466b]">{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid min-h-[360px] place-items-center rounded-[22px] border border-dashed border-[#d8e3f2] bg-[#f9fbff] text-center">
            <div className="max-w-sm px-6">
              <p className="text-lg font-black text-[#071b49]">ここに整理結果が表示されます</p>
              <p className="mt-3 text-sm font-bold leading-7 text-[#5f6f89]">サンプルを開くか、見積書PDFをアップロードして試してください。</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
