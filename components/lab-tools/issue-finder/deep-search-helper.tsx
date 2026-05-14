"use client"

import { useMemo, useState } from "react"
import { buildDeepSearchPrompt } from "@/lib/lab-tools/issue-finder/deep-search-prompt"
import {
  expandQueries,
  getPerspectiveForDate,
  type ExpandedQuery,
} from "@/lib/lab-tools/issue-finder/queries"
import { LAB_NEON } from "@/lib/lab-tools/registry"

const DEEP_SEARCH_LINKS = [
  {
    name: "ChatGPT",
    url: "https://chat.openai.com/",
    note: "Deep Research (Plus / Team / Pro)",
  },
  {
    name: "Claude",
    url: "https://claude.ai/",
    note: "Research (Max plan)",
  },
  {
    name: "Perplexity",
    url: "https://www.perplexity.ai/",
    note: "Deep Research (無料枠あり)",
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com/",
    note: "Deep Research (Advanced)",
  },
]

export function DeepSearchHelper() {
  const today = useMemo(() => new Date(), [])
  const todayInfo = useMemo(() => getPerspectiveForDate(today), [today])
  const allQueries = useMemo(() => expandQueries(), [])

  const [selectedRole, setSelectedRole] = useState<string>(
    `${todayInfo.query.profileId}::${todayInfo.query.role}`,
  )
  const [targetCount, setTargetCount] = useState<number>(100)

  const selectedQuery: ExpandedQuery = useMemo(() => {
    const found = allQueries.find(
      (q) => `${q.profileId}::${q.role}` === selectedRole,
    )
    return found ?? todayInfo.query
  }, [selectedRole, allQueries, todayInfo])

  const prompt = useMemo(
    () => buildDeepSearchPrompt({ query: selectedQuery, targetCount }),
    [selectedQuery, targetCount],
  )

  const [copyStatus, setCopyStatus] = useState<string | null>(null)

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt)
    setCopyStatus("コピーしました — Deep Research に貼って実行 → 結果を下の入力エリアに貼り戻し")
  }

  return (
    <div className="space-y-4">
      <div
        className="border bg-black/30 p-4"
        style={{ borderColor: `${LAB_NEON.amber}40` }}
      >
        <div className="grid gap-3 md:grid-cols-3 mb-4">
          <div className="md:col-span-2">
            <label
              className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: LAB_NEON.amber }}
            >
              // perspective を選ぶ
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
              style={{ borderColor: `${LAB_NEON.amber}40` }}
            >
              {allQueries.map((q) => {
                const value = `${q.profileId}::${q.role}`
                const isToday =
                  q.profileId === todayInfo.query.profileId &&
                  q.role === todayInfo.query.role
                return (
                  <option key={value} value={value}>
                    {isToday ? "[今日] " : ""}
                    {q.profileName} → {q.role}
                  </option>
                )
              })}
            </select>
          </div>
          <div>
            <label
              className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: LAB_NEON.amber }}
            >
              // 目標件数
            </label>
            <input
              type="number"
              min={20}
              max={500}
              step={10}
              value={targetCount}
              onChange={(e) => {
                const n = Number.parseInt(e.target.value, 10)
                if (Number.isFinite(n)) setTargetCount(n)
              }}
              className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
              style={{ borderColor: `${LAB_NEON.amber}40` }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <button
            type="button"
            onClick={copyPrompt}
            className="border-2 px-4 py-2 font-bold uppercase tracking-widest text-sm transition hover:-translate-y-0.5"
            style={{
              borderColor: LAB_NEON.amber,
              color: LAB_NEON.amber,
              boxShadow: `0 0 12px ${LAB_NEON.amber}40`,
            }}
          >
            ⧉ Deep Search プロンプトをコピー
          </button>
          {DEEP_SEARCH_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border px-3 py-2 font-mono text-xs uppercase tracking-widest text-white/70 transition hover:text-white"
              style={{ borderColor: `${LAB_NEON.cyan}60` }}
              title={link.note}
            >
              ↗ {link.name}
            </a>
          ))}
        </div>

        {copyStatus && (
          <p
            className="font-mono text-[10px]"
            style={{ color: LAB_NEON.green }}
          >
            // {copyStatus}
          </p>
        )}

        <details className="mt-3">
          <summary
            className="cursor-pointer font-mono text-[10px] uppercase tracking-widest hover:text-white"
            style={{ color: LAB_NEON.cyan }}
          >
            // プロンプトプレビュー ({prompt.length} 文字)
          </summary>
          <pre className="mt-2 max-h-64 overflow-auto border border-white/10 bg-black/60 p-3 font-mono text-[10px] text-white/70 whitespace-pre-wrap">
            {prompt}
          </pre>
        </details>
      </div>

      <ol className="space-y-2 font-mono text-[11px] text-white/60 leading-relaxed pl-5 list-decimal">
        <li>
          上のボタンで perspective に応じたプロンプトをコピー
        </li>
        <li>
          ChatGPT / Claude / Perplexity / Gemini の Deep Research 系ボタンを ON にして貼り付け → 実行
        </li>
        <li>
          返ってきた 1 次情報リストをそのまま下の{" "}
          <span style={{ color: LAB_NEON.green }}>// 02 / input</span>{" "}
          のテキストエリアに貼り付け
        </li>
        <li>
          「AI で抽出する」を押すと、 issue-finder がクラスタリング & スコア化
        </li>
      </ol>
    </div>
  )
}
