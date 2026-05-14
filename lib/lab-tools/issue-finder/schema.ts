import { z } from "zod"

export const subsidyTagSchema = z.enum([
  "it-introduction",
  "jizokuka",
  "monodzukuri",
  "saikochiku",
  "none",
])

export const sourceTypeSchema = z.enum([
  "chiebukuro",
  "review",
  "sns",
  "blog",
  "interview",
  "other",
])

export const relatedQuoteSchema = z.object({
  excerpt: z.string().max(400),
  sourceUrl: z.string().url().nullable(),
})

export const issueSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(120),
  painSummary: z.string().min(1).max(400),
  episode: z.string().max(800).nullable(),
  emotionScore: z.number().int().min(0).max(100),
  issueScore: z.number().int().min(0).max(100),
  solvabilityScore: z.number().int().min(0).max(100),
  scoreReason: z.string().max(400).nullable(),
  subsidyTags: z.array(subsidyTagSchema).default([]),
  industryTags: z.array(z.string()).default([]),
  sourceUrl: z.string().url().nullable(),
  sourceExcerpt: z.string().max(400).nullable(),
  sourceType: sourceTypeSchema.nullable(),
  createdAt: z.string(),
  clusterSize: z.number().int().min(0).nullable().default(null),
  samplingTotal: z.number().int().min(0).nullable().default(null),
  relatedQuotes: z.array(relatedQuoteSchema).default([]),
})

export const analyzeRequestSchema = z.object({
  text: z.string().min(20, "テキストは 20 文字以上で入力してください"),
  sourceUrl: z.string().url().optional(),
  sourceType: sourceTypeSchema.optional(),
})

// LLM / SKILL の生レスポンス用 (id / createdAt / issueScore はサーバ側で付与・再計算)
// issueScore は scoring.ts の computeIssueScore() が単一ソースなので入力では不要
export const llmIssueSchema = z.object({
  title: z.string(),
  painSummary: z.string(),
  episode: z.string().nullable().optional(),
  emotionScore: z.number(),
  issueScore: z.number().optional(),
  solvabilityScore: z.number(),
  scoreReason: z.string().optional().default(""),
  subsidyTags: z.array(z.string()).optional().default([]),
  industryTags: z.array(z.string()).optional().default([]),
  sourceExcerpt: z.string().nullable().optional(),
})

export const llmResponseSchema = z.object({
  issues: z.array(llmIssueSchema).max(20),
})
