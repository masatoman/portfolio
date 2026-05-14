import Link from "next/link"
import { previewVariants } from "@/lib/preview-content"

export const metadata = {
  title: "Design Variants — Preview",
  description: "ポートフォリオの 4 つの方向性を見比べるページ",
}

export default function PreviewIndex() {
  return (
    <div className="font-variant-dark-grid min-h-screen bg-neutral-950 text-neutral-100 antialiased">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 flex items-center justify-between">
          <span className="text-sm font-mono text-neutral-400">/preview</span>
          <Link href="/" className="text-sm text-neutral-400 hover:text-white">
            ← 元のサイトに戻る
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="mb-16 sm:mb-20 max-w-2xl">
          <p className="text-xs font-mono text-neutral-500 mb-4">DESIGN COMPARISON</p>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
            ポートフォリオの<br />
            4 つの方向性
          </h1>
          <p className="mt-6 text-neutral-400 leading-relaxed">
            それぞれ同じ内容を 違う見た目で 作っています。比べてみて、どれが一番「かっこいい」「お客様が信頼してくれそう」かで 選んでください。中身（コピー）は どれも IT に詳しくない お客様が読める言葉で書いてあります。
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {previewVariants.map((v, i) => (
            <Link
              key={v.slug}
              href={`/preview/${v.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 transition hover:border-white/30 hover:bg-white/[0.04]"
            >
              <div
                aria-hidden
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
                style={{
                  background:
                    i === 0
                      ? "radial-gradient(circle, #7c83ff, transparent 60%)"
                      : i === 1
                        ? "radial-gradient(circle, #fff8e1, transparent 60%)"
                        : i === 2
                          ? "radial-gradient(circle, #ff3df0, transparent 60%)"
                          : "radial-gradient(circle, #00f0ff, transparent 60%)",
                }}
              />
              <div className="relative">
                <div className="text-xs font-mono text-neutral-500 mb-3">
                  0{i + 1} / {previewVariants.length}
                </div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">{v.name}</h2>
                <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
                  {v.tagline}
                </p>
                <p className="text-neutral-400 leading-relaxed mb-8">{v.summary}</p>
                <div className="flex items-center gap-2 text-sm font-medium text-white">
                  <span>見にいく</span>
                  <span className="transition group-hover:translate-x-1">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 2026-05-11 追加: 工務店向けトップ (warm editorial) リデザイン 3 案 */}
        <div className="mt-24 sm:mt-32">
          <p className="text-xs font-mono text-neutral-500 mb-4">TOP REDESIGN — 2026-05-11</p>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.2] mb-3">
            トップ ( / ) リデザイン<br />3 案
          </h2>
          <p className="mt-4 text-neutral-400 leading-relaxed max-w-2xl">
            5/15 友人 (工務店現場監督) ヒアリング向けの 比較プレビュー。 全案とも warm editorial 維持、 brown #7a5c38 系。 <Link href="/" className="underline hover:text-white">現状トップ</Link> と並べて確認してください。
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                slug: "top-numbers",
                no: "01",
                name: "数字主導",
                tagline: "Pricing-first",
                summary: "Hero に価格バッジ (初期 10 万 + 月 1 万) を主役に。 Examples は数字バッジ付きグリッド。 即決判断型。",
                color: "#7a5c38",
              },
              {
                slug: "top-photos",
                no: "02",
                name: "写真主役",
                tagline: "hiraomakoto 流",
                summary: "フル幅写真 Hero + 静かな 1 行コピー。 Examples は 3 主役 + 5 補欠。 関係構築型。",
                color: "#a88456",
              },
              {
                slug: "top-empathy",
                no: "03",
                name: "困りごと共感",
                tagline: "対話型",
                summary: "「現場、 こんなことありませんか?」 から始まり、 4 困りごとカード → 該当デモ直リンク。 5/15 ヒアリング台本と完全一致。",
                color: "#06c755",
              },
            ].map((v) => (
              <Link
                key={v.slug} href={`/preview/${v.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-7 transition hover:border-white/30 hover:bg-white/[0.04]"
              >
                <div
                  aria-hidden
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-20 blur-3xl transition group-hover:opacity-40"
                  style={{ background: `radial-gradient(circle, ${v.color}, transparent 60%)` }}
                />
                <div className="relative">
                  <div className="text-xs font-mono text-neutral-500 mb-3">{v.no} / 03</div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">{v.name}</h3>
                  <p className="text-xs font-mono uppercase tracking-widest text-neutral-500 mb-4">
                    {v.tagline}
                  </p>
                  <p className="text-neutral-400 leading-relaxed text-sm mb-6">{v.summary}</p>
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <span>見にいく</span>
                    <span className="transition group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-20 sm:mt-28 rounded-2xl border border-white/10 bg-white/[0.02] p-8 sm:p-10">
          <h3 className="text-lg font-semibold mb-3">選び方のヒント</h3>
          <ul className="space-y-3 text-sm text-neutral-400 leading-relaxed">
            <li><strong className="text-neutral-200">迷ったら Dark Grid</strong>: 一番モダンで広いお客様に効きます。</li>
            <li><strong className="text-neutral-200">写真や動画が用意できそうなら Cinematic</strong>: 視覚で説得力が出ます。</li>
            <li><strong className="text-neutral-200">他社と違うインパクトが欲しいなら Y2K</strong>: 好き嫌いは分かれます。</li>
            <li><strong className="text-neutral-200">「未来感」最大は 3D</strong>: 重さと SEO が懸念。お客様層によります。</li>
          </ul>
        </div>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs font-mono text-neutral-600">
          © 2026 Ihara Frontend — preview index
        </div>
      </footer>
    </div>
  )
}
