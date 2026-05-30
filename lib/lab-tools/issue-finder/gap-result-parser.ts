// ChatGPT 等が gap-analysis-prompt の指示通りに返してきた markdown を
// 1 つの textarea から貼り付けて、 8 推薦を構造化データに変換するパーサ。
//
// 想定フォーマット (gap-analysis-prompt.ts の OUTPUT_FORMAT と整合):
//
// ### #1. komuten / アトツギ本人 (35-45歳・継承中)
//
// - **狙い**: ...
// - **事前見立て**: E=30 / H=25 / A=55 (...)
// - **入り口キーワード**: 「アトツギ つらい」「二代目 社長 孤独」「親父 やり方 古い」...
// - **優先媒体**: note (アトツギ甲子園関連記事)、X (#アトツギ #家業 タグ)
// - **Devil's Advocate要素**: ...
//
// パースは regex ベース、 fail-safe。 推薦数 0 でもエラーにせず空配列返す。

export type ParsedRecommendation = {
  /** #1, #2 等の番号 */
  index: number
  /** 元の見出し全文 (header line) */
  rawHeader: string
  /** profile_id 候補 (komuten / financial-planner / it-subsidy / micro-corp / unknown) */
  profileId: string
  /** 自由記入 role (例: アトツギ本人 (35-45歳・継承中)) */
  role: string
  /** 入り口キーワード (「」 で囲まれた個々のキーワード) */
  keywords: string[]
  /** 推薦された優先媒体 (note / X / 5ch 等) */
  preferredMedia: string[]
  /** Devil's Advocate / 構造仮説の本文 */
  devilsAdvocateNote: string | null
  /** 狙い (目的) の本文 */
  aimNote: string | null
  /** 事前見立て E / H / A */
  essentialChoice: number | null
  hypothesisDepth: number | null
  answerable: number | null
}

const KNOWN_PROFILES = [
  "komuten",
  "financial-planner",
  "it-subsidy",
  "micro-corp",
]

function normalizeProfileGuess(s: string): string {
  const low = s.trim().toLowerCase().replace(/\s+/g, "")
  // 日本語 → ID 推定
  if (low.includes("工務店") || low.includes("komuten") || low.includes("建設"))
    return "komuten"
  if (
    low.includes("fp") ||
    low.includes("ファイナンシャル") ||
    low.includes("financial")
  )
    return "financial-planner"
  if (low.includes("補助金") || low.includes("it-subsidy") || low.includes("itsubsidy"))
    return "it-subsidy"
  if (
    low.includes("マイクロ") ||
    low.includes("micro") ||
    low.includes("個人事業") ||
    low.includes("フリーランス")
  )
    return "micro-corp"
  // そのまま KNOWN なら返す
  for (const p of KNOWN_PROFILES) {
    if (low === p) return p
  }
  return "unknown"
}

/** 「」 で囲まれた語を全部抜く。 ない場合は読点 / カンマ区切りで分割 */
function extractKeywords(line: string): string[] {
  const matches = [...line.matchAll(/「([^」]+)」/g)].map((m) => m[1].trim())
  if (matches.length > 0) return matches.filter((s) => s.length > 0)
  // フォールバック: 読点 / カンマ / 中黒区切り
  return line
    .replace(/^[-*]\s*\*\*[^*]*\*\*\s*[:：]?\s*/u, "")
    .split(/[、,・]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && s.length < 80)
}

/** E=30 / H=25 / A=55 を抽出 */
function extractScores(line: string): {
  e: number | null
  h: number | null
  a: number | null
} {
  const e = /E\s*=\s*(\d{1,3})/i.exec(line)
  const h = /H\s*=\s*(\d{1,3})/i.exec(line)
  const a = /A\s*=\s*(\d{1,3})/i.exec(line)
  return {
    e: e ? Math.min(50, Number.parseInt(e[1], 10)) : null,
    h: h ? Math.min(50, Number.parseInt(h[1], 10)) : null,
    a: a ? Math.min(100, Number.parseInt(a[1], 10)) : null,
  }
}

