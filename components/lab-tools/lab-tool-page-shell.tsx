"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Reveal } from "@/components/preview/reveal-on-scroll"
import { LAB_NEON, type LabAccent } from "@/lib/lab-tools/registry"

type Props = {
  eyebrow: string
  title: string
  description: string
  accent?: LabAccent
  children: React.ReactNode
  disclaimer?: string
}

export function LabToolPageShell({
  eyebrow,
  title,
  description,
  accent = "cyan",
  children,
  disclaimer,
}: Props) {
  const color = LAB_NEON[accent]

  return (
    <div className="font-variant-y2k min-h-screen bg-[#06010f] text-white antialiased">
      <header
        className="sticky top-0 z-30 backdrop-blur-md border-b"
        style={{
          background: "linear-gradient(180deg, rgba(6,1,15,0.85), rgba(6,1,15,0.6))",
          borderColor: `${color}40`,
        }}
      >
        <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-xs">
          <Link
            href="/lab"
            className="inline-flex items-center gap-2 uppercase tracking-widest text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            back to /lab
          </Link>
          <span
            className="font-bold tracking-widest uppercase"
            style={{ color }}
          >
            // lab_tool
          </span>
        </nav>
      </header>

      <section className="relative overflow-hidden border-b py-16 sm:py-20" style={{ borderColor: `${color}30` }}>
        <div
          aria-hidden
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `linear-gradient(to right, ${color}33 1px, transparent 1px), linear-gradient(to bottom, ${color}22 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-6">
          <Reveal>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color }}
            >
              {eyebrow}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h1
              data-text={title}
              className="glitch text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase mb-5"
            >
              {title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-sm sm:text-base text-white/65 leading-relaxed font-variant-y2k-body max-w-3xl">
              {description}
            </p>
          </Reveal>
        </div>
      </section>

      <main className="relative">
        <div className="mx-auto max-w-5xl px-6 py-12 sm:py-16">{children}</div>
      </main>

      {disclaimer && (
        <section className="border-t py-8" style={{ borderColor: `${color}20`, background: "#000" }}>
          <div className="mx-auto max-w-5xl px-6 text-[11px] leading-relaxed text-white/45 font-mono">
            <span className="uppercase tracking-widest" style={{ color }}>// note </span>
            {disclaimer}
          </div>
        </section>
      )}

      <footer
        className="border-t py-10"
        style={{ borderColor: `${color}30`, background: "#000" }}
      >
        <div className="mx-auto max-w-5xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-widest text-white/40">
          <span>自分で使うために作ったツールです</span>
          <Link href="/lab" className="hover:text-white transition-colors">
            ← back to /lab
          </Link>
        </div>
      </footer>
    </div>
  )
}
