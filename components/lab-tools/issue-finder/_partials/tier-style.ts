// 本書 (安宅和人『イシューからはじめよ』) フレームの tier に対する
// 色 / アイコン / ラベル を 1 ヶ所に集約。
// 旧 issueScore tier (critical/high/medium/low) と区別するため命名を分ける。

import type { IssueDrivenTier } from "@/lib/lab-tools/issue-finder/types"
import { LAB_NEON } from "@/lib/lab-tools/registry"

/** 本書フレーム tier の色 (序章 図 2 / 図 4 準拠) */
export const ISSUE_DRIVEN_TIER_COLOR: Record<IssueDrivenTier, string> = {
  "value-zone": LAB_NEON.green, // 🟢 右上象限 = バリュー帯
  promising: LAB_NEON.amber, // 🟡 磨けば候補
  "needs-rework": LAB_NEON.cyan, // 🔶 本質だが今は無理
  "dog-path": "#666", // ⚪ 犬の道
}

/** 旧 issueScore tier (critical/high/medium/low) の色 — レガシー用 */
export const LEGACY_TIER_COLOR = {
  critical: "#ff3838",
  high: "#ff8c00",
  medium: LAB_NEON.amber,
  low: "#666",
} as const

export const LEGACY_TIER_ICON = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "⚪",
} as const

/** Profile (queries.json profileId) の色 / アイコン / 表示名 — IssueCard で使用 */
export const PROFILE_LABEL: Record<string, string> = {
  komuten: "工務店",
  "micro-corp": "マイクロ法人",
  "it-subsidy": "IT補助金",
  "financial-planner": "FP",
}

export const PROFILE_COLOR: Record<string, string> = {
  komuten: LAB_NEON.green,
  "micro-corp": LAB_NEON.amber,
  "it-subsidy": LAB_NEON.cyan,
  "financial-planner": LAB_NEON.magenta,
}

export const PROFILE_ICON: Record<string, string> = {
  komuten: "🏗️",
  "micro-corp": "🏢",
  "it-subsidy": "💴",
  "financial-planner": "💼",
}
