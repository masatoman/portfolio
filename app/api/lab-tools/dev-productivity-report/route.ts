import { NextResponse } from "next/server"
import { callClaudeJSON, isAnthropicConfigured } from "@/lib/anthropic"
import { readSessionFromRequest } from "@/lib/lab-auth/cookie"
import { checkRateLimit, rateLimitResponse } from "@/lib/lab-tools/rate-limit"
import {
  REPORT_SYSTEM_ROLE,
  buildSampleReport,
  type ReportOutput,
  reportInputSchema,
  reportSchema,
  reportToolInputSchema,
} from "@/lib/lab-tools/dev-productivity-report"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const parsed = reportInputSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", issues: parsed.error.issues },
      { status: 400 },
    )
  }
  const input = parsed.data

  const session = readSessionFromRequest(req)
  const useAI = session.ok && isAnthropicConfigured()
  if (!useAI) {
    return NextResponse.json(buildSampleReport(input))
  }

  const rl = checkRateLimit(req)
  if (!rl.ok) return rateLimitResponse(rl)

  const s = input.stats
  const userMessage = [
    "## 集計結果 (BeforeAfterStats)",
    `- 導入前期間: ${s.beforePeriod.from} 〜 ${s.beforePeriod.to}`,
    `  - 総工数: ${s.beforePeriod.totalHours} 時間 (${s.beforePeriod.days} 日分)`,
    `  - 1 日あたり平均: ${s.beforePeriod.avgPerDay} 時間`,
    `- 導入後期間: ${s.afterPeriod.from} 〜 ${s.afterPeriod.to}`,
    `  - 総工数: ${s.afterPeriod.totalHours} 時間 (${s.afterPeriod.days} 日分)`,
    `  - 1 日あたり平均: ${s.afterPeriod.avgPerDay} 時間`,
    `- 月あたり削減時間: ${s.deltaHoursPerMonth} 時間`,
    `- 時給換算: ${s.hourlyWage.toLocaleString()} 円`,
    `- 年間効果額: ${s.monetaryImpactPerYear.toLocaleString()} 円`,
    "",
    input.introducedThing
      ? `## 導入したもの\n${input.introducedThing}`
      : "## 導入したもの\n(未指定。 一般的な生産性向上設備として表現してください)",
    "",
    "上記数値をもとに、 補助金成果報告書フォーマットの narrative (400〜600 字) と bullets (3〜5 件) を生成してください。",
    "必ず respond_with_report を呼んで JSON で返してください。",
  ].join("\n")

  try {
    const aiResult = await callClaudeJSON<{
      narrative: string
      bullets: string[]
    }>({
      systemBlocks: [{ text: REPORT_SYSTEM_ROLE, cache: true }],
      messages: [{ role: "user", content: userMessage }],
      tool: {
        name: "respond_with_report",
        description: "補助金成果報告書の本文と要点箇条書きを返す",
        input_schema: reportToolInputSchema,
      },
      maxTokens: 2000,
      temperature: 0.5,
    })

    const result = reportSchema.safeParse({
      mode: "ai" as const,
      narrative: aiResult.narrative,
      bullets: aiResult.bullets,
    } satisfies ReportOutput)

    if (!result.success) {
      return NextResponse.json(
        { error: "AI response did not match schema", issues: result.error.issues },
        { status: 502 },
      )
    }

    return NextResponse.json(result.data)
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error"
    return NextResponse.json(
      { error: "claude_call_failed", message },
      { status: 502 },
    )
  }
}
