"use client"

import { useEffect, useMemo, useState } from "react"
import { Mic, Square, FileText, Send, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  deserializeVoiceDailyReports,
  sampleVoiceDailyReports,
  serializeVoiceDailyReports,
  voiceDailyReportStorageKey,
  type VoiceDailyReportDraft,
} from "@/lib/local-business/voice-daily-report"

type RecordingState = "idle" | "recording" | "processing" | "done"

const sampleLabels: Record<string, string> = {
  "voice-001": "現場 A の状況 (打設後の段取り)",
  "voice-002": "協力会社の連絡と寸法確認",
  "voice-003": "建材の追加発注と施主確認",
}

export function VoiceDailyReportDemo() {
  const [drafts, setDrafts] = useState<VoiceDailyReportDraft[]>(sampleVoiceDailyReports)
  const [activeId, setActiveId] = useState<string>(sampleVoiceDailyReports[0].id)
  const [state, setState] = useState<RecordingState>("idle")
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const saved = window.localStorage.getItem(voiceDailyReportStorageKey)
    setDrafts(deserializeVoiceDailyReports(saved))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(voiceDailyReportStorageKey, serializeVoiceDailyReports(drafts))
  }, [drafts])

  useEffect(() => {
    if (state !== "recording") return
    const start = Date.now()
    const interval = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 250)
    return () => window.clearInterval(interval)
  }, [state])

  const active = useMemo(
    () => drafts.find((d) => d.id === activeId) ?? drafts[0],
    [drafts, activeId],
  )

  function handleStartRecording() {
    setElapsed(0)
    setState("recording")
  }

  function handleStopRecording() {
    setState("processing")
    window.setTimeout(() => {
      const next = drafts[Math.floor(Math.random() * drafts.length)]
      setActiveId(next.id)
      setState("done")
    }, 1400)
  }

  function handleReset() {
    setState("idle")
    setElapsed(0)
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e8fbf2] text-[#0e9d6a]">
            <Mic className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#071b49]">車の中で しゃべるだけ</h2>
            <p className="text-sm font-bold text-[#5f6f89]">
              帰り道に話した内容が、家に着く頃には日報になっています。
            </p>
          </div>
        </div>

        <div className="rounded-[20px] border border-[#dfeee6] bg-[linear-gradient(180deg,#f4fbf8,#ffffff)] p-6 text-center">
          {state === "idle" && (
            <>
              <p className="text-sm font-bold text-[#33496d]">
                押して 1日の振り返りを 自由にお話しください
              </p>
              <button
                type="button"
                onClick={handleStartRecording}
                aria-label="録音を開始"
                className="mx-auto mt-4 grid h-24 w-24 place-items-center rounded-full bg-[#0e9d6a] text-white shadow-[0_14px_40px_rgba(14,157,106,0.35)] transition hover:bg-[#0a8259]"
              >
                <Mic className="h-10 w-10" />
              </button>
              <p className="mt-4 text-xs font-bold text-[#5f6f89]">録音ボタン</p>
            </>
          )}
          {state === "recording" && (
            <>
              <p className="text-sm font-bold text-[#0a8259]">録音中…</p>
              <button
                type="button"
                onClick={handleStopRecording}
                aria-label="録音を停止"
                className="mx-auto mt-4 grid h-24 w-24 place-items-center rounded-full bg-[#dc2626] text-white shadow-[0_14px_40px_rgba(220,38,38,0.4)] transition hover:bg-[#b91c1c]"
              >
                <Square className="h-9 w-9" fill="currentColor" />
              </button>
              <p className="mt-4 font-mono text-2xl font-black text-[#071b49]">
                {Math.floor(elapsed / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(elapsed % 60).toString().padStart(2, "0")}
              </p>
              <p className="mt-2 text-xs font-bold text-[#5f6f89]">タップで 録音停止</p>
            </>
          )}
          {state === "processing" && (
            <>
              <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border-4 border-[#0e9d6a]/20 border-t-[#0e9d6a]" />
              <p className="mt-5 text-sm font-bold text-[#33496d]">
                話した内容を 日報に整えています…
              </p>
            </>
          )}
          {state === "done" && (
            <>
              <p className="text-sm font-bold text-[#0a8259]">日報ができました</p>
              <div className="mx-auto mt-4 grid h-24 w-24 place-items-center rounded-full bg-[#e8fbf2] text-[#0e9d6a]">
                <FileText className="h-10 w-10" />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="mt-5 h-10 rounded-xl border-[#cfeadc] bg-white px-4 text-xs font-black text-[#0a8259] hover:bg-[#e8fbf2]"
              >
                <RotateCcw className="h-4 w-4" />
                もう一度 録音する
              </Button>
            </>
          )}
        </div>

        <div className="mt-6">
          <p className="mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">
            録音の例 (タップで切替)
          </p>
          <div className="space-y-2">
            {drafts.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => {
                  setActiveId(d.id)
                  setState("done")
                }}
                className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  activeId === d.id
                    ? "border-[#0e9d6a] bg-[#e8fbf2] text-[#0a8259]"
                    : "border-[#d8e3f2] bg-white text-[#33496d] hover:border-[#cfeadc]"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="font-black">
                    {sampleLabels[d.id] ?? d.formatted.siteName}
                  </span>
                  <span className="font-mono text-xs font-bold text-[#5f6f89]">
                    {d.durationSec}秒
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-black text-[#071b49]">出来上がった 日報</h2>
            <p className="mt-1 text-sm font-bold text-[#5f6f89]">
              話した順番のままではなく、 大事なところを 5項目に整えます。
            </p>
          </div>
          <span className="rounded-full bg-[#eef6ff] px-3 py-1 text-xs font-black text-[#2f6fb6]">
            {active.recordedAt.replace("T", " ")}
          </span>
        </div>

        <div className="rounded-2xl border border-[#dde6f3] bg-[#f7faff] p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">
            話した内容 (そのまま)
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm font-bold leading-7 text-[#33496d]">
            「{active.rawTranscript}」
          </p>
        </div>

        <div className="mt-5 space-y-4 rounded-2xl border border-[#cfeadc] bg-[linear-gradient(180deg,#f4fbf8,#ffffff)] p-5">
          <ReportRow label="現場名" value={active.formatted.siteName} />
          <ReportRow label="今日の進捗" value={active.formatted.progress} />
          <ReportRow label="課題・不安" value={active.formatted.issues} tone="warn" />
          <ReportRow label="明日の段取り" value={active.formatted.tomorrow} tone="strong" />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button className="h-11 rounded-xl bg-[#0e9d6a] px-5 text-sm font-black text-white hover:bg-[#0a8259]">
            <Send className="h-4 w-4" />
            事務所に 送る
          </Button>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-[#cfeadc] bg-white px-5 text-sm font-black text-[#0a8259] hover:bg-[#e8fbf2]"
          >
            このまま 修正する
          </Button>
        </div>
      </section>
    </div>
  )
}

function ReportRow({
  label,
  value,
  tone = "default",
}: {
  label: string
  value: string
  tone?: "default" | "warn" | "strong"
}) {
  const valueClass =
    tone === "warn"
      ? "text-[#b9460a]"
      : tone === "strong"
        ? "text-[#0a8259]"
        : "text-[#071b49]"
  return (
    <div className="border-b border-dashed border-[#cfeadc] pb-3 last:border-b-0 last:pb-0">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">{label}</p>
      <p className={`mt-1 text-sm font-bold leading-7 ${valueClass}`}>{value}</p>
    </div>
  )
}
