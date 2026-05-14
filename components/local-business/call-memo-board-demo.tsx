"use client"

import { useEffect, useMemo, useState } from "react"
import { PhoneCall, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  callMemoStorageKey,
  createCallMemoEntry,
  deserializeCallMemos,
  sampleCallMemos,
  serializeCallMemos,
  updateCallMemoStatus,
  type CallMemoEntry,
  type CallMemoStatus,
} from "@/lib/local-business/call-memo-board"

const statuses: CallMemoStatus[] = ["未対応", "対応中", "完了"]

const defaultForm = {
  client: "",
  dateTime: "2026-05-09T10:00",
  person: "",
  summary: "",
  nextAction: "",
}

export function CallMemoBoardDemo() {
  const [entries, setEntries] = useState<CallMemoEntry[]>(sampleCallMemos)
  const [form, setForm] = useState(defaultForm)

  useEffect(() => {
    const saved = window.localStorage.getItem(callMemoStorageKey)
    setEntries(deserializeCallMemos(saved))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(callMemoStorageKey, serializeCallMemos(entries))
  }, [entries])

  const statusCounts = useMemo(
    () => statuses.map((status) => ({ status, count: entries.filter((entry) => entry.status === status).length })),
    [entries],
  )

  function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextEntry = createCallMemoEntry({ ...form, status: "未対応" })
    setEntries((current) => [nextEntry, ...current])
    setForm(defaultForm)
  }

  function handleStatusChange(id: string, status: CallMemoStatus) {
    setEntries((current) => updateCallMemoStatus(current, id, status))
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
        <div className="mb-5 flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#eef6ff] text-[#2f6fb6]">
            <PhoneCall className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-[#071b49]">電話内容をそのまま整理する</h2>
            <p className="text-sm font-bold text-[#5f6f89]">言った言わないを減らすための、簡単な一次管理ボードです。</p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-2">
            <Label htmlFor="client" className="text-sm font-black text-[#071b49]">取引先</Label>
            <Input id="client" value={form.client} onChange={(event) => setForm((current) => ({ ...current, client: event.target.value }))} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="dateTime" className="text-sm font-black text-[#071b49]">日時</Label>
              <Input id="dateTime" type="datetime-local" value={form.dateTime} onChange={(event) => setForm((current) => ({ ...current, dateTime: event.target.value }))} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="person" className="text-sm font-black text-[#071b49]">担当者</Label>
              <Input id="person" value={form.person} onChange={(event) => setForm((current) => ({ ...current, person: event.target.value }))} required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary" className="text-sm font-black text-[#071b49]">要件</Label>
            <Textarea id="summary" value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="nextAction" className="text-sm font-black text-[#071b49]">次アクション</Label>
            <Textarea id="nextAction" value={form.nextAction} onChange={(event) => setForm((current) => ({ ...current, nextAction: event.target.value }))} required />
          </div>
          <Button type="submit" className="h-11 rounded-xl bg-[#f47b20] px-5 text-sm font-black text-white hover:bg-[#e36d15]">
            <PlusCircle className="h-4 w-4" />
            メモを追加
          </Button>
        </form>
      </section>

      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
        <div className="mb-5 flex flex-wrap gap-3">
          {statusCounts.map(({ status, count }) => (
            <div key={status} className="rounded-2xl bg-[#f9fbff] px-4 py-3">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">{status}</p>
              <p className="mt-1 text-lg font-black text-[#071b49]">{count}件</p>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-[20px] border border-[#d8e3f2] p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-[#071b49]">{entry.client}</h3>
                  <p className="mt-1 text-sm font-bold text-[#5f6f89]">{entry.person} / {entry.dateTime.replace("T", " ")}</p>
                </div>
                <div className="flex gap-2">
                  {statuses.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => handleStatusChange(entry.id, status)}
                      className={`rounded-full px-3 py-1 text-xs font-black transition ${
                        entry.status === status ? "bg-[#071b49] text-white" : "bg-[#eef6ff] text-[#2f6fb6]"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">要件</p>
                  <p className="mt-2 text-sm font-bold leading-7 text-[#31466b]">{entry.summary}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">次アクション</p>
                  <p className="mt-2 text-sm font-bold leading-7 text-[#31466b]">{entry.nextAction}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
