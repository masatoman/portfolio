// issue-finder のスコア計算と類似度を集約するモジュール。
// SKILL / sample-data / API すべてここを参照することで式のブレを防ぐ。

export type IssueScoreInput = {
  clusterSize: number
  samplingTotal: number
  /** 0-100。 引用の感情強度の中央値 */
  emotionScore: number
  /**
   * 業界インパクト加点 (0-30)
   * - 0-10: ニッチな業務 / 一部の人だけ
   * - 11-20: 業界全体に通底する慢性的問題
   * - 21-30: 訴訟 / 廃業 / 人材流出 / 家庭崩壊レベルの致命的影響
   */
  industryImpact: number
}

/**
 * issueScore = clamp( base * 1.5 + impactBonus + emotionAdjust, 0, 100 )
 *   base = (clusterSize / samplingTotal) * 100
 *   impactBonus = 0-30
 *   emotionAdjust = (emotion - 50) / 5  → -10 〜 +10
 */
export function computeIssueScore({
  clusterSize,
  samplingTotal,
  emotionScore,
  industryImpact,
}: IssueScoreInput): number {
  if (samplingTotal <= 0) return 0
  const base = (clusterSize / samplingTotal) * 100
  const impactBonus = Math.max(0, Math.min(30, industryImpact))
  const emotionAdjust = (emotionScore - 50) / 5
  return clamp(Math.round(base * 1.5 + impactBonus + emotionAdjust), 0, 100)
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n))
}

// ────────────────────────────────────────
// タイトル類似度 (重複検出用)
// ────────────────────────────────────────

/**
 * trigram 集合の Jaccard 類似度。 短い日本語タイトルでも安定して動く軽量実装。
 * 0.0 (全く違う) 〜 1.0 (完全一致)
 */
