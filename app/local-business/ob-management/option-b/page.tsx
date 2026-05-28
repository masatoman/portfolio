"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Calendar,
  Home,
  Mail,
  MessageCircle,
  Phone,
  X,
} from "lucide-react"
import { Noto_Serif_JP } from "next/font/google"
import { OBManagementDemo } from "../ob-management-demo"

const serif = Noto_Serif_JP({ subsets: ["latin"], weight: ["500", "700"] })

type OBEntry = {
  id: number
  year: number
  customerName: string
  workType: string
  area: string
  predictedAction: string
  predictedMonth: string
  fatherMemo: string
  aiSuggestion: string
}

const obEntries: OBEntry[] = [
  { id: 1, year: 2016, customerName: "田中様 (国立)", workType: "新築", area: "32 坪", predictedAction: "外壁塗装 提案", predictedMonth: "2026 年 10 月", fatherMemo: "息子さん 中学生になった頃。 几帳面な奥さま。", aiSuggestion: "外壁色は前回 ベージュ系、 サンプル 3 色 提案" },
  { id: 2, year: 2017, customerName: "佐藤様 (府中)", workType: "新築", area: "28 坪", predictedAction: "屋根葺替", predictedMonth: "2027 年 4 月", fatherMemo: "ペット (犬 2 匹)。 ガレージ拡張も話してた。", aiSuggestion: "屋根 + ガレージ拡張の セット提案" },
  { id: 3, year: 2018, customerName: "山田様 (調布)", workType: "リフォーム", area: "キッチン", predictedAction: "水回り 一括", predictedMonth: "2026 年 12 月", fatherMemo: "親と同居予定。 段差解消も気にしてた。", aiSuggestion: "バリアフリー + 水回り 同時提案" },
  { id: 4, year: 2019, customerName: "鈴木様 (立川)", workType: "新築", area: "35 坪", predictedAction: "外壁塗装", predictedMonth: "2027 年 8 月", fatherMemo: "息子夫婦が同居 予定。 二世帯化 想定。", aiSuggestion: "二世帯リフォーム 相談打診" },
  { id: 5, year: 2020, customerName: "高橋様 (八王子)", workType: "リフォーム", area: "全面", predictedAction: "メンテナンス点検", predictedMonth: "2026 年 11 月", fatherMemo: "ご主人 退職。 家にいる時間が増えた。", aiSuggestion: "在宅快適化 (書斎 / 庭) 提案" },
]

