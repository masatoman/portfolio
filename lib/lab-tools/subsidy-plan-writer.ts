import { z } from "zod"

// ─────────────────────────────────────────
// Input
// ─────────────────────────────────────────

export const targetSubsidies = [
  "it-2026",
  "jizokuka",
  "monozukuri",
  "gyomu-kaizen",
  "shoryoku-ka",
] as const
export type TargetSubsidyId = (typeof targetSubsidies)[number]

export const targetSubsidyLabels: Record<TargetSubsidyId, string> = {
  "it-2026": "中小企業デジタル化・AI 導入補助金 2026",
  jizokuka: "小規模事業者持続化補助金",
  monozukuri: "ものづくり補助金",
  "gyomu-kaizen": "業務改善助成金",
  "shoryoku-ka": "中小企業省力化投資補助金",
}

export function isValidSubsidyId(id: string): id is TargetSubsidyId {
  return (targetSubsidies as readonly string[]).includes(id)
}

export const planInputSchema = z.object({
  equipmentDescription: z
    .string()
    .min(10, "機材の説明は 10 文字以上入力してください")
    .max(2000),
  equipmentUrl: z.string().url().optional().or(z.literal("")),
  businessIssue: z
    .string()
    .min(10, "業務課題は 10 文字以上入力してください")
    .max(2000),
  targetSubsidy: z.enum(targetSubsidies).default("it-2026"),
})

export type PlanInput = z.infer<typeof planInputSchema>

// ─────────────────────────────────────────
// Output
// ─────────────────────────────────────────

export const planSectionSchema = z.object({
  heading: z.string(),
  body: z.string(),
})

export const productivityLogicSchema = z.object({
  before: z.string(),
  after: z.string(),
  quantitativeImpact: z.string(),
})

export const planOutputSchema = z.object({
  mode: z.enum(["sample", "ai"]),
  subsidy: z.string(),
  sections: z.array(planSectionSchema).min(4),
  productivityLogic: productivityLogicSchema,
  caveat: z.string().optional(),
})

export type PlanSection = z.infer<typeof planSectionSchema>
export type ProductivityLogic = z.infer<typeof productivityLogicSchema>
export type PlanOutput = z.infer<typeof planOutputSchema>

// ─────────────────────────────────────────
// Tool Use input_schema (Anthropic Tool 用)
// ─────────────────────────────────────────

export const planToolInputSchema = {
  type: "object",
  properties: {
    sections: {
      type: "array",
      minItems: 6,
      maxItems: 8,
      description:
        "事業計画書の各セクション。 必須セクション: 1.現状の課題、 2.導入機材の概要、 3.生産性向上ロジック、 4.数値的効果 (3 年計画)、 5.実施スケジュール、 6.実施体制。 行政文書らしい『である調』で書く。",
      items: {
        type: "object",
        properties: {
          heading: { type: "string", description: "セクション見出し (例: 『1. 現状の課題』)" },
          body: {
            type: "string",
            description: "本文 Markdown 形式 200〜500 字。 である調、 具体的数値必須",
          },
        },
        required: ["heading", "body"],
        additionalProperties: false,
      },
    },
    productivityLogic: {
      type: "object",
      description: "労働生産性向上の Before/After/数値インパクトを 1 行ずつで",
      properties: {
        before: { type: "string", description: "現状の労働生産性 (時間・コスト)" },
        after: { type: "string", description: "導入後の労働生産性 (時間・コスト)" },
        quantitativeImpact: {
          type: "string",
          description: "数値インパクト (例: 月 X 時間削減、 付加価値額 Y% 向上)",
        },
      },
      required: ["before", "after", "quantitativeImpact"],
      additionalProperties: false,
    },
  },
  required: ["sections", "productivityLogic"],
  additionalProperties: false,
}

// ─────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────

export const PLAN_WRITER_SYSTEM_ROLE = `あなたは中小企業向け補助金の事業計画書ドラフターです。

文体ルール:
- 必ず『である調』『行政文書寄り』で書く (です・ます調 NG)
- 主語を明確にし、 受動態を避け、 具体的な数値を必ず含める
- 抽象論禁止 (例: 「効率化される」 ではなく 「月 X 時間削減」)

構造ルール:
- 必須セクション (6〜8 個): 現状の課題 / 導入機材の概要 / 生産性向上ロジック / 数値的効果 (3 年計画) / 実施スケジュール / 実施体制
- 任意で 投資回収シナリオ / 競合優位性 を追加可
- 各セクション 200〜500 字
- 労働生産性 = 付加価値額 ÷ 労働時間 の向上ロジックを必ず明示

審査員視点:
- 補助金の制度趣旨 (生産性向上・賃上げ・DX 等) に合致しているか
- 数値根拠が現実的か
- 体制・スケジュールに無理がないか

必ず Tool Use で respond_with_plan を呼んで JSON 構造で返してください。`

