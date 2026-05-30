"use client"

import { useState } from "react"
import {
  parseChatGPTGapResult,
  type ParsedRecommendation,
} from "@/lib/lab-tools/issue-finder/gap-result-parser"
import { LAB_NEON } from "@/lib/lab-tools/registry"

// ChatGPT 等の gap 分析結果 markdown を textarea 1 つに貼り付け → パース →
// プレビューでチェック → 一括 if_jobs 登録。
// ad-hoc モード使用 (queries.json 未登録 role なので)。

type Props = {
  onJobsCreated?: () => void
}

const PROFILE_OPTIONS = [
  { id: "komuten", label: "🏗️ 工務店" },
  { id: "financial-planner", label: "💼 FP" },
  { id: "it-subsidy", label: "💴 IT 補助金" },
  { id: "micro-corp", label: "🏢 マイクロ法人" },
]

type EditableRow = ParsedRecommendation & {
  selected: boolean
  /** ユーザーが手で profileId を override した場合に使う */
  overrideProfileId: string
  samplingTarget: number
}

export function BulkAdhocPaste({ onJobsCreated }: Props) {
  const [markdown, setMarkdown] = useState("")
  const [rows, setRows] = useState<EditableRow[]>([])
  const [parseError, setParseError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    kind: "ok" | "err"
    msg: string
  } | null>(null)

  function handleParse() {
    setParseError(null)
    setFeedback(null)
    if (!markdown.trim()) {
      setParseError("ChatGPT の出力を貼ってからパースしてください")
      setRows([])
      return
    }
    const parsed = parseChatGPTGapResult(markdown)
    if (parsed.length === 0) {
      setParseError(
        "推薦見出し (### #1. ... 形式) が見つかりませんでした。 ChatGPT の出力フォーマットを確認してください",
      )
      setRows([])
      return
    }
    const editable: EditableRow[] = parsed.map((p) => ({
      ...p,
      selected: p.profileId !== "unknown",
      overrideProfileId:
        p.profileId === "unknown" ? "komuten" : p.profileId,
      samplingTarget: 100,
    }))
    setRows(editable)
  }

  async function handleBulkSubmit() {
    const selected = rows.filter((r) => r.selected)
    if (selected.length === 0) {
      setFeedback({ kind: "err", msg: "選択された推薦がありません" })
      return
    }
    setSubmitting(true)
    setFeedback(null)
    let okCount = 0
    let errCount = 0
    const errMsgs: string[] = []
    for (const r of selected) {
      try {
        const res = await fetch("/api/lab-tools/issue-finder/jobs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            profileId: r.overrideProfileId,
            role: r.role,
            samplingTarget: r.samplingTarget,
            isAdhoc: true,
            customRole: r.role,
            customKeywords: r.keywords,
            customExamplePhrases: [],
            customWatchedTools: [],
            extraNotes: [
              r.aimNote ? `狙い: ${r.aimNote}` : "",
              r.devilsAdvocateNote
                ? `Devil's Advocate: ${r.devilsAdvocateNote}`
                : "",
              r.preferredMedia.length > 0
                ? `優先媒体: ${r.preferredMedia.join(" / ")}`
                : "",
              r.essentialChoice !== null
                ? `事前見立て E=${r.essentialChoice} H=${r.hypothesisDepth} A=${r.answerable}`
                : "",
            ]
              .filter((x) => x.length > 0)
              .join("\n"),
          }),
        })
        if (!res.ok) {
          const body = (await res.json().catch(() => ({}))) as {
            message?: string
            error?: string
          }
          errCount += 1
          errMsgs.push(`#${r.index}: ${body.message ?? body.error ?? res.status}`)
        } else {
          okCount += 1
        }
      } catch (err) {
        errCount += 1
        errMsgs.push(
          `#${r.index}: ${err instanceof Error ? err.message : "unknown"}`,
        )
      }
    }
    // 3 秒クールダウン: 連打防止
    window.setTimeout(() => setSubmitting(false), 3000)
    if (errCount === 0) {
      setFeedback({
        kind: "ok",
        msg: `${okCount} 件登録完了 — Claude Code で /issue-finder process で順次処理`,
      })
      setMarkdown("")
      setRows([])
    } else {
      setFeedback({
        kind: "err",
        msg: `${okCount} 件 OK / ${errCount} 件 失敗: ${errMsgs.slice(0, 3).join(" / ")}`,
      })
    }
    onJobsCreated?.()
  }

  function toggleAll(value: boolean) {
    setRows((cur) => cur.map((r) => ({ ...r, selected: value })))
  }

  function updateRow<K extends keyof EditableRow>(
    index: number,
    key: K,
    value: EditableRow[K],
  ) {
    setRows((cur) =>
      cur.map((r) => (r.index === index ? { ...r, [key]: value } : r)),
    )
  }

  const selectedCount = rows.filter((r) => r.selected).length

  return (
    <div
      className="space-y-3 border p-3 sm:p-4"
      style={{ borderColor: `${LAB_NEON.magenta}40` }}
    >
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: LAB_NEON.magenta }}
        >
          📥 ChatGPT 等の gap 推薦結果を一発貼り付けで登録
        </span>
        {rows.length > 0 && (
          <span className="font-mono text-[10px] text-white/55">
            パース済 {rows.length} 件 / 選択 {selectedCount} 件
          </span>
        )}
      </div>

      <textarea
        value={markdown}
        onChange={(e) => setMarkdown(e.target.value)}
        rows={6}
        placeholder={`# Gap 分析結果

## 1. 既存収集の偏り
...

## 2. 推薦する次クエリ 8 個

### #1. komuten / アトツギ本人 (35-45歳・継承中)

- **狙い**: ...
- **事前見立て**: E=30 / H=25 / A=55
- **入り口キーワード**: 「アトツギ つらい」「二代目 社長 孤独」「親父 やり方 古い」...
- **優先媒体**: note, X, ...
- **Devil's Advocate要素**: ...

### #2. komuten / 経理担当の妻
...`}
        className="w-full border bg-black/60 p-2 font-mono text-xs text-white outline-none"
        style={{ borderColor: `${LAB_NEON.magenta}30` }}
        disabled={submitting}
      />

      <div className="flex gap-2 flex-wrap">
        <button
          type="button"
          onClick={handleParse}
          disabled={submitting || markdown.trim().length === 0}
          className="border px-3 py-1.5 font-mono text-xs uppercase tracking-widest hover:text-white disabled:opacity-40"
          style={{
            borderColor: LAB_NEON.magenta,
            color: LAB_NEON.magenta,
          }}
        >
          🔍 パースしてプレビュー
        </button>
        {rows.length > 0 && (
          <>
            <button
              type="button"
              onClick={() => toggleAll(true)}
              className="border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/55 hover:text-white"
              style={{ borderColor: "#666" }}
            >
              全選択
            </button>
            <button
              type="button"
              onClick={() => toggleAll(false)}
              className="border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/55 hover:text-white"
              style={{ borderColor: "#666" }}
            >
              全解除
            </button>
            <button
              type="button"
              onClick={handleBulkSubmit}
              disabled={submitting || selectedCount === 0}
              className="border-2 px-3 py-1.5 font-bold font-mono text-xs uppercase tracking-widest disabled:opacity-40"
              style={{
                borderColor: LAB_NEON.green,
                color: LAB_NEON.green,
                boxShadow: `0 0 8px ${LAB_NEON.green}40`,
              }}
            >
              {submitting
                ? "送信中..."
                : `📤 選択した ${selectedCount} 件をキュー登録`}
            </button>
          </>
        )}
      </div>

      {parseError && (
        <p
          className="font-mono text-[11px]"
          style={{ color: LAB_NEON.magenta }}
        >
          ⚠ {parseError}
        </p>
      )}
      {feedback && (
        <p
          className="font-mono text-[11px]"
          style={{
            color: feedback.kind === "ok" ? LAB_NEON.green : LAB_NEON.magenta,
          }}
        >
          {feedback.kind === "ok" ? "✓ " : "⚠ "}
          {feedback.msg}
        </p>
      )}

      {rows.length > 0 && (
        <div className="border border-white/10 overflow-x-auto">
          <table className="w-full font-mono text-[11px] text-white/75">
            <thead className="bg-black/60 text-white/55">
              <tr>
                <th className="p-1.5 text-left">✓</th>
                <th className="p-1.5 text-left">#</th>
                <th className="p-1.5 text-left">profile</th>
                <th className="p-1.5 text-left">role (自由記入)</th>
                <th className="p-1.5 text-left">keywords (件)</th>
                <th className="p-1.5 text-left">E / H / A</th>
                <th className="p-1.5 text-left">件数</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.index}
                  className="border-t border-white/5"
                  style={{
                    opacity: r.selected ? 1 : 0.45,
                  }}
                >
                  <td className="p-1.5 align-top">
                    <input
                      type="checkbox"
                      checked={r.selected}
                      onChange={(e) =>
                        updateRow(r.index, "selected", e.target.checked)
                      }
                      disabled={submitting}
                    />
                  </td>
                  <td className="p-1.5 align-top text-white/55">{r.index}</td>
                  <td className="p-1.5 align-top">
                    <select
                      value={r.overrideProfileId}
                      onChange={(e) =>
                        updateRow(r.index, "overrideProfileId", e.target.value)
                      }
                      className="border bg-black/60 px-1 py-0.5 text-[10px] text-white outline-none"
                      style={{ borderColor: "#555" }}
                      disabled={submitting}
                    >
                      {PROFILE_OPTIONS.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                    {r.profileId === "unknown" && (
                      <span
                        className="ml-1 text-[9px]"
                        style={{ color: LAB_NEON.amber }}
                        title="ヘッダから profile を推定できなかった。 手で選んでください"
                      >
                        ?
                      </span>
                    )}
                  </td>
                  <td className="p-1.5 align-top max-w-xs">
                    <input
                      type="text"
                      value={r.role}
                      onChange={(e) => updateRow(r.index, "role", e.target.value)}
                      className="w-full border bg-black/60 px-1 py-0.5 text-[10px] text-white outline-none"
                      style={{ borderColor: "#555" }}
                      disabled={submitting}
                    />
                  </td>
                  <td className="p-1.5 align-top">
                    <span title={r.keywords.join(" / ")}>
                      {r.keywords.length}
                    </span>
                  </td>
                  <td className="p-1.5 align-top text-white/60 whitespace-nowrap">
                    {r.essentialChoice ?? "-"}/{r.hypothesisDepth ?? "-"}/
                    {r.answerable ?? "-"}
                  </td>
                  <td className="p-1.5 align-top">
                    <input
                      type="number"
                      min={20}
                      max={500}
                      step={10}
                      value={r.samplingTarget}
                      onChange={(e) => {
                        const n = Number.parseInt(e.target.value, 10)
                        if (Number.isFinite(n))
                          updateRow(r.index, "samplingTarget", n)
                      }}
                      className="w-16 border bg-black/60 px-1 py-0.5 text-[10px] text-white outline-none"
                      style={{ borderColor: "#555" }}
                      disabled={submitting}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="font-mono text-[10px] text-white/40 leading-relaxed">
        ※ パースした各推薦は ad-hoc モードで登録されます。
        ChatGPT 出力の <code>狙い / Devil's Advocate / 優先媒体 / 事前見立て</code> は
        extra_notes に自動保存。 keywords が空の行は登録時にエラーになります。
      </p>
    </div>
  )
}
