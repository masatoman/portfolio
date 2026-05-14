import Image from "next/image"
import Link from "next/link"
import { Noto_Serif_JP } from "next/font/google"
import { ArrowLeft, ArrowRight, Clock3, Home, MapPin, Phone, Search, Tags, Hammer, Building2 } from "lucide-react"
import {
  builderBrand,
  builderImages,
  builderStrengths,
  builderTags,
  builderVariantMap,
  builderVariants,
  builderWorks,
  type BuilderVariantSlug,
} from "@/lib/local-business/builder-showcase"

const headingFont = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["500", "700"],
})

type Props = {
  slug: BuilderVariantSlug
}

const workCards = [
  { ...builderWorks[0], size: "lg:col-span-7 lg:min-h-[520px]" },
  { ...builderWorks[1], size: "lg:col-span-5 lg:min-h-[520px]" },
  { ...builderWorks[2], size: "lg:col-span-4 lg:min-h-[420px]" },
  { ...builderWorks[3], size: "lg:col-span-8 lg:min-h-[420px]" },
]

const serviceCategories = [
  { title: "注文住宅", text: "敷地条件や暮らし方に合わせて、設計から施工まで一貫して対応します。" },
  { title: "リフォーム", text: "住み継ぎながら整える改修や、間取りの見直しにも対応できる想定です。" },
  { title: "店舗・小規模施設", text: "住宅以外の相談もできる入口を明確にして、相談範囲を伝えやすくしています。" },
]

function Header({ label }: { label: string }) {
  return (
    <header className="border-b border-[#ddd4c7] bg-[#f8f4ed]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/local-business/website-refresh" className="inline-flex items-center gap-2 text-sm font-semibold text-[#7a5c38]">
          <ArrowLeft className="h-4 w-4" />
          比較一覧へ戻る
        </Link>
        <div className="text-sm font-semibold tracking-[0.18em] text-[#8a7a63]">{label}</div>
      </div>
    </header>
  )
}

function InfoPills() {
  return (
    <div className="mt-8 space-y-3">
      <div className="flex items-start gap-3 rounded-[22px] border border-[#e4dacc] bg-white px-4 py-4 text-sm leading-7 text-[#5f6871]">
        <Home className="mt-1 h-4 w-4 text-[#8a7a63]" />
        {builderBrand.serviceLine}
      </div>
      <div className="flex items-start gap-3 rounded-[22px] border border-[#e4dacc] bg-white px-4 py-4 text-sm leading-7 text-[#5f6871]">
        <MapPin className="mt-1 h-4 w-4 text-[#8a7a63]" />
        {builderBrand.regionLine}
      </div>
      <div className="flex items-start gap-3 rounded-[22px] border border-[#e4dacc] bg-white px-4 py-4 text-sm leading-7 text-[#5f6871]">
        <Clock3 className="mt-1 h-4 w-4 text-[#8a7a63]" />
        {builderBrand.hoursLine}
      </div>
    </div>
  )
}

