"use client"
import Link from "next/link"
import { useEffect, useRef } from "react"
import { ArrowRight, ArrowUpRight, Mail, MessageCircle } from "lucide-react"
import {
  siteMeta,
  servicesCore,
  works,
  profile,
  contact,
} from "@/lib/preview-content"
import { Reveal } from "@/components/preview/reveal-on-scroll"

export default function DarkGridVariant() {
  return (
    <div className="font-variant-dark-grid min-h-screen bg-neutral-950 text-neutral-100 antialiased selection:bg-violet-500/30">
      <CursorSpotlight />
      <Header />
      <main>
        <Hero />
        <Works />
        <About />
        <Services />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

/* ───────────────────────── Cursor spotlight ───────────────────────── */
function CursorSpotlight() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onMove = (e: MouseEvent) => {
      el.style.background = `radial-gradient(600px circle at ${e.clientX}px ${e.clientY}px, rgba(124,131,255,0.10), transparent 40%)`
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])
  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
    />
  )
}

/* ───────────────────────── Header ───────────────────────── */
function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] backdrop-blur-md bg-neutral-950/70">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2.5">
          <span className="grid place-items-center h-7 w-7 rounded-md bg-white text-neutral-950 text-xs font-black">
            I
          </span>
          <span className="text-sm font-semibold tracking-tight">{siteMeta.brandName}</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm text-neutral-400">
          <a href="#works" className="hover:text-white transition-colors">作ったもの</a>
          <a href="#about" className="hover:text-white transition-colors">プロフィール</a>
          <a href="#services" className="hover:text-white transition-colors">できること</a>
        </div>
        <Link
          href="#contact"
          className="text-sm rounded-full bg-white text-neutral-950 px-4 py-1.5 font-semibold hover:bg-neutral-200 transition-colors"
        >
          相談する
        </Link>
      </nav>
    </header>
  )
}

/* ───────────────────────── Hero ───────────────────────── */
function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-60" />
      <div aria-hidden className="absolute inset-x-0 top-0 h-[600px] bg-radial-spotlight opacity-90" />
      <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.06] mix-blend-overlay" />

      <div aria-hidden className="absolute left-[8%] top-[30%] hidden lg:block">
        <div className="h-32 w-32 rotate-12 border border-white/10 animate-float" />
      </div>
      <div aria-hidden className="absolute right-[10%] top-[20%] hidden lg:block animate-float" style={{ animationDelay: "1.5s" }}>
        <div className="h-20 w-20 rounded-full border border-violet-400/30" />
      </div>
      <div aria-hidden className="absolute right-[18%] bottom-[18%] hidden lg:block animate-float" style={{ animationDelay: "3s" }}>
        <div className="h-16 w-16 rotate-45 bg-gradient-to-br from-violet-500/20 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pt-28 pb-32 sm:pt-36 sm:pb-44">
        <Reveal>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs font-mono text-neutral-300 mb-8">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {siteMeta.status}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="text-[44px] sm:text-7xl lg:text-[88px] font-bold tracking-[-0.04em] leading-[0.95] max-w-5xl">
            むずかしい話は、
            <br />
            <span className="bg-gradient-to-r from-white via-violet-200 to-violet-400 bg-clip-text text-transparent">
              ぜんぶ こちらで。
            </span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-8 max-w-2xl text-lg text-neutral-400 leading-relaxed">
            {siteMeta.subCatch}
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#works"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-neutral-950 px-6 py-3.5 text-sm font-semibold hover:bg-neutral-200 transition-colors"
            >
              作ったものを見る
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Works (主役) ───────────────────────── */
function Works() {
  return (
    <section id="works" className="relative border-b border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16">
            <p className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-4">— Works</p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              作って、毎日 動かしている もの
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-2">
          {works.map((w, i) => (
            <Reveal key={w.title} delay={i * 100}>
              <Link
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div
                  className="aspect-[16/10] relative overflow-hidden rounded-2xl border border-white/10 mb-5 transition group-hover:border-white/30"
                  style={{
                    background: `linear-gradient(135deg, ${w.accent}30, transparent 60%), radial-gradient(circle at 30% 30%, ${w.accent}40, transparent 50%)`,
                  }}
                >
                  <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-40" />
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      className="h-16 w-16 rounded-xl border border-white/30"
                      style={{
                        background: `linear-gradient(135deg, ${w.accent}, transparent)`,
                        boxShadow: `0 0 60px ${w.accent}60`,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="text-xs font-mono text-neutral-500">{w.role}</p>
                    <ArrowUpRight className="h-4 w-4 text-neutral-500 transition group-hover:text-violet-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 leading-snug">{w.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{w.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── About (compact) ───────────────────────── */
function About() {
  return (
    <section id="about" className="relative border-b border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-4">— About</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-8">
            {profile.name}
          </h2>
          <p className="text-lg text-neutral-300 leading-relaxed mb-10 max-w-2xl">
            {profile.intro}
          </p>
          <div className="grid grid-cols-3 gap-6 max-w-md">
            {profile.numbers.map((n) => (
              <div key={n.l}>
                <div className="text-3xl font-bold tracking-tight">{n.v}</div>
                <div className="text-xs text-neutral-500 mt-1">{n.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Services (3つだけ) ───────────────────────── */
function Services() {
  return (
    <section id="services" className="relative border-b border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-widest text-violet-400 mb-4">— What I do</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-16">
            できること
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {servicesCore.map((s, i) => (
            <Reveal key={s.no} delay={i * 100}>
              <div className="rounded-xl border border-white/10 bg-white/[0.02] p-7 h-full">
                <span className="font-mono text-xs text-neutral-500 mb-4 block">0{i + 1}</span>
                <h3 className="text-lg font-bold mb-3 leading-snug">{s.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{s.outcome}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA ───────────────────────── */
function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-32 sm:py-40">
      <div aria-hidden className="absolute inset-0 bg-radial-spotlight opacity-90" />
      <div aria-hidden className="absolute inset-0 bg-grid-dark opacity-50" />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight mb-6">
            {contact.heading}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-neutral-400 leading-relaxed max-w-xl mx-auto mb-10 text-base">
            {contact.body}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="mailto:contact@ihara-frontend.com"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-neutral-950 px-7 py-4 text-sm font-semibold hover:bg-neutral-200 transition-colors"
            >
              <Mail className="h-4 w-4" />
              {contact.primaryLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={contact.secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-7 py-4 text-sm font-semibold text-neutral-200 hover:bg-white/[0.08] transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              {contact.secondaryLabel}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Footer ───────────────────────── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 bg-neutral-950">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-500">
        <span>© 2026 {profile.nameRomaji} ・ {siteMeta.brandName}</span>
        <div className="flex gap-5">
          <Link href="/preview" className="hover:text-white transition-colors">他のデザインを見る</Link>
          <Link href="/" className="hover:text-white transition-colors">元のサイトに戻る</Link>
        </div>
      </div>
    </footer>
  )
}
