"use client"

/**
 * /local-business/business-metrics
 *
 * v8.0 #04 候補 「経営状況可視化レポート SaaS」 動くデモ。
 * 5/22 北原氏面談「動くデモを先に作る」 確定を受けた MVP デモ。
 *
 * 全 SVG 直書き (Recharts 等の新規依存追加禁止)。
 * 12 ヶ月分の demo data はファイル末尾の DEMO_DATA に集約。
 *
 * セクション構成:
 *   1. ヘッダ (eyebrow + v8.0 #04 候補 バッジ)
 *   2. KPI サマリ 4 枚 (今月粗利率 / 受注単価 / 現金残 / 工事中件数)
 *   3. アラート 3-4 件 (キャッシュフロー赤信号 / 工期遅延リスク 等)
 *   4. 4 種グラフ (月次粗利率推移 / 工事別利益 Top5 / キャッシュフロー / 受注単価推移)
 *   5. 工事別詳細テーブル (15-20 件、 粗利率 / 工期 vs 予算 / 赤字案件警告 でソート)
 *   6. 「相談する」 CTA
 *
 * スタイル: warm editorial + Apple Numbers / Bloomberg 系の数字重視レイアウト混在。
 */

import Link from "next/link"
import { useMemo, useState } from "react"
import { ArrowLeft, ArrowRight, AlertTriangle, TrendingUp, TrendingDown, Wallet, Hammer, Activity } from "lucide-react"

// ============================================================
// Types
// ============================================================

type MonthlyPoint = {
  month: string // "2025-06" 形式
  label: string // "6月"
  grossMargin: number // % (0-100)
  revenue: number // 売上 (¥万)
  cashflow: number // キャッシュ残 (¥万)
  unitPrice: number // 受注単価 (¥万)
  orders: number // 件数
}

type Project = {
  id: string
  name: string // "○○邸 新築" 等
  category: "新築" | "リフォーム" | "外構" | "メンテ"
  contractAmount: number // 契約金額 (¥万)
  cost: number // 原価 (¥万)
  grossMargin: number // %
  scheduledDays: number // 予定工期 (日)
  actualDays: number // 実工期 (日、 工事中は現時点)
  status: "完了" | "工事中" | "見積中"
  startMonth: string // "2025-06"
  warning?: "redInk" | "delay" | "marginLow" | null
}

type Alert = {
  level: "danger" | "warning" | "info"
  title: string
  body: string
  source: string
}

type SortKey = "grossMargin" | "deltaDays" | "warning"

// ============================================================
// Demo Data (12 ヶ月分)
// ============================================================

const MONTHLY: MonthlyPoint[] = [
  { month: "2025-06", label: "6月", grossMargin: 22.1, revenue: 1820, cashflow: 1240, unitPrice: 260, orders: 7 },
  { month: "2025-07", label: "7月", grossMargin: 24.5, revenue: 2050, cashflow: 1410, unitPrice: 293, orders: 7 },
  { month: "2025-08", label: "8月", grossMargin: 18.7, revenue: 1640, cashflow: 1290, unitPrice: 273, orders: 6 },
  { month: "2025-09", label: "9月", grossMargin: 26.8, revenue: 2380, cashflow: 1580, unitPrice: 297, orders: 8 },
  { month: "2025-10", label: "10月", grossMargin: 23.2, revenue: 2120, cashflow: 1620, unitPrice: 303, orders: 7 },
  { month: "2025-11", label: "11月", grossMargin: 21.5, revenue: 1980, cashflow: 1490, unitPrice: 283, orders: 7 },
  { month: "2025-12", label: "12月", grossMargin: 28.4, revenue: 2640, cashflow: 1840, unitPrice: 330, orders: 8 },
  { month: "2026-01", label: "1月", grossMargin: 19.3, revenue: 1480, cashflow: 1320, unitPrice: 296, orders: 5 },
  { month: "2026-02", label: "2月", grossMargin: 17.2, revenue: 1290, cashflow: 1080, unitPrice: 258, orders: 5 },
  { month: "2026-03", label: "3月", grossMargin: 25.1, revenue: 2540, cashflow: 1420, unitPrice: 318, orders: 8 },
  { month: "2026-04", label: "4月", grossMargin: 27.3, revenue: 2780, cashflow: 1660, unitPrice: 348, orders: 8 },
  { month: "2026-05", label: "5月", grossMargin: 14.8, revenue: 1820, cashflow: 920, unitPrice: 303, orders: 6 },
]

