import { NextResponse } from "next/server"
import type Anthropic from "@anthropic-ai/sdk"
import { callClaudeJSON, isAnthropicConfigured } from "@/lib/anthropic"
import { readSessionFromRequest } from "@/lib/lab-auth/cookie"
import { checkRateLimit, rateLimitResponse } from "@/lib/lab-tools/rate-limit"
import {
  EVIDENCE_SYSTEM_ROLE,
  buildCsv,
  buildSampleEvidence,
  type EvidenceResponse,
  type ExtractedReceipt,
  evidenceResponseSchema,
  extractedReceiptSchema,
  receiptToolInputSchema,
} from "@/lib/lab-tools/evidence-organizer"

export const runtime = "nodejs"
export const maxDuration = 120

const MAX_FILES = 10
const PARALLELISM = 3

export async function POST(req: Request) {
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: "invalid multipart body" }, { status: 400 })
  }

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0)
    .slice(0, MAX_FILES)

  if (files.length === 0) {
    return NextResponse.json({ error: "no image files" }, { status: 400 })
  }

  const filenames = files.map((f) => f.name)

  const session = readSessionFromRequest(req)
  const useAI = session.ok && isAnthropicConfigured()
  if (!useAI) {
    return NextResponse.json(buildSampleEvidence(filenames))
  }

  const rl = checkRateLimit(req)
  if (!rl.ok) return rateLimitResponse(rl)

  // 各画像を並列度 PARALLELISM で chunk 処理
  const results: ExtractedReceipt[] = []
  for (let i = 0; i < files.length; i += PARALLELISM) {
    const chunk = files.slice(i, i + PARALLELISM)
    const chunkResults = await Promise.all(
      chunk.map((file) => extractOne(file).catch((err) => failedItem(file, err))),
    )
    results.push(...chunkResults)
  }

  const validated = evidenceResponseSchema.safeParse({
    mode: "ai" as const,
    items: results,
    csv: buildCsv(results),
  } satisfies EvidenceResponse)

  if (!validated.success) {
    return NextResponse.json(
      { error: "AI response did not match schema", issues: validated.error.issues },
      { status: 502 },
    )
  }

  return NextResponse.json(validated.data)
}

async function extractOne(file: File): Promise<ExtractedReceipt> {
  const buf = Buffer.from(await file.arrayBuffer())
  const base64 = buf.toString("base64")
  const mediaType = guessMediaType(file)

  const userContent: Anthropic.ContentBlockParam[] = [
    {
      type: "image",
      source: { type: "base64", media_type: mediaType, data: base64 },
    },
    {
      type: "text",
      text: `この画像 (${file.name}) から経費情報を抽出してください。 必ず respond_with_receipt を呼んでください。`,
    },
  ]

  const ai = await callClaudeJSON<{
    date: string
    amount: number | null
    payee: string
    purpose: string
    category: ExtractedReceipt["category"]
    confidence: number
    suggestedFilename: string
  }>({
    systemBlocks: [{ text: EVIDENCE_SYSTEM_ROLE, cache: true }],
    messages: [{ role: "user", content: userContent }],
    tool: {
      name: "respond_with_receipt",
      description: "1 枚の領収書/通帳画像から経費情報を抽出して JSON で返す",
      input_schema: receiptToolInputSchema,
    },
    maxTokens: 1024,
    temperature: 0.1,
  })

  const parsed = extractedReceiptSchema.parse({
    originalFilename: file.name,
    date: ai.date,
    amount: ai.amount,
    payee: ai.payee,
    purpose: ai.purpose,
    category: ai.category,
    confidence: ai.confidence,
    suggestedFilename: ai.suggestedFilename,
  })
  return parsed
}

function failedItem(file: File, err: unknown): ExtractedReceipt {
  const message = err instanceof Error ? err.message : "unknown"
  return {
    originalFilename: file.name,
    date: "不明",
    amount: null,
    payee: "抽出失敗",
    purpose: message.slice(0, 30),
    category: "その他",
    confidence: 0,
    suggestedFilename: file.name.replace(/\.[^.]+$/, ""),
  }
}

function guessMediaType(
  file: File,
): "image/jpeg" | "image/png" | "image/gif" | "image/webp" {
  const t = file.type.toLowerCase()
  if (t.includes("png")) return "image/png"
  if (t.includes("gif")) return "image/gif"
  if (t.includes("webp")) return "image/webp"
  return "image/jpeg"
}
