// 各セクション (// 00 / how-to ... // 03 / settings) 共通の見出し。

import type React from "react"

export function SectionHeader({
  label,
  color,
  title,
  note,
  right,
}: {
  label: string
  color: string
  title: string
  note?: string
  right?: React.ReactNode
}) {
  return (
    <div className="mb-2 flex items-end justify-between flex-wrap gap-3">
      <div>
        <p
          className="mb-2 font-mono text-[10px] uppercase tracking-widest"
          style={{ color }}
        >
          {label}
        </p>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
          {title}
          {note && (
            <span className="ml-3 text-[10px] font-mono uppercase tracking-widest text-white/40">
              [{note}]
            </span>
          )}
        </h2>
      </div>
      {right}
    </div>
  )
}
