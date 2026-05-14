"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, MessageCircle, ExternalLink } from "lucide-react"
import {
  siteMeta,
  servicesCore,
  coreWorks,
  profile,
  contact,
  type Work,
} from "@/lib/preview-content"
import { Reveal } from "@/components/preview/reveal-on-scroll"
import { ContactFormY2K } from "@/components/contact-form-y2k"

const NEON = {
  cyan: "#00f0ff",
  magenta: "#ff3df0",
  green: "#39ff14",
  amber: "#ffb800",
}

export function PortfolioContent() {
  return (
    <div className="font-variant-y2k min-h-screen bg-[#06010f] text-white antialiased">
      <ScanlineLayer />
      <Header />
      <main>
        <Hero />
        <Works />
        <About />
        <Services />
        <Subsidies />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}

/* ───────────────────────── Global scanline overlay ───────────────────────── */
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

/* ───────────────────────── Header ───────────────────────── */
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
          <a href="#works" className="hover:text-[#00f0ff] transition-colors">
            works
          </a>
          <a href="#about" className="hover:text-[#00f0ff] transition-colors">
            profile
          </a>
          <a href="#services" className="hover:text-[#00f0ff] transition-colors">
            services
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-1 hover:text-[#00f0ff] transition-colors"
          >
            // home
            <ArrowRight className="h-3 w-3 -rotate-45" />
          </Link>
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

/* ───────────────────────── Hero ───────────────────────── */
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
            data-text="残業の原因を、ITで撃退します。"
            className="glitch text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] uppercase"
            style={{
              textShadow: `0 0 40px ${NEON.cyan}50`,
            }}
          >
            残業の原因を、<br />ITで撃退します。
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
              style={{
                borderColor: NEON.cyan,
                color: NEON.cyan,
                clipPath: "polygon(6% 0, 100% 0, 94% 100%, 0 100%)",
              }}
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

/* ───────────────────────── Works ───────────────────────── */
function Works() {
  return (
    <section
      id="works"
      className="relative border-b py-24 sm:py-32"
      style={{ borderColor: `${NEON.cyan}20` }}
    >
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: NEON.green }}
            >
              // works
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-3">
              触れる デモ集
            </h2>
            <p className="text-sm text-white/55 leading-relaxed font-variant-y2k-body max-w-2xl">
              実際の業務に そのまま 入れられる かたちで 作った サンプル。 スマホでも パソコンでも、 そのまま 触ってみてください。
            </p>
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-3">
          {coreWorks.map((w, i) => (
            <Reveal key={w.title} delay={i * 100}>
              <WorkCard work={w} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkCard({ work: w, index }: { work: Work; index: number }) {
  const isInternal = w.href.startsWith("/")
  return (
    <Link
      href={w.href}
      target={isInternal ? undefined : "_blank"}
      rel={isInternal ? undefined : "noopener noreferrer"}
      className="group block border-2 transition hover:-translate-y-1"
      style={{ borderColor: w.accent }}
    >
      <div
        className="aspect-[16/10] relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${w.accent}, #000 60%)` }}
      >
        {/* Real video if provided, otherwise static cover, otherwise the geometric placeholder. */}
        {w.video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={w.video.poster ?? w.cover}
          >
            {w.video.webm && <source src={w.video.webm} type="video/webm" />}
            <source src={w.video.mp4} type="video/mp4" />
          </video>
        ) : w.cover ? (
          <img
            src={w.cover}
            alt={w.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <>
            <div
              aria-hidden
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
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
          </>
        )}

        <div className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-widest text-white/80 mix-blend-difference">
          [ project_0{index + 1} ]
        </div>
        <div
          className="absolute top-3 right-3 text-[10px] font-mono"
          style={{ color: NEON.green }}
        >
          {isInternal ? "● demo" : "● live"}
        </div>
      </div>
      <div className="p-6 bg-black/60">
        <p
          className="text-[10px] font-bold uppercase tracking-widest mb-2 font-variant-y2k"
          style={{ color: w.accent }}
        >
          {w.role}
        </p>
        <h3 className="text-lg font-black uppercase tracking-tight mb-3 leading-snug">
          {w.title}
        </h3>
        <p className="text-xs text-white/60 leading-relaxed font-variant-y2k-body">
          {w.desc}
        </p>
      </div>
    </Link>
  )
}

/* ───────────────────────── About ───────────────────────── */
function About() {
  return (
    <section
      id="about"
      className="relative border-b py-24 sm:py-32"
      style={{ borderColor: `${NEON.magenta}20` }}
    >
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p
            className="text-xs font-bold uppercase tracking-widest mb-3"
            style={{ color: NEON.amber }}
          >
            // operator
          </p>
          <h2
            data-text={profile.name}
            className="glitch text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-8"
          >
            {profile.name}
          </h2>
          <p className="text-base text-white/70 leading-relaxed font-variant-y2k-body">
            {profile.intro}
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── Services ───────────────────────── */
function Services() {
  return (
    <section
      id="services"
      className="relative border-b py-24 sm:py-32"
      style={{ borderColor: `${NEON.cyan}20` }}
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-16">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: NEON.cyan }}
            >
              // services
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight">
              できること
            </h2>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {servicesCore.map((s, i) => {
            const cardColor = i === 0 ? NEON.cyan : i === 1 ? NEON.magenta : NEON.amber
            return (
              <Reveal key={s.no} delay={i * 100}>
                <article
                  className="group relative h-full p-7 border-2 flex flex-col"
                  style={{
                    borderColor: cardColor,
                    background: "rgba(0,0,0,0.4)",
                  }}
                >
                  <div
                    className="text-xs font-black uppercase tracking-widest mb-4"
                    style={{ color: cardColor }}
                  >
                    module.0{i + 1}
                  </div>
                  <h3 className="text-base font-black uppercase tracking-tight mb-3 leading-snug">
                    {s.title}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed font-variant-y2k-body flex-grow">
                    {s.outcome}
                  </p>
                  <div className="mt-6 pt-5 border-t border-white/10">
                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-1">
                      価格 目安
                    </div>
                    <div
                      className="text-2xl font-black tracking-tight"
                      style={{ color: cardColor }}
                    >
                      {s.priceHint}
                    </div>
                    <a
                      href="#subsidies"
                      className="mt-2 inline-block text-[10px] font-variant-y2k-body underline underline-offset-2 transition-colors"
                      style={{ color: NEON.amber }}
                    >
                      → 補助金で 半額〜2/3 補助の 可能性あり
                    </a>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── Subsidies ───────────────────────── */
function Subsidies() {
  const items = [
    {
      tag: "商工会議所",
      title: "小規模事業者持続化補助金",
      hint: "ホームページの 作り直し / 販路拡大 に 使える 王道枠",
    },
    {
      tag: "厚生労働省",
      title: "業務改善助成金",
      hint: "賃上げと セットで 業務アプリ・設備投資 が 対象になることも",
    },
    {
      tag: "都道府県・市区町村",
      title: "自治体の IT 化 補助金",
      hint: "地域ごとに 上限・条件 が違う。 まず使える枠を 一緒に リサーチ",
    },
  ]
  return (
    <section
      id="subsidies"
      className="relative border-b py-24 sm:py-32 overflow-hidden"
      style={{ borderColor: `${NEON.amber}30` }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 blur-3xl"
        style={{
          background: `radial-gradient(circle at 70% 30%, ${NEON.amber}40, transparent 60%)`,
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <div className="mb-12">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: NEON.amber }}
            >
              // subsidies
            </p>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight leading-tight mb-4">
              補助金で 半額 になる かも。
            </h2>
            <p className="text-sm sm:text-base text-white/70 leading-relaxed font-variant-y2k-body max-w-2xl">
              業種・規模・事業計画 によっては、 国や自治体の 補助金で 導入費用の 半分〜2/3 が 補助される ことがあります。 ご相談時に 「使えそうな補助金」 を 一緒に 調べて、 申請の流れも おつたえします。
            </p>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 100}>
              <article
                className="relative h-full p-6 border-2"
                style={{
                  borderColor: `${NEON.amber}60`,
                  background: "rgba(0,0,0,0.4)",
                }}
              >
                <span aria-hidden className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2" style={{ borderColor: NEON.amber }} />
                <span aria-hidden className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2" style={{ borderColor: NEON.amber }} />
                <span aria-hidden className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2" style={{ borderColor: NEON.amber }} />
                <span aria-hidden className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2" style={{ borderColor: NEON.amber }} />
                <div
                  className="text-[10px] font-bold uppercase tracking-widest mb-3"
                  style={{ color: NEON.amber }}
                >
                  {it.tag}
                </div>
                <h3 className="text-base font-black uppercase tracking-tight mb-3 leading-snug">
                  {it.title}
                </h3>
                <p className="text-xs text-white/60 leading-relaxed font-variant-y2k-body">
                  {it.hint}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
        <Reveal delay={350}>
          <div
            className="mt-8 rounded-xl p-5 sm:p-6 border-l-4"
            style={{
              borderColor: NEON.amber,
              background: "rgba(255, 184, 0, 0.04)",
            }}
          >
            <p className="text-sm text-white/80 leading-relaxed font-variant-y2k-body">
              <span className="font-bold" style={{ color: NEON.amber }}>申請書類の作成が必要な場合 →</span> 行政書士など 申請に強い 専門家を 紹介する 動きもできます。 「ITに弱いから 補助金もよくわからない」 という状態でも、 ご相談の流れで 一緒に確認していけます。
            </p>
          </div>
        </Reveal>
        <Reveal delay={450}>
          <p className="mt-6 text-[11px] text-white/40 leading-relaxed font-variant-y2k-body max-w-3xl">
            ※ 採択されるかは 審査次第です。 補助金の制度は 毎年 内容が変わるため、 最新の要件は ご相談時に 一緒に 確認します。 なお、 IT 導入補助金 (IT導入支援事業者経由のもの) は 現状 対象外です。
          </p>
        </Reveal>
      </div>
    </section>
  )
}

/* ───────────────────────── CTA — Contact form + LINE ───────────────────────── */
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

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <Reveal>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-5"
              style={{ color: NEON.green }}
            >
              // ready to start
            </p>
          </Reveal>
          <Reveal delay={100}>
            <h2
              data-text={contact.heading}
              className="glitch text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight leading-tight mb-6"
            >
              {contact.heading}
            </h2>
          </Reveal>
          <Reveal delay={200}>
            <p className="max-w-xl mx-auto text-sm text-white/70 leading-relaxed font-variant-y2k-body">
              {contact.body}
            </p>
          </Reveal>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto items-stretch">
          <Reveal delay={250}>
            <ContactFormY2K />
          </Reveal>
          <Reveal delay={350}>
            <LineCard />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

function LineCard() {
  return (
    <div
      className="relative h-full font-variant-y2k-body p-7 sm:p-8 border-2 flex flex-col"
      style={{
        borderColor: NEON.green,
        background:
          "linear-gradient(180deg, rgba(57,255,20,0.05), rgba(0,240,255,0.03))",
      }}
    >
      <span aria-hidden className="absolute top-0 left-0 h-3 w-3 border-t-2 border-l-2" style={{ borderColor: NEON.cyan }} />
      <span aria-hidden className="absolute top-0 right-0 h-3 w-3 border-t-2 border-r-2" style={{ borderColor: NEON.cyan }} />
      <span aria-hidden className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2" style={{ borderColor: NEON.cyan }} />
      <span aria-hidden className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2" style={{ borderColor: NEON.cyan }} />

      <div className="text-center mb-6 font-variant-y2k">
        <p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: NEON.green }}>
          // line_v1
        </p>
        <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
          LINE で そうだん
        </h3>
        <p className="mt-2 text-xs text-white/50 font-variant-y2k-body">
          すぐに 返事が ほしいとき
        </p>
      </div>

      <ul className="space-y-2 mb-7 flex-grow text-xs text-white/70 leading-relaxed">
        <li className="flex items-start gap-2">
          <span style={{ color: NEON.green }} className="flex-shrink-0">
            ✓
          </span>
          <span>「これって できる？」を 気軽に質問</span>
        </li>
        <li className="flex items-start gap-2">
          <span style={{ color: NEON.green }} className="flex-shrink-0">
            ✓
          </span>
          <span>ふつうの LINE と 同じように 写真もおくれる</span>
        </li>
        <li className="flex items-start gap-2">
          <span style={{ color: NEON.green }} className="flex-shrink-0">
            ✓
          </span>
          <span>まだ 仕様が決まってなくても 大丈夫</span>
        </li>
      </ul>

      <Link
        href={contact.secondaryHref}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 w-full px-6 py-4 text-xs font-bold uppercase tracking-widest font-variant-y2k"
        style={{
          background: NEON.green,
          color: "#000",
          clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)",
        }}
      >
        <MessageCircle className="h-4 w-4" />
        [ open line ]
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>
    </div>
  )
}

/* ───────────────────────── Footer ───────────────────────── */
function Footer() {
  return (
    <footer
      className="border-t py-10"
      style={{ borderColor: `${NEON.cyan}30`, background: "#000" }}
    >
      <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-widest text-white/40">
        <span>
          © 2026 // {profile.nameRomaji} ・ {siteMeta.brandName}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5">
          <Link href="/" className="hover:text-[#00f0ff] transition-colors">
            // home — お仕事のご相談はこちら
          </Link>
          <Link href="/lab" className="hover:text-[#00f0ff] transition-colors">
            // lab — 個人開発の実験ノート
          </Link>
        </div>
      </div>
    </footer>
  )
}
