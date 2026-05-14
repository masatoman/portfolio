"use client"

import { useMemo, useState } from "react"
import {
  AlertCircle,
  ClipboardCopy,
  Download,
  FileText,
  Loader2,
  Sparkles,
  Upload,
} from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { AuthGate } from "@/components/lab-tools/auth-gate"
import { LabToolPageShell } from "@/components/lab-tools/lab-tool-page-shell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import {
  type BeforeAfterStats,
  type WorkLog,
  buildBeforeAfterStats,
  parseWorkLogCsv,
} from "@/lib/lab-tools/productivity-csv"
import {
  SAMPLE_CSV,
  formatReportAsMarkdown,
  type ReportOutput,
} from "@/lib/lab-tools/dev-productivity-report"

const yen = (n: number) => `¥${Math.round(n).toLocaleString("ja-JP")}`

type Settings = {
  beforeFrom: string
  beforeTo: string
  afterFrom: string
  afterTo: string
  hourlyWage: number
  introducedThing: string
}

const DEFAULT_SETTINGS: Settings = {
  beforeFrom: "2026-02-01",
  beforeTo: "2026-02-28",
  afterFrom: "2026-04-01",
  afterTo: "2026-04-30",
  hourlyWage: 5000,
  introducedThing:
    "高速 SSD 搭載の MacBook Pro (M4 Pro) と 大型外部モニタ。 ビルド・テスト時間が大幅に短縮された。",
}

export function DevProductivityReportDemo() {
  const [csvText, setCsvText] = useState<string>(SAMPLE_CSV)
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [report, setReport] = useState<ReportOutput | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [csvError, setCsvError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const logs: WorkLog[] = useMemo(() => {
    setCsvError(null)
    if (!csvText.trim()) return []
    try {
      return parseWorkLogCsv(csvText)
    } catch (e) {
      setCsvError(e instanceof Error ? e.message : "CSV parse error")
      return []
    }
  }, [csvText])

  const stats: BeforeAfterStats | null = useMemo(() => {
    if (logs.length === 0) return null
    return buildBeforeAfterStats({
      logs,
      beforeFrom: settings.beforeFrom,
      beforeTo: settings.beforeTo,
      afterFrom: settings.afterFrom,
      afterTo: settings.afterTo,
      hourlyWage: settings.hourlyWage,
    })
  }, [logs, settings])

  const markdown = useMemo(
    () => (stats && report ? formatReportAsMarkdown(stats, report) : ""),
    [stats, report],
  )

  function onUploadCsv(file: File) {
    const reader = new FileReader()
    reader.onload = () => {
      setCsvText(String(reader.result ?? ""))
    }
    reader.readAsText(file, "utf-8")
  }

  async function onGenerate() {
    if (!stats) return
    setLoading(true)
    setError(null)
    setReport(null)
    try {
      const res = await fetch("/api/lab-tools/dev-productivity-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          stats,
          introducedThing: settings.introducedThing || undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || body?.error || `HTTP ${res.status}`)
      }
      const data: ReportOutput = await res.json()
      setReport(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error")
    } finally {
      setLoading(false)
    }
  }

  function copyMarkdown() {
    if (!markdown) return
    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  function downloadMarkdown() {
    if (!markdown) return
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "productivity-report.md"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <LabToolPageShell
      eyebrow="// lab_tool / dev_productivity_report"
      title="残業撃退 定量化レポーター"
      accent="amber"
      description="開発工数の CSV (date, hours, task, category) を貼り付けて 導入前/導入後の期間を指定すると、 月別工数比較グラフ + 効果額試算 (時給 × 削減時間 × 12) + 補助金成果報告書フォーマットの文章 を Claude が生成します。"
      disclaimer="削減時間の換算は『1 営業日あたり差分 × 22 営業日』のシンプル計算です。 効果額は『換算値』であり 実際の追加売上ではありません。 補助金事務局向けの数値根拠としては、 自社の実勤務記録 (タイムカード等) との整合確認を必ず行ってください。"
    >
      <div className="space-y-10">
        <AuthGate />
        <CsvBlock
          csvText={csvText}
          setCsvText={setCsvText}
          onUpload={onUploadCsv}
          logsCount={logs.length}
          csvError={csvError}
        />
        <SettingsBlock settings={settings} setSettings={setSettings} />
        {stats && <StatsBlock stats={stats} />}
        {stats && (
          <GenerateBlock
            onGenerate={onGenerate}
            loading={loading}
            disabled={stats.beforePeriod.totalHours === 0 && stats.afterPeriod.totalHours === 0}
          />
        )}
        {error && <ErrorBlock message={error} />}
        {stats && report && (
          <ReportBlock
            report={report}
            markdown={markdown}
            onCopy={copyMarkdown}
            onDownload={downloadMarkdown}
            copied={copied}
          />
        )}
      </div>
    </LabToolPageShell>
  )
}

// ─────────────────────────────────────────
// CSV input
// ─────────────────────────────────────────

function CsvBlock({
  csvText,
  setCsvText,
  onUpload,
  logsCount,
  csvError,
}: {
  csvText: string
  setCsvText: (s: string) => void
  onUpload: (file: File) => void
  logsCount: number
  csvError: string | null
}) {
  return (
    <div className="border border-white/10 bg-black/40 p-6 sm:p-8 space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
          // 開発工数 CSV (date, hours, task, category)
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-white/40">
            parsed: {logsCount} rows
          </span>
          <label className="cursor-pointer inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 transition">
            <Upload className="h-3.5 w-3.5" />
            csv upload
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) onUpload(f)
              }}
            />
          </label>
          <button
            onClick={() => setCsvText(SAMPLE_CSV)}
            className="inline-flex items-center gap-1.5 border border-[#ffb800]/40 bg-[#ffb800]/5 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#ffb800] hover:bg-[#ffb800]/15 transition"
          >
            <FileText className="h-3.5 w-3.5" />
            sample csv
          </button>
        </div>
      </div>
      <Textarea
        value={csvText}
        rows={8}
        onChange={(e) => setCsvText(e.target.value)}
        className="bg-black/60 border-white/15 text-white font-mono text-xs"
        spellCheck={false}
      />
      {csvError && (
        <p className="text-xs text-red-300 font-mono">CSV エラー: {csvError}</p>
      )}
      <p className="text-[10px] text-white/40 leading-relaxed">
        ヘッダー必須: date (YYYY-MM-DD), hours (数値), task (任意), category (任意)。 GitHub の commit log や Toggl の export を変換して使う想定。
      </p>
    </div>
  )
}

