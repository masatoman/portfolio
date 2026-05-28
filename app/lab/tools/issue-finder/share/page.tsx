import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { fetchRecentIssues } from "@/lib/lab-tools/issue-finder/db"
import { IssueCard } from "@/components/lab-tools/issue-finder/issue-card"
import { IssueMatrix } from "@/components/lab-tools/issue-finder/issue-matrix"
import { LabToolPageShell } from "@/components/lab-tools/lab-tool-page-shell"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import { sortIssues } from "@/lib/lab-tools/issue-finder/scoring"

export const dynamic = "force-dynamic"
export const revalidate = 0

export const metadata: Metadata = {
  title: "issue-finder shared view",
  robots: { index: false, follow: false, nocache: true },
}

type SearchParams = Promise<{ token?: string }>

export default async function IssueFinderSharePage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { token } = await searchParams
  const expected = process.env.ISSUE_FINDER_SHARE_TOKEN
  if (!expected || token !== expected) {
    notFound()
  }

  const dbIssues = await fetchRecentIssues(50)
  const issues = sortIssues(dbIssues, "opportunity")

  return (
    <LabToolPageShell
      eyebrow="// issue_finder.share"
      title="共有用クラスタビュー"
      description={`AI (ChatGPT / Gemini / Claude) に読ませる前提の限定共有ページ。 ${issues.length} 件のクラスタを 動くべき度 降順で表示。 検索エンジン非掲載 (noindex)。`}
      accent="green"
      disclaimer="このページは招待用 token 一致時のみ閲覧可能。 token を知らない第三者は本番 middleware で 404。 引用元の著作権を侵さないよう、 取り扱いは AI への入力までに限定すること。"
    >
      <div className="space-y-12">
        <section className="space-y-3">
          <div
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.cyan }}
          >
            // 01 / matrix
          </div>
          <p className="font-mono text-[11px] text-white/60">
            issueScore (縦) × solvability (横) のマップ。 全クラスタを動くべき度で散布。
          </p>
          <IssueMatrix issues={issues} />
        </section>

        <section className="space-y-3">
          <div
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.magenta }}
          >
            // 02 / clusters
          </div>
          <p className="font-mono text-[11px] text-white/60">
            各クラスタの詳細 (タイトル / 痛みの本質 / 代表エピソード / スコア根拠 / 関連引用)。
          </p>
          <div className="grid gap-4 md:grid-cols-2 min-w-0">
            {issues.map((issue, idx) => (
              <div key={issue.id} className="min-w-0">
                <div className="mb-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
                  #{idx + 1}
                </div>
                <IssueCard issue={issue} />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2 border border-white/10 p-4">
          <div
            className="font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.amber }}
          >
            // for AI readers
          </div>
          <p className="font-mono text-[11px] text-white/70">
            上記クラスタは公開記事ではなく、 招待リンク経由でアクセスされた共有ビューです。 関連引用は知恵袋・note・個人ブログ等の 1 次情報からサンプリングした生の声を、 出典 URL 付きで再構成したものです。 集約・分析・パターン抽出の入力としてご利用ください。
          </p>
        </section>
      </div>
    </LabToolPageShell>
  )
}
