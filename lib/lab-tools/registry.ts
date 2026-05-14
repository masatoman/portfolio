export const LAB_NEON = {
  cyan: "#00f0ff",
  magenta: "#ff3df0",
  green: "#39ff14",
  amber: "#ffb800",
} as const

export type LabAccent = keyof typeof LAB_NEON

export type LabToolStatus = "live" | "beta" | "wip"

export type LabTool = {
  slug: string
  title: string
  desc: string
  icon: string
  accent: LabAccent
  status: LabToolStatus
}

export const labTools: LabTool[] = [
  {
    slug: "issue-finder",
    title: "イシュー発見・1次情報解析ツール",
    desc: "ネット上の悲鳴 (知恵袋・レビュー・SNS) から、不満の根本原因・スコア根拠・補助金親和性を構造化抽出。『イシューからはじめよ』の 2 軸マトリクスで真に解くべき課題を可視化し、Notion にそのまま貼れる Markdown で書き出す。",
    icon: "🔍",
    accent: "green",
    status: "beta",
  },
  {
    slug: "officer-compensation-sim",
    title: "役員報酬 最適化シミュレーター",
    desc: "個人事業 + マイクロ法人の利益見込みから、社保・所得税・法人税の合計を最小化する役員報酬月額をグラフで探す。",
    icon: "💰",
    accent: "cyan",
    status: "live",
  },
  {
    slug: "subsidy-match",
    title: "AI 補助金診断",
    desc: "業種・人数・課題・買いたいものを入れると、主要補助金 (IT 導入 / 持続化 / ものづくり等) との合致率と不足要件を返す。",
    icon: "🎯",
    accent: "magenta",
    status: "live",
  },
  {
    slug: "subsidy-plan-writer",
    title: "事業計画 逆算ジェネレーター",
    desc: "買いたい機材と業務課題を入れると、IT 導入補助金の事業計画書ドラフト (である調・行政文書寄り) を生成。",
    icon: "📝",
    accent: "green",
    status: "live",
  },
  {
    slug: "dev-productivity-report",
    title: "残業撃退 定量化レポーター",
    desc: "開発工数ログを入れると、ツール導入前後の改善グラフと補助金成果報告書向けの文章を生成。",
    icon: "📊",
    accent: "amber",
    status: "live",
  },
  {
    slug: "evidence-organizer",
    title: "証跡 (エビデンス) 整理くん",
    desc: "領収書・通帳画像をアップすると、AI が日付・金額・支払先・用途を抽出して補助金報告フォーマットの CSV にする。",
    icon: "🧾",
    accent: "cyan",
    status: "live",
  },
]
