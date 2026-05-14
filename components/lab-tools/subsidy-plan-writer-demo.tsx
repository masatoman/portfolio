"use client"

import { Suspense, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { AlertCircle, ClipboardCopy, Download, Loader2, Sparkles } from "lucide-react"
import { AuthGate } from "@/components/lab-tools/auth-gate"
import { LabToolPageShell } from "@/components/lab-tools/lab-tool-page-shell"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import {
  formatPlanAsMarkdown,
  isValidSubsidyId,
  type PlanInput,
  type PlanOutput,
  targetSubsidies,
  targetSubsidyLabels,
} from "@/lib/lab-tools/subsidy-plan-writer"

const DEFAULT_INPUT: PlanInput = {
  equipmentDescription:
    "MacBook Pro 14インチ (M4 Pro 12コア / メモリ 24GB / SSD 1TB)。 ソフトウェア開発業務に使用。",
  equipmentUrl: "",
  businessIssue:
    "現行の PC (5 年前モデル) ではビルド時間が 1 タスクあたり 8〜12 分かかっており、 1 日あたり累計 2〜3 時間が待機時間として失われている。 これにより新規受注対応の遅延と残業時間の増加が発生している。",
  targetSubsidy: "it-2026",
}

export function SubsidyPlanWriterDemo() {
  return (
    <Suspense fallback={null}>
      <SubsidyPlanWriterInner />
    </Suspense>
  )
}

function SubsidyPlanWriterInner() {
  const search = useSearchParams()
  const [input, setInput] = useState<PlanInput>(() => {
    const subsidyParam = search.get("subsidy")
    const issue = search.get("issue")
    const want = search.get("want")
    return {
      equipmentDescription: want?.trim() ? want : DEFAULT_INPUT.equipmentDescription,
      equipmentUrl: "",
      businessIssue: issue?.trim() ? issue : DEFAULT_INPUT.businessIssue,
      targetSubsidy:
        subsidyParam && isValidSubsidyId(subsidyParam)
          ? subsidyParam
          : DEFAULT_INPUT.targetSubsidy,
    }
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<PlanOutput | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const markdown = useMemo(
    () => (result ? formatPlanAsMarkdown(result) : ""),
    [result],
  )

  async function onSubmit() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch("/api/lab-tools/subsidy-plan-writer", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...input,
          equipmentUrl: input.equipmentUrl || undefined,
        }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body?.message || body?.error || `HTTP ${res.status}`)
      }
      const data: PlanOutput = await res.json()
      setResult(data)
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
    a.download = `business-plan-${input.targetSubsidy}-draft.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <LabToolPageShell
      eyebrow="// lab_tool / subsidy_plan_writer"
      title="事業計画 逆算ジェネレーター"
      accent="green"
      description="買いたい機材と業務課題を入れると、 IT 導入補助金 / 持続化 / ものづくり 補助金の事業計画書ドラフトを Claude が生成します。 文体は『である調』、 必須セクション 6 個以上、 生産性向上ロジック (Before/After/数値) 付き。 そのまま申請書に貼り付け、 自分の事情に合わせて手直しする運用を想定。"
      disclaimer="生成される文章は『下書き』です。 数値は 必ず自分の事業実績で裏付けし、 補助金事務局の最新公募要領 (各補助金で年内変更あり) と整合させてから提出してください。 採択を保証するものではありません。"
    >
      <div className="space-y-10">
        <AuthGate />
        <InputsBlock input={input} setInput={setInput} onSubmit={onSubmit} loading={loading} />
        {error && <ErrorBlock message={error} />}
        {result && (
          <ResultsBlock
            result={result}
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
// Inputs
// ─────────────────────────────────────────

function InputsBlock({
  input,
  setInput,
  onSubmit,
  loading,
}: {
  input: PlanInput
  setInput: (next: PlanInput) => void
  onSubmit: () => void
  loading: boolean
}) {
  const canSubmit =
    input.equipmentDescription.length >= 10 && input.businessIssue.length >= 10
  return (
    <div className="border border-white/10 bg-black/40 p-6 sm:p-8 space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
        // 入力 (機材 + 課題)
      </h2>

      <Field label="申請対象の補助金">
        <Select
          value={input.targetSubsidy}
          onValueChange={(v) =>
            setInput({ ...input, targetSubsidy: v as PlanInput["targetSubsidy"] })
          }
        >
          <SelectTrigger className="bg-black/60 border-white/15 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {targetSubsidies.map((id) => (
              <SelectItem key={id} value={id}>
                {targetSubsidyLabels[id]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>

      <Field
        label="導入する機材・サービスの説明 (10 文字以上)"
        hint="機種名・スペック・用途を できるだけ具体的に"
      >
        <Textarea
          value={input.equipmentDescription}
          rows={3}
          maxLength={2000}
          onChange={(e) => setInput({ ...input, equipmentDescription: e.target.value })}
          className="bg-black/60 border-white/15 text-white"
        />
      </Field>

      <Field label="参照 URL (任意)" hint="製品ページ・販売ページ等。 入力すると簡易的にタイトル・見出しを抽出して文脈に加えます">
        <Input
          type="url"
          value={input.equipmentUrl ?? ""}
          placeholder="https://..."
          onChange={(e) => setInput({ ...input, equipmentUrl: e.target.value })}
          className="bg-black/60 border-white/15 text-white font-mono"
        />
      </Field>

      <Field label="現在の業務課題 (10 文字以上)" hint="今の状態で 何にどれくらい時間/コストが取られているか、 数字で書けると審査で効きます">
        <Textarea
          value={input.businessIssue}
          rows={4}
          maxLength={2000}
          onChange={(e) => setInput({ ...input, businessIssue: e.target.value })}
          className="bg-black/60 border-white/15 text-white"
        />
      </Field>

      <button
        onClick={onSubmit}
        disabled={loading || !canSubmit}
        className="w-full inline-flex items-center justify-center gap-2 border border-[#39ff14]/60 bg-[#39ff14]/10 px-6 py-4 text-sm font-bold uppercase tracking-widest text-[#39ff14] hover:bg-[#39ff14]/20 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            生成中... (15〜30 秒)
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            事業計画書ドラフトを 生成する
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
        <p className="text-sm font-bold text-red-300 mb-1">生成に失敗しました</p>
        <p className="text-xs text-red-200/70 font-mono">{message}</p>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Results
// ─────────────────────────────────────────

function ResultsBlock({
  result,
  markdown,
  onCopy,
  onDownload,
  copied,
}: {
  result: PlanOutput
  markdown: string
  onCopy: () => void
  onDownload: () => void
  copied: boolean
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#39ff14] mb-1">
            // 事業計画書ドラフト
          </p>
          <h2 className="text-base font-black tracking-tight">{result.subsidy} 申請用</h2>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-mono uppercase tracking-widest mr-2"
            style={{ color: result.mode === "ai" ? LAB_NEON.green : "#888" }}
          >
            {result.mode === "ai" ? "● ai response" : "○ sample mode"}
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
            className="inline-flex items-center gap-1.5 border border-[#39ff14]/40 bg-[#39ff14]/5 px-3 py-2 text-[11px] font-bold uppercase tracking-widest text-[#39ff14] hover:bg-[#39ff14]/15 transition"
          >
            <Download className="h-3.5 w-3.5" />
            .md
          </button>
        </div>
      </div>

      {result.caveat && (
        <div className="border border-white/15 bg-black/30 p-4 text-[11px] text-white/60 font-mono leading-relaxed">
          {result.caveat}
        </div>
      )}

      <div className="space-y-4">
        {result.sections.map((s, i) => (
          <SectionCard key={i} heading={s.heading} body={s.body} />
        ))}
      </div>

      <ProductivityCard logic={result.productivityLogic} />

      <details className="border border-white/10 bg-black/30">
        <summary className="cursor-pointer px-5 py-3 text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white">
          // raw markdown
        </summary>
        <pre className="px-5 py-4 text-[11px] text-white/70 leading-relaxed font-mono overflow-x-auto whitespace-pre-wrap">
          {markdown}
        </pre>
      </details>
    </div>
  )
}

function SectionCard({ heading, body }: { heading: string; body: string }) {
  return (
    <div className="border border-white/10 bg-black/40 p-5 sm:p-6">
      <h3 className="text-sm font-black tracking-tight mb-3 text-[#39ff14] uppercase">
        {heading}
      </h3>
      <p className="text-sm text-white/85 leading-relaxed font-variant-y2k-body whitespace-pre-wrap">
        {body}
      </p>
    </div>
  )
}

function ProductivityCard({
  logic,
}: {
  logic: PlanOutput["productivityLogic"]
}) {
  return (
    <div className="border border-[#39ff14]/40 bg-black/40 p-5 sm:p-6">
      <p className="text-xs font-bold uppercase tracking-widest text-[#39ff14] mb-4">
        // 労働生産性 向上ロジック
      </p>
      <dl className="grid gap-3 sm:grid-cols-3">
        <Pair label="Before" value={logic.before} accent="#888" />
        <Pair label="After" value={logic.after} accent={LAB_NEON.cyan} />
        <Pair label="数値インパクト" value={logic.quantitativeImpact} accent={LAB_NEON.green} />
      </dl>
    </div>
  )
}

function Pair({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div>
      <dt
        className="text-[10px] uppercase tracking-widest font-bold mb-1.5"
        style={{ color: accent }}
      >
        {label}
      </dt>
      <dd className="text-xs text-white/85 leading-relaxed font-variant-y2k-body">{value}</dd>
    </div>
  )
}
