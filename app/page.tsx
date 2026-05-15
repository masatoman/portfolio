import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Noto_Serif_JP } from "next/font/google"
import {
  ArrowRight,
  CircleHelp,
  FileSpreadsheet,
  LayoutTemplate,
  Monitor,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
  Wrench,
} from "lucide-react"
import { BusinessContactForm } from "@/components/local-business/business-contact-form"

const headingFont = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
})

export const metadata: Metadata = {
  title: "工務店・中小企業向け Web制作と業務改善 | Ihara Frontend",
  description:
    "工務店・地域企業向けに、ホームページ制作、見積整理、電話メモ管理、現場写真の自動仕分けなど、現場と事務の流れを整える支援を行います。 ご相談無料。",
  alternates: { canonical: "/" },
}

const problems = [
  {
    icon: <FileSpreadsheet className="h-6 w-6" />,
    title: "見積の確認に時間がかかる",
    text: "協力業者から届くPDFや紙の見積書を見比べるだけで、思った以上に時間を使ってしまう。",
  },
  {
    icon: <Phone className="h-6 w-6" />,
    title: "電話内容が残りにくい",
    text: "現場確認や仕様変更のやり取りが口頭中心で、あとから確認しづらい。",
  },
  {
    icon: <Monitor className="h-6 w-6" />,
    title: "ホームページが今の会社に合っていない",
    text: "施工実績や会社の強みはあるのに、サイトでは十分に伝わっていない。",
  },
  {
    icon: <Search className="h-6 w-6" />,
    title: "資料が散らばって探しにくい",
    text: "Excel、紙、LINE、電話メモがバラバラで、必要な情報にすぐたどり着けない。",
  },
]

const services = [
  {
    icon: <Monitor className="h-10 w-10" />,
    title: "施工実績と強みが伝わるWeb制作",
    text: "施工写真、会社の姿勢、問い合わせ導線を整理し、信頼感のあるホームページへ整えます。",
  },
  {
    icon: <FileSpreadsheet className="h-10 w-10" />,
    title: "見積・資料整理の負担を軽くする",
    text: "見積書やExcelの情報を確認しやすい形にまとめ、事務作業の手戻りを減らします。",
  },
  {
    icon: <Phone className="h-10 w-10" />,
    title: "連絡と確認が流れる仕組みをつくる",
    text: "電話や打ち合わせ内容を残し、次の対応につなげやすい状態をつくります。",
  },
]

const examples = [
  {
    title: "協力業者の見積確認を軽くする",
    desc: "届いた見積書PDFを整理し、項目確認や転記の手間を減らすデモです。",
    href: "/local-business/estimate-organizer",
    image: "/images/local-business/estimate-organizer-card.svg",
  },
  {
    title: "現場連絡の抜け漏れを減らす",
    desc: "電話内容と次の対応を残し、共有漏れや確認漏れを起こしにくくするデモです。",
    href: "/local-business/call-memo-board",
    image: "/images/local-business/call-memo-board-card.svg",
  },
  {
    title: "架空の工務店サイトを実績として制作",
    desc: "施工実績と会社の姿勢が伝わる、提案用の架空コーポレートサイトを制作した実績ページです。",
    href: "/local-business/website-refresh",
    image: "/images/local-business/kazenokisha/exterior-day.png",
  },
  {
    title: "車で しゃべるだけで 日報を作る",
    desc: "帰り道に話すだけで、家に着く頃には日報が出来上がっている仕組み。事務所での残業1時間をなくすデモです。",
    href: "/local-business/voice-daily-report",
    image: "/images/local-business/voice-daily-report-card.svg",
  },
  {
    title: "現場写真を自動で仕分ける",
    desc: "1日に撮る数百枚の現場写真を、現場名・工程・撮影日で自動仕分け。「あの配筋写真どこ」で探す手間をなくすデモです。",
    href: "/local-business/site-photo-organizer",
    image: "/images/local-business/site-photo-organizer-card.svg",
  },
  {
    title: "施主向け 工程進捗ページを自動更新",
    desc: "「今どうなってる？」と聞かれるたびに写真を撮って送る手間を、自動更新の公開ページに置き換えるデモです。",
    href: "/local-business/client-progress-page",
    image: "/images/local-business/client-progress-page-card.svg",
  },
  {
    title: "領収書を撮るだけで経費に",
    desc: "現場のガソリン・建材・食事の紙の領収書を、撮るだけで日付・金額・取引先が自動入力されるデモ。電帳法にも対応。",
    href: "/local-business/receipt-expense-camera",
    image: "/images/local-business/receipt-expense-camera-card.svg",
  },
  {
    title: "図面をスマホで一発呼び出し",
    desc: "現場で「あの図面どこ」の電話をなくす。部屋名で検索 → 該当箇所だけ拡大表示。手袋でも押せる大ボタン UI のデモです。",
    href: "/local-business/drawing-quick-viewer",
    image: "/samples/floor-plan/sample-1f-framing.png",
  },
]

