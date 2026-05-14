import Anthropic from "@anthropic-ai/sdk"

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const MODELS = {
  default: process.env.ANTHROPIC_MODEL_DEFAULT ?? "claude-sonnet-4-6",
  heavy: process.env.ANTHROPIC_MODEL_HEAVY ?? "claude-opus-4-7",
} as const

export type ModelKey = keyof typeof MODELS

export type SystemBlock = {
  text: string
  /** true の場合、その時点までの全 system 内容を ephemeral キャッシュ対象にする */
  cache?: boolean
}

export type CallOptions = {
  model?: ModelKey
  systemBlocks: SystemBlock[]
  messages: Anthropic.MessageParam[]
  maxTokens?: number
  temperature?: number
}

function buildSystem(blocks: SystemBlock[]): Anthropic.TextBlockParam[] {
  return blocks.map((b) => ({
    type: "text",
    text: b.text,
    ...(b.cache ? { cache_control: { type: "ephemeral" } } : {}),
  }))
}

export function isAnthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

/**
 * テキスト応答を返す薄いラッパ。
 * system に cache:true ブロックがあると prompt caching が効く (5 分 TTL)。
 */
export async function callClaudeText(opts: CallOptions): Promise<string> {
  const response = await anthropic.messages.create({
    model: MODELS[opts.model ?? "default"],
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.7,
    system: buildSystem(opts.systemBlocks),
    messages: opts.messages,
  })

  const text = response.content
    .filter((c): c is Anthropic.TextBlock => c.type === "text")
    .map((c) => c.text)
    .join("\n")

  return text.trim()
}

export type JSONToolDef = {
  name: string
  description: string
  input_schema: Record<string, unknown>
}

/**
 * Tool Use で構造化 JSON を強制する。
 * 呼び出し側は自分の Zod schema で再 parse して下さい (型は any で返す)。
 */
export async function callClaudeJSON<T = unknown>(
  opts: CallOptions & { tool: JSONToolDef },
): Promise<T> {
  const response = await anthropic.messages.create({
    model: MODELS[opts.model ?? "default"],
    max_tokens: opts.maxTokens ?? 4096,
    temperature: opts.temperature ?? 0.4,
    system: buildSystem(opts.systemBlocks),
    messages: opts.messages,
    tools: [
      {
        name: opts.tool.name,
        description: opts.tool.description,
        input_schema: opts.tool.input_schema as Anthropic.Tool.InputSchema,
      },
    ],
    tool_choice: { type: "tool", name: opts.tool.name },
  })

  const toolUse = response.content.find(
    (c): c is Anthropic.ToolUseBlock => c.type === "tool_use",
  )
  if (!toolUse) {
    throw new Error("Claude did not return a tool_use block")
  }
  return toolUse.input as T
}
