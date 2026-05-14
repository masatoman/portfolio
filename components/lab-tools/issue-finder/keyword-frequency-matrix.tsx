"use client"

import { useMemo, useState } from "react"
import { analyzeFrequency, type KeywordHit } from "@/lib/lab-tools/issue-finder/keyword-frequency"
import {
  expandQueries,
  getPerspectiveForDate,
  getQueriesFile,
} from "@/lib/lab-tools/issue-finder/queries"
import type { Issue } from "@/lib/lab-tools/issue-finder/types"
import { LAB_NEON } from "@/lib/lab-tools/registry"

type Props = {
  issues: Issue[]
}

export function KeywordFrequencyMatrix({ issues }: Props) {
  const file = getQueriesFile()
  const today = useMemo(() => new Date(), [])
  const todayInfo = useMemo(() => getPerspectiveForDate(today), [today])

  // 表示モード: today (今日の perspective だけ) / all-active (全 perspective マージ)
  const [mode, setMode] = useState<"today" | "all-active">("today")

  const tracked = useMemo(() => {
    if (mode === "today") {
      return {
        keywords: todayInfo.query.keywordsToTrack,
        tools: todayInfo.query.watchedTools,
      }
    }
    // 全 perspective の keywordsToTrack / watchedTools を de-dup マージ
    const allQueries = expandQueries()
    const keywordSet = new Set<string>()
    const toolMap = new Map<string, { name: string; aliases: string[] }>()
    for (const q of allQueries) {
      for (const k of q.keywordsToTrack) keywordSet.add(k)
      for (const t of q.watchedTools) {
        const existing = toolMap.get(t.name)
        if (existing) {
          existing.aliases = Array.from(
            new Set([...existing.aliases, ...(t.aliases ?? [])]),
          )
        } else {
          toolMap.set(t.name, { name: t.name, aliases: [...(t.aliases ?? [])] })
        }
      }
    }
    return {
      keywords: Array.from(keywordSet),
      tools: Array.from(toolMap.values()),
    }
  }, [mode, todayInfo])

  const hits: KeywordHit[] = useMemo(
    () =>
      analyzeFrequency({
        issues,
        trackedKeywords: tracked.keywords,
        watchedTools: tracked.tools,
      }),
    [issues, tracked],
  )

  const top = hits.slice(0, file.schedule.topKeywordsToShow)
  const maxClusters = top[0]?.clustersHit ?? 1

  return (
    <div className="space-y-4">
      <div
        className="border bg-black/30 p-4 flex items-center justify-between flex-wrap gap-3"
        style={{ borderColor: `${LAB_NEON.cyan}40` }}
      >
        <div>
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-1"
            style={{ color: LAB_NEON.cyan }}
          >
            // tracked vocabulary
          </p>
          <p className="text-sm font-bold">
            {tracked.keywords.length} フレーズ ／ {tracked.tools.length} 既存ツール
          </p>
          <p className="text-[11px] font-mono text-white/50 mt-1">
            出現クラスタ数の多い順 ／ 上位 {file.schedule.topKeywordsToShow} 件
          </p>
        </div>
        <ModeSwitch mode={mode} setMode={setMode} todayLabel={todayInfo.query.role} />
      </div>

      {top.length === 0 ? (
        <p className="text-xs font-mono text-white/40 p-4 border border-white/10">
          // ヒットなし。 keywordsToTrack を充実させてください。
        </p>
      ) : (
        <ul className="space-y-2">
          {top.map((hit) => (
            <KeywordRow key={`${hit.kind}:${hit.keyword}`} hit={hit} maxClusters={maxClusters} totalIssues={issues.length} />
          ))}
        </ul>
      )}
    </div>
  )
}

function ModeSwitch({
  mode,
  setMode,
  todayLabel,
}: {
  mode: "today" | "all-active"
  setMode: (m: "today" | "all-active") => void
  todayLabel: string
}) {
  const buttonClass = (active: boolean) =>
    `border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition ${
      active
        ? "bg-white/10 text-white"
        : "text-white/50 hover:text-white"
    }`
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => setMode("today")}
        className={buttonClass(mode === "today")}
        style={{
          borderColor:
            mode === "today" ? LAB_NEON.green : `${LAB_NEON.green}40`,
        }}
      >
        // today / {todayLabel}
      </button>
      <button
        type="button"
        onClick={() => setMode("all-active")}
        className={buttonClass(mode === "all-active")}
        style={{
          borderColor:
            mode === "all-active" ? LAB_NEON.cyan : `${LAB_NEON.cyan}40`,
        }}
      >
        // all
      </button>
    </div>
  )
}

function KeywordRow({
  hit,
  maxClusters,
  totalIssues,
}: {
  hit: KeywordHit
  maxClusters: number
  totalIssues: number
}) {
  const [open, setOpen] = useState(false)
  const widthPercent =
    maxClusters > 0 ? (hit.clustersHit / maxClusters) * 100 : 0
  const color = hit.kind === "tool" ? LAB_NEON.magenta : LAB_NEON.cyan
  const kindLabel = hit.kind === "tool" ? "TOOL" : ""

  return (
    <li
      className="border bg-black/40"
      style={{ borderColor: `${color}30` }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition"
      >
        <div className="shrink-0 w-32 flex items-center gap-2">
          {hit.kind === "tool" && (
            <span
              className="font-mono text-[8px] uppercase tracking-widest border px-1"
              style={{ borderColor: `${color}80`, color }}
            >
              {kindLabel}
            </span>
          )}
          <span
            className="font-mono text-sm font-bold truncate"
            style={{ color }}
          >
            {hit.keyword}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="h-1.5 w-full bg-white/10 overflow-hidden">
            <div
              className="h-full"
              style={{
                width: `${widthPercent}%`,
                background: `linear-gradient(90deg, ${color}, ${color}aa)`,
              }}
            />
          </div>
        </div>
        <div className="shrink-0 text-right font-mono text-[10px] tracking-widest text-white/70">
          <span className="text-white font-bold">{hit.clustersHit}</span>
          <span className="text-white/40"> / {totalIssues} ｸﾗｽﾀ</span>
          <span className="ml-2 text-white/50">{hit.totalHits} 回</span>
        </div>
        <span className="shrink-0 font-mono text-[10px] text-white/40 w-4 text-right">
          {open ? "▾" : "▸"}
        </span>
      </button>
      {open && (
        <div
          className="border-t px-4 py-3 space-y-1 font-mono text-[11px]"
          style={{ borderColor: `${color}20` }}
        >
          {hit.perCluster.map((pc) => (
            <div
              key={pc.issueId}
              className="flex items-start gap-3 text-white/70"
            >
              <span className="shrink-0 w-8 text-right" style={{ color }}>
                ×{pc.hits}
              </span>
              <span className="flex-1 truncate">{pc.issueTitle}</span>
            </div>
          ))}
        </div>
      )}
    </li>
  )
}
