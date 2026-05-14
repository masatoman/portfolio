"use client"

import { useState } from "react"

import { SAMPLE_ISSUES } from "@/lib/lab-tools/issue-finder/sample-data"
import type { AnalyzeResponse } from "@/lib/lab-tools/issue-finder/types"
import { LAB_NEON } from "@/lib/lab-tools/registry"

type Props = {
  initialText: string
  onResult: (response: AnalyzeResponse) => void
  onError: (message: string) => void
}

export function IssueInput({ initialText, onResult, onError }: Props) {
  const [text, setText] = useState(initialText)
  const [sourceUrl, setSourceUrl] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/lab-tools/issue-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceUrl: sourceUrl || undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        onError(body.message ?? body.error ?? `解析失敗 (${res.status})`)
        return
      }
      const data = (await res.json()) as AnalyzeResponse
      onResult(data)
    } catch (err) {
      onError(err instanceof Error ? err.message : "予期しないエラー")
    } finally {
      setLoading(false)
    }
  }

  function handleSampleSubmit() {
    onResult({ mode: "sample", issues: SAMPLE_ISSUES })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="mb-2 block text-[10px] font-mono uppercase tracking-widest"
          style={{ color: LAB_NEON.green }}
        >
          // 1次情報テキスト (知恵袋・レビュー・SNS等の貼り付け)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          required
          minLength={20}
          className="w-full border bg-black/60 p-3 font-mono text-sm text-white/90 outline-none focus:bg-black/80"
          style={{ borderColor: `${LAB_NEON.green}40` }}
        />
      </div>

      <div>
        <label
          className="mb-2 block text-[10px] font-mono uppercase tracking-widest"
          style={{ color: LAB_NEON.amber }}
        >
          // ソース URL (任意・Notion 出力に含まれる)
        </label>
        <input
          type="url"
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
          placeholder="https://..."
          className="w-full border bg-black/60 p-2 font-mono text-sm text-white/90 outline-none focus:bg-black/80"
          style={{ borderColor: `${LAB_NEON.amber}40` }}
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={loading}
          className="border-2 px-4 py-2 font-bold uppercase tracking-widest text-sm transition hover:-translate-y-0.5 disabled:opacity-50"
          style={{
            borderColor: LAB_NEON.green,
            color: LAB_NEON.green,
            boxShadow: `0 0 12px ${LAB_NEON.green}40`,
          }}
        >
          {loading ? "解析中..." : "// AI で抽出する"}
        </button>
        <button
          type="button"
          onClick={handleSampleSubmit}
          disabled={loading}
          className="border px-4 py-2 font-mono uppercase tracking-widest text-xs text-white/70 transition hover:text-white disabled:opacity-50"
          style={{ borderColor: `${LAB_NEON.cyan}60` }}
        >
          // サンプル結果を表示
        </button>
      </div>
    </form>
  )
}
