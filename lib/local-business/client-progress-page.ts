export type ProjectMilestoneStatus = "完了" | "進行中" | "予定"

export type ProjectMilestone = {
  id: string
  order: number
  stage: string
  status: ProjectMilestoneStatus
  completedAt?: string
  scheduledAt?: string
  summary: string
  photoCount: number
  swatch: string
}

export const sampleProjectMeta = {
  projectName: "山田邸 新築工事",
  ownerName: "山田 健一 様",
  builderName: "井原工務店",
  startedAt: "2026-02-01",
  expectedFinish: "2026-08-15",
  publicUrlSuffix: "yamada-2026",
}

export const sampleProjectMilestones: ProjectMilestone[] = [
  {
    id: "milestone-1",
    order: 1,
    stage: "解体・地盤改良",
    status: "完了",
    completedAt: "2026-02-12",
    summary: "既存建屋の解体と 地盤調査を実施。表層改良で 補強完了。",
    photoCount: 18,
    swatch: "#94a3b8",
  },
  {
    id: "milestone-2",
    order: 2,
    stage: "基礎工事",
    status: "完了",
    completedAt: "2026-03-08",
    summary: "ベタ基礎の 配筋検査 合格後、 コンクリート 打設・養生 完了。",
    photoCount: 32,
    swatch: "#3b82f6",
  },
  {
    id: "milestone-3",
    order: 3,
    stage: "上棟",
    status: "完了",
    completedAt: "2026-04-02",
    summary: "土台・柱・梁の組み立て、 屋根の野地板まで 1日で完了。",
    photoCount: 24,
    swatch: "#f97316",
  },
  {
    id: "milestone-4",
    order: 4,
    stage: "屋根・外壁工事",
    status: "進行中",
    scheduledAt: "2026-05-30",
    summary: "屋根の防水・外壁の下地 完了。 サイディング張り 50%まで進行。",
    photoCount: 12,
    swatch: "#0e7490",
  },
  {
    id: "milestone-5",
    order: 5,
    stage: "断熱・内装下地",
    status: "予定",
    scheduledAt: "2026-06-15",
    summary: "壁・天井の 断熱材 充填、 石膏ボード 張り。",
    photoCount: 0,
    swatch: "#d97706",
  },
  {
    id: "milestone-6",
    order: 6,
    stage: "内装仕上げ",
    status: "予定",
    scheduledAt: "2026-07-10",
    summary: "クロス・フローリング・ 建具の取付け。",
    photoCount: 0,
    swatch: "#7c3aed",
  },
  {
    id: "milestone-7",
    order: 7,
    stage: "設備工事",
    status: "予定",
    scheduledAt: "2026-07-30",
    summary: "キッチン・浴室・ 給排水・電気設備の 取付けと 試運転。",
    photoCount: 0,
    swatch: "#06b6d4",
  },
  {
    id: "milestone-8",
    order: 8,
    stage: "外構・引き渡し",
    status: "予定",
    scheduledAt: "2026-08-15",
    summary: "外構工事、 完成検査、 鍵の引き渡し。",
    photoCount: 0,
    swatch: "#10b981",
  },
]

export type ProjectQuestion = {
  id: string
  askedBy: string
  askedAt: string
  question: string
  answer?: string
  answeredAt?: string
}

export const sampleQuestions: ProjectQuestion[] = [
  {
    id: "q-1",
    askedBy: "山田 健一",
    askedAt: "2026-04-15T10:30",
    question: "リビングの 窓の位置 もう少し東側に ずらせますか？",
    answer:
      "ご相談ありがとうございます。 構造上 30cm までは 移動可能です。 来週の打合せで 図面を 一緒に確認させてください。",
    answeredAt: "2026-04-15T14:20",
  },
  {
    id: "q-2",
    askedBy: "山田 由美",
    askedAt: "2026-05-02T19:15",
    question: "外壁のサイディング、 サンプルとは 少し違って見えますが 大丈夫ですか？",
    answer:
      "天気と光の角度で 印象が変わります。 完成時には サンプル通りの仕上がりになります。 写真を追加でお送りします。",
    answeredAt: "2026-05-02T20:40",
  },
  {
    id: "q-3",
    askedBy: "山田 健一",
    askedAt: "2026-05-08T09:00",
    question: "内装の 進捗が見られるのは いつ頃からですか？",
  },
]

export function calculateProgressPercent(milestones: ProjectMilestone[]): number {
  if (milestones.length === 0) return 0
  const done = milestones.filter((m) => m.status === "完了").length
  const inProgress = milestones.filter((m) => m.status === "進行中").length
  return Math.round(((done + inProgress * 0.5) / milestones.length) * 100)
}
