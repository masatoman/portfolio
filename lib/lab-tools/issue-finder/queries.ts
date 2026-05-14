import { z } from "zod"

export const watchedToolSchema = z.object({
  name: z.string(),
  aliases: z.array(z.string()).default([]),
})

export const perspectiveSchema = z.object({
  role: z.string(),
  keywords: z.array(z.string()).min(1),
  examplePhrasesToWatch: z.array(z.string()).optional(),
  keywordsToTrack: z.array(z.string()).optional().default([]),
  watchedTools: z.array(watchedToolSchema).optional().default([]),
})

export const industryProfileSchema = z.object({
  id: z.string(),
  name: z.string(),
  active: z.boolean(),
  depth: z.enum(["deep", "shallow"]).default("shallow"),
  rationale: z.string().optional(),
  phases: z.array(z.string()).optional(),
  perspectives: z.array(perspectiveSchema).min(1),
})

export const queriesFileSchema = z.object({
  version: z.literal(4),
  schedule: z.object({
    cron: z.string(),
    humanReadable: z.string(),
    rotationStrategy: z.enum(["daily", "weekly", "manual"]).default("daily"),
    rotationStartDate: z.string(), // YYYY-MM-DD - これを Day 0 として日数差分でローテーション
    samplingTargetPerRun: z.number().int().min(10).max(2000).default(150),
    maxClustersPerRun: z.number().int().min(1).max(30).default(12),
    minClusterSize: z.number().int().min(1).max(20).default(3),
    topKeywordsToShow: z.number().int().min(5).max(50).default(20),
  }),
  industryProfiles: z.array(industryProfileSchema),
})

export type WatchedTool = z.infer<typeof watchedToolSchema>
export type Perspective = z.infer<typeof perspectiveSchema>
export type IndustryProfile = z.infer<typeof industryProfileSchema>
export type QueriesFile = z.infer<typeof queriesFileSchema>

import queriesData from "@/data/issue-finder/queries.json"

export function getQueriesFile(): QueriesFile {
  return queriesFileSchema.parse(queriesData)
}

export function getActiveProfiles(): IndustryProfile[] {
  return getQueriesFile().industryProfiles.filter((p) => p.active)
}

export function countPerspectives(profile: IndustryProfile): number {
  return profile.perspectives.length
}

export type ExpandedQuery = {
  profileId: string
  profileName: string
  role: string
  keywords: string[]
  examplePhrasesToWatch: string[]
  keywordsToTrack: string[]
  watchedTools: WatchedTool[]
}

// 業種 × perspective を全部展開した一次元配列。 ローテーション順 (industryProfiles の順番 → perspectives の順番)
export function expandQueries(): ExpandedQuery[] {
  const out: ExpandedQuery[] = []
  for (const profile of getActiveProfiles()) {
    for (const persp of profile.perspectives) {
      out.push({
        profileId: profile.id,
        profileName: profile.name,
        role: persp.role,
        keywords: persp.keywords,
        examplePhrasesToWatch: persp.examplePhrasesToWatch ?? [],
        keywordsToTrack: persp.keywordsToTrack ?? [],
        watchedTools: persp.watchedTools ?? [],
      })
    }
  }
  return out
}

// JST の YYYY-MM-DD を返す
function toJstDateString(date: Date): string {
  // sv-SE ロケールは ISO 形式 (YYYY-MM-DD) を返す。 timeZone で JST 強制.
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

// "YYYY-MM-DD" を UTC のミリ秒に変換 (日付差計算用)
function ymdToUtcMs(ymd: string): number {
  const [y, m, d] = ymd.split("-").map((s) => Number.parseInt(s, 10))
  return Date.UTC(y, m - 1, d)
}

// rotationStartDate からの経過日数を perspectives.length で剰余して、 その日の対象 perspective を決める
// 日付の比較は常に JST ベースで行う (cron も JST で実行される想定)
export function getPerspectiveForDate(date: Date = new Date()): {
  query: ExpandedQuery
  dayIndex: number
  totalPerspectives: number
  cycleNumber: number
} {
  const file = getQueriesFile()
  const queries = expandQueries()
  if (queries.length === 0) {
    throw new Error("No active perspectives configured")
  }

  const targetMs = ymdToUtcMs(toJstDateString(date))
  const startMs = ymdToUtcMs(file.schedule.rotationStartDate)
  const diffDays = Math.floor((targetMs - startMs) / (1000 * 60 * 60 * 24))
  const safeDiff = Math.max(0, diffDays)
  const dayIndex = safeDiff % queries.length
  const cycleNumber = Math.floor(safeDiff / queries.length) + 1
  return {
    query: queries[dayIndex],
    dayIndex,
    totalPerspectives: queries.length,
    cycleNumber,
  }
}

// 今日から N 日先までの予定 (JST ベース)
export function getUpcomingPerspectives(
  fromDate: Date = new Date(),
  days: number = 7,
): Array<{
  dateLabel: string
  query: ExpandedQuery
  cycleNumber: number
}> {
  const out: Array<{
    dateLabel: string
    query: ExpandedQuery
    cycleNumber: number
  }> = []
  const baseMs = ymdToUtcMs(toJstDateString(fromDate))
  for (let i = 0; i < days; i++) {
    const targetMs = baseMs + i * 24 * 60 * 60 * 1000
    const dateLabel = new Date(targetMs).toISOString().slice(0, 10)
    const synthetic = new Date(`${dateLabel}T12:00:00+09:00`)
    const { query, cycleNumber } = getPerspectiveForDate(synthetic)
    out.push({ dateLabel, query, cycleNumber })
  }
  return out
}
