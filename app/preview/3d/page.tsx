"use client"
import Link from "next/link"
import dynamic from "next/dynamic"
import { ArrowRight, ArrowUpRight, Mail, MessageCircle, Sparkles } from "lucide-react"
import {
  siteMeta,
  servicesCore,
  works,
  profile,
  contact,
} from "@/lib/preview-content"
import { Reveal } from "@/components/preview/reveal-on-scroll"

const ThreeHero = dynamic(() => import("@/components/preview/three-hero").then((m) => m.ThreeHero), {
  ssr: false,
  loading: () => null,
})

export default function ThreeDVariant() {
  return (
    <div className="font-variant-3d min-h-screen bg-[#04050a] text-white antialiased selection:bg-violet-400/40">
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

function Header() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-[#04050a]/70 border-b border-white/[0.06]">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link href="#" className="flex items-center gap-2.5">
          <span
            className="grid place-items-center h-7 w-7 rounded-lg text-xs font-black"
            style={{
              background: "conic-gradient(from 90deg, #7c83ff, #22d3ee, #f472b6, #fbbf24, #7c83ff)",
              color: "#000",
            }}
          >
            I
          </span>
          <span className="text-sm font-semibold tracking-tight">{siteMeta.brandName}</span>
        </Link>
        <div className="hidden md:flex items-center gap-7 text-sm text-white/60">
          <a href="#works" className="hover:text-white transition-colors">作ったもの</a>
          <a href="#about" className="hover:text-white transition-colors">プロフィール</a>
          <a href="#services" className="hover:text-white transition-colors">できること</a>
        </div>
        <Link
          href="#contact"
          className="text-xs rounded-full px-4 py-1.5 font-semibold text-black hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(135deg, #7c83ff, #22d3ee)" }}
        >
          相談する
        </Link>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[700px] overflow-hidden border-b border-white/[0.06]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, #1a0b3d 0%, #04050a 70%), linear-gradient(180deg, #06061a, #04050a)",
        }}
      />
      <ThreeHero />

      <div className="relative h-full flex flex-col justify-center items-center text-center px-6 pointer-events-none">
        <Reveal>
          <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] backdrop-blur px-3 py-1 text-xs font-mono text-white/80 mb-8">
            <Sparkles className="h-3 w-3 text-violet-300" />
            {siteMeta.status}
          </div>
        </Reveal>
        <Reveal delay={150}>
          <h1 className="text-5xl sm:text-7xl lg:text-[100px] font-bold tracking-[-0.04em] leading-[0.95] max-w-5xl">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, #e0e7ff 30%, #a5b4fc 60%, #67e8f9 100%)",
              }}
            >
              むずかしい話は、
              <br />
              ぜんぶ こちらで。
            </span>
          </h1>
        </Reveal>
        <Reveal delay={300}>
          <p className="mt-8 max-w-xl text-base sm:text-lg text-white/70 leading-relaxed">
            {siteMeta.subCatch}
          </p>
        </Reveal>
        <Reveal delay={450}>
          <div className="pointer-events-auto mt-10 flex flex-wrap justify-center gap-3">
            <Link
              href="#works"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-7 py-4 text-sm font-semibold hover:bg-white/10 transition-colors"
            >
              作ったものを見る
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>

      <div
        aria-hidden
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
        style={{ background: "linear-gradient(to bottom, transparent, #04050a)" }}
      />
    </section>
  )
}

function Works() {
  return (
    <section id="works" className="relative border-b border-white/[0.06] py-24 sm:py-32 overflow-hidden">
      <div
        aria-hidden
        className="absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #f472b6, transparent 60%)" }}
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16">
            <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#f472b6" }}>
              — Works
            </p>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight">
              作って、動かしている もの
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
                  className="aspect-[16/10] relative overflow-hidden rounded-2xl border border-white/10 mb-5 transition group-hover:border-white/20"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, ${w.accent}40, transparent 60%), linear-gradient(135deg, ${w.accent}30, transparent 70%), #0a0a1a`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                      backgroundSize: "40px 40px",
                    }}
                  />
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      className="h-20 w-20 rounded-2xl"
                      style={{
                        background: `conic-gradient(from 0deg, ${w.accent}, transparent, ${w.accent})`,
                        boxShadow: `0 0 60px ${w.accent}80, inset 0 0 40px ${w.accent}40`,
                        animation: "spin 8s linear infinite",
                      }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <p className="text-xs font-mono" style={{ color: w.accent }}>{w.role}</p>
                    <ArrowUpRight className="h-4 w-4 text-white/40 transition group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 leading-snug">{w.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{w.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="relative border-b border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#67e8f9" }}>
            — About
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-8">
            {profile.name}
          </h2>
          <p className="text-lg text-white/70 leading-relaxed mb-10 max-w-2xl">{profile.intro}</p>
          <div className="grid grid-cols-3 gap-6 max-w-md">
            {profile.numbers.map((n, i) => {
              const colors = ["#7c83ff", "#22d3ee", "#f472b6"]
              return (
                <div key={n.l}>
                  <div
                    className="text-3xl font-bold tracking-tight inline-block"
                    style={{
                      background: `linear-gradient(135deg, ${colors[i]}, #fff)`,
                      WebkitBackgroundClip: "text",
                      color: "transparent",
                    }}
                  >
                    {n.v}
                  </div>
                  <div className="text-xs text-white/50 mt-1">{n.l}</div>
                </div>
              )
            })}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="relative border-b border-white/[0.06] py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "#fbbf24" }}>
            — What I do
          </p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight mb-16">
            できること
          </h2>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {servicesCore.map((s, i) => {
            const colors = ["#7c83ff", "#22d3ee", "#f472b6"]
            const c = colors[i]
            return (
              <Reveal key={s.no} delay={i * 100}>
                <article
                  className="rounded-2xl p-7 h-full"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                    border: `1px solid ${c}40`,
                  }}
                >
                  <span
                    className="font-mono text-xs mb-4 block px-2 py-1 rounded inline-block"
                    style={{ background: `${c}20`, color: c }}
                  >
                    0{i + 1}
                  </span>
                  <h3 className="text-lg font-bold mb-3 leading-snug">{s.title}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{s.outcome}</p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section id="contact" className="relative overflow-hidden py-32">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(124,131,255,0.4), transparent 60%), radial-gradient(circle at 80% 20%, rgba(244,114,182,0.3), transparent 60%), radial-gradient(circle at 20% 80%, rgba(34,211,238,0.3), transparent 60%)",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight mb-6">
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff, #a5b4fc, #67e8f9)",
              }}
            >
              {contact.heading}
            </span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="text-white/70 leading-relaxed max-w-xl mx-auto mb-10 text-base">
            {contact.body}
          </p>
        </Reveal>
        <Reveal delay={240}>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="mailto:contact@ihara-frontend.com"
              className="group inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-black hover:scale-[1.02] transition-transform"
              style={{
                background: "linear-gradient(135deg, #ffffff, #e0e7ff)",
                boxShadow: "0 0 60px rgba(124,131,255,0.5)",
              }}
            >
              <Mail className="h-4 w-4" />
              メールで相談する
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={contact.secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur px-7 py-4 text-sm font-semibold hover:bg-white/10 transition-colors"
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

function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-10 bg-[#04050a]">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
        <span>© 2026 {profile.nameRomaji} ・ {siteMeta.brandName}</span>
        <div className="flex gap-5">
          <Link href="/preview" className="hover:text-white transition-colors">他のデザインを見る</Link>
          <Link href="/" className="hover:text-white transition-colors">元のサイトに戻る</Link>
        </div>
      </div>
    </footer>
  )
}
