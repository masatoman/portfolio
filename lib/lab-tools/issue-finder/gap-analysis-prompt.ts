import type { Issue } from "./types"

// Gap-driven 次クエリ生成プロンプト。
// 既存の if_issues を AI に渡し、 「これらが含まれていない perspective × 痛み軸」 を
// 5-10 個推薦させる。 出力をもとに masatoman が if_jobs に新規ジョブを追加する。
//
// 本書 (安宅和人『イシューからはじめよ』) の「犬の道」 = 同じ穴を何度も掘る を避ける仕組み。
// 既存 cluster に偏ったまま web_search を続けると、 重複検出で skip されるか、
// 既知のあるあるが厚くなるだけで本質的な選択肢に届かない。

const SYSTEM_INTRO = `あなたは日本のネット 1 次情報 (知恵袋・X・note・mixi・5ch・OpenWork 等) から、 当事者の悲鳴・不満・課題発言を網羅的に集める調査エキスパートです。 既存収集結果の「抜けている切り口」 を発見する役割を担います。

※ このタスクは **構造分析** であって新規ネット検索ではありません。 ChatGPT の Deep Research モードや Perplexity の Pro Search は **OFF** で OK (通常チャットの方が回転が速い)。 もし Web 検索したくなったら個別の固有名詞 (例: 退職代行 工務店 / OpenWork 工務店 等) で 1-2 回参照する程度に留めてください。`

type GapSummaryRow = {
  profile_id: string
  role: string
  tier: string
  title: string
  e: number | null
  h: number | null
  a: number | null
  value: number | null
}

function summarizeIssues(issues: Issue[]): GapSummaryRow[] {
  return issues.map((i) => ({
    profile_id: i.profileId ?? "(unknown)",
    role: i.role ?? "(unknown)",
    tier: i.issueDrivenTier ?? "unscored",
    title: i.title,
    e: i.essentialChoice ?? null,
    h: i.hypothesisDepth ?? null,
    a: i.answerable ?? null,
    value: i.issueDrivenValue ?? null,
  }))
}

function renderIssueTable(rows: GapSummaryRow[]): string {
  // markdown table。 AI が読みやすい形 + tier 順 (value-zone → needs-rework → promising → dog-path) で並べる
  const TIER_ORDER: Record<string, number> = {
    "value-zone": 0,
    "needs-rework": 1,
    promising: 2,
    "dog-path": 3,
    unscored: 4,
  }
  const sorted = [...rows].sort((a, b) => {
    const ta = TIER_ORDER[a.tier] ?? 5
    const tb = TIER_ORDER[b.tier] ?? 5
    if (ta !== tb) return ta - tb
    return (b.value ?? -1) - (a.value ?? -1)
  })
  const header = "| tier | profile/role | value (E+H, A) | title |"
  const sep = "|---|---|---|---|"
  const lines = sorted.map(
    (r) =>
      `| ${r.tier} | ${r.profile_id}/${r.role} | ${r.value ?? "-"} (${r.e ?? "-"}+${r.h ?? "-"}, ${r.a ?? "-"}) | ${r.title.replace(/\|/g, "/")} |`,
  )
  return [header, sep, ...lines].join("\n")
}

function aggregatePerspectiveCoverage(rows: GapSummaryRow[]): string {
  // perspective ごとの carrying capacity (件数 + value-zone/needs-rework の有無)
  const buckets = new Map<
    string,
    { n: number; tiers: Record<string, number>; maxValue: number }
  >()
  for (const r of rows) {
    const key = `${r.profile_id} / ${r.role}`
    const b = buckets.get(key) ?? {
      n: 0,
      tiers: {},
      maxValue: 0,
    }
    b.n += 1
    b.tiers[r.tier] = (b.tiers[r.tier] ?? 0) + 1
    if (r.value !== null && r.value > b.maxValue) b.maxValue = r.value
    buckets.set(key, b)
  }
  const out = ["| perspective | 件数 | tier 内訳 | 最大 value |", "|---|---|---|---|"]
  const sorted = [...buckets.entries()].sort((a, b) => b[1].n - a[1].n)
  for (const [key, b] of sorted) {
    const tierStr = Object.entries(b.tiers)
      .map(([t, n]) => `${t}:${n}`)
      .join(", ")
    out.push(`| ${key} | ${b.n} | ${tierStr} | ${b.maxValue} |`)
  }
  return out.join("\n")
}

export type BuildGapPromptOptions = {
  issues: Issue[]
  /** ターゲット顧客像 (5/22 北原氏面談で確定したもの 等)。 入れると AI 推薦がぶれない */
  targetCustomer?: string
  /** masatoman の制約 (個人開発 / 6 ヶ月 / ¥0 等)。 入れると answerable 推定が現実的に */
  builderConstraint?: string
  /** 推薦数 (デフォルト 8) */
  recommendCount?: number
  /**
   * focus: 特定の perspective に絞って gap 分析する場合。
   * profileId と role を指定すると、 既存 issue をそれで絞ってから AI に渡す。
   * 例: { profileId: "komuten", role: "現場監督" } で 現場監督特化の gap 分析。
   */
  focus?: { profileId: string; role: string }
}

