import { z } from "zod"
import { subsidies } from "./subsidy-knowledge-base"

// ─────────────────────────────────────────
// Input
// ─────────────────────────────────────────

export const industries = [
  "建設・工務店",
  "製造業",
  "小売・EC",
  "飲食・宿泊",
  "サービス業",
  "IT・ソフトウェア",
  "医療・福祉",
  "運輸・物流",
  "農林水産",
  "その他",
] as const

export const matchInputSchema = z.object({
  industry: z.enum(industries),
  employees: z.number().int().min(0).max(1000),
  issue: z.string().min(10).max(1000),
  wantToBuy: z.string().min(5).max(500),
})

export type MatchInput = z.infer<typeof matchInputSchema>

// ─────────────────────────────────────────
// Output
// ─────────────────────────────────────────

export const matchItemSchema = z.object({
  subsidyId: z.string(),
  subsidyName: z.string(),
  matchPercent: z.number().min(0).max(100),
  reason: z.string(),
  missingRequirements: z.array(z.string()),
  nextActions: z.array(z.string()),
})

export const matchResultSchema = z.object({
  mode: z.enum(["sample", "ai"]),
  matches: z.array(matchItemSchema).length(5),
  caveat: z.string().optional(),
})

export type MatchItem = z.infer<typeof matchItemSchema>
export type MatchResult = z.infer<typeof matchResultSchema>

// ─────────────────────────────────────────
// Tool Use input_schema (Anthropic Tool 用)
// ─────────────────────────────────────────

export const matchToolInputSchema = {
  type: "object",
  properties: {
    matches: {
      type: "array",
      minItems: 5,
      maxItems: 5,
      items: {
        type: "object",
        properties: {
          subsidyId: { type: "string", enum: subsidies.map((s) => s.id) },
          subsidyName: { type: "string" },
          matchPercent: { type: "number", minimum: 0, maximum: 100 },
          reason: {
            type: "string",
            description: "なぜその合致率になるか、 提示された補助金要件のどこに合致/不足しているかを 2〜3 文で具体的に",
          },
          missingRequirements: {
            type: "array",
            items: { type: "string" },
            description: "ユーザー入力からは満たせていない要件 (なければ空配列)",
          },
          nextActions: {
            type: "array",
            items: { type: "string" },
            description: "申請に向けて 次に取るべき具体的なアクション (例: GビズID プライム取得)",
          },
        },
        required: [
          "subsidyId",
          "subsidyName",
          "matchPercent",
          "reason",
          "missingRequirements",
          "nextActions",
        ],
        additionalProperties: false,
      },
    },
  },
  required: ["matches"],
  additionalProperties: false,
}

// ─────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────

export const SUBSIDY_MATCH_SYSTEM_ROLE = `あなたは日本の中小企業向け補助金マッチングの専門家です。

提供される 5 つの補助金の要件 JSON を読み、 ユーザー事業との合致率を 0〜100% で算出してください。

評価方針:
- 業種・従業員数・課題・買いたいものの 4 軸で要件適合性を判定
- 合致率は厳密に。 要件を 1 つでも完全に満たせない場合は 60% 以下が目安
- reason は要件のどこに合致/不足しているかを 具体的に指摘 (一般論で済ませない)
- missingRequirements は 要件ファイルの記述に沿って 具体名で挙げる
- nextActions は 「商工会議所に相談」「GビズID プライム取得」「販売実績作り」 など 実行可能な 1 ステップ

注意:
- IT 導入補助金は IT 導入支援事業者経由でしか申請できない
- 持続化補助金は 商工会議所/商工会の確認が必須
- ものづくり補助金は『革新性』が必須 (単純置き換えは不可)
- 業務改善助成金は 従業員 1 名以上の事業場が必要
- 省力化投資補助金は カタログ型と一般型で要件が違う

必ず Tool Use で respond_with_match を呼んで JSON で返してください。`

