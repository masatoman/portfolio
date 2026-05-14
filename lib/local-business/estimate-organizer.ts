import { z } from "zod"

export const estimateItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.string().min(1),
  unit: z.string().min(1),
  unitPrice: z.string().min(1),
  amount: z.string().min(1),
  note: z.string().default(""),
})

export const estimateResponseSchema = z.object({
  mode: z.enum(["sample", "ai"]),
  sourceName: z.string().min(1),
  summary: z.string().min(1),
  items: z.array(estimateItemSchema).min(1),
})

export type EstimateItem = z.infer<typeof estimateItemSchema>
export type EstimateResponse = z.infer<typeof estimateResponseSchema>

export const sampleEstimateItems: EstimateItem[] = [
  {
    name: "基礎工事",
    quantity: "1",
    unit: "式",
    unitPrice: "280,000",
    amount: "280,000",
    note: "掘削・砕石・配筋を含む",
  },
  {
    name: "木材・躯体",
    quantity: "1",
    unit: "式",
    unitPrice: "620,000",
    amount: "620,000",
    note: "柱・梁・構造用合板",
  },
  {
    name: "屋根工事",
    quantity: "42",
    unit: "㎡",
    unitPrice: "8,500",
    amount: "357,000",
    note: "ガルバリウム鋼板仕上げ",
  },
  {
    name: "外壁工事",
    quantity: "88",
    unit: "㎡",
    unitPrice: "6,400",
    amount: "563,200",
    note: "透湿防水シート・サイディング",
  },
]

export function buildSampleEstimateResponse(sourceName = "sample-estimate.pdf"): EstimateResponse {
  return {
    mode: "sample",
    sourceName,
    summary: "サンプル見積書を項目ごとに整理した結果です。工務店の見積転記を想定しています。",
    items: sampleEstimateItems,
  }
}

export function normalizeEstimateItems(input: unknown): EstimateItem[] {
  if (!Array.isArray(input)) {
    throw new Error("見積項目の形式が不正です。")
  }

  return z.array(estimateItemSchema).parse(
    input.map((raw) => {
      const item = typeof raw === "object" && raw !== null ? (raw as Record<string, unknown>) : {}

      return {
        name: stringifyField(item.name, "項目未設定"),
        quantity: stringifyField(item.quantity, "1"),
        unit: stringifyField(item.unit, "式"),
        unitPrice: normalizeMoney(item.unitPrice),
        amount: normalizeMoney(item.amount),
        note: stringifyField(item.note, ""),
      }
    }),
  )
}

export function buildPromptFromText(text: string): string {
  return [
    "あなたは建設見積書を項目テーブルに整理するアシスタントです。",
    "次の見積書テキストから、項目ごとに name, quantity, unit, unitPrice, amount, note を抽出してください。",
    "JSONのみを返してください。金額はカンマ区切りの文字列で統一してください。",
    "",
    text.trim(),
  ].join("\n")
}

function stringifyField(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim().length > 0) return value.trim()
  if (typeof value === "number" && Number.isFinite(value)) return String(value)
  return fallback
}

function normalizeMoney(value: unknown): string {
  const raw = stringifyField(value, "0").replace(/[^\d.-]/g, "")
  const parsed = Number(raw)
  if (!Number.isFinite(parsed)) return "0"
  return new Intl.NumberFormat("ja-JP").format(parsed)
}