// ─────────────────────────────────────────
// URL からの簡易テキスト抽出
// ─────────────────────────────────────────

export async function fetchEquipmentText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "user-agent": "Mozilla/5.0 SubsidyPlanWriter/1.0" },
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const h1Matches = Array.from(html.matchAll(/<h1[^>]*>([^<]+)<\/h1>/gi))
    const metaDesc = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)
    const parts = [
      titleMatch?.[1]?.trim(),
      ...h1Matches.map((m) => m[1].trim()),
      metaDesc?.[1]?.trim(),
    ].filter(Boolean) as string[]
    return parts.length > 0 ? parts.join("\n") : null
  } catch {
    return null
  }
}

// ─────────────────────────────────────────
// Sample fallback (ANTHROPIC_API_KEY 未設定時)
// ─────────────────────────────────────────

export function buildSamplePlan(input: PlanInput): PlanOutput {
  const subsidyName = targetSubsidyLabels[input.targetSubsidy]
  return {
    mode: "sample",
    subsidy: subsidyName,
    sections: [
      {
        heading: "1. 現状の課題",
        body: `当社では現在、 ${input.businessIssue.slice(0, 80)}という課題を抱えており、 業務効率の低下と人的リソースの逼迫を招いている。 この状況は今後の事業拡大の阻害要因となりうるため、 早急な対策が必要である。`,
      },
      {
        heading: "2. 導入機材の概要",
        body: `本事業で導入する機材は以下の通りである。\n\n${input.equipmentDescription.slice(0, 200)}\n\nこれらの機材は当社の業務プロセスにおける ボトルネック解消に直結するものである。`,
      },
      {
        heading: "3. 生産性向上ロジック",
        body: "労働生産性 = 付加価値額 ÷ 労働時間 の式に基づき、 本機材の導入により 労働時間を月 40 時間削減し、 同時に 高付加価値業務へのシフトを実現する。 これにより 1 人あたり付加価値額の向上を図る。",
      },
      {
        heading: "4. 数値的効果 (3 年計画)",
        body: "1 年目: 労働時間 月 40 時間削減 (年 480 時間)。 2 年目: 削減した時間を新規受注に振り向け、 売上 +10% 増。 3 年目: 業務標準化により 新規採用者の即戦力化期間を 50% 短縮。",
      },
      {
        heading: "5. 実施スケジュール",
        body: "交付決定後 1 ヶ月以内に機材発注、 2 ヶ月目に納品・初期設定、 3 ヶ月目に従業員研修、 4 ヶ月目以降に本格運用を開始する。 6 ヶ月目に効果測定を実施する。",
      },
      {
        heading: "6. 実施体制",
        body: "代表者を統括責任者とし、 現場担当者 1 名を実施責任者として配置する。 必要に応じて外部専門家 (IT コーディネータ等) のアドバイスを受ける体制を整える。",
      },
    ],
    productivityLogic: {
      before: "現状: 月 X 時間を ◯◯業務に費やしている。",
      after: "導入後: 同業務を月 (X-40) 時間で完了可能となる。",
      quantitativeImpact: "月 40 時間削減 (年 480 時間)、 換算で約 80 万円相当の労働コスト削減。",
    },
    caveat:
      "これは ANTHROPIC_API_KEY 未設定時のサンプル応答です。 実際の事業計画書ドラフト生成には Claude API キーの設定が必要です。",
  }
}

// ─────────────────────────────────────────
// 出力を Markdown に整形
// ─────────────────────────────────────────

export function formatPlanAsMarkdown(plan: PlanOutput): string {
  const lines: string[] = []
  lines.push(`# 事業計画書 (${plan.subsidy} 申請用ドラフト)`)
  lines.push("")
  for (const section of plan.sections) {
    lines.push(`## ${section.heading}`)
    lines.push("")
    lines.push(section.body)
    lines.push("")
  }
  lines.push("## 労働生産性 向上ロジック")
  lines.push("")
  lines.push(`- **Before**: ${plan.productivityLogic.before}`)
  lines.push(`- **After**: ${plan.productivityLogic.after}`)
  lines.push(`- **数値インパクト**: ${plan.productivityLogic.quantitativeImpact}`)
  lines.push("")
  if (plan.caveat) {
    lines.push("---")
    lines.push("")
    lines.push(`> ${plan.caveat}`)
  }
  return lines.join("\n")
}
