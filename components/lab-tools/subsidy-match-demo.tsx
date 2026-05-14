"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, Sparkles, AlertCircle, FileEdit } from "lucide-react"
import { AuthGate } from "@/components/lab-tools/auth-gate"
import { LabToolPageShell } from "@/components/lab-tools/lab-tool-page-shell"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import {
  industries,
  type MatchInput,
  type MatchItem,
  type MatchResult,
} from "@/lib/lab-tools/subsidy-match"
import { isValidSubsidyId } from "@/lib/lab-tools/subsidy-plan-writer"

const DEFAULT_INPUT: MatchInput = {
  industry: "建設・工務店",
  employees: 3,
  issue: "見積書や日報の作成に毎日 2〜3 時間かかっており、 現場業務に集中できない。",
  wantToBuy: "業務効率化のための PC とタブレット、 見積作成ソフト",
}

export function SubsidyMatchDemo() {
  const [input, setInput] = useState<MatchInput>(DEFAULT_INPUT)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<MatchResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/lab-tools/subsidy-match", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(input),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || body?.error || `HTTP ${res.status}`)
      }
      const data: MatchResult = await res.json()
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "unknown error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <LabToolPageShell
      eyebrow="// lab_tool / subsidy_match"
      title="AI 補助金 診断"
      accent="magenta"
      description="業種・従業員数・課題・買いたいものを入れると、 主要 5 補助金 (IT 導入 / 持続化 / ものづくり / 業務改善 / 省力化) との合致率を AI が算出します。 不足要件と次のアクションも返ります。"
      disclaimer="判定は 2026 年春時点の制度概要に基づく目安です。 IT 導入補助金は IT 導入支援事業者経由での申請が必須で、 masatoman 自身は 2026/5 時点で支援事業者登録 (構成員含む) はしていません。 実際の申請可否・採択可否は 各補助金の事務局・商工会議所・認定支援機関にご確認ください。"
    >
      <div className="space-y-10">
        <AuthGate />
        <InputsBlock input={input} setInput={setInput} onSubmit={onSubmit} loading={loading} />
        {error && <ErrorBlock message={error} />}
        {result && <ResultsBlock result={result} userInput={input} />}
      </div>
    </LabToolPageShell>
  )
}

// ─────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────

function InputsBlock({
  input,
  setInput,
  onSubmit,
  loading,
}: {
  input: MatchInput
  setInput: (next: MatchInput) => void
  onSubmit: () => void
  loading: boolean
}) {
  return (
    <div className="border border-white/10 bg-black/40 p-6 sm:p-8 space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
        // 事業情報を入力
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="業種">
          <Select
            value={input.industry}
            onValueChange={(v) => setInput({ ...input, industry: v as MatchInput["industry"] })}
          >
            <SelectTrigger className="bg-black/60 border-white/15 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="従業員数 (代表者除く)">
          <Input
            type="number"
            value={input.employees}
            min={0}
            max={1000}
            onChange={(e) => {
              const n = Number(e.target.value)
              setInput({ ...input, employees: Number.isFinite(n) ? n : 0 })
            }}
            className="bg-black/60 border-white/15 text-white font-mono"
          />
        </Field>
      </div>

      <Field label="現在の課題 (10 文字以上)" hint="例: 見積書作成に時間を取られている、 顧客管理が紙ベースで属人的、 等">
        <Textarea
          value={input.issue}
          rows={3}
          maxLength={1000}
          onChange={(e) => setInput({ ...input, issue: e.target.value })}
          className="bg-black/60 border-white/15 text-white"
        />
      </Field>

      <Field label="買いたいもの・導入したいもの (5 文字以上)" hint="例: PC とタブレット、 業務管理 SaaS、 配膳ロボット、 等">
        <Textarea
          value={input.wantToBuy}
          rows={2}
          maxLength={500}
          onChange={(e) => setInput({ ...input, wantToBuy: e.target.value })}
          className="bg-black/60 border-white/15 text-white"
        />
      </Field>

      <button
        onClick={onSubmit}
        disabled={loading || input.issue.length < 10 || input.wantToBuy.length < 5}
        className="w-full inline-flex items-center justify-center gap-2 border border-[#ff3df0]/60 bg-[#ff3df0]/10 px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#ff3df0] hover:bg-[#ff3df0]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            診断中...
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            5 補助金を 一括診断する
          </>
        )}
      </button>
    </div>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-widest text-white/70">{label}</Label>
      {children}
      {hint && <p className="text-[10px] text-white/40 leading-relaxed">{hint}</p>}
    </div>
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
        <p className="text-sm font-bold text-red-300 mb-1">診断に失敗しました</p>
        <p className="text-xs text-red-200/70 font-mono">{message}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Results
