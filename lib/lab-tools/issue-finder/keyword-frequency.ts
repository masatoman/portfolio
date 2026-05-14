import type { Issue } from "./types"
import type { WatchedTool } from "./queries"

export type KeywordHit = {
  keyword: string
  kind: "phrase" | "tool"
  totalHits: number // 全引用での総出現回数
  clustersHit: number // 出現したクラスタ (issue) 数
  perCluster: Array<{
    issueId: string
    issueTitle: string
    hits: number
  }>
}

// 1 つの引用テキストに対して, 単語の出現回数をカウント
function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0
  let count = 0
  let from = 0
  while (true) {
    const idx = haystack.indexOf(needle, from)
    if (idx === -1) break
    count += 1
    from = idx + needle.length
  }
  return count
}

// 1 つの issue (= クラスタ) のすべてのテキスト断片を結合して返す
function getIssueText(issue: Issue): string {
  const parts: string[] = [
    issue.title,
    issue.painSummary,
    issue.episode ?? "",
    issue.scoreReason ?? "",
    issue.sourceExcerpt ?? "",
  ]
  for (const q of issue.relatedQuotes ?? []) {
    parts.push(q.excerpt)
  }
  return parts.filter(Boolean).join("\n")
}

export type FrequencyAnalyzeInput = {
  issues: Issue[]
  trackedKeywords: string[] // フレーズ単純列
  watchedTools: WatchedTool[] // ツール (alias 含む)
}

export function analyzeFrequency({
  issues,
  trackedKeywords,
  watchedTools,
}: FrequencyAnalyzeInput): KeywordHit[] {
  const hits: KeywordHit[] = []

  // 単純フレーズ
  for (const kw of trackedKeywords) {
    const perCluster: KeywordHit["perCluster"] = []
    let totalHits = 0
    for (const issue of issues) {
      const text = getIssueText(issue)
      const c = countOccurrences(text, kw)
      if (c > 0) {
        perCluster.push({ issueId: issue.id, issueTitle: issue.title, hits: c })
        totalHits += c
      }
    }
    if (totalHits > 0) {
      hits.push({
        keyword: kw,
        kind: "phrase",
        totalHits,
        clustersHit: perCluster.length,
        perCluster,
      })
    }
  }

  // ツール (alias 含む。 同一 tool に複数 alias がヒットした場合は合算)
  for (const tool of watchedTools) {
    const variants = [tool.name, ...(tool.aliases ?? [])]
    const perCluster: KeywordHit["perCluster"] = []
    let totalHits = 0
    for (const issue of issues) {
      const text = getIssueText(issue)
      let issueHits = 0
      for (const v of variants) {
        issueHits += countOccurrences(text, v)
      }
      if (issueHits > 0) {
        perCluster.push({
          issueId: issue.id,
          issueTitle: issue.title,
          hits: issueHits,
        })
        totalHits += issueHits
      }
    }
    if (totalHits > 0) {
      hits.push({
        keyword: tool.name,
        kind: "tool",
        totalHits,
        clustersHit: perCluster.length,
        perCluster,
      })
    }
  }

  // 出現クラスタ数 (= 業界横断シグナル) → 総出現回数 の順でソート
  hits.sort((a, b) => {
    if (b.clustersHit !== a.clustersHit) return b.clustersHit - a.clustersHit
    return b.totalHits - a.totalHits
  })

  return hits
}
