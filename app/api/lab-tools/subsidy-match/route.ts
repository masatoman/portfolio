import { NextResponse } from "next/server"
import { callClaudeJSON, isAnthropicConfigured } from "@/lib/anthropic"
import { readSessionFromRequest } from "@/lib/lab-auth/cookie"
import { checkRateLimit, rateLimitResponse } from "@/lib/lab-tools/rate-limit"
import { buildSubsidyKnowledgeForPrompt, subsidies } from "@/lib/lab-tools/subsidy-knowledge-base"
import {
  SUBSIDY_MATCH_SYSTEM_ROLE,
  buildSampleMatch,
  matchInputSchema,
  matchResultSchema,
  matchToolInputSchema,
  type MatchResult,
} from "@/lib/lab-tools/subsidy-match"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const parsed = matchInputSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", issues: parsed.error.issues },
      { status: 400 },
    )
  }
  const input = parsed.data

  // 認証 + API key 両方揃って初めて AI 経路。 どちらか欠ければサンプル fallback
  const session = readSessionFromRequest(req)
  const useAI = session.ok && isAnthropicConfigured()
  if (!useAI) {
    return NextResponse.json(buildSampleMatch(input))
  }

  const rl = checkRateLimit(req)
  if (!rl.ok) return rateLimitResponse(rl)

  try {
    const userMessage = [
      "## ユーザー事業情報",
      `- 業種: ${input.industry}`,
      `- 従業員数: ${input.employees} 名`,
      `- 現在の課題: ${input.issue}`,
      `- 買いたいもの・導入したいもの: ${input.wantToBuy}`,
      "",
      "5 つの補助金すべてについて、 提供された要件 JSON に基づいて 合致率を算定し、",
      "respond_with_match ツールで JSON 形式で返してください。",
    ].join("\n")

    const aiResult = await callClaudeJSON<{ matches: MatchResult["matches"] }>({
      systemBlocks: [
        { text: SUBSIDY_MATCH_SYSTEM_ROLE, cache: false },
        {
          text: `# 補助金要件 JSON\n\n${buildSubsidyKnowledgeForPrompt()}`,
          cache: true,
        },
      ],
      messages: [{ role: "user", content: userMessage }],
      tool: {
        name: "respond_with_match",
        description: "5 つの補助金すべてについて、 ユーザー事業との合致率と理由・不足要件・次アクションを返す",
        input_schema: matchToolInputSchema,
      },
      maxTokens: 4096,
      temperature: 0.3,
    })

    const result = matchResultSchema.safeParse({
      mode: "ai" as const,
      matches: aiResult.matches.map((m) => ({
        ...m,
        subsidyName:
          m.subsidyName ||
          subsidies.find((s) => s.id === m.subsidyId)?.name ||
          m.subsidyId,
      })),
    })

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