const PROJECTS: Project[] = [
  { id: "P-001", name: "佐藤邸 新築", category: "新築", contractAmount: 2480, cost: 1810, grossMargin: 27.0, scheduledDays: 120, actualDays: 118, status: "完了", startMonth: "2025-06", warning: null },
  { id: "P-002", name: "山本邸 浴室リフォーム", category: "リフォーム", contractAmount: 320, cost: 268, grossMargin: 16.3, scheduledDays: 14, actualDays: 19, status: "完了", startMonth: "2025-07", warning: "delay" },
  { id: "P-003", name: "鈴木邸 新築", category: "新築", contractAmount: 2980, cost: 2110, grossMargin: 29.2, scheduledDays: 135, actualDays: 132, status: "完了", startMonth: "2025-07", warning: null },
  { id: "P-004", name: "田中邸 キッチン入替", category: "リフォーム", contractAmount: 180, cost: 192, grossMargin: -6.7, scheduledDays: 7, actualDays: 11, status: "完了", startMonth: "2025-08", warning: "redInk" },
  { id: "P-005", name: "高橋邸 外構工事", category: "外構", contractAmount: 420, cost: 310, grossMargin: 26.2, scheduledDays: 21, actualDays: 22, status: "完了", startMonth: "2025-08", warning: null },
  { id: "P-006", name: "伊藤邸 新築", category: "新築", contractAmount: 3120, cost: 2240, grossMargin: 28.2, scheduledDays: 140, actualDays: 135, status: "完了", startMonth: "2025-09", warning: null },
  { id: "P-007", name: "渡辺邸 屋根葺替", category: "リフォーム", contractAmount: 290, cost: 261, grossMargin: 10.0, scheduledDays: 10, actualDays: 14, status: "完了", startMonth: "2025-10", warning: "marginLow" },
  { id: "P-008", name: "中村邸 新築", category: "新築", contractAmount: 2680, cost: 1980, grossMargin: 26.1, scheduledDays: 130, actualDays: 128, status: "完了", startMonth: "2025-10", warning: null },
  { id: "P-009", name: "小林邸 メンテ点検", category: "メンテ", contractAmount: 38, cost: 22, grossMargin: 42.1, scheduledDays: 2, actualDays: 2, status: "完了", startMonth: "2025-11", warning: null },
  { id: "P-010", name: "加藤邸 リノベーション", category: "リフォーム", contractAmount: 980, cost: 812, grossMargin: 17.1, scheduledDays: 45, actualDays: 53, status: "完了", startMonth: "2025-11", warning: "delay" },
  { id: "P-011", name: "吉田邸 新築", category: "新築", contractAmount: 3380, cost: 2350, grossMargin: 30.5, scheduledDays: 145, actualDays: 142, status: "完了", startMonth: "2025-12", warning: null },
  { id: "P-012", name: "山田邸 外壁塗装", category: "リフォーム", contractAmount: 240, cost: 198, grossMargin: 17.5, scheduledDays: 12, actualDays: 13, status: "完了", startMonth: "2026-01", warning: null },
  { id: "P-013", name: "松本邸 トイレ改修", category: "リフォーム", contractAmount: 95, cost: 102, grossMargin: -7.4, scheduledDays: 4, actualDays: 6, status: "完了", startMonth: "2026-02", warning: "redInk" },
  { id: "P-014", name: "井上邸 新築", category: "新築", contractAmount: 2870, cost: 2010, grossMargin: 30.0, scheduledDays: 138, actualDays: 130, status: "完了", startMonth: "2026-02", warning: null },
  { id: "P-015", name: "木村邸 増築", category: "リフォーム", contractAmount: 1280, cost: 940, grossMargin: 26.6, scheduledDays: 60, actualDays: 65, status: "完了", startMonth: "2026-03", warning: null },
  { id: "P-016", name: "斎藤邸 新築", category: "新築", contractAmount: 3240, cost: 2280, grossMargin: 29.6, scheduledDays: 142, actualDays: 88, status: "工事中", startMonth: "2026-04", warning: null },
  { id: "P-017", name: "清水邸 全面改装", category: "リフォーム", contractAmount: 1480, cost: 1310, grossMargin: 11.5, scheduledDays: 55, actualDays: 64, status: "工事中", startMonth: "2026-04", warning: "delay" },
  { id: "P-018", name: "森邸 外構やり直し", category: "外構", contractAmount: 380, cost: 392, grossMargin: -3.2, scheduledDays: 18, actualDays: 25, status: "工事中", startMonth: "2026-05", warning: "redInk" },
  { id: "P-019", name: "藤田邸 新築", category: "新築", contractAmount: 2980, cost: 2080, grossMargin: 30.2, scheduledDays: 138, actualDays: 22, status: "工事中", startMonth: "2026-05", warning: null },
  { id: "P-020", name: "前田邸 浴室改修", category: "リフォーム", contractAmount: 360, cost: 320, grossMargin: 11.1, scheduledDays: 16, actualDays: 18, status: "工事中", startMonth: "2026-05", warning: "marginLow" },
]

