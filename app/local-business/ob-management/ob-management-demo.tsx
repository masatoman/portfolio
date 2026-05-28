"use client"

import { useMemo, useState } from "react"
import {
  Users,
  TrendingUp,
  Calendar,
  Phone,
  MessageCircle,
  History,
  Sparkles,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Home as HomeIcon,
} from "lucide-react"
import {
  ALL_OB_CUSTOMERS,
  calculateApproachScore,
  formatJapaneseDate,
  formatJapaneseYearMonth,
  formatYen,
  predictNextReform,
  topApproachCandidates,
  yearsSinceConstruction,
  type OBCustomer,
  type PredictedReform,
} from "./ob-data"

type EnrichedOB = OBCustomer & {
  score: number
  reform: PredictedReform
  yearsPassed: number
}

export function OBManagementDemo() {
  // 全 OB を score 付きで enrich
  const enriched: EnrichedOB[] = useMemo(
    () =>
      ALL_OB_CUSTOMERS.map((c) => ({
        ...c,
        score: calculateApproachScore(c),
        reform: predictNextReform(c),
        yearsPassed: yearsSinceConstruction(c.constructionDate),
      })),
    [],
  )

  // ダッシュボード = 築 10 年以降のみを score 順 上位 10
  const dashboardTop: EnrichedOB[] = useMemo(() => {
    const matured = enriched.filter((c) => c.yearsPassed >= 10)
    return [...matured].sort((a, b) => b.score - a.score).slice(0, 10)
  }, [enriched])

  // アプローチ自動化シミュレーション = 推奨度 上位 5 件 (LINE OK のみ)
  const approachQueue = useMemo(
    () =>
      topApproachCandidates(ALL_OB_CUSTOMERS, 10)
        .filter((c) => c.lineEnabled)
        .slice(0, 5),
    [],
  )

  // 統計値 ----------
  const stats = useMemo(() => {
    const total = enriched.length
    const matured = enriched.filter((c) => c.yearsPassed >= 10).length
    const inWindow = enriched.filter((c) => c.reform.daysUntilFrom <= 365).length
    const lineEnabled = enriched.filter((c) => c.lineEnabled).length
    const estPotential = enriched
      .filter((c) => c.yearsPassed >= 10)
      .reduce((sum) => sum + 1_500_000, 0) // OB 1 件 = リフォーム期待値 ¥150 万 想定
    return { total, matured, inWindow, lineEnabled, estPotential }
  }, [enriched])

  const [selected, setSelected] = useState<EnrichedOB | null>(null)
  const [previewTarget, setPreviewTarget] = useState<EnrichedOB | null>(null)

  return (
    <div className="space-y-8">
      {/* 統計サマリ */}
      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<Users className="h-4 w-4" />}
          label="OB 顧客 総数"
          value={`${stats.total} 件`}
          sub={`過去 10 年 + α の名簿`}
          accent="#0e7490"
        />
        <StatCard
          icon={<HomeIcon className="h-4 w-4" />}
          label="築 10 年以降"
          value={`${stats.matured} 件`}
          sub={`= リフォーム機会 対象`}
          accent="#b45309"
        />
        <StatCard
          icon={<Calendar className="h-4 w-4" />}
          label="1 年以内 アプローチ推奨"
          value={`${stats.inWindow} 件`}
          sub={`時期入りまたは間近`}
          accent="#dc2626"
        />
        <StatCard
          icon={<TrendingUp className="h-4 w-4" />}
          label="リフォーム期待 売上"
          value={`${Math.round(stats.estPotential / 10_000)} 万円`}
          sub={`OB × 想定 ¥150 万`}
          accent="#0e7490"
        />
      </section>

      {/* ダッシュボード: アプローチ推奨 上位 10 */}
      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)] sm:p-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#071b49]">
              <Sparkles className="mr-2 inline-block h-4 w-4 text-[#b45309]" />
              アプローチ推奨度 ダッシュボード
            </h3>
            <p className="mt-2 text-sm font-bold text-[#5f6f89]">
              築 10 年以降の OB 顧客を 「次に動くべき順」 で 並べました。 親方の頭の中の名簿が ダッシュボード化されます。
            </p>
          </div>
          <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-black text-[#b45309]">
            上位 {dashboardTop.length} 件 表示
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#d8e3f2] text-xs font-black uppercase tracking-wider text-[#5f6f89]">
                <th className="py-3 pr-3">推奨度</th>
                <th className="py-3 pr-3">OB 顧客</th>
                <th className="py-3 pr-3">エリア</th>
                <th className="py-3 pr-3">工事日 / 経過</th>
                <th className="py-3 pr-3">推定 リフォーム期</th>
                <th className="py-3 pr-3">最終アプローチ</th>
                <th className="py-3 pr-3"></th>
              </tr>
            </thead>
            <tbody>
              {dashboardTop.map((c, i) => (
                <tr
                  key={c.id}
                  className="border-b border-[#eef2f7] transition hover:bg-[#fafbfd]"
                >
                  <td className="py-3 pr-3">
                    <ScoreBadge score={c.score} rank={i + 1} />
                  </td>
                  <td className="py-3 pr-3 font-bold text-[#071b49]">
                    <div>{c.name}</div>
                    <div className="text-xs font-bold text-[#5f6f89]">
                      工事 {formatYen(c.constructionAmount)}
                      {c.lineEnabled && (
                        <span className="ml-2 rounded-full bg-[#dcfce7] px-2 py-0.5 text-[10px] font-black text-[#166534]">
                          LINE OK
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-xs font-bold text-[#33496d]">{c.area}</td>
                  <td className="py-3 pr-3 text-xs font-bold text-[#33496d]">
                    <div>{formatJapaneseDate(c.constructionDate)}</div>
                    <div className="text-[#b45309]">築 {c.yearsPassed} 年</div>
                  </td>
                  <td className="py-3 pr-3 text-xs font-bold text-[#33496d]">
                    <div className="text-[#071b49]">{c.reform.label}</div>
                    <div>
                      {formatJapaneseYearMonth(c.reform.windowFrom)} 〜{" "}
                      {formatJapaneseYearMonth(c.reform.windowTo)}
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-xs font-bold text-[#5f6f89]">
                    {c.approachHistory.length === 0 ? (
                      <span className="text-[#dc2626]">未接触</span>
                    ) : (
                      <>
                        <div>
                          {formatJapaneseDate(
                            c.approachHistory[c.approachHistory.length - 1]!.date,
                          )}
                        </div>
                        <div>
                          {c.approachHistory[c.approachHistory.length - 1]!.channel} /{" "}
                          {c.approachHistory[c.approachHistory.length - 1]!.outcome}
                        </div>
                      </>
                    )}
                  </td>
                  <td className="py-3 pr-3">
                    <button
                      type="button"
                      onClick={() => setSelected(c)}
                      className="rounded-md border border-[#d8e3f2] bg-white px-3 py-1.5 text-xs font-black text-[#0e7490] transition hover:bg-[#ecfeff]"
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* アプローチ自動化シミュレーション */}
      <section className="rounded-[24px] border border-[#bae6fd] bg-[linear-gradient(135deg,#ecfeff,#f0f9ff_50%,#ffffff)] p-6 shadow-[0_14px_40px_rgba(7,27,73,0.06)] sm:p-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <h3 className="text-xl font-black text-[#071b49]">
              <Send className="mr-2 inline-block h-4 w-4 text-[#0e7490]" />
              次回 連絡候補 (自動生成)
            </h3>
            <p className="mt-2 text-sm font-bold text-[#33496d]">
              アプローチ推奨度 上位 + LINE OK な 5 件を 自動で抽出。 タップで 個別の LINE 文面が プレビューできます。
            </p>
          </div>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-[#0e7490] shadow-sm">
            自動キュー {approachQueue.length} 件
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {approachQueue.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-[#bae6fd] bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-[#0e7490]">
                    {c.area}
                  </p>
                  <p className="mt-1 text-base font-black text-[#071b49]">{c.name}</p>
                </div>
                <ScoreBadge
                  score={calculateApproachScore(c)}
                  rank={approachQueue.indexOf(c) + 1}
                  small
                />
              </div>

              <p className="mt-3 text-xs font-bold leading-6 text-[#5f6f89]">
                工事 {formatJapaneseDate(c.constructionDate)} ({c.constructionType})
              </p>
              <p className="mt-1 text-xs font-bold text-[#5f6f89]">
                推定 {c.reform.label}
              </p>
              <p className="mt-1 text-xs font-black text-[#b45309]">
                {formatJapaneseYearMonth(c.reform.windowFrom)} 以降
              </p>

              <button
                type="button"
                onClick={() => setPreviewTarget({
                  ...c,
                  yearsPassed: yearsSinceConstruction(c.constructionDate),
                  score: calculateApproachScore(c),
                  reform: c.reform,
                })}
                className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#0e7490] px-3 py-2 text-xs font-black text-white transition hover:bg-[#155e75]"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                LINE 文面 を 確認
              </button>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs font-bold text-[#5f6f89]">
          ※ このデモでは 実際の送信は行いません。 LINE プレビューのみ表示します。 本番環境では LINE 公式アカウント API 連携で 1 タップ送信になります。
        </p>
      </section>

      {/* 顧客詳細 モーダル */}
      {selected && <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} />}

      {/* LINE プレビュー モーダル */}
      {previewTarget && (
        <LineMessagePreviewModal
          customer={previewTarget}
          onClose={() => setPreviewTarget(null)}
        />
      )}
    </div>
  )
}

// ========== サブコンポーネント ==========

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  accent: string
}) {
  return (
    <div className="rounded-2xl border border-[#d8e3f2] bg-white p-5 shadow-[0_8px_24px_rgba(7,27,73,0.05)]">
      <div className="flex items-center gap-2">
        <span
          className="grid h-7 w-7 place-items-center rounded-full text-white"
          style={{ background: accent }}
        >
          {icon}
        </span>
        <p className="text-xs font-black uppercase tracking-[0.15em] text-[#5f6f89]">
          {label}
        </p>
      </div>
      <p className="mt-3 text-2xl font-black tracking-tight text-[#071b49]">{value}</p>
      <p className="mt-1 text-xs font-bold text-[#5f6f89]">{sub}</p>
    </div>
  )
}

function ScoreBadge({
  score,
  rank,
  small = false,
}: {
  score: number
  rank: number
  small?: boolean
}) {
  let bg = "#9ca3af"
  let label = "低"
  if (score >= 80) {
    bg = "#dc2626"
    label = "最優先"
  } else if (score >= 65) {
    bg = "#ea580c"
    label = "高"
  } else if (score >= 50) {
    bg = "#d97706"
    label = "中"
  } else if (score >= 35) {
    bg = "#0e7490"
    label = "並"
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={`grid place-items-center rounded-full text-xs font-black text-white ${
          small ? "h-7 w-7" : "h-9 w-9"
        }`}
        style={{ background: bg }}
      >
        {rank}
      </span>
      <div>
        <div
          className={`font-black ${small ? "text-xs" : "text-sm"}`}
          style={{ color: bg }}
        >
          {label}
        </div>
        <div className="text-[10px] font-bold text-[#5f6f89]">{score} 点</div>
      </div>
    </div>
  )
}

function CustomerDetailModal({
  customer,
  onClose,
}: {
  customer: OBCustomer & { score: number; reform: PredictedReform; yearsPassed: number }
}
& { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(7,27,73,0.45)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-[24px] border border-[#d8e3f2] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#d8e3f2] bg-[#f7faff] px-6 py-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e7490]">
              OB 顧客 詳細
            </p>
            <h4 className="mt-1 text-xl font-black text-[#071b49]">{customer.name} 様</h4>
            <p className="mt-1 text-xs font-bold text-[#5f6f89]">{customer.address}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-[#d8e3f2] bg-white text-[#5f6f89] transition hover:bg-[#f7faff]"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-5 px-6 py-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoItem icon={<HomeIcon className="h-3.5 w-3.5" />} label="工事種別" value={customer.constructionType} />
            <InfoItem icon={<Calendar className="h-3.5 w-3.5" />} label="工事日" value={`${formatJapaneseDate(customer.constructionDate)} (築 ${customer.yearsPassed} 年)`} />
            <InfoItem icon={<TrendingUp className="h-3.5 w-3.5" />} label="工事金額" value={formatYen(customer.constructionAmount)} />
            <InfoItem icon={<Phone className="h-3.5 w-3.5" />} label="連絡先" value={`${customer.phone}${customer.lineEnabled ? " / LINE 可" : ""}`} />
          </div>

          {customer.familyNote && (
            <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-4">
              <p className="text-xs font-black uppercase tracking-wider text-[#b45309]">
                家族構成メモ
              </p>
              <p className="mt-2 text-sm font-bold text-[#7c2d12]">{customer.familyNote}</p>
            </div>
          )}

          <div className="rounded-2xl border border-[#bae6fd] bg-[#ecfeff] p-4">
            <p className="text-xs font-black uppercase tracking-wider text-[#0e7490]">
              AI 推定 リフォーム時期
            </p>
            <p className="mt-2 text-lg font-black text-[#071b49]">{customer.reform.label}</p>
            <p className="mt-1 text-sm font-bold text-[#33496d]">
              {formatJapaneseYearMonth(customer.reform.windowFrom)} 〜{" "}
              {formatJapaneseYearMonth(customer.reform.windowTo)}
            </p>
            <p className="mt-2 text-xs font-bold text-[#5f6f89]">
              推奨度 {customer.score} 点 (新築 / 経過年数 / 工事金額 / LINE 可否 から自動計算)
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wider text-[#5f6f89]">
              <History className="mr-1.5 inline-block h-3.5 w-3.5" />
              アプローチ履歴
            </p>
            {customer.approachHistory.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#dc2626]/40 bg-[#fef2f2] p-4">
                <p className="text-xs font-black text-[#dc2626]">
                  <AlertCircle className="mr-1.5 inline-block h-3.5 w-3.5" />
                  これまで アプローチ履歴なし
                </p>
                <p className="mt-1 text-xs font-bold text-[#7f1d1d]">
                  「あの人 元気かな」 で 動けていない可能性。 ここから 関係を 再起動できます。
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {[...customer.approachHistory].reverse().map((h, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 rounded-xl border border-[#eef2f7] bg-white px-3 py-2"
                  >
                    <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#f7faff] text-[#0e7490]">
                      {h.outcome === "成約" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <MessageCircle className="h-3.5 w-3.5" />
                      )}
                    </span>
                    <div>
                      <p className="text-xs font-black text-[#071b49]">
                        {formatJapaneseDate(h.date)} / {h.channel} → {h.outcome}
                      </p>
                      <p className="text-xs font-bold text-[#5f6f89]">{h.note}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <footer className="border-t border-[#d8e3f2] bg-[#f7faff] px-6 py-4">
          <p className="text-xs font-bold text-[#5f6f89]">
            このデモは 動作確認用です。 実際の SaaS では ここから 直接 LINE / 電話 / DM が 起動できます。
          </p>
        </footer>
      </div>
    </div>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-xl border border-[#eef2f7] bg-white p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-[#5f6f89]">
        {icon}
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-[#071b49]">{value}</p>
    </div>
  )
}

function LineMessagePreviewModal({
  customer,
  onClose,
}: {
  customer: OBCustomer & { score: number; reform: PredictedReform; yearsPassed: number }
  onClose: () => void
}) {
  // 文面 自動生成 (種別 / 経過年数 / 家族構成 で 文面 変化)
  const message = generateLineMessage(customer)

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-[rgba(7,27,73,0.45)] p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-[24px] border border-[#d8e3f2] bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between gap-3 border-b border-[#d8e3f2] bg-[#06c755] px-6 py-4 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90">
              LINE 送信 プレビュー
            </p>
            <h4 className="mt-1 text-base font-black">送信先: {customer.name} 様</h4>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="space-y-4 px-6 py-5">
          <div className="rounded-2xl bg-[#e6f7ec] p-4">
            <p className="text-xs font-black uppercase tracking-wider text-[#06c755]">
              送信文面 (AI 自動生成)
            </p>
            <p className="mt-3 whitespace-pre-wrap text-sm font-bold leading-7 text-[#33496d]">
              {message}
            </p>
          </div>

          <div className="rounded-2xl border border-[#fed7aa] bg-[#fff7ed] p-3">
            <p className="text-xs font-black uppercase tracking-wider text-[#b45309]">
              この文面の根拠
            </p>
            <ul className="mt-2 space-y-1 text-xs font-bold text-[#7c2d12]">
              <li>・工事日 {formatJapaneseDate(customer.constructionDate)} (築 {customer.yearsPassed} 年)</li>
              <li>・推定 {customer.reform.label}</li>
              <li>・推奨度 {customer.score} 点</li>
              {customer.familyNote && <li>・家族メモ: {customer.familyNote}</li>}
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                window.alert("(デモ) 実際の本番では LINE 公式アカウント経由で 送信されます。 今回は送信しません。")
                onClose()
              }}
              className="flex-1 rounded-md bg-[#06c755] px-4 py-2.5 text-sm font-black text-white transition hover:bg-[#05a847]"
            >
              <Send className="mr-1.5 inline-block h-3.5 w-3.5" />
              送信 (デモ)
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#d8e3f2] bg-white px-4 py-2.5 text-sm font-black text-[#5f6f89] transition hover:bg-[#f7faff]"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function generateLineMessage(customer: OBCustomer & { yearsPassed: number; reform: PredictedReform }): string {
  const greeting = `${customer.name.split(" ")[0]} 様`
  const yearsLine = customer.yearsPassed >= 10
    ? `お家を 建てさせて いただいてから ${Math.floor(customer.yearsPassed)} 年が 経ちました。`
    : `お家の その後は いかがですか?`

  let topic = ""
  if (customer.reform.label.includes("10-15 年")) {
    topic =
      "築 10 年を 過ぎますと、 外壁・屋根の 防水機能が 落ち始める時期です。 屋根や外壁の 状態を 無料で 点検させて いただけます。"
  } else if (customer.reform.label.includes("20-30 年")) {
    topic =
      "築 20 年を 過ぎますと、 外壁の 塗装や 屋根の 葺替えを 検討される 時期です。 状態を 無料で 確認させて いただけます。"
  } else {
    topic = "もし お住まいの 気になる点が ありましたら、 お気軽に ご相談ください。"
  }

  const familyTouch = customer.familyNote?.includes("お子様")
    ? "お子様も 大きくなられた頃かと 思います。 ご家族の 暮らしの 変化に 合わせた ご提案も できます。"
    : customer.familyNote?.includes("シニア") || customer.familyNote?.includes("退職")
      ? "段差や 手すりなど、 暮らしやすさの 点検も 一緒に させて いただけます。"
      : ""

  return [
    `${greeting}`,
    `井原工務店です。 ご無沙汰しております。`,
    yearsLine,
    topic,
    familyTouch,
    "",
    `今月か 来月で 30 分ほど お時間 いただければ、 現地で 軽く 確認させて いただけます。`,
    `井原`,
  ]
    .filter(Boolean)
    .join("\n")
}
