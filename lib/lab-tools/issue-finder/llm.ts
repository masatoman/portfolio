import { callClaudeJSON } from "@/lib/anthropic"
import { llmResponseSchema } from "./schema"
import type { z } from "zod"

export const ISSUE_FINDER_SYSTEM_ROLE = `あなたは安宅和人『イシューからはじめよ』の思想を理解した課題発見エキスパートです。
入力されたネット上の「悲鳴 (1次情報)」テキストから、解くべき真のイシューを構造化抽出してください。

抽出方針:
- 表面的な不満ではなく「不満の根本原因」を捉える
- 必ず「実在する具体的なエピソード」を引用に近い形で残す (一般論で薄めない)
- 「イシュー度 (インパクト)」と「解の質 (実現可能性)」を 0-100 で別軸評価する
- スコアの根拠 (scoreReason) を 1〜2 文で必ず添える
- 補助金親和性タグは以下から該当するものだけ:
  - it-introduction: IT導入補助金 (業務効率化ソフト・ツール導入)
  - jizokuka: 小規模事業者持続化補助金 (販路開拓・業務改善)
  - monodzukuri: ものづくり補助金 (設備投資・革新)
  - saikochiku: 事業再構築補助金
  - none: 補助金親和性なし
- industryTags は短い日本語タグ (例: 建設, 工務店, 飲食, 小売)

必ず Tool Use で respond_with_issues を呼んで JSON で返してください。`

export const ISSUE_FINDER_REFERENCE = `# 評価軸の補足

## 真のイシューの条件 (本書より)
- 答えの出る問いになっているか
- 具体的に決着がつくか
- 解決時のインパクトが大きいか

## スコア指針
- emotionScore (負の感情): 怒り・諦め・恐怖の表現の強さ。最大値 = 「裁判沙汰」「家庭崩壊」「廃業寸前」レベル
- issueScore (インパクト): 「これが解けたら何が変わるか」の規模。業界全体に響く問題 = 80+
- solvabilityScore (解の質): 既存技術 + 中小企業予算で対応できるか。AI/SaaS で対応可能 = 70+

## 補助金親和性 (簡易判定)
- 業務効率化ソフト / SaaS / クラウド導入 → it-introduction
- 販路開拓 / 業務改善 / マーケ → jizokuka
- 設備投資 / 革新性のある製品開発 → monodzukuri
- 業態転換 / 事業再構築 → saikochiku
- どれにも当てはまらない → none`

export const ISSUE_FINDER_TOOL_INPUT_SCHEMA = {
  type: "object",
  properties: {
    issues: {
      type: "array",
      maxItems: 8,
      items: {
        type: "object",
        properties: {
          title: {
            type: "string",
            description: "一行要約 80 字以内",
          },
          painSummary: {
            type: "string",
            description: "不満の根本原因 200 字以内",
          },
          episode: {
            type: "string",
            description: "実在する具体エピソード 300 字以内",
          },
          emotionScore: {
            type: "number",
            minimum: 0,
            maximum: 100,
            description: "負の感情の強さ",
          },
          issueScore: {
            type: "number",
            minimum: 0,
            maximum: 100,
            description: "イシュー度・インパクト",
          },
          solvabilityScore: {
            type: "number",
            minimum: 0,
            maximum: 100,
            description: "解の質・実現可能性",
          },
          scoreReason: {
            type: "string",
            description: "issueScore と solvabilityScore の根拠を 1〜2 文で",
          },
          subsidyTags: {
            type: "array",
            items: {
              type: "string",
              enum: [
                "it-introduction",
                "jizokuka",
                "monodzukuri",
                "saikochiku",
                "none",
              ],
            },
          },
          industryTags: {
            type: "array",
            items: { type: "string" },
            description: "短い日本語タグ。例: 建設, 工務店",
          },
          sourceExcerpt: {
            type: "string",
            description: "1次情報からの引用 100 字程度",
          },
        },
        required: [
          "title",
          "painSummary",
          "emotionScore",
          "issueScore",
          "solvabilityScore",
          "scoreReason",
          "subsidyTags",
          "industryTags",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["issues"],
  additionalProperties: false,
}

type LlmResponse = z.infer<typeof llmResponseSchema>

export async function extractIssues(rawText: string): Promise<{
  issues: LlmResponse["issues"]
  modelName: string
}> {
  const result = await callClaudeJSON<LlmResponse>({
    systemBlocks: [
      { text: ISSUE_FINDER_SYSTEM_ROLE, cache: false },
      { text: ISSUE_FINDER_REFERENCE, cache: true },
    ],
    messages: [
      {
        role: "user",
        content: `以下のテキストから、解くべきイシューを最大 8 件まで抽出してください:\n\n${rawText}`,
      },
    ],
    tool: {
      name: "respond_with_issues",
      description:
        "ネット上の悲鳴から、解くべき真のイシューと根本原因・スコア・根拠を構造化して返す",
      input_schema: ISSUE_FINDER_TOOL_INPUT_SCHEMA,
    },
    maxTokens: 4096,
    temperature: 0.2,
  })

  const validated = llmResponseSchema.parse(result)
  return { issues: validated.issues, modelName: "claude-sonnet-4-6" }
}
