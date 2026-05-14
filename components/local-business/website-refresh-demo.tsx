import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink } from "lucide-react"
import { builderImages, builderVariants } from "@/lib/local-business/builder-showcase"

const previewImages = {
  watanabetomi: builderImages.exteriorEvening,
  iba: builderImages.livingDining,
  kojima: builderImages.craftsmanship,
  obama: builderImages.kitchen,
  gamou: builderImages.exteriorDay,
} as const

const comparePoints = [
  {
    title: "同じ会社・同じ写真で比較",
    text: "会社設定と写真素材を固定し、デザインと情報設計の違いだけが見えるようにしています。",
  },
  {
    title: "参考元ごとの狙いを明確化",
    text: "重厚感、回遊性、思想、暮らし目線、情報整理の5方向に分けて比較できます。",
  },
  {
    title: "1ページ完成形で確認可能",
    text: "どの案もヒーロー、実績、会社紹介、CTAまで含めた1ページとして作っています。",
  },
]

export function WebsiteRefreshDemo() {
  return (
    <div className="space-y-8">
      <section className="rounded-[30px] border border-[#ddd4c7] bg-white p-6 shadow-[0_14px_40px_rgba(31,42,55,0.08)] sm:p-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#8a7a63]">COMPARISON CONCEPT</p>
        <h2 className="mt-3 text-[30px] font-semibold leading-[1.45] tracking-[-0.04em] text-[#1f2a37]">
          同じ素材を使って、
          <br />
          工務店サイトの見せ方を5方向で比較
        </h2>
        <p className="mt-4 max-w-[46rem] text-[15px] leading-8 text-[#5f6871]">
          風ノ木舎建築工房という同じ架空会社と、同じ6枚の建築写真を使いながら、参考元ごとにレイアウトと情報設計をゼロから組み替えています。
          「どの見せ方がいちばんしっくりくるか」を比べるためのケーススタディです。
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {comparePoints.map((item) => (
            <article key={item.title} className="rounded-[22px] border border-[#e6ddd0] bg-[#fcfaf6] p-5">
              <h3 className="text-[17px] font-semibold text-[#1f2a37]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[#5f6871]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-2">
        {builderVariants.map((variant) => (
          <article
            key={variant.slug}
            className="overflow-hidden rounded-[30px] border border-[#ddd4c7] bg-white shadow-[0_16px_44px_rgba(31,42,55,0.08)]"
          >
            <div className="relative">
              <Image
                src={previewImages[variant.slug]}
                alt={variant.title}
                width={1456}
                height={1080}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-[#8a7a63] backdrop-blur">
                {variant.reference}
              </div>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-sm font-semibold text-[#7a5c38]">{variant.name}</p>
              <h3 className="mt-2 text-[24px] font-semibold leading-[1.45] tracking-[-0.04em] text-[#1f2a37]">
                {variant.title}
              </h3>
              <p className="mt-3 text-[15px] leading-8 text-[#5f6871]">{variant.characteristic}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <div className="rounded-full border border-[#d9cfbf] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-[#5f6871]">
                  {variant.oneLiner}
                </div>
                <div className="rounded-full border border-[#d9cfbf] bg-[#fcfaf6] px-4 py-2 text-sm font-semibold text-[#5f6871]">
                  同一写真で比較
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={`/local-business/website-refresh/${variant.slug}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#7a5c38] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#694d2d]"
                >
                  この案を見る
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/local-business/website-refresh/${variant.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d8d0c1] bg-white px-5 py-3 text-sm font-semibold text-[#5f6871]"
                >
                  個別ページで開く
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}
