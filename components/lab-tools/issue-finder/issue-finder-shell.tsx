"use client"

import { useMemo, useState } from "react"
import { LabToolPageShell } from "@/components/lab-tools/lab-tool-page-shell"
import { IssueCard } from "@/components/lab-tools/issue-finder/issue-card"
import { IssueMatrix } from "@/components/lab-tools/issue-finder/issue-matrix"
import { DeepSearchHelper } from "@/components/lab-tools/issue-finder/deep-search-helper"
import { KeywordFrequencyMatrix } from "@/components/lab-tools/issue-finder/keyword-frequency-matrix"
import { ScheduledQueriesBoard } from "@/components/lab-tools/issue-finder/scheduled-queries-board"
import { CollectionQueueForm } from "@/components/lab-tools/issue-finder/collection-queue-form"
import { SAMPLE_ISSUES } from "@/lib/lab-tools/issue-finder/sample-data"
import type {
  CollectionJob,
  PerspectiveRunStatus,
} from "@/lib/lab-tools/issue-finder/db"
import { sortIssues, type SortKey } from "@/lib/lab-tools/issue-finder/scoring"
import type { Issue } from "@/lib/lab-tools/issue-finder/types"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import { HowToBoard } from "@/components/lab-tools/issue-finder/_partials/how-to-board"
import { SectionHeader } from "@/components/lab-tools/issue-finder/_partials/section-header"
import {
  HideDogPathToggle,
  HideNeedsReworkToggle,
  HideSubsidyToggle,
  HideUnscoredToggle,
  OnlyValueZoneToggle,
} from "@/components/lab-tools/issue-finder/_partials/result-filter-toggles"
import {
  CopyGapAnalysisButton,
  CopyKomutenGenbaGapButton,
  CopyKomutenGenbaHearingButton,
  CopyMarkdownButton,
} from "@/components/lab-tools/issue-finder/_partials/result-copy-buttons"
import {
  ResultsTabSwitch,
  SortSelect,
  type ResultsTab,
} from "@/components/lab-tools/issue-finder/_partials/result-controls"
import { buildResultsNote } from "@/components/lab-tools/issue-finder/_partials/result-note"

type Props = {
  dbIssues: Issue[]
  jobs: CollectionJob[]
  perspectiveStatus: PerspectiveRunStatus[]
}

