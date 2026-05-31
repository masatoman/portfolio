"use client"

import { useEffect, useMemo, useState } from "react"
import {
  expandQueries,
  getPerspectiveForDate,
  type ExpandedQuery,
} from "@/lib/lab-tools/issue-finder/queries"
import type {
  CollectionJob,
  PerspectiveRunStatus,
} from "@/lib/lab-tools/issue-finder/db"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import { BulkAdhocPaste } from "@/components/lab-tools/issue-finder/bulk-adhoc-paste"
import { AdhocFields } from "@/components/lab-tools/issue-finder/_partials/adhoc-fields"

const STATUS_LABEL: Record<CollectionJob["status"], string> = {
  pending: "待機中",
  processing: "実行中",
  completed: "完了",
  failed: "失敗",
}

const STATUS_COLOR: Record<CollectionJob["status"], string> = {
  pending: LAB_NEON.amber,
  processing: LAB_NEON.cyan,
  completed: LAB_NEON.green,
  failed: LAB_NEON.magenta,
}

type Props = {
  initialJobs: CollectionJob[]
  perspectiveStatus: PerspectiveRunStatus[]
}

export function CollectionQueueForm({
  initialJobs,
  perspectiveStatus,
}: Props) {
  const today = useMemo(() => new Date(), [])
  const todayInfo = useMemo(() => getPerspectiveForDate(today), [today])
  const allQueries = useMemo(() => expandQueries(), [])
  const statusMap = useMemo(() => {
    const m = new Map<string, PerspectiveRunStatus>()
    for (const s of perspectiveStatus) m.set(`${s.profileId}::${s.role}`, s)
    return m
  }, [perspectiveStatus])
  const unrunCount = useMemo(() => {
    return allQueries.filter((q) => {
      const s = statusMap.get(`${q.profileId}::${q.role}`)
      return !s || s.drRunCount + s.wsRunCount === 0
    }).length
  }, [allQueries, statusMap])

  const [selectedKey, setSelectedKey] = useState<string>(
    `${todayInfo.query.profileId}::${todayInfo.query.role}`,
  )
  const [samplingTarget, setSamplingTarget] = useState<number>(100)
  const [extraNotes, setExtraNotes] = useState<string>("")
  const [rawInputText, setRawInputText] = useState<string>("")

  // ad-hoc mode: ChatGPT 等の gap 推薦切り口を queries.json 編集なしで投入
  const [isAdhoc, setIsAdhoc] = useState(false)
  const [adhocProfileId, setAdhocProfileId] = useState<string>("komuten")
  const [adhocRole, setAdhocRole] = useState<string>("")
  const [adhocKeywords, setAdhocKeywords] = useState<string>("")
  const [adhocWatchedTools, setAdhocWatchedTools] = useState<string>("")
  const [adhocExamplePhrases, setAdhocExamplePhrases] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<{
    kind: "ok" | "err"
    msg: string
  } | null>(null)
  const [jobs, setJobs] = useState<CollectionJob[]>(initialJobs)

  const selectedQuery: ExpandedQuery = useMemo(() => {
    return (
      allQueries.find(
        (q) => `${q.profileId}::${q.role}` === selectedKey,
      ) ?? todayInfo.query
    )
  }, [selectedKey, allQueries, todayInfo])

  async function refreshJobs() {
    // egress 対策: 裏タブ (非表示) のときはポーリングしない
    if (typeof document !== "undefined" && document.hidden) return
    try {
      const res = await fetch("/api/lab-tools/issue-finder/jobs?limit=20", {
        cache: "no-store",
      })
      const body = (await res.json()) as { jobs?: CollectionJob[] }
      if (body.jobs) setJobs(body.jobs)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    // egress 対策: 30 秒ごとに jobs を再取得 (旧 5 秒 → 1/6 に削減)。
    // タブが前面に戻った瞬間にも 1 回だけ更新する。
    const id = setInterval(refreshJobs, 30_000)
    const onVisible = () => {
      if (!document.hidden) refreshJobs()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      clearInterval(id)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [])

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setFeedback(null)
    try {
      const trimmedRaw = rawInputText.trim()
      // ad-hoc 時はカンマ / 改行区切り → array
      const splitList = (s: string) =>
        s
          .split(/[,、\n]/)
          .map((x) => x.trim())
          .filter((x) => x.length > 0)
      const body: Record<string, unknown> = {
        samplingTarget,
        extraNotes: extraNotes.trim() || undefined,
        rawInputText: trimmedRaw.length > 0 ? trimmedRaw : undefined,
      }
      if (isAdhoc) {
        body.isAdhoc = true
        body.profileId = adhocProfileId
        body.role = adhocRole.trim() // API は role 必須なので custom_role と同じものをセット
        body.customRole = adhocRole.trim()
        body.customKeywords = splitList(adhocKeywords)
        body.customWatchedTools = splitList(adhocWatchedTools)
        body.customExamplePhrases = splitList(adhocExamplePhrases)
      } else {
        body.profileId = selectedQuery.profileId
        body.role = selectedQuery.role
      }
      const res = await fetch("/api/lab-tools/issue-finder/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      const resBody = (await res.json()) as {
        error?: string
        message?: string
        job?: CollectionJob
      }
      if (!res.ok) {
        setFeedback({
          kind: "err",
          msg: resBody.message ?? resBody.error ?? `失敗 (${res.status})`,
        })
      } else if (resBody.job) {
        const mode = resBody.job.hasRawInput ? "Deep Research 結果モード" : "web_search モード"
        setFeedback({
          kind: "ok",
          msg: `キューに追加しました (job ${resBody.job.id.slice(0, 8)}… / ${mode}) — Claude Code で /issue-finder process で処理`,
        })
        setExtraNotes("")
        setRawInputText("")
        if (isAdhoc) {
          setAdhocRole("")
          setAdhocKeywords("")
          setAdhocWatchedTools("")
          setAdhocExamplePhrases("")
        }
        await refreshJobs()
      }
    } catch (err) {
      setFeedback({
        kind: "err",
        msg: err instanceof Error ? err.message : "unknown",
      })
    } finally {
      // 3 秒クールダウン: 連打 / 二重投入を防ぐ (5/29 05:37 で 23 秒間隔の連続投入があった件の対策)
      window.setTimeout(() => setSubmitting(false), 3000)
    }
  }

  return (
    <div className="space-y-5">
      <BulkAdhocPaste onJobsCreated={refreshJobs} />

      <form
        onSubmit={onSubmit}
        className="border bg-black/30 p-4 sm:p-5 space-y-4"
        style={{ borderColor: `${LAB_NEON.cyan}40` }}
      >
        {/* ad-hoc モード toggle (ChatGPT 等の gap 推薦切り口を queries.json 編集なしで投入) */}
        <div
          className="flex items-center justify-between gap-3 border p-2"
          style={{
            borderColor: isAdhoc ? LAB_NEON.magenta : "#444",
            backgroundColor: isAdhoc ? `${LAB_NEON.magenta}10` : "transparent",
          }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span
              className="font-mono text-[10px] uppercase tracking-widest"
              style={{ color: isAdhoc ? LAB_NEON.magenta : "rgba(255,255,255,0.55)" }}
            >
              {isAdhoc ? "🔓 ad-hoc モード ON" : "🔒 既存 perspective モード"}
            </span>
            <span className="font-mono text-[10px] text-white/40 truncate">
              {isAdhoc
                ? "ChatGPT 等の gap 推薦切り口 (queries.json 未登録) を自由記入"
                : "queries.json 登録済 perspective から選ぶ"}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsAdhoc((v) => !v)}
            className="border px-2 py-1 font-mono text-[10px] uppercase tracking-widest hover:text-white"
            style={{
              borderColor: isAdhoc ? LAB_NEON.magenta : LAB_NEON.cyan,
              color: isAdhoc ? LAB_NEON.magenta : LAB_NEON.cyan,
            }}
            disabled={submitting}
          >
            {isAdhoc ? "→ 既存 mode へ" : "→ ad-hoc へ切替"}
          </button>
        </div>

        {isAdhoc ? (
          <AdhocFields
            profileId={adhocProfileId}
            setProfileId={setAdhocProfileId}
            role={adhocRole}
            setRole={setAdhocRole}
            keywords={adhocKeywords}
            setKeywords={setAdhocKeywords}
            watchedTools={adhocWatchedTools}
            setWatchedTools={setAdhocWatchedTools}
            examplePhrases={adhocExamplePhrases}
            setExamplePhrases={setAdhocExamplePhrases}
            samplingTarget={samplingTarget}
            setSamplingTarget={setSamplingTarget}
            disabled={submitting}
          />
        ) : (
        <div className="grid gap-3 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="mb-1.5 flex items-center justify-between gap-2 flex-wrap">
              <label
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: LAB_NEON.cyan }}
              >
                // perspective を選ぶ
              </label>
              {unrunCount > 0 && (
                <span
                  className="font-mono text-[10px] uppercase tracking-widest border px-2 py-0.5"
                  style={{
                    color: LAB_NEON.magenta,
                    borderColor: `${LAB_NEON.magenta}80`,
                  }}
                  title="DR/WS どちらも未実行の perspective 数"
                >
                  ✗ 未実行 {unrunCount} 件
                </span>
              )}
            </div>
            <select
              value={selectedKey}
              onChange={(e) => setSelectedKey(e.target.value)}
              className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
              style={{ borderColor: `${LAB_NEON.cyan}40` }}
              disabled={submitting}
            >
              {allQueries.map((q) => {
                const value = `${q.profileId}::${q.role}`
                const isToday =
                  q.profileId === todayInfo.query.profileId &&
                  q.role === todayInfo.query.role
                const status = statusMap.get(value)
                const dr = status?.drRunCount ?? 0
                const ws = status?.wsRunCount ?? 0
                const total = dr + ws
                const badge =
                  total === 0
                    ? "✗ 未"
                    : `DR ${dr} / WS ${ws}`
                const lastDate = status?.lastRunAt
                  ? ` (最終 ${status.lastRunAt.slice(5, 10).replace("-", "/")})`
                  : ""
                return (
                  <option key={value} value={value}>
                    {isToday ? "[今日] " : ""}
                    {badge}
                    {lastDate} | {q.profileName} → {q.role}
                  </option>
                )
              })}
            </select>
          </div>
          <div>
            <label
              className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest"
              style={{ color: LAB_NEON.cyan }}
            >
              // 目標件数
            </label>
            <input
              type="number"
              min={20}
              max={500}
              step={10}
              value={samplingTarget}
              onChange={(e) => {
                const n = Number.parseInt(e.target.value, 10)
                if (Number.isFinite(n)) setSamplingTarget(n)
              }}
              className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
              style={{ borderColor: `${LAB_NEON.cyan}40` }}
              disabled={submitting}
            />
          </div>
        </div>
        )}

        <div>
          <label
            className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.amber }}
          >
            // 追加メモ (任意・SKILL に渡される)
          </label>
          <textarea
            value={extraNotes}
            onChange={(e) => setExtraNotes(e.target.value)}
            rows={2}
            placeholder="例: andpad と Photoruction の比較スレッドが見つかれば優先 / 直近 6 ヶ月に絞って"
            className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
            style={{ borderColor: `${LAB_NEON.amber}40` }}
            disabled={submitting}
          />
        </div>

        <details className="group">
          <summary
            className="cursor-pointer font-mono text-[10px] uppercase tracking-widest hover:text-white"
            style={{ color: LAB_NEON.magenta }}
          >
            // Deep Research 結果を貼る (任意 / web_search 不要モード) {rawInputText.length > 0 && (
              <span style={{ color: LAB_NEON.green }}>
                ・ {rawInputText.length.toLocaleString()} 文字入力済み
              </span>
            )}
          </summary>
          <div className="mt-3 space-y-2">
            <p className="font-mono text-[10px] text-white/55 leading-relaxed">
              ChatGPT / Claude / Perplexity / Gemini の Deep Research 系で
              <br />
              <span style={{ color: LAB_NEON.cyan }}>
                {"// 03 / settings"}
              </span>{" "}
              のプロンプトを実行した結果を貼り付けると、{" "}
              <strong>SKILL は web_search を skip して この本文を直接クラスタリング</strong>{" "}
              します。 1 perspective で 100 件級の引用をまとめて投入できる。
            </p>
            <textarea
              value={rawInputText}
              onChange={(e) => setRawInputText(e.target.value)}
              rows={8}
              placeholder={
                "[001] 夜21時から事務所戻って写真台帳と日報を作る毎日。家に帰ると 23 時超え。\n出典: https://detail.chiebukuro.yahoo.co.jp/...\n日付: 2025-08\nタイプ: chiebukuro\n\n[002] ..."
              }
              className="w-full border bg-black/60 p-2 font-mono text-[12px] text-white/90 outline-none"
              style={{ borderColor: `${LAB_NEON.magenta}40` }}
              disabled={submitting}
            />
          </div>
        </details>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="border-2 px-4 py-2 font-bold uppercase tracking-widest text-sm transition hover:-translate-y-0.5 disabled:opacity-50"
            style={{
              borderColor: LAB_NEON.green,
              color: LAB_NEON.green,
              boxShadow: `0 0 12px ${LAB_NEON.green}40`,
            }}
          >
            {submitting ? "登録中..." : "// 収集をキューに追加"}
          </button>
          <span className="font-mono text-[10px] text-white/50">
            キーワード: {selectedQuery.keywords.slice(0, 4).join(" / ")}
            {selectedQuery.keywords.length > 4 && " ..."}
          </span>
        </div>

        {feedback && (
          <p
            className="font-mono text-[11px]"
            style={{
              color:
                feedback.kind === "ok" ? LAB_NEON.green : LAB_NEON.magenta,
            }}
          >
            // {feedback.msg}
          </p>
        )}
      </form>

      <details className="group">
        <summary className="mb-2 cursor-pointer font-mono text-[10px] uppercase tracking-widest text-white/60 hover:text-white">
          // recent jobs ({jobs.length}) — クリックで展開
        </summary>
        {jobs.length === 0 ? (
          <p className="font-mono text-[11px] text-white/40 border border-white/10 p-3">
            // ジョブはまだ登録されていません ・ Supabase 未設定の場合はここが空のままです
          </p>
        ) : (
          <ul className="space-y-1.5">
            {jobs.map((j) => (
              <JobRow key={j.id} job={j} />
            ))}
          </ul>
        )}
      </details>
    </div>
  )
}

