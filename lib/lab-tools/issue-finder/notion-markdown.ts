import type { Issue, SubsidyTag } from "./types"

const SUBSIDY_LABEL: Record<SubsidyTag, string> = {
  "it-introduction": "IT導入",
  jizokuka: "持続化",
  monodzukuri: "ものづくり",
  saikochiku: "再構築",
  none: "対象外",
}

// 1 件分の Notion ページ向け Markdown
// Notion DB に貼ると見出しがタイトルに、その下が本文に取り込まれる。
// プロパティ的に使いたい値 (スコア, タグ) はチェックボックスや toggle ではなく
// callout 形式の「meta」ブロックで人間にもパッと読める形に。
export function issueToNotionMarkdown(issue: Issue): string {
  const tags = [
    ...issue.subsidyTags.map((t) => `#補助金/${SUBSIDY_LABEL[t]}`),
    ...issue.industryTags.map((t) => `#業界/${t}`),
  ].join(" ")

  const lines = [
    `# ${issue.title}`,
    "",
    `> **イシュー度** ${issue.issueScore} ／ **解の質** ${issue.solvabilityScore} ／ **感情** ${issue.emotionScore}`,
    "",
  ]

  if (
    typeof issue.clusterSize === "number" &&
    typeof issue.samplingTotal === "number" &&
    issue.samplingTotal > 0
  ) {
    const pct = Math.round((issue.clusterSize / issue.samplingTotal) * 100)
    lines.push(
      `**規模**: ${issue.clusterSize} 件 / ${issue.samplingTotal} 件サンプリング中 (${pct}%)`,
      "",
    )
  }

  lines.push(`**根本原因**`, issue.painSummary, "")

  if (issue.episode) {
    lines.push(`**代表的なエピソード**`, `> ${issue.episode}`, "")
  }

  if (issue.scoreReason) {
    lines.push(`**スコア根拠**`, issue.scoreReason, "")
  }

  if (issue.sourceExcerpt) {
    lines.push(`**1次情報引用**`, `> ${issue.sourceExcerpt}`, "")
  }

  if (issue.relatedQuotes && issue.relatedQuotes.length > 0) {
    lines.push(`**関連引用 (${issue.relatedQuotes.length} 件)**`)
    for (const q of issue.relatedQuotes) {
      lines.push(`> ${q.excerpt}`)
      if (q.sourceUrl) lines.push(`> [出典](${q.sourceUrl})`)
      lines.push("")
    }
  }

  if (tags) {
    lines.push(tags, "")
  }

  if (issue.sourceUrl) {
    lines.push(`[代表 1次情報](${issue.sourceUrl})`, "")
  }

  lines.push(`*抽出: ${issue.createdAt}*`)
  return lines.join("\n")
}

// 全 issues を 1 つの Markdown にまとめる (ブログ下書き的用途)
export function issuesToNotionMarkdown(issues: Issue[]): string {
  if (issues.length === 0) return "(イシューなし)"

  const sorted = [...issues].sort((a, b) => b.issueScore - a.issueScore)
  const head = [
    `# 抽出イシュー ${sorted.length} 件`,
    `*${new Date().toISOString().slice(0, 10)} 抽出 / イシュー度の高い順*`,
    "",
    "---",
    "",
  ]

  const body = sorted
    .map((i, idx) => {
      const block = issueToNotionMarkdown(i)
      // 見出しレベルを 1 つ下げて、まとめページの中の小見出しに
      const downgraded = block.replace(/^# /, "## ")
      return `${downgraded}\n\n---`
    })
    .join("\n\n")

  return [...head, body].join("\n")
}
