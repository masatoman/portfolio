"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Mail,
  MessageSquare,
  Search,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react"

// =====================================================================
// /local-business/lead-cultivation
//
// 動くデモ: 展示会リード育成 SaaS (v8.0 #03 候補)
// 12/2-4 JAPAN BUILD TOKYO 出展予定。 本ページ自体を展示会で実演する想定。
//
// 機能:
//   1. 名刺撮影 → AI 補完シミュレーション (固定 4 枚 → 1.5 秒アニメ)
//   2. リードダッシュボード (40 件 demo data、 スコア / 次回フォロー / 状態)
//   3. フォロー配信スケジュール (個別リードの 6 ヶ月配信プラン + 後ろ倒し)
//
// データはハードコード。 既存ファイル編集なし。 ページ完結 (DemoPageShell 不使用、
// 展示会の活気を出すため独自ヘッダ + 橙系アクセント)。
// =====================================================================

// ---------- types ----------
type LeadStatus = "新規" | "フォロー中" | "商談移行" | "失注"

type Lead = {
  id: string
  name: string
  company: string
  role: string
  interest: string
  industry: string
  score: number
  status: LeadStatus
  nextFollow: string
  acquiredAt: string
}

type BusinessCard = {
  id: string
  label: string
  visual: { name: string; company: string; role: string; tagline: string; accent: string }
  filled: { name: string; company: string; role: string; interest: string; industry: string }
}

type FollowStep = {
  timing: string
  channel: "LINE" | "メール" | "電話"
  subject: string
  body: string
}

// ---------- demo data ----------
const businessCards: BusinessCard[] = [
  {
    id: "card-01",
    label: "佐藤工務店 (神奈川)",
    visual: {
      name: "佐藤 健太郎",
      company: "佐藤工務店",
      role: "代表取締役",
      tagline: "注文住宅・リノベーション",
      accent: "from-amber-100 to-orange-100",
    },
    filled: {
      name: "佐藤 健太郎",
      company: "佐藤工務店 (株)",
      role: "代表取締役 / 2 代目",
      interest: "現場写真整理 + 施主向け進捗ページ",
      industry: "工務店 (年商 3-5 億 / 神奈川)",
    },
  },
  {
    id: "card-02",
    label: "田村建設 (東京・多摩)",
    visual: {
      name: "田村 美咲",
      company: "田村建設",
      role: "専務取締役",
      tagline: "新築戸建 + 増改築",
      accent: "from-orange-100 to-red-100",
    },
    filled: {
      name: "田村 美咲",
      company: "田村建設 (有)",
      role: "専務取締役 / 3 代目アトツギ",
      interest: "見積もり PDF 管理 + 電話メモ整理",
      industry: "工務店 (年商 1-3 億 / 東京多摩)",
    },
  },
  {
    id: "card-03",
    label: "山下リフォーム (埼玉)",
    visual: {
      name: "山下 浩二",
      company: "山下リフォーム",
      role: "営業部長",
      tagline: "外壁・水回りリフォーム",
      accent: "from-yellow-100 to-amber-100",
    },
    filled: {
      name: "山下 浩二",
      company: "山下リフォーム (株)",
      role: "営業部長",
      interest: "領収書 OCR + 経理代行",
      industry: "リフォーム (年商 5-10 億 / 埼玉)",
    },
  },
  {
    id: "card-04",
    label: "藤原建築設計 (千葉)",
    visual: {
      name: "藤原 直樹",
      company: "藤原建築設計",
      role: "代表",
      tagline: "設計事務所 + 工務店連携",
      accent: "from-orange-50 to-amber-100",
    },
    filled: {
      name: "藤原 直樹",
      company: "藤原建築設計事務所",
      role: "代表 / 一級建築士",
      interest: "図面ビューア + クライアント連絡",
      industry: "設計事務所 (年商 1 億未満 / 千葉)",
    },
  },
]

