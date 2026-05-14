import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Noto_Serif_JP } from "next/font/google"
import {
  ArrowRight,
  Camera,
  FileSpreadsheet,
  MessageCircle,
  Phone,
  Receipt,
} from "lucide-react"
import { examples, HERO_PRICE, LINE_URL, problems } from "@/lib/local-business/landing-data"

const headingFont = Noto_Serif_JP({ subsets: ["latin"], weight: ["500", "700"] })

export const metadata: Metadata = {
  title: "案 3: 困りごと共感 — トップリデザイン プレビュー",
  description: "問いかけ Hero + 困りごと → 該当デモへの直接リンクで対話型に",
}

const ICON_MAP = {
  FileSpreadsheet: FileSpreadsheet,
  Phone: Phone,
  Camera: Camera,
  Receipt: Receipt,
} as const

export default function TopEmpathyPreview() {
  return (
    <div className="min-h-screen bg-[#f3efe7] text-[#1f2a37]">
      <PreviewBanner />
      <Header />
      <main>
        <Hero />
        <ProblemsToDemos />
        <OtherExamples />
        <About />
        <Pricing />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function PreviewBanner() {
  return (
    <div className="bg-[#1f2a37] text-white text-center py-2 text-[11px] font-mono tracking-wider">
      // PREVIEW: 案 3 困りごと共感 (Problems-first, 対話型) ・
      <Link href="/preview" className="underline ml-1">他の案と比較</Link>
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-[28px] z-20 border-b border-[#d8d0c1]/80 bg-[#f7f3ec]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/preview/top-empathy" className="flex items-center gap-3 text-[#1f2a37]">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d7cfbf] bg-white text-base font-semibold">M</span>
          <span className={`${headingFont.className} text-[26px] tracking-[-0.04em]`}>Masato Works</span>
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] font-semibold text-[#4f5b66] md:flex">
          <a href="#problems" className="hover:text-[#7a5c38]">困りごと</a>
          <a href="#examples" className="hover:text-[#7a5c38]">他の例</a>
          <a href="#contact" className="hover:text-[#7a5c38]">ご相談</a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="px-4 pt-14 pb-16 sm:px-6 sm:pt-20 sm:pb-20 bg-[linear-gradient(180deg,#fffdf9,#f3efe7)]">
      <div className="mx-auto max-w-[920px] text-center">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63] mb-6">
          MASATO WORKS — 工務店向け
        </p>
        <h1 className={`${headingFont.className} text-[36px] sm:text-[56px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>
          現場、<br />
          <span className="text-[#7a5c38]">こんなこと</span>ありませんか?
        </h1>
        <p className="mt-8 max-w-[640px] mx-auto text-[16px] leading-[2] text-[#4f5b66]">
          日報、 写真探し、 図面確認、 領収書、 古い HP。
          工務店の「ちょっと面倒」 を、 一人で全部作って整えます。
          初期 {HERO_PRICE.initial} + 月 {HERO_PRICE.monthly} から、 LINE で気軽に相談できます。
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
             className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-[#06c755] px-7 text-[15px] font-bold text-white hover:bg-[#05b54a] hover:-translate-y-0.5 transition">
            <MessageCircle className="h-5 w-5" /> LINE で写真送って相談
          </a>
          <a href="#problems" className="inline-flex min-h-[56px] items-center justify-center rounded-full border-2 border-[#c8b89d] bg-white px-7 text-[15px] font-semibold text-[#1f2a37] hover:border-[#7a5c38] transition">
            ↓ 自分の困りごと 探す
          </a>
        </div>
      </div>
    </section>
  )
}

function ProblemsToDemos() {
  return (
    <section id="problems" className="px-4 py-16 sm:px-6 sm:py-20 bg-[#f8f5ee] border-y border-[#ded6c8]">
      <div className="mx-auto max-w-[1240px]">
        <div className="text-center mb-12">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">COMMON PAIN POINTS</p>
          <h2 className={`${headingFont.className} mt-3 text-[28px] sm:text-[40px] leading-[1.5] text-[#1f2a37]`}>
            よくある 4 つの困りごと
          </h2>
          <p className="mt-4 text-[14px] text-[#7d766b]">どれかに「あ、 これ自分だ」 と思ったら、 そのカードからデモへ進めます</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {problems.map((p) => {
            const Icon = ICON_MAP[p.iconName as keyof typeof ICON_MAP] ?? FileSpreadsheet
            return (
              <Link
                key={p.key} href={p.demoHref ?? "#"}
                className="group relative flex flex-col rounded-[24px] border border-[#e1d9cc] bg-white p-7 hover:-translate-y-1 hover:border-[#7a5c38] transition"
              >
                <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f3ede2] text-[#7a5c38] mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-[18px] font-semibold leading-snug mb-3">{p.title}</h3>
                <p className="text-[14px] leading-7 text-[#5f6871] mb-5 flex-grow">{p.text}</p>
                <p className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#7a5c38] group-hover:gap-2 transition-all">
                  この困りごと用のデモ <ArrowRight className="h-3.5 w-3.5" />
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function OtherExamples() {
  // 困りごとカードに紐づかないデモを「他にもこんな仕組み」 として軽く
  const others = examples.filter((ex) => !ex.problemKey || !problems.some((p) => p.key === ex.problemKey))
  return (
    <section id="examples" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1240px]">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">OTHER EXAMPLES</p>
        <h2 className={`${headingFont.className} mt-3 text-[26px] sm:text-[34px] leading-[1.5] text-[#1f2a37] mb-10`}>
          他にもこんな仕組みを 作っています
        </h2>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {others.map((ex) => (
            <Link key={ex.slug} href={ex.href}
              className="group block overflow-hidden rounded-[20px] border border-[#e1d9cc] bg-white hover:-translate-y-1 hover:border-[#7a5c38] transition">
              <div className="aspect-[4/3] bg-[#f7f1e6] overflow-hidden">
                <Image src={ex.image} alt={ex.title} width={800} height={600} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="text-[15px] font-semibold leading-snug mb-2">{ex.shortTitle}</h3>
                <p className="text-[12px] leading-6 text-[#5f6871] line-clamp-2">{ex.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="bg-[#f8f5ee] border-y border-[#ded6c8] px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-[920px] grid gap-10 md:grid-cols-[180px_1fr] md:items-center">
        <div className="aspect-square rounded-full overflow-hidden border-4 border-[#e8d4b6] bg-[#f3ede2] grid place-items-center mx-auto md:mx-0">
          <span className={`${headingFont.className} text-[56px] text-[#7a5c38]`}>井</span>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">作っている人</p>
          <h2 className={`${headingFont.className} mt-3 text-[28px] sm:text-[34px] leading-[1.5] text-[#1f2a37] mb-5`}>
            井原 誠斗
          </h2>
          <p className="text-[15px] leading-[2] text-[#5f6871]">
            5 年以上 Web のしごとをしている、 工務店向けの 一人作業所みたいなものです。
            ヒアリング・設計・制作・公開後の改善まで、 全部 自分でやります。
            「あれ、 ちょっとここ直したい」 を LINE で気軽に話せる関係を 大事にしています。
          </p>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[920px] text-center">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">PRICE GUIDE</p>
        <h2 className={`${headingFont.className} mt-3 text-[28px] sm:text-[36px] leading-[1.5] text-[#1f2a37] mb-6`}>
          ご相談の目安
        </h2>
        <p className={`${headingFont.className} text-[24px] sm:text-[32px] leading-[1.5] text-[#7a5c38] mb-3`}>
          初期 {HERO_PRICE.initial} + 月 {HERO_PRICE.monthly} から
        </p>
        <p className="text-[14px] text-[#7d766b]">内容により応相談 ・ 初回ご相談は無料</p>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="px-4 py-20 sm:px-6 sm:py-28 bg-[#f8f5ee] border-t border-[#ded6c8]">
      <div className="mx-auto max-w-[920px] text-center">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">CONTACT</p>
        <h2 className={`${headingFont.className} mt-3 text-[32px] sm:text-[44px] leading-[1.5] text-[#1f2a37] mb-6`}>
          まず LINE で 写真送って 相談
        </h2>
        <p className="text-[15px] leading-[2] text-[#5f6871] mb-10">
          困りごとの状況を 写真で見せてもらえれば、 一番伝わります。
          まとまっていなくて大丈夫、 「これ何とかなる?」 だけで OK。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
             className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-full bg-[#06c755] px-9 text-[16px] font-bold text-white hover:bg-[#05b54a] hover:-translate-y-0.5 transition">
            <MessageCircle className="h-5 w-5" /> LINE で 相談を始める
          </a>
          <Link href="/#contact" className="inline-flex min-h-[60px] items-center justify-center rounded-full border-2 border-[#c8b89d] bg-white px-9 text-[16px] font-semibold text-[#1f2a37] hover:border-[#7a5c38] transition">
            メールでも OK
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-[#d8d0c1] bg-[#f7f3ec] py-8">
      <div className="mx-auto max-w-[1240px] flex flex-col items-center justify-between gap-3 px-4 text-[12px] text-[#7d766b] sm:flex-row sm:px-6">
        <span>© 2026 井原誠斗 (Ihara Frontend) — 案 3 困りごと共感 PREVIEW</span>
        <Link href="/preview" className="hover:text-[#7a5c38]">他の案と比較 →</Link>
      </div>
    </footer>
  )
}
