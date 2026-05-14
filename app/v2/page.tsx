import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Noto_Serif_JP } from "next/font/google"
import { ArrowRight, MessageCircle, Phone } from "lucide-react"
import { BusinessContactForm } from "@/components/local-business/business-contact-form"

const headingFont = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
})

export const metadata: Metadata = {
  title: "工務店のことなら、 まず話を聞かせてください | 井原誠斗",
  description:
    "工務店の事務と現場の困りごとを、 ホームページ・見積整理・電話メモ・写真管理など 何から整えるか 一緒に考えます。 初回相談は無料です。",
  alternates: { canonical: "/v2" },
  robots: { index: false, follow: false }, // A/B 検証用ページ、 本番公開しない
}

const consultationExamples = [
  "見積の整理に時間がかかる",
  "電話の内容が残らない",
  "ホームページが古いまま",
  "写真がどこにあるか分からない",
  "現場と事務所のやり取りを楽にしたい",
  "図面を現場でぱっと出したい",
  "領収書の経費入力が面倒",
  "若い職人に伝わる仕組みがほしい",
]

const pastWorks = [
  {
    title: "協力業者の見積確認を軽くする",
    desc: "届いた見積書PDFを整理し、 項目確認や転記の手間を減らす",
    href: "/local-business/estimate-organizer",
    image: "/images/local-business/estimate-organizer-card.svg",
  },
  {
    title: "現場連絡の抜け漏れを減らす",
    desc: "電話内容と次の対応を残し、 共有漏れを起こしにくくする",
    href: "/local-business/call-memo-board",
    image: "/images/local-business/call-memo-board-card.svg",
  },
  {
    title: "工務店のホームページを制作",
    desc: "施工実績と会社の姿勢が伝わる、 提案用の架空コーポレートサイト",
    href: "/local-business/website-refresh",
    image: "/images/local-business/kazenokisha/exterior-day.png",
  },
  {
    title: "車で しゃべるだけで 日報を作る",
    desc: "帰り道に話すだけで、 家に着く頃には日報が出来上がっている仕組み",
    href: "/local-business/voice-daily-report",
    image: "/images/local-business/voice-daily-report-card.svg",
  },
  {
    title: "現場写真を自動で仕分ける",
    desc: "1日に撮る数百枚の写真を、 現場名・工程・日付で自動仕分け",
    href: "/local-business/site-photo-organizer",
    image: "/images/local-business/site-photo-organizer-card.svg",
  },
  {
    title: "施主向け 工程進捗ページ",
    desc: "「今どうなってる?」 と聞かれるたびに送る手間を、 自動更新のページに",
    href: "/local-business/client-progress-page",
    image: "/images/local-business/client-progress-page-card.svg",
  },
  {
    title: "領収書を撮るだけで経費に",
    desc: "現場の領収書を撮るだけで日付・金額・取引先を自動入力。 電帳法にも対応",
    href: "/local-business/receipt-expense-camera",
    image: "/images/local-business/receipt-expense-camera-card.svg",
  },
  {
    title: "図面をスマホで一発呼び出し",
    desc: "現場で「あの図面どこ」 をなくす。 部屋名で検索、 手袋でも押せる大ボタン",
    href: "/local-business/drawing-quick-viewer",
    image: "/samples/floor-plan/sample-1f-framing.png",
  },
]

const processSteps = [
  {
    no: "01",
    title: "まず話を聞きます",
    text: "現場・事務・ホームページのどこで時間がかかっているか、 一緒に整理します。 まとまっていなくて大丈夫です。",
  },
  {
    no: "02",
    title: "小さく試します",
    text: "いきなり大きく変えず、 試しやすい範囲で叩き台をつくります。",
  },
  {
    no: "03",
    title: "使いながら整えます",
    text: "実際の運用に合わせて調整し、 現場で回る形に近づけていきます。",
  },
]

