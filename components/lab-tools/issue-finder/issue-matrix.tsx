"use client"

import { useMemo } from "react"
import type { Issue } from "@/lib/lab-tools/issue-finder/types"
import { LAB_NEON } from "@/lib/lab-tools/registry"

// 『イシューからはじめよ』の 2x2 マトリクス
//   横軸: 解の質 (Solvability)  →右に行くほど解きやすい
//   縦軸: イシュー度 (Issue Impact) →上に行くほどインパクト大
//   右上 = やるべきイシュー (true issue)

type Props = {
  issues: Issue[]
  onIssueClick?: (issue: Issue) => void
}

export function IssueMatrix({ issues, onIssueClick }: Props) {
  const points = useMemo(
    () =>
      issues.map((i) => ({
        issue: i,
        x: i.solvabilityScore, // 0-100
        y: i.issueScore, // 0-100
      })),
    [issues],
  )

  return (
    <div className="border border-white/10 bg-black/40 p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/50">
        <span>// matrix: 解の質 × イシュー度</span>
        <span style={{ color: LAB_NEON.green }}>● 右上 = 真のイシュー</span>
      </div>

      <div
        className="relative aspect-[4/3] w-full border border-white/15"
        style={{
          backgroundImage: `linear-gradient(to right, ${LAB_NEON.cyan}10 1px, transparent 1px), linear-gradient(to bottom, ${LAB_NEON.cyan}10 1px, transparent 1px)`,
          backgroundSize: "10% 10%",
        }}
      >
        {/* 真のイシュー象限 (右上) を半透明グリーンで強調 */}
        <div
          className="absolute right-0 top-0 w-1/2 h-1/2 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at top right, ${LAB_NEON.green}25 0%, ${LAB_NEON.green}10 50%, transparent 100%)`,
          }}
        />

        {/* 中央十字線 */}
        <div className="absolute left-1/2 top-0 h-full w-px bg-white/20" />
        <div className="absolute left-0 top-1/2 h-px w-full bg-white/20" />

        {/* 象限ラベル */}
        <span
          className="absolute right-2 top-2 font-mono text-[10px] uppercase tracking-widest font-bold"
          style={{
            color: LAB_NEON.green,
            textShadow: `0 0 6px ${LAB_NEON.green}80`,
          }}
        >
          🎯 true issue
        </span>
        <span className="absolute left-2 top-2 font-mono text-[10px] uppercase tracking-widest text-white/30">
          📝 impact only (記事ネタ)
        </span>
        <span className="absolute right-2 bottom-2 font-mono text-[10px] uppercase tracking-widest text-white/30">
          💡 easy but small
        </span>
        <span className="absolute left-2 bottom-2 font-mono text-[10px] uppercase tracking-widest text-white/30">
          ⚫ ignore
        </span>

        {/* プロット点 */}
        {points.map(({ issue, x, y }, idx) => {
          const left = `${x}%`
          const bottom = `${y}%`
          const isTrueIssue = x >= 50 && y >= 50
          const color = isTrueIssue ? LAB_NEON.green : LAB_NEON.cyan
          return (
            <button
              key={issue.id}
              type="button"
              onClick={() => onIssueClick?.(issue)}
              className="group absolute -translate-x-1/2 translate-y-1/2 cursor-pointer"
              style={{ left, bottom }}
              aria-label={issue.title}
            >
              <span
                className="block h-3 w-3 border-2"
                style={{
                  borderColor: color,
                  background: `${color}50`,
                  boxShadow: `0 0 8px ${color}80`,
                }}
              />
              <span
                className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] text-white/70 group-hover:text-white"
                style={{ color }}
              >
                #{idx + 1}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
        <span>← 解きにくい</span>
        <span>解の質 →</span>
        <span>解きやすい →</span>
      </div>
      <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-white/40">
        縦軸 = イシュー度 (上ほどインパクト大)
      </div>
    </div>
  )
}
