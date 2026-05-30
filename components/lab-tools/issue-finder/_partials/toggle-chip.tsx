"use client"

import { LAB_NEON } from "@/lib/lab-tools/registry"

// 多様性オプション / フィルタトグル等で使う 1 行 chip。
// active=true で枠 + 背景が neon-green に変わる。
export function ToggleChip({
  label,
  active,
  onToggle,
  title,
}: {
  label: string
  active: boolean
  onToggle: () => void
  title?: string
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      title={title}
      className="border px-2 py-1 font-mono text-[10px] uppercase tracking-widest transition"
      style={{
        borderColor: active ? LAB_NEON.green : `${LAB_NEON.green}30`,
        color: active ? LAB_NEON.green : "rgba(255,255,255,0.55)",
        backgroundColor: active ? `${LAB_NEON.green}15` : "transparent",
      }}
    >
      {active ? "● " : "○ "}
      {label}
    </button>
  )
}
