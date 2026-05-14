"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, Mail, MessageCircle } from "lucide-react"
import {
  siteMeta,
  servicesCore,
  works,
  profile,
  contact,
} from "@/lib/preview-content"
import { Reveal } from "@/components/preview/reveal-on-scroll"

const NEON = {
  cyan: "#00f0ff",
  magenta: "#ff3df0",
  green: "#39ff14",
  amber: "#ffb800",
}

export default function Y2KVariant() {
  return (
    <div className="font-variant-y2k min-h-screen bg-[#06010f] text-white antialiased">
      <ScanlineLayer />
      <Header />
      <main>
        <Hero />
        <Works />
        <Profile />
        <Services />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

function ScanlineLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        background:
          "repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "overlay",
      }}
    />
  )
}

function Header() {
  const [time, setTime] = useState("--:--:--")
  useEffect(() => {
    const upd = () => {
      const d = new Date()
      setTime(
        `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`,
      )
    }
    upd()
    const id = setInterval(upd, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md border-b"
      style={{
        background: "linear-gradient(180deg, rgba(6,1,15,0.85), rgba(6,1,15,0.6))",
        borderColor: `${NEON.cyan}30`,
      }}
    >
      <nav className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between text-xs">
        <Link href="#" className="flex items-center gap-2">
          <span
            className="grid place-items-center h-6 w-6 text-[10px] font-black"
            style={{
              background: `linear-gradient(135deg, ${NEON.cyan}, ${NEON.magenta})`,
              color: "#000",
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
            }}
          >
            I
          </span>
          <span className="font-bold tracking-widest uppercase">{siteMeta.brandName}</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 uppercase tracking-widest text-white/60">
          <a href="#works" className="hover:text-[#00f0ff] transition-colors">works</a>
          <a href="#about" className="hover:text-[#00f0ff] transition-colors">profile</a>
          <a href="#services" className="hover:text-[#00f0ff] transition-colors">services</a>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-[#39ff14] tabular-nums">{time}</span>
          <Link
            href="#contact"
            className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
            style={{
              background: `linear-gradient(90deg, ${NEON.cyan}, ${NEON.magenta})`,
              color: "#000",
              clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
            }}
          >
            // contact
          </Link>
        </div>
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[#00f0ff]/20">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0,240,255,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,240,255,0.10) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[1000px] rounded-full opacity-50 blur-3xl"
        style={{ background: `radial-gradient(circle, ${NEON.magenta}, transparent 60%)` }}
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${NEON.cyan}, transparent 60%)` }}
      />

      <div className="relative mx-auto max-w-6xl px-6 pt-24 pb-32">
        <Reveal>
          <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-widest">
            <span
              className="px-2 py-1 font-bold"
              style={{
                background: NEON.green,
                color: "#000",
                clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)",
              }}
            >
              status: online
            </span>
            <span className="text-white/40">// {siteMeta.status}</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h1
            data-text="むずかしい話は、ぜんぶ こちらで。"
            className="glitch text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] uppercase"
            style={{
              textShadow: `0 0 40px ${NEON.cyan}50`,
            }}
          >
            むずかしい話は、ぜんぶ こちらで。
          </h1>
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-8 max-w-2xl text-sm sm:text-base text-white/70 leading-relaxed font-variant-y2k-body">
            {siteMeta.subCatch}
          </p>
        </Reveal>
        <Reveal delay={350}>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href="#works"
              className="inline-flex items-center gap-2 px-7 py-4 text-xs font-bold uppercase tracking-widest border-2 hover:bg-white/5 transition-colors"
              style={{ borderColor: NEON.cyan, color: NEON.cyan, clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)" }}
            >
              [ view works ]
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Works() {
  return (
    <section id="works" className="relative border-b py-24 sm:py-32" style={{ borderColor: `${NEON.cyan}20` }}>
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: NEON.green }}>
              // archive
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              live products
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2">
          {works.map((w, i) => (
            <Reveal key={w.title} delay={i * 100}>
              <Link
                href={w.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block border-2 transition hover:-translate-y-1"
                style={{ borderColor: w.accent }}
              >
                <div
                  className="aspect-[16/10] relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${w.accent}, #000 60%)`,
                  }}
                >
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white/70">
                    [ project_0{i + 1} ]
                  </div>
                  <div className="absolute top-3 right-3 text-[10px] font-mono" style={{ color: NEON.green }}>
                    ● live
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div
                      className="h-16 w-16 border-2"
                      style={{
                        borderColor: w.accent,
                        background: `linear-gradient(135deg, ${w.accent}40, transparent)`,
                        boxShadow: `0 0 40px ${w.accent}80`,
                      }}
                    />
                  </div>
                </div>
                <div className="p-6 bg-black/60">
                  <h3 className="text-lg font-black uppercase tracking-tight mb-3 leading-snug">{w.title}</h3>
                  <p className="text-xs text-white/60 leading-relaxed font-variant-y2k-body">{w.desc}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Profile() {
  return (
    <section id="about" className="relative border-b py-24 sm:py-32" style={{ borderColor: `${NEON.magenta}20` }}>
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: NEON.amber }}>
            // operator
          </p>
          <h2
            data-text={profile.name}
            className="glitch text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-8"
          >
            {profile.name}
          </h2>
          <p className="text-base text-white/70 leading-relaxed font-variant-y2k-body">{profile.intro}</p>
        </Reveal>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section
      id="services"
      className="relative border-b py-24 sm:py-32 overflow-hidden"
      style={{ borderColor: `${NEON.cyan}20` }}
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16">
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: NEON.cyan }}>
              // services
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              できること
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {servicesCore.map((s, i) => (
            <Reveal key={s.no} delay={i * 100}>
              <article
                className="group relative h-full p-7 border-2"
                style={{
                  borderColor: i === 0 ? NEON.cyan : i === 1 ? NEON.magenta : NEON.amber,
                  background: "rgba(0,0,0,0.4)",
                }}
              >
                <div
                  className="text-xs font-black uppercase tracking-widest mb-4"
                  style={{ color: i === 0 ? NEON.cyan : i === 1 ? NEON.magenta : NEON.amber }}
                >
                  module.0{i + 1}
                </div>
                <h3 className="text-base font-black uppercase tracking-tight mb-3 leading-snug">{s.title}</h3>
                <p className="text-xs text-white/60 leading-relaxed font-variant-y2k-body">{s.outcome}</p>
              </article>
            </Reveal>
          ))}
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
          background: `radial-gradient(circle at 50% 50%, ${NEON.magenta}50, transparent 60%), radial-gradient(circle at 20% 80%, ${NEON.cyan}40, transparent 60%)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />
      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: NEON.green }}>
            // ready to start
          </p>
        </Reveal>
        <Reveal delay={100}>
          <h2
            data-text={contact.heading}
            className="glitch text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-tight mb-8"
          >
            {contact.heading}
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="max-w-xl mx-auto text-sm text-white/70 leading-relaxed mb-10 font-variant-y2k-body">
            {contact.body}
          </p>
        </Reveal>
        <Reveal delay={300}>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="mailto:contact@ihara-frontend.com"
              className="group inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest"
              style={{
                background: `linear-gradient(90deg, ${NEON.cyan}, ${NEON.magenta})`,
                color: "#000",
                clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)",
              }}
            >
              <Mail className="h-4 w-4" />
              [ send mail ]
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={contact.secondaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-widest border-2"
              style={{
                borderColor: NEON.green,
                color: NEON.green,
                clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)",
              }}
            >
              <MessageCircle className="h-4 w-4" />
              [ line ]
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer
      className="border-t py-10"
      style={{ borderColor: `${NEON.cyan}30`, background: "#000" }}
    >
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-widest text-white/40">
        <span>© 2026 // {profile.nameRomaji} ・ {siteMeta.brandName}</span>
        <div className="flex gap-5">
          <Link href="/preview" className="hover:text-[#00f0ff] transition-colors">// other variants</Link>
          <Link href="/" className="hover:text-[#00f0ff] transition-colors">// back to root</Link>
        </div>
      </div>
    </footer>
  )
}