const DEVILS_ADVOCATE_BLOCK = `【Devil's Advocate を必ず混ぜる】
推薦する切り口の中に、 以下のタイプを **必ず 2-3 個** 混ぜてください:
- 業界の通説 (「DX = 良い」「補助金 = ありがたい」「ANDPAD = 効率化」 等) を **真逆から見た投稿** が取れそうな perspective × 痛み軸
- 役職本人ではなく **周辺当事者** (妻 / 経理 / 下請 / アトツギ / OB / 顧客クレーマー / 退職代行担当) の視点
- 既存ツールの「機能不足」 ではなく「使われ方の歪み」 (監視ツール化 / 強要 / 代行入力 等) を狙う切り口`

const OUTPUT_FORMAT = `【出力フォーマット】

# Gap 分析結果

## 1. 既存収集の偏り (3-5 行で要約)
- 強く出ている軸 / 厚すぎる軸 を 3 つ
- 完全に欠落している周辺当事者 / 媒体 / 視点

## 2. 推薦する次クエリ N 個

各推薦は以下のテンプレートで:

### #1. {profile_id (komuten / micro-corp / it-subsidy / financial-planner)} / {role 案 (新規でも可)}

- **狙い**: 何の盲点を埋めるか (1-2 行)
- **本書 3 軸の事前見立て**: E=?? / H=?? / A=?? (採点ガイド付き想定)
- **入り口キーワード 8-12 個**: 自然な口語含めて (例: "もう無理 ◯◯", "◯◯ 続かない", "◯◯ 入れたら 残業 増えた")
- **優先媒体**: 知恵袋 / X / note / 5ch / OpenWork / YouTube コメント / 退職代行ブログ 等 (1 つに絞らず複数)
- **Devil's Advocate 要素**: この切り口がなぜ既存収集で取れなかったか の構造仮説

## 3. 推薦に至らなかったが言及したい盲点
- 媒体多様化案 (例: TikTok / Podcast / 学会脚注 / 業界紙脚注)
- 時系列の歪み (例: 5 年前 vs 今 で何が変わった)`

export function buildGapAnalysisPrompt({
  issues,
  targetCustomer,
  builderConstraint,
  recommendCount = 8,
  focus,
}: BuildGapPromptOptions): string {
  // focus 指定時: 該当 perspective の issue のみで gap 分析。 ただし全体感の参考に他 perspective の集計表も残す
  const focusedIssues = focus
    ? issues.filter(
        (i) => i.profileId === focus.profileId && i.role === focus.role,
      )
    : issues
  const rows = summarizeIssues(focusedIssues)
  const allRows = focus ? summarizeIssues(issues) : rows

  const targetLine = targetCustomer
    ? `\n【ターゲット顧客像】\n${targetCustomer}`
    : ""
  const constraintLine = builderConstraint
    ? `\n【作り手の制約】\n${builderConstraint}`
    : ""
  const focusLine = focus
    ? `\n【🎯 focus】\nこの gap 分析は **${focus.profileId} / ${focus.role}** に絞ります。 推薦も同じ perspective の異なる切り口・周辺当事者で構成すること。 他 profileId への拡散は禁止 (他 perspective に話が逃げると masatoman の手元の友人 1 人にヒアリングできない)。`
    : ""

  const focusOverviewBlock = focus
    ? `\n## 参考: 他 perspective を含む全体 carrying capacity (focus 対象は ${focus.profileId} / ${focus.role})\n${aggregatePerspectiveCoverage(allRows)}\n`
    : ""

  return [
    SYSTEM_INTRO,
    targetLine,
    constraintLine,
    focusLine,
    "",
    "【既存収集サマリ】",
    `## ${focus ? `focus 対象 (${focus.profileId} / ${focus.role}) の` : ""}perspective 別 carrying capacity`,
    aggregatePerspectiveCoverage(rows),
    focusOverviewBlock,
    `## ${focus ? `focus 対象の` : "全"} issue 一覧 (tier 順 + value 順) — ${focusedIssues.length} 件`,
    renderIssueTable(rows),
    "",
    "【あなたの仕事】",
    focus
      ? `上記の **${focus.profileId} / ${focus.role}** の既存 issue 群を見て、 **同じ perspective 内で抜けている切り口・周辺当事者・対立軸 を ${recommendCount} 個** 推薦してください。 既存と重複しない切り口に集中。 他 perspective へは拡散させないこと (友人 1 人にぶつけられる単一 perspective に絞るため)。`
      : `上記の既存 issue 群を見て、 **抜けている perspective × 痛み軸 を ${recommendCount} 個** 推薦してください。 既存と重複しない切り口に集中。`,
    "",
    DEVILS_ADVOCATE_BLOCK,
    "",
    OUTPUT_FORMAT,
    "",
    `※ 推薦は ${recommendCount} ± 2 個。 多すぎても少なすぎても masatoman の処理キャパを超えます。`,
  ]
    .filter(Boolean)
    .join("\n")
}
