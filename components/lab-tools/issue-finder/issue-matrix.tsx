"use client"

import { useMemo, useState } from "react"
import type { Issue } from "@/lib/lab-tools/issue-finder/types"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import { ISSUE_DRIVEN_TIER_COLOR as TIER_DOT_COLOR } from "@/components/lab-tools/issue-finder/_partials/tier-style"

/** プロットスタイル: 同座標多重を解消するための表現 4 種 */
type PlotMode =
  | "default" // 現状: 重なる → glow 増で密度を表現
  | "jitter" // ±3% ジッター: 全 dot を個別視認可能に
  | "count" // 重なり数を ×N で表示: 倍率定量
  | "bubble" // 同座標 N≥2 はバブル化: 半径 = sqrt(N)

const PLOT_MODE_LABEL: Record<PlotMode, string> = {
  default: "重なり (glow)",
  jitter: "±3% ジッター",
  count: "×N 倍率表示",
  bubble: "バブル化",
}

/**
 * 同座標 (x, y) ごとに dot をグルーピング。 bubble / count モードで使う。
 * key は "x%-y%" の文字列。
 */
function groupPointsByCoord<T extends { x: number; y: number }>(
  points: T[],
): Map<string, T[]> {
  const map = new Map<string, T[]>()
  for (const p of points) {
    const key = `${p.x}-${p.y}`
    const list = map.get(key)
    if (list) list.push(p)
    else map.set(key, [p])
  }
  return map
}

/**
 * 決定的なジッター (issue.id をハッシュ化して ±range% に変換)。
 * 毎回リロードしても同じ値が出るので、 ユーザーが特定の dot を追えるようにする。
 */
function deterministicJitter(seed: string, range: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0
  }
  // [-range, range] の連続値に変換
  return ((hash % 1000) / 1000 - 0.5) * 2 * range
}

/**
 * リスケール後の tier 境界 (x=33.3, y=60) を越えないように clamp。
 * dog-path は matrix から除外したので 3 tier のみ。
 * - promising: 左 0-33.3% (旧 x=40-60)
 * - value-zone: 右上 33.3-100%, y>=60
 * - needs-rework: 右下 33.3-100%, y<60
 */
function clampToTier(
  x: number,
  y: number,
  tier: string | null,
): { x: number; y: number } {
  let cx = Math.max(0, Math.min(100, x))
  let cy = Math.max(0, Math.min(100, y))
  switch (tier) {
    case "value-zone":
      cx = Math.max(cx, 34) // 右側 (新境界)
      cy = Math.max(cy, 61) // 上半
      break
    case "needs-rework":
      cx = Math.max(cx, 34) // 右側
      cy = Math.min(cy, 59) // 下半
      break
    case "promising":
      cx = Math.min(cx, 32) // 左側
      break
  }
  return { x: cx, y: cy }
}

// 『イシューからはじめよ』 (安宅和人) 序章 図 2「バリューのマトリクス」 に準拠。
//   横軸: イシュー度 (essential + hypothesis、 0-100) — 右ほど本質的選択肢 + 深い仮説
//   縦軸: 解の質 (answerable、 0-100) — 上ほど masatoman の手で解ける
//   右上 = バリュー帯 (本書「バリューのある仕事」)
//   それ以外 = 「犬の道」 含む 3 象限 — 量で押しても無駄
//
// issueDrivenValue / issueDrivenTier が無い古い行は、 旧 issueScore × solvabilityScore
// で fallback 描画する (後方互換)。

type Props = {
  issues: Issue[]
  onIssueClick?: (issue: Issue) => void
  /** card 側のフィルタ後の id 一覧。 ここに含まれない issue は半透明で背景描画 */
  visibleIds?: Set<string>
}

type Point = {
  issue: Issue
  /** 0-100 イシュー度 (横軸) */
  x: number
  /** 0-100 解の質 (縦軸) */
  y: number
  /** 本書フレーム採点済か (false なら旧 fallback) */
  hasIssueDriven: boolean
}

