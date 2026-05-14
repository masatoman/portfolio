import { NextResponse } from "next/server"
import { callClaudeJSON, isAnthropicConfigured } from "@/lib/anthropic"
import { readSessionFromRequest } from "@/lib/lab-auth/cookie"
import { checkRateLimit, rateLimitResponse } from "@/lib/lab-tools/rate-limit"
import { buildSubsidyKnowledgeForPrompt } from "@/lib/lab-tools/subsidy-knowledge-base"
import {
  PLAN_WRITER_SYSTEM_ROLE,
  type PlanOutput,
  buildSamplePlan,
  fetchEquipmentText,
  planInputSchema,
  planOutputSchema,
  planToolInputSchema,
  targetSubsidyLabels,
} from "@/lib/lab-tools/subsidy-plan-writer"

export const runtime = "nodejs"
export const maxDuration = 90

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 })
  }

  const parsed = planInputSchema.safeParse(raw)
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
    return NextResponse.json(buildSamplePlan(input))
  }

  const rl = checkRateLimit(req)
  if (!rl.ok) return rateLimitResponse(rl)

  // URL があれば軽量テキスト抽出
  let urlExcerpt: string | null = null
  if (input.equipmentUrl && input.equipmentUrl.length > 0) {
    urlExcerpt = await fetchEquipmentText(input.equipmentUrl)
  }

  const subsidyName = targetSubsidyLabels[input.targetSubsidy]

  const userMessage = [
    `## 申請対象補助金\n${subsidyName} (id: ${input.targetSubsidy})`,
    "",
    "## 導入する機材・サービス",
    input.equipmentDescription,
    urlExcerpt ? `\n### 参照 URL からの抽出情報\n${urlExcerpt}` : "",
    "",
    "## 現在の業務課題",
    input.businessIssue,
    "",
    "上記情報をもとに、 申請対象補助金の事業計画書ドラフトを作成してください。",
    "必ず respond_with_plan ツールを呼び、 sections[] と productivityLogic を JSON 構造で返してください。",
    "セクションは 6 個以上、 各 200〜500 字、 必ず『である調』で。",
  ]
    .filter((s) => s !== "")
    .join("\n")

  try {
    const aiResult = await callClaudeJSON<{
      sections: PlanOutput["sections"]
      productivityLogic: PlanOutput["productivityLogic"]
    }>({
      systemBlocks: [
        { text: PLAN_WRITER_SYSTEM_ROLE, cache: false },
        {
          text: `# 補助金要件 JSON (参考)\n\n${buildSubsidyKnowledgeForPrompt()}`,
          cache: true,
        },
      ],
      messages: [{ role: "user", content: userMessage }],
      tool: {
        name: "respond_with_plan",
        description:
          "事業計画書ドラフトを sections[] (見出し + 本文) と productivityLogic (Before/After/数値) で返す",
        input_schema: planToolInputSchema,
      },
      maxTokens: 6000,
      temperature: 0.5,
    })

    const result = planOutputSchema.safeParse({
      mode: "ai" as const,
      subsidy: subsidyName,
      sections: aiResult.sections,
      productivityLogic: aiResult.productivityLogic,
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