const demoLeads: Lead[] = [
  { id: "L-001", name: "佐藤 健太郎", company: "佐藤工務店", role: "代表取締役", interest: "現場写真整理", industry: "工務店", score: 92, status: "商談移行", nextFollow: "2026-05-26", acquiredAt: "2026-05-22" },
  { id: "L-002", name: "田村 美咲", company: "田村建設", role: "専務", interest: "見積もり PDF 管理", industry: "工務店", score: 88, status: "フォロー中", nextFollow: "2026-05-29", acquiredAt: "2026-05-22" },
  { id: "L-003", name: "山下 浩二", company: "山下リフォーム", role: "営業部長", interest: "経理代行", industry: "リフォーム", score: 74, status: "フォロー中", nextFollow: "2026-06-05", acquiredAt: "2026-05-22" },
  { id: "L-004", name: "藤原 直樹", company: "藤原建築設計", role: "代表", interest: "図面ビューア", industry: "設計事務所", score: 81, status: "フォロー中", nextFollow: "2026-06-02", acquiredAt: "2026-05-21" },
  { id: "L-005", name: "中川 真治", company: "中川組", role: "現場監督", interest: "電話メモ整理", industry: "工務店", score: 65, status: "フォロー中", nextFollow: "2026-06-12", acquiredAt: "2026-05-21" },
  { id: "L-006", name: "西村 純子", company: "西村工務店", role: "経理", interest: "領収書 OCR", industry: "工務店", score: 58, status: "フォロー中", nextFollow: "2026-06-15", acquiredAt: "2026-05-21" },
  { id: "L-007", name: "岡田 隆", company: "岡田リノベ", role: "代表", interest: "施主進捗ページ", industry: "リフォーム", score: 79, status: "フォロー中", nextFollow: "2026-05-30", acquiredAt: "2026-05-20" },
  { id: "L-008", name: "高橋 一郎", company: "高橋ホーム", role: "代表", interest: "現場写真整理", industry: "工務店", score: 70, status: "フォロー中", nextFollow: "2026-06-08", acquiredAt: "2026-05-20" },
  { id: "L-009", name: "村田 英樹", company: "村田設計事務所", role: "建築士", interest: "図面ビューア", industry: "設計事務所", score: 62, status: "フォロー中", nextFollow: "2026-06-18", acquiredAt: "2026-05-20" },
  { id: "L-010", name: "石川 美穂", company: "石川工務店", role: "経理 / 妻", interest: "経理代行", industry: "工務店", score: 55, status: "フォロー中", nextFollow: "2026-06-22", acquiredAt: "2026-05-19" },
  { id: "L-011", name: "藤井 智也", company: "藤井ハウス", role: "営業", interest: "見積もり PDF 管理", industry: "工務店", score: 48, status: "新規", nextFollow: "2026-05-27", acquiredAt: "2026-05-19" },
  { id: "L-012", name: "近藤 真一", company: "近藤建設", role: "代表", interest: "電話メモ整理", industry: "工務店", score: 71, status: "フォロー中", nextFollow: "2026-06-10", acquiredAt: "2026-05-18" },
  { id: "L-013", name: "渡辺 慎", company: "渡辺ハウジング", role: "営業部長", interest: "施主進捗ページ", industry: "工務店", score: 67, status: "フォロー中", nextFollow: "2026-06-14", acquiredAt: "2026-05-18" },
  { id: "L-014", name: "宮本 雄大", company: "宮本リフォーム", role: "代表", interest: "領収書 OCR", industry: "リフォーム", score: 53, status: "フォロー中", nextFollow: "2026-06-20", acquiredAt: "2026-05-17" },
  { id: "L-015", name: "井上 真理", company: "井上工務店", role: "事務", interest: "経理代行", industry: "工務店", score: 44, status: "新規", nextFollow: "2026-05-28", acquiredAt: "2026-05-17" },
  { id: "L-016", name: "森田 雅", company: "森田建築", role: "代表", interest: "現場写真整理", industry: "工務店", score: 83, status: "商談移行", nextFollow: "2026-05-31", acquiredAt: "2026-05-16" },
  { id: "L-017", name: "竹内 浩", company: "竹内リノベ", role: "代表", interest: "見積もり PDF 管理", industry: "リフォーム", score: 61, status: "フォロー中", nextFollow: "2026-06-09", acquiredAt: "2026-05-16" },
  { id: "L-018", name: "原 弘之", company: "原工務店", role: "現場監督", interest: "電話メモ整理", industry: "工務店", score: 39, status: "失注", nextFollow: "-", acquiredAt: "2026-05-15" },
  { id: "L-019", name: "金子 弘樹", company: "金子建設", role: "代表", interest: "施主進捗ページ", industry: "工務店", score: 68, status: "フォロー中", nextFollow: "2026-06-11", acquiredAt: "2026-05-15" },
  { id: "L-020", name: "斎藤 武", company: "斎藤工務店", role: "代表", interest: "図面ビューア", industry: "工務店", score: 50, status: "フォロー中", nextFollow: "2026-06-25", acquiredAt: "2026-05-14" },
  { id: "L-021", name: "横山 春香", company: "横山ホームズ", role: "経理", interest: "領収書 OCR", industry: "工務店", score: 46, status: "フォロー中", nextFollow: "2026-06-28", acquiredAt: "2026-05-14" },
  { id: "L-022", name: "三浦 健", company: "三浦リフォーム", role: "代表", interest: "見積もり PDF 管理", industry: "リフォーム", score: 76, status: "フォロー中", nextFollow: "2026-05-30", acquiredAt: "2026-05-13" },
  { id: "L-023", name: "野口 真", company: "野口建設", role: "代表", interest: "経理代行", industry: "工務店", score: 33, status: "失注", nextFollow: "-", acquiredAt: "2026-05-13" },
  { id: "L-024", name: "上田 隼", company: "上田ハウス", role: "営業", interest: "現場写真整理", industry: "工務店", score: 64, status: "フォロー中", nextFollow: "2026-06-13", acquiredAt: "2026-05-12" },
  { id: "L-025", name: "前田 紗良", company: "前田設計", role: "建築士", interest: "図面ビューア", industry: "設計事務所", score: 72, status: "フォロー中", nextFollow: "2026-06-06", acquiredAt: "2026-05-12" },
  { id: "L-026", name: "小川 達也", company: "小川工務店", role: "代表", interest: "電話メモ整理", industry: "工務店", score: 41, status: "新規", nextFollow: "2026-05-31", acquiredAt: "2026-05-11" },
  { id: "L-027", name: "今井 真澄", company: "今井リフォーム", role: "代表", interest: "施主進捗ページ", industry: "リフォーム", score: 57, status: "フォロー中", nextFollow: "2026-06-19", acquiredAt: "2026-05-11" },
  { id: "L-028", name: "大野 健司", company: "大野建設", role: "代表", interest: "経理代行", industry: "工務店", score: 28, status: "失注", nextFollow: "-", acquiredAt: "2026-05-10" },
  { id: "L-029", name: "松井 英子", company: "松井工務店", role: "経理", interest: "領収書 OCR", industry: "工務店", score: 59, status: "フォロー中", nextFollow: "2026-06-17", acquiredAt: "2026-05-10" },
  { id: "L-030", name: "桜井 翔", company: "桜井ホーム", role: "営業", interest: "見積もり PDF 管理", industry: "工務店", score: 86, status: "商談移行", nextFollow: "2026-05-29", acquiredAt: "2026-05-09" },
  { id: "L-031", name: "東 良介", company: "東建築", role: "代表", interest: "現場写真整理", industry: "工務店", score: 51, status: "フォロー中", nextFollow: "2026-06-21", acquiredAt: "2026-05-09" },
  { id: "L-032", name: "宇野 美和", company: "宇野設計", role: "代表", interest: "図面ビューア", industry: "設計事務所", score: 69, status: "フォロー中", nextFollow: "2026-06-07", acquiredAt: "2026-05-08" },
  { id: "L-033", name: "黒田 義孝", company: "黒田工務店", role: "代表", interest: "電話メモ整理", industry: "工務店", score: 36, status: "失注", nextFollow: "-", acquiredAt: "2026-05-08" },
  { id: "L-034", name: "白井 涼", company: "白井リフォーム", role: "現場監督", interest: "施主進捗ページ", industry: "リフォーム", score: 60, status: "フォロー中", nextFollow: "2026-06-16", acquiredAt: "2026-05-07" },
  { id: "L-035", name: "南 透", company: "南工務店", role: "代表", interest: "経理代行", industry: "工務店", score: 49, status: "新規", nextFollow: "2026-06-02", acquiredAt: "2026-05-07" },
  { id: "L-036", name: "村上 直樹", company: "村上建設", role: "代表", interest: "領収書 OCR", industry: "工務店", score: 54, status: "フォロー中", nextFollow: "2026-06-24", acquiredAt: "2026-05-06" },
  { id: "L-037", name: "城田 莉子", company: "城田ハウス", role: "営業", interest: "見積もり PDF 管理", industry: "工務店", score: 73, status: "フォロー中", nextFollow: "2026-06-04", acquiredAt: "2026-05-06" },
  { id: "L-038", name: "和田 健", company: "和田工務店", role: "現場監督", interest: "現場写真整理", industry: "工務店", score: 42, status: "新規", nextFollow: "2026-06-01", acquiredAt: "2026-05-05" },
  { id: "L-039", name: "新井 春樹", company: "新井設計", role: "建築士", interest: "図面ビューア", industry: "設計事務所", score: 66, status: "フォロー中", nextFollow: "2026-06-10", acquiredAt: "2026-05-05" },
  { id: "L-040", name: "豊田 麻里", company: "豊田リフォーム", role: "代表", interest: "電話メモ整理", industry: "リフォーム", score: 31, status: "失注", nextFollow: "-", acquiredAt: "2026-05-04" },
]