export default function OBManagementOptionBPage() {
  const [selected, setSelected] = useState<OBEntry | null>(null)

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
          <DesignNav current="b" />
        </div>
      </header>

      <main>
        {/* ============================================ */}
        {/* Hero: 10 年タイムライン主役 */}
        {/* ============================================ */}
        <section className="px-6 pb-10 pt-16 sm:pb-12 sm:pt-20">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
              A-1 · OB 10 年管理 SaaS · 案 B
            </p>
            <h1
              className={`${serif.className} mt-4 text-[30px] leading-[1.35] tracking-[-0.02em] text-[#1f2a37] sm:text-[40px] lg:text-[52px]`}
            >
              今、 動くべき OB が
              <br />
              <span className="text-[#b85c3a]">38 件</span> あります。
            </h1>
            <p className="mt-5 max-w-[640px] text-[16px] leading-8 text-[#5f6871]">
              過去 10 年に建てた施主さんを 1 件ずつタップして、 親方の頭の中とAI 予測を照らし合わせてみてください。
              「次に何を提案するか」 が 名前と一緒に見えてきます。
            </p>
          </div>
        </section>

        {/* ============================================ */}
        {/* 10 年 タイムライン (PC: 横スクロール / Mobile: 縦カードリスト) */}
        {/* ============================================ */}
        <section className="px-0 pb-16">
          <div className="mx-auto max-w-[1240px] px-6">
            <p className="text-[11px] font-semibold tracking-[0.15em] text-[#8a8478]">
              2016 → 2026 / OB タイムライン (5 件抜粋)
            </p>
          </div>

          {/* PC (md ≥): 横スクロール タイムライン */}
          <div className="relative mt-6 hidden overflow-x-auto pb-6 md:block">
            <div className="mx-auto min-w-[1100px] max-w-[1240px] px-6">
              {/* 軸線 */}
              <div className="relative h-px bg-[#d6cfc2]">
                {[2016, 2018, 2020, 2022, 2024, 2026].map((year, i) => (
                  <div
                    key={year}
                    className="absolute -top-1.5 h-3 w-px bg-[#8a8478]"
                    style={{ left: `${(i / 5) * 100}%` }}
                  >
                    <span className="absolute left-1/2 top-4 -translate-x-1/2 font-mono text-[11px] text-[#8a8478]">
                      {year}
                    </span>
                  </div>
                ))}
              </div>

              {/* OB エントリ */}
              <div className="relative mt-16">
                {obEntries.map((entry) => {
                  const pos = ((entry.year - 2016) / 10) * 100
                  const hot = entry.predictedMonth.startsWith("2026")
                  return (
                    <button
                      key={entry.id}
                      type="button"
                      onClick={() => setSelected(entry)}
                      className="absolute -top-12 -translate-x-1/2 group"
                      style={{ left: `${pos}%` }}
                    >
                      <div
                        className={`flex flex-col items-center gap-2 rounded-2xl border-2 px-3 py-3 transition ${
                          hot
                            ? "border-[#b85c3a] bg-white shadow-[0_8px_24px_rgba(184,92,58,0.18)]"
                            : "border-[#d6cfc2] bg-white hover:border-[#b85c3a]"
                        }`}
                      >
                        <Home
                          className={`h-6 w-6 ${hot ? "text-[#b85c3a]" : "text-[#8a8478]"}`}
                        />
                        <span className="font-mono text-[10px] text-[#5f6871]">
                          {entry.customerName.split(" ")[0]}
                        </span>
                        {hot && (
                          <span className="rounded-full bg-[#b85c3a] px-2 py-0.5 text-[9px] font-bold text-white">
                            今月 提案
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Mobile (sm 以下): 縦カードリスト */}
          <div className="mx-auto mt-6 max-w-[1240px] space-y-3 px-6 md:hidden">
            {obEntries.map((entry) => {
              const hot = entry.predictedMonth.startsWith("2026")
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => setSelected(entry)}
                  className={`flex w-full items-center gap-3 rounded-2xl border-2 p-4 text-left transition ${
                    hot
                      ? "border-[#b85c3a] bg-white shadow-[0_4px_14px_rgba(184,92,58,0.15)]"
                      : "border-[#d6cfc2] bg-white"
                  }`}
                >
                  <div className={`flex-shrink-0 rounded-xl p-2.5 ${hot ? "bg-[#b85c3a]/10" : "bg-[#f7f3ec]"}`}>
                    <Home className={`h-5 w-5 ${hot ? "text-[#b85c3a]" : "text-[#8a8478]"}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-1.5">
                      <span className="font-mono text-[11px] text-[#8a8478]">{entry.year}</span>
                      <span className="text-[14px] font-bold text-[#1f2a37]">{entry.customerName}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#5f6871]">
                      {entry.workType} · {entry.area}
                    </p>
                    <p className={`mt-1 text-[12px] ${hot ? "font-bold text-[#b85c3a]" : "text-[#8a8478]"}`}>
                      {entry.predictedMonth}: {entry.predictedAction}
                    </p>
                  </div>
                  {hot && (
                    <span className="flex-shrink-0 rounded-full bg-[#b85c3a] px-2 py-1 text-[9px] font-bold text-white">
                      今月
                    </span>
                  )}
                </button>
              )
            })}
            <p className="pt-2 text-center text-[11px] text-[#8a8478]">
              タップで詳細 / PC では 10 年横スクロール表示
            </p>
          </div>

          {/* タイムライン下部 説明 */}
          <div className="mx-auto mt-12 max-w-[1240px] px-6">
            <div className="grid gap-4 sm:grid-cols-3">
              <Stat label="今月提案 ベスト" value="3 件" sub="2026 年に再訪問時期" />
              <Stat label="3 ヶ月以内" value="12 件" sub="アプローチ 文面 自動生成済" />
              <Stat label="12 ヶ月以内" value="38 件" sub="AI 予測 (信頼度 ≥ 70%)" />
            </div>
          </div>
        </section>

        {/* ============================================ */}
        {/* 父親 vs AI 比較 */}
        {/* ============================================ */}
        <section className="border-y border-[#d6cfc2] bg-[#f8f1e3] px-6 py-16">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[12px] font-semibold tracking-[0.2em] text-[#b85c3a]">
              親方の頭の中を データ化する
            </p>
            <h2
              className={`${serif.className} mt-2 text-[28px] leading-[1.5] tracking-[-0.01em] text-[#1f2a37] sm:text-[36px]`}
            >
              ベテランの勘 と AI 予測、 一致率 <span className="text-[#b85c3a]">87%</span>。
            </h2>
            <p className="mt-3 max-w-[640px] text-[14px] leading-7 text-[#5f6871]">
              親方が 「あの家、 そろそろ塗装かな」 と思った OB と、
              AI が 「2026 年 10 月 提案ベスト」 と予測した OB の 重なり率。
              親方の経験を否定せず、 補強する立場で 動きます。
            </p>

            <div className="mt-10 grid gap-6 lg:grid-cols-2">
              <ComparisonCard
                title="父親 (親方) の頭"
                icon={<Brain className="h-5 w-5" />}
                items={[
                  "田中様 — 外壁、 そろそろ",
                  "佐藤様 — 屋根、 もう少し先",
                  "山田様 — 親と同居 検討中らしい",
                  "鈴木様 — 二世帯、 息子夫婦の話",
                ]}
                tone="father"
              />
              <ComparisonCard
                title="AI 予測 (経過年数 + 工事種別 + 自由メモ)"
                icon={<Calendar className="h-5 w-5" />}
                items={[
                  "田中様 → 2026 年 10 月 外壁塗装",
                  "佐藤様 → 2027 年 4 月 屋根葺替",
                  "山田様 → 2026 年 12 月 水回り 一括",
                  "鈴木様 → 2027 年 8 月 二世帯リフォーム",
                ]}
                tone="ai"
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
            <div className="mt-8 rounded-3xl border border-[#d6cfc2] bg-white p-4 shadow-sm sm:p-6">
              <OBManagementDemo />
            </div>
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
                過去 10 年の OB を 30 分で棚卸し
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-[#5f6871]">
                親方の頭の中にある名前と、 当社の AI 予測を 一緒に並べて、 「次の 12 ヶ月で動くべき OB」 のリストを作ります。
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
                <DesignNav current="b" layout="footer" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================ */}
      {/* スティッキー CTA バー (PC のみ、 スマホは別途下部 spacer 追加) */}
      {/* ============================================ */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#d9c7bc] bg-white/95 px-3 py-2.5 backdrop-blur sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-2 sm:gap-3">
          <p className="hidden text-[12px] text-[#5f6871] sm:block">
            過去 10 年の OB を <strong className="text-[#b85c3a]">30 分</strong> で棚卸し
          </p>
          <div className="flex w-full flex-1 gap-2 text-[12px] sm:w-auto sm:flex-initial">
            <a
              href="/#contact"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg bg-[#1f2a37] px-3 py-2 text-white sm:flex-initial"
            >
              <MessageCircle className="h-3.5 w-3.5" /> LINE
            </a>
            <a
              href="tel:#"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#d6cfc2] bg-white px-3 py-2 text-[#1f2a37] sm:flex-initial"
            >
              <Phone className="h-3.5 w-3.5" /> 電話
            </a>
            <a
              href="mailto:#"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[#d6cfc2] bg-white px-3 py-2 text-[#1f2a37] sm:flex-initial"
            >
              <Mail className="h-3.5 w-3.5" /> メール
            </a>
          </div>
        </div>
      </div>

      {/* スティッキー CTA 分の下部余白 */}
      <div className="h-16" aria-hidden="true" />

      {/* ============================================ */}
      {/* OB 詳細モーダル */}
      {/* ============================================ */}
      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-[#1f2a37]/40 px-4 py-8 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-[640px] rounded-3xl border border-[#d9c7bc] bg-white p-6 shadow-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-[#8a8478] transition hover:bg-[#f7f3ec]"
            >
              <X className="h-5 w-5" />
            </button>
            <p className="text-[11px] font-semibold tracking-[0.15em] text-[#b85c3a]">
              {selected.year} 年 {selected.workType}
            </p>
            <h3
              className={`${serif.className} mt-2 text-[26px] text-[#1f2a37]`}
            >
              {selected.customerName}
            </h3>
            <p className="mt-1 text-[12px] text-[#8a8478]">{selected.area}</p>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-[#fde4d6] bg-[#fef5f1] p-4">
                <p className="text-[11px] font-bold tracking-[0.1em] text-[#b85c3a]">
                  AI 予測 アプローチ
                </p>
                <p className={`${serif.className} mt-1 text-[18px] text-[#1f2a37]`}>
                  {selected.predictedMonth}: {selected.predictedAction}
                </p>
                <p className="mt-2 text-[12px] leading-6 text-[#5f6871]">
                  {selected.aiSuggestion}
                </p>
              </div>
              <div className="rounded-2xl border border-[#d6cfc2] bg-[#f8f1e3] p-4">
                <p className="text-[11px] font-bold tracking-[0.1em] text-[#8a8478]">
                  親方メモ (思い出)
                </p>
                <p className="mt-2 text-[14px] leading-7 text-[#2b261e]">
                  {selected.fatherMemo}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#1f2a37] px-4 py-2 text-[13px] text-white"
              >
                <MessageCircle className="h-4 w-4" /> アプローチ文 を 自動生成
              </button>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#d6cfc2] bg-white px-4 py-2 text-[13px] text-[#1f2a37]"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// サブコンポーネント
// ============================================

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-[#d6cfc2] bg-white p-5">
      <p className="text-[11px] font-semibold tracking-[0.15em] text-[#8a8478]">
        {label}
      </p>
      <p className={`${serif.className} mt-2 text-[32px] text-[#b85c3a]`}>{value}</p>
      <p className="mt-1 text-[12px] text-[#5f6871]">{sub}</p>
    </div>
  )
}

function ComparisonCard({
  title,
  icon,
  items,
  tone,
}: {
  title: string
  icon: React.ReactNode
  items: string[]
  tone: "father" | "ai"
}) {
  const isFather = tone === "father"
  return (
    <div
      className={`rounded-3xl border p-6 ${
        isFather
          ? "border-[#d6cfc2] bg-[#f5e6c8]/60"
          : "border-[#d9c7bc] bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`rounded-full p-2 ${isFather ? "bg-[#c98a2e]/15 text-[#c98a2e]" : "bg-[#b85c3a]/15 text-[#b85c3a]"}`}
        >
          {icon}
        </span>
        <h3
          className={`${serif.className} text-[18px] ${isFather ? "text-[#7a5c38]" : "text-[#1f2a37]"}`}
        >
          {title}
        </h3>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map((item, i) => (
          <li
            key={i}
            className={`rounded-lg px-3 py-2 text-[13px] leading-6 ${
              isFather ? "bg-white/60 text-[#5a4a3a]" : "bg-[#f8f1e3] text-[#2b261e]"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
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
