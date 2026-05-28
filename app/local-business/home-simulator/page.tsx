import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { HomeSimulatorDemo } from "./home-simulator-demo"

export const metadata: Metadata = {
  title: "カスタム住宅 シミュレーター | 工務店向け 動くデモ",
  description:
    "施主との打ち合わせで 床 / 壁 / キッチン を タブレットで 即時切替。 平面図 と 価格が その場で 変わり、 建材屋経由の 仕入リベートも 1 画面で 把握できるデモです。",
}

export default function HomeSimulatorPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* ヘッダ: 戻る + v8.0 #10 候補 / 建材屋ルート バッジ */}
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/#examples"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0f766e] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-white">
              <Sparkles className="h-3 w-3" />
              動くデモ
            </span>
            <span className="hidden rounded-full border border-[#cbd5e1] bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#475569] sm:inline-flex">
              v8.0 #10 候補 / 建材屋ルート
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">
              Prototype
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* タイトル + 説明 */}
        <div className="mb-10 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-md bg-[#ccfbf1] px-2.5 py-1 text-xs font-bold text-[#0f766e]">
            <Sparkles className="h-3.5 w-3.5" />
            動くデモ ・ カスタム住宅 シミュレーター
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            施主との 打ち合わせで、 床 / 壁 / キッチン を タブレットで 即時切替
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            平面図の 色 と 合計金額が その場で 変わる。 施主は「この壁紙 → これに変えると
            ¥3 万円アップ」 が 一目でわかる。 大手ハウスメーカーの タブレットプレゼンに、
            中小工務店 が 対抗できる ツールです。
          </p>
          <p className="mt-2 max-w-2xl text-sm font-bold text-[#0f766e]">
            さらに 建材屋 (LIXIL / ナフコ / 地元 建材屋) 経由の 仕入リベートも
            1 画面で 比較。 仕入経路の 違いが 工務店側の 粗利に どう効くかを 同時表示。
          </p>
        </div>

        {/* 困りごと → 解決 3 ステップ → 結果 (warm editorial の三段カード調) */}
        <section className="mb-12 grid gap-5 lg:grid-cols-3">
          <div className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.06)]">
            <h2 className="mb-4 text-base font-black tracking-tight text-[#071b49]">
              こんな ことに 困っていませんか
            </h2>
            <ul className="space-y-3">
              {[
                "施主が「他社の壁紙の方が良い」 と言い出すと、 金額再計算で 翌週持ち帰り",
                "大手ハウスメーカーの 3D タブレットプレゼンに 対抗できない",
                "建材を 何にするかで 仕入価格 ・ リベートが 違うのに、 商談中 計算する余裕がない",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#0f766e]" />
                  <span className="text-sm font-bold leading-7 text-[#33496d]">{p}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-[24px] border border-[#a7f3d0] bg-white p-6 shadow-[0_14px_40px_rgba(15,118,110,0.1)]">
            <h2 className="mb-4 text-base font-black tracking-tight text-[#0f766e]">
              使い方は 3 ステップ
            </h2>
            <ol className="space-y-4">
              {[
                {
                  no: "1",
                  title: "事前に 自社カタログ を 1 度 登録",
                  body: "床 / 壁 / キッチン それぞれ。 仕入先 と リベート率も 1 度入れたら 終わり。",
                },
                {
                  no: "2",
                  title: "商談中 施主に タブレットを 渡す",
                  body: "施主が タップ するだけで 平面図 と 金額が 即時変化。 ¥単位で 体感できる。",
                },
                {
                  no: "3",
                  title: "決まったら 建材屋経由で 1 タップ 引合",
                  body: "選んだ仕入先に 自動で 引合 が飛ぶ。 仕入リベートは 内部資料として 同時記録。",
                },
              ].map((s) => (
                <li key={s.no} className="flex items-start gap-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#0f766e] text-xs font-black text-white">
                    {s.no}
                  </span>
                  <div>
                    <p className="text-sm font-black text-[#071b49]">{s.title}</p>
                    <p className="mt-1 text-xs font-bold leading-6 text-[#5f6f89]">{s.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.06)]">
            <h2 className="mb-4 text-base font-black tracking-tight text-[#071b49]">
              やった結果 こうなります
            </h2>
            <div className="space-y-3">
              {[
                { label: "施主との 持ち帰り", value: "ゼロに 近づく" },
                { label: "大手 vs 中小 の 見え方", value: "互角 以上" },
                { label: "仕入経路 選択 → 粗利", value: "+5〜12% 透明化" },
              ].map((o) => (
                <div
                  key={o.label}
                  className="rounded-2xl border border-[#dde6f3] bg-[#f7faff] px-4 py-3"
                >
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">
                    {o.label}
                  </p>
                  <p className="mt-1 text-lg font-black tracking-tight text-[#0f766e]">
                    {o.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* シミュレーター本体 (client component) */}
        <HomeSimulatorDemo />

        {/* 相談導線 (既存デモと同じトーン) */}
        <section className="mt-20 rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            この方向で 相談したい場合
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            自社カタログ ・ 仕入先一覧 ・ 商談導線 を ヒアリング して、 今の運用に
            合う形に 落とし込みます。 5/22 北原氏面談 で 確定した「動くデモを 先に作る」 +
            「建材屋経由販売ルート」 と 整合する 商品候補 (#10) です。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="inline-flex h-10 items-center rounded-md bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              無料で 相談する
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-md border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
            >
              トップへ戻る
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
