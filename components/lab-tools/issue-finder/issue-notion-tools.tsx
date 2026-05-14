"use client"

import { useState } from "react"
import type { Issue } from "@/lib/lab-tools/issue-finder/types"
import {
  issuesToNotionMarkdown,
  issueToNotionMarkdown,
} from "@/lib/lab-tools/issue-finder/notion-markdown"
import { LAB_NEON } from "@/lib/lab-tools/registry"

type Props = {
  issues: Issue[]
}

export function IssueNotionTools({ issues }: Props) {
  const [status, setStatus] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  async function copyAll() {
    const md = issuesToNotionMarkdown(issues)
    await navigator.clipboard.writeText(md)
    setStatus(`${issues.length} 件をまとめて Markdown コピー (Notion にそのまま貼り付け可)`)
    setPreview(md)
  }

  async function copyTopOnly() {
    const top = [...issues].sort((a, b) => b.issueScore - a.issueScore).slice(0, 3)
    const md = top.map(issueToNotionMarkdown).join("\n\n---\n\n")
    await navigator.clipboard.writeText(md)
    setStatus(`イシュー度 TOP 3 を Markdown コピー (ブログ下書き用)`)
    setPreview(md)
  }

  return (
    <div
      className="border bg-black/30 p-4"
      style={{ borderColor: `${LAB_NEON.amber}40` }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: LAB_NEON.amber }}
        >
          // notion へ貼り付け (自分用ナレッジ)
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={copyAll}
          disabled={issues.length === 0}
          className="border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-white/80 transition hover:text-white disabled:opacity-40"
          style={{ borderColor: `${LAB_NEON.amber}80` }}
        >
          ⧉ 全 {issues.length} 件を Markdown コピー
        </button>
        <button
          type="button"
          onClick={copyTopOnly}
          disabled={issues.length === 0}
          className="border px-3 py-1.5 font-mono text-xs uppercase tracking-widest text-white/80 transition hover:text-white disabled:opacity-40"
          style={{ borderColor: `${LAB_NEON.green}80`, color: LAB_NEON.green }}
        >
          ⧉ TOP 3 だけ (ブログ下書き用)
        </button>
      </div>
      {status && (
        <p className="mt-3 font-mono text-[10px] text-white/60">// {status}</p>
      )}
      {preview && (
        <details className="mt-3">
          <summary className="cursor-pointer font-mono text-[10px] text-white/40 hover:text-white/70">
            // preview
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto border border-white/10 bg-black/60 p-3 font-mono text-[10px] text-white/70">
            {preview}
          </pre>
        </details>
      )}
    </div>
  )
}
