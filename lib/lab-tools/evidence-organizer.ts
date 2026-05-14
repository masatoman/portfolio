import { z } from "zod"

// ─────────────────────────────────────────
// Output schema
// ─────────────────────────────────────────

export const expenseCategories = [
  "機材",
  "ソフトウェア",
  "外注費",
  "通信費",
  "広告宣伝",
  "旅費交通",
  "事務用品",
  "その他",
] as const

export const extractedReceiptSchema = z.object({
  originalFilename: z.string(),
  date: z.string(),
  amount: z.number().nullable(),
  payee: z.string(),
  purpose: z.string(),
  category: z.enum(expenseCategories),
  confidence: z.number().min(0).max(1),
  suggestedFilename: z.string(),
})

export type ExtractedReceipt = z.infer<typeof extractedReceiptSchema>

export const evidenceResponseSchema = z.object({
  mode: z.enum(["sample", "ai"]),
  items: z.array(extractedReceiptSchema),
  csv: z.string(),
  caveat: z.string().optional(),
})

export type EvidenceResponse = z.infer<typeof evidenceResponseSchema>

// ─────────────────────────────────────────
// Tool Use input_schema (Anthropic Vision で 1 枚ずつ)
// ─────────────────────────────────────────

export const receiptToolInputSchema = {
  type: "object",
  properties: {
    date: {
      type: "string",
      description: "領収書/通帳に記載の日付。 ISO 8601 (YYYY-MM-DD)。 読み取れない場合は『不明』",
    },
    amount: {
      type: ["number", "null"],
      description: "金額 (税込、 整数、 円)。 読み取れない場合は null",
    },
    payee: {
      type: "string",
      description: "支払先 (店舗名・取引先名・振込先名)。 読み取れない場合は『不明』",
    },
    purpose: {
      type: "string",
      description: "用途 (購入物・サービスの要約)。 30 字以内",
    },
    category: {
      type: "string",
      enum: expenseCategories,
      description: "経費カテゴリ。 提示した 8 種から 1 つ",
    },
    confidence: {
      type: "number",
      minimum: 0,
      maximum: 1,
      description: "抽出結果の信頼度 (0.0〜1.0)。 文字が読めなかったり推測が必要な場合は低く",
    },
    suggestedFilename: {
      type: "string",
      description:
        "整理用ファイル名 (拡張子なし)。 形式: YYYYMMDD_payeeRoma_amount。 例: 20260612_amazon_19800",
    },
  },
  required: [
    "date",
    "amount",
    "payee",
    "purpose",
    "category",
    "confidence",
    "suggestedFilename",
  ],
  additionalProperties: false,
}

// ─────────────────────────────────────────
// System prompt
// ─────────────────────────────────────────

export const EVIDENCE_SYSTEM_ROLE = `あなたは中小企業の経費精算を補助する OCR + 分類の専門家です。

ルール:
- 提供された領収書/通帳/請求書の画像から、 日付・金額・支払先・用途・カテゴリを抽出
- 日付は ISO 8601 形式 (YYYY-MM-DD)。 和暦は西暦に変換
- 金額は税込、 整数 (円)
- 用途は 30 字以内で簡潔に
- カテゴリは提示した 8 種から最も近いもの 1 つ
- 読み取れない項目は『不明』(数値は null)、 confidence を下げる
- suggestedFilename は YYYYMMDD_支払先ローマ字_金額 (拡張子なし、 半角)
  例: 20260612_amazon_19800

必ず Tool Use で respond_with_receipt を呼んで JSON で返してください。`

// ─────────────────────────────────────────
// CSV builder (Excel UTF-8 BOM 付き)
// ─────────────────────────────────────────

const CSV_HEADERS = [
  "date",
  "amount",
  "payee",
  "purpose",
  "category",
  "confidence",
  "originalFilename",
  "suggestedFilename",
] as const

