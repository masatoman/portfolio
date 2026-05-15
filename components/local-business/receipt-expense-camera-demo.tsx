"use client"

import { useMemo, useState } from "react"
import { Camera, Check, FileDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  formatYen,
  sampleReceipts,
  summarizeByCategory,
  totalAmount,
} from "@/lib/local-business/receipt-expense-camera"

export function ReceiptExpenseCameraDemo() {
  const [activeId, setActiveId] = useState(sampleReceipts[0].id)

  const active = useMemo(
    () => sampleReceipts.find((r) => r.id === activeId) ?? sampleReceipts[0],
    [activeId],
  )
  const summary = useMemo(() => summarizeByCategory(sampleReceipts), [])
  const total = useMemo(() => totalAmount(sampleReceipts), [])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-[24px] border border-[#fde68a] bg-[linear-gradient(180deg,#fffbeb,#ffffff)] p-6 shadow-[0_14px_40px_rgba(217,119,6,0.1)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#fde68a] text-[#b45309]">
              <Camera className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#071b49]">領収書を 撮るだけ</h2>
              <p className="text-sm font-bold text-[#5f6f89]">
                日付・ 金額・ 取引先 が 自動で 入力されます。
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-dashed border-[#fde68a] bg-white/70 p-6">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b45309]">
                受け取った 領収書
              </p>
            <div className="mt-3 space-y-2 font-mono text-sm font-bold text-[#33496d]">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#fde68a] px-2 py-0.5 text-xs text-[#b45309]">
                  店舗
                </span>
                <span>{active.raw.vendor}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#fde68a] px-2 py-0.5 text-xs text-[#b45309]">
                  日付
                </span>
                <span>{active.raw.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[#fde68a] px-2 py-0.5 text-xs text-[#b45309]">
                  金額
                </span>
                <span>{active.raw.amount}</span>
              </div>
            </div>
            <p className="mt-4 text-xs font-bold text-[#92400e]">
              ※ 紙の領収書ごとに 表記がバラバラ (¥/円, 2026-05-08/2026/5/8) でも 正しく 読み取ります。
            </p>
          </div>

          <div className="mt-4 rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#15803d]" />
              <span className="text-xs font-black text-[#15803d]">
                読み取り精度 {Math.round(active.ocrConfidence * 100)}%
              </span>
            </div>
          </div>

          <p className="mt-5 mb-2 text-xs font-black uppercase tracking-[0.2em] text-[#b45309]">
            領収書 サンプル (タップで切替)
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {sampleReceipts.map((r) => (
              <button
                type="button"
                key={r.id}
                onClick={() => setActiveId(r.id)}
                className={`rounded-xl border px-3 py-3 text-left transition ${
                  activeId === r.id
                    ? "border-[#b45309] bg-[#fde68a] text-[#b45309]"
                    : "border-[#fde68a] bg-white text-[#33496d] hover:border-[#b45309]"
                }`}
              >
                <p className="text-[10px] font-black uppercase tracking-wider opacity-70">
                  {r.category}
                </p>
                <p className="mt-1 truncate text-xs font-black">{r.vendor}</p>
                <p className="mt-1 font-mono text-xs font-black">{formatYen(r.amount)}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black text-[#071b49]">自動で 入力された 経費</h2>
              <p className="mt-1 text-sm font-bold text-[#5f6f89]">
                確認して 保存ボタン だけ 押せば 月末の集計に 入ります。
              </p>
            </div>
            <div className="grid h-9 w-9 place-items-center rounded-full bg-[#dcfce7] text-[#15803d]">
              <Check className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-4">
            <FormField label="日付" value={active.capturedAt.slice(0, 10)} />
            <FormField label="取引先" value={active.vendor} />
            <FormField label="金額" value={formatYen(active.amount)} emphasis />
            <FormField label="科目" value={active.category} />
            <FormField label="現場・案件" value={active.projectName} />
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="h-11 rounded-xl bg-[#d97706] px-5 text-sm font-black text-white hover:bg-[#b45309]">
              <Check className="h-4 w-4" />
              この内容で 保存
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl border-[#fde68a] bg-white px-5 text-sm font-black text-[#b45309] hover:bg-[#fffbeb]"
            >
              手で 修正する
            </Button>
          </div>
        </section>
      </div>

      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)] sm:p-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#071b49]">2026年 5月 の 集計</h3>
            <p className="mt-1 text-sm font-bold text-[#5f6f89]">
              ボタン1つで 月締めの 一覧を そのまま PDF / CSV に出せます。
            </p>
          </div>
          <Button
            variant="outline"
            className="h-10 rounded-xl border-[#d8e3f2] bg-white px-4 text-xs font-black text-[#071b49] hover:bg-[#f7faff]"
          >
            <FileDown className="h-4 w-4" />
            PDF で 出力
          </Button>
        </div>

        <div className="mt-5 rounded-2xl border border-[#fde68a] bg-[linear-gradient(135deg,#fffbeb,#ffffff_60%,#fef3c7)] p-5">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b45309]">
            合計 (5月分)
          </p>
          <p className="mt-1 text-3xl font-black tracking-tight text-[#071b49]">
            {formatYen(total)}
          </p>
          <p className="mt-1 text-xs font-bold text-[#5f6f89]">
            領収書 {sampleReceipts.length}枚
          </p>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {summary.map((s) => (
            <div
              key={s.category}
              className="rounded-2xl border border-[#d8e3f2] bg-white p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-xs font-black text-white"
                  style={{ background: s.swatch }}
                >
                  {s.category}
                </span>
                <span className="text-xs font-bold text-[#5f6f89]">{s.count}件</span>
              </div>
              <p className="mt-3 font-mono text-lg font-black text-[#071b49]">
                {formatYen(s.total)}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs font-bold leading-6 text-[#5a6680]">
          ※ 撮った領収書は 改ざん防止 つきで そのまま クラウドに 残ります。 電子帳簿保存法 (電帳法) の 保存要件にも 対応済み。
        </p>
      </section>
    </div>
  )
}

function FormField({
  label,
  value,
  emphasis = false,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="rounded-2xl border border-[#dde6f3] bg-[#f7faff] p-4">
      <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">
        <span>{label}</span>
        <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] text-[#15803d]">
          自動入力
        </span>
      </div>
      <p
        className={`mt-2 font-mono font-black text-[#071b49] ${
          emphasis ? "text-2xl" : "text-base"
        }`}
      >
        {value}
      </p>
    </div>
  )
}
