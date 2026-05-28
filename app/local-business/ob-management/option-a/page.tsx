import type { Metadata } from "next"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Mail,
  MessageCircle,
  Phone,
  TrendingUp,
} from "lucide-react"
import { Noto_Serif_JP } from "next/font/google"
import { OBManagementDemo } from "../ob-management-demo"

const serif = Noto_Serif_JP({ subsets: ["latin"], weight: ["500", "700"] })

export const metadata: Metadata = {
  title: "OB 10 年管理 SaaS [案 A 数字主役] | 工務店向け 動くデモ",
  description:
    "案 A: 数字主役の経営資料風デザイン。 過去 10 年の OB 顧客を「眠った¥3,000 万」 と捉え、 ROI 試算を電卓風に視覚化",
}

const timelineData = [
  { year: 2017, count: 12 },
  { year: 2018, count: 18 },
  { year: 2019, count: 22 },
  { year: 2020, count: 15 },
  { year: 2021, count: 8 },
  { year: 2022, count: 14 },
  { year: 2023, count: 20 },
  { year: 2024, count: 25 },
  { year: 2025, count: 30 },
  { year: 2026, count: 36 },
]

export default function OBManagementOptionAPage() {
  return (
    <div className="min-h-screen bg-[#fcf6e9] text-[#2b261e]">
      <header className="sticky top-0 z-20 border-b border-[#d6cfc2] bg-[#fcf6e9]/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <Link
            href="/local-business/ob-management"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5f6871] transition hover:text-[#1f2a37]"
          >
            <ArrowLeft className="h-4 w-4" />
            既存版へ戻る
          </Link>
          <DesignNav current="a" />
        </div>
      </header>

      <main>
        {/* ============================================ */}
        {/* Hero: 数字主役 */}
        {/* ============================================ */}
        <section className="px-6 py-16 sm:py-24">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
            {/* 左: 数字主役の見出し */}
            <div className="flex flex-col justify-center">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
                A-1 · OB 10 年管理 SaaS · 案 A
              </p>
              <h1
                className={`${serif.className} mt-4 text-[32px] leading-[1.35] tracking-[-0.02em] text-[#1f2a37] sm:text-[44px] lg:text-[56px]`}
              >
                過去 10 年の OB 顧客、
                <br />
                <span className="text-[#b85c3a]">眠った¥3,000 万。</span>
              </h1>
              <p className="mt-6 max-w-[520px] text-[16px] leading-8 text-[#5f6871]">
                大手ハウスメーカーが OB 顧客から 年間 50-60% の リフォームを 獲得している一方、
                中小工務店は 20-30% に とどまります。 この 30 ポイントの差を、
                アトツギ 1 人 + 奥さま で 埋める道具です。
              </p>

              {/* ROI 試算 (電卓風) */}
              <div className="mt-8 rounded-2xl border border-[#d6cfc2] bg-white/70 p-5 font-mono text-[13px] leading-7 text-[#2b261e]">
                <p className="text-[11px] font-semibold tracking-[0.15em] text-[#8a8478]">
                  ROI 試算 (年商 1 億規模 / OB 200 件)
                </p>
                <p className="mt-2">
                  200 件 × <span className="font-bold text-[#b85c3a]">+30 pt</span> = 60 件 追加 リフォーム
                </p>
                <p>
                  60 件 × ¥150 万 ={" "}
                  <span className="text-[16px] font-bold text-[#b85c3a]">¥9,000 万 / 年</span>
                </p>
                <p className="mt-1 text-[11px] text-[#8a8478]">
                  ※ 単価・獲得率 仮定値、 5/30 業界統計裏取り後に確定
                </p>
              </div>

              {/* CTA: 手紙風 */}
              <div className="mt-8 rounded-2xl border border-[#d9c7bc] bg-white p-6 shadow-sm">
                <p
                  className={`${serif.className} text-[18px] leading-7 text-[#1f2a37]`}
                >
                  親方に見せる前に、
                  <br />
                  30 分だけ話を聞いてください。
                </p>
                <div className="mt-4 flex flex-wrap gap-3 text-[13px]">
                  <a
                    href="/#contact"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f2a37] px-4 py-2 text-white transition hover:bg-[#3a4756]"
                  >
                    <MessageCircle className="h-4 w-4" /> LINE で送る
                  </a>
                  <a
                    href="tel:#"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6cfc2] bg-white px-4 py-2 text-[#1f2a37] transition hover:bg-[#f7f3ec]"
                  >
                    <Phone className="h-4 w-4" /> 電話
                  </a>
                  <a
                    href="mailto:#"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6cfc2] bg-white px-4 py-2 text-[#1f2a37] transition hover:bg-[#f7f3ec]"
                  >
                    <Mail className="h-4 w-4" /> メール
                  </a>
                </div>
              </div>
            </div>

            {/* 右: OB タイムライン + 予測カウンタ */}
            <div className="flex flex-col justify-center">
              <div className="rounded-3xl border border-[#d6cfc2] bg-white p-6 shadow-[0_20px_60px_rgba(31,42,55,0.08)]">
                <div className="flex items-baseline justify-between">
                  <p className="text-[11px] font-semibold tracking-[0.15em] text-[#8a8478]">
                    次の 12 ヶ月で 再訪問可能
                  </p>
                  <TrendingUp className="h-4 w-4 text-[#b85c3a]" />
                </div>
                <p
                  className={`${serif.className} mt-2 text-[64px] leading-none text-[#b85c3a]`}
                >
                  38<span className="text-[24px] text-[#1f2a37]"> 件</span>
                </p>
                <p className="mt-1 text-[12px] text-[#5f6871]">
                  OB 200 件中、 AI 予測ベース
                </p>

                {/* 10 年タイムライン (簡易) */}
                <div className="mt-8 space-y-2.5">
                  {timelineData.map(({ year, count }) => {
                    const hot = year === 2026
                    return (
                      <div key={year} className="flex items-center gap-3">
                        <span className="w-12 font-mono text-[11px] text-[#8a8478]">
                          {year}
                        </span>
                        <div className="flex-1 rounded bg-[#f7f3ec]">
                          <div
                            className={`h-2 rounded ${hot ? "bg-[#b85c3a]" : "bg-[#d6cfc2]"}`}
                            style={{ width: `${count * 2.5}%` }}
                          />
                        </div>
                        <span
                          className={`w-10 text-right font-mono text-[11px] ${
                            hot
                              ? "font-bold text-[#b85c3a]"
                              : "text-[#8a8478]"
                          }`}
                        >
                          {count}件
                        </span>
                      </div>
                    )
                  })}
                </div>

                <a
                  href="#dashboard"
                  className="mt-8 inline-flex items-center gap-1.5 text-[12px] text-[#b85c3a] transition hover:opacity-70"
                >
                  詳しいダッシュボードを見る{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 大手 vs 中小 リフォーム獲得率 比較 */}
        {/* ============================================ */}
        <section className="border-y border-[#d6cfc2] bg-[#f8f1e3] px-6 py-16">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
              業界ベンチマーク
            </p>
            <h2
              className={`${serif.className} mt-2 text-[28px] leading-[1.5] tracking-[-0.01em] text-[#1f2a37] sm:text-[36px]`}
            >
              大手と中小、 OB リフォーム獲得率の <span className="text-[#b85c3a]">30 ポイント</span>の差。
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-7 text-[#5f6871]">
              ※ 数字は業界一般の目安、 5/30 業界統計裏取り後に確定
            </p>

            <div className="mt-10 space-y-6">
              <BenchmarkBar label="大手 (積水 / 大和 等)" value={55} color="#8a8478" sub="LTV 戦略 + OB 専任 CRM" />
              <BenchmarkBar label="中小 (業界平均、 現状)" value={25} color="#d6cfc2" sub="紙台帳 + 親方の記憶" />
              <BenchmarkBar
                label="本サービス 導入後 (目標)"
                value={45}
                color="#b85c3a"
                sub="アトツギ 1 人 + 奥さま 運用 想定"
                emphasis
              />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* インタラクティブ デモ (既存 component) */}
        {/* ============================================ */}
        <section id="dashboard" className="px-6 py-16">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
              触って試す
            </p>
            <h2
              className={`${serif.className} mt-2 text-[28px] leading-[1.5] tracking-[-0.01em] text-[#1f2a37] sm:text-[36px]`}
            >
              動くダッシュボード で 体験してください
            </h2>
            <p className="mt-3 max-w-2xl text-[14px] leading-7 text-[#5f6871]">
              実装版の SaaS は 同じ動作で、 過去名簿の取り込み + 自動アプローチ送信 を 含みます。
            </p>
            <div className="mt-8 rounded-3xl border border-[#d6cfc2] bg-white p-4 shadow-sm sm:p-6">
              <OBManagementDemo />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 価格 3 段階 */}
        {/* ============================================ */}
        <section className="border-t border-[#d6cfc2] bg-[#f8f1e3] px-6 py-16">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
              価格
            </p>
            <h2
              className={`${serif.className} mt-2 text-[28px] leading-[1.5] tracking-[-0.01em] text-[#1f2a37] sm:text-[36px]`}
            >
              SaaS 月 3 / 5 / 10 万、 まずは話を聞いてから
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <PriceTier amount="月 3 万" label="SaaS のみ" note="移行は 自分で" />
              <PriceTier
                amount="月 5 万"
                label="SaaS + 操作サポート"
                note="月 1 回 + 親子で 共有"
                emphasis
              />
              <PriceTier
                amount="月 10 万"
                label="SaaS + アプローチ代行"
                note="文面作成・送信を 弊社が 巻き取り"
              />
            </div>
            <p className="mt-6 text-[12px] text-[#8a8478]">
              初期 BPaaS (Excel / 紙台帳 → SaaS 移行): 50 / 100 / 150 万 の 3 段階で 見積もり可 (件数次第)。 IT 通常枠 1/2 補助金 対象見込み (採択保証なし)。
            </p>
          </div>
        </section>

        {/* ============================================ */}
        {/* 末尾 CTA + ナビ */}
        {/* ============================================ */}
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="rounded-3xl border border-[#d9c7bc] bg-white p-8 shadow-[0_26px_70px_rgba(31,42,55,0.08)] sm:p-12">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
                次のステップ
              </p>
              <h2
                className={`${serif.className} mt-3 text-[28px] leading-[1.5] tracking-[-0.02em] text-[#1f2a37] sm:text-[36px]`}
              >
                親子で 90 分、 一緒に 試算しませんか
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#5f6871]">
                30 分は アトツギ単独 ヒアリング、 60 分は 親方同席で ROI 試算 + 月額 / 買い切り 提案。
                オンライン or 訪問 どちらでも。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f2a37] px-5 py-3 text-[14px] font-medium text-white transition hover:bg-[#3a4756]"
                >
                  <MessageCircle className="h-4 w-4" /> LINE で 相談する
                </Link>
                <Link
                  href="/local-business/v8.0"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6cfc2] bg-white px-5 py-3 text-[14px] font-medium text-[#1f2a37] transition hover:bg-[#f7f3ec]"
                >
                  6 デモ ハブへ <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-10 border-t border-[#d6cfc2] pt-6">
                <p className="text-[11px] font-semibold tracking-[0.15em] text-[#8a8478]">
                  他のデザイン案を見る
                </p>
                <DesignNav current="a" layout="footer" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// ============================================
// サブコンポーネント
// ============================================

function BenchmarkBar({
  label,
  value,
  color,
  sub,
  emphasis = false,
}: {
  label: string
  value: number
  color: string
  sub: string
  emphasis?: boolean
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-1">
        <div className="min-w-0 flex-1">
          <p
            className={`text-[13px] sm:text-[14px] ${emphasis ? "font-bold text-[#1f2a37]" : "text-[#5f6871]"}`}
          >
            {label}
          </p>
          <p className="text-[10px] text-[#8a8478] sm:text-[11px]">{sub}</p>
        </div>
        <span
          className={`font-mono text-[14px] sm:text-[15px] ${emphasis ? "font-bold text-[#b85c3a]" : "text-[#5f6871]"}`}
        >
          {value}%
        </span>
      </div>
      <div className="mt-2 h-3 rounded-full bg-white">
        <div
          className="h-3 rounded-full transition-all"
          style={{ width: `${value}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function PriceTier({
  amount,
  label,
  note,
  emphasis = false,
}: {
  amount: string
  label: string
  note: string
  emphasis?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        emphasis
          ? "border-[#b85c3a] bg-white shadow-[0_8px_24px_rgba(184,92,58,0.15)]"
          : "border-[#d6cfc2] bg-white"
      }`}
    >
      <p
        className={`${serif.className} text-[26px] font-bold tracking-tight ${
          emphasis ? "text-[#b85c3a]" : "text-[#1f2a37]"
        }`}
      >
        {amount}
      </p>
      <p className="mt-2 text-[14px] font-medium text-[#1f2a37]">{label}</p>
      <p className="mt-1 text-[12px] text-[#8a8478]">{note}</p>
    </div>
  )
}

function DesignNav({
  current,
  layout = "header",
}: {
  current: "a" | "b" | "c"
  layout?: "header" | "footer"
}) {
  const items = [
    { key: "a", label: "案 A 数字主役", href: "/local-business/ob-management/option-a" },
    { key: "b", label: "案 B タイムライン", href: "/local-business/ob-management/option-b" },
    { key: "c", label: "案 C 三層レイヤー", href: "/local-business/ob-management/option-c" },
  ] as const

  return (
    <nav
      className={`flex flex-wrap items-center gap-2 ${layout === "footer" ? "mt-3" : ""}`}
    >
      {items.map((item) => {
        const active = item.key === current
        return (
          <Link
            key={item.key}
            href={item.href}
            className={`inline-flex items-center rounded-full border px-3 py-1.5 text-[11px] font-bold tracking-[0.05em] transition ${
              active
                ? "border-[#b85c3a] bg-[#b85c3a] text-white"
                : "border-[#d6cfc2] bg-white text-[#5f6871] hover:bg-[#f7f3ec] hover:text-[#1f2a37]"
            }`}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