export function IssueMatrix({ issues, onIssueClick, visibleIds }: Props) {
  const [plotMode, setPlotMode] = useState<PlotMode>("default")
  // dog-path は matrix から常に除外 (スマホで視認性下がる + そもそも犬の道は本書「量で押すな」 領域)
  const dogPathHiddenCount = useMemo(
    () => issues.filter((i) => i.issueDrivenTier === "dog-path").length,
    [issues],
  )
  // dog-path 領域 (x < 40) を非表示にしたので、 残り x=40-100 (60% 幅) を
  // 0-100 にリスケールして 3 tier (promising / value-zone / needs-rework) で
  // マトリクス全体を使う (スマホ縦長で特に効く)
  const rescaleX = (x: number) => Math.max(0, ((x - 40) / 60) * 100)

  const points: Point[] = useMemo(
    () =>
      issues
        .filter((i) => i.issueDrivenTier !== "dog-path")
        .map((i) => {
          const hasIssueDriven =
            typeof i.essentialChoice === "number" &&
            typeof i.hypothesisDepth === "number" &&
            typeof i.answerable === "number"
          if (hasIssueDriven) {
            const rawX = (i.essentialChoice ?? 0) + (i.hypothesisDepth ?? 0)
            return {
              issue: i,
              x: rescaleX(rawX), // 元 40-100 → 0-100
              y: i.answerable ?? 0,
              hasIssueDriven: true,
            }
          }
          // 旧スコア fallback (本書採点前のレガシー行) — rescale 適用
          return {
            issue: i,
            x: rescaleX(i.issueScore),
            y: i.solvabilityScore,
            hasIssueDriven: false,
          }
        }),
    [issues],
  )

  const valueZoneCount = points.filter(
    (p) => p.issue.issueDrivenTier === "value-zone",
  ).length
  const unscoredCount = points.filter((p) => !p.hasIssueDriven).length
  const scoredCount = points.length - unscoredCount

  return (
    <div className="border border-white/10 bg-black/40 p-4 sm:p-6">
      <div className="mb-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/50 flex-wrap gap-2">
        <span>// matrix: イシュー度 × 解の質 (『イシューからはじめよ』 序章 図 2)</span>
        <span className="flex items-center gap-3 flex-wrap">
          <span style={{ color: LAB_NEON.green }}>
            ● 表示中 {scoredCount} / バリュー {valueZoneCount}
          </span>
          {dogPathHiddenCount > 0 && (
            <span className="text-white/40">
              🐕 犬の道 {dogPathHiddenCount} 件 常時非表示
            </span>
          )}
          {unscoredCount > 0 && (
            <span className="text-white/40">
              ◌ 未採点 {unscoredCount} 件 (点線/白)
            </span>
          )}
          {visibleIds && visibleIds.size < points.length && (
            <span style={{ color: LAB_NEON.amber }}>
              📌 card フィルタ後 {visibleIds.size} 件 (非該当は半透明)
            </span>
          )}
          <label
            className="inline-flex items-center gap-1.5 border bg-black/60 px-2 py-0.5"
            style={{ borderColor: `${LAB_NEON.amber}60`, color: LAB_NEON.amber }}
            title="同座標多重 (重なって輝度が増す) の解消方法を切替"
          >
            <span className="opacity-70">plot:</span>
            <select
              value={plotMode}
              onChange={(e) => setPlotMode(e.target.value as PlotMode)}
              className="bg-transparent text-white outline-none cursor-pointer"
            >
              {(Object.keys(PLOT_MODE_LABEL) as PlotMode[]).map((k) => (
                <option key={k} value={k} className="bg-black text-white">
                  {PLOT_MODE_LABEL[k]}
                </option>
              ))}
            </select>
          </label>
        </span>
      </div>

      <div
        className="relative aspect-[4/3] w-full border border-white/20"
        style={{
          backgroundImage: `linear-gradient(to right, ${LAB_NEON.cyan}10 1px, transparent 1px), linear-gradient(to bottom, ${LAB_NEON.cyan}10 1px, transparent 1px)`,
          backgroundSize: "10% 10%",
        }}
      >
        {/* === 4 象限 背景塗り分け (本書 序章 図 2「バリューのマトリクス」 準拠) ===
            ジッターモード時は dot の位置が ±3% ぶれるので、 境界の塗り分けを大きく弱めて
            「dot が自由に散らばっている」 視覚を優先する */}
        {(() => {
          const bgOpacity = plotMode === "jitter" ? 0.25 : 1
          return (
            <>
              {/* === リスケール後の領域 (元 x=40-100 → 新 0-100) ===
                  promising 旧 x=40-60 (= 新 0-33.3%) は左 1/3
                  value-zone / needs-rework 旧 x=60-100 (= 新 33.3-100%) は右 2/3
                  境界 旧 x=60 → 新 33.33% / 旧 A=60 → そのまま 60% */}
              {/* 左 = promising (旧 40-60 → 新 0-33.3%) */}
              <div
                className="absolute pointer-events-none transition-opacity"
                style={{
                  left: 0,
                  top: 0,
                  width: "33.33%",
                  height: "100%",
                  background: `linear-gradient(to right, ${LAB_NEON.amber}20 0%, ${LAB_NEON.amber}10 100%)`,
                  borderRight: `1px dashed ${LAB_NEON.amber}50`,
                  opacity: bgOpacity,
                }}
              />
              {/* 右上 = value-zone (新 33.3-100%, A 60-100%) */}
              <div
                className="absolute pointer-events-none transition-opacity"
                style={{
                  right: 0,
                  top: 0,
                  width: "66.67%",
                  height: "40%",
                  background: `linear-gradient(135deg, ${LAB_NEON.green}30 0%, ${LAB_NEON.green}15 100%)`,
                  borderBottom: `1px dashed ${LAB_NEON.green}80`,
                  opacity: bgOpacity,
                }}
              />
              {/* 右下 = needs-rework (新 33.3-100%, A 0-60%) */}
              <div
                className="absolute pointer-events-none transition-opacity"
                style={{
                  right: 0,
                  bottom: 0,
                  width: "66.67%",
                  height: "60%",
                  background: `linear-gradient(225deg, ${LAB_NEON.cyan}20 0%, ${LAB_NEON.cyan}08 100%)`,
                  opacity: bgOpacity,
                }}
              />
              {/* dog-path は matrix から常時除外 */}
              {/* ジッターモード時の通知 (境界破線は薄く、 ヒント文字で代替) */}
              {plotMode === "jitter" && (
                <div
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  style={{ opacity: 0.15 }}
                >
                  <span
                    className="font-mono uppercase tracking-widest"
                    style={{ color: LAB_NEON.amber, fontSize: "14px" }}
                  >
                    JITTER MODE — 境界 ±3% で揺らぎ表示中
                  </span>
                </div>
              )}
              {/* 境界線そのものは ジッタモードでも残す (薄く) = 3 象限が一目分かる */}
              {plotMode === "jitter" && (
                <>
                  {/* 新 x=33.3% = promising vs value-zone/needs-rework 境界 */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: "33.33%",
                      top: 0,
                      width: "1px",
                      height: "100%",
                      background: `${LAB_NEON.amber}40`,
                    }}
                  />
                  {/* y=60% = value-zone vs needs-rework 境界 */}
                  <div
                    className="absolute pointer-events-none"
                    style={{
                      left: "33.33%",
                      bottom: "60%",
                      width: "66.67%",
                      height: "1px",
                      background: `${LAB_NEON.green}30`,
                    }}
                  />
                </>
              )}
            </>
          )
        })()}

        {/* === 象限ラベル (リスケール後の新座標に合わせる) === */}

        {/* 左 (新 0-33.3%) = promising 上端ラベル */}
        <span
          className="absolute left-2 top-2 font-mono text-[10px] uppercase tracking-widest font-bold"
          style={{
            color: LAB_NEON.amber,
            textShadow: `0 0 4px ${LAB_NEON.amber}80`,
          }}
        >
          🟡 PROMISING
        </span>

        {/* 右上 (新 33.3-100%, 上半) — value-zone */}
        <span
          className="absolute right-2 top-2 font-mono text-[10px] uppercase tracking-widest font-bold"
          style={{
            color: LAB_NEON.green,
            textShadow: `0 0 6px ${LAB_NEON.green}90`,
          }}
        >
          🟢 VALUE ZONE
        </span>

        {/* 右下 — needs-rework */}
        <span
          className="absolute right-2 bottom-2 font-mono text-[10px] uppercase tracking-widest font-bold"
          style={{ color: LAB_NEON.cyan, textShadow: `0 0 4px ${LAB_NEON.cyan}80` }}
        >
          🔶 NEEDS-REWORK
        </span>

        {/* dog-path 領域は常時非表示 */}

        {/* プロット点 — plotMode で表現方式を切替 */}
        {(() => {
          // 採点済を後に描画して上に乗せる
          const ordered = [...points].sort(
            (a, b) => (a.hasIssueDriven ? 1 : 0) - (b.hasIssueDriven ? 1 : 0),
          )

          // bubble モード時は同座標グルーピング
          const groups =
            plotMode === "bubble" || plotMode === "count"
              ? groupPointsByCoord(ordered)
              : null

          // bubble モードでは「同座標 N>=2 はバブル 1 個だけ描画」 し、 個別 dot は描かない
          if (plotMode === "bubble" && groups) {
            const bubbles: Array<{
              key: string
              x: number
              y: number
              members: typeof ordered
            }> = []
            for (const [key, list] of groups.entries()) {
              bubbles.push({ key, x: list[0].x, y: list[0].y, members: list })
            }
            return bubbles.map(({ key, x, y, members }) => {
              // 代表 tier: value-zone > needs-rework > promising > dog-path > 未採点
              const TIER_RANK = {
                "value-zone": 4,
                "needs-rework": 3,
                promising: 2,
                "dog-path": 1,
              } as const
              const rep = members.reduce((best, m) => {
                const bt = best.issue.issueDrivenTier
                const mt = m.issue.issueDrivenTier
                const bRank = bt ? TIER_RANK[bt] : 0
                const mRank = mt ? TIER_RANK[mt] : 0
                return mRank > bRank ? m : best
              }, members[0])
              const tier = rep.issue.issueDrivenTier ?? null
              const color = tier ? TIER_DOT_COLOR[tier] : "#ffffff"
              const n = members.length
              // バブル半径: sqrt(n) で面積比例
              const baseSize = 14
              const size = baseSize + Math.sqrt(n) * 6
              const isValueZone = tier === "value-zone"
              const allHidden =
                visibleIds && members.every((m) => !visibleIds.has(m.issue.id))
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onIssueClick?.(rep.issue)}
                  className="group absolute -translate-x-1/2 translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${x}%`,
                    bottom: `${y}%`,
                    zIndex: isValueZone ? 30 : 20 + n,
                    opacity: allHidden ? 0.18 : 1,
                  }}
                  title={`${n} 件重なり @ (degree=${x}, A=${y})\n${members.map((m, i) => `${i + 1}. ${m.issue.title}`).join("\n")}`}
                >
                  <span
                    className="block border-2 rounded-full flex items-center justify-center"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      borderColor: color,
                      background: `${color}50`,
                      boxShadow: `0 0 ${isValueZone ? "16px" : "10px"} ${color}90`,
                    }}
                  >
                    {n > 1 && (
                      <span
                        className="font-mono text-[10px] font-bold"
                        style={{ color: "#000" }}
                      >
                        {n}
                      </span>
                    )}
                  </span>
                </button>
              )
            })
          }

          // それ以外 (default / jitter / count) は個別 dot を描画
          return ordered.map(({ issue, x, y, hasIssueDriven }, idx) => {
            const tier = issue.issueDrivenTier ?? null
            // jitter モード: ±3% の決定的オフセット → tier 境界を越えないよう clamp
            let plotX = x
            let plotY = y
            if (plotMode === "jitter") {
              const jx = deterministicJitter(issue.id, 3)
              const jy = deterministicJitter(issue.id + "_y", 3)
              const clamped = clampToTier(x + jx, y + jy, tier)
              plotX = clamped.x
              plotY = clamped.y
            }
            const left = `${plotX}%`
            const bottom = `${plotY}%`
            const color = hasIssueDriven
              ? tier
                ? TIER_DOT_COLOR[tier]
                : LAB_NEON.cyan
              : "#ffffff"
            const isValueZone = tier === "value-zone"
            const size = isValueZone ? 5 : hasIssueDriven ? 4 : 2.5

            // count モード: 同座標重なり数を取得
            const coordKey = `${x}-${y}`
            const overlapCount = groups?.get(coordKey)?.length ?? 1

            return (
              <button
                key={issue.id}
                type="button"
                onClick={() => onIssueClick?.(issue)}
                className="group absolute -translate-x-1/2 translate-y-1/2 cursor-pointer"
                style={{
                  left,
                  bottom,
                  zIndex: hasIssueDriven ? (isValueZone ? 30 : 20) : 10,
                  opacity:
                    visibleIds && !visibleIds.has(issue.id)
                      ? 0.18
                      : hasIssueDriven
                        ? 1
                        : 0.35,
                }}
                aria-label={issue.title}
                title={
                  hasIssueDriven
                    ? `[本書] ${tier ?? "-"} value=${issue.issueDrivenValue ?? "-"} (E${issue.essentialChoice}+H${issue.hypothesisDepth}, A${issue.answerable})\n${issue.title}`
                    : `[未採点] issue=${issue.issueScore} solv=${issue.solvabilityScore} (旧スコアで仮プロット)\n${issue.title}`
                }
              >
                <span
                  className="block border-2"
                  style={{
                    width: `${size * 4}px`,
                    height: `${size * 4}px`,
                    borderColor: color,
                    background: hasIssueDriven ? `${color}80` : "transparent",
                    boxShadow: hasIssueDriven
                      ? `0 0 ${isValueZone ? "14px" : "8px"} ${color}90`
                      : "none",
                    borderStyle: hasIssueDriven ? "solid" : "dotted",
                  }}
                />
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap font-mono text-[10px] text-white/70 group-hover:text-white"
                  style={{ color: hasIssueDriven ? color : "rgba(255,255,255,0.5)" }}
                >
                  #{idx + 1}
                  {plotMode === "count" && overlapCount > 1 && (
                    <span
                      className="ml-1"
                      style={{ color: LAB_NEON.amber, fontWeight: "bold" }}
                    >
                      ×{overlapCount}
                    </span>
                  )}
                </span>
              </button>
            )
          })
        })()}
      </div>

      <div className="mt-3 flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-white/40">
        <span>← 磨けば候補</span>
        <span>イシュー度 (E+H ≥ 40)</span>
        <span>本質的 →</span>
      </div>
      <div className="mt-1 text-[10px] font-mono uppercase tracking-widest text-white/40">
        縦軸 = 解の質 (A、 上ほど masatoman 1 人で 6 ヶ月で解ける) / 犬の道 (E+H&lt;40) は除外
      </div>
    </div>
  )
}
