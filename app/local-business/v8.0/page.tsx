import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Phone, MessageCircle, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

/**
 * /local-business/v8.0
 *
 * 工務店アトツギ (30-40 代後継層 + 儲かってる層、 年商 1-5 億) 向け
 * 6 デモ ハブページ (2026-05-23 北原氏面談「動くデモを先に作る + 紹介者に困りごと事前ヒアリング」 確定)。
 *
 * 構成:
 *   1. Hero (アトツギ向け趣旨)
 *   2. A 群 本命 3 デモ (3 カラム カード)
 *   3. B 群 副次 3 デモ (3 カラム カード)
 *   4. 6 デモ 比較表
 *   5. 次のアクション (30 分ヒアリング + 紹介依頼 + 連絡先)
 *   6. フッタ
 *
 * スタイル: warm editorial (#fcf6e9 暖色 + 紙質感)。
 * 新規パッケージ追加なし、 既存 demo ページ群を編集なしで参照のみ。
 */

export const metadata: Metadata = {
  title: "工務店の 6 つの動く道具 — 後継者の方へ | Ihara Frontend (v8.0)",
  description:
    "工務店の 2 代目・3 代目 (30-40 代) 向けに、 動くデモ 6 種を 1 つにまとめたハブページ。 5 分ずつ見て「使える」 と感じたものを教えてください。 同業の後継者を紹介していただける方も歓迎します。",
  alternates: { canonical: "/local-business/v8.0" },
  robots: { index: false, follow: false },
}

// ============================================================
// 6 デモ データ
// ============================================================

type DemoGroup = "A" | "B"

type Demo = {
  no: string
  group: DemoGroup
  title: string
  subtitle: string
  href: string
  pain: string
  prices: { tier: string; amount: string; label: string }[]
  category: string
  effect: string
  accent: string // hex
  accentSoft: string
}

const DEMOS: Demo[] = [
  {
    no: "01",
    group: "A",
    title: "OB 10 年管理 SaaS",
    subtitle: "過去 10 年の OB を「眠った資産」 から「リフォーム源泉」 へ",
    href: "/local-business/ob-management",
    pain: "過去 10 年の OB 名簿が Excel や 紙台帳に 散らばっていて、 築 10-15 年で 来る リフォーム機会を 競合に 取られる。",
    prices: [
      { tier: "ライト", amount: "月 3 万", label: "SaaS のみ" },
      { tier: "標準", amount: "月 5 万", label: "+ 操作サポート" },
      { tier: "フル", amount: "月 8 万", label: "+ アプローチ代行" },
    ],
    category: "OB 顧客資産活用",
    effect: "OB リフォーム獲得率 20-30% → 40%+ (試算)",
    accent: "#0e7490",
    accentSoft: "#ecfeff",
  },
  {
    no: "03",
    group: "A",
    title: "展示会リード育成 SaaS",
    subtitle: "名刺の山を 6 ヶ月後の商談に 変える",
    href: "/local-business/lead-cultivation",
    pain: "展示会で 集めた 名刺が 机に 積み上がって 動かない。 1 ヶ月後には 誰だったか 思い出せない。",
    prices: [
      { tier: "ライト", amount: "月 3 万", label: "SaaS + 名刺 100 枚/月" },
      { tier: "標準", amount: "月 5 万", label: "+ 配信代行" },
      { tier: "フル", amount: "月 10 万", label: "+ 商談化サポート" },
    ],
    category: "展示会リード育成",
    effect: "名刺 → 商談化率 2-3% → 8-12% (試算)",
    accent: "#b85c3a",
    accentSoft: "#f7e5d7",
  },
  {
    no: "04",
    group: "A",
    title: "経営状況可視化レポート",
    subtitle: "月次の利益が 一目で見える ダッシュボード",
    href: "/local-business/business-metrics",
    pain: "月次の利益が 見えず、 親方と 数字の話が できない。 赤字案件に 気づくのが いつも 3 ヶ月後。",
    prices: [
      { tier: "ライト", amount: "月 3 万", label: "SaaS のみ" },
      { tier: "標準", amount: "月 5 万", label: "+ 月次レポート解説" },
      { tier: "フル", amount: "月 8 万", label: "+ 月次経営会議 同席" },
    ],
    category: "経営数字 可視化",
    effect: "赤字案件 早期検知 + 親方説得材料の自動生成",
    accent: "#4a7c4a",
    accentSoft: "#e3edd9",
  },
  {
    no: "07",
    group: "B",
    title: "暗黙知継承 AI",
    subtitle: "親方の頭の中を 後継者に 渡す 仕組み",
    href: "/local-business/tacit-knowledge",
    pain: "親方の頭の中の 経験が 後継者に 伝わらない。 引退まで あと 5-10 年、 でも 言語化する 時間がない。",
    prices: [
      { tier: "ライト", amount: "月 3 万", label: "AI 蓄積のみ" },
      { tier: "標準", amount: "月 5 万", label: "+ 月 1 回 インタビュー代行" },
      { tier: "フル", amount: "月 10 万", label: "+ 後継者 OJT 設計" },
    ],
    category: "暗黙知継承",
    effect: "親方引退までの 経験継承 ロードマップを 構造化",
    accent: "#7a5c38",
    accentSoft: "#f5ecdd",
  },
  {
    no: "02",
    group: "B",
    title: "コンテンツ自動生成 SaaS",
    subtitle: "ホームページ更新 と SNS 投稿を 止めない",
    href: "/local-business/content-auto",
    pain: "ホームページ更新が 止まる、 SNS 投稿の 時間がない。 現場写真は 撮ってあるが 整理する 余裕がない。",
    prices: [
      { tier: "ライト", amount: "月 3 万", label: "SaaS のみ" },
      { tier: "標準", amount: "月 5 万", label: "+ 月 4 本 投稿代行" },
      { tier: "フル", amount: "月 8 万", label: "+ HP 月次更新代行" },
    ],
    category: "コンテンツ自動生成",
    effect: "ホームページ + SNS 月 4-8 本 自動更新",
    accent: "#c98a2e",
    accentSoft: "#f5e6c8",
  },
  {
    no: "10",
    group: "B",
    title: "カスタム住宅シミュレーター",
    subtitle: "施主との 建材打合せを 立体的に 見せる",
    href: "/local-business/home-simulator",
    pain: "施主との 建材打合せで「思ってたのと違う」 クレーム発生。 大手ハウスメーカーの ショールームに 対抗できない。",
    prices: [
      { tier: "ライト", amount: "月 5 万", label: "SaaS のみ" },
      { tier: "標準", amount: "月 8 万", label: "+ 施主同席サポート" },
      { tier: "フル", amount: "月 12 万", label: "+ 提案資料 制作代行" },
    ],
    category: "施主提案 立体化",
    effect: "打合せ後 クレーム発生率 ↓ / 大手対抗 提案力 ↑",
    accent: "#3a7ca5",
    accentSoft: "#d9e7f0",
  },
]

