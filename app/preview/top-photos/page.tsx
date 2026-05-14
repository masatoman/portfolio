import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Noto_Serif_JP } from "next/font/google"
import { ArrowRight, MessageCircle } from "lucide-react"
import { examples, HERO_PRICE, LINE_URL } from "@/lib/local-business/landing-data"

const headingFont = Noto_Serif_JP({ subsets: ["latin"], weight: ["500", "700"] })

export const metadata: Metadata = {
  title: "案 2: 写真主役 — トップリデザイン プレビュー",
  description: "hiraomakoto 流。 大きく・静かに・一覧で。 制作例を主役にして関係構築型に",
}

export default function TopPhotosPreview() {
  return (
    <div className="min-h-screen bg-[#f3efe7] text-[#1f2a37]">
      <PreviewBanner />
      <main>
        <Hero />
        <ExamplesSection />
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
      // PREVIEW: 案 2 写真主役 (Works-first, hiraomakoto 流) ・
      <Link href="/preview" className="underline ml-1">他の案と比較</Link>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative">
      <div className="relative h-[88vh] min-h-[640px] overflow-hidden">
        <Image
          src="/images/local-business/hero-business-flow-desktop.png"
          alt="工務店の現場業務"
          fill priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f2a37]/10 via-[#1f2a37]/30 to-[#1f2a37]/70" />
        <div className="absolute top-6 left-6 sm:top-8 sm:left-8 flex items-center gap-3 text-white">
          <span className="grid h-11 w-11 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur text-base font-semibold">M</span>
          <span className={`${headingFont.className} text-[22px] tracking-[-0.04em]`}>Masato Works</span>
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="mx-auto max-w-[1240px] w-full px-4 pb-16 sm:px-6 sm:pb-20">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#f3efe7] mb-5">
              工務店専門の Web と 業務改善
            </p>
            <h1 className={`${headingFont.className} text-white text-[44px] sm:text-[68px] leading-[1.3] tracking-[-0.05em] max-w-[860px]`}>
              現場の流れを、<br />
              <span className="text-[#e8d4b6]">そっと</span>整える。
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#examples" className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-4 text-[15px] font-semibold text-[#1f2a37] hover:bg-[#e8d4b6] transition">
                8 つの 制作例を見る <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#contact" className="inline-flex items-center gap-2 rounded-full border-2 border-white/60 bg-white/10 backdrop-blur px-7 py-4 text-[15px] font-semibold text-white hover:bg-white/20 transition">
                ご相談はこちら
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ExamplesSection() {
  const main = examples.slice(0, 3)
  const sub = examples.slice(3)
  return (
    <section id="examples" className="bg-[#f8f5ee] py-20 sm:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        <div className="mb-14">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">EXAMPLES</p>
          <h2 className={`${headingFont.className} mt-3 text-[34px] sm:text-[48px] leading-[1.4] tracking-[-0.04em] text-[#1f2a37]`}>
            触れる 8 つの制作例
          </h2>
          <p className="mt-5 max-w-[600px] text-[15px] leading-[2] text-[#5f6871]">
            派手なシステムではなく、 現場や事務の流れに馴染む形を前提にしています。 すべて dev 環境で動くデモです。
          </p>
        </div>

        <div className="space-y-8 mb-16">
          <BigCard demo={main[0]} variant="full" />
          <div className="grid gap-8 md:grid-cols-2">
            <BigCard demo={main[1]} variant="half" />
            <BigCard demo={main[2]} variant="half" />
          </div>
        </div>

        <div className="border-t border-[#d8d0c1] pt-10">
          <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63] mb-5">他にもこんな例</p>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {sub.map((ex) => (
              <Link key={ex.slug} href={ex.href}
                className="group block overflow-hidden rounded-[16px] border border-[#e1d9cc] bg-white hover:-translate-y-1 transition">
                <div className="aspect-[4/3] bg-[#f7f1e6] overflow-hidden">
                  <Image src={ex.image} alt={ex.title} width={600} height={450} className="w-full h-full object-cover" />
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-semibold text-[#1f2a37] leading-snug">{ex.shortTitle}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function BigCard({ demo, variant }: { demo: typeof examples[number]; variant: "full" | "half" }) {
  return (
    <Link href={demo.href} className="group block overflow-hidden rounded-[28px] border border-[#e1d9cc] bg-white hover:-translate-y-1 hover:border-[#7a5c38] transition">
      <div className={`relative overflow-hidden bg-[#f7f1e6] ${variant === "full" ? "aspect-[21/9]" : "aspect-[16/10]"}`}>
        <Image src={demo.image} alt={demo.title}
          width={variant === "full" ? 1800 : 1000}
          height={variant === "full" ? 770 : 625}
          className="w-full h-full object-cover transition duration-500 group-hover:scale-[1.02]" />
        <div className="absolute right-4 top-4 rounded-full bg-[#7a5c38] px-3 py-1 text-[11px] font-semibold tracking-wide text-white">DEMO</div>
      </div>
      <div className="px-7 py-6">
        <h3 className={`${headingFont.className} text-[24px] sm:text-[28px] leading-[1.5] tracking-[-0.03em] text-[#1f2a37]`}>{demo.title}</h3>
        <p className="mt-3 text-[15px] leading-8 text-[#5f6871]">{demo.desc}</p>
        <p className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-[#7a5c38]">
          デモを見る <ArrowRight className="h-4 w-4" />
        </p>
      </div>
    </Link>
  )
}

function About() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[920px] grid gap-10 md:grid-cols-[200px_1fr] md:items-center">
        <div className="aspect-square rounded-full overflow-hidden border-4 border-[#e8d4b6] bg-[#f3ede2] grid place-items-center mx-auto md:mx-0">
          <span className={`${headingFont.className} text-[64px] text-[#7a5c38]`}>井</span>
        </div>
        <div>
          <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">ABOUT</p>
          <h2 className={`${headingFont.className} mt-3 text-[28px] sm:text-[36px] leading-[1.5] text-[#1f2a37] mb-5`}>
            井原 誠斗 (Ihara Masato)
          </h2>
          <p className="text-[15px] leading-[2] text-[#5f6871]">
            5 年以上、 Web のしごとをしています。 ホームページ・業務アプリ・既存サイトの改善まで、
            企画から納品まで すべて 一人で組み上げます。
            お客様自身では作れない部分を こちらで全部かたちにして、 お渡しします。
          </p>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="bg-[#f8f5ee] border-y border-[#ded6c8] px-4 py-16 sm:px-6 sm:py-20">
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
    <section id="contact" className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-[920px] text-center">
        <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">CONTACT</p>
        <h2 className={`${headingFont.className} mt-3 text-[32px] sm:text-[44px] leading-[1.5] text-[#1f2a37] mb-6`}>
          ご相談はこちら
        </h2>
        <p className="text-[15px] leading-[2] text-[#5f6871] mb-10">
          現場や事務の流れに合わせて、 少しずつ整えられる形をご提案します。
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer"
             className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-full bg-[#06c755] px-9 text-[16px] font-bold text-white hover:bg-[#05b54a] hover:-translate-y-0.5 transition">
            <MessageCircle className="h-5 w-5" /> LINE で相談
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
        <span>© 2026 井原誠斗 (Ihara Frontend) — 案 2 写真主役 PREVIEW</span>
        <Link href="/preview" className="hover:text-[#7a5c38]">他の案と比較 →</Link>
      </div>
    </footer>
  )
}