// ─────────────────────────────────────────

function ResultsBlock({ result, userInput }: { result: MatchResult; userInput: MatchInput }) {
  const sorted = [...result.matches].sort((a, b) => b.matchPercent - a.matchPercent)
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
          // 診断結果 (合致率順)
        </h2>
        <span
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: result.mode === "ai" ? LAB_NEON.green : "#888" }}
        >
          {result.mode === "ai" ? "● ai response" : "○ sample mode"}
        </span>
      </div>

      {result.caveat && (
        <div className="border border-white/15 bg-black/30 p-4 text-[11px] text-white/60 font-mono leading-relaxed">
          {result.caveat}
        </div>
      )}

      <div className="space-y-4">
        {sorted.map((m, i) => (
          <MatchCard key={m.subsidyId} match={m} rank={i + 1} userInput={userInput} />
        ))}
      </div>
    </div>
  )
}

function MatchCard({ match, rank, userInput }: { match: MatchItem; rank: number; userInput: MatchInput }) {
  const pct = Math.round(match.matchPercent)
  const color =
    pct >= 70 ? LAB_NEON.green : pct >= 40 ? LAB_NEON.amber : "#888"

  return (
    <div className="border bg-black/40" style={{ borderColor: `${color}40` }}>
      <div className="px-5 sm:px-6 py-4 border-b" style={{ borderColor: `${color}30` }}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-mono text-white/40 mb-1">
              [ rank_{String(rank).padStart(2, "0")} ]
            </div>
            <h3 className="text-base font-black uppercase tracking-tight leading-snug">
              {match.subsidyName}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div
              className="text-3xl font-black font-mono leading-none"
              style={{ color }}
            >
              {pct}
              <span className="text-base">%</span>
            </div>
            <div className="text-[9px] uppercase tracking-widest text-white/40 mt-1">
              match
            </div>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full bg-white/10 overflow-hidden">
          <div
            className="h-full transition-all"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            }}
          />
        </div>
      </div>
      <div className="px-5 sm:px-6 py-4 space-y-4">
        <p className="text-sm text-white/80 leading-relaxed font-variant-y2k-body">{match.reason}</p>

        {match.missingRequirements.length > 0 && (
          <Section title="不足している要件" color="#ff3df0">
            <ul className="space-y-1 text-xs text-white/70">
              {match.missingRequirements.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span style={{ color: "#ff3df0" }}>×</span>
                  <span className="leading-relaxed">{r}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {match.nextActions.length > 0 && (
          <Section title="次にやること" color={LAB_NEON.cyan}>
            <ol className="space-y-1 text-xs text-white/70">
              {match.nextActions.map((a, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-mono" style={{ color: LAB_NEON.cyan }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="leading-relaxed">{a}</span>
                </li>
              ))}
            </ol>
          </Section>
        )}

        <PlanWriterLink match={match} userInput={userInput} />
      </div>
    </div>
  )
}

function PlanWriterLink({ match, userInput }: { match: MatchItem; userInput: MatchInput }) {
  if (!isValidSubsidyId(match.subsidyId)) return null
  const params = new URLSearchParams({
    subsidy: match.subsidyId,
    issue: userInput.issue,
    want: userInput.wantToBuy,
  })
  return (
    <Link
      href={`/lab/tools/subsidy-plan-writer?${params.toString()}`}
      className="mt-2 inline-flex items-center gap-2 border border-[#39ff14]/40 bg-[#39ff14]/5 px-4 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#39ff14] hover:bg-[#39ff14]/15 transition"
    >
      <FileEdit className="h-3.5 w-3.5" />
      この補助金で 事業計画書を 書く
    </Link>
  )
}

function Section({
  title,
  color,
  children,
}: {
  title: string
  color: string
  children: React.ReactNode
}) {
  return (
    <div>
      <p
        className="text-[10px] font-bold uppercase tracking-widest mb-2"
        style={{ color }}
      >
        // {title}
      </p>
      {children}
    </div>
  )
}
