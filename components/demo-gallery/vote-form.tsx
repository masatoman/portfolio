"use client"

import { useState } from "react"

type Demo = {
  number: number
  slug: string
  name: string
  oneLiner: string
  description: string
  hypothesis: string
  imagePath: string
  secondaryImagePath?: string
  orientation: "mobile" | "desktop"
}

const MAX_SELECTIONS = 3

const ROLES = [
  "現場監督",
  "工務店オーナー / 経営者",
  "工務店事務 / 経理",
  "大工 / 職人",
  "設計士 / 建築士",
  "施主 (お客様側)",
  "その他",
]

const REJECT_OPTIONS: { value: string; label: string }[] = [
  { value: "existing-tool-enough", label: "ANDPAD など既存のツールで間に合っている" },
  { value: "line-enough", label: "結局 LINE で足りてる" },
  { value: "fine-as-is", label: "今のやり方で十分" },
  { value: "pc-difficult", label: "パソコンが苦手" },
  { value: "input-burden", label: "入力するのが面倒" },
  { value: "no-input-time", label: "入力する時間がない" },
  { value: "boss-wont-adopt", label: "社長 / 会社が導入しない" },
  { value: "unusable-onsite", label: "現場で使える気がしない" },
  { value: "other", label: "その他 (コメント欄に記入)" },
]

const CONTACT_OPTIONS: { value: string; label: string; note: string }[] = [
  {
    value: "want-results",
    label: "投票結果を先に教えてほしい",
    note: "集計が落ち着いた頃に 1 回だけ連絡します",
  },
  {
    value: "want-test",
    label: "リリース前にテストしてみてもいい",
    note: "β 版ができたタイミングで案内します",
  },
  {
    value: "want-launch",
    label: "リリースしたら連絡してほしい",
    note: "本リリース時に 1 回だけ連絡します",
  },
]