const trustPoints = [
  "今の仕事の流れを大きく変えずに整えます",
  "現場・事務・集客をまとめて相談できます",
  "小さく試しながら進められる形でご提案します",
]

const processSteps = [
  {
    no: "01",
    title: "今の流れを伺います",
    text: "現場、事務、ホームページのどこで時間がかかっているかを一緒に整理します。",
  },
  {
    no: "02",
    title: "小さく試せる形に落とします",
    text: "いきなり大きく変えず、まずは試しやすい範囲で叩き台をつくります。",
  },
  {
    no: "03",
    title: "使いながら整えます",
    text: "実際の運用に合わせて調整し、現場で回る形に近づけていきます。",
  },
]

const pricing = [
  {
    icon: <CircleHelp className="h-10 w-10" />,
    title: "初回のご相談",
    price: "無料",
    desc: "まずは現状を伺い、何から整えると良さそうかをお話しします。",
  },
  {
    icon: <ShieldCheck className="h-10 w-10" />,
    title: "小さな整備",
    price: "軽微な改善から",
    desc: "資料整理、テンプレート化、見直し案の作成などから始められます。",
  },
  {
    icon: <LayoutTemplate className="h-10 w-10" />,
    title: "ホームページ・資料制作",
    price: "内容に応じてお見積り",
    desc: "施工実績の見せ方や問い合わせ導線を踏まえて、必要な範囲をご提案します。",
  },
  {
    icon: <Wrench className="h-10 w-10" />,
    title: "業務の整備",
    price: "内容に応じてお見積り",
    desc: "見積整理や連絡メモなど、今の運用に合わせて無理なく整えます。",
  },
]

