import { NextResponse } from "next/server"
import {
  buildPromptFromText,
  buildSampleEstimateResponse,
  estimateResponseSchema,
  normalizeEstimateItems,
} from "@/lib/local-business/estimate-organizer"

export const runtime = "nodejs"

export async function POST(request: Request) {
  const url = new URL(request.url)
  const forceSample = url.searchParams.get("mode") === "sample"

  if (forceSample || !process.env.OPENAI_API_KEY) {
    const formData = await request.formData().catch(() => null)
    const sourceName = formData?.get("file")
    const filename = sourceName instanceof File ? sourceName.name : "sample-estimate.pdf"
    return NextResponse.json(buildSampleEstimateResponse(filename))
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "PDFファイルを選択してください。" }, { status: 400 })
    }

    const { PDFParse } = await import("pdf-parse")
    const buffer = Buffer.from(await file.arrayBuffer())
    const parser = new PDFParse({ data: buffer })
    const parsed = await parser.getText()
    await parser.destroy()
    const extractedText = parsed.text?.trim()

    if (!extractedText) {
      return NextResponse.json({ message: "PDFからテキストを読み取れませんでした。" }, { status: 422 })
    }

    const aiResult = await requestStructuredEstimate(extractedText)
    const normalized = estimateResponseSchema.parse({
      mode: "ai",
      sourceName: file.name,
      summary: "AIで見積書を解析し、項目ごとの一覧に正規化しました。",
      items: normalizeEstimateItems(aiResult.items),
    })

    return NextResponse.json(normalized)
  } catch (error) {
    console.error("estimate-organizer error", error)
    return NextResponse.json(
      { message: "AIでの整理に失敗しました。サンプルモードでお試しください。" },
      { status: 500 },
    )
  }
}

async function requestStructuredEstimate(text: string): Promise<{ items: unknown[] }> {
  const model = process.env.OPENAI_MODEL ?? "gpt-4o-mini"
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "建設見積書を構造化JSONへ整理してください。items 配列のみを含むJSONを返してください。",
        },
        {
          role: "user",
          content: buildPromptFromText(text),
        },
      ],
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`OpenAI request failed: ${response.status} ${body}`)
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>
  }
  const content = payload.choices?.[0]?.message?.content
  if (!content) {
    throw new Error("OpenAI response did not include content.")
  }

  return JSON.parse(content) as { items: unknown[] }
}
