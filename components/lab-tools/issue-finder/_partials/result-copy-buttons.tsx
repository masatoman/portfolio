"use client"

// 「📋 copy gap prompt」 と「// copy md」 の 2 つのコピーボタン。
// クリップボード書き込み → 2-2.5 秒間「copied」 表示するだけのシンプルな存在。

import { useState } from "react"
import { buildGapAnalysisPrompt } from "@/lib/lab-tools/issue-finder/gap-analysis-prompt"
import { buildHearingScriptPrompt } from "@/lib/lab-tools/issue-finder/hearing-script-prompt"
import { issuesToNotionMarkdown } from "@/lib/lab-tools/issue-finder/notion-markdown"
import type { Issue } from "@/lib/lab-tools/issue-finder/types"
import { LAB_NEON } from "@/lib/lab-tools/registry"

const KOMUTEN_GENBA_FOCUS = {
  profileId: "komuten" as const,
  role: "現場監督",
}

const KOMUTEN_GENBA_INTERVIEWEE =
  "友人 (現場監督)。 業界経験 5+ 年。 中堅工務店勤務。 30 代後半。 マサトマンとは古くからの友人で気軽に話せる関係。 SNS / X は使うが業界系の発信はしていない (= 公開情報には出てこない一次情報源)"

const TARGET_CUSTOMER =
  "工務店プロジェクト (軸 B) 主顧客 = 30-40 代アトツギ + 展示会層 + やる気層 + 儲かってる層 (年商 1-5 億規模)。 5/22 北原氏面談で確定。 60 代 IT 弱者層は『現状でいい層』 で動機ゼロなので避ける。"

const BUILDER_CONSTRAINT =
  "masatoman 1 人 / Claude Code + Next.js + Supabase / ¥0 開発 / 6 ヶ月以内に MVP / プラン C (友人不在前提、 6 経路並列ヒアリング)。"

// Gap-driven 次クエリ生成: 既存 issue 全件を AI に渡して「抜けている perspective × 痛み軸」 を
// 推薦させるプロンプトをコピー。 本書「犬の道」 = 同じ穴を掘り続けるリスク回避の仕組み。
export function CopyGapAnalysisButton({ issues }: { issues: Issue[] }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const prompt = buildGapAnalysisPrompt({
      issues,
      targetCustomer: TARGET_CUSTOMER,
      builderConstraint: BUILDER_CONSTRAINT,
      recommendCount: 8,
    })
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/70 transition hover:text-white"
      style={{
        borderColor: copied ? LAB_NEON.magenta : `${LAB_NEON.magenta}60`,
        backgroundColor: copied ? `${LAB_NEON.magenta}20` : "transparent",
        color: copied ? LAB_NEON.magenta : undefined,
      }}
      title={`全 ${issues.length} 件の既存 issue を渡し、 抜けている perspective × 痛み軸を 8 個推薦させるプロンプトをクリップボードへ。 ChatGPT/Claude/Perplexity 等に貼って → 提案を見て if_jobs に手動追加`}
    >
      📋 {copied ? `gap prompt copied!` : `copy gap prompt (${issues.length})`}
    </button>
  )
}

/** komuten/現場監督 に絞った gap 分析プロンプトをコピー (友人が現場監督なので) */
export function CopyKomutenGenbaGapButton({ issues }: { issues: Issue[] }) {
  const [copied, setCopied] = useState(false)
  const focusedCount = issues.filter(
    (i) =>
      i.profileId === KOMUTEN_GENBA_FOCUS.profileId &&
      i.role === KOMUTEN_GENBA_FOCUS.role,
  ).length

  const handleCopy = async () => {
    const prompt = buildGapAnalysisPrompt({
      issues,
      focus: KOMUTEN_GENBA_FOCUS,
      targetCustomer: TARGET_CUSTOMER,
      builderConstraint: BUILDER_CONSTRAINT,
      recommendCount: 8,
    })
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/70 transition hover:text-white"
      style={{
        borderColor: copied ? LAB_NEON.green : `${LAB_NEON.green}60`,
        backgroundColor: copied ? `${LAB_NEON.green}20` : "transparent",
        color: copied ? LAB_NEON.green : undefined,
      }}
      title={`komuten / 現場監督 に絞った gap 分析プロンプトをクリップボードへ。 友人 (現場監督) にぶつけられる切り口を 8 個推薦させる。 focus 対象 ${focusedCount} 件 + 全体参考 ${issues.length} 件`}
    >
      🏗️ {copied ? `komuten gap copied!` : `copy komuten 現場監督 gap (${focusedCount})`}
    </button>
  )
}

/** komuten/現場監督 に絞ったヒアリング質問リスト生成プロンプトをコピー (友人にぶつける用) */
export function CopyKomutenGenbaHearingButton({ issues }: { issues: Issue[] }) {
  const [copied, setCopied] = useState(false)
  const focusedCount = issues.filter(
    (i) =>
      i.profileId === KOMUTEN_GENBA_FOCUS.profileId &&
      i.role === KOMUTEN_GENBA_FOCUS.role,
  ).length

  const handleCopy = async () => {
    const prompt = buildHearingScriptPrompt({
      issues,
      focus: KOMUTEN_GENBA_FOCUS,
      intervieweeProfile: KOMUTEN_GENBA_INTERVIEWEE,
      durationMin: 60,
    })
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/70 transition hover:text-white"
      style={{
        borderColor: copied ? LAB_NEON.amber : `${LAB_NEON.amber}60`,
        backgroundColor: copied ? `${LAB_NEON.amber}20` : "transparent",
        color: copied ? LAB_NEON.amber : undefined,
      }}
      title={`komuten / 現場監督 ${focusedCount} 件の既存 issue を踏まえて、 友人 (現場監督) にぶつけられる質問 16-25 問を AI に生成させるプロンプトをクリップボードへ。 30-60 分のヒアリングで使える形式`}
    >
      🎤 {copied ? `hearing copied!` : `copy 現場監督ヒアリング質問 (${focusedCount})`}
    </button>
  )
}

/** 表示中の issue リストを Notion 用 Markdown に変換してコピー */
export function CopyMarkdownButton({ issues }: { issues: Issue[] }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const md = issuesToNotionMarkdown(issues)
    try {
      await navigator.clipboard.writeText(md)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="border px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white/70 transition hover:text-white"
      style={{
        borderColor: copied ? LAB_NEON.green : `${LAB_NEON.green}60`,
        backgroundColor: copied ? `${LAB_NEON.green}20` : "transparent",
      }}
      title={`表示中の ${issues.length} 件 (絞り込み反映後) を AI 入力用 Markdown に変換してクリップボードへ`}
    >
      // {copied ? `copied ${issues.length}!` : `copy md (${issues.length})`}
    </button>
  )
}