export function IssueFinderShell({
  dbIssues,
  jobs,
  perspectiveStatus,
}: Props) {
  const hasDb = dbIssues.length > 0
  const rawIssues: Issue[] = hasDb ? dbIssues : SAMPLE_ISSUES
  const [resultsTab, setResultsTab] = useState<ResultsTab>("results")
  const [sortKey, setSortKey] = useState<SortKey>("issueDriven")
  const [highlightedId, setHighlightedId] = useState<string | null>(null)
  const [hideSubsidy, setHideSubsidy] = useState(false)
  // 本書フレームのフィルタ。 デフォルトで犬の道を隠す (序章 図 4 「犬の道に走るな」)
  const [hideDogPath, setHideDogPath] = useState(true)
  const [onlyValueZone, setOnlyValueZone] = useState(false)
  const [hideNeedsRework, setHideNeedsRework] = useState(false)
  // 未採点 (本書 3 軸が null = 旧データ) を隠す。 過去 105 件混在対策。 デフォルト ON
  const [hideUnscored, setHideUnscored] = useState(true)

  const subsidyCount = useMemo(
    () => rawIssues.filter((i) => i.profileId === "it-subsidy").length,
    [rawIssues],
  )

  const dogPathCount = useMemo(
    () => rawIssues.filter((i) => i.issueDrivenTier === "dog-path").length,
    [rawIssues],
  )

  const valueZoneCount = useMemo(
    () => rawIssues.filter((i) => i.issueDrivenTier === "value-zone").length,
    [rawIssues],
  )

  const needsReworkCount = useMemo(
    () => rawIssues.filter((i) => i.issueDrivenTier === "needs-rework").length,
    [rawIssues],
  )

  const unscoredCount = useMemo(
    () => rawIssues.filter((i) => i.issueDrivenTier == null).length,
    [rawIssues],
  )

  const filteredIssues = useMemo(
    () =>
      rawIssues.filter((i) => {
        if (hideSubsidy && i.profileId === "it-subsidy") return false
        if (hideUnscored && i.issueDrivenTier == null) return false
        // 本書 tier フィルタは「採点済」 行のみに適用
        if (onlyValueZone && i.issueDrivenTier !== "value-zone") return false
        if (hideDogPath && i.issueDrivenTier === "dog-path") return false
        if (hideNeedsRework && i.issueDrivenTier === "needs-rework") return false
        return true
      }),
    [rawIssues, hideSubsidy, hideUnscored, onlyValueZone, hideDogPath, hideNeedsRework],
  )

  const issues = useMemo(
    () => sortIssues(filteredIssues, sortKey),
    [filteredIssues, sortKey],
  )

  return (
    <LabToolPageShell
      eyebrow="// issue_finder.exe"
      title="イシュー発見ツール"
      description="ネット上の悲鳴を業種 × 役職 perspective で巡回。 ブラウザフォームで収集ジョブを登録 → Claude Code SKILL が処理 → Supabase 経由でこのページに反映。 API 課金ゼロ・GUI 操作で完結。"
      accent="green"
      disclaimer="自分用ツール。 本番 Vercel ではアクセスブロック (middleware.ts)。 Supabase 未設定時は サンプルデータ表示にフォールバック。 セットアップ手順: docs/scheduled-routines/issue-finder.md と supabase/migrations/。"
    >
      <div className="space-y-12">
        <SectionHeader
          label="// 00 / how-to"
          color={LAB_NEON.amber}
          title="使い方"
          note="初めて触る時はここを読む (折りたたみ)"
        />
        <details className="group">
          <summary className="mb-3 cursor-pointer font-mono text-[10px] uppercase tracking-widest text-white/55 hover:text-white">
            // 使い方を展開
          </summary>
          <HowToBoard />
        </details>

        <SectionHeader
          label="// 01 / queue"
          color={LAB_NEON.green}
          title="収集ジョブをキューに追加"
          note="GUI フォーム → Supabase → SKILL が処理"
        />
        <CollectionQueueForm
          initialJobs={jobs}
          perspectiveStatus={perspectiveStatus}
        />

        <SectionHeader
          label="// 02 / results"
          color={LAB_NEON.cyan}
          title="集まった結果"
          note={
            hasDb
              ? buildResultsNote({
                  totalCount: dbIssues.length,
                  visibleCount: issues.length,
                  hideSubsidy,
                  subsidyCount,
                  onlyValueZone,
                  valueZoneCount,
                  hideDogPath,
                  dogPathCount,
                  hideNeedsRework,
                  needsReworkCount,
                  hideUnscored,
                  unscoredCount,
                })
              : "DB が空のためサンプル 8 件を表示中"
          }
          right={
            <div className="flex items-center gap-2 flex-wrap">
              {hasDb && valueZoneCount > 0 && (
                <OnlyValueZoneToggle
                  active={onlyValueZone}
                  count={valueZoneCount}
                  onToggle={() => setOnlyValueZone((v) => !v)}
                />
              )}
              {hasDb && dogPathCount > 0 && (
                <HideDogPathToggle
                  hidden={hideDogPath}
                  count={dogPathCount}
                  onToggle={() => setHideDogPath((v) => !v)}
                />
              )}
              {hasDb && needsReworkCount > 0 && (
                <HideNeedsReworkToggle
                  hidden={hideNeedsRework}
                  count={needsReworkCount}
                  onToggle={() => setHideNeedsRework((v) => !v)}
                />
              )}
              {hasDb && unscoredCount > 0 && (
                <HideUnscoredToggle
                  hidden={hideUnscored}
                  count={unscoredCount}
                  onToggle={() => setHideUnscored((v) => !v)}
                />
              )}
              {hasDb && subsidyCount > 0 && (
                <HideSubsidyToggle
                  hidden={hideSubsidy}
                  count={subsidyCount}
                  onToggle={() => setHideSubsidy((v) => !v)}
                />
              )}
              <SortSelect sortKey={sortKey} setSortKey={setSortKey} />
              <ResultsTabSwitch tab={resultsTab} setTab={setResultsTab} />
              <CopyMarkdownButton issues={issues} />
              <CopyGapAnalysisButton issues={rawIssues} />
              <CopyKomutenGenbaGapButton issues={rawIssues} />
              <CopyKomutenGenbaHearingButton issues={rawIssues} />
            </div>
          }
        />

        {resultsTab === "results" && (
          <div className="space-y-8">
            {/* matrix は全体俯瞰用なので rawIssues 全件をプロット。 card 側だけフィルタ適用。 visibleIds で非該当を半透明化 */}
            <IssueMatrix
              issues={rawIssues}
              onIssueClick={(i) => setHighlightedId(i.id)}
              visibleIds={new Set(issues.map((i) => i.id))}
            />
            <div className="grid gap-4 md:grid-cols-2 min-w-0">
              {issues.map((issue, idx) => (
                <div
                  key={issue.id}
                  className={`min-w-0 ${
                    highlightedId === issue.id
                      ? "ring-2 ring-offset-2 ring-offset-black"
                      : ""
                  }`}
                  style={
                    highlightedId === issue.id
                      ? { boxShadow: `0 0 16px ${LAB_NEON.green}` }
                      : undefined
                  }
                >
                  <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                    #{idx + 1}
                  </div>
                  <IssueCard issue={issue} />
                </div>
              ))}
            </div>
          </div>
        )}

        {resultsTab === "keywords" && (
          <KeywordFrequencyMatrix issues={issues} />
        )}

        <SectionHeader
          label="// 03 / settings"
          color={LAB_NEON.amber}
          title="設定・補助機能"
          note="自動収集テーマ確認 / Deep Research プロンプト / 商談用 PDF"
        />

        <div className="grid gap-3 md:grid-cols-2">
          <a
            href="/lab/tools/issue-finder/report"
            target="_blank"
            rel="noopener noreferrer"
            className="block border bg-black/30 p-4 hover:bg-white/5 transition"
            style={{ borderColor: `${LAB_NEON.cyan}60` }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-widest mb-1"
              style={{ color: LAB_NEON.cyan }}
            >
              // 中間業者 向けペライチ
            </p>
            <h3 className="text-sm font-bold uppercase tracking-tight mb-2">
              補助金支援事業者・商工会議所 向け
            </h3>
            <p className="text-[11px] font-mono text-white/55 leading-relaxed">
              専門用語 (Next.js / PWA / Anthropic API 等) を残した技術スタック明示版。
              GビズID・事業計画書・成果報告書まで対応可と伝える。
            </p>
            <p className="mt-2 text-[10px] font-mono text-white/40">
              → /report ↗
            </p>
          </a>

          <a
            href="/lab/tools/issue-finder/report/komuten"
            target="_blank"
            rel="noopener noreferrer"
            className="block border bg-black/30 p-4 hover:bg-white/5 transition"
            style={{ borderColor: `${LAB_NEON.green}60` }}
          >
            <p
              className="font-mono text-[10px] uppercase tracking-widest mb-1"
              style={{ color: LAB_NEON.green }}
            >
              // 工務店オーナー 向けペライチ
            </p>
            <h3 className="text-sm font-bold uppercase tracking-tight mb-2">
              工務店さま 向け ご提案資料
            </h3>
            <p className="text-[11px] font-mono text-white/55 leading-relaxed">
              専門用語を平易な言葉に翻訳。 「現場で使えるアプリ」「無料でご相談」 等
              IT に詳しくない方でも読める版。 直接訪問・面談時の配布用。
            </p>
            <p className="mt-2 text-[10px] font-mono text-white/40">
              → /report/komuten ↗
            </p>
          </a>
        </div>

        <details
          className="border bg-black/20 p-4"
          style={{ borderColor: `${LAB_NEON.cyan}30` }}
        >
          <summary
            className="cursor-pointer font-mono text-[11px] uppercase tracking-widest hover:text-white"
            style={{ color: LAB_NEON.cyan }}
          >
            // 自動収集テーマ (queries.json) を見る
          </summary>
          <div className="mt-4">
            <ScheduledQueriesBoard />
          </div>
        </details>

        <details
          className="border bg-black/20 p-4"
          style={{ borderColor: `${LAB_NEON.amber}30` }}
        >
          <summary
            className="cursor-pointer font-mono text-[11px] uppercase tracking-widest hover:text-white"
            style={{ color: LAB_NEON.amber }}
          >
            // 外部 Deep Research プロンプトを使う (任意の代替手段)
          </summary>
          <div className="mt-4">
            <DeepSearchHelper perspectiveStatus={perspectiveStatus} />
          </div>
        </details>
      </div>
    </LabToolPageShell>
  )
}

