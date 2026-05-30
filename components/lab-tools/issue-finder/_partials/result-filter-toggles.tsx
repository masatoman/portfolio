"use client"

// 結果フィルタ 5 種のトグル button。 共通 `FilterToggle` で内部実装を統一し、
// 旧 issue-finder-shell.tsx の重複コードを集約。

import { LAB_NEON } from "@/lib/lab-tools/registry"

type ColorScheme = {
  on: string
  offBorder: string
  offBg: string
  glow?: boolean
}

const TOGGLE_COLORS = {
  cyan: { on: LAB_NEON.cyan, offBorder: `${LAB_NEON.cyan}40`, offBg: `${LAB_NEON.cyan}20` },
  green: {
    on: LAB_NEON.green,
    offBorder: `${LAB_NEON.green}50`,
    offBg: `${LAB_NEON.green}25`,
    glow: true,
  },
  grey: { on: "#888", offBorder: "#88888840", offBg: "#88888820" },
  white: { on: "#aaa", offBorder: "#aaaaaa40", offBg: "#aaaaaa15" },
} as const

function FilterToggle({
  scheme,
  active,
  label,
  title,
  onToggle,
}: {
  scheme: ColorScheme
  active: boolean
  label: string
  title: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={title}
      className="border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition"
      style={{
        borderColor: active ? scheme.on : scheme.offBorder,
        color: active ? scheme.on : "rgba(255,255,255,0.55)",
        backgroundColor: active ? scheme.offBg : "transparent",
        boxShadow: scheme.glow && active ? `0 0 8px ${scheme.on}60` : "none",
      }}
    >
      {label}
    </button>
  )
}

export function HideSubsidyToggle({
  hidden,
  count,
  onToggle,
}: {
  hidden: boolean
  count: number
  onToggle: () => void
}) {
  return (
    <FilterToggle
      scheme={TOGGLE_COLORS.cyan}
      active={hidden}
      label={`💴 ${hidden ? `補助金 ${count} 件 非表示中` : `補助金系を隠す (${count})`}`}
      title={
        hidden
          ? "補助金系 (it-subsidy profile) を表示する"
          : "補助金系 (it-subsidy profile) を非表示にする"
      }
      onToggle={onToggle}
    />
  )
}

/** 本書フレーム: バリュー帯のみ表示 (序章 図 2「バリューのマトリクス」 右上のみ) */
export function OnlyValueZoneToggle({
  active,
  count,
  onToggle,
}: {
  active: boolean
  count: number
  onToggle: () => void
}) {
  return (
    <FilterToggle
      scheme={TOGGLE_COLORS.green}
      active={active}
      label={`🟢 ${active ? `バリュー帯のみ ${count} 件` : `バリュー帯のみ (${count})`}`}
      title={
        active
          ? "バリュー帯フィルタ解除 (全 tier 表示)"
          : "バリュー帯 (右上象限) のみ表示 — 本書「バリューのある仕事」"
      }
      onToggle={onToggle}
    />
  )
}

/** 本書フレーム: 犬の道を隠す (序章 図 4)。 デフォルト ON で本書精神を強制 */
export function HideDogPathToggle({
  hidden,
  count,
  onToggle,
}: {
  hidden: boolean
  count: number
  onToggle: () => void
}) {
  return (
    <FilterToggle
      scheme={TOGGLE_COLORS.grey}
      active={hidden}
      label={`🐕 ${hidden ? `犬の道 ${count} 件 非表示中` : `犬の道を隠す (${count})`}`}
      title={
        hidden
          ? "犬の道 (issueDegree < 40) を再表示する"
          : "犬の道 (本質的選択肢度低 = 解いても方向性変わらない) を非表示"
      }
      onToggle={onToggle}
    />
  )
}

/** 本書フレーム: 未採点 (3 軸 null = 旧データ) を隠す。 デフォルト ON */
export function HideUnscoredToggle({
  hidden,
  count,
  onToggle,
}: {
  hidden: boolean
  count: number
  onToggle: () => void
}) {
  return (
    <FilterToggle
      scheme={TOGGLE_COLORS.white}
      active={hidden}
      label={`◌ ${hidden ? `未採点 ${count} 件 非表示中` : `未採点を隠す (${count})`}`}
      title={
        hidden
          ? "未採点 (本書 3 軸 null = 旧データ) を再表示"
          : "未採点 (本書 3 軸が null の旧データ) を非表示にする"
      }
      onToggle={onToggle}
    />
  )
}

/** 本書フレーム: needs-rework (本質だが今は無理) を隠す */
export function HideNeedsReworkToggle({
  hidden,
  count,
  onToggle,
}: {
  hidden: boolean
  count: number
  onToggle: () => void
}) {
  return (
    <FilterToggle
      scheme={TOGGLE_COLORS.cyan}
      active={hidden}
      label={`🔶 ${hidden ? `needs-rework ${count} 件 非表示中` : `needs-rework を隠す (${count})`}`}
      title={
        hidden
          ? "needs-rework (本質だが今は無理) を再表示"
          : "needs-rework (本質的だが answerable 不足) を非表示 — 今期着手しない場合"
      }
      onToggle={onToggle}
    />
  )
}
