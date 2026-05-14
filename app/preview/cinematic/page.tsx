"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, ChevronDown, Mail, MessageCircle, Play } from "lucide-react"
import {
  siteMeta,
  servicesCore,
  works,
  profile,
  contact,
  heroBigStatement,
} from "@/lib/preview-content"
import { Reveal } from "@/components/preview/reveal-on-scroll"

export default function CinematicVariant() {
  return (
    <div className="font-variant-cinematic min-h-screen bg-black text-white antialiased selection:bg-white selection:text-black">
      <Header />
      <main>
        <Hero />
        <WorksCinematic />
        <ProfileCinematic />
        <ServicesCinematic />
        <CTACinematic />
      </main>
      <Footer />
    </div>
  )
}

/* ───────────────────────── Header ───────────────────────── */
function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-300 ${
        scrolled ? "bg-black/70 backdrop-blur-xl border-b border-white/10" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
        <Link href="#" className="text-base font-medium tracking-tight">
          {siteMeta.brandName}
        </Link>
        <div className="hidden md:flex items-center gap-8 text-xs font-medium text-white/70">
          <a href="#works" className="hover:text-white transition-colors">作ったもの</a>
          <a href="#about" className="hover:text-white transition-colors">プロフィール</a>
          <a href="#services" className="hover:text-white transition-colors">できること</a>
          <a href="#contact" className="hover:text-white transition-colors">相談する</a>
        </div>
      </nav>
    </header>
  )
}

/* ───────────────────────── Hero ───────────────────────── */
function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 animate-aurora"
        style={{
          background:
            "linear-gradient(125deg, #000 0%, #0a1124 25%, #2c1450 50%, #6b1d3f 75%, #000 100%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.08] mix-blend-overlay" />
      <div
        aria-hidden
        className="absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full opacity-50 blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, rgba(118,80,255,0.4), transparent 60%)" }}
      />
      <div
        aria-hidden
        className="absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full opacity-40 blur-3xl animate-float"
        style={{ background: "radial-gradient(circle, rgba(255,80,160,0.35), transparent 60%)", animationDelay: "2s" }}
      />

      <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
        <Reveal>
          <p className="text-xs sm:text-sm font-medium tracking-[0.4em] uppercase text-white/60 mb-6">
            Ihara Frontend — 2026
          </p>
        </Reveal>
        <Reveal delay={150}>
          <h1 className="text-[42px] sm:text-7xl lg:text-[120px] font-semibold tracking-[-0.04em] leading-[0.95] max-w-5xl">
            {heroBigStatement.primary}
            <br />
            <span className="bg-gradient-to-r from-white via-violet-100 to-fuchsia-200 bg-clip-text text-transparent">
              {heroBigStatement.primary2}
            </span>
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-8 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed">
            {heroBigStatement.description}
          </p>
        </Reveal>
        <Reveal delay={450}>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="#works"
              className="group inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur px-7 py-3.5 text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              <Play className="h-4 w-4 fill-white" />
              作ったものを見る
            </Link>
          </div>
        </Reveal>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <ChevronDown className="h-6 w-6 text-white/40" />
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Works (主役) ───────────────────────── */
function WorksCinematic() {
  return (
    <section id="works" className="relative bg-black py-32 sm:py-48">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center mb-20">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-white/50 mb-5">— Works</p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-tight">
              作って、毎日 動かしてる もの。
            </h2>
          </div>
        </Reveal>
        <div className="space-y-16 sm:space-y-32">
          {works.map((w, i) => (
            <Reveal key={w.title}>
              <Link
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16 items-center">
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div
                      className="aspect-[16/10] rounded-3xl overflow-hidden relative transition-transform duration-700 group-hover:scale-[1.02]"
                      style={{
                        background: `linear-gradient(135deg, ${w.accent}, #000 70%)`,
                      }}
                    >
                      <div aria-hidden className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
                      <div className="absolute inset-0 grid place-items-center">
                        <div className="text-center">
                          <div
                            className="mx-auto h-20 w-20 rounded-2xl border border-white/30"
                            style={{
                              background: `linear-gradient(135deg, ${w.accent}, transparent)`,
                              boxShadow: `0 0 80px ${w.accent}80`,
                            }}
                          />
                          <p className="mt-5 text-xs font-mono uppercase tracking-[0.3em] text-white/40">
                            実際の画面
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={i % 2 === 1 ? "lg:order-1" : ""}>
                    <p className="text-xs font-medium tracking-[0.3em] uppercase text-white/40 mb-4">
                      Project · 0{i + 1}
                    </p>
                    <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.02em] leading-tight mb-6">
                      {w.title}
                    </h3>
                    <p className="text-base text-white/60 leading-relaxed mb-8">{w.desc}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold border-b border-white/30 pb-1 group-hover:border-white transition-colors">
                      実物を見る
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
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
function ProfileCinematic() {
  return (
    <section id="about" className="relative bg-white text-black py-32 sm:py-48">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-black/50 mb-5">— About</p>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-tight">
            {profile.name}
          </h2>
          <p className="mt-3 text-black/40 text-sm tracking-widest font-mono">{profile.nameRomaji}</p>
          <p className="mt-10 text-base sm:text-lg text-black/60 leading-relaxed">
            {profile.intro}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Services (3つだけ) ───────────────────────── */
function ServicesCinematic() {
  return (
    <section id="services" className="relative bg-black py-32 sm:py-48">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="text-center mb-20">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-white/50 mb-5">— What I do</p>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-[-0.03em] leading-tight">
              できること
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {servicesCore.map((s, i) => (
            <Reveal key={s.no} delay={i * 100}>
              <article className="group relative h-full overflow-hidden rounded-3xl bg-white/[0.04] border border-white/10 p-8">
                <div className="text-xs font-medium tracking-[0.3em] uppercase text-white/40 mb-6">
                  0{i + 1}
                </div>
                <h3 className="text-2xl font-semibold tracking-tight leading-snug mb-4">{s.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">{s.outcome}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA ───────────────────────── */
function CTACinematic() {
  return (
    <section id="contact" className="relative h-[100svh] min-h-[600px] overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 animate-aurora"
        style={{
          background:
            "linear-gradient(125deg, #000 0%, #1c0a3d 25%, #4d1a52 50%, #730a3d 75%, #000 100%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 bg-noise opacity-[0.08] mix-blend-overlay" />
      <div className="relative h-full flex flex-col justify-center items-center text-center px-6">
        <Reveal>
          <h2 className="text-4xl sm:text-7xl lg:text-8xl font-semibold tracking-[-0.04em] leading-[0.95] max-w-4xl">
            {contact.heading}
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-8 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed">
            {contact.body}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="mailto:contact@ihara-frontend.com"
              className="group inline-flex items-center gap-2 rounded-full bg-white text-black px-8 py-4 text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              <Mail className="h-4 w-4" />
              メールで相談する
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={contact.secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/5 backdrop-blur px-8 py-4 text-sm font-semibold hover:bg-white/15 transition-colors"
            >
              <MessageCircle className="h-4 w-4" />
              LINE で相談する
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
    <footer className="bg-black border-t border-white/10 py-10">
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <span>© 2026 {profile.nameRomaji} ・ {siteMeta.brandName}</span>
        <div className="flex gap-5">
          <Link href="/preview" className="hover:text-white transition-colors">他のデザインを見る</Link>
          <Link href="/" className="hover:text-white transition-colors">元のサイトに戻る</Link>
        </div>
      </div>
    </footer>
  )
}
