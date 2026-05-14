import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"

export const metadata: Metadata = {
  title: "投票集計結果 / 工務店業務改善ツール",
  description: "demo-gallery 投票結果の集計ページ (管理者用)",
}

// Server Component で Supabase service_role で読む
async function fetchVotes() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null

  const supabase = createClient(url, key, { auth: { persistSession: false } })
  const { data, error } = await supabase
    .from("demo_votes")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("demo_votes fetch error:", error.message)
    return null
  }
  return data
}

const DEMO_NAMES: Record<string, string> = {
  "estimate-organizer": "見積 PDF 整理ツール",
  "call-memo-board": "電話メモ管理表",
  "site-photo-organizer": "現場写真自動整理",
  "voice-daily-report": "音声日報投稿",
  "receipt-expense-camera": "領収書カメラ OCR",
  "drawing-quick-viewer": "図面クイックビューア",
  "client-progress-page": "施主向け進捗ページ",
  "website-refresh": "工務店 Web リニューアル",
}

export const dynamic = "force-dynamic"

export default async function DemoGalleryResultsPage() {
  const votes = await fetchVotes()

  if (votes === null) {
    return (
      <div className="min-h-screen bg-white px-6 py-16 text-gray-900">
        <p className="mx-auto max-w-3xl text-sm text-red-700">
          Supabase 接続エラー or 環境変数未設定。 NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY を確認してください。
        </p>
      </div>
    )
  }

  // 全体集計 (選ばれた数 + 月 1,000 円で払う数)
  const tallies: Record<string, number> = {}
  const paidTallies: Record<string, number> = {}
  for (const slug of Object.keys(DEMO_NAMES)) {
    tallies[slug] = 0
    paidTallies[slug] = 0
  }
  for (const v of votes) {
    for (const slug of v.selected_demos as string[]) {
      if (slug in tallies) tallies[slug]++
    }
    for (const slug of (v.paid_demos || []) as string[]) {
      if (slug in paidTallies) paidTallies[slug]++
    }
  }
  const ranking = Object.entries(tallies).sort((a, b) => b[1] - a[1])
  const totalVoters = votes.length
  const totalPaidVotes = Object.values(paidTallies).reduce((a, b) => a + b, 0)

  // 役職別集計 (役職記入者のみ)
  type RoleTally = { role: string; voterCount: number; ranking: [string, number][] }
  const byRoleTallies: Record<string, Record<string, number>> = {}
  const byRoleVoters: Record<string, number> = {}
  for (const v of votes) {
    if (!v.voter_role) continue
    byRoleVoters[v.voter_role] = (byRoleVoters[v.voter_role] || 0) + 1
    if (!byRoleTallies[v.voter_role]) byRoleTallies[v.voter_role] = {}
    for (const slug of v.selected_demos as string[]) {
      byRoleTallies[v.voter_role][slug] = (byRoleTallies[v.voter_role][slug] || 0) + 1
    }
  }
  const roleRankings: RoleTally[] = Object.entries(byRoleTallies)
    .map(([role, slugs]) => ({
      role,
      voterCount: byRoleVoters[role],
      ranking: Object.entries(slugs).sort((a, b) => b[1] - a[1]).slice(0, 3),
    }))
    .sort((a, b) => b.voterCount - a.voterCount)
  const anonymousVoters = votes.filter((v) => !v.voter_role).length

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="border-b border-gray-200">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Link href="/demo-gallery" className="text-sm font-medium text-gray-600 transition hover:text-gray-900">
            ← デモギャラリーへ
          </Link>
          <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-gray-500">
            Admin / Results
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <section className="mb-12">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900">
            投票集計結果
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            総投票者数: <strong>{totalVoters} 名</strong> / 「有料でも使いたい」 票: <strong>{totalPaidVotes} 票</strong>
          </p>
        </section>

        {/* ランキング */}
        <section className="mb-16">
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-gray-900">
            得票数ランキング
          </h2>
          {totalVoters === 0 ? (
            <p className="text-sm text-gray-500">まだ投票がありません。</p>
          ) : (
            <ol className="space-y-3">
              {ranking.map(([slug, count], i) => {
                const paidCount = paidTallies[slug] || 0
                const pct = totalVoters > 0 ? (count / totalVoters) * 100 : 0
                const paidPct = totalVoters > 0 ? (paidCount / totalVoters) * 100 : 0
                const conversionRate = count > 0 ? (paidCount / count) * 100 : 0
                return (
                  <li
                    key={slug}
                    className="flex items-center gap-4 rounded-md border border-gray-200 bg-white px-5 py-4"
                  >
                    <span className="w-8 text-lg font-semibold text-gray-400">
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-base font-medium text-gray-900">
                          {DEMO_NAMES[slug] || slug}
                        </span>
                        <span className="text-sm tabular-nums text-gray-700">
                          <strong className="text-lg">{count}</strong> 票
                          {paidCount > 0 && (
                            <>
                              {" / "}
                              <strong className="text-gray-900">{paidCount}</strong> 名が有料でも使いたい
                              <span className="ml-1 text-xs text-gray-500">
                                ({conversionRate.toFixed(0)}%)
                              </span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="mt-2 relative h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        {/* 全体票 = 灰色 */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gray-400"
                          style={{ width: `${pct}%` }}
                        />
                        {/* 月 1,000 円で払う票 = 黒 (上に重ねる) */}
                        <div
                          className="absolute inset-y-0 left-0 bg-gray-900"
                          style={{ width: `${paidPct}%` }}
                        />
                      </div>
                      <div className="mt-1 flex gap-4 text-[10px] text-gray-500">
                        <span><span className="inline-block w-2 h-2 bg-gray-400 mr-1 align-middle rounded-sm"></span>気になる</span>
                        <span><span className="inline-block w-2 h-2 bg-gray-900 mr-1 align-middle rounded-sm"></span>有料でも使いたい</span>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ol>
          )}
        </section>

        {/* 役職別 TOP 3 */}
        {roleRankings.length > 0 && (
          <section className="mb-16">
            <h2 className="mb-2 text-xl font-semibold tracking-tight text-gray-900">
              役職別 TOP 3
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              役職記入者 <strong>{totalVoters - anonymousVoters} 名</strong> の集計
              {anonymousVoters > 0 && ` (匿名 ${anonymousVoters} 名は除外)`}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {roleRankings.map((rt) => (
                <div
                  key={rt.role}
                  className="rounded-md border border-gray-200 bg-white p-5"
                >
                  <div className="mb-3 flex items-baseline justify-between">
                    <strong className="text-base text-gray-900">{rt.role}</strong>
                    <span className="text-xs text-gray-500">
                      {rt.voterCount} 名
                    </span>
                  </div>
                  <ol className="space-y-2">
                    {rt.ranking.map(([slug, count], i) => (
                      <li
                        key={slug}
                        className="flex items-baseline justify-between gap-2 text-sm"
                      >
                        <span className="flex items-baseline gap-2 truncate">
                          <span className="w-4 text-xs text-gray-400 tabular-nums">
                            {i + 1}
                          </span>
                          <span className="truncate text-gray-900">
                            {DEMO_NAMES[slug] || slug}
                          </span>
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-gray-700">
                          {count} 票
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 投票者一覧 */}
        <section>
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-gray-900">
            投票者一覧 ({totalVoters} 名)
          </h2>
          {totalVoters === 0 ? (
            <p className="text-sm text-gray-500">まだ投票がありません。</p>
          ) : (
            <ul className="space-y-4">
              {votes.map((v) => (
                <li
                  key={v.id}
                  className="rounded-md border border-gray-200 bg-white px-5 py-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div>
                      <strong className="text-base text-gray-900">
                        {v.voter_name || "匿名さん"}
                      </strong>
                      {v.voter_role && (
                        <span className="ml-2 text-sm text-gray-500">{v.voter_role}</span>
                      )}
                    </div>
                    <time className="text-xs text-gray-500 tabular-nums">
                      {new Date(v.created_at).toLocaleString("ja-JP")}
                    </time>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {(v.selected_demos as string[]).map((slug) => {
                      const isPaid = (v.paid_demos as string[] | null)?.includes(slug)
                      return (
                        <span
                          key={slug}
                          className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${
                            isPaid
                              ? "bg-gray-900 text-white"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {DEMO_NAMES[slug] || slug}
                          {isPaid && <span className="ml-1.5 text-[10px] opacity-80">有料 OK</span>}
                        </span>
                      )
                    })}
                  </div>
                  {v.comment && (
                    <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm leading-6 text-gray-700">
                      💬 {v.comment}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      <footer className="mt-16 border-t border-gray-200">
        <div className="mx-auto max-w-4xl px-6 py-6 text-xs text-gray-500">
          このページは管理者用 / 本番環境では middleware で 404 にブロックされます
        </div>
      </footer>
    </div>
  )
}