const ALERTS: Alert[] = [
  {
    level: "danger",
    title: "5 月のキャッシュ残が前月比 −44.6%",
    body: "売上は維持しているが、 外注先支払い 3 件 (¥620 万) が集中。 6 月入金予定の鈴木邸残金 ¥740 万 までの 18 日間 要注意。",
    source: "キャッシュフロー / 売掛買掛タイミング",
  },
  {
    level: "danger",
    title: "森邸 外構やり直し が赤字進行中 (粗利率 −3.2%)",
    body: "予定工期 18 日に対し実工期 25 日 (+38.9%)。 外注追加発注 2 回。 残工程の追加コストを発注する前に 一度判断会議が必要。",
    source: "工事別利益 / P-018",
  },
  {
    level: "warning",
    title: "清水邸 全面改装 工期遅延 +9 日 (16.4% 超過)",
    body: "粗利率 11.5% で当初想定 (18%) を下回る。 残工程で更に伸びると赤字転落リスク。 大工配置の見直しを推奨。",
    source: "工期 vs 予算 / P-017",
  },
  {
    level: "warning",
    title: "リフォーム 案件の平均粗利率が 12 ヶ月平均 +2.4pt 悪化",
    body: "小規模 (¥100-300 万) 案件で外注比率が上がり粗利を圧迫。 単発受注の値付けを見直すか、 受注基準を再設定すべき。",
    source: "工事別利益 / カテゴリ別集計",
  },
]

// ============================================================
// Helpers
// ============================================================

function formatYenMan(v: number): string {
  if (v >= 10000) return `¥${(v / 10000).toFixed(1)} 億`
  return `¥${v.toFixed(0)} 万`
}

function formatPct(v: number): string {
  return `${v >= 0 ? "" : ""}${v.toFixed(1)}%`
}

function deltaDays(p: Project): number {
  return p.actualDays - p.scheduledDays
}

// ============================================================
// SVG Charts (依存追加禁止のため直書き)
// ============================================================

type LineSeries = { points: number[]; color: string; label: string }