function JobRow({ job }: { job: CollectionJob }) {
  const color = STATUS_COLOR[job.status]
  return (
    <li
      className="border bg-black/30 px-3 py-2 flex items-center gap-3 font-mono text-[11px]"
      style={{ borderColor: `${color}30` }}
    >
      <span
        className="shrink-0 w-16 text-center border px-1.5 py-0.5 uppercase tracking-widest text-[9px]"
        style={{ borderColor: `${color}80`, color }}
      >
        {STATUS_LABEL[job.status]}
      </span>
      {job.hasRawInput && (
        <span
          className="shrink-0 border px-1.5 py-0.5 uppercase tracking-widest text-[9px]"
          style={{
            borderColor: `${LAB_NEON.magenta}80`,
            color: LAB_NEON.magenta,
          }}
          title="Deep Research 結果を貼った web_search 不要モード"
        >
          DR
        </span>
      )}
      <span className="flex-1 min-w-0 truncate text-white/80">
        {job.profileId} / {job.role}
      </span>
      <span className="shrink-0 text-white/40">
        {job.samplingTarget} 件
      </span>
      {job.status === "completed" && (
        <span className="shrink-0 text-white/60">
          → {job.issuesCreated} クラスタ
        </span>
      )}
      <span className="shrink-0 text-white/30 w-32 text-right truncate">
        {new Date(job.createdAt).toLocaleString("ja-JP", {
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </span>
    </li>
  )
}