function escapeCsv(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export function buildCsv(items: ExtractedReceipt[]): string {
  const lines: string[] = []
  lines.push(CSV_HEADERS.join(","))
  for (const item of items) {
    lines.push(
      [
        item.date,
        item.amount === null ? "" : String(item.amount),
        escapeCsv(item.payee),
        escapeCsv(item.purpose),
        item.category,
        item.confidence.toFixed(2),
        escapeCsv(item.originalFilename),
        escapeCsv(item.suggestedFilename),
      ].join(","),
    )
  }
  // Excel が日本語を正しく読むため UTF-8 BOM を先頭に付ける
  return "﻿" + lines.join("\n")
}

// ─────────────────────────────────────────
// Sample fallback
// ─────────────────────────────────────────

export function buildSampleEvidence(filenames: string[]): EvidenceResponse {
  const items: ExtractedReceipt[] = filenames.length === 0
    ? [
        {
          originalFilename: "sample-1.jpg",
          date: "2026-04-12",
          amount: 19800,
          payee: "Amazon",
          purpose: "USB-C ハブ (周辺機器)",
          category: "機材",
          confidence: 0.85,
          suggestedFilename: "20260412_amazon_19800",
        },
        {
          originalFilename: "sample-2.jpg",
          date: "2026-04-15",
          amount: 5478,
          payee: "GitHub Inc.",
          purpose: "Copilot 月額 (1 名)",
          category: "ソフトウェア",
          confidence: 0.9,
          suggestedFilename: "20260415_github_5478",
        },
      ]
    : filenames.map((name, i) => ({
        originalFilename: name,
        date: `2026-04-${String(10 + i).padStart(2, "0")}`,
        amount: 10000 + i * 1500,
        payee: "サンプル取引先",
        purpose: "サンプル経費",
        category: "その他" as const,
        confidence: 0.5,
        suggestedFilename: `2026041${i}_sample_${10000 + i * 1500}`,
      }))
  return {
    mode: "sample",
    items,
    csv: buildCsv(items),
    caveat:
      "これは ANTHROPIC_API_KEY 未設定時のサンプル応答です。 実際の OCR 抽出には Claude API キーの設定が必要です。",
  }
}

// ─────────────────────────────────────────
// クライアント側 (browser): 画像を Canvas で長辺 1280 px に縮小
// ─────────────────────────────────────────

const MAX_LONG_EDGE = 1280
const JPEG_QUALITY = 0.85

export async function resizeImageInBrowser(file: File): Promise<{ blob: Blob; mimeType: string }> {
  if (typeof window === "undefined") {
    throw new Error("resizeImageInBrowser is browser-only")
  }
  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const longEdge = Math.max(img.width, img.height)
    const scale = longEdge > MAX_LONG_EDGE ? MAX_LONG_EDGE / longEdge : 1
    const w = Math.round(img.width * scale)
    const h = Math.round(img.height * scale)
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("canvas 2d context unavailable")
    ctx.drawImage(img, 0, 0, w, h)
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
    )
    if (!blob) throw new Error("canvas.toBlob failed")
    return { blob, mimeType: "image/jpeg" }
  } finally {
    URL.revokeObjectURL(url)
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (e) => reject(e)
    img.src = src
  })
}

// ─────────────────────────────────────────
// クライアント側: マスク (黒塗り) 適用
//   rects は元画像のピクセル座標
// ─────────────────────────────────────────

export type MaskRect = { x: number; y: number; w: number; h: number }

export async function applyMaskToImage(
  file: File,
  rects: MaskRect[],
): Promise<File> {
  if (typeof window === "undefined") {
    throw new Error("applyMaskToImage is browser-only")
  }
  if (rects.length === 0) return file

  const url = URL.createObjectURL(file)
  try {
    const img = await loadImage(url)
    const canvas = document.createElement("canvas")
    canvas.width = img.width
    canvas.height = img.height
    const ctx = canvas.getContext("2d")
    if (!ctx) throw new Error("canvas 2d context unavailable")
    ctx.drawImage(img, 0, 0)
    ctx.fillStyle = "#000"
    for (const r of rects) {
      ctx.fillRect(r.x, r.y, r.w, r.h)
    }
    const mediaType = file.type.startsWith("image/png") ? "image/png" : "image/jpeg"
    const quality = mediaType === "image/jpeg" ? JPEG_QUALITY : undefined
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, mediaType, quality),
    )
    if (!blob) throw new Error("canvas.toBlob failed")
    const ext = mediaType === "image/png" ? "png" : "jpg"
    const baseName = file.name.replace(/\.[^.]+$/, "")
    return new File([blob], `${baseName}.masked.${ext}`, { type: mediaType })
  } finally {
    URL.revokeObjectURL(url)
  }
}
