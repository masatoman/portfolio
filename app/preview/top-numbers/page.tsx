import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Noto_Serif_JP } from "next/font/google"
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  FileSpreadsheet,
  MessageCircle,
  Phone,
  Receipt,
} from "lucide-react"
import {
  examples,
  HERO_PRICE,
  LINE_URL,
  NUMBERS,
  problems,
} from "@/lib/local-business/landing-data"

const headingFont = Noto_Serif_JP({ subsets: ["latin"], weight: ["500", "700"] })

export const metadata: Metadata = {
  title: "案 1: 数字主導 — トップリデザイン プレビュー",
  description: "価格バッジ + 効果数字を Hero と Examples に出して即決判断を加速する案",
}

const ICONS = { FileSpreadsheet, Phone, Camera, Receipt } as const

export default function TopNumbersPreview() {
  return (
    <div className="min-h-screen bg-[#f3efe7] text-[#1f2a37]">
      <PreviewBanner />
      <Header />
      <main>
        <Hero />
        <Examples />
        <PricingDetail />
        <Process />
        <GoodFit />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

function PreviewBanner() {
  return (
    <div className="bg-[#1f2a37] text-white text-center py-2 text-[11px] font-mono tracking-wider">
      // PREVIEW: 案 1 数字主導 (Pricing-first) ・
      <Link href="/preview" className="underline ml-1">他の案と比較</Link>
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-[28px] z-20 border-b border-[#d8d0c1]/80 bg-[#f7f3ec]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-4 py-4 sm:px-6">
        <Link href="/preview/top-numbers" className="flex items-center gap-3 text-[#1f2a37]">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d7cfbf] bg-white text-base font-semibold">M</span>
          <span className={`${headingFont.className} text-[26px] tracking-[-0.04em]`}>Masato Works</span>
        </Link>
        <nav className="hidden items-center gap-8 text-[14px] font-semibold text-[#4f5b66] md:flex">
          <a href="#examples" className="hover:text-[#7a5c38]">制作例</a>
          <a href="#pricing" className="hover:text-[#7a5c38]">料金</a>
          <a href="#contact" className="hover:text-[#7a5c38]">ご相談</a>
        </nav>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="px-4 pt-10 pb-14 sm:px-6 sm:pt-14 sm:pb-20">
      <div className="mx-auto max-w-[1240px] grid gap-10 lg:grid-cols-[1fr_minmax(420px,0.95fr)] lg:items-center lg:gap-16">
        <div>
          <div className="inline-flex items-baseline gap-3 rounded-2xl border-2 border-[#a88456] bg-white px-5 py-3 mb-6 shadow-[0_8px_24px_rgba(122,92,56,0.08)]">
            <span className="text-[12px] font-semibold tracking-[0.16em] text-[#7a5c38]">価格 目安</span>
            <span className={`${headingFont.className} text-[26px] font-bold text-[#1f2a37]`}>
              初期 {HERO_PRICE.initial} <span className="text-[#7a5c38]">+</span> 月 {HERO_PRICE.monthly}
            </span>
            <span className="text-[11px] text-[#7d766b]">から</span>
          </div>
          <h1 className={`${headingFont.className} text-[40px] sm:text-[58px] leading-[1.4] tracking-[-0.05em] text-[#1f2a37]`}>
            工務店専門の<br />
            Web と 業務改善を、<br />
            <span className="text-[#7a5c38]">一人で全部</span>。
          </h1>
          <p className="mt-6 max-w-[560px] text-[16px] sm:text-[17px] leading-[2] text-[#4f5b66]">
            ANDPAD を入れるほどじゃない {HERO_PRICE.scope}。
            ホームページから 日報・写真整理・領収書まで、
            現場の流れに合わせて まとめて整えます。
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={LINE_URL} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-full bg-[#06c755] px-7 text-[15px] font-bold text-white hover:bg-[#05b54a] hover:-translate-y-0.5 transition"
            >
              <MessageCircle className="h-5 w-5" />
              LINE で 30 秒 相談
            </a>
            <Link href="#contact" className="inline-flex min-h-[56px] items-center justify-center rounded-full border-2 border-[#c8b89d] bg-white px-7 text-[15px] font-semibold text-[#1f2a37] hover:border-[#7a5c38] transition">
              メールで相談 (24h 以内返信)
            </Link>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 max-w-[520px]">
            {NUMBERS.map((n) => (
              <div key={n.l} className="border-l-2 border-[#a88456] pl-3">
                <dt className={`${headingFont.className} text-[18px] font-bold text-[#1f2a37] mb-1 leading-tight`}>{n.v}</dt>
                <dd className="text-[12px] text-[#5f6871] leading-snug">{n.l}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="relative">
          <div className="absolute inset-x-8 bottom-[-28px] top-8 rounded-[32px] bg-[#d9d0c0]/40 blur-3xl" />
          <div className="relative overflow-hidden rounded-[32px] border border-[#d8d0c1] bg-[#f8f5ee] p-4 shadow-[0_30px_70px_rgba(31,42,55,0.14)] sm:p-6">
            <Image
              src="/images/local-business/hero-business-flow-desktop.png"
              alt="工務店向け業務フローの整備イメージ"
              width={1586} height={992}
              className="hidden w-full rounded-[24px] md:block"
              priority
            />
            <Image
              src="/images/local-business/hero-business-flow-mobile.png"
              alt="工務店向け業務フローの整備イメージ"
              width={1003} height={1568}
              className="w-full rounded-[24px] md:hidden"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function Examples() {
  return (
    <section id="examples" className="bg-[#1f2a37] px-4 py-16 text-white sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#cdbda4]">EXAMPLES</p>
            <h2 className={`${headingFont.className} mt-3 text-[30px] sm:text-[42px] leading-[1.5] text-white`}>
              触れる 8 つの制作例
            </h2>
          </div>
          <p className="max-w-[420px] text-sm leading-7 text-[#cbd2d9]">
            各カードに 削減効果の概算 を表示。 全部 dev で動くデモなのでクリックして体験できます。
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {examples.map((ex) => (
            <Link
              key={ex.slug} href={ex.href}
              className="group relative overflow-hidden rounded-[20px] border border-white/10 bg-white/5 p-3 transition hover:-translate-y-1 hover:border-[#cdbda4]/60"
            >
              <div className="relative overflow-hidden rounded-[14px] border border-white/10 bg-[#f7f1e6] aspect-[4/3]">
                <Image src={ex.image} alt={ex.title} width={800} height={600} className="w-full h-full object-cover" />
                <div className="absolute left-2 top-2 rounded-full bg-[#7a5c38] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
                  {ex.savingsTag}
                </div>
              </div>
              <div className="px-2 pb-2 pt-3">
                <h3 className="text-[14px] font-semibold leading-snug text-white">{ex.shortTitle}</h3>
                <p className="mt-1 text-[11px] leading-5 text-[#cbd2d9] line-clamp-2">{ex.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function PricingDetail() {
  return (
    <section id="pricing" className="border-y border-[#ded6c8] bg-[#f8f5ee] px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1240px]">
        <div className="mx-auto max-w-[720px] text-center mb-12">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">WHAT&apos;S INCLUDED</p>
          <h2 className={`${headingFont.className} mt-3 text-[30px] sm:text-[42px] leading-[1.5] text-[#1f2a37]`}>
            初期 {HERO_PRICE.initial} に 含まれるもの
          </h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 max-w-[920px] mx-auto">
          {[
            { t: "ヒアリング 30 分", d: "現場・事務・HP のどこで時間がかかっているかを一緒に整理" },
            { t: "データ移行", d: "今 Excel や 紙で持っている情報を 新しい仕組みに移すお手伝い" },
            { t: "操作レクチャー 1 時間", d: "現場のスタッフ全員が 迷わず使えるように Zoom or 訪問でレクチャー" },
            { t: "初月 LINE サポート", d: "「これどうやるの?」 を LINE で気軽に聞ける、 翌営業日返信" },
          ].map((item) => (
            <div key={item.t} className="rounded-[20px] border border-[#e1d9cc] bg-white px-6 py-5 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-[#7a5c38] mt-0.5" />
              <div>
                <h3 className="text-[16px] font-semibold text-[#1f2a37] mb-1">{item.t}</h3>
                <p className="text-[13px] leading-7 text-[#5f6871]">{item.d}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-[12px] text-[#7d766b]">
          ※ 月額 {HERO_PRICE.monthly} は 公開後の保守 + 月 1 回までの軽微な改修 + LINE サポートを含みます
        </p>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[1240px] grid gap-6 md:grid-cols-3">
        {[
          { n: "01", t: "今の流れを伺います", d: "現場・事務・HP のどこで時間がかかっているかを一緒に整理" },
          { n: "02", t: "小さく試せる形に落とします", d: "いきなり大きく変えず、 まずは試しやすい範囲で叩き台" },
          { n: "03", t: "使いながら整えます", d: "実際の運用に合わせて調整し、 現場で回る形に" },
        ].map((s) => (
          <article key={s.n} className="rounded-[24px] border border-[#e1d9cc] bg-white px-6 py-7">
            <p className="text-sm font-semibold tracking-[0.2em] text-[#9c7d54]">{s.n}</p>
            <h3 className={`${headingFont.className} mt-3 text-[22px] leading-[1.5] text-[#1f2a37]`}>{s.t}</h3>
            <p className="mt-4 text-[14px] leading-7 text-[#5f6871]">{s.d}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

function GoodFit() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20 bg-[#f8f5ee] border-y border-[#ded6c8]">
      <div className="mx-auto max-w-[1240px]">
        <h2 className={`${headingFont.className} text-[28px] sm:text-[38px] leading-[1.5] text-[#1f2a37] text-center mb-10`}>
          こういう方に向いています
        </h2>
        <div className="grid gap-4 md:grid-cols-3 max-w-[1100px] mx-auto">
          {[
            "ANDPAD は高すぎる、 でも freee や LINE WORKS では足りない 5〜30 人の工務店",
            "Web 屋 数社見比べて 「結局いくら? 効果ある?」 を知りたい",
            "個人親方で、 月 1 万までなら投資できる",
          ].map((c) => (
            <article key={c} className="rounded-[20px] border border-[#e1d9cc] bg-white px-6 py-6 text-[14px] leading-7 text-[#44505b]">
              {c}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contact" className="px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-[920px] text-center">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">CONTACT</p>
        <h2 className={`${headingFont.className} mt-3 text-[32px] sm:text-[44px] leading-[1.5] text-[#1f2a37] mb-6`}>
          まずは LINE で 30 秒
        </h2>
        <p className="text-[15px] leading-[2] text-[#5f6871] mb-10">
          詳しい話の前に、 まず「自分の現場でも使える?」 を 30 秒で確認できます。
          写真や Excel を送ってもらえれば 具体的な相談に進めます。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
             className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-full bg-[#06c755] px-9 text-[16px] font-bold text-white hover:bg-[#05b54a] hover:-translate-y-0.5 transition">
            <MessageCircle className="h-5 w-5" /> LINE で相談する
          </a>
          <Link href="/#contact" className="inline-flex min-h-[60px] items-center justify-center rounded-full border-2 border-[#c8b89d] bg-white px-9 text-[16px] font-semibold text-[#1f2a37] hover:border-[#7a5c38] transition">
            メールフォームへ
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
        <span>© 2026 井原誠斗 (Ihara Frontend) — 案 1 数字主導 PREVIEW</span>
        <Link href="/preview" className="hover:text-[#7a5c38]">他の案と比較 →</Link>
      </div>
    </footer>
  )
}