// ---------- helpers ----------
function followPlan(lead: Lead, offsetWeeks: number): FollowStep[] {
  // 配信日は acquiredAt + offset。 offsetWeeks 分後ろ倒し可。
  const base = new Date(lead.acquiredAt + "T00:00:00")
  function dateAfter(days: number) {
    const d = new Date(base)
    d.setDate(d.getDate() + days + offsetWeeks * 7)
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  }
  return [
    {
      timing: `翌週 (${dateAfter(7)})`,
      channel: "LINE",
      subject: "ご来場ありがとうございました",
      body: `${lead.name} 様、 先日は展示会ブースへお越しいただきありがとうございました。 ご興味いただいた「${lead.interest}」 のデモ動画 3 分版をお送りします。`,
    },
    {
      timing: `1 ヶ月後 (${dateAfter(30)})`,
      channel: "メール",
      subject: `${lead.interest} 導入事例 3 件まとめ`,
      body: `${lead.industry} の同規模他社様での導入事例 (年商帯・地域近似) 3 件を PDF にまとめました。 ${lead.role} のご立場で気になる ROI 観点でハイライト済みです。`,
    },
    {
      timing: `3 ヶ月後 (${dateAfter(90)})`,
      channel: "LINE",
      subject: "資料請求 / オンラインデモのご案内",
      body: `そろそろ来期予算の検討時期かと存じます。 ${lead.company} 様向けにカスタマイズした資料・オンラインデモ (30 分) をご希望でしたらお気軽にお声がけください。`,
    },
    {
      timing: `6 ヶ月後 (${dateAfter(180)})`,
      channel: "メール",
      subject: "JAPAN BUILD 2026 ご招待 + 個別商談枠",
      body: `${lead.name} 様、 半年経ちましたが進捗いかがでしょうか。 12 月の JAPAN BUILD TOKYO で個別商談枠を確保しております。 ${lead.interest} の最新機能をご覧いただけます。`,
    },
  ]
}

