export type SubsidyTag = "it-introduction" | "jizokuka" | "monodzukuri" | "saikochiku" | "none"

export type SourceType = "chiebukuro" | "review" | "sns" | "blog" | "interview" | "other"

export type RelatedQuote = {
  excerpt: string
  sourceUrl: string | null
}

export type Issue = {
  id: string
  title: string
  painSummary: string
  episode: string | null
  emotionScore: number
  issueScore: number
  solvabilityScore: number
  scoreReason: string | null
  subsidyTags: SubsidyTag[]
  industryTags: string[]
  sourceUrl: string | null
  sourceExcerpt: string | null
  sourceType: SourceType | null
  createdAt: string

  // どの perspective (queries.json) から生まれた issue か (DB は profile_id / role)
  profileId?: string | null
  role?: string | null

  // クラスタリング型 routine の出力 (手動入力 / レガシーは undefined)
  clusterSize?: number | null
  samplingTotal?: number | null // クラスタリング元サンプル数 (例: 150 件中 32 件)
  relatedQuotes?: RelatedQuote[]
}

export type AnalyzeRequest = {
  text: string
  sourceUrl?: string
  sourceType?: SourceType
}

export type AnalyzeResponse = {
  mode: "ai" | "sample"
  issues: Issue[]
  modelName?: string
}