/** 推薦見出し: ### #1. profile / role (...) を 1 つパース */
function parseHeader(header: string): { profileId: string; role: string } {
  // "### #1. komuten / アトツギ本人 (35-45歳)" や "### #2. komuten/経理担当の妻" 等
  const stripped = header
    .replace(/^#{1,6}\s*/, "")
    .replace(/^#?\d+\.\s*/, "")
    .trim()
  // "/" で分割し前半 = profile, 後半 = role
  const slashIdx = stripped.indexOf("/")
  if (slashIdx < 0) {
    return { profileId: normalizeProfileGuess(stripped), role: stripped }
  }
  const profilePart = stripped.slice(0, slashIdx).trim()
  const rolePart = stripped.slice(slashIdx + 1).trim()
  return {
    profileId: normalizeProfileGuess(profilePart),
    role: rolePart || profilePart,
  }
}

/** 1 推薦ブロックをパース */
function parseBlock(block: string, index: number): ParsedRecommendation | null {
  const lines = block.split(/\r?\n/)
  if (lines.length === 0) return null
  const header = lines[0].trim()
  const { profileId, role } = parseHeader(header)
  if (!role) return null

  let keywords: string[] = []
  let preferredMedia: string[] = []
  let devilsAdvocateNote: string | null = null
  let aimNote: string | null = null
  let scores = { e: null as number | null, h: null as number | null, a: null as number | null }

  for (const rawLine of lines.slice(1)) {
    const line = rawLine.trim()
    if (line.length === 0) continue
    // 入り口キーワード行
    if (/(入り口キーワード|キーワード|keywords?)/i.test(line) && line.includes(":") || /\*\*入り口キーワード\*\*|\*\*キーワード\*\*/i.test(line)) {
      const valuePart = line.replace(/^.*?[:：]\s*/, "")
      keywords = extractKeywords(valuePart)
    } else if (/(優先媒体|media)/i.test(line) && (line.includes(":") || line.includes("："))) {
      const valuePart = line.replace(/^.*?[:：]\s*/, "")
      preferredMedia = valuePart
        .split(/[、,]/)
        .map((s) => s.trim().replace(/\([^)]*\)/g, "").trim())
        .filter((s) => s.length > 0)
    } else if (
      /(Devil|デビル|Devil's Advocate|構造仮説)/i.test(line) &&
      (line.includes(":") || line.includes("："))
    ) {
      devilsAdvocateNote = line.replace(/^.*?[:：]\s*/, "")
    } else if (/(狙い|aim)/i.test(line) && (line.includes(":") || line.includes("："))) {
      aimNote = line.replace(/^.*?[:：]\s*/, "")
    } else if (/(事前見立て|本書 3 軸|scores?)/i.test(line)) {
      scores = extractScores(line)
    }
  }

  return {
    index,
    rawHeader: header,
    profileId,
    role,
    keywords,
    preferredMedia,
    devilsAdvocateNote,
    aimNote,
    essentialChoice: scores.e,
    hypothesisDepth: scores.h,
    answerable: scores.a,
  }
}

/**
 * markdown 全体から推薦見出しを検出してブロック分割。
 * 推薦見出しの定義: h3 以上 (###) + 「#N.」 (= 数値前に # 必須) または、
 * h3 以上 + 「N. profile/role」 形式 (# 無くても、 ヘッダ内に「/」 が含まれていれば推薦扱い)。
 * h1/h2 (#/##) のセクション見出し (例: `## 1. 既存収集の偏り`) は誤検知防止のため除外。
 */
export function parseChatGPTGapResult(markdown: string): ParsedRecommendation[] {
  if (!markdown || typeof markdown !== "string") return []
  // h3 以上で数値開始のヘッダだけを推薦見出しとして split
  const blocks = markdown.split(/(?=^#{3,6}\s*#?\d+\.\s)/m)
  const results: ParsedRecommendation[] = []
  let idx = 0
  for (const block of blocks) {
    const headerMatch = block.match(/^(#{3,6})\s*(#?\d+)\.\s/m)
    if (!headerMatch) continue
    // 「#1.」 (# 必須) or ヘッダ内に「/」 ありなら推薦扱い
    const hasHash = headerMatch[2].startsWith("#")
    const firstLine = block.split(/\r?\n/, 1)[0]
    const hasSlash = firstLine.includes("/")
    if (!hasHash && !hasSlash) continue
    idx += 1
    const parsed = parseBlock(block, idx)
    if (parsed) results.push(parsed)
  }
  return results
}
