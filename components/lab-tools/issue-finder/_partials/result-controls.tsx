"use client"

// 結果セクション右上の操作群: sort dropdown + tab 切り替え。

import { SORT_LABEL, type SortKey } from "@/lib/lab-tools/issue-finder/scoring"
import { LAB_NEON } from "@/lib/lab-tools/registry"

export type ResultsTab = "results" | "keywords"

const SORT_ORDER: readonly SortKey[] = [
  "issueDriven",
  "opportunity",
  "trueIssueFirst",
  "issue",
  "clusterRatio",
  "createdAt",
]

export function SortSelect({
  sortKey,
  setSortKey,
}: {
  sortKey: SortKey
  setSortKey: (k: SortKey) => void
}) {
  return (
    <label
      className="inline-flex items-center gap-1.5 border bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
      style={{ borderColor: `${LAB_NEON.amber}60`, color: LAB_NEON.amber }}
    >
      <span className="opacity-70">sort:</span>
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as SortKey)}
        className="bg-transparent text-white outline-none cursor-pointer"
      >
        {SORT_ORDER.map((k) => (
          <option key={k} value={k} className="bg-black text-white">
            {SORT_LABEL[k]}
          </option>
        ))}
      </select>
    </label>
  )
}

const TAB_ITEMS: ReadonlyArray<{ key: ResultsTab; label: string; color: string }> = [
  { key: "results", label: "matrix + cards", color: LAB_NEON.cyan },
  { key: "keywords", label: "keywords", color: LAB_NEON.green },
]

export function ResultsTabSwitch({
  tab,
  setTab,
}: {
  tab: ResultsTab
  setTab: (t: ResultsTab) => void
}) {
  return (
    <div className="flex gap-1.5">
      {TAB_ITEMS.map((it) => {
        const active = it.key === tab
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => setTab(it.key)}
            className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition ${
              active
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white"
            }`}
            style={{ borderColor: active ? it.color : `${it.color}40` }}
          >
            // {it.label}
          </button>
        )
      })}
    </div>
  )
}
