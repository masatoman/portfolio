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

  // 「イシューからはじめよ」 (安宅和人) フレーム — SKILL が手採点した質的 3 軸 + 算出値
  essentialChoice?: number | null // 0-50: 解くと方向性が変わるか
  hypothesisDepth?: number | null // 0-50: 常識を覆す洞察があるか
  answerable?: number | null // 0-100: 今の masatoman で解けるか
  issueDrivenValue?: number | null // 0-100: (essential + hypothesis) × answerable / 100
  issueDrivenTier?: IssueDrivenTier | null
}

/** 本書フレームの tier (序章 図 2「バリューのマトリクス」 + 図 4「犬の道」) */
export type IssueDrivenTier =
  | "value-zone" // 🟢 右上象限 = バリュー帯
  | "promising" // 🟡 磨けば候補
  | "needs-rework" // 🔶 本質だが今は無理
  | "dog-path" // ⚪ 犬の道

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