export function DemoVoteForm({ demos }: { demos: Demo[] }) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [paidDemos, setPaidDemos] = useState<Set<string>>(new Set())
  const [voterRole, setVoterRole] = useState("")
  const [comment, setComment] = useState("")
  const [rejectReasons, setRejectReasons] = useState<Set<string>>(new Set())
  const [contactInterest, setContactInterest] = useState<Set<string>>(new Set())
  const [contactValue, setContactValue] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  async function copyUrl() {
    const url = "https://ihara-frontend.com/demo-gallery"
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = url
      ta.style.position = "fixed"
      ta.style.opacity = "0"
      document.body.appendChild(ta)
      ta.select()
      try {
        document.execCommand("copy")
      } finally {
        document.body.removeChild(ta)
      }
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lineShareText = `工務店の業務改善ツール、 「これあったら絶対使う」 を 1〜3 つ選ぶ投票ページです。 1〜2 分で済みます。\nhttps://ihara-frontend.com/demo-gallery`
  const lineShareUrl = `https://line.me/R/share?text=${encodeURIComponent(lineShareText)}`

  function toggleDemo(slug: string) {
    setError(null)
    const next = new Set(selected)
    if (next.has(slug)) {
      next.delete(slug)
      // 選択解除されたら paidDemos からも除外
      const nextPaid = new Set(paidDemos)
      nextPaid.delete(slug)
      setPaidDemos(nextPaid)
    } else if (next.size < MAX_SELECTIONS) {
      next.add(slug)
    } else {
      setError(`同時に選べるのは ${MAX_SELECTIONS} つまでです`)
      return
    }
    setSelected(next)
  }

  function togglePaid(slug: string) {
    if (!selected.has(slug)) return
    const next = new Set(paidDemos)
    if (next.has(slug)) {
      next.delete(slug)
    } else {
      next.add(slug)
    }
    setPaidDemos(next)
  }

  function toggleReject(value: string) {
    setError(null)
    const next = new Set(rejectReasons)
    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }
    setRejectReasons(next)
  }

  function toggleContact(value: string) {
    const next = new Set(contactInterest)
    if (next.has(value)) {
      next.delete(value)
    } else {
      next.add(value)
    }
    setContactInterest(next)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (selected.size === 0 && rejectReasons.size === 0) {
      setError("ツールを 1 つ以上選ぶか、 「全部いらない」 の理由を 1 つ以上選んでください")
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch("/api/demo-votes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          voter_name: null,
          voter_role: voterRole || null,
          selected_demos: Array.from(selected),
          paid_demos: Array.from(paidDemos),
          contact_interest: Array.from(contactInterest),
          contact_value: contactValue.trim() || null,
          reject_reasons: Array.from(rejectReasons),
          comment: comment.trim() || null,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message || data.error || "送信に失敗しました")
      }
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました")
    } finally {
      setSubmitting(false)
    }
  }

  function reset() {
    setSelected(new Set())
    setPaidDemos(new Set())
    setVoterRole("")
    setComment("")
    setRejectReasons(new Set())
    setContactInterest(new Set())
    setContactValue("")
    setSubmitted(false)
    setError(null)
  }

  if (submitted) {
    return (
      <section className="rounded-lg border border-gray-200 bg-gray-50 px-6 py-8 sm:px-8">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          ありがとうございました
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          いただいた意見を踏まえて、 実装の優先順位を決めます。 もしお知り合いの工務店関係者がいれば、 このページの URL を共有していただけると助かります。
        </p>

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-3">
          <a
            href={lineShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-[#06C755] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#05B048]"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M19.365 9.89c.50 0 .906.41.906.91 0 .5-.406.91-.906.91h-2.628v1.68h2.628c.5 0 .906.41.906.91 0 .5-.406.91-.906.91h-3.534a.91.91 0 0 1-.91-.91v-7.07c0-.5.41-.91.91-.91h3.534c.5 0 .906.41.906.91s-.406.91-.906.91h-2.628v1.86h2.628zm-5.405 4.42a.91.91 0 0 1-.91.91.93.93 0 0 1-.737-.36l-3.62-4.92v4.37a.91.91 0 0 1-.91.91.91.91 0 0 1-.91-.91v-7.07c0-.39.249-.74.617-.86a.74.74 0 0 1 .286-.05c.275 0 .56.13.74.36l3.63 4.93v-4.37c0-.5.41-.91.91-.91s.91.41.91.91v7.07h-.006zM7.31 14.31c0 .5-.41.91-.91.91s-.91-.41-.91-.91v-7.07c0-.5.41-.91.91-.91s.91.41.91.91v7.07zm-2.96 0c0 .5-.41.91-.91.91H.91A.91.91 0 0 1 0 14.31v-7.07c0-.5.41-.91.91-.91s.91.41.91.91v6.16h2.62c.5 0 .91.41.91.91M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.815 4.27 8.846 10.035 9.608.39.085.923.258 1.058.59.121.301.079.776.039 1.08l-.171 1.027c-.053.302-.241 1.186 1.039.647 1.281-.54 6.911-4.069 9.428-6.967C23.18 14.393 24 12.458 24 10.314"/>
            </svg>
            LINE で送る
          </a>
          <button
            type="button"
            onClick={copyUrl}
            className="inline-flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
          >
            {copied ? (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                コピーしました
              </>
            ) : (
              <>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2m-6 12h8a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2z" />
                </svg>
                URL をコピー
              </>
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-5 inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-50"
        >
          もう一度選び直す
        </button>
      </section>
    )
  }

  const remaining = MAX_SELECTIONS - selected.size

  return (
    <form onSubmit={handleSubmit} className="space-y-12">
      {/* 各デモ */}
      <section className="space-y-20">
        {demos.map((demo) => {
          const isSelected = selected.has(demo.slug)
          const isMaxed = selected.size >= MAX_SELECTIONS && !isSelected
          return (
            <article key={demo.slug}>
              <div className="mb-5 flex items-baseline gap-3">
                <span className="text-5xl font-semibold tracking-tight text-gray-300">
                  {String(demo.number).padStart(2, "0")}
                </span>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-gray-900">
                    {demo.name}
                  </h2>
                  <p className="mt-0.5 text-sm text-gray-500">
                    対応する課題: {demo.hypothesis}
                  </p>
                </div>
              </div>

              <p className="mb-4 text-base font-medium leading-7 text-gray-900">
                {demo.oneLiner}
              </p>
              <p className="mb-6 text-base leading-7 text-gray-600">
                {demo.description}
              </p>

              {/* 画像枠: モバイル UI = スマホ風枠 + 縦スクロール可能 (画像が縦長なら枠内でスクロール) */}
              {demo.orientation === "mobile" ? (
                <div className="flex justify-center items-start gap-4 sm:gap-6 bg-gray-100 rounded-lg border border-gray-200 py-6 sm:py-8 px-4 flex-wrap">
                  {[demo.imagePath, demo.secondaryImagePath].filter(Boolean).map((src, idx) => (
                    <div key={src} className="w-full max-w-[260px] flex flex-col items-center gap-2">
                      <div className="w-full max-h-[560px] overflow-y-auto overflow-x-hidden rounded-2xl border-4 border-gray-900 bg-gray-50 shadow-lg [scrollbar-width:thin]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src as string}
                          alt={`${demo.name} の UI モック ${idx === 0 ? "メイン" : "履歴"}`}
                          className="block w-full h-auto"
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-600">
                        {idx === 0 ? "メイン画面" : "履歴画面"}
                        <span className="ml-1 text-[10px] text-gray-400">↕ スクロール可</span>
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="aspect-[16/10] w-full relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-gray-400">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                    <span className="text-xs">画像生成待ち ({demo.slug}.png)</span>
                  </div>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={demo.imagePath}
                    alt={`${demo.name} の UI モック`}
                    className="absolute inset-0 h-full w-full object-contain bg-white"
                  />
                </div>
              )}

              {/* 投票チェックボックス */}
              <button
                type="button"
                onClick={() => toggleDemo(demo.slug)}
                disabled={isMaxed}
                className={`mt-4 flex w-full items-center justify-center gap-2 rounded-md border px-4 py-3 text-sm font-medium transition ${
                  isSelected
                    ? "border-gray-900 bg-gray-900 text-white"
                    : isMaxed
                    ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                    : "border-gray-300 bg-white text-gray-900 hover:bg-gray-50"
                }`}
              >
                {isSelected ? (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    選んだ — もう一度タップで取消
                  </>
                ) : isMaxed ? (
                  "上限 3 つに達しました"
                ) : (
                  "これ、 欲しい"
                )}
              </button>
            </article>
          )
        })}
      </section>

      {/* 送信フォーム */}
      <section className="rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
        <h2 className="text-xl font-semibold tracking-tight text-gray-900">
          選んだツールを送る
        </h2>
        <p className="mt-2 text-sm leading-6 text-gray-600">
          {selected.size === 0 && rejectReasons.size === 0 ? (
            <>気になるツールを <strong>最大 {MAX_SELECTIONS} つ</strong>選ぶか、 「全部いらない」 場合は下の理由欄から選んでください。</>
          ) : selected.size > 0 && selected.size < MAX_SELECTIONS ? (
            <>現在 <strong>{selected.size} つ</strong>選択中 (あと {remaining} つまで選べます)。</>
          ) : selected.size === MAX_SELECTIONS ? (
            <><strong>{selected.size} つ選択完了</strong>。 下のフォームを記入して送信してください。</>
          ) : (
            <><strong>「全部いらない」 として送信できます。</strong> 理由を {rejectReasons.size} つ選択中。</>
          )}
        </p>

        {/* 選択中のデモ (フォーム内で確認・取消可能) */}
        {selected.size > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500">
              選択中
            </p>
            <ul className="space-y-2">
              {demos
                .filter((d) => selected.has(d.slug))
                .map((d) => {
                  const isPaid = paidDemos.has(d.slug)
                  return (
                    <li
                      key={d.slug}
                      className="rounded-md border border-gray-900 bg-gray-900 px-3 py-2.5 text-sm text-white"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2 truncate">
                          <span className="text-xs text-gray-400 tabular-nums">
                            {String(d.number).padStart(2, "0")}
                          </span>
                          <span className="font-medium truncate">{d.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleDemo(d.slug)}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-white/70 transition hover:bg-white/10 hover:text-white"
                          aria-label={`${d.name} を取り消す`}
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      {/* WTP トグル */}
                      <button
                        type="button"
                        onClick={() => togglePaid(d.slug)}
                        className={`mt-2 flex w-full items-center justify-center gap-1.5 rounded px-2 py-1.5 text-xs font-medium transition ${
                          isPaid
                            ? "bg-white text-gray-900"
                            : "border border-white/20 text-white/70 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <svg
                              className="h-3.5 w-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2.5"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            有料でも使いたい
                          </>
                        ) : (
                          "有料でも使いたい? (任意)"
                        )}
                      </button>
                    </li>
                  )
                })}
            </ul>
          </div>
        )}

        {/* 「全部いらない」 拒否理由 (投票 0 件の場合のみ表示) */}
        {selected.size === 0 && (
          <div className="mt-5 rounded-md border border-amber-200 bg-amber-50 p-4">
            <p className="mb-3 text-sm font-medium text-gray-900">
              「全部いらない」 場合は、 理由を 1 つ以上選んでください
            </p>
            <p className="mb-3 text-xs leading-5 text-gray-600">
              ピンとくるものが無くても OK。 「なぜ刺さらなかったか」 が一番ありがたい情報です。
            </p>
            <ul className="space-y-2">
              {REJECT_OPTIONS.map((opt) => {
                const isChecked = rejectReasons.has(opt.value)
                return (
                  <li key={opt.value}>
                    <label className="flex cursor-pointer items-center gap-2.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition hover:border-gray-400">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleReject(opt.value)}
                        className="h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span>{opt.label}</span>
                    </label>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        {/* 未選択から追加 (3 つ未満の場合のみ表示) */}
        {selected.size < MAX_SELECTIONS && (
          <details className="mt-4 group">
            <summary className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-700 transition hover:text-gray-900">
              <svg
                className="h-4 w-4 transition group-open:rotate-90"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
              {selected.size === 0
                ? `候補から選んで追加 (${demos.length} 件)`
                : `あと ${remaining} つまで追加可能`}
            </summary>
            <ul className="mt-3 space-y-2">
              {demos
                .filter((d) => !selected.has(d.slug))
                .map((d) => (
                  <li key={d.slug}>
                    <button
                      type="button"
                      onClick={() => toggleDemo(d.slug)}
                      className="flex w-full items-center justify-between gap-3 rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 transition hover:border-gray-400 hover:bg-gray-50"
                    >
                      <span className="flex items-center gap-2 truncate text-left">
                        <span className="text-xs text-gray-400 tabular-nums">
                          {String(d.number).padStart(2, "0")}
                        </span>
                        <span className="font-medium truncate">{d.name}</span>
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-gray-700">
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
            </ul>
          </details>
        )}

        <div className="mt-6 space-y-5">
          {/* 役職 (任意) */}
          <div>
            <label htmlFor="voter_role" className="mb-1 block text-sm font-medium text-gray-900">
              お立場 / 役職 <span className="ml-1 text-xs font-normal text-gray-500">(任意)</span>
            </label>
            <p className="mb-1.5 text-xs text-gray-500">
              役職によって「欲しいツール」 の傾向が違うので、 教えてもらえると優先順位の判断に使えます。
            </p>
            <select
              id="voter_role"
              value={voterRole}
              onChange={(e) => setVoterRole(e.target.value)}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              <option value="">— 答えなくても OK —</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* コメント */}
          <div>
            <label htmlFor="comment" className="mb-1.5 block text-sm font-medium text-gray-900">
              コメント (任意)
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="例: 「現場写真の整理が特に欲しい」 「みつも郎との連携があれば最高」 「いま自分はこうしてる」 など"
              rows={4}
              maxLength={1000}
              className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
          </div>

          {/* 継続接触 (任意) */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-gray-900">
              結果や進捗を受け取りたい方へ <span className="ml-1 text-xs font-normal text-gray-500">(任意)</span>
            </p>
            <p className="mb-2.5 text-xs leading-5 text-gray-500">
              チェックすると、 投票結果・テスト・リリース時に連絡できるようになります。
            </p>
            <ul className="space-y-2">
              {CONTACT_OPTIONS.map((opt) => {
                const isChecked = contactInterest.has(opt.value)
                return (
                  <li key={opt.value}>
                    <label className="flex cursor-pointer items-start gap-2.5 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 transition hover:border-gray-400">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleContact(opt.value)}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                      />
                      <span className="flex-1">
                        <span className="block">{opt.label}</span>
                        <span className="mt-0.5 block text-[11px] text-gray-500">
                          {opt.note}
                        </span>
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>
            {contactInterest.size > 0 && (
              <div className="mt-3">
                <label htmlFor="contact_value" className="mb-1 block text-xs font-medium text-gray-700">
                  LINE ID または メールアドレス
                </label>
                <input
                  id="contact_value"
                  type="text"
                  value={contactValue}
                  onChange={(e) => setContactValue(e.target.value)}
                  placeholder="例: yamada@example.com / LINE: @abc123"
                  maxLength={200}
                  className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <p className="mt-1 text-xs text-gray-500">
                  ※ 上のチェック内容以外で連絡することはありません。 勧誘や営業電話には一切使いません。 連絡先は masatoman 本人のみ参照、 第三者に共有しません。
                </p>
              </div>
            )}
          </div>

          {/* エラー */}
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
              {error}
            </div>
          )}

          {/* 送信ボタン */}
          <button
            type="submit"
            disabled={submitting || (selected.size === 0 && rejectReasons.size === 0)}
            className="inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {submitting
              ? "送信中…"
              : selected.size > 0
              ? `${selected.size} 件で送信する`
              : rejectReasons.size > 0
              ? `「全部いらない」 で送信する`
              : "ツールを選ぶか、 「全部いらない」 理由を選んでください"}
          </button>
        </div>
      </section>
    </form>
  )
}