export function titleSimilarity(a: string, b: string): number {
  const sa = trigrams(normalize(a))
  const sb = trigrams(normalize(b))
  if (sa.size === 0 && sb.size === 0) return 1
  if (sa.size === 0 || sb.size === 0) return 0
  let inter = 0
  for (const t of sa) if (sb.has(t)) inter += 1
  const union = sa.size + sb.size - inter
  return union === 0 ? 0 : inter / union
}

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\s　、。・「」『』【】〈〉()()\[\]]/g, "")
    .replace(/[!-/:-@[-`{-~]/g, "")
}

function trigrams(s: string): Set<string> {
  const out = new Set<string>()
  if (s.length < 3) {
    if (s.length > 0) out.add(s)
    return out
  }
  for (let i = 0; i < s.length - 2; i++) {
    out.add(s.slice(i, i + 3))
  }
  return out
}

// 重複しきい値 (0-1)。 これ以上の類似度なら同じイシューとして扱う
export const DUPLICATE_TITLE_THRESHOLD = 0.7

// ────────────────────────────────────────
// issueScore の偏差値ティア (UI 色分け用)
// 母集団: 工務店現場監督の 20 クラスタ実測 (mean=45.2, sd=10.1) より算出
// ────────────────────────────────────────

export type IssueTier = "critical" | "high" | "medium" | "low"

export function classifyIssueTier(issueScore: number): IssueTier {
  if (issueScore >= 65) return "critical" // 偏差値 70+ : 即動け
  if (issueScore >= 55) return "high" // 偏差値 60-70 : 注目
  if (issueScore >= 45) return "medium" // 偏差値 50-60 : 観察
  return "low" // 偏差値 <50 : 弱シグナル
}

export const TIER_LABEL: Record<IssueTier, string> = {
  critical: "即動け",
  high: "注目",
  medium: "観察",
  low: "弱シグナル",
}

// ────────────────────────────────────────
// 個人事業適合度 (masatoman 視点)
// issueScore は『業界全体での重要度』。 personalFit は『自分の事業に直結する度合い』。
// 両方足した opportunityScore が masatoman さんの動くべき優先順位を示す.
// ────────────────────────────────────────

export type PersonalFitInput = {
  subsidyTags: readonly string[] // ["it-introduction" | "jizokuka" | ...] 補助金タグあり = +20
  industryTags: readonly string[] // 主顧客直撃 (工務店/マイクロ法人) なら +20
  title: string // ツール愚痴クラスタ (ANDPAD/freee/kintone 等の固有名) なら +20
  painSummary: string // SaaS / アプリ / ツール 等の単語で +技術的着手可能性 +20
  solvabilityScore: number // 65+ で「既存 portfolio / lab tools と接続可能」加点 +20
}

const MAIN_TARGET_INDUSTRIES = [
  "建設",
  "工務店",
  "施工管理",
  "マイクロ法人",
  "個人事業主",
  "フリーランス",
]

const WATCHED_TOOL_NAMES = [
  "andpad",
  "ANDPAD",
  "アンドパッド",
  "photoruction",
  "フォトラクション",
  "ミライ工事",
  "蔵衛門",
  "eyacho",
  "eYACHO",
  "kintone",
  "キントーン",
  "freee",
  "フリー",
  "マネーフォワード",
  "弥生",
]

const TECH_KEYWORDS = [
  "SaaS",
  "アプリ",
  "ツール",
  "ソフト",
  "システム",
  "DX",
  "AI",
  "クラウド",
  "Web",
]

// ────────────────────────────────────────
// 競合密度 (claude.ai 2026-05-11 指摘の Layer 1: 「需要 ≠ 参入余地」軸)
// クラスタ内に watchedTools (ANDPAD / freee / kintone 等) が頻出 = 競合が既に占有 = 密度高
// 低いほど masatoman に有利。 競合薄い領域こそ個人事業の参入余地
// ────────────────────────────────────────

const WATCHED_TOOL_NAMES_FOR_DENSITY = WATCHED_TOOL_NAMES // 上で定義済みのリストを再利用

export type CompetitorDensityInput = {
  title: string
  painSummary: string
  scoreReason?: string | null
  sourceExcerpt?: string | null
  relatedQuotes?: ReadonlyArray<{ excerpt: string }>
}

export function computeCompetitorDensity({
  title,
  painSummary,
  scoreReason,
  sourceExcerpt,
  relatedQuotes,
}: CompetitorDensityInput): number {
  const haystack = [
    title,
    painSummary,
    scoreReason ?? "",
    sourceExcerpt ?? "",
    ...(relatedQuotes ?? []).map((q) => q.excerpt),
  ]
    .join("\n")
    .toLowerCase()

  // ヒットした固有ツール名の種類数で密度を判定
  const hitTools = new Set<string>()
  for (const t of WATCHED_TOOL_NAMES_FOR_DENSITY) {
    if (haystack.includes(t.toLowerCase())) hitTools.add(t.toLowerCase())
  }
  const hitCount = hitTools.size

  // 0 ツール = 競合密度低 (技術問題ではなく労務・文化問題 等)
  // 1-2 ツール = 中
  // 3+ ツール = 高 (写真台帳のように複数 SaaS が占有)
  if (hitCount === 0) return 15
  if (hitCount === 1) return 40
  if (hitCount === 2) return 65
  return 85
}

// ────────────────────────────────────────
// 販売チャネル難易度 (claude.ai 2026-05-11 指摘の Layer 3)
// 工務店 = 対面営業必須 = 高、 個人事業主・マイクロ法人 = Web 完結可 = 低
// 低いほど masatoman (個人開発者) に売りやすい
// ────────────────────────────────────────

const CHANNEL_DIFFICULTY_BY_INDUSTRY: ReadonlyArray<{
  match: readonly string[]
  difficulty: number
  reason: string
}> = [
  {
    match: ["建設", "工務店", "施工管理"],
    difficulty: 80,
    reason: "対面営業必須・補助金支援事業者経由・商工会議所等の中間業者依存",
  },
  {
    match: ["飲食", "小売", "宿泊", "美容"],
    difficulty: 75,
    reason: "対面営業 + 商工会主体、 個人開発者が苦手な領域",
  },
  {
    match: ["医療", "福祉", "介護"],
    difficulty: 85,
    reason: "規制・実績重視で個人開発者の参入障壁高い",
  },
  {
    match: ["個人事業主", "フリーランス", "マイクロ法人", "副業"],
    difficulty: 35,
    reason: "Web 完結可・SNS リーチ可・直接購入可能",
  },
  {
    match: ["IT", "エンジニア", "開発者", "プログラマ"],
    difficulty: 30,
    reason: "Web 完結・SEO + SNS で届く",
  },
  {
    match: ["IT導入補助金", "補助金", "持続化"],
    difficulty: 55,
    reason: "中間業者 (商工会議所・支援事業者) 経由が多いが Web 申請も増加中",
  },
]

export function computeSalesChannelDifficulty(
  industryTags: readonly string[],
): { score: number; reason: string } {
  const text = industryTags.join(" ")
  for (const rule of CHANNEL_DIFFICULTY_BY_INDUSTRY) {
    if (rule.match.some((m) => text.includes(m))) {
      return { score: rule.difficulty, reason: rule.reason }
    }
  }
  // デフォルト: 中間
  return { score: 60, reason: "業種不明・中間値" }
}

export function computePersonalFit({
  subsidyTags,
  industryTags,
  title,
  painSummary,
  solvabilityScore,
}: PersonalFitInput): number {
  let fit = 0

  // 1. 補助金親和性あり = 補助金支援の主戦場と直結
  if (subsidyTags.some((t) => t !== "none")) fit += 20

  // 2. 主顧客層 (工務店 / マイクロ法人 等) を含む
  const text = `${title}\n${painSummary}\n${industryTags.join(" ")}`
  if (MAIN_TARGET_INDUSTRIES.some((t) => text.includes(t))) fit += 20

  // 3. ツール愚痴クラスタ = 代替 SaaS 開発のチャンス
  if (WATCHED_TOOL_NAMES.some((t) => text.toLowerCase().includes(t.toLowerCase()))) fit += 20

  // 4. 技術系の単語 (SaaS / アプリ / ツール / DX 等) を含む = Next.js + AI で着手可能
  if (TECH_KEYWORDS.some((t) => text.toLowerCase().includes(t.toLowerCase()))) fit += 20

  // 5. 解の質が高い = 既存 portfolio / lab tools と接続可能
  if (solvabilityScore >= 65) fit += 20

  return clamp(fit, 0, 100)
}

/**
 * opportunityScore = 5 軸統合 (claude.ai 2026-05-11 指摘を反映)
 *   issueScore × 0.25         業界での重要度 (頻度ベース)
 * + solvabilityScore × 0.30   解ける度合い
 * + personalFit × 0.20        個人事業との適合度
 * + (100 - competitorDensity) × 0.15  競合の薄さ (低いほど高得点)
 * + (100 - salesChannelDifficulty) × 0.10  売りやすさ (低いほど高得点)
 *
 * 競合密度や販売チャネル難易度を引数省略すると、 旧 3 軸式で計算する (後方互換).
 */
export function computeOpportunityScore({
  issueScore,
  solvabilityScore,
  personalFit,
  competitorDensity,
  salesChannelDifficulty,
}: {
  issueScore: number
  solvabilityScore: number
  personalFit: number
  competitorDensity?: number
  salesChannelDifficulty?: number
}): number {
  if (
    typeof competitorDensity !== "number" ||
    typeof salesChannelDifficulty !== "number"
  ) {
    // 旧 3 軸 (後方互換)
    return clamp(
      Math.round(issueScore * 0.3 + solvabilityScore * 0.4 + personalFit * 0.3),
      0,
      100,
    )
  }
  const competitorAdvantage = 100 - clamp(competitorDensity, 0, 100)
  const channelEasiness = 100 - clamp(salesChannelDifficulty, 0, 100)
  return clamp(
    Math.round(
      issueScore * 0.25 +
        solvabilityScore * 0.3 +
        personalFit * 0.2 +
        competitorAdvantage * 0.15 +
        channelEasiness * 0.1,
    ),
    0,
    100,
  )
}

export function classifyOpportunityTier(opportunityScore: number): IssueTier {
  // opportunityScore は加重平均なので分布が狭い → やや低めのカット点に
  if (opportunityScore >= 70) return "critical"
  if (opportunityScore >= 55) return "high"
  if (opportunityScore >= 40) return "medium"
  return "low"
}

// ────────────────────────────────────────
// ソート (UI 用)
// ────────────────────────────────────────

export type SortKey =
  | "opportunity" // 動くべき度 ↓ (デフォルト推奨)
  | "trueIssueFirst" // 🎯 真のイシューを上、 その後 動くべき度
  | "issue" // イシュー度 ↓
  | "clusterRatio" // 規模 (clusterSize / samplingTotal) ↓
  | "createdAt" // 新着順 ↓

export const SORT_LABEL: Record<SortKey, string> = {
  opportunity: "動くべき度 ↓",
  trueIssueFirst: "🎯 真のイシュー優先",
  issue: "イシュー度 ↓",
  clusterRatio: "規模 (比率) ↓",
  createdAt: "新着順 ↓",
}

type IssueLike = {
  id: string
  title: string
  painSummary: string
  emotionScore: number
  issueScore: number
  solvabilityScore: number
  subsidyTags: readonly string[]
  industryTags: readonly string[]
  clusterSize?: number | null
  samplingTotal?: number | null
  createdAt: string
}

function getOpportunity(i: IssueLike): number {
  const fit = computePersonalFit({
    subsidyTags: i.subsidyTags,
    industryTags: i.industryTags,
    title: i.title,
    painSummary: i.painSummary,
    solvabilityScore: i.solvabilityScore,
  })
  const competitorDensity = computeCompetitorDensity({
    title: i.title,
    painSummary: i.painSummary,
    scoreReason: (i as { scoreReason?: string | null }).scoreReason,
    sourceExcerpt: (i as { sourceExcerpt?: string | null }).sourceExcerpt,
    relatedQuotes: (i as { relatedQuotes?: ReadonlyArray<{ excerpt: string }> })
      .relatedQuotes,
  })
  const { score: salesChannelDifficulty } = computeSalesChannelDifficulty(
    i.industryTags,
  )
  return computeOpportunityScore({
    issueScore: i.issueScore,
    solvabilityScore: i.solvabilityScore,
    personalFit: fit,
    competitorDensity,
    salesChannelDifficulty,
  })
}

function getClusterRatio(i: IssueLike): number {
  if (!i.clusterSize || !i.samplingTotal || i.samplingTotal === 0) return 0
  return i.clusterSize / i.samplingTotal
}

function isTrueIssue(i: IssueLike): boolean {
  return i.issueScore >= 50 && i.solvabilityScore >= 50
}

export function sortIssues<T extends IssueLike>(
  issues: T[],
  key: SortKey,
): T[] {
  const arr = [...issues]
  switch (key) {
    case "opportunity":
      return arr.sort((a, b) => getOpportunity(b) - getOpportunity(a))
    case "trueIssueFirst":
      return arr.sort((a, b) => {
        const ta = isTrueIssue(a) ? 1 : 0
        const tb = isTrueIssue(b) ? 1 : 0
        if (ta !== tb) return tb - ta
        return getOpportunity(b) - getOpportunity(a)
      })
    case "issue":
      return arr.sort((a, b) => b.issueScore - a.issueScore)
    case "clusterRatio":
      return arr.sort((a, b) => getClusterRatio(b) - getClusterRatio(a))
    case "createdAt":
      return arr.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    default:
      return arr
  }
}