const DEMOS_A = DEMOS.filter((d) => d.group === "A")
const DEMOS_B = DEMOS.filter((d) => d.group === "B")

// ============================================================
// Page
// ============================================================

export default function V80HubPage() {
  return (
    <div className="min-h-screen bg-[#fcf6e9] text-[#2b261e]">
      {/* ============ Header ============ */}
      <header className="sticky top-0 z-20 border-b border-[#d6cfc2] bg-[#fcf6e9]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5a5247] transition hover:text-[#2b261e]"
          >
            <ArrowLeft className="h-4 w-4" />
            トップへ
          </Link>
          <span className="inline-flex items-center rounded-full border border-[#d6cfc2] bg-white px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#b85c3a]">
            v8.0 アトツギ向け ハブ
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 pb-24 pt-12 sm:pt-16">
        {/* ============ Hero ============ */}
        <section className="mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#b85c3a]">
            For 2 代目・3 代目 / 後継者の方へ
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#2b261e] sm:text-4xl md:text-5xl">
            工務店の 6 つの動く道具
            <span className="mt-2 block text-base font-semibold text-[#5a5247] sm:text-lg">
              — 後継者の方に 「使える / 使えない」 を 5 分で 判断していただきたい
            </span>
          </h1>
          <div className="mt-6 max-w-3xl space-y-4 text-[15px] leading-7 text-[#3d3730]">
            <p>
              年商 1-5 億の 工務店で、 親方の代から 続く現場を これから 引き継ぐ
              30-40 代の 後継者さん 向けに、 動くデモを 6 種類 作りました。
              全部 触れます。 5 分ずつ 見ていただいて、 「これは 使えそう」「これは いらない」
              の 反応を 聞かせてください。
            </p>
            <p>
              工務店業界は 全体として 利益率が 厳しいので、
              価格は 月 3 万円から、 効果を 説明できる ROI とセットで 提示しています。
              押し売りは しません。 1 つも 当てはまらなければ それで OK です。
              同業の 後継者さんを 1 人 紹介していただける方も 歓迎します
              (紹介経由は 初期費用 半額 等の 特典あり)。
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-11 rounded-md bg-[#b85c3a] px-5 text-sm font-bold text-white shadow-none hover:bg-[#a04e30]"
            >
              <Link href="#contact">
                30 分ヒアリングを 依頼する
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-md border-[#d6cfc2] bg-white px-5 text-sm font-bold text-[#2b261e] shadow-none hover:bg-[#f7f0df]"
            >
              <Link href="#compare">6 デモを 比較表で 見る</Link>
            </Button>
          </div>
        </section>

        {/* ============ A 群 本命 3 デモ ============ */}
        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#d6cfc2] pb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b85c3a]">
                Group A / 本命
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#2b261e]">
                売上に 直結する 3 つの 道具
              </h2>
            </div>
            <p className="hidden text-xs text-[#5a5247] sm:block">
              既存 OB / 展示会リード / 経営数字
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {DEMOS_A.map((d) => (
              <DemoCard key={d.no} demo={d} />
            ))}
          </div>
        </section>

        {/* ============ B 群 副次 3 デモ ============ */}
        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between gap-4 border-b border-[#d6cfc2] pb-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7a5c38]">
                Group B / 副次
              </p>
              <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#2b261e]">
                組織と 提案力を 育てる 3 つの 道具
              </h2>
            </div>
            <p className="hidden text-xs text-[#5a5247] sm:block">
              暗黙知 / コンテンツ / 施主提案
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {DEMOS_B.map((d) => (
              <DemoCard key={d.no} demo={d} />
            ))}
          </div>
        </section>

        {/* ============ 6 デモ 比較表 ============ */}
        <section id="compare" className="mb-16">
          <div className="mb-6 border-b border-[#d6cfc2] pb-3">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b85c3a]">
              Compare All
            </p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#2b261e]">
              6 デモ 一覧で 比較する
            </h2>
            <p className="mt-2 text-sm text-[#5a5247]">
              カテゴリ・価格レンジ・主な効果を 1 つの 表に まとめました。
              気になる行の「動くデモを 見る」 から 詳細ページへ。
            </p>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[#d6cfc2] bg-white shadow-sm">
            <table className="w-full min-w-[720px] border-collapse text-sm">
              <thead className="bg-[#f7f0df] text-[#2b261e]">
                <tr>
                  <th className="border-b border-[#d6cfc2] px-3 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    #
                  </th>
                  <th className="border-b border-[#d6cfc2] px-3 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    群
                  </th>
                  <th className="border-b border-[#d6cfc2] px-3 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    タイトル
                  </th>
                  <th className="border-b border-[#d6cfc2] px-3 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    カテゴリ
                  </th>
                  <th className="border-b border-[#d6cfc2] px-3 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    価格レンジ
                  </th>
                  <th className="border-b border-[#d6cfc2] px-3 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    主な 効果
                  </th>
                  <th className="border-b border-[#d6cfc2] px-3 py-3 text-left text-xs font-bold uppercase tracking-wider">
                    動くデモ
                  </th>
                </tr>
              </thead>
              <tbody>
                {DEMOS.map((d, i) => (
                  <tr
                    key={d.no}
                    className={i % 2 === 0 ? "bg-white" : "bg-[#fcf6e9]/60"}
                  >
                    <td className="border-b border-[#ece5d4] px-3 py-3 font-mono text-xs text-[#5a5247]">
                      {d.no}
                    </td>
                    <td className="border-b border-[#ece5d4] px-3 py-3">
                      <span
                        className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                        style={{
                          backgroundColor: d.accentSoft,
                          color: d.accent,
                        }}
                      >
                        {d.group === "A" ? "A 本命" : "B 副次"}
                      </span>
                    </td>
                    <td className="border-b border-[#ece5d4] px-3 py-3 font-bold text-[#2b261e]">
                      {d.title}
                    </td>
                    <td className="border-b border-[#ece5d4] px-3 py-3 text-[#5a5247]">
                      {d.category}
                    </td>
                    <td className="border-b border-[#ece5d4] px-3 py-3 font-mono text-xs font-bold text-[#2b261e]">
                      {d.prices[0].amount.replace("月 ", "")} 〜{" "}
                      {d.prices[d.prices.length - 1].amount.replace("月 ", "")} / 月
                    </td>
                    <td className="border-b border-[#ece5d4] px-3 py-3 text-xs text-[#3d3730]">
                      {d.effect}
                    </td>
                    <td className="border-b border-[#ece5d4] px-3 py-3">
                      <Link
                        href={d.href}
                        className="inline-flex items-center gap-1 rounded-md border border-[#d6cfc2] bg-white px-2.5 py-1.5 text-xs font-bold text-[#b85c3a] transition hover:bg-[#f7e5d7]"
                      >
                        見る
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[#8a8478]">
            ※ 上の 価格レンジは ライト 〜 フルプランの 月額。 初期 BPaaS (業務代行) 費用は
            別途 50-150 万の 3 段階で 見積もり可能 (件数次第)。 IT 通常枠 1/2 補助金 対象見込み。
          </p>
        </section>

        {/* ============ 次のアクション ============ */}
        <section
          id="contact"
          className="mb-16 rounded-2xl border border-[#d6cfc2] bg-white p-6 shadow-sm sm:p-10"
        >
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#b85c3a]">
            Next Step
          </p>
          <h2 className="mt-1 text-2xl font-bold tracking-tight text-[#2b261e] sm:text-3xl">
            次に やっていただきたい 2 つ
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#3d3730]">
            6 デモを 見て「これは ちょっと 気になる」 が 1 つでも あったら、
            30 分の ヒアリングを 依頼してください。 Zoom でも、 工務店さんの 事務所に
            訪問でも、 どちらでも OK です。
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {/* CTA 1: 30 分ヒアリング */}
            <div className="rounded-xl border border-[#d6cfc2] bg-[#fcf6e9] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#b85c3a]">
                Action 1
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#2b261e]">
                30 分 ヒアリングを 依頼
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#3d3730]">
                Zoom または 訪問で、 6 デモの 反応を 聞かせてください。
                「使えそう」「これは 違う」 の 1 言で 構いません。
                費用は かかりません。
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[#5a5247]">
                <li>・所要時間: 30 分</li>
                <li>・形式: Zoom / 電話 / 訪問 (多摩地区中心)</li>
                <li>・準備物: なし (画面共有で 見ていただきます)</li>
              </ul>
            </div>

            {/* CTA 2: 紹介依頼 */}
            <div className="rounded-xl border border-[#d6cfc2] bg-[#fcf6e9] p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[#7a5c38]">
                Action 2
              </p>
              <h3 className="mt-1 text-lg font-bold text-[#2b261e]">
                同業の 後継者を 1 人 紹介
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#3d3730]">
                「うちの 業界仲間に 同じ 後継者が いる」 という 方は、
                その方にも 同じ ヒアリングを させてください。 紹介経由は
                初期費用 半額 等の 特典あり。
              </p>
              <ul className="mt-3 space-y-1.5 text-xs text-[#5a5247]">
                <li>・紹介相手: 30-40 代の 後継者 / 経営者の方</li>
                <li>・形式: LINE 転送 / メール CC で 構いません</li>
                <li>・お礼: ヒアリング成立で Amazon ギフト 5,000 円</li>
              </ul>
            </div>
          </div>

          {/* 連絡先 */}
          <div className="mt-8 border-t border-[#d6cfc2] pt-6">
            <p className="text-xs font-bold uppercase tracking-wider text-[#5a5247]">
              連絡先 (どれでも OK)
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <ContactItem
                icon={<Phone className="h-5 w-5" />}
                label="電話"
                value="090-XXXX-XXXX"
                note="(平日 9-18 時、 不在時は 折り返し)"
              />
              <ContactItem
                icon={<MessageCircle className="h-5 w-5" />}
                label="LINE"
                value="@ihara-frontend"
                note="(QR は ヒアリング資料に 同梱)"
              />
              <ContactItem
                icon={<Mail className="h-5 w-5" />}
                label="メール"
                value="info@ihara-frontend.com"
                note="(2-3 営業日以内に 返信)"
              />
            </div>
            <p className="mt-5 text-xs text-[#8a8478]">
              ※ 名前と 工務店名だけ 添えて 一言「v8.0 ハブ見ました」 と 書いていただければ
              こちらから 折り返します。
            </p>
          </div>
        </section>

        {/* ============ フッタ ============ */}
        <footer className="border-t border-[#d6cfc2] pt-8 text-xs text-[#5a5247]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-sm font-bold text-[#2b261e]">井原 誠斗</p>
              <p className="mt-1">ihara-frontend.com / 工務店向け B2B SaaS + BPaaS</p>
              <p className="mt-3 text-[11px] leading-5 text-[#8a8478]">
                「ひとりで 全部 作れる 職人」 として、 設計 → 実装 → 運用 → 業務代行 まで
                <br />
                工務店さんの 内製チームの 一員として 動きます。
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <Link href="/" className="underline-offset-4 hover:underline">
                  トップへ
                </Link>
              </li>
              <li>
                <Link
                  href="/demo-gallery"
                  className="underline-offset-4 hover:underline"
                >
                  全デモ 投票
                </Link>
              </li>
              <li>
                <Link
                  href="/portfolio"
                  className="underline-offset-4 hover:underline"
                >
                  個人実績
                </Link>
              </li>
              <li>
                <a
                  href="/docs/v8.0/v8.0-hearing-resource-2026-05-23.html"
                  className="underline-offset-4 hover:underline"
                >
                  ヒアリング資料 (PDF 用)
                </a>
              </li>
            </ul>
          </div>
          <p className="mt-8 text-[11px] text-[#8a8478]">
            © {new Date().getFullYear()} Ihara Seito / 2026-05-23 v8.0 後継者向け ハブページ
          </p>
        </footer>
      </main>
    </div>
  )
}

// ============================================================
// Sub-components
// ============================================================

function DemoCard({ demo }: { demo: Demo }) {
  const groupLabel = demo.group === "A" ? "A 群 本命" : "B 群 副次"
  return (
    <article
      className="flex flex-col overflow-hidden rounded-2xl border border-[#d6cfc2] bg-white shadow-sm transition hover:shadow-md"
      style={{ borderTopColor: demo.accent, borderTopWidth: "3px" }}
    >
      {/* バッジ + 番号 */}
      <div className="flex items-center justify-between gap-2 border-b border-[#ece5d4] bg-[#fcf6e9] px-4 py-2.5">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em]"
          style={{
            backgroundColor: demo.accentSoft,
            color: demo.accent,
          }}
        >
          {groupLabel}
        </span>
        <span className="font-mono text-[11px] font-bold text-[#5a5247]">
          # {demo.no}
        </span>
      </div>

      {/* 本体 */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-bold leading-snug text-[#2b261e]">
          {demo.title}
        </h3>
        <p className="mt-1 text-xs font-medium leading-5 text-[#5a5247]">
          {demo.subtitle}
        </p>

        {/* 痛み */}
        <div
          className="mt-4 rounded-md border px-3 py-2.5"
          style={{
            backgroundColor: demo.accentSoft,
            borderColor: demo.accentSoft,
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-wider"
            style={{ color: demo.accent }}
          >
            アトツギの 本音
          </p>
          <p className="mt-1 text-xs leading-5 text-[#3d3730]">{demo.pain}</p>
        </div>

        {/* 価格 3 段 */}
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {demo.prices.map((p, idx) => (
            <div
              key={p.tier}
              className={`rounded-md border p-2 text-center ${
                idx === 1
                  ? "bg-[#fff8eb]"
                  : "bg-white"
              }`}
              style={{
                borderColor: idx === 1 ? demo.accent : "#e7dfc9",
              }}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#8a8478]">
                {p.tier}
              </p>
              <p
                className="mt-0.5 text-sm font-black tracking-tight"
                style={{ color: idx === 1 ? demo.accent : "#2b261e" }}
              >
                {p.amount}
              </p>
              <p className="mt-0.5 text-[9px] leading-3 text-[#5a5247]">
                {p.label}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={demo.href}
          className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-3 text-sm font-bold text-white transition hover:opacity-90"
          style={{ backgroundColor: demo.accent }}
        >
          動くデモを 見る
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}

function ContactItem({
  icon,
  label,
  value,
  note,
}: {
  icon: React.ReactNode
  label: string
  value: string
  note: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-[#d6cfc2] bg-white px-3 py-3">
      <div className="mt-0.5 grid h-9 w-9 place-items-center rounded-md bg-[#f7e5d7] text-[#b85c3a]">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8a8478]">
          {label}
        </p>
        <p className="mt-0.5 break-all font-mono text-sm font-bold text-[#2b261e]">
          {value}
        </p>
        <p className="mt-0.5 text-[10px] leading-4 text-[#5a5247]">{note}</p>
      </div>
    </div>
  )
}
