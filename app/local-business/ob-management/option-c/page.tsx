"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Calculator,
  HandHeart,
  Hammer,
  Mail,
  MessageCircle,
  Phone,
  TrendingUp,
  Users,
} from "lucide-react"
import { Noto_Serif_JP } from "next/font/google"
import { OBManagementDemo } from "../ob-management-demo"

const serif = Noto_Serif_JP({ subsets: ["latin"], weight: ["500", "700"] })

type Persona = "atotsugi" | "wife" | "father"

const personas: { key: Persona; label: string; sub: string; icon: React.ReactNode }[] = [
  { key: "atotsugi", label: "アトツギ視点", sub: "30-40 代 後継者", icon: <Users className="h-4 w-4" /> },
  { key: "wife", label: "奥さま (経理) 視点", sub: "数字 と 売上影響", icon: <Calculator className="h-4 w-4" /> },
  { key: "father", label: "親方 視点", sub: "60-70 代 経営者", icon: <Hammer className="h-4 w-4" /> },
]

export default function OBManagementOptionCPage() {
  const [active, setActive] = useState<Persona>("atotsugi")

  return (
    <div
      className={`min-h-screen text-[#2b261e] transition-colors duration-300 ${
        active === "father" ? "bg-[#f5e6c8]" : "bg-[#fcf6e9]"
      }`}
    >
      <header
        className={`sticky top-0 z-20 border-b backdrop-blur ${
          active === "father"
            ? "border-[#d4c499] bg-[#f5e6c8]/90"
            : "border-[#d6cfc2] bg-[#fcf6e9]/90"
        }`}
      >
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <Link
            href="/local-business/ob-management"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#5f6871] transition hover:text-[#1f2a37]"
          >
            <ArrowLeft className="h-4 w-4" />
            既存版へ戻る
          </Link>
          <DesignNav current="c" />
        </div>
      </header>

      <main>
        {/* ============================================ */}
        {/* Hero + ペルソナ タブ */}
        {/* ============================================ */}
        <section className="px-6 py-12 sm:py-16">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
              A-1 · OB 10 年管理 SaaS · 案 C
            </p>
            <h1
              className={`${serif.className} mt-4 text-[28px] leading-[1.4] tracking-[-0.02em] text-[#1f2a37] sm:text-[40px] lg:text-[48px]`}
            >
              同じ機能を、 3 つの視点から
              <br />
              <span className="text-[#b85c3a]">親子で 一緒に</span> 見てください。
            </h1>
            <p className="mt-5 max-w-[640px] text-[16px] leading-7 text-[#5f6871]">
              アトツギ・奥さま・親方の 3 者で、 同じ機能でも見え方が違います。
              タブを切り替えて、 「自分の立場で 何が変わるか」 を 確認できる構成です。
            </p>

            {/* ペルソナ タブ (スマホ縦並び / md 以上 横並び) */}
            <div
              role="tablist"
              aria-label="ペルソナ切替"
              className="mt-8 flex w-full flex-col gap-2 rounded-2xl border border-[#d6cfc2] bg-white/70 p-2 shadow-sm sm:mt-10 sm:inline-flex sm:w-auto sm:flex-row sm:flex-wrap"
            >
              {personas.map((p) => {
                const isActive = p.key === active
                return (
                  <button
                    key={p.key}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(p.key)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-left text-[13px] font-medium transition sm:px-4 ${
                      isActive
                        ? p.key === "father"
                          ? "bg-[#c98a2e] text-white shadow-sm"
                          : "bg-[#b85c3a] text-white shadow-sm"
                        : "text-[#5f6871] hover:bg-[#f7f3ec]"
                    }`}
                  >
                    {p.icon}
                    <span className="flex flex-col items-start sm:flex-row sm:items-baseline sm:gap-1.5">
                      <span>{p.label}</span>
                      <span className="text-[10px] opacity-75">{p.sub}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* ペルソナ別 メインコンテンツ */}
        {/* ============================================ */}
        <section className="px-6 pb-16">
          <div className="mx-auto max-w-[1240px]">
            {active === "atotsugi" && <AtotsugiView />}
            {active === "wife" && <WifeView />}
            {active === "father" && <FatherView />}
          </div>
        </section>

        {/* ============================================ */}
        {/* インタラクティブ デモ (共通) */}
        {/* ============================================ */}
        <section
          id="dashboard"
          className={`border-y px-6 py-16 ${
            active === "father"
              ? "border-[#d4c499] bg-[#fcf6e9]"
              : "border-[#d6cfc2] bg-white"
          }`}
        >
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
              触って試す (3 視点共通)
            </p>
            <h2
              className={`${serif.className} mt-2 text-[28px] leading-[1.5] tracking-[-0.01em] text-[#1f2a37] sm:text-[36px]`}
            >
              動くダッシュボード で 体験してください
            </h2>
            <div className="mt-8 rounded-3xl border border-[#d6cfc2] bg-white p-4 shadow-sm sm:p-6">
              <OBManagementDemo />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 家族共通 CTA + ナビ */}
        {/* ============================================ */}
        <section className="px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-[1240px]">
            <div className="rounded-3xl border border-[#d9c7bc] bg-white p-8 shadow-[0_26px_70px_rgba(31,42,55,0.08)] sm:p-12">
              <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
                3 人で 90 分
              </p>
              <h2
                className={`${serif.className} mt-3 text-[28px] leading-[1.5] tracking-[-0.02em] text-[#1f2a37] sm:text-[36px]`}
              >
                親子で、 一緒に 試算しませんか
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#5f6871]">
                30 分は アトツギ単独 ヒアリング、 60 分は 親方 + 奥さま 同席で ROI 試算 + 提案。
                オンライン or 訪問 どちらでも。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f2a37] px-5 py-3 text-[14px] font-medium text-white transition hover:bg-[#3a4756]"
                >
                  <MessageCircle className="h-4 w-4" /> LINE で 相談する
                </Link>
                <a
                  href="tel:#"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6cfc2] bg-white px-5 py-3 text-[14px] font-medium text-[#1f2a37] transition hover:bg-[#f7f3ec]"
                >
                  <Phone className="h-4 w-4" /> 電話
                </a>
                <a
                  href="mailto:#"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6cfc2] bg-white px-5 py-3 text-[14px] font-medium text-[#1f2a37] transition hover:bg-[#f7f3ec]"
                >
                  <Mail className="h-4 w-4" /> メール
                </a>
              </div>

              <div className="mt-10 border-t border-[#d6cfc2] pt-6">
                <p className="text-[11px] font-semibold tracking-[0.15em] text-[#8a8478]">
                  他のデザイン案を見る
                </p>
                <DesignNav current="c" layout="footer" />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// ============================================
// ペルソナ別 ビュー
// ============================================

function AtotsugiView() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <ViewCard
        title="自動化フロー"
        accent="#b85c3a"
        icon={<TrendingUp className="h-5 w-5" />}
        size="large"
      >
        <ol className="space-y-3 text-[13px] leading-6 text-[#2b261e]">
          <FlowStep no="1" title="OB 200 件 を SaaS に 移行">
            初期 BPaaS で 弊社が Excel / 紙台帳を 巻き取り。 親方の手は 動きません。
          </FlowStep>
          <FlowStep no="2" title="AI が 12 ヶ月 予測">
            経過年数 + 工事種別 + 自由メモ から 「次の 12 ヶ月で 動くべき OB」 を リフトアップ。
          </FlowStep>
          <FlowStep no="3" title="自動アプローチ 月 3 件商談化">
            文面 自動生成 → LINE / メール 送信 → 反応 ハイライト。 アトツギは 確認するだけ。
          </FlowStep>
        </ol>
      </ViewCard>

      <ViewCard
        title="ROI ダッシュボード"
        accent="#b85c3a"
        icon={<Calculator className="h-5 w-5" />}
      >
        <div className="space-y-3 font-mono text-[12px] leading-7">
          <p>200 件 × <span className="font-bold text-[#b85c3a]">+30 pt</span> = 60 件</p>
          <p>60 件 × ¥150 万 = <span className="text-[16px] font-bold text-[#b85c3a]">¥9,000 万 / 年</span></p>
          <p className="text-[10px] text-[#8a8478]">※ 5/30 業界統計裏取り後に確定</p>
        </div>
      </ViewCard>

      <ViewCard
        title="父親に渡す資料"
        accent="#b85c3a"
        icon={<HandHeart className="h-5 w-5" />}
      >
        <p className="text-[13px] leading-6 text-[#2b261e]">
          ROI 試算 PDF + 同業他社事例 を ワンクリックで 出力。
          親方が「数字で見せて」 と言った時に 1 分で 印刷。
        </p>
      </ViewCard>
    </div>
  )
}

function WifeView() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#d6cfc2] bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold tracking-[0.15em] text-[#8a8478]">
          月次 売上影響 (試算)
        </p>
        <p
          className={`${serif.className} mt-2 text-[28px] text-[#1f2a37]`}
        >
          月 平均 <span className="text-[#b85c3a]">¥750 万</span> の リフォーム売上 が 上乗せ可能
        </p>
        <p className="mt-2 text-[12px] text-[#8a8478]">
          (年間 +¥9,000 万 ÷ 12 ヶ月)
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <NumberCard label="SaaS 月額 コスト" value="¥3-10 万" tone="cost" sub="月 5 万 が中央値" />
          <NumberCard label="人件費 (専任スタッフ 雇わず)" value="¥0" tone="savings" sub="アトツギ + 奥さま 運用" />
          <NumberCard label="リフォーム 平均 単価" value="¥150 万" tone="neutral" sub="業界平均" />
          <NumberCard label="必要 商談数 / 月" value="0.5 件" tone="savings" sub="SaaS コスト 回収ライン" />
        </div>
      </div>

      <div className="rounded-3xl border border-[#d6cfc2] bg-white p-6 shadow-sm sm:p-8">
        <p className="text-[11px] font-semibold tracking-[0.15em] text-[#8a8478]">
          経費 vs 売上 12 ヶ月 シミュレーション
        </p>

        {/* PC (sm 以上): 12 列縦棒 */}
        <div className="mt-4 hidden grid-cols-12 gap-1 sm:grid">
          {Array.from({ length: 12 }).map((_, i) => {
            const month = i + 1
            const revenue = i < 3 ? 250 : i < 6 ? 500 : 750
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-full rounded-t bg-[#b85c3a] transition-all"
                  style={{ height: `${revenue / 8}px` }}
                />
                <div className="w-full rounded-b bg-[#d6cfc2]" style={{ height: "8px" }} />
                <span className="mt-1 font-mono text-[9px] text-[#8a8478]">{month}M</span>
              </div>
            )
          })}
        </div>

        {/* Mobile (sm 未満): 横棒リスト */}
        <div className="mt-4 space-y-2 sm:hidden">
          {Array.from({ length: 12 }).map((_, i) => {
            const month = i + 1
            const revenue = i < 3 ? 250 : i < 6 ? 500 : 750
            return (
              <div key={i} className="flex items-center gap-2">
                <span className="w-10 font-mono text-[10px] text-[#8a8478]">{month}M</span>
                <div className="flex h-5 flex-1 overflow-hidden rounded bg-[#f7f3ec]">
                  <div
                    className="bg-[#b85c3a]"
                    style={{ width: `${(revenue / 800) * 100}%` }}
                  />
                  <div className="bg-[#d6cfc2]" style={{ width: "4%" }} />
                </div>
                <span className="w-12 text-right font-mono text-[10px] text-[#5f6871]">
                  ¥{revenue}万
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#5f6871]">
          <span className="inline-flex items-center gap-1.5">
            <span className="block h-3 w-3 rounded bg-[#b85c3a]" />
            リフォーム 売上 (試算)
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="block h-3 w-3 rounded bg-[#d6cfc2]" />
            SaaS 月額 コスト
          </span>
        </div>
      </div>
    </div>
  )
}

function FatherView() {
  const memoryNames = [
    "田中様 (国立、 2016)", "佐藤様 (府中、 2017)", "山田様 (調布、 2018)",
    "鈴木様 (立川、 2019)", "高橋様 (八王子、 2020)", "渡辺様 (国分寺、 2021)",
    "伊藤様 (府中、 2022)", "中村様 (調布、 2023)", "小林様 (国立、 2024)", "加藤様 (立川、 2025)",
  ]
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#d4c499] bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold tracking-[0.15em] text-[#7a5c38]">
          親方の信頼関係 + データ補強
        </p>
        <h3
          className={`${serif.className} mt-2 text-[26px] leading-[1.5] text-[#5a4a3a]`}
        >
          親方の頭の中の 顧客一人ひとり、 失わせません。
        </h3>
        <p className="mt-3 max-w-[640px] text-[14px] leading-7 text-[#7a5c38]">
          親方が今まで築いてきた 信頼関係を、 紙台帳 1 つ無くしても 失わない形で残します。
          AI は 親方の判断を 否定しません。 「いつ、 誰に、 何を 提案するか」 の 補助役です。
        </p>
      </div>

      <div className="rounded-3xl border border-[#d4c499] bg-white/80 p-8 shadow-sm">
        <p className="text-[11px] font-semibold tracking-[0.15em] text-[#7a5c38]">
          過去 10 年の 顧客 (一部)
        </p>
        <p className="mt-2 text-[13px] leading-6 text-[#7a5c38]">
          顔と名前を 並べると 思い出すこと、 たくさんあるはずです。
        </p>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {memoryNames.map((name, i) => (
            <div
              key={i}
              className="rounded-xl border border-[#d4c499]/60 bg-[#fcf6e9] px-3 py-2.5 text-[13px] text-[#5a4a3a]"
            >
              {name}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-[#d4c499] bg-white p-8 shadow-sm">
        <p className="text-[11px] font-semibold tracking-[0.15em] text-[#7a5c38]">
          息子 (アトツギ) からの 提案
        </p>
        <p
          className={`${serif.className} mt-3 text-[20px] leading-[1.7] text-[#5a4a3a]`}
        >
          親方が顔も名前も覚えてる OB さん、<br />
          「次の 10 年は データと一緒に」 守りませんか。
        </p>
        <p className="mt-3 text-[12px] text-[#8a8478]">
          ※ 親方の判断が 全て、 AI は補助。
        </p>
      </div>
    </div>
  )
}

// ============================================
// サブコンポーネント
// ============================================

function ViewCard({
  title,
  accent,
  icon,
  children,
  size = "normal",
}: {
  title: string
  accent: string
  icon: React.ReactNode
  children: React.ReactNode
  size?: "normal" | "large"
}) {
  return (
    <div
      className={`rounded-3xl border border-[#d6cfc2] bg-white p-6 shadow-sm ${
        size === "large" ? "lg:col-span-1 lg:row-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="rounded-full p-2"
          style={{ backgroundColor: `${accent}1f`, color: accent }}
        >
          {icon}
        </span>
        <h3 className={`${serif.className} text-[18px] text-[#1f2a37]`}>{title}</h3>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  )
}

function FlowStep({
  no,
  title,
  children,
}: {
  no: string
  title: string
  children: React.ReactNode
}) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#b85c3a] font-mono text-[12px] font-bold text-white">
        {no}
      </span>
      <div className="flex-1">
        <p className="font-bold text-[#1f2a37]">{title}</p>
        <p className="mt-1 text-[12px] text-[#5f6871]">{children}</p>
      </div>
    </li>
  )
}

function NumberCard({
  label,
  value,
  tone,
  sub,
}: {
  label: string
  value: string
  tone: "cost" | "savings" | "neutral"
  sub: string
}) {
  const color = tone === "cost" ? "#8a8478" : tone === "savings" ? "#4a7c4a" : "#1f2a37"
  return (
    <div className="rounded-2xl border border-[#d6cfc2] bg-[#fcf6e9] p-4">
      <p className="text-[11px] font-semibold tracking-[0.1em] text-[#8a8478]">
        {label}
      </p>
      <p
        className={`${serif.className} mt-2 text-[24px]`}
        style={{ color }}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] text-[#8a8478]">{sub}</p>
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
