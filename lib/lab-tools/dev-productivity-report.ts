import { z } from "zod"
import type { BeforeAfterStats } from "./productivity-csv"

// ─────────────────────────────────────────
// Input (POST body)
// ─────────────────────────────────────────

export const periodStatsSchema = z.object({
  from: z.string(),
  to: z.string(),
  totalHours: z.number(),
  days: z.number(),
  avgPerDay: z.number(),
})

export const monthlyAggregateSchema = z.object({
  month: z.string(),
  hours: z.number(),
})

export const beforeAfterStatsSchema = z.object({
  beforePeriod: periodStatsSchema,
  afterPeriod: periodStatsSchema,
  deltaHoursPerMonth: z.number(),
  hourlyWage: z.number(),
  monetaryImpactPerYear: z.number(),
  monthlyBefore: z.array(monthlyAggregateSchema),
  monthlyAfter: z.array(monthlyAggregateSchema),
})

export const reportInputSchema = z.object({
  stats: beforeAfterStatsSchema,
  /** 導入したツール・PC 等の説明 (任意) */
  introducedThing: z.string().max(500).optional(),
})

export type ReportInput = z.infer<typeof reportInputSchema>

// ─────────────────────────────────────────
// Output
// ─────────────────────────────────────────

export const reportSchema = z.object({
  mode: z.enum(["sample", "ai"]),
  narrative: z.string(),
  bullets: z.array(z.string()),
  caveat: z.string().optional(),
})

export type ReportOutput = z.infer<typeof reportSchema>

// ─────────────────────────────────────────
// Tool Use input_schema
// ─────────────────────────────────────────

export const reportToolInputSchema = {
  type: "object",
  properties: {
    narrative: {
      type: "string",
      description:
        "補助金成果報告書フォーマットの本文。 『である調』、 400〜600 字、 必ず数値を 3 つ以上含める。 段落分けは改行 1 つ。 結論 → 数値根拠 → 今後の展望 の流れで。",
    },
    bullets: {
      type: "array",
      minItems: 3,
      maxItems: 5,
      description: "本文の要点を箇条書きで 3〜5 件",
      items: { type: "string" },
    },
  },
  required: ["narrative", "bullets"],
  additionalProperties: false,
}

// ─────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────

export const REPORT_SYSTEM_ROLE = `あなたは中小企業補助金の成果報告書ドラフターです。

文体ルール:
- 必ず『である調』
- 主語と数値を明示し、 抽象的な美辞麗句を避ける
- 結論先出し → 数値根拠 → 今後の展望 の構造

文量ルール:
- narrative: 400〜600 字 (改行 1 つで段落分け OK)
- bullets: 3〜5 件、 各 30〜50 字程度

入る数値: 削減時間 / 効果額 / 期間 を必ず本文に組み込むこと。

必ず Tool Use で respond_with_report を呼んで JSON で返してください。`

// ─────────────────────────────────────────
// Sample fallback
// ─────────────────────────────────────────

export function buildSampleReport(input: ReportInput): ReportOutput {
  const s = input.stats
  return {
    mode: "sample",
    narrative: `本事業による設備導入の結果、 月あたり ${s.deltaHoursPerMonth} 時間の労働時間削減を達成した。 これは年間 ${Math.round(s.deltaHoursPerMonth * 12)} 時間に相当し、 時給 ${s.hourlyWage.toLocaleString()} 円で換算すると年間 ${s.monetaryImpactPerYear.toLocaleString()} 円の効果額となる。\n\n導入前は ${s.beforePeriod.from} から ${s.beforePeriod.to} の期間で 1 営業日あたり平均 ${s.beforePeriod.avgPerDay} 時間を要していた業務が、 導入後は ${s.afterPeriod.from} から ${s.afterPeriod.to} の期間で 1 営業日あたり平均 ${s.afterPeriod.avgPerDay} 時間に短縮された。 削減された時間は新規受注対応と高付加価値業務に再配分しており、 結果として残業時間の削減と受注量の拡大の両立を実現している。\n\n今後はさらなる工程の見直しを通じて、 当初目標である生産性 +9%/3 年の達成を目指す。`,
    bullets: [
      `労働時間 月 ${s.deltaHoursPerMonth} 時間削減 (年 ${Math.round(s.deltaHoursPerMonth * 12)} 時間)`,
      `効果額 年 ${s.monetaryImpactPerYear.toLocaleString()} 円`,
      `導入前 平均 ${s.beforePeriod.avgPerDay} 時間/日 → 導入後 ${s.afterPeriod.avgPerDay} 時間/日`,
      "削減時間を新規受注・高付加価値業務に再配分",
    ],
    caveat:
      "これは ANTHROPIC_API_KEY 未設定時のサンプル応答です。 実際の文章生成には Claude API キーの設定が必要です。",
  }
}

