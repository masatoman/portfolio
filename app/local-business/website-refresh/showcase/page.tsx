import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Noto_Serif_JP } from "next/font/google"
import { ArrowLeft, ArrowRight, Clock3, Home, MapPin, Phone } from "lucide-react"

const headingFont = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
})

export const metadata: Metadata = {
  title: "風ノ木舎建築工房 | 架空の工務店サイト",
  description: "実績用に制作した、架空の工務店Webサイトです。施工実績、会社の姿勢、問い合わせ導線が伝わる構成で作成しています。",
}

const works = [
  {
    title: "中庭とつながる平屋",
    place: "埼玉県越谷市",
    text: "軒下の影と木の天井がゆるやかにつながる、庭中心の住まい。",
    palette: "from-[#cedae1] via-[#ece3d6] to-[#b48762]",
    size: "lg:col-span-7 lg:min-h-[520px]",
  },
  {
    title: "光庭を囲む住まい",
    place: "千葉県流山市",
    text: "家族の気配がやわらかく伝わる、明るい中庭のある計画。",
    palette: "from-[#d5e0e7] via-[#eee6da] to-[#a77e5e]",
    size: "lg:col-span-5 lg:min-h-[520px]",
  },
  {
    title: "土間のある木の家",
    place: "東京都青梅市",
    text: "庭仕事や趣味道具が自然と暮らしに溶け込む、土間中心の住まい。",
    palette: "from-[#d4dee4] via-[#f1e8dc] to-[#c4976e]",
    size: "lg:col-span-4 lg:min-h-[420px]",
  },
  {
    title: "勾配天井の二階建て",
    place: "埼玉県川口市",
    text: "光の入り方と風の通り道を整えた、家族の居場所が広がる住まい。",
    palette: "from-[#c9d8df] via-[#ebe0d3] to-[#b88a65]",
    size: "lg:col-span-8 lg:min-h-[420px]",
  },
]

const strengths = [
  {
    title: "設計から施工まで一貫して向き合う",
    text: "敷地条件や暮らし方を丁寧に伺いながら、設計と施工の距離が近い体制で進める想定です。",
  },
  {
    title: "木の質感と光のやわらかさを大切にする",
    text: "大きな装飾より、手ざわりや日々の居心地が伝わる写真とコピーを中心にしています。",
  },
  {
    title: "相談しやすい接点を最後まで保つ",
    text: "施工実績を見たあとに迷わず相談できるよう、電話と問い合わせの導線を整理しています。",
  },
]