// ─────────────────────────────────────────
// Settings
// ─────────────────────────────────────────

function SettingsBlock({
  settings,
  setSettings,
}: {
  settings: Settings
  setSettings: (next: Settings) => void
}) {
  return (
    <div className="border border-white/10 bg-black/40 p-6 sm:p-8 space-y-5">
      <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
        // 比較期間 + 時給
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <PeriodGroup
          title="導入前 (BEFORE)"
          accent="#888"
          from={settings.beforeFrom}
          to={settings.beforeTo}
          onFrom={(v) => setSettings({ ...settings, beforeFrom: v })}
          onTo={(v) => setSettings({ ...settings, beforeTo: v })}
        />
        <PeriodGroup
          title="導入後 (AFTER)"
          accent={LAB_NEON.amber}
          from={settings.afterFrom}
          to={settings.afterTo}
          onFrom={(v) => setSettings({ ...settings, afterFrom: v })}
          onTo={(v) => setSettings({ ...settings, afterTo: v })}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-white/70">
            時給 (円) — 効果額換算用
          </Label>
          <Input
            type="number"
            value={settings.hourlyWage}
            min={0}
            step={500}
            onChange={(e) => {
              const n = Number(e.target.value)
              setSettings({ ...settings, hourlyWage: Number.isFinite(n) ? n : 0 })
            }}
            className="bg-black/60 border-white/15 text-white font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-widest text-white/70">
            導入したもの (任意、 文章化に使用)
          </Label>
          <Input
            value={settings.introducedThing}
            onChange={(e) => setSettings({ ...settings, introducedThing: e.target.value })}
            className="bg-black/60 border-white/15 text-white"
            placeholder="例: 高速 SSD 搭載 MacBook Pro と外部モニタ"
          />
        </div>
      </div>
    </div>
  )
}

