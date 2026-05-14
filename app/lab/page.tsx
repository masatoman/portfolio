"use client"
import Link from "next/link"
import { ArrowLeft, ArrowUpRight } from "lucide-react"
import { labWorks, profile, siteMeta, type Work } from "@/lib/preview-content"
import { Reveal } from "@/components/preview/reveal-on-scroll"
import { labTools } from "@/lib/lab-tools/registry"
import { LabToolCard } from "@/components/lab-tools/lab-tool-card"

const NEON = {
  cyan: "#00f0ff",
  magenta: "#ff3df0",
  green: "#39ff14",
}

export default function LabPage() {
  return (
    <div className="font-variant-y2k min-h-screen bg-[#06010f] text-white antialiased">
      <Header />
      <main>
        <Intro />
        <Tools />
        <Grid />
      </main>
      <Footer />
    </div>
  )
}

function Header() {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md border-b"
      style={{
        background: "linear-gradient(180deg, rgba(6,1,15,0.85), rgba(6,1,15,0.6))",
        borderColor: `${NEON.cyan}30`,
      }}
    >
      <nav className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between text-xs">
        <Link
          href="/"
          className="inline-flex items-center gap-2 uppercase tracking-widest text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          back to main
        </Link>
        <span className="font-bold tracking-widest uppercase">{siteMeta.brandName} / lab</span>
      </nav>
    </header>
  )
}

function Intro() {
  return (
    <section className="relative overflow-hidden border-b border-[#00f0ff]/20 py-20 sm:py-28">
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,240,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.10) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6">
        <Reveal>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: NEON.green }}
          >
            // lab
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h1
            data-text="個人開発・実験ノート"
            className="glitch text-3xl sm:text-5xl font-black tracking-tight leading-tight uppercase mb-6"
          >
            個人開発・実験ノート
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-sm sm:text-base text-white/60 leading-relaxed font-variant-y2k-body max-w-2xl">
            お仕事ではなく、自分のために作ったもの・試したものの 置き場です。お客様向けの 実用的なデモは{" "}
            <Link href="/#examples" className="underline" style={{ color: NEON.cyan }}>
              トップの 制作例
            </Link>{" "}
            にあります。こちらは「動くか試したかった」「自分が欲しかったから作った」系。
          </p>
        </Reveal>
      </div>
    </section>
  )
}

function Tools() {
  return (
    <section className="relative pt-16 pb-12 sm:pt-20 border-b border-[#ffb800]/20">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: "#ffb800" }}
          >
            // tools
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
            自分の事業のために 作った AI ツール
          </h2>
        </Reveal>
        <Reveal delay={150}>
          <p className="text-sm text-white/55 leading-relaxed font-variant-y2k-body max-w-2xl mb-10">
            個人事業 + これから建てるマイクロ法人 (2026/6 設立予定) のために 自分で作って 自分で使っているツール群。試したい人はどうぞ。
          </p>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-2">
          {labTools.map((t, i) => (
            <Reveal key={t.slug} delay={i * 60}>
              <LabToolCard tool={t} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Grid() {
  return (
    <section className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: NEON.green }}
          >
            // works
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-10">
            個人開発・実験プロジェクト
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {labWorks.map((w, i) => (
            <Reveal key={w.title} delay={i * 80}>
              <LabCard work={w} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function LabCard({ work: w, index }: { work: Work; index: number }) {
  return (
    <Link
      href={w.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border transition hover:-translate-y-1"
      style={{ borderColor: `${w.accent}60` }}
    >
      <div
        className="aspect-[16/10] relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${w.accent}, #000 60%)` }}
      >
        {w.cover ? (
          <img
            src={w.cover}
            alt={w.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center">
            <div
              className="h-12 w-12 border-2"
              style={{
                borderColor: w.accent,
                background: `linear-gradient(135deg, ${w.accent}40, transparent)`,
              }}
            />
          </div>
        )}
        <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white/80 mix-blend-difference">
          [ lab_0{index + 1} ]
        </div>
        <div className="absolute top-3 right-3 text-[10px] font-mono" style={{ color: NEON.green }}>
          ● live
        </div>
      </div>
      <div className="p-5 bg-black/60 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-black uppercase tracking-tight mb-2 leading-snug">
            {w.title}
          </h3>
          <p className="text-xs text-white/55 leading-relaxed font-variant-y2k-body">
            {w.desc}
          </p>
        </div>
        <ArrowUpRight
          className="h-4 w-4 text-white/40 transition group-hover:text-white shrink-0"
        />
      </div>
    </Link>
  )
}

function Footer() {
  return (
    <footer
      className="border-t py-10 mt-12"
      style={{ borderColor: `${NEON.cyan}30`, background: "#000" }}
    >
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-widest text-white/40">
        <span>© 2026 // {profile.nameRomaji} ・ {siteMeta.brandName}</span>
        <Link href="/" className="hover:text-white transition-colors">
          ← back to main
        </Link>
      </div>
    </footer>
  )
}