export default function BuilderShowcasePage() {
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#1f2a37]">
      <header className="border-b border-[#ddd4c7] bg-[#f8f4ed]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/local-business/website-refresh" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7a5c38]">
            <ArrowLeft className="h-4 w-4" />
            実績ページへ戻る
          </Link>
          <div className="text-sm font-semibold tracking-[0.18em] text-[#8a7a63]">FICTIONAL BUILDER SITE</div>
        </div>
      </header>

      <main>
        <section className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10">
          <div className="mx-auto max-w-[1320px]">
            <div className="relative overflow-hidden rounded-[40px] border border-[#d7cebf] bg-[#ece3d6] shadow-[0_28px_80px_rgba(31,42,55,0.14)]">
              <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
                <div className="relative min-h-[520px] overflow-hidden sm:min-h-[620px]">
                  <Image
                    src="/images/local-business/kazenokisha/exterior-day.png"
                    alt="風ノ木舎建築工房の外観"
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,35,44,0.06),rgba(27,35,44,0.1))]" />
                  <div className="absolute left-6 top-6 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#8a7a63] backdrop-blur sm:left-8 sm:top-8">
                    KAZENOKISHA ARCHITECTS
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:max-w-[74%]">
                    <div className="rounded-[32px] bg-[#f8f4ed]/92 p-6 shadow-[0_18px_45px_rgba(31,42,55,0.12)] backdrop-blur sm:p-8">
                      <h1 className={`${headingFont.className} text-[38px] leading-[1.45] tracking-[-0.05em] text-[#1f2a37] sm:text-[60px]`}>
                        風景になじむ家を、
                        <br />
                        丁寧につくる。
                      </h1>
                      <p className="mt-5 max-w-[34rem] text-[15px] leading-8 text-[#5f6871] sm:text-[17px]">
                        埼玉・千葉エリアを中心に、木の質感と暮らしやすさを大切にした住まいづくりを行う、
                        架空の工務店サイトです。
                      </p>
                      <div className="mt-7 flex flex-wrap gap-3">
                        <div className="rounded-full bg-[#7a5c38] px-5 py-3 text-sm font-semibold text-white">施工実績を見る</div>
                        <div className="rounded-full border border-[#cfbea2] bg-white px-5 py-3 text-sm font-semibold text-[#1f2a37]">家づくりを相談する</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between bg-[#f8f5ee] p-6 sm:p-8 lg:p-10">
                  <div>
                    <p className="text-xs font-semibold tracking-[0.22em] text-[#8a7a63]">PHILOSOPHY</p>
                    <h2 className={`${headingFont.className} mt-4 text-[30px] leading-[1.6] tracking-[-0.04em] text-[#1f2a37] sm:text-[40px]`}>
                      木の手ざわりと、
                      <br />
                      光のやわらかさを
                      <br />
                      暮らしの中心へ。
                    </h2>
                    <p className="mt-5 text-[15px] leading-8 text-[#5f6871]">
                      言葉を増やしすぎず、写真と短いコピーでどんな家づくりを大切にしている会社なのかが伝わるように設計しています。
                    </p>
                  </div>

                  <div className="mt-8 space-y-3">
                    <div className="flex items-start gap-3 rounded-[22px] border border-[#e4dacc] bg-white px-4 py-4 text-sm leading-7 text-[#5f6871]">
                      <Home className="mt-1 h-4 w-4 text-[#8a7a63]" />
                      設計・施工 / リノベーション / 造作家具
                    </div>
                    <div className="flex items-start gap-3 rounded-[22px] border border-[#e4dacc] bg-white px-4 py-4 text-sm leading-7 text-[#5f6871]">
                      <MapPin className="mt-1 h-4 w-4 text-[#8a7a63]" />
                      埼玉県川口市を拠点に、埼玉・千葉・東京西部を中心に対応
                    </div>
                    <div className="flex items-start gap-3 rounded-[22px] border border-[#e4dacc] bg-white px-4 py-4 text-sm leading-7 text-[#5f6871]">
                      <Clock3 className="mt-1 h-4 w-4 text-[#8a7a63]" />
                      9:00 - 18:00 / 日曜・祝日休
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto flex max-w-[1320px] flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">WORKS</p>
              <h2 className={`${headingFont.className} mt-3 text-[34px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37] sm:text-[46px]`}>
                写真の余韻で、
                <br />
                施工実績を見せる
              </h2>
            </div>
            <p className="max-w-[31rem] text-[15px] leading-8 text-[#5f6871]">
              1枚ずつ均等なカードにせず、写真面積に強弱をつけて、施工実績を「一覧」ではなく「作品群」として見せる構成にしています。
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-[1320px] gap-6 lg:grid-cols-12">
            {works.map((work, index) => (
              <article
                key={work.title}
                className={`overflow-hidden rounded-[34px] border border-[#ddd4c7] bg-white shadow-[0_20px_48px_rgba(31,42,55,0.08)] ${work.size}`}
              >
                <div className={`relative h-[280px] ${index === 0 ? "lg:h-[360px]" : ""}`}>
                  <Image
                    src={
                      index === 0
                        ? "/images/local-business/kazenokisha/living-dining.png"
                        : index === 1
                          ? "/images/local-business/kazenokisha/kitchen.png"
                          : index === 2
                            ? "/images/local-business/kazenokisha/stair-detail.png"
                            : "/images/local-business/kazenokisha/exterior-evening.png"
                    }
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#8a7a63]">{work.place}</p>
                  <h3 className={`${headingFont.className} mt-3 text-[28px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>
                    {work.title}
                  </h3>
                  <p className="mt-3 max-w-[32rem] text-[15px] leading-8 text-[#5f6871]">{work.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#1f2a37] px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#d4c2a6]">ABOUT THE COMPANY</p>
              <h2 className={`${headingFont.className} mt-3 text-[34px] leading-[1.55] tracking-[-0.04em] text-white sm:text-[46px]`}>
                会社の姿勢は、
                <br />
                白いカードではなく
                <br />
                余白で語る。
              </h2>
              <p className="mt-5 max-w-[34rem] text-[15px] leading-8 text-white/72">
                このセクションは、会社の紹介文を長く読ませるのではなく、短い考え方と静かなレイアウトで、
                信頼感を積み上げる役割にしています。
              </p>
            </div>

            <div className="space-y-4">
              {strengths.map((item, index) => (
                <article
                  key={item.title}
                  className={`rounded-[30px] border border-white/10 px-6 py-6 sm:px-7 ${
                    index === 1 ? "bg-[#f7f1e8] text-[#1f2a37]" : "bg-white/5 text-white"
                  }`}
                >
                  <p className={`text-xs font-semibold tracking-[0.18em] ${index === 1 ? "text-[#8a7a63]" : "text-[#d4c2a6]"}`}>
                    0{index + 1}
                  </p>
                  <h3 className={`${headingFont.className} mt-3 text-[28px] leading-[1.5] tracking-[-0.04em]`}>
                    {item.title}
                  </h3>
                  <p className={`mt-3 text-[15px] leading-8 ${index === 1 ? "text-[#5f6871]" : "text-white/72"}`}>
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
              <article className="rounded-[34px] border border-[#ddd4c7] bg-[#f8f5ee] p-7 shadow-[0_18px_44px_rgba(31,42,55,0.06)] sm:p-8">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">CONTACT</p>
                <h2 className={`${headingFont.className} mt-4 text-[32px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37]`}>
                  住まいのことを、
                  <br />
                  まずは気軽に
                  <br />
                  相談できるように。
                </h2>
                <p className="mt-5 text-[15px] leading-8 text-[#5f6871]">
                  最後は電話・問い合わせ・施工実績の導線を整理し、スマホでも迷わず次へ進めるようにしています。
                </p>
              </article>

              <article className="overflow-hidden rounded-[34px] border border-[#d8cfbf] bg-white shadow-[0_24px_60px_rgba(31,42,55,0.1)]">
                <div className="grid lg:grid-cols-[0.94fr_1.06fr]">
                  <div className="p-6 sm:p-8">
                    <div className="relative h-full min-h-[280px] overflow-hidden rounded-[28px]">
                      <Image
                        src="/images/local-business/kazenokisha/exterior-evening.png"
                        alt="夕景の外観写真"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col justify-between p-6 sm:p-8">
                    <div>
                      <p className="text-sm font-semibold text-[#1f2a37]">資料請求・相談予約</p>
                      <p className="mt-3 text-[15px] leading-8 text-[#5f6871]">
                        施工実績を見た流れのまま、その場で相談へ進めることを想定した締めのセクションです。
                      </p>
                    </div>
                    <div className="mt-8 flex flex-wrap gap-3">
                      <div className="inline-flex items-center gap-2 rounded-full bg-[#1f2a37] px-5 py-3 text-sm font-semibold text-white">
                        <Phone className="h-4 w-4" />
                        048-000-1234
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#cebfa5] px-5 py-3 text-sm font-semibold text-[#7a5c38]">
                        相談予約をする
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