const fitCases = [
  "施工力には自信があるが、ホームページでは伝えきれていない",
  "協力業者との見積確認や転記作業に時間を取られている",
  "電話や口頭確認が多く、あとから見返せる形にしたい",
  "Web制作も業務改善も、まとめて相談できる相手を探している",
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3efe7] text-[#1f2a37]">
      <header className="sticky top-0 z-20 border-b border-[#d8d0c1]/80 bg-[#f7f3ec]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-6 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 whitespace-nowrap text-[#1f2a37]">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#d7cfbf] bg-white text-base font-semibold shadow-[0_10px_30px_rgba(31,42,55,0.08)]">
              M
            </span>
            <span className={`${headingFont.className} text-[26px] tracking-[-0.04em]`}>Masato Works</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[14px] font-semibold text-[#4f5b66] md:flex">
            <a href="#problems" className="transition-colors hover:text-[#7a5c38]">よくあるお悩み</a>
            <a href="#services" className="transition-colors hover:text-[#7a5c38]">できること</a>
            <a href="#examples" className="transition-colors hover:text-[#7a5c38]">制作例</a>
            <a href="#contact" className="transition-colors hover:text-[#7a5c38]">ご相談</a>
          </nav>
          <Link
            href="/portfolio"
            className="hidden rounded-full border border-[#d7cfbf] bg-white px-4 py-2 text-sm font-semibold text-[#4f5b66] transition hover:border-[#7a5c38] hover:text-[#7a5c38] sm:inline-flex"
          >
            開発者向けポートフォリオへ
          </Link>
        </div>
      </header>

      <main>
        <section className="px-4 pb-14 pt-10 sm:px-6 sm:pb-20 sm:pt-14">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_minmax(420px,1.1fr)] lg:items-end lg:gap-16">
              <div>
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d7cfbf] bg-white/80 px-4 py-2 text-[12px] font-semibold tracking-[0.14em] text-[#7a5c38]">
                  FOR BUILDERS AND LOCAL BUSINESSES
                </div>
                <h1 className={`${headingFont.className} text-[40px] leading-[1.45] tracking-[-0.05em] text-[#1f2a37] sm:text-[62px]`}>
                  現場と事務の流れを、
                  <br />
                  落ち着いて整える。
                </h1>
                <p className="mt-6 max-w-[620px] text-[17px] leading-[2] text-[#4f5b66] sm:text-[18px]">
                  工務店や地域企業向けに、ホームページ制作、見積整理、電話メモ管理などを通して、
                  日々のやり取りと会社の見え方を整えるお手伝いをしています。
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link
                    href="#contact"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#7a5c38] px-7 text-[15px] font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#694d2d]"
                  >
                    まず相談してみる
                  </Link>
                  <Link
                    href="#examples"
                    className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-[#c8b89d] bg-white px-7 text-[15px] font-semibold text-[#1f2a37] transition hover:border-[#7a5c38] hover:text-[#7a5c38]"
                  >
                    制作例を見る
                  </Link>
                </div>
                <div className="mt-8 space-y-3">
                  {trustPoints.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-3 text-sm leading-7 text-[#4f5b66]"
                    >
                      <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#a88456]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <div className="absolute inset-x-8 bottom-[-28px] top-8 rounded-[32px] bg-[#d9d0c0]/40 blur-3xl" />
                <div className="relative overflow-hidden rounded-[32px] border border-[#d8d0c1] bg-[#f8f5ee] p-4 shadow-[0_30px_70px_rgba(31,42,55,0.14)] sm:p-6">
                  <Image
                    src="/images/local-business/hero-business-flow-desktop.png"
                    alt="見積書や電話メモ、ホームページ情報を整理して業務の流れを整えるイメージ"
                    width={1586}
                    height={992}
                    className="hidden w-full rounded-[24px] md:block"
                    priority
                  />
                  <Image
                    src="/images/local-business/hero-business-flow-mobile.png"
                    alt="見積書や電話メモ、ホームページ情報を整理して業務の流れを整えるイメージ"
                    width={1003}
                    height={1568}
                    className="w-full rounded-[24px] md:hidden"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="problems" className="border-y border-[#ded6c8] bg-[#f8f5ee] px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">COMMON PAIN POINTS</p>
              <h2 className={`${headingFont.className} mt-3 text-[30px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37] sm:text-[42px]`}>
                現場でよく起きる小さな負担を、
                <br className="hidden sm:block" />
                少しずつ減らしていくために
              </h2>
            </div>
            <div className="mt-10 grid gap-5 lg:grid-cols-2">
              {problems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-[#e1d9cc] bg-white px-6 py-6 shadow-[0_10px_30px_rgba(31,42,55,0.06)]"
                >
                  <div className="flex items-center gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-full bg-[#f3ede2] text-[#7a5c38]">
                      {item.icon}
                    </div>
                    <h3 className="text-[18px] font-semibold tracking-[-0.03em] text-[#1f2a37]">{item.title}</h3>
                  </div>
                  <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="services" className="px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-10 lg:grid-cols-[0.44fr_1fr] lg:items-start">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">WHAT I CAN HELP WITH</p>
                <h2 className={`${headingFont.className} mt-3 text-[30px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[42px]`}>
                  施工会社の流れに合わせて、
                  <br />
                  整えられること
                </h2>
              </div>
              <div className="grid gap-5 md:grid-cols-3">
                {services.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-[28px] border border-[#e1d9cc] bg-[linear-gradient(180deg,#fffdf9,#f6f0e7)] p-7 shadow-[0_14px_40px_rgba(31,42,55,0.06)]"
                  >
                    <div className="text-[#7a5c38]">{item.icon}</div>
                    <h3 className="mt-5 text-[20px] font-semibold leading-[1.55] tracking-[-0.04em] text-[#1f2a37]">{item.title}</h3>
                    <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">{item.text}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="examples" className="bg-[#1f2a37] px-4 py-14 text-white sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[12px] font-semibold tracking-[0.2em] text-[#cdbda4]">EXAMPLES</p>
                <h2 className={`${headingFont.className} mt-3 text-[30px] leading-[1.55] tracking-[-0.04em] text-white sm:text-[42px]`}>
                  ご相談イメージが伝わる
                  <br />
                  制作例
                </h2>
              </div>
              <p className="max-w-[420px] text-sm leading-7 text-[#cbd2d9]">
                派手なシステムよりも、現場や事務の流れに馴染む形を前提にしています。
              </p>
            </div>
            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {examples.map((item, index) => (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`group overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 transition hover:-translate-y-1 hover:border-[#cdbda4]/60 hover:bg-white/8 ${
                    index === 0 ? "lg:col-span-2" : ""
                  }`}
                >
                  <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-[#f7f1e6]">
                    <div className="absolute right-4 top-4 z-10 rounded-full bg-[#7a5c38] px-3 py-1 text-[11px] font-semibold tracking-[0.14em] text-white">
                      DEMO
                    </div>
                    <Image
                      src={item.image}
                      alt={item.title}
                      width={1200}
                      height={720}
                      className="w-full transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>
                  <div className="px-2 pb-3 pt-5">
                    <h3 className="text-[22px] font-semibold leading-[1.5] tracking-[-0.04em] text-white">{item.title}</h3>
                    <p className="mt-3 text-[15px] leading-8 text-[#cbd2d9]">{item.desc}</p>
                    <p className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d9c29a]">
                      デモを見る <ArrowRight className="h-4 w-4" />
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-6 md:grid-cols-3">
              {processSteps.map((item) => (
                <article
                  key={item.no}
                  className="rounded-[24px] border border-[#e1d9cc] bg-white px-6 py-7 shadow-[0_12px_30px_rgba(31,42,55,0.05)]"
                >
                  <p className="text-sm font-semibold tracking-[0.2em] text-[#9c7d54]">{item.no}</p>
                  <h3 className={`${headingFont.className} mt-3 text-[24px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37]`}>
                    {item.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="border-y border-[#ded6c8] bg-[#f8f5ee] px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1240px]">
            <div className="mx-auto max-w-[720px] text-center">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">PRICE GUIDE</p>
              <h2 className={`${headingFont.className} mt-3 text-[30px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[42px]`}>
                ご相談の目安
              </h2>
            </div>
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {pricing.map((item) => (
                <article
                  key={item.title}
                  className="rounded-[24px] border border-[#e1d9cc] bg-white px-5 py-7 shadow-[0_12px_30px_rgba(31,42,55,0.05)]"
                >
                  <div className="text-[#7a5c38]">{item.icon}</div>
                  <h3 className="mt-5 text-[18px] font-semibold tracking-[-0.03em] text-[#1f2a37]">{item.title}</h3>
                  <div className={`${headingFont.className} mt-3 text-[28px] leading-[1.4] tracking-[-0.04em] text-[#1f2a37]`}>
                    {item.price}
                  </div>
                  <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">{item.desc}</p>
                </article>
              ))}
            </div>
            <p className="mt-4 text-right text-[13px] font-medium text-[#7d766b]">※内容によりお見積りします</p>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1240px]">
            <div className="rounded-[32px] border border-[#ddd4c7] bg-[linear-gradient(135deg,#fffdf9,#f2ebdf)] p-8 shadow-[0_18px_45px_rgba(31,42,55,0.06)] sm:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.52fr_1fr] lg:items-start">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">GOOD FIT</p>
                  <h2 className={`${headingFont.className} mt-3 text-[30px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[40px]`}>
                    こういうご相談に
                    <br />
                    向いています
                  </h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {fitCases.map((item) => (
                    <article key={item} className="rounded-[20px] border border-white/80 bg-white/80 px-5 py-5">
                      <p className="text-[15px] leading-8 text-[#44505b]">{item}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="grid gap-8 overflow-hidden rounded-[36px] border border-[#d9cfbf] bg-[#f7f3ec] p-6 shadow-[0_26px_70px_rgba(31,42,55,0.1)] lg:grid-cols-[0.92fr_1.08fr] lg:p-10">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[12px] font-semibold tracking-[0.2em] text-[#8a7a63]">CONTACT</p>
                  <h2 className={`${headingFont.className} mt-3 text-[32px] leading-[1.6] tracking-[-0.04em] text-[#1f2a37] sm:text-[44px]`}>
                    今のやり方を活かしながら、
                    <br />
                    無理なく整える方法を
                    <br />
                    一緒に考えます。
                  </h2>
                  <p className="mt-5 max-w-[520px] text-[16px] leading-8 text-[#5f6871]">
                    難しい言葉で押し切るのではなく、現場や事務の流れに合わせて、少しずつ整えられる形をご提案します。
                    ホームページのご相談でも、業務改善のご相談でも大丈夫です。
                  </p>
                </div>
                <div className="mt-8 rounded-[24px] border border-[#e1d9cc] bg-white/70 px-5 py-5 text-sm leading-7 text-[#5f6871]">
                  まずは「今どこで手間がかかっているか」だけでも大丈夫です。まとまっていない段階でも、そのままお聞かせください。
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
          </div>
        </div>
      </footer>
    </div>
  )
}