// ─────────────────────────────────────────
// Sample fallback (ANTHROPIC_API_KEY 未設定時)
// ─────────────────────────────────────────

export function buildSampleMatch(input: MatchInput): MatchResult {
  return {
    mode: "sample",
    matches: [
      {
        subsidyId: "it-2026",
        subsidyName: "中小企業デジタル化・AI 導入補助金 2026",
        matchPercent: 75,
        reason: `${input.industry} の事業で「${input.wantToBuy}」を導入する計画は、 IT 導入補助金の対象になり得ます。 ただし IT 導入支援事業者経由での申請が必須です。`,
        missingRequirements: [
          "GビズID プライムアカウントの取得",
          "IT 導入支援事業者の選定",
          "登録 IT ツールへの該当性確認",
        ],
        nextActions: [
          "GビズID プライムを申請 (印鑑証明書必要、 2〜3 週間)",
          "公式ポータルで対象 IT ツールを検索",
          "信頼できる IT 導入支援事業者に相談",
        ],
      },
      {
        subsidyId: "jizokuka",
        subsidyName: "小規模事業者持続化補助金",
        matchPercent: input.employees <= 5 ? 85 : 30,
        reason:
          input.employees <= 5
            ? "従業員数の要件 (小規模事業者) を満たしており、 販路開拓・業務効率化の取組として申請可能性が高い。"
            : "従業員数が小規模事業者の上限を超えている可能性が高く、 対象外の見込み。",
        missingRequirements:
          input.employees <= 5
            ? ["商工会議所/商工会での事前相談", "経営計画書の作成"]
            : ["小規模事業者の従業員数要件 (業種別 5〜20 名以下)"],
        nextActions:
          input.employees <= 5
            ? ["商工会議所に会員登録または相談予約", "経営計画書のひな形入手"]
            : ["他の補助金 (ものづくり補助金 等) を検討"],
      },
      {
        subsidyId: "monozukuri",
        subsidyName: "ものづくり・商業・サービス生産性向上促進補助金",
        matchPercent: 50,
        reason:
          "金額規模が大きい設備投資には適しているが、 『革新性』の説明と 賃上げ計画 (給与総額 +1.5%/年) が必須。 計画書の作成負担が大きい。",
        missingRequirements: ["革新性の根拠資料", "賃上げ計画", "認定経営革新等支援機関の確認"],
        nextActions: ["認定支援機関に相談", "競合との差別化ポイントを言語化"],
      },
      {
        subsidyId: "gyomu-kaizen",
        subsidyName: "業務改善助成金",
        matchPercent: input.employees >= 1 ? 60 : 10,
        reason:
          input.employees >= 1
            ? "賃金引き上げと併せて生産性向上設備を導入する助成金。 従業員がいる事業場のみ対象。"
            : "代表者本人のみで従業員がいない場合は 対象外。",
        missingRequirements:
          input.employees >= 1
            ? ["事業場内最低賃金の引き上げ計画 (+30〜+90 円)", "6 ヶ月以上の雇用継続"]
            : ["従業員 1 名以上の雇用"],
        nextActions:
          input.employees >= 1
            ? ["現在の事業場内最低賃金を確認", "都道府県労働局に相談"]
            : ["雇用予定がなければ 持続化補助金等を検討"],
      },
      {
        subsidyId: "shoryoku-ka",
        subsidyName: "中小企業省力化投資補助金",
        matchPercent: 40,
        reason:
          "事務局のカタログに掲載された省力化製品の導入が条件。 PC・タブレットの単独購入は対象外。 飲食・宿泊・小売・運輸での活用例が多い。",
        missingRequirements: ["カタログ掲載製品の特定", "労働生産性 +3%/年 の計画"],
        nextActions: ["公式カタログを確認", "該当製品があれば 対応事業者に問合せ"],
      },
    ],
    caveat:
      "これは ANTHROPIC_API_KEY 未設定時のサンプル応答です。 実際の合致率算定には Claude API キーの設定が必要です。",
  }
}
