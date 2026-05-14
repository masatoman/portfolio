"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { LAB_NEON, type LabTool } from "@/lib/lab-tools/registry"

const STATUS_LABEL: Record<LabTool["status"], string> = {
  live: "● live",
  beta: "● beta",
  wip: "○ wip",
}

export function LabToolCard({ tool, index }: { tool: LabTool; index: number }) {
  const color = LAB_NEON[tool.accent]
  const isWip = tool.status === "wip"
  const idx = String(index + 1).padStart(2, "0")

  const inner = (
    <>
      <div
        className="relative h-[140px] overflow-hidden flex items-center justify-center"
        style={{
          background: `linear-gradient(135deg, ${color}25, #000 70%)`,
        }}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(to right, ${color}33 1px, transparent 1px), linear-gradient(to bottom, ${color}22 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        />
        <span className="relative text-5xl select-none drop-shadow-[0_0_12px_rgba(0,240,255,0.4)]">{tool.icon}</span>
        <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white/80 mix-blend-difference">
          [ tool_{idx} ]
        </div>
        <div
          className="absolute top-3 right-3 text-[10px] font-mono"
          style={{ color: isWip ? "#888" : color }}
        >
          {STATUS_LABEL[tool.status]}
        </div>
      </div>
      <div className="p-5 bg-black/60 flex items-start justify-between gap-3 border-t" style={{ borderColor: `${color}30` }}>
        <div className="min-w-0">
          <h3 className="text-sm font-black uppercase tracking-tight mb-2 leading-snug">
            {tool.title}
          </h3>
          <p className="text-xs text-white/55 leading-relaxed font-variant-y2k-body">
            {tool.desc}
          </p>
        </div>
        {!isWip && (
          <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:text-white shrink-0" />
        )}
      </div>
    </>
  )

  if (isWip) {
    return (
      <div
        className="block border opacity-60 cursor-not-allowed"
        style={{ borderColor: `${color}40` }}
        aria-disabled="true"
      >
        {inner}
      </div>
    )
  }

  return (
    <Link
      href={`/lab/tools/${tool.slug}`}
      className="group block border transition hover:-translate-y-1"
      style={{ borderColor: `${color}60` }}
    >
      {inner}
    </Link>
  )
}
