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
import type { CollectionJob } from "@/lib/lab-tools/issue-finder/db"
import {
  SORT_LABEL,
  sortIssues,
  type SortKey,
} from "@/lib/lab-tools/issue-finder/scoring"
import type { Issue } from "@/lib/lab-tools/issue-finder/types"
import { LAB_NEON } from "@/lib/lab-tools/registry"

type Props = {
  dbIssues: Issue[]
  jobs: CollectionJob[]
}

type ResultsTab = "matrix" | "cards" | "keywords"

export function IssueFinderShell({ dbIssues, jobs }: Props) {
  const hasDb = dbIssues.length > 0
  const rawIssues: Issue[] = hasDb ? dbIssues : SAMPLE_ISSUES
  const [resultsTab, setResultsTab] = useState<ResultsTab>("matrix")
  const [sortKey, setSortKey] = useState<SortKey>("opportunity")
  const [highlightedId, setHighlightedId] = useState<string | null>(null)

  const issues = useMemo(
    () => sortIssues(rawIssues, sortKey),
    [rawIssues, sortKey],
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
          note="初めて触る時はここを読む"
        />
        <HowToBoard />

        <SectionHeader
          label="// 01 / queue"
          color={LAB_NEON.green}
          title="収集ジョブをキューに追加"
          note="GUI フォーム → Supabase → SKILL が処理"
        />
        <CollectionQueueForm initialJobs={jobs} />

        <SectionHeader
          label="// 02 / results"
          color={LAB_NEON.cyan}
          title="集まった結果"
          note={
            hasDb
              ? `Supabase から ${dbIssues.length} 件読込`
              : "DB が空のためサンプル 8 件を表示中"
          }
          right={
            <div className="flex items-center gap-2 flex-wrap">
              <SortSelect sortKey={sortKey} setSortKey={setSortKey} />
              <ResultsTabSwitch tab={resultsTab} setTab={setResultsTab} />
            </div>
          }
        />

        {resultsTab === "matrix" && (
          <IssueMatrix
            issues={issues}
            onIssueClick={(i) => setHighlightedId(i.id)}
          />
        )}

        {resultsTab === "cards" && (
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
            <DeepSearchHelper />
          </div>
        </details>
      </div>
    </LabToolPageShell>
  )
}

function HowToBoard() {
  return (
    <div className="space-y-4">
      <ol className="space-y-3 font-variant-y2k-body text-sm leading-relaxed">
        <Step
          n={1}
          color={LAB_NEON.green}
          title="収集テーマを選んでキューに追加 (2 つのモード)"
        >
          下の <span style={{ color: LAB_NEON.green }}>// 01 / queue</span>{" "}
          で perspective を選び、 件数とメモを入れて
          「収集をキューに追加」 を押す。 2 つの使い方ある:
          <ul className="mt-2 ml-4 list-disc space-y-1 text-xs text-white/65">
            <li>
              <strong style={{ color: LAB_NEON.cyan }}>web_search モード</strong>{" "}
              (デフォルト): SKILL が Claude Code 内蔵の web_search でネット巡回. テキスト貼付不要
            </li>
            <li>
              <strong style={{ color: LAB_NEON.magenta }}>Deep Research モード</strong>:
              {" "}
              フォームの「Deep Research 結果を貼る」欄に外部 LLM の出力を貼ると、 SKILL は web_search を skip して貼付テキストを直接クラスタリング. プロンプトは{" "}
              <span style={{ color: LAB_NEON.amber }}>// 03 / settings</span>{" "}
              の「外部 Deep Research プロンプト」からコピー
            </li>
          </ul>
        </Step>
        <Step
          n={2}
          color={LAB_NEON.cyan}
          title="VS Code で Claude Code を起動して SKILL 実行"
        >
          ターミナルで Claude Code を起動 →{" "}
          <code className="border border-white/15 bg-black/60 px-1 py-0.5 text-[12px] font-mono">
            /issue-finder process
          </code>{" "}
          と打つ。 SKILL が pending を 1 件取得し、 ジョブのモードに応じて自動で分岐:
          <ul className="mt-2 ml-4 list-disc space-y-1 text-xs text-white/65">
            <li>
              <strong>web_search モード</strong>: web_search を 8-12 回 → 100-200 件サンプリング → クラスタリング (数秒-数分)
            </li>
            <li>
              <strong>Deep Research モード</strong>: 貼付 text を直接クラスタリング (数秒)
            </li>
          </ul>
        </Step>
        <Step
          n={3}
          color={LAB_NEON.magenta}
          title="ブラウザを更新して結果を見る"
        >
          ページをリロードすると <span style={{ color: LAB_NEON.cyan }}>// 02 / results</span>{" "}
          に新しいクラスタが反映される。 タブで matrix / cards / keywords を切替。 重複は API 側で自動 skip。 jobs リストの{" "}
          <span
            className="border px-1 py-0.5 font-mono text-[9px]"
            style={{ borderColor: `${LAB_NEON.magenta}80`, color: LAB_NEON.magenta }}
          >
            DR
          </span>{" "}
          バッジが Deep Research モードで実行されたジョブの目印。
        </Step>
        <Step
          n={4}
          color={LAB_NEON.amber}
          title="他の Claude Code コマンド (任意)"
        >
          <code className="border border-white/15 bg-black/60 px-1 py-0.5 text-[12px] font-mono">
            /issue-finder process --all
          </code>{" "}
          で pending 全部処理。{" "}
          <code className="border border-white/15 bg-black/60 px-1 py-0.5 text-[12px] font-mono">
            /issue-finder collect komuten:現場監督
          </code>{" "}
          でキューを介さず即時実行。{" "}
          <code className="border border-white/15 bg-black/60 px-1 py-0.5 text-[12px] font-mono">
            /issue-finder list
          </code>{" "}
          で最新イシュー 20 件確認。
        </Step>
      </ol>

      <div
        className="border bg-black/30 p-4"
        style={{ borderColor: `${LAB_NEON.green}40` }}
      >
        <p
          className="mb-2 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: LAB_NEON.green }}
        >
          // スコアの読み方
        </p>
        <p className="text-xs text-white/65 leading-relaxed mb-3 font-variant-y2k-body">
          各クラスタには 4 つの数値が出る。 結論：{" "}
          <span style={{ color: "#ff3838", fontWeight: "bold" }}>動くべき度 70+</span>{" "}
          を最優先、{" "}
          <span style={{ color: LAB_NEON.green, fontWeight: "bold" }}>🎯 真のイシューバッジ</span>{" "}
          付きを次点で見る。 issueScore 単独で判断しない。
        </p>
        <table className="w-full text-[10px] font-mono">
          <tbody>
            <tr className="border-b border-white/10">
              <td className="py-1.5 pr-3 text-white/70 w-28">
                <span style={{ color: "#ff3838" }}>動く</span>{" "}
                (opportunity)
              </td>
              <td className="py-1.5 text-white/55">
                masatoman 視点の最終指標。 issue×0.3 + 解質×0.4 + 適合×0.3。 ≥70 で即動け
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-1.5 pr-3 text-white/70">
                <span style={{ color: "#ff8c00" }}>ｲｼｭｰ</span>{" "}
                (issue)
              </td>
              <td className="py-1.5 text-white/55">
                業界での重要度。 偏差値 50 ≒ 45 点 / 偏差値 60 ≒ 55 点 / 偏差値 70 ≒ 65 点
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-1.5 pr-3 text-white/70">
                <span style={{ color: LAB_NEON.green }}>解質</span>{" "}
                (solvability)
              </td>
              <td className="py-1.5 text-white/55">
                既存技術 + 中小予算で解けるか。 SaaS / AI 領域なら 70+ になりがち
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-1.5 pr-3 text-white/70">
                <span style={{ color: LAB_NEON.cyan }}>適合</span>{" "}
                (personalFit)
              </td>
              <td className="py-1.5 text-white/55">
                補助金 / ツール愚痴 / 主顧客層 / 既存資産 / 技術スキル の 5 項目 × 20 点
              </td>
            </tr>
            <tr className="border-b border-white/10">
              <td className="py-1.5 pr-3 text-white/70">
                <span style={{ color: LAB_NEON.magenta }}>競合↓</span>{" "}
                (competitorDensity)
              </td>
              <td className="py-1.5 text-white/55">
                既存 SaaS (ANDPAD/freee 等) の占有度。 <strong>低いほど OK</strong>。
                密度 70+ = 大手が支配的、 35 以下 = 個人参入余地大
              </td>
            </tr>
            <tr>
              <td className="py-1.5 pr-3 text-white/70">
                <span style={{ color: LAB_NEON.magenta }}>販路↓</span>{" "}
                (salesChannelDifficulty)
              </td>
              <td className="py-1.5 text-white/55">
                対象顧客への売りにくさ。 <strong>低いほど OK</strong>。
                工務店 = 80 (対面営業必須)、 個人事業主 = 35 (Web 完結)
              </td>
            </tr>
          </tbody>
        </table>
        <p className="mt-3 text-[10px] font-mono text-white/50 leading-relaxed">
          <span style={{ color: LAB_NEON.green }}>🎯 真のイシュー</span>{" "}
          バッジは issue ≥ 50 かつ 解質 ≥ 50。 マトリクス右上に位置するクラスタ。
          記事ネタにしかならない (issue 高 × 解質低) クラスタと区別するための目印。
        </p>
        <p className="mt-2 text-[10px] font-mono text-white/50 leading-relaxed">
          動くべき度 = issue 25% + 解質 30% + 適合 20% + (100-競合) 15% + (100-販路) 10%
          の加重平均。 競合密度・販路難易度は 2026-05-11 claude.ai 指摘で追加 (5 軸統合)
        </p>
      </div>

      <div
        className="border bg-black/30 p-4 font-mono text-[10px] leading-relaxed text-white/55 space-y-2"
        style={{ borderColor: `${LAB_NEON.amber}30` }}
      >
        <p style={{ color: LAB_NEON.amber }}>// 動かない時のチェック</p>
        <ul className="space-y-1 pl-4 list-disc">
          <li>
            フォーム送信で 503 →{" "}
            <code>.env.local</code> に Supabase URL / ANON_KEY / SERVICE_ROLE_KEY が入っているか
          </li>
          <li>
            SKILL から API で 401 →{" "}
            <code>ISSUE_FINDER_INTERNAL_KEY</code> が portfolio と Mac env で一致しているか
          </li>
          <li>
            jobs が processing のまま → SKILL が中断した。 Supabase で status を pending に戻す
          </li>
          <li>
            このページが本番 Vercel で 404 → 仕様 (middleware で意図的にブロック)。 dev / preview で使う
          </li>
        </ul>
        <p className="pt-2">
          詳細手順は{" "}
          <code className="text-white/80">
            docs/issue-finder/operations.md
          </code>{" "}
          / SKILL 仕様は{" "}
          <code className="text-white/80">
            ~/.claude/skills/issue-finder/SKILL.md
          </code>
        </p>
      </div>
    </div>
  )
}

function Step({
  n,
  color,
  title,
  children,
}: {
  n: number
  color: string
  title: string
  children: React.ReactNode
}) {
  return (
    <li
      className="border-l-2 pl-4 py-1"
      style={{ borderColor: color }}
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className="font-mono text-[11px] font-bold w-6 text-center border"
          style={{ borderColor: `${color}80`, color }}
        >
          {n}
        </span>
        <span className="text-sm font-bold uppercase tracking-tight">
          {title}
        </span>
      </div>
      <div className="text-xs text-white/65 leading-relaxed pl-8">
        {children}
      </div>
    </li>
  )
}

function SectionHeader({
  label,
  color,
  title,
  note,
  right,
}: {
  label: string
  color: string
  title: string
  note?: string
  right?: React.ReactNode
}) {
  return (
    <div className="mb-2 flex items-end justify-between flex-wrap gap-3">
      <div>
        <p
          className="mb-2 font-mono text-[10px] uppercase tracking-widest"
          style={{ color }}
        >
          {label}
        </p>
        <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">
          {title}
          {note && (
            <span className="ml-3 text-[10px] font-mono uppercase tracking-widest text-white/40">
              [{note}]
            </span>
          )}
        </h2>
      </div>
      {right}
    </div>
  )
}

function SortSelect({
  sortKey,
  setSortKey,
}: {
  sortKey: SortKey
  setSortKey: (k: SortKey) => void
}) {
  const orderedKeys: SortKey[] = [
    "opportunity",
    "trueIssueFirst",
    "issue",
    "clusterRatio",
    "createdAt",
  ]
  return (
    <label
      className="inline-flex items-center gap-1.5 border bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-widest"
      style={{ borderColor: `${LAB_NEON.amber}60`, color: LAB_NEON.amber }}
    >
      <span className="opacity-70">sort:</span>
      <select
        value={sortKey}
        onChange={(e) => setSortKey(e.target.value as SortKey)}
        className="bg-transparent text-white outline-none cursor-pointer"
      >
        {orderedKeys.map((k) => (
          <option key={k} value={k} className="bg-black text-white">
            {SORT_LABEL[k]}
          </option>
        ))}
      </select>
    </label>
  )
}

function ResultsTabSwitch({
  tab,
  setTab,
}: {
  tab: ResultsTab
  setTab: (t: ResultsTab) => void
}) {
  const items: Array<{ key: ResultsTab; label: string; color: string }> = [
    { key: "matrix", label: "matrix", color: LAB_NEON.cyan },
    { key: "cards", label: "cards", color: LAB_NEON.magenta },
    { key: "keywords", label: "keywords", color: LAB_NEON.green },
  ]
  return (
    <div className="flex gap-1.5">
      {items.map((it) => {
        const active = it.key === tab
        return (
          <button
            key={it.key}
            type="button"
            onClick={() => setTab(it.key)}
            className={`border px-3 py-1 font-mono text-[10px] uppercase tracking-widest transition ${
              active
                ? "bg-white/10 text-white"
                : "text-white/50 hover:text-white"
            }`}
            style={{
              borderColor: active ? it.color : `${it.color}40`,
            }}
          >
            // {it.label}
          </button>
        )
      })}
    </div>
  )
}