export default function HomePageV2() {
  return (
    <div className="min-h-screen bg-[#f3efe7] text-[#1f2a37]">
      <header className="sticky top-0 z-20 border-b border-[#d8d0c1]/80 bg-[#f7f3ec]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-4 py-4 sm:px-6">
          <Link href="/v2" className="flex items-center gap-3 whitespace-nowrap text-[#1f2a37]">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d7cfbf] bg-white text-base font-semibold shadow-[0_10px_30px_rgba(31,42,55,0.08)]">
              井
            </span>
            <span className={`${headingFont.className} text-[22px] tracking-[-0.04em] sm:text-[24px]`}>
              井原誠斗 <span className="text-[14px] font-normal text-[#7d766b]">/ いはら まさと</span>
            </span>
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center rounded-full bg-[#7a5c38] px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#694d2d]"
          >
            無料相談する
          </a>
        </div>
      </header>

      <main>
        {/* HERO: 相談入口 */}
        <section className="px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-20">
          <div className="mx-auto max-w-[920px] text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d7cfbf] bg-white/80 px-4 py-2 text-[12px] font-semibold tracking-[0.14em] text-[#7a5c38]">
              工務店・地域企業の方へ
            </div>
            <h1 className={`${headingFont.className} text-[36px] leading-[1.45] tracking-[-0.04em] text-[#1f2a37] sm:text-[56px]`}>
              現場のことなら、
              <br />
              まず話を聞かせてください。
            </h1>
            <p className="mx-auto mt-7 max-w-[640px] text-[16px] leading-[2] text-[#4f5b66] sm:text-[18px]">
              ホームページ・見積・電話メモ・写真・図面 ──
              <br className="hidden sm:block" />
              工務店の <strong className="text-[#1f2a37]">事務と現場の困りごと</strong> を、
              <br className="hidden sm:block" />
              何から整えればいいか 一緒に考えます。
            </p>

            {/* 3 ルート CTA */}
            <div className="mt-10 grid gap-3 sm:mx-auto sm:max-w-[600px] sm:grid-cols-3">
              <a
                href="tel:090-XXXX-XXXX"
                className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-full bg-[#7a5c38] px-5 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#694d2d]"
              >
                <Phone className="h-4 w-4" />
                電話で話す
              </a>
              <a
                href="https://line.me/ti/p/~YOUR_LINE_ID"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-full border-2 border-[#06c755] bg-white px-5 text-[15px] font-semibold text-[#06c755] transition hover:-translate-y-0.5 hover:bg-[#06c755]/5"
              >
                <MessageCircle className="h-4 w-4" />
                LINE で送る
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-[60px] items-center justify-center gap-2 rounded-full border border-[#c8b89d] bg-white px-5 text-[15px] font-semibold text-[#1f2a37] transition hover:-translate-y-0.5 hover:border-[#7a5c38] hover:text-[#7a5c38]"
              >
                フォームを書く
              </a>
            </div>

            <p className="mt-6 text-[13px] text-[#7d766b]">
              初回のご相談は無料です。 まとまっていない段階でも、 そのままお聞かせください。
            </p>
          </div>
        </section>

        {/* こんな相談 */}
        <section className="border-y border-[#ded6c8] bg-[#f8f5ee] px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1080px]">
            <div className="mx-auto max-w-[640px] text-center">
              <h2 className={`${headingFont.className} text-[26px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[36px]`}>
                こんなご相談を受けています
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">
                これ以外の困りごとも 大丈夫です。
                <br />
                「何から相談したらいいか分からない」 でも OK。
              </p>
            </div>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {consultationExamples.map((item) => (
                <div
                  key={item}
                  className="rounded-[20px] border border-[#e1d9cc] bg-white px-5 py-4 text-center text-[15px] leading-7 text-[#44505b] shadow-[0_8px_20px_rgba(31,42,55,0.04)]"
                >
                  「{item}」
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 進め方 */}
        <section className="px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1080px]">
            <div className="mx-auto max-w-[640px] text-center">
              <h2 className={`${headingFont.className} text-[26px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[36px]`}>
                進め方
              </h2>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {processSteps.map((item) => (
                <article
                  key={item.no}
                  className="rounded-[24px] border border-[#e1d9cc] bg-white px-6 py-7 shadow-[0_12px_30px_rgba(31,42,55,0.05)]"
                >
                  <p className="text-sm font-semibold tracking-[0.2em] text-[#9c7d54]">{item.no}</p>
                  <h3 className={`${headingFont.className} mt-3 text-[22px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37]`}>
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 料金 1 ブロック */}
        <section className="border-y border-[#ded6c8] bg-[#f8f5ee] px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className={`${headingFont.className} text-[26px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[36px]`}>
              料金について
            </h2>
            <div className="mt-8 rounded-[28px] border border-[#e1d9cc] bg-white px-8 py-10 shadow-[0_18px_40px_rgba(31,42,55,0.06)]">
              <div className={`${headingFont.className} text-[34px] leading-[1.3] tracking-[-0.04em] text-[#1f2a37] sm:text-[42px]`}>
                初回のご相談は <span className="text-[#7a5c38]">無料</span>
              </div>
              <p className="mt-5 text-[15px] leading-8 text-[#5f6871]">
                話を伺ってから、 内容に応じてお見積りします。
                <br />
                坪単価のように 「決まったメニュー」 はありません。
                <br />
                <span className="text-[#1f2a37] font-semibold">いきなり契約を急かすことはしません。</span>
              </p>
            </div>
          </div>
        </section>

        {/* これまで作ってきたもの (デモ セカンダリ) */}
        <section className="px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">PAST WORKS</p>
              <h2 className={`${headingFont.className} mt-3 text-[26px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[36px]`}>
                これまで作ってきたもの
              </h2>
              <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">
                「これと同じものを作る」 ではなく、
                <br className="hidden sm:block" />
                「こういう手の動かし方をする職人です」 の参考に。
              </p>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {pastWorks.map((item) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group overflow-hidden rounded-[20px] border border-[#e1d9cc] bg-white p-3 transition hover:-translate-y-0.5 hover:border-[#7a5c38]/60"
                >
                  <div className="relative overflow-hidden rounded-[14px] border border-[#e1d9cc] bg-[#f7f1e6]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={1200}
                      height={720}
                      className="w-full transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="px-2 pb-2 pt-4">
                    <h3 className="text-[15px] font-semibold leading-[1.5] tracking-[-0.02em] text-[#1f2a37]">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-[13px] leading-7 text-[#5f6871]">{item.desc}</p>
                    <p className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-[#7a5c38]">
                      見る <ArrowRight className="h-3 w-3" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="px-4 pb-20 pt-4 sm:px-6 sm:pb-24">
          <div className="mx-auto max-w-[1080px]">
            <div className="grid gap-8 overflow-hidden rounded-[32px] border border-[#d9cfbf] bg-[#f7f3ec] p-6 shadow-[0_26px_70px_rgba(31,42,55,0.1)] lg:grid-cols-[0.9fr_1.1fr] lg:p-10">
              <div className="flex flex-col justify-between">
                <div>
                  <h2 className={`${headingFont.className} text-[28px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[36px]`}>
                    まずは話を聞かせてください。
                  </h2>
                  <p className="mt-5 max-w-[460px] text-[15px] leading-8 text-[#5f6871]">
                    まとまっていない段階でも、 そのまま大丈夫です。
                    どの相談方法でも、 こちらから返事します。
                  </p>
                </div>

                {/* 電話 / LINE (再掲) */}
                <div className="mt-8 space-y-3">
                  <a
                    href="tel:090-XXXX-XXXX"
                    className="flex items-center gap-4 rounded-[20px] border border-[#e1d9cc] bg-white px-5 py-4 transition hover:border-[#7a5c38] hover:-translate-y-0.5"
                  >
                    <Phone className="h-5 w-5 text-[#7a5c38]" />
                    <div>
                      <div className="text-[13px] text-[#7d766b]">電話で話す</div>
                      <div className="text-[18px] font-semibold tracking-tight text-[#1f2a37]">090-XXXX-XXXX</div>
                    </div>
                  </a>
                  <a
                    href="https://line.me/ti/p/~YOUR_LINE_ID"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 rounded-[20px] border border-[#e1d9cc] bg-white px-5 py-4 transition hover:border-[#06c755] hover:-translate-y-0.5"
                  >
                    <MessageCircle className="h-5 w-5 text-[#06c755]" />
                    <div>
                      <div className="text-[13px] text-[#7d766b]">LINE で送る</div>
                      <div className="text-[15px] font-semibold tracking-tight text-[#1f2a37]">気軽にメッセージから</div>
                    </div>
                  </a>
                </div>
              </div>
              <BusinessContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d8d0c1] bg-[#f7f3ec] py-10">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-3 px-4 text-[12px] text-[#7d766b] sm:flex-row sm:px-6">
          <span>© 2026 井原誠斗 (Ihara Frontend)</span>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1.5">
            <Link href="/portfolio" className="hover:text-[#7a5c38] transition-colors">
              開発者向けポートフォリオ
            </Link>
            <Link href="/lab" className="hover:text-[#7a5c38] transition-colors">
              Lab — AI ツール / 個人開発
            </Link>
            <Link href="/" className="hover:text-[#7a5c38] transition-colors">
              旧トップ (v1)
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
