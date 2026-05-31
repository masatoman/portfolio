import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { isSupabaseConfigured } from "@/lib/supabase/server"
import type { Issue, RelatedQuote, SourceType, SubsidyTag } from "./types"

export type JobStatus = "pending" | "processing" | "completed" | "failed"

export type CollectionJob = {
  id: string
  profileId: string
  role: string
  samplingTarget: number
  extraNotes: string | null
  rawInputText: string | null
  hasRawInput: boolean // raw_input_text が入っているかの簡易フラグ
  status: JobStatus
  startedAt: string | null
  finishedAt: string | null
  issuesCreated: number
  errorMessage: string | null
  summary: Record<string, unknown> | null
  createdAt: string
  updatedAt: string
  // ad-hoc mode (ChatGPT 推薦切り口を queries.json 無しで投入)
  isAdhoc: boolean
  customRole: string | null
  customKeywords: string[]
  customWatchedTools: string[]
  customExamplePhrases: string[]
}

export type IssueRow = {
  id: string
  title: string
  pain_summary: string
  episode: string | null
  emotion_score: number
  issue_score: number
  solvability_score: number
  score_reason: string | null
  subsidy_tags: string[] | null
  industry_tags: string[] | null
  source_url: string | null
  source_excerpt: string | null
  source_type: string | null
  cluster_size: number | null
  sampling_total: number | null
  related_quotes: RelatedQuote[] | null
  profile_id: string | null
  role: string | null
  job_id: string | null
  run_date: string | null
  // 本書フレーム 3 軸 (旧 row には NULL)
  essential_choice: number | null
  hypothesis_depth: number | null
  answerable: number | null
  issue_driven_value: number | null
  issue_driven_tier:
    | "value-zone"
    | "promising"
    | "needs-rework"
    | "dog-path"
    | null
  created_at: string
  updated_at: string
}

export type JobRow = {
  id: string
  profile_id: string
  role: string
  sampling_target: number
  extra_notes: string | null
  raw_input_text?: string | null
  // egress 対策: list 取得では本文を運ばず、生成列の有無フラグだけ取る
  has_raw_input?: boolean | null
  status: JobStatus
  started_at: string | null
  finished_at: string | null
  issues_created: number | null
  error_message: string | null
  summary: Record<string, unknown> | null
  created_at: string
  updated_at: string
  // ad-hoc mode (ChatGPT 推薦切り口を queries.json 無しで投入)
  is_adhoc: boolean | null
  custom_role: string | null
  custom_keywords: string[] | null
  custom_watched_tools: string[] | null
  custom_example_phrases: string[] | null
}

// snake_case → camelCase + Issue 型に正規化
export function rowToIssue(row: IssueRow): Issue {
  return {
    id: row.id,
    title: row.title,
    painSummary: row.pain_summary,
    episode: row.episode,
    emotionScore: row.emotion_score,
    issueScore: row.issue_score,
    solvabilityScore: row.solvability_score,
    scoreReason: row.score_reason,
    subsidyTags: ((row.subsidy_tags ?? []) as SubsidyTag[]),
    industryTags: row.industry_tags ?? [],
    sourceUrl: row.source_url,
    sourceExcerpt: row.source_excerpt,
    sourceType: (row.source_type as SourceType | null) ?? null,
    createdAt: row.created_at,
    clusterSize: row.cluster_size,
    samplingTotal: row.sampling_total,
    relatedQuotes: row.related_quotes ?? [],
    essentialChoice: row.essential_choice,
    hypothesisDepth: row.hypothesis_depth,
    answerable: row.answerable,
    issueDrivenValue: row.issue_driven_value,
    issueDrivenTier: row.issue_driven_tier,
  }
}

// ジョブ一覧の取得列。 raw_input_text (最大 20 万字) は意図的に除外し、
// 有無は生成列 has_raw_input で軽量に取る (egress 暴走対策)。
export const JOB_LIST_COLUMNS =
  "id,profile_id,role,sampling_target,extra_notes,status,started_at,finished_at,issues_created,error_message,summary,created_at,updated_at,is_adhoc,custom_role,custom_keywords,custom_watched_tools,custom_example_phrases,has_raw_input"

export function rowToJob(row: JobRow): CollectionJob {
  return {
    id: row.id,
    profileId: row.profile_id,
    role: row.role,
    samplingTarget: row.sampling_target,
    extraNotes: row.extra_notes,
    rawInputText: row.raw_input_text ?? null,
    hasRawInput:
      row.has_raw_input ??
      (typeof row.raw_input_text === "string" && row.raw_input_text.length > 0),
    status: row.status,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    issuesCreated: row.issues_created ?? 0,
    errorMessage: row.error_message,
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    isAdhoc: row.is_adhoc ?? false,
    customRole: row.custom_role,
    customKeywords: row.custom_keywords ?? [],
    customWatchedTools: row.custom_watched_tools ?? [],
    customExamplePhrases: row.custom_example_phrases ?? [],
  }
}

// Server Component から呼ぶ。 Supabase 未設定なら空配列を返す (UI は壊れない)
// order: 本書 issue_driven_value を主軸 (NULL は末尾)、 同点で旧 issue_score
export async function fetchRecentIssues(limit = 300): Promise<Issue[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from("if_issues")
      .select("*")
      .order("issue_driven_value", { ascending: false, nullsFirst: false })
      .order("issue_score", { ascending: false })
      .limit(limit)
    if (error || !data) return []
    return data.map((r) => rowToIssue(r as IssueRow))
  } catch {
    return []
  }
}

export async function fetchRecentJobs(limit = 20): Promise<CollectionJob[]> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from("if_jobs")
      .select(JOB_LIST_COLUMNS)
      .order("created_at", { ascending: false })
      .limit(limit)
    if (error || !data) return []
    return data.map((r) => rowToJob(r as unknown as JobRow))
  } catch {
    return []
  }
}

export type PerspectiveRunStatus = {
  profileId: string
  role: string
  drRunCount: number // Deep Research モード (raw_input_text あり) で完了したジョブ数
  wsRunCount: number // web_search モード (raw_input_text なし) で完了したジョブ数
  lastRunAt: string | null
}

// perspective (profileId × role) ごとの完了ジョブ数 + 最終実行日時を集計。
// raw_input_text の有無で DR (Deep Research) / WS (web_search) を区別。
// select の option に「DR ✓N / WS ✓M (最終 5/14)」 を出すための材料。
export async function fetchPerspectiveRunStatus(): Promise<
  PerspectiveRunStatus[]
> {
  if (!isSupabaseConfigured()) return []
  try {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase
      .from("if_jobs")
      .select("profile_id, role, created_at, has_raw_input")
      .eq("status", "completed")
    if (error || !data) return []

    const map = new Map<string, PerspectiveRunStatus>()
    for (const row of data as Array<{
      profile_id: string
      role: string
      created_at: string
      has_raw_input: boolean | null
    }>) {
      const key = `${row.profile_id}::${row.role}`
      const existing = map.get(key) ?? {
        profileId: row.profile_id,
        role: row.role,
        drRunCount: 0,
        wsRunCount: 0,
        lastRunAt: null,
      }
      const isDr = row.has_raw_input === true
      if (isDr) existing.drRunCount += 1
      else existing.wsRunCount += 1
      if (!existing.lastRunAt || row.created_at > existing.lastRunAt) {
        existing.lastRunAt = row.created_at
      }
      map.set(key, existing)
    }
    return Array.from(map.values())
  } catch {
    return []
  }
}