function LineChart({
  series,
  xLabels,
  height = 200,
  yMin,
  yMax,
  yFormat,
  yTicks = 4,
}: {
  series: LineSeries[]
  xLabels: string[]
  height?: number
  yMin?: number
  yMax?: number
  yFormat?: (v: number) => string
  yTicks?: number
}) {
  const width = 720
  const padLeft = 48
  const padRight = 16
  const padTop = 12
  const padBottom = 28
  const innerW = width - padLeft - padRight
  const innerH = height - padTop - padBottom

  const allValues = series.flatMap((s) => s.points)
  const min = yMin ?? Math.min(...allValues)
  const max = yMax ?? Math.max(...allValues)
  const range = max - min || 1

  const n = xLabels.length
  const stepX = innerW / Math.max(1, n - 1)

  function x(i: number) {
    return padLeft + i * stepX
  }
  function y(v: number) {
    return padTop + innerH - ((v - min) / range) * innerH
  }

  const ticks = Array.from({ length: yTicks + 1 }, (_, i) => min + (range * i) / yTicks)
  const fmt = yFormat ?? ((v: number) => v.toFixed(0))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="line chart">
      {/* y grid */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line
            x1={padLeft}
            x2={width - padRight}
            y1={y(t)}
            y2={y(t)}
            stroke="#e5ecf6"
            strokeWidth={1}
            strokeDasharray={i === 0 || i === yTicks ? "0" : "3 3"}
          />
          <text x={padLeft - 6} y={y(t) + 3} textAnchor="end" fontSize={10} fill="#7a8aa6">
            {fmt(t)}
          </text>
        </g>
      ))}

      {/* x labels */}
      {xLabels.map((lab, i) => (
        <text
          key={lab}
          x={x(i)}
          y={height - 8}
          textAnchor="middle"
          fontSize={10}
          fill="#7a8aa6"
        >
          {lab}
        </text>
      ))}

      {/* series */}
      {series.map((s, si) => {
        const d = s.points
          .map((v, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(v)}`)
          .join(" ")
        return (
          <g key={si}>
            <path d={d} fill="none" stroke={s.color} strokeWidth={2.25} strokeLinejoin="round" strokeLinecap="round" />
            {s.points.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={3} fill="#fff" stroke={s.color} strokeWidth={1.75} />
            ))}
          </g>
        )
      })}
    </svg>
  )
}

function BarChart({
  bars,
  height = 220,
  valueFormat,
}: {
  bars: { label: string; value: number; color: string; sub?: string }[]
  height?: number
  valueFormat?: (v: number) => string
}) {
  const width = 720
  const padLeft = 180
  const padRight = 60
  const padTop = 8
  const padBottom = 8
  const innerW = width - padLeft - padRight
  const innerH = height - padTop - padBottom

  const max = Math.max(...bars.map((b) => Math.abs(b.value)), 1)
  const rowH = innerH / bars.length
  const barH = Math.min(28, rowH - 8)
  const fmt = valueFormat ?? ((v: number) => v.toFixed(0))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="bar chart">
      {bars.map((b, i) => {
        const rowY = padTop + i * rowH + (rowH - barH) / 2
        const w = (Math.abs(b.value) / max) * innerW
        const isNeg = b.value < 0
        return (
          <g key={b.label}>
            <text
              x={padLeft - 10}
              y={rowY + barH / 2 + 3.5}
              textAnchor="end"
              fontSize={11}
              fill="#33496d"
              fontWeight={600}
            >
              {b.label}
            </text>
            <rect x={padLeft} y={rowY} width={w} height={barH} rx={4} fill={b.color} opacity={isNeg ? 0.55 : 0.92} />
            <text
              x={padLeft + w + 6}
              y={rowY + barH / 2 + 3.5}
              fontSize={11}
              fill="#071b49"
              fontWeight={700}
            >
              {fmt(b.value)}
              {b.sub ? <tspan fill="#7a8aa6" fontWeight={500}>  {b.sub}</tspan> : null}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ============================================================
// Page
// ============================================================

export default function BusinessMetricsPage() {
  const latest = MONTHLY[MONTHLY.length - 1]
  const prev = MONTHLY[MONTHLY.length - 2]
  const avg12mMargin = MONTHLY.reduce((s, m) => s + m.grossMargin, 0) / MONTHLY.length

  // Top 5 工事別利益 (粗利額 = contract * margin/100、 完了 + 工事中)
  const topProjects = useMemo(() => {
    return [...PROJECTS]
      .map((p) => ({ ...p, profit: Math.round(p.contractAmount * (p.grossMargin / 100)) }))
      .sort((a, b) => b.profit - a.profit)
      .slice(0, 5)
  }, [])

  // 赤字案件
  const redInkProjects = useMemo(() => {
    return PROJECTS.filter((p) => p.grossMargin < 0)
      .map((p) => ({ ...p, profit: Math.round(p.contractAmount * (p.grossMargin / 100)) }))
      .sort((a, b) => a.profit - b.profit)
  }, [])

  const [sortKey, setSortKey] = useState<SortKey>("warning")

  const sortedProjects = useMemo(() => {
    const arr = [...PROJECTS]
    if (sortKey === "grossMargin") {
      arr.sort((a, b) => a.grossMargin - b.grossMargin)
    } else if (sortKey === "deltaDays") {
      arr.sort((a, b) => deltaDays(b) - deltaDays(a))
    } else {
      const order = { redInk: 0, delay: 1, marginLow: 2 } as const
      arr.sort((a, b) => {
        const aw = a.warning ? order[a.warning] : 99
        const bw = b.warning ? order[b.warning] : 99
        if (aw !== bw) return aw - bw
        return a.grossMargin - b.grossMargin
      })
    }
    return arr
  }, [sortKey])

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#0b1733]">
      {/* ============ Header (sticky) ============ */}
      <header className="sticky top-0 z-20 border-b border-[#d8e3f2] bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-3.5">
          <Link href="/#examples" className="inline-flex items-center gap-1.5 text-sm font-bold text-[#33496d] transition hover:text-[#071b49]">
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef6ff] px-3 py-1 text-[11px] font-black text-[#2f6fb6]">
              <Activity className="h-3 w-3" />
              動くデモ: 経営状況可視化レポート
            </span>
            <span className="inline-flex items-center rounded-full bg-[#fff2de] px-3 py-1 text-[11px] font-black text-[#c84e0c]">
              v8.0 #04 候補
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14">
        {/* ============ Hero ============ */}
        <section className="mb-10 max-w-3xl">
          <div className="mb-3 inline-flex items-center rounded-md bg-[#eef6ff] px-2.5 py-1 text-xs font-black tracking-tight text-[#2f6fb6]">
            工務店向け 経営ダッシュボード
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#071b49] sm:text-[40px] sm:leading-[1.1]">
            親方と後継者が、 同じ画面で 数字を見て話せる
          </h1>
          <p className="mt-4 text-base font-bold leading-7 text-[#33496d] sm:text-lg">
            会計ソフト (弥生 / freee 等) と工事台帳を 連携するだけで、 月次粗利率・工事別利益・キャッシュフロー・受注単価 を 自動でグラフ化。
            <span className="text-[#c84e0c]"> 税理士の月次試算表を 待たずに、 来月の打ち手が 今日 決まる。</span>
          </p>
        </section>

        {/* ============ KPI Summary 4 Cards ============ */}
        <section className="mb-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <KpiCard
            icon={<TrendingDown className="h-4 w-4" />}
            label="今月の粗利率"
            value={formatPct(latest.grossMargin)}
            sub={
              <span className="text-[#c84e0c]">
                前月比 {(latest.grossMargin - prev.grossMargin).toFixed(1)} pt
              </span>
            }
            tone="danger"
          />
          <KpiCard
            icon={<Hammer className="h-4 w-4" />}
            label="受注単価 (今月)"
            value={formatYenMan(latest.unitPrice)}
            sub={`12 ヶ月平均 ¥${Math.round(MONTHLY.reduce((s, m) => s + m.unitPrice, 0) / MONTHLY.length)} 万`}
            tone="neutral"
          />
          <KpiCard
            icon={<Wallet className="h-4 w-4" />}
            label="現金残 (月末見込)"
            value={formatYenMan(latest.cashflow)}
            sub={
              <span className="text-[#c84e0c]">
                前月比 {(((latest.cashflow - prev.cashflow) / prev.cashflow) * 100).toFixed(1)}%
              </span>
            }
            tone="danger"
          />
          <KpiCard
            icon={<TrendingUp className="h-4 w-4" />}
            label="工事中件数"
            value={`${PROJECTS.filter((p) => p.status === "工事中").length} 件`}
            sub={`完了 ${PROJECTS.filter((p) => p.status === "完了").length} 件 / 12 ヶ月`}
            tone="neutral"
          />
        </section>

        {/* ============ Alerts ============ */}
        <section className="mb-12">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-black tracking-tight text-[#071b49]">
            <AlertTriangle className="h-5 w-5 text-[#c84e0c]" />
            自動アラート ({ALERTS.length} 件)
            <span className="ml-2 text-xs font-bold text-[#7a8aa6]">毎朝 6 時に再集計</span>
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {ALERTS.map((a, i) => (
              <AlertCard key={i} alert={a} />
            ))}
          </div>
        </section>

        {/* ============ 4 Charts (Top Dashboard) ============ */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-black tracking-tight text-[#071b49]">
            トップダッシュボード <span className="text-xs font-bold text-[#7a8aa6]">過去 12 ヶ月</span>
          </h2>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* 月次粗利率推移 */}
            <ChartCard
              title="月次 粗利率 推移"
              subtitle="目標ライン 25% / 12 ヶ月平均 22.4%"
              accent="#2f6fb6"
              footer={
                <span>
                  最新 <strong className="text-[#c84e0c]">{formatPct(latest.grossMargin)}</strong> · 目標まで{" "}
                  <strong>{(25 - latest.grossMargin).toFixed(1)} pt</strong>
                </span>
              }
            >
              <LineChart
                series={[
                  { points: MONTHLY.map((m) => m.grossMargin), color: "#2f6fb6", label: "粗利率" },
                  { points: MONTHLY.map(() => 25), color: "#d6e2f0", label: "目標 25%" },
                ]}
                xLabels={MONTHLY.map((m) => m.label)}
                yMin={10}
                yMax={32}
                yFormat={(v) => `${v.toFixed(0)}%`}
              />
            </ChartCard>

            {/* 工事別利益 Top 5 */}
            <ChartCard
              title="工事別 粗利額 Top 5"
              subtitle="完了 + 工事中 から 粗利額 (¥万) 降順"
              accent="#f47b20"
              footer={
                <span>
                  Top 5 の粗利合計{" "}
                  <strong className="text-[#071b49]">
                    {formatYenMan(topProjects.reduce((s, p) => s + p.profit, 0))}
                  </strong>
                </span>
              }
            >
              <BarChart
                bars={topProjects.map((p) => ({
                  label: p.name,
                  value: p.profit,
                  color: "#f47b20",
                  sub: `${p.grossMargin.toFixed(1)}%`,
                }))}
                valueFormat={(v) => `¥${v} 万`}
              />
            </ChartCard>

            {/* キャッシュフロー */}
            <ChartCard
              title="キャッシュ残 推移"
              subtitle="月末時点の現金 + 預金 (¥万)"
              accent="#0ea271"
              footer={
                <span>
                  最低警戒ライン <strong>¥1,000 万</strong> · 直近{" "}
                  <strong className="text-[#c84e0c]">{formatYenMan(latest.cashflow)}</strong>
                </span>
              }
            >
              <LineChart
                series={[
                  { points: MONTHLY.map((m) => m.cashflow), color: "#0ea271", label: "現金残" },
                  { points: MONTHLY.map(() => 1000), color: "#fcd9c4", label: "警戒ライン" },
                ]}
                xLabels={MONTHLY.map((m) => m.label)}
                yMin={800}
                yMax={2000}
                yFormat={(v) => `¥${(v / 100).toFixed(0)}百万`}
              />
            </ChartCard>

            {/* 受注単価推移 */}
            <ChartCard
              title="受注単価 推移"
              subtitle="月内に受注した工事の 1 件あたり平均金額 (¥万)"
              accent="#7a47c2"
              footer={
                <span>
                  最新 <strong className="text-[#071b49]">{formatYenMan(latest.unitPrice)}</strong> · 12 ヶ月平均{" "}
                  <strong>
                    {formatYenMan(MONTHLY.reduce((s, m) => s + m.unitPrice, 0) / MONTHLY.length)}
                  </strong>
                </span>
              }
            >
              <LineChart
                series={[
                  { points: MONTHLY.map((m) => m.unitPrice), color: "#7a47c2", label: "受注単価" },
                ]}
                xLabels={MONTHLY.map((m) => m.label)}
                yMin={240}
                yMax={360}
                yFormat={(v) => `¥${v.toFixed(0)}万`}
              />
            </ChartCard>
          </div>

          <p className="mt-3 text-xs font-bold text-[#7a8aa6]">
            ※ 12 ヶ月平均 粗利率 {avg12mMargin.toFixed(1)}% / 業界中央値 ベンチマーク (中小企業実態基本調査ベース) は連携後に自動算出。
          </p>
        </section>

        {/* ============ 工事別詳細テーブル ============ */}
        <section className="mb-12">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-black tracking-tight text-[#071b49]">
                工事別 詳細 <span className="text-xs font-bold text-[#7a8aa6]">{PROJECTS.length} 件 / 過去 12 ヶ月</span>
              </h2>
              <p className="mt-1 text-xs font-bold text-[#7a8aa6]">
                粗利率 / 工期 vs 予算 / 赤字案件警告 でソート
              </p>
            </div>
            <div className="inline-flex rounded-xl border border-[#d8e3f2] bg-white p-1 text-xs font-black">
              {(
                [
                  { k: "warning", label: "警告順" },
                  { k: "grossMargin", label: "粗利率 低い順" },
                  { k: "deltaDays", label: "遅延 大きい順" },
                ] as { k: SortKey; label: string }[]
              ).map(({ k, label }) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setSortKey(k)}
                  className={`rounded-lg px-3 py-1.5 transition ${
                    sortKey === k ? "bg-[#071b49] text-white" : "text-[#33496d] hover:bg-[#eef6ff]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#d8e3f2] bg-white shadow-[0_8px_24px_rgba(7,27,73,0.05)]">
            <table className="min-w-full divide-y divide-[#e5ecf6] text-sm">
              <thead className="bg-[#f7faff]">
                <tr className="text-left text-[11px] font-black uppercase tracking-widest text-[#5a6680]">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">工事名 / 区分</th>
                  <th className="px-4 py-3 text-right">契約金額</th>
                  <th className="px-4 py-3 text-right">粗利率</th>
                  <th className="px-4 py-3 text-right">工期 (予定 → 実績)</th>
                  <th className="px-4 py-3">状態 / 警告</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f9] font-medium text-[#0b1733]">
                {sortedProjects.map((p) => {
                  const dd = deltaDays(p)
                  return (
                    <tr key={p.id} className={p.warning === "redInk" ? "bg-[#fff5ee]" : "hover:bg-[#f7faff]"}>
                      <td className="px-4 py-3 font-mono text-xs text-[#5a6680]">{p.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-black text-[#071b49]">{p.name}</div>
                        <div className="text-[11px] font-bold text-[#7a8aa6]">
                          {p.category} · 着工 {p.startMonth.replace("-", "/")}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold tabular-nums">
                        {formatYenMan(p.contractAmount)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums">
                        <span
                          className={`font-black ${
                            p.grossMargin < 0
                              ? "text-[#c84e0c]"
                              : p.grossMargin < 15
                              ? "text-[#a37418]"
                              : "text-[#0ea271]"
                          }`}
                        >
                          {formatPct(p.grossMargin)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums text-[#33496d]">
                        <span>{p.scheduledDays}日</span>
                        <span className="mx-1 text-[#a5b3cc]">→</span>
                        <span className={dd > 0 ? "font-black text-[#c84e0c]" : "font-bold text-[#0b1733]"}>
                          {p.actualDays}日
                        </span>
                        {dd !== 0 && (
                          <span className={`ml-1 text-[11px] font-black ${dd > 0 ? "text-[#c84e0c]" : "text-[#0ea271]"}`}>
                            ({dd > 0 ? "+" : ""}
                            {dd}日)
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={p.status} warning={p.warning ?? null} />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {redInkProjects.length > 0 && (
            <div className="mt-4 rounded-2xl border border-[#fbc89a] bg-[#fff5ee] p-4 text-sm font-bold text-[#33496d]">
              <span className="font-black text-[#c84e0c]">赤字案件 {redInkProjects.length} 件</span>{" "}
              合計損失{" "}
              <span className="font-black text-[#c84e0c]">
                {formatYenMan(Math.abs(redInkProjects.reduce((s, p) => s + p.profit, 0)))}
              </span>
              。 個別の損失要因 (見積もり甘さ / 外注超過 / 工期超過) を 工事台帳と紐づけて 自動分類できる。
            </div>
          )}
        </section>

        {/* ============ Bottom CTA ============ */}
        <section className="rounded-3xl border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.06)] sm:p-8">
          <div className="grid items-center gap-6 md:grid-cols-[1.2fr_1fr]">
            <div>
              <div className="mb-3 inline-flex items-center rounded-full bg-[#eef6ff] px-3 py-1 text-[11px] font-black text-[#2f6fb6]">
                v8.0 商品候補 #04 動くデモ
              </div>
              <h2 className="text-2xl font-black tracking-tight text-[#071b49] sm:text-3xl">
                「うちの数字でも 同じ画面が 作れるか」 が 一番早い答えです
              </h2>
              <p className="mt-3 text-sm font-bold leading-7 text-[#33496d]">
                30 分の Zoom で、 弥生 / freee / マネーフォワード / 自前 Excel どれと繋ぐかを確認し、 1 ヶ月分 サンプルで 上のような画面を 一緒に作ります。
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href="/#contact"
                  className="inline-flex h-11 items-center gap-1.5 rounded-xl bg-[#f47b20] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#e36d15]"
                >
                  30 分の 接続確認を 相談する
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/"
                  className="inline-flex h-11 items-center rounded-xl border border-[#d8e3f2] bg-white px-5 text-sm font-black text-[#071b49] transition hover:bg-[#f7faff]"
                >
                  トップへ戻る
                </Link>
              </div>
            </div>
            <div className="rounded-2xl border border-[#dde6f3] bg-[#f7faff] p-5">
              <div className="mb-3 text-xs font-black uppercase tracking-widest text-[#5a6680]">
                想定 ROI (¥万 / 月)
              </div>
              <dl className="space-y-2 text-sm font-bold text-[#33496d]">
                <div className="flex justify-between border-b border-dashed border-[#dde6f3] pb-2">
                  <dt>赤字案件の早期発見 (月 1 件想定)</dt>
                  <dd className="font-black text-[#0ea271]">+¥15-40 万</dd>
                </div>
                <div className="flex justify-between border-b border-dashed border-[#dde6f3] pb-2">
                  <dt>受注単価の見直し (粗利 +2pt)</dt>
                  <dd className="font-black text-[#0ea271]">+¥30-60 万</dd>
                </div>
                <div className="flex justify-between border-b border-dashed border-[#dde6f3] pb-2">
                  <dt>税理士月次レポート 待ち時間</dt>
                  <dd className="font-black text-[#0ea271]">−2〜3 週間</dd>
                </div>
                <div className="flex justify-between pt-1">
                  <dt>SaaS 月額 (見込)</dt>
                  <dd className="font-black text-[#071b49]">¥2-5 万</dd>
                </div>
              </dl>
              <p className="mt-3 text-[11px] font-bold leading-5 text-[#7a8aa6]">
                ※ 上の数字は想定例。 実効果は会計データの粒度と運用に依存。
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

// ============================================================
// Subcomponents
// ============================================================

function KpiCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: React.ReactNode
  tone: "neutral" | "danger" | "good"
}) {
  const accent =
    tone === "danger"
      ? "bg-[#fff5ee] text-[#c84e0c]"
      : tone === "good"
      ? "bg-[#e7f7ef] text-[#0ea271]"
      : "bg-[#eef6ff] text-[#2f6fb6]"
  return (
    <div className="rounded-2xl border border-[#d8e3f2] bg-white p-4 shadow-[0_8px_24px_rgba(7,27,73,0.05)] sm:p-5">
      <div className="flex items-center gap-2">
        <span className={`grid h-7 w-7 place-items-center rounded-lg ${accent}`}>{icon}</span>
        <span className="text-[11px] font-black uppercase tracking-widest text-[#5a6680]">
          {label}
        </span>
      </div>
      <div className="mt-3 text-3xl font-black tabular-nums tracking-tight text-[#071b49] sm:text-[34px]">
        {value}
      </div>
      <div className="mt-1 text-xs font-bold text-[#33496d]">{sub}</div>
    </div>
  )
}

function AlertCard({ alert }: { alert: Alert }) {
  const styles = {
    danger: {
      ring: "border-[#f3b894] bg-[#fff5ee]",
      tag: "bg-[#c84e0c] text-white",
      tagLabel: "危険",
      icon: "text-[#c84e0c]",
    },
    warning: {
      ring: "border-[#f1dfc4] bg-[#fff8ec]",
      tag: "bg-[#a37418] text-white",
      tagLabel: "注意",
      icon: "text-[#a37418]",
    },
    info: {
      ring: "border-[#d6e2f0] bg-[#f7faff]",
      tag: "bg-[#2f6fb6] text-white",
      tagLabel: "情報",
      icon: "text-[#2f6fb6]",
    },
  }[alert.level]
  return (
    <div className={`rounded-2xl border p-5 ${styles.ring}`}>
      <div className="mb-2 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black ${styles.tag}`}>
          <AlertTriangle className={`h-3 w-3 ${alert.level === "danger" ? "" : ""}`} />
          {styles.tagLabel}
        </span>
        <span className="text-[11px] font-bold text-[#7a8aa6]">{alert.source}</span>
      </div>
      <h3 className="text-sm font-black leading-6 text-[#071b49]">{alert.title}</h3>
      <p className="mt-1 text-xs font-bold leading-6 text-[#33496d]">{alert.body}</p>
    </div>
  )
}

function ChartCard({
  title,
  subtitle,
  children,
  footer,
  accent,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  footer?: React.ReactNode
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-[#d8e3f2] bg-white p-5 shadow-[0_8px_24px_rgba(7,27,73,0.05)]">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h3 className="text-base font-black tracking-tight text-[#071b49]">
            <span className="mr-2 inline-block h-2 w-2 rounded-full align-middle" style={{ background: accent }} />
            {title}
          </h3>
          {subtitle && <p className="mt-1 text-[11px] font-bold text-[#7a8aa6]">{subtitle}</p>}
        </div>
      </div>
      <div className="-mx-1">{children}</div>
      {footer && (
        <div className="mt-3 border-t border-dashed border-[#e5ecf6] pt-3 text-xs font-bold text-[#33496d]">
          {footer}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status, warning }: { status: Project["status"]; warning: Project["warning"] | null }) {
  const statusStyle =
    status === "工事中"
      ? "bg-[#eef6ff] text-[#2f6fb6]"
      : status === "完了"
      ? "bg-[#e7f7ef] text-[#0ea271]"
      : "bg-[#f1f3f8] text-[#5a6680]"
  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-black ${statusStyle}`}>
        {status}
      </span>
      {warning === "redInk" && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#c84e0c] px-2 py-0.5 text-[10px] font-black text-white">
          <AlertTriangle className="h-3 w-3" />
          赤字
        </span>
      )}
      {warning === "delay" && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#a37418] px-2 py-0.5 text-[10px] font-black text-white">
          工期遅延
        </span>
      )}
      {warning === "marginLow" && (
        <span className="inline-flex w-fit items-center gap-1 rounded-full bg-[#fff2de] px-2 py-0.5 text-[10px] font-black text-[#a37418]">
          粗利低
        </span>
      )}
    </div>
  )
}