// ─────────────────────────────────────────
// Markdown formatter
// ─────────────────────────────────────────

export function formatReportAsMarkdown(stats: BeforeAfterStats, report: ReportOutput): string {
  const lines: string[] = []
  lines.push("# 補助金成果報告 (生産性向上効果)")
  lines.push("")
  lines.push("## 効果サマリー")
  lines.push("")
  for (const b of report.bullets) lines.push(`- ${b}`)
  lines.push("")
  lines.push("## 本文")
  lines.push("")
  lines.push(report.narrative)
  lines.push("")
  lines.push("## 数値根拠")
  lines.push("")
  lines.push(
    `| 項目 | 導入前 (${stats.beforePeriod.from} 〜 ${stats.beforePeriod.to}) | 導入後 (${stats.afterPeriod.from} 〜 ${stats.afterPeriod.to}) |`,
  )
  lines.push(`| --- | --- | --- |`)
  lines.push(`| 総工数 | ${stats.beforePeriod.totalHours} 時間 | ${stats.afterPeriod.totalHours} 時間 |`)
  lines.push(`| 計上日数 | ${stats.beforePeriod.days} 日 | ${stats.afterPeriod.days} 日 |`)
  lines.push(`| 1 日あたり平均 | ${stats.beforePeriod.avgPerDay} 時間 | ${stats.afterPeriod.avgPerDay} 時間 |`)
  lines.push("")
  lines.push(`- **月あたり削減時間**: ${stats.deltaHoursPerMonth} 時間 (1 日あたり差分 × 22 営業日)`)
  lines.push(`- **時給換算**: ${stats.hourlyWage.toLocaleString()} 円`)
  lines.push(`- **年間効果額**: ${stats.monetaryImpactPerYear.toLocaleString()} 円`)
  if (report.caveat) {
    lines.push("")
    lines.push("---")
    lines.push("")
    lines.push(`> ${report.caveat}`)
  }
  return lines.join("\n")
}

// ─────────────────────────────────────────
// Sample CSV (UI のプレースホルダ)
// ─────────────────────────────────────────

export const SAMPLE_CSV = `date,hours,task,category
2026-02-03,3.5,build & wait for tests,build
2026-02-04,4.0,build & wait for tests,build
2026-02-05,3.0,build & wait for tests,build
2026-02-06,3.5,build & wait for tests,build
2026-02-07,4.0,build & wait for tests,build
2026-02-10,3.0,build & wait for tests,build
2026-02-11,3.5,build & wait for tests,build
2026-02-12,3.0,build & wait for tests,build
2026-02-13,3.5,build & wait for tests,build
2026-02-14,3.0,build & wait for tests,build
2026-04-07,1.0,build & wait for tests,build
2026-04-08,1.2,build & wait for tests,build
2026-04-09,0.8,build & wait for tests,build
2026-04-10,1.0,build & wait for tests,build
2026-04-11,0.9,build & wait for tests,build
2026-04-14,1.1,build & wait for tests,build
2026-04-15,0.8,build & wait for tests,build
2026-04-16,1.0,build & wait for tests,build
2026-04-17,1.2,build & wait for tests,build
2026-04-18,0.9,build & wait for tests,build
`