function ContactStrip({ dark = false }: { dark?: boolean }) {
  if (dark) {
    return (
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#1f2a37]">
          <Phone className="h-4 w-4" />
          {builderBrand.phone}
        </div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#cebfa5] px-5 py-3 text-sm font-semibold text-[#d9c29a]">
          相談予約をする
          <ArrowRight className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="mt-7 flex flex-wrap gap-3">
      <div className="rounded-full bg-[#7a5c38] px-5 py-3 text-sm font-semibold text-white">施工実績を見る</div>
      <div className="rounded-full border border-[#cfbea2] bg-white px-5 py-3 text-sm font-semibold text-[#1f2a37]">家づくりを相談する</div>
    </div>
  )
}

function WatanabetomiLayout() {
  const variant = builderVariantMap.watanabetomi
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#1f2a37]">
      <Header label={variant.name} />
      <main>
        <section className="px-4 pb-10 pt-8 sm:px-6 sm:pb-14 sm:pt-10">
          <div className="mx-auto max-w-[1320px]">
            <div className="relative overflow-hidden rounded-[40px] border border-[#d7cebf] bg-[#ece3d6] shadow-[0_28px_80px_rgba(31,42,55,0.14)]">
              <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
                <div className="relative min-h-[520px] overflow-hidden sm:min-h-[620px]">
                  <Image src={builderImages.exteriorDay} alt={`${builderBrand.company}の外観`} fill className="object-cover" priority />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(27,35,44,0.06),rgba(27,35,44,0.1))]" />
                  <div className="absolute left-6 top-6 rounded-full bg-white/85 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-[#8a7a63] backdrop-blur sm:left-8 sm:top-8">
                    {builderBrand.roman}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-8 lg:max-w-[74%]">
                    <div className="rounded-[32px] bg-[#f8f4ed]/92 p-6 shadow-[0_18px_45px_rgba(31,42,55,0.12)] backdrop-blur sm:p-8">
                      <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">{variant.heroLabel}</p>
                      <h1 className={`${headingFont.className} mt-3 text-[38px] leading-[1.45] tracking-[-0.05em] text-[#1f2a37] sm:text-[60px]`}>
                        {builderBrand.baseTitle}
                      </h1>
                      <p className="mt-5 max-w-[34rem] text-[15px] leading-8 text-[#5f6871] sm:text-[17px]">{builderBrand.description}</p>
                      <ContactStrip />
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
                    <p className="mt-5 text-[15px] leading-8 text-[#5f6871]">{variant.characteristic}</p>
                  </div>
                  <InfoPills />
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
            <p className="max-w-[31rem] text-[15px] leading-8 text-[#5f6871]">{variant.heroCopy}</p>
          </div>
          <div className="mx-auto mt-10 grid max-w-[1320px] gap-6 lg:grid-cols-12">
            {workCards.map((work) => (
              <article key={work.title} className={`overflow-hidden rounded-[34px] border border-[#ddd4c7] bg-white shadow-[0_20px_48px_rgba(31,42,55,0.08)] ${work.size}`}>
                <div className="relative h-[280px] lg:h-full lg:min-h-[420px]">
                  <Image src={work.image} alt={work.title} fill className="object-cover" />
                </div>
                <div className="p-6 sm:p-7">
                  <p className="text-xs font-semibold tracking-[0.18em] text-[#8a7a63]">{work.place}</p>
                  <h3 className={`${headingFont.className} mt-3 text-[28px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>{work.title}</h3>
                  <p className="mt-3 max-w-[32rem] text-[15px] leading-8 text-[#5f6871]">{work.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-[#1f2a37] px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-[1320px] gap-10 lg:grid-cols-[0.92fr_1.08fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#d4c2a6]">ABOUT THE COMPANY</p>
              <h2 className={`${headingFont.className} mt-3 text-[34px] leading-[1.55] tracking-[-0.04em] text-white sm:text-[46px]`}>
                会社の姿勢は、
                <br />
                白いカードではなく
                <br />
                余白で語る。
              </h2>
            </div>
            <div className="space-y-4">
              {builderStrengths.map((item, index) => (
                <article key={item.title} className={`rounded-[30px] border border-white/10 px-6 py-6 sm:px-7 ${index === 1 ? "bg-[#f7f1e8] text-[#1f2a37]" : "bg-white/5 text-white"}`}>
                  <p className={`text-xs font-semibold tracking-[0.18em] ${index === 1 ? "text-[#8a7a63]" : "text-[#d4c2a6]"}`}>0{index + 1}</p>
                  <h3 className={`${headingFont.className} mt-3 text-[28px] leading-[1.5] tracking-[-0.04em]`}>{item.title}</h3>
                  <p className={`mt-3 text-[15px] leading-8 ${index === 1 ? "text-[#5f6871]" : "text-white/72"}`}>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function IbaLayout() {
  const variant = builderVariantMap.iba
  return (
    <div className="min-h-screen bg-[#f8f5ef] text-[#1f2a37]">
      <Header label={variant.name} />
      <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-20">
        <section className="mx-auto max-w-[1320px]">
          <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">{variant.heroLabel}</p>
              <h1 className={`${headingFont.className} mt-4 text-[40px] leading-[1.5] tracking-[-0.05em] text-[#1f2a37] sm:text-[60px]`}>
                施工事例から、
                <br />
                自分に近い家を探す。
              </h1>
              <p className="mt-5 max-w-[34rem] text-[15px] leading-8 text-[#5f6871]">{variant.characteristic}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {builderTags.slice(0, 6).map((tag) => (
                  <div key={tag} className="rounded-full border border-[#d8d0c1] bg-white px-4 py-2 text-sm font-semibold text-[#5f6871]">
                    #{tag}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[28px] border border-[#ddd4c7] bg-white shadow-[0_16px_44px_rgba(31,42,55,0.08)] sm:translate-y-8">
                <Image src={builderImages.livingDining} alt="LDK実例" width={1456} height={1080} className="aspect-[4/3] w-full object-cover" />
              </div>
              <div className="overflow-hidden rounded-[28px] border border-[#ddd4c7] bg-white shadow-[0_16px_44px_rgba(31,42,55,0.08)]">
                <Image src={builderImages.exteriorDay} alt="外観実例" width={1456} height={1080} className="aspect-[4/3] w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-[1320px]">
          <div className="flex items-center justify-between gap-4">
            <h2 className={`${headingFont.className} text-[32px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37] sm:text-[42px]`}>
              施工事例一覧
            </h2>
            <div className="hidden items-center gap-2 rounded-full border border-[#d8d0c1] bg-white px-4 py-2 text-sm font-semibold text-[#5f6871] sm:inline-flex">
              <Search className="h-4 w-4" />
              絞り込みイメージ
            </div>
          </div>
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {builderWorks.map((work, index) => (
              <article key={work.title} className={`overflow-hidden rounded-[26px] border border-[#ddd4c7] bg-white shadow-[0_16px_40px_rgba(31,42,55,0.08)] ${index === 0 ? "lg:col-span-2" : ""}`}>
                <Image src={work.image} alt={work.title} width={1456} height={1080} className={`w-full object-cover ${index === 0 ? "aspect-[16/9]" : "aspect-[4/3]"}`} />
                <div className="p-5">
                  <div className="flex flex-wrap gap-2">
                    {builderTags.slice(index, index + 3).map((tag) => (
                      <div key={`${work.title}-${tag}`} className="rounded-full bg-[#f5efe4] px-3 py-1 text-xs font-semibold text-[#8a7a63]">
                        {tag}
                      </div>
                    ))}
                  </div>
                  <h3 className={`${headingFont.className} mt-3 text-[26px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>{work.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-[#8a7a63]">{work.place}</p>
                  <p className="mt-3 text-[15px] leading-8 text-[#5f6871]">{work.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-[1320px] rounded-[34px] border border-[#ddd4c7] bg-white p-6 shadow-[0_18px_45px_rgba(31,42,55,0.08)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">ABOUT</p>
              <h2 className={`${headingFont.className} mt-3 text-[30px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[40px]`}>
                一覧から深く知る導線
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {builderStrengths.map((item) => (
                <article key={item.title} className="rounded-[22px] border border-[#e6ddd0] bg-[#fcfaf6] p-5">
                  <h3 className="text-[17px] font-semibold text-[#1f2a37]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5f6871]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
          <ContactStrip />
        </section>
      </main>
    </div>
  )
}

function KojimaLayout() {
  const variant = builderVariantMap.kojima
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#1f2a37]">
      <Header label={variant.name} />
      <main>
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1120px] text-center">
            <p className="text-xs font-semibold tracking-[0.24em] text-[#8a7a63]">{variant.heroLabel}</p>
            <h1 className={`${headingFont.className} mt-5 text-[42px] leading-[1.6] tracking-[-0.06em] text-[#1f2a37] sm:text-[70px]`}>
              木と、地域と、
              <br />
              人の暮らしに
              <br />
              まっすぐ向き合う。
            </h1>
            <p className="mx-auto mt-6 max-w-[42rem] text-[16px] leading-9 text-[#5f6871]">{variant.characteristic}</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <div className="rounded-full bg-[#1f2a37] px-5 py-3 text-sm font-semibold text-white">{variant.ctaPrimary}</div>
              <div className="rounded-full border border-[#cfbea2] bg-white px-5 py-3 text-sm font-semibold text-[#1f2a37]">{variant.ctaSecondary}</div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#1f2a37] px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-[1320px] gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="overflow-hidden rounded-[36px]">
              <Image src={builderImages.exteriorDay} alt="外観" width={1456} height={1080} className="aspect-[4/3] w-full object-cover" />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-xs font-semibold tracking-[0.2em] text-[#d4c2a6]">STATEMENT</p>
              <h2 className={`${headingFont.className} mt-4 text-[36px] leading-[1.55] tracking-[-0.05em] text-white sm:text-[50px]`}>
                目立つ家ではなく、
                <br />
                長く心地よい家を
                <br />
                つくるために。
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-white/72">
                写真だけでなく、家づくりの考え方そのものを最初に打ち出して、価値観で選ぶ人に届く構成を意識しています。
              </p>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1320px] space-y-16">
            {builderWorks.slice(0, 3).map((work, index) => (
              <div key={work.title} className={`grid gap-8 lg:grid-cols-2 lg:items-center ${index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div className="overflow-hidden rounded-[34px] border border-[#ddd4c7] shadow-[0_20px_50px_rgba(31,42,55,0.08)]">
                  <Image src={work.image} alt={work.title} width={1456} height={1080} className="aspect-[16/10] w-full object-cover" />
                </div>
                <div>
                  <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">{work.place}</p>
                  <h3 className={`${headingFont.className} mt-3 text-[34px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>{work.title}</h3>
                  <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">{work.text}</p>
                  <p className="mt-6 text-[15px] leading-8 text-[#5f6871]">
                    暮らし方や素材感について短い言葉を添えながら、写真とコピーの組み合わせで世界観をつくる想定です。
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-[#ddd4c7] bg-[#faf7f1] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto grid max-w-[1320px] gap-6 md:grid-cols-3">
            {builderStrengths.map((item) => (
              <article key={item.title} className="rounded-[28px] border border-[#e4dacc] bg-white p-6 shadow-[0_12px_30px_rgba(31,42,55,0.05)]">
                <h3 className={`${headingFont.className} text-[26px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>{item.title}</h3>
                <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function ObamaLayout() {
  const variant = builderVariantMap.obama
  return (
    <div className="min-h-screen bg-[#f8f4ed] text-[#1f2a37]">
      <Header label={variant.name} />
      <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-20">
        <section className="mx-auto max-w-[1320px] rounded-[38px] border border-[#ddd4c7] bg-white p-6 shadow-[0_18px_50px_rgba(31,42,55,0.08)] sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold tracking-[0.22em] text-[#8a7a63]">{variant.heroLabel}</p>
              <h1 className={`${headingFont.className} mt-4 text-[40px] leading-[1.5] tracking-[-0.05em] text-[#1f2a37] sm:text-[60px]`}>
                好きな暮らし方から、
                <br />
                施工実例を探す。
              </h1>
              <p className="mt-5 text-[15px] leading-8 text-[#5f6871]">{variant.characteristic}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {builderTags.map((tag) => (
                  <div key={tag} className="inline-flex items-center gap-2 rounded-full border border-[#d9cfbf] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-[#5f6871]">
                    <Tags className="h-3.5 w-3.5 text-[#8a7a63]" />
                    {tag}
                  </div>
                ))}
              </div>
              <ContactStrip />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-[30px] border border-[#ddd4c7]">
                <Image src={builderImages.kitchen} alt="キッチン" width={1456} height={1080} className="aspect-[4/5] w-full object-cover" />
              </div>
              <div className="space-y-4">
                <div className="overflow-hidden rounded-[30px] border border-[#ddd4c7]">
                  <Image src={builderImages.stairDetail} alt="階段" width={1456} height={1080} className="aspect-[4/3] w-full object-cover" />
                </div>
                <div className="overflow-hidden rounded-[30px] border border-[#ddd4c7]">
                  <Image src={builderImages.craftsmanship} alt="手仕事" width={1456} height={1080} className="aspect-[4/3] w-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-[1320px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">LIFESTYLE CASES</p>
              <h2 className={`${headingFont.className} mt-3 text-[34px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37] sm:text-[44px]`}>
                暮らしのイメージで
                <br />
                実例を選びやすくする
              </h2>
            </div>
            <p className="max-w-[30rem] text-[15px] leading-8 text-[#5f6871]">{variant.heroCopy}</p>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {builderWorks.map((work, index) => (
              <article key={work.title} className="overflow-hidden rounded-[28px] border border-[#ddd4c7] bg-white shadow-[0_16px_40px_rgba(31,42,55,0.07)]">
                <Image src={work.image} alt={work.title} width={1456} height={1080} className="aspect-[4/3] w-full object-cover" />
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {builderTags.slice(index, index + 2).map((tag) => (
                      <div key={`${work.title}-${tag}`} className="rounded-full bg-[#f5efe4] px-3 py-1 text-xs font-semibold text-[#8a7a63]">
                        {tag}
                      </div>
                    ))}
                  </div>
                  <h3 className={`${headingFont.className} text-[25px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>{work.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-[#8a7a63]">{work.place}</p>
                  <p className="mt-3 text-[14px] leading-7 text-[#5f6871]">{work.text}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-[1320px] rounded-[34px] border border-[#ddd4c7] bg-[#1f2a37] p-6 text-white shadow-[0_22px_60px_rgba(31,42,55,0.12)] sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[0.74fr_1.26fr]">
            <div>
              <p className="text-xs font-semibold tracking-[0.2em] text-[#d4c2a6]">ABOUT</p>
              <h2 className={`${headingFont.className} mt-3 text-[30px] leading-[1.55] tracking-[-0.04em] text-white sm:text-[42px]`}>
                暮らしのイメージを、
                <br />
                会社の考え方へつなぐ
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {builderStrengths.map((item) => (
                <article key={item.title} className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <h3 className="text-[17px] font-semibold text-white">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/72">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function GamouLayout() {
  const variant = builderVariantMap.gamou
  return (
    <div className="min-h-screen bg-[#f4efe7] text-[#1f2a37]">
      <Header label={variant.name} />
      <main>
        <section className="px-4 pb-14 pt-8 sm:px-6 sm:pb-18">
          <div className="mx-auto max-w-[1320px]">
            <div className="grid gap-6 lg:grid-cols-[0.88fr_1.12fr] lg:items-stretch">
              <div className="rounded-[36px] border border-[#ddd4c7] bg-[#1f2a37] p-7 text-white shadow-[0_20px_55px_rgba(31,42,55,0.14)] sm:p-9">
                <p className="text-xs font-semibold tracking-[0.2em] text-[#d4c2a6]">{variant.heroLabel}</p>
                <h1 className={`${headingFont.className} mt-4 text-[40px] leading-[1.5] tracking-[-0.05em] text-white sm:text-[58px]`}>
                  住宅も、改修も、
                  <br />
                  相談の入口を
                  <br />
                  分かりやすく。
                </h1>
                <p className="mt-5 max-w-[34rem] text-[15px] leading-8 text-white/74">{variant.characteristic}</p>
                <ContactStrip dark />
              </div>
              <div className="overflow-hidden rounded-[36px] border border-[#ddd4c7] shadow-[0_20px_55px_rgba(31,42,55,0.12)]">
                <Image src={builderImages.exteriorDay} alt="外観写真" width={1456} height={1080} className="aspect-[16/10] w-full object-cover" />
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-[#8a7a63]" />
              <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">SERVICE CATEGORIES</p>
            </div>
            <h2 className={`${headingFont.className} mt-4 text-[34px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37] sm:text-[44px]`}>
              対応内容の入口を
              <br />
              先に整理する
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {serviceCategories.map((item) => (
                <article key={item.title} className="rounded-[28px] border border-[#ddd4c7] bg-white p-6 shadow-[0_16px_40px_rgba(31,42,55,0.07)]">
                  <h3 className={`${headingFont.className} text-[28px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>{item.title}</h3>
                  <p className="mt-4 text-[15px] leading-8 text-[#5f6871]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-[#ddd4c7] bg-[#faf7f1] px-4 py-16 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-[1320px]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">WORKS</p>
                <h2 className={`${headingFont.className} mt-3 text-[34px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37] sm:text-[44px]`}>
                  写真で興味を引きつけつつ、
                  <br />
                  相談へつなげる
                </h2>
              </div>
              <p className="max-w-[30rem] text-[15px] leading-8 text-[#5f6871]">{variant.heroCopy}</p>
            </div>
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <article className="overflow-hidden rounded-[32px] border border-[#ddd4c7] bg-white shadow-[0_18px_45px_rgba(31,42,55,0.08)]">
                <Image src={builderImages.livingDining} alt="LDK" width={1456} height={1080} className="aspect-[16/10] w-full object-cover" />
                <div className="p-6">
                  <h3 className={`${headingFont.className} text-[30px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>{builderWorks[0].title}</h3>
                  <p className="mt-2 text-sm font-semibold text-[#8a7a63]">{builderWorks[0].place}</p>
                  <p className="mt-3 text-[15px] leading-8 text-[#5f6871]">{builderWorks[0].text}</p>
                </div>
              </article>
              <div className="grid gap-6">
                {[builderWorks[1], builderWorks[2]].map((work) => (
                  <article key={work.title} className="overflow-hidden rounded-[28px] border border-[#ddd4c7] bg-white shadow-[0_16px_40px_rgba(31,42,55,0.08)]">
                    <Image src={work.image} alt={work.title} width={1456} height={1080} className="aspect-[16/9] w-full object-cover" />
                    <div className="p-5">
                      <h3 className={`${headingFont.className} text-[24px] leading-[1.5] tracking-[-0.04em] text-[#1f2a37]`}>{work.title}</h3>
                      <p className="mt-2 text-[14px] leading-7 text-[#5f6871]">{work.text}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-18">
          <div className="mx-auto grid max-w-[1320px] gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <article className="rounded-[34px] border border-[#ddd4c7] bg-white p-6 shadow-[0_16px_40px_rgba(31,42,55,0.07)] sm:p-8">
              <div className="flex items-center gap-3">
                <Hammer className="h-5 w-5 text-[#8a7a63]" />
                <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">ABOUT</p>
              </div>
              <h2 className={`${headingFont.className} mt-4 text-[32px] leading-[1.55] tracking-[-0.04em] text-[#1f2a37] sm:text-[42px]`}>
                情報整理と、相談のしやすさを
                <br />
                まとめて見せる
              </h2>
              <p className="mt-5 text-[15px] leading-8 text-[#5f6871]">
                会社紹介・施工実績・事業分類のバランスを取りながら、問い合わせの入口も分かりやすくまとめる方向の案です。
              </p>
            </article>
            <div className="grid gap-4">
              {builderStrengths.map((item) => (
                <article key={item.title} className="rounded-[24px] border border-[#ddd4c7] bg-[#fcfaf6] p-5">
                  <h3 className="text-[17px] font-semibold text-[#1f2a37]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#5f6871]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export function BuilderShowcasePage({ slug }: Props) {
  switch (slug) {
    case "watanabetomi":
      return <WatanabetomiLayout />
    case "iba":
      return <IbaLayout />
    case "kojima":
      return <KojimaLayout />
    case "obama":
      return <ObamaLayout />
    case "gamou":
      return <GamouLayout />
    default:
      return null
  }
}

export { builderVariants }