function PeriodGroup({
  title,
  accent,
  from,
  to,
  onFrom,
  onTo,
}: {
  title: string
  accent: string
  from: string
  to: string
  onFrom: (v: string) => void
  onTo: (v: string) => void
}) {
  return (
    <div className="border bg-black/30 p-4 space-y-3" style={{ borderColor: `${accent}40` }}>
      <p className="text-[10px] uppercase tracking-widest font-bold" style={{ color: accent }}>
        {title}
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          type="date"
          value={from}
          onChange={(e) => onFrom(e.target.value)}
          className="bg-black/60 border-white/15 text-white font-mono text-xs"
        />
        <Input
          type="date"
          value={to}
          onChange={(e) => onTo(e.target.value)}
          className="bg-black/60 border-white/15 text-white font-mono text-xs"
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Stats + chart
// ─────────────────────────────────────────

function StatsBlock({ stats }: { stats: BeforeAfterStats }) {
  const chartData = useMemo(() => {
    const months = new Set<string>()
    for (const m of stats.monthlyBefore) months.add(m.month)
    for (const m of stats.monthlyAfter) months.add(m.month)
    return Array.from(months)
      .sort()
      .map((month) => ({
        month,
        before: stats.monthlyBefore.find((m) => m.month === month)?.hours ?? 0,
        after: stats.monthlyAfter.find((m) => m.month === month)?.hours ?? 0,
      }))
  }, [stats])

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="導入前 平均 / 日"
          value={`${stats.beforePeriod.avgPerDay} h`}
          sub={`${stats.beforePeriod.totalHours} h / ${stats.beforePeriod.days} 日`}
          accent="#888"
        />
        <StatCard
          label="導入後 平均 / 日"
          value={`${stats.afterPeriod.avgPerDay} h`}
          sub={`${stats.afterPeriod.totalHours} h / ${stats.afterPeriod.days} 日`}
          accent={LAB_NEON.amber}
        />
        <StatCard
          label="年間効果額"
          value={yen(stats.monetaryImpactPerYear)}
          sub={`月 ${stats.deltaHoursPerMonth} h 削減 × 時給 ${yen(stats.hourlyWage)} × 12`}
          accent={LAB_NEON.green}
          highlight
        />
      </div>

      {chartData.length > 0 && (
        <div className="border border-white/10 bg-black/40 p-6 sm:p-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-4">
            // 月別工数 (時間)
          </h3>
          <div className="h-[320px] -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 16, bottom: 6, left: 8 }}>
                <CartesianGrid stroke="#ffffff10" strokeDasharray="2 4" />
                <XAxis
                  dataKey="month"
                  stroke="#ffffff60"
                  tick={{ fontSize: 10, fill: "#ffffff80" }}
                />
                <YAxis
                  stroke="#ffffff60"
                  tick={{ fontSize: 10, fill: "#ffffff80" }}
                  tickFormatter={(v) => `${v}h`}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    background: "#000",
                    border: `1px solid ${LAB_NEON.amber}60`,
                    fontSize: 11,
                  }}
                  formatter={(v: number) => `${v} 時間`}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#fff" }} />
                <Bar dataKey="before" name="導入前" fill="#666" />
                <Bar dataKey="after" name="導入後" fill={LAB_NEON.amber} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
  accent,
  highlight,
}: {
  label: string
  value: string
  sub: string
  accent: string
  highlight?: boolean
}) {
  return (
    <div
      className="border bg-black/40 p-5"
      style={{ borderColor: highlight ? `${accent}80` : `${accent}40` }}
    >
      <p
        className="text-[10px] uppercase tracking-widest font-bold mb-2"
        style={{ color: accent }}
      >
        {label}
      </p>
      <div
        className={`font-mono ${highlight ? "text-3xl text-white" : "text-2xl text-white/85"} font-black tracking-tight mb-1`}
      >
        {value}
      </div>
      <p className="text-[10px] text-white/50 leading-relaxed">{sub}</p>
    </div>
  )
}

// ─────────────────────────────────────────
// Generate button
// ─────────────────────────────────────────

function GenerateBlock({
  onGenerate,
  loading,
  disabled,
}: {
  onGenerate: () => void
  loading: boolean
  disabled: boolean
}) {
  return (
    <button
      onClick={onGenerate}
      disabled={loading || disabled}
      className="w-full inline-flex items-center justify-center gap-2 border border-[#ffb800]/60 bg-[#ffb800]/10 px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#ffb800] hover:bg-[#ffb800]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          文章化中...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          補助金成果報告書 文章を 生成する
        </>
      )}
    </button>
  )
}

// ─────────────────────────────────────────
// Error
// ─────────────────────────────────────────

function ErrorBlock({ message }: { message: string }) {
  return (
    <div className="border border-red-500/40 bg-red-500/5 p-5 flex items-start gap-3">
      <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-bold text-red-300 mb-1">生成に失敗しました</p>
        <p className="text-xs text-red-200/70 font-mono">{message}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Report
// ─────────────────────────────────────────

function ReportBlock({
  report,
  markdown,
  onCopy,
  onDownload,
  copied,
}: {
  report: ReportOutput
  markdown: string
  onCopy: () => void
  onDownload: () => void
  copied: boolean
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-xs font-bold uppercase tracking-widest text-[#ffb800]">
          // 生成された 報告書ドラフト
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono uppercase tracking-widest mr-2"
            style={{ color: report.mode === "ai" ? LAB_NEON.green : "#888" }}
          >
            {report.mode === "ai" ? "● ai response" : "○ sample mode"}
          </span>
          <button
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-white/80 hover:bg-white/10 transition"
          >
            <ClipboardCopy className="h-3.5 w-3.5" />
            {copied ? "copied" : "Markdown copy"}
          </button>
          <button
            onClick={onDownload}
            className="inline-flex items-center gap-1.5 border border-[#ffb800]/40 bg-[#ffb800]/5 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#ffb800] hover:bg-[#ffb800]/15 transition"
          >
            <Download className="h-3.5 w-3.5" />
            .md
          </button>
        </div>
      </div>

      {report.caveat && (
        <div className="border border-white/15 bg-black/30 p-4 text-[11px] text-white/60 font-mono leading-relaxed">
          {report.caveat}
        </div>
      )}

      <div className="border border-[#ffb800]/40 bg-black/40 p-6 sm:p-8 space-y-5">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#ffb800] mb-3">
            // 効果サマリー (bullets)
          </p>
          <ul className="space-y-1.5 text-sm text-white/85">
            {report.bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="font-mono text-[#ffb800]">●</span>
                <span className="leading-relaxed">{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#ffb800] mb-3">
            // 本文 (narrative)
          </p>
          <p className="text-sm text-white/90 leading-relaxed font-variant-y2k-body whitespace-pre-wrap">
            {report.narrative}
          </p>
        </div>
      </div>
    </div>
  )
}