function scoreColor(score: number) {
  if (score >= 80) return "bg-orange-500 text-white"
  if (score >= 60) return "bg-amber-200 text-amber-900"
  if (score >= 40) return "bg-yellow-100 text-yellow-800"
  return "bg-gray-200 text-gray-600"
}

function statusColor(status: LeadStatus) {
  switch (status) {
    case "新規":
      return "bg-orange-100 text-orange-800 border-orange-300"
    case "フォロー中":
      return "bg-amber-50 text-amber-900 border-amber-200"
    case "商談移行":
      return "bg-orange-600 text-white border-orange-700"
    case "失注":
      return "bg-gray-100 text-gray-500 border-gray-200"
  }
}

// =====================================================================
// Page
// =====================================================================
export default function LeadCultivationDemoPage() {
  // --- 名刺撮影 → AI 補完 シミュレーション state ---
  const [selectedCardId, setSelectedCardId] = useState<string>(businessCards[0].id)
  const [scanState, setScanState] = useState<"idle" | "scanning" | "filled">("idle")
  const selectedCard = businessCards.find((c) => c.id === selectedCardId)!

  function startScan(cardId: string) {
    setSelectedCardId(cardId)
    setScanState("scanning")
    setTimeout(() => setScanState("filled"), 1500)
  }

  function resetScan() {
    setScanState("idle")
  }

  // --- リードダッシュボード state ---
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "全て">("全て")
  const [search, setSearch] = useState("")

  const filteredLeads = useMemo(() => {
    return demoLeads
      .filter((lead) => (statusFilter === "全て" ? true : lead.status === statusFilter))
      .filter((lead) =>
        search === ""
          ? true
          : `${lead.name}${lead.company}${lead.interest}${lead.industry}`.includes(search),
      )
      .sort((a, b) => b.score - a.score)
  }, [statusFilter, search])

  const dashboardStats = useMemo(() => {
    const total = demoLeads.length
    const followingUp = demoLeads.filter((l) => l.status === "フォロー中").length
    const moveToDeal = demoLeads.filter((l) => l.status === "商談移行").length
    const avgScore = Math.round(demoLeads.reduce((s, l) => s + l.score, 0) / total)
    return { total, followingUp, moveToDeal, avgScore }
  }, [])

  // --- フォロー配信スケジュール state ---
  const [selectedLeadId, setSelectedLeadId] = useState<string>(demoLeads[0].id)
  const [postponeWeeks, setPostponeWeeks] = useState(0)
  const selectedLead = demoLeads.find((l) => l.id === selectedLeadId)!
  const plan = followPlan(selectedLead, postponeWeeks)

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/60 via-white to-amber-50/40 text-gray-900">
      {/* ===== Header ===== */}
      <header className="sticky top-0 z-20 border-b border-orange-200/70 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/#examples"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-500 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
              動くデモ: 展示会リード育成 SaaS
            </span>
            <span className="rounded-full border border-amber-400 bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800">
              v8.0 #03 候補
            </span>
            <span className="hidden rounded-full border border-orange-300 bg-white px-2.5 py-1 text-[10px] font-bold text-orange-700 sm:inline-flex">
              12/2-4 JAPAN BUILD TOKYO 出展予定
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* ===== Hero ===== */}
        <section className="mb-14 max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-orange-100 px-2.5 py-1 text-xs font-bold text-orange-800">
            <Sparkles className="h-3.5 w-3.5" />
            展示会フォロー率 30% → 60%+ へ
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            展示会の名刺を、 商談まで自動で育てる
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-700">
            撮影 → AI 補完 → 個別最適なフォロー LINE / メールを 6 ヶ月かけて自動配信。
            「3 ヶ月後の資料請求」「半年後の商談 OK」 のタイミングをスコア化して通知します。
          </p>
          <p className="mt-2 text-sm text-orange-700">
            ※ 本ページ自体を 12/2-4 JAPAN BUILD TOKYO で実演する想定の「動くデモ」 です。
          </p>
        </section>

        {/* ===== 1. 名刺撮影 → AI 補完 ===== */}
        <section className="mb-16">
          <div className="mb-5 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 text-white">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">① 名刺撮影 → AI 補完</h2>
              <p className="text-sm text-gray-600">
                展示会ブースで撮影 → 1-2 秒で会社情報・興味分野が自動入力。
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
            {/* 左: 名刺選択 + プレビュー */}
            <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">
                サンプル名刺を 1 枚タップ
              </p>
              <div className="grid grid-cols-2 gap-3">
                {businessCards.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => startScan(card.id)}
                    className={`group rounded-xl border-2 p-3 text-left transition ${
                      selectedCardId === card.id
                        ? "border-orange-500 ring-2 ring-orange-200"
                        : "border-orange-100 hover:border-orange-300"
                    }`}
                  >
                    <div
                      className={`rounded-lg bg-gradient-to-br ${card.visual.accent} p-3 text-[10px] leading-tight`}
                    >
                      <p className="font-bold text-gray-800">{card.visual.company}</p>
                      <p className="text-gray-600">{card.visual.tagline}</p>
                      <p className="mt-2 text-sm font-bold text-gray-900">{card.visual.name}</p>
                      <p className="text-[9px] text-gray-600">{card.visual.role}</p>
                    </div>
                    <p className="mt-2 text-xs font-medium text-gray-700">{card.label}</p>
                  </button>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => startScan(selectedCardId)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  <Camera className="h-4 w-4" />
                  撮影 / AI 補完を実行
                </button>
                <button
                  type="button"
                  onClick={resetScan}
                  className="inline-flex items-center rounded-lg border border-orange-200 bg-white px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-50"
                >
                  リセット
                </button>
              </div>
            </div>

            {/* 右: 補完結果フォーム */}
            <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-bold text-gray-900">AI 補完結果</p>
                {scanState === "scanning" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
                    AI 解析中...
                  </span>
                )}
                {scanState === "filled" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    補完完了
                  </span>
                )}
                {scanState === "idle" && (
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
                    待機中
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {[
                  { label: "氏名", key: "name" as const },
                  { label: "会社名", key: "company" as const },
                  { label: "役職", key: "role" as const },
                  { label: "興味分野 (AI 推定)", key: "interest" as const },
                  { label: "業界・属性 (AI 推定)", key: "industry" as const },
                ].map(({ label, key }) => {
                  const value = scanState === "filled" ? selectedCard.filled[key] : ""
                  const isAi = key === "interest" || key === "industry"
                  return (
                    <div key={key}>
                      <label className="mb-1 block text-xs font-bold text-gray-600">
                        {label}
                        {isAi && scanState === "filled" && (
                          <span className="ml-1 inline-flex items-center gap-0.5 rounded bg-orange-100 px-1.5 py-0.5 text-[9px] font-bold text-orange-700">
                            <Sparkles className="h-2.5 w-2.5" />
                            AI
                          </span>
                        )}
                      </label>
                      <div
                        className={`min-h-[2.5rem] rounded-lg border px-3 py-2 text-sm transition ${
                          scanState === "scanning"
                            ? "border-orange-200 bg-orange-50/50 text-transparent"
                            : "border-gray-200 bg-white text-gray-900"
                        }`}
                      >
                        {scanState === "scanning" ? (
                          <span className="inline-block h-4 w-1/2 animate-pulse rounded bg-orange-200" />
                        ) : scanState === "filled" ? (
                          <span className="animate-in fade-in duration-500">{value}</span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              {scanState === "filled" && (
                <div className="mt-4 rounded-lg bg-orange-50 p-3 text-xs text-orange-900">
                  <p className="font-bold">→ このリードは ダッシュボードに自動登録され、 翌週から育成シーケンスが開始されます。</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===== 2. リードダッシュボード ===== */}
        <section className="mb-16">
          <div className="mb-5 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 text-white">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">② リードダッシュボード</h2>
              <p className="text-sm text-gray-600">
                取得済リード {dashboardStats.total} 件をスコア / 状態で一覧。
              </p>
            </div>
          </div>

          {/* KPI cards */}
          <div className="mb-5 grid gap-3 sm:grid-cols-4">
            <div className="rounded-xl border border-orange-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">取得済</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">{dashboardStats.total}<span className="ml-1 text-xs text-gray-500">件</span></p>
            </div>
            <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700">フォロー中</p>
              <p className="mt-1 text-2xl font-bold text-amber-900">{dashboardStats.followingUp}<span className="ml-1 text-xs text-amber-700">件</span></p>
            </div>
            <div className="rounded-xl border border-orange-300 bg-orange-100/80 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-800">商談移行</p>
              <p className="mt-1 text-2xl font-bold text-orange-900">{dashboardStats.moveToDeal}<span className="ml-1 text-xs text-orange-800">件</span></p>
            </div>
            <div className="rounded-xl border border-orange-200 bg-white p-4">
              <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">
                <TrendingUp className="h-3 w-3" />
                平均スコア
              </div>
              <p className="mt-1 text-2xl font-bold text-gray-900">{dashboardStats.avgScore}</p>
            </div>
          </div>

          {/* Filter + Search */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {(["全て", "新規", "フォロー中", "商談移行", "失注"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStatusFilter(s)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                  statusFilter === s
                    ? "bg-orange-500 text-white"
                    : "border border-orange-200 bg-white text-orange-800 hover:bg-orange-50"
                }`}
              >
                {s}
              </button>
            ))}
            <div className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-orange-200 bg-white px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-gray-500" />
              <input
                type="text"
                placeholder="検索 (会社名 / 興味分野)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 bg-transparent text-xs outline-none placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-2xl border border-orange-200 bg-white shadow-sm">
            <div className="max-h-[480px] overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-orange-50/90 backdrop-blur">
                  <tr className="text-left text-[11px] font-bold uppercase tracking-wide text-orange-900">
                    <th className="px-4 py-3">スコア</th>
                    <th className="px-4 py-3">氏名 / 会社</th>
                    <th className="hidden px-4 py-3 md:table-cell">興味分野</th>
                    <th className="hidden px-4 py-3 lg:table-cell">業界</th>
                    <th className="px-4 py-3">状態</th>
                    <th className="px-4 py-3">次回</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className={`border-t border-orange-100 transition hover:bg-orange-50/50 ${
                        selectedLeadId === lead.id ? "bg-orange-50/80" : ""
                      }`}
                    >
                      <td className="px-4 py-3">
                        <span className={`inline-flex h-8 min-w-[2.5rem] items-center justify-center rounded-full px-2 text-xs font-bold ${scoreColor(lead.score)}`}>
                          {lead.score}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{lead.name}</p>
                        <p className="text-xs text-gray-600">{lead.company} / {lead.role}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-gray-700 md:table-cell">{lead.interest}</td>
                      <td className="hidden px-4 py-3 text-gray-600 lg:table-cell">{lead.industry}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${statusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-700">
                        <div className="inline-flex items-center gap-1">
                          <Calendar className="h-3 w-3 text-orange-500" />
                          {lead.nextFollow}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedLeadId(lead.id)
                            setPostponeWeeks(0)
                          }}
                          className="inline-flex items-center gap-0.5 rounded-md bg-orange-100 px-2 py-1 text-[10px] font-bold text-orange-800 hover:bg-orange-200"
                        >
                          配信プラン
                          <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredLeads.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">
                        該当するリードがありません
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* High-score alert */}
          <div className="mt-4 inline-flex items-start gap-2 rounded-lg border border-orange-300 bg-orange-50 px-3 py-2 text-xs text-orange-900">
            <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <p>
              <span className="font-bold">スコア 85+ が {demoLeads.filter((l) => l.score >= 85).length} 件</span>。
              「資料請求 OK」「商談 OK」 タイミング到来の通知が送られています。
            </p>
          </div>
        </section>

        {/* ===== 3. フォロー配信スケジュール ===== */}
        <section className="mb-16">
          <div className="mb-5 flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-orange-500 text-white">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">③ フォロー配信スケジュール (6 ヶ月)</h2>
              <p className="text-sm text-gray-600">
                個別リードに 翌週 / 1 ヶ月 / 3 ヶ月 / 6 ヶ月 の自動配信プラン。
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-200 bg-white p-6 shadow-sm">
            {/* Selected lead summary */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 p-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-700">配信対象</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {selectedLead.name} <span className="text-sm font-medium text-gray-600">({selectedLead.company} / {selectedLead.role})</span>
                </p>
                <p className="text-xs text-gray-700">
                  興味: <span className="font-bold">{selectedLead.interest}</span> ・ 業界: {selectedLead.industry} ・ スコア: <span className="font-bold">{selectedLead.score}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-700">次回配信を:</span>
                <button
                  type="button"
                  onClick={() => setPostponeWeeks((w) => Math.max(0, w - 1))}
                  disabled={postponeWeeks === 0}
                  className="rounded-md border border-orange-200 bg-white px-2 py-1 text-xs font-bold text-orange-700 hover:bg-orange-50 disabled:opacity-40"
                >
                  − 1 週
                </button>
                <span className="min-w-[5rem] text-center text-xs font-bold text-orange-700">
                  {postponeWeeks === 0 ? "元のまま" : `${postponeWeeks} 週 後ろ倒し`}
                </span>
                <button
                  type="button"
                  onClick={() => setPostponeWeeks((w) => Math.min(8, w + 1))}
                  className="rounded-md bg-orange-500 px-3 py-1 text-xs font-bold text-white hover:bg-orange-600"
                >
                  + 1 週 後ろ倒し
                </button>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative space-y-4 pl-6">
              <div className="absolute bottom-2 left-2 top-2 w-0.5 bg-gradient-to-b from-orange-300 via-orange-200 to-amber-100" />
              {plan.map((step, idx) => {
                const Icon = step.channel === "LINE" ? MessageSquare : step.channel === "メール" ? Mail : Bell
                return (
                  <div key={idx} className="relative">
                    <div className="absolute -left-6 top-1 grid h-4 w-4 place-items-center rounded-full bg-orange-500 ring-4 ring-orange-100">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <div className="rounded-xl border border-orange-100 bg-white p-4 transition hover:border-orange-300">
                      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-2">
                          <span className="rounded-md bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
                            {step.timing}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                            <Icon className="h-3 w-3" />
                            {step.channel}
                          </span>
                        </div>
                        <span className="text-[10px] font-medium text-gray-500">
                          自動配信 (実送信なし・デモ)
                        </span>
                      </div>
                      <p className="text-sm font-bold text-gray-900">{step.subject}</p>
                      <p className="mt-1 text-xs leading-6 text-gray-700">{step.body}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <p className="mt-5 rounded-lg bg-orange-50 p-3 text-xs text-orange-900">
              <span className="font-bold">スコア変化に応じて自動再計画</span>: メール開封 / リンクタップ等でスコアが 5-15 pt 上昇すると、 配信頻度・内容が AI で自動調整されます (本デモは固定プランを表示)。
            </p>
          </div>
        </section>

        {/* ===== 効果サマリ ===== */}
        <section className="mb-16 rounded-2xl border border-orange-300 bg-gradient-to-br from-orange-50 via-amber-50 to-white p-6 sm:p-8">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            展示会 1 回 (3 日間) で取得 200 件 → 自動育成した場合の効果
          </h2>
          <p className="mt-1 text-sm text-gray-700">
            業界実態: 展示会後フォロー率 30% 以下 (時間切れ / 担当不在 / 優先順位低)。
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-orange-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-500">Before (手作業)</p>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                <li>名刺入力 200 件 × 5 分 = <span className="font-bold">約 17 時間</span></li>
                <li>フォロー率 <span className="font-bold">30%</span> (60 件)</li>
                <li>商談化 5 件 × 受注率 20% = <span className="font-bold">1 件</span></li>
              </ul>
            </div>
            <div className="rounded-xl border border-orange-200 bg-white p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-700">After (本ツール)</p>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-700">
                <li>名刺撮影 200 件 × 5 秒 = <span className="font-bold">約 17 分</span></li>
                <li>フォロー率 <span className="font-bold">100%</span> (200 件、 自動配信)</li>
                <li>商談化 12-18 件 × 受注率 25% = <span className="font-bold">3-5 件</span></li>
              </ul>
            </div>
            <div className="rounded-xl border-2 border-orange-500 bg-orange-500 p-4 text-white">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-orange-100">Delta</p>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li>入力時間 <span className="font-bold">−16 時間 40 分</span></li>
                <li>フォロー率 <span className="font-bold">+70 pt</span></li>
                <li>受注 <span className="font-bold">+2 〜 +4 件 / 1 展示会</span></li>
                <li className="mt-2 border-t border-orange-300 pt-2 text-xs">
                  受注 1 件 = SaaS LTV 約 ¥60-180 万円相当
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ===== CTA ===== */}
        <section className="rounded-2xl border border-orange-200 bg-white p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
              v8.0 #03
            </span>
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              JAPAN BUILD TOKYO で実物を体験してください
            </h2>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-700">
            12/2-4、 東京ビッグサイトに出展予定。 本デモを実物大タブレットでお試しいただけます。
            個別商談枠は事前予約優先。 展示会出展助成事業 R8 対象。
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/#contact"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-orange-500 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-orange-600"
            >
              事前商談枠を予約
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex h-10 items-center rounded-lg border border-orange-200 bg-white px-4 text-sm font-bold text-orange-700 hover:bg-orange-50"
            >
              トップへ戻る
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
