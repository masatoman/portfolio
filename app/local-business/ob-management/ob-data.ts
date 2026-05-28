/**
 * OB 10 年管理 SaaS デモ用 ハードコードデータ。
 *
 * 多摩エリア工務店風の架空 OB 顧客 18 件。
 * 工事日は 2014-2020 年範囲。
 * リフォーム時期予測ロジック付き。
 *
 * このファイルは /local-business/ob-management/ デモ専用 (新規)。
 * 既存 lib/local-business には触らない方針。
 */

export type ConstructionType =
  | "新築"
  | "リフォーム"
  | "屋根葺替"
  | "外壁塗装"
  | "水回り改修"

export type ApproachChannel = "LINE" | "電話" | "訪問" | "DM"

export type ApproachHistoryEntry = {
  date: string // YYYY-MM-DD
  channel: ApproachChannel
  outcome: "成約" | "見送り" | "未返信" | "次回連絡予定"
  note: string
}

export type OBCustomer = {
  id: string
  name: string
  area: string // 多摩エリア地域名
  address: string
  phone: string
  lineEnabled: boolean
  constructionDate: string // YYYY-MM-DD
  constructionType: ConstructionType
  constructionAmount: number // 円
  familyNote?: string // 家族構成メモ
  approachHistory: ApproachHistoryEntry[]
}

// ベース日付: 2026-05-23 (デモ実行想定日)
const DEMO_TODAY = new Date("2026-05-23")

export const ALL_OB_CUSTOMERS: OBCustomer[] = [
  {
    id: "ob-001",
    name: "田中 義男",
    area: "府中市",
    address: "府中市美好町 3-12-4",
    phone: "042-3xx-1101",
    lineEnabled: true,
    constructionDate: "2014-06-15",
    constructionType: "新築",
    constructionAmount: 32_000_000,
    familyNote: "ご夫婦 + 長男夫婦 同居予定あり",
    approachHistory: [
      { date: "2019-12-20", channel: "DM", outcome: "未返信", note: "年末挨拶 DM 送付" },
      { date: "2023-06-10", channel: "電話", outcome: "次回連絡予定", note: "外壁の色褪せ気にしていた" },
    ],
  },
  {
    id: "ob-002",
    name: "鈴木 美津子",
    area: "立川市",
    address: "立川市曙町 2-8-1",
    phone: "042-5xx-2208",
    lineEnabled: false,
    constructionDate: "2014-09-02",
    constructionType: "新築",
    constructionAmount: 28_500_000,
    familyNote: "ご夫婦のみ、 ご主人退職済",
    approachHistory: [
      { date: "2020-09-15", channel: "訪問", outcome: "見送り", note: "まだリフォームは考えていないとの事" },
    ],
  },
  {
    id: "ob-003",
    name: "山口 健太郎",
    area: "国立市",
    address: "国立市富士見台 1-15-9",
    phone: "042-5xx-3309",
    lineEnabled: true,
    constructionDate: "2015-04-22",
    constructionType: "新築",
    constructionAmount: 35_000_000,
    familyNote: "お子様 2 名 (中学・小学)",
    approachHistory: [],
  },
  {
    id: "ob-004",
    name: "高橋 真理子",
    area: "調布市",
    address: "調布市国領町 5-22-7",
    phone: "042-4xx-4410",
    lineEnabled: true,
    constructionDate: "2015-08-10",
    constructionType: "新築",
    constructionAmount: 31_200_000,
    familyNote: "ご夫婦 + お子様 1 名",
    approachHistory: [
      { date: "2024-05-08", channel: "LINE", outcome: "次回連絡予定", note: "キッチンの相談あり、 春先で再連絡希望" },
    ],
  },
  {
    id: "ob-005",
    name: "渡辺 浩",
    area: "国分寺市",
    address: "国分寺市本町 4-3-18",
    phone: "042-3xx-5511",
    lineEnabled: false,
    constructionDate: "2016-02-28",
    constructionType: "新築",
    constructionAmount: 33_800_000,
    familyNote: "ご夫婦 + お母様",
    approachHistory: [],
  },
  {
    id: "ob-006",
    name: "佐藤 直樹",
    area: "府中市",
    address: "府中市分梅町 2-9-3",
    phone: "042-3xx-6612",
    lineEnabled: true,
    constructionDate: "2016-07-04",
    constructionType: "新築",
    constructionAmount: 29_700_000,
    familyNote: "ご夫婦 + お子様 2 名",
    approachHistory: [
      { date: "2025-01-12", channel: "電話", outcome: "未返信", note: "新年挨拶兼ねて、 出なかった" },
    ],
  },
  {
    id: "ob-007",
    name: "中村 友美",
    area: "三鷹市",
    address: "三鷹市下連雀 8-14-2",
    phone: "0422-xx-7713",
    lineEnabled: true,
    constructionDate: "2016-11-20",
    constructionType: "新築",
    constructionAmount: 36_500_000,
    familyNote: "ご家族 4 名、 ペット犬 2 匹",
    approachHistory: [],
  },
  {
    id: "ob-008",
    name: "小林 弘",
    area: "立川市",
    address: "立川市錦町 6-2-15",
    phone: "042-5xx-8814",
    lineEnabled: false,
    constructionDate: "2017-03-15",
    constructionType: "新築",
    constructionAmount: 27_300_000,
    familyNote: "ご夫婦のみ",
    approachHistory: [
      { date: "2022-04-02", channel: "DM", outcome: "未返信", note: "5 年点検 DM" },
    ],
  },
  {
    id: "ob-009",
    name: "加藤 千恵子",
    area: "小金井市",
    address: "小金井市東町 3-7-11",
    phone: "042-3xx-9915",
    lineEnabled: true,
    constructionDate: "2017-08-08",
    constructionType: "リフォーム",
    constructionAmount: 8_500_000,
    familyNote: "シニア ご夫婦、 バリアフリー改修済",
    approachHistory: [
      { date: "2023-09-20", channel: "訪問", outcome: "成約", note: "屋根葺替 ¥230 万受注" },
    ],
  },
  {
    id: "ob-010",
    name: "井上 雄一",
    area: "府中市",
    address: "府中市晴見町 1-18-6",
    phone: "042-3xx-1016",
    lineEnabled: true,
    constructionDate: "2018-01-25",
    constructionType: "新築",
    constructionAmount: 38_200_000,
    familyNote: "ご家族 5 名、 二世帯",
    approachHistory: [],
  },
  {
    id: "ob-011",
    name: "森田 浩子",
    area: "西東京市",
    address: "西東京市保谷町 4-12-3",
    phone: "042-4xx-1117",
    lineEnabled: false,
    constructionDate: "2018-05-30",
    constructionType: "新築",
    constructionAmount: 30_400_000,
    familyNote: "ご夫婦 + お子様 1 名",
    approachHistory: [],
  },
  {
    id: "ob-012",
    name: "藤井 隆",
    area: "調布市",
    address: "調布市仙川町 2-5-9",
    phone: "042-4xx-1218",
    lineEnabled: true,
    constructionDate: "2018-10-12",
    constructionType: "新築",
    constructionAmount: 34_100_000,
    familyNote: "ご家族 4 名",
    approachHistory: [
      { date: "2024-10-18", channel: "LINE", outcome: "次回連絡予定", note: "外壁の汚れが気になる旨" },
    ],
  },
  {
    id: "ob-013",
    name: "斎藤 美紀",
    area: "国立市",
    address: "国立市西 1-7-22",
    phone: "042-5xx-1319",
    lineEnabled: true,
    constructionDate: "2019-02-18",
    constructionType: "新築",
    constructionAmount: 32_900_000,
    familyNote: "シングルマザー + お子様 2 名",
    approachHistory: [],
  },
  {
    id: "ob-014",
    name: "松本 義雄",
    area: "国分寺市",
    address: "国分寺市光町 3-15-4",
    phone: "042-3xx-1420",
    lineEnabled: false,
    constructionDate: "2019-06-05",
    constructionType: "新築",
    constructionAmount: 29_800_000,
    familyNote: "ご夫婦のみ、 退職後",
    approachHistory: [],
  },
  {
    id: "ob-015",
    name: "石川 春香",
    area: "府中市",
    address: "府中市押立町 5-9-1",
    phone: "042-3xx-1521",
    lineEnabled: true,
    constructionDate: "2019-11-11",
    constructionType: "新築",
    constructionAmount: 33_500_000,
    familyNote: "ご夫婦 + お子様 1 名",
    approachHistory: [],
  },
  {
    id: "ob-016",
    name: "村上 達也",
    area: "立川市",
    address: "立川市羽衣町 2-3-8",
    phone: "042-5xx-1622",
    lineEnabled: true,
    constructionDate: "2020-04-08",
    constructionType: "新築",
    constructionAmount: 31_700_000,
    familyNote: "ご家族 3 名",
    approachHistory: [],
  },
  {
    id: "ob-017",
    name: "横山 良子",
    area: "三鷹市",
    address: "三鷹市井の頭 4-11-7",
    phone: "0422-xx-1723",
    lineEnabled: false,
    constructionDate: "2020-09-22",
    constructionType: "新築",
    constructionAmount: 30_900_000,
    familyNote: "ご夫婦 + お子様 2 名",
    approachHistory: [],
  },
  {
    id: "ob-018",
    name: "岡田 信夫",
    area: "府中市",
    address: "府中市寿町 1-6-14",
    phone: "042-3xx-1824",
    lineEnabled: true,
    constructionDate: "2014-03-12",
    constructionType: "新築",
    constructionAmount: 28_900_000,
    familyNote: "ご夫婦のみ、 築 12 年経過",
    approachHistory: [
      { date: "2019-04-15", channel: "DM", outcome: "未返信", note: "5 年点検 DM" },
      { date: "2024-04-20", channel: "電話", outcome: "未返信", note: "10 年点検案内、 留守電" },
    ],
  },
]

// ========== 計算ロジック ==========

/**
 * 経過年数を計算 (小数点 1 桁)。
 */
export function yearsSinceConstruction(constructionDate: string, base: Date = DEMO_TODAY): number {
  const c = new Date(constructionDate)
  const ms = base.getTime() - c.getTime()
  const years = ms / (1000 * 60 * 60 * 24 * 365.25)
  return Math.round(years * 10) / 10
}

/**
 * 次回 推定 リフォーム時期 (YYYY 年 M 月)。
 * 工事種別と経過年数から逆算 (新築 = 10-15 年 / 25-30 年、 リフォーム = 10 年、 屋根葺替 = 25-30 年)。
 */
export type PredictedReform = {
  label: string // 例: "10-15 年 大規模リフォーム"
  windowFrom: string // YYYY-MM
  windowTo: string // YYYY-MM
  daysUntilFrom: number // 今日から窓開始まで日数 (マイナス = 既に時期入っている)
}

export function predictNextReform(customer: OBCustomer, base: Date = DEMO_TODAY): PredictedReform {
  const c = new Date(customer.constructionDate)
  const yearsPassed = yearsSinceConstruction(customer.constructionDate, base)

  // 新築の場合: 10-15 年 / 25-30 年 / 屋根葺替 25 年前後
  if (customer.constructionType === "新築") {
    if (yearsPassed < 10) {
      const from = addYears(c, 10)
      const to = addYears(c, 15)
      return {
        label: "10-15 年 大規模リフォーム期",
        windowFrom: formatYearMonth(from),
        windowTo: formatYearMonth(to),
        daysUntilFrom: daysBetween(base, from),
      }
    }
    if (yearsPassed < 15) {
      const from = base
      const to = addYears(c, 15)
      return {
        label: "10-15 年 大規模リフォーム期 (進行中)",
        windowFrom: formatYearMonth(from),
        windowTo: formatYearMonth(to),
        daysUntilFrom: 0,
      }
    }
    // 15 年超は外壁塗装 / 屋根葺替 タイミング
    const from = addYears(c, 20)
    const to = addYears(c, 30)
    return {
      label: "20-30 年 外壁・屋根 大規模補修期",
      windowFrom: formatYearMonth(from),
      windowTo: formatYearMonth(to),
      daysUntilFrom: daysBetween(base, from),
    }
  }

  // リフォーム / 屋根葺替 / 外壁塗装 / 水回り の場合は次回 10 年後
  const from = addYears(c, 10)
  const to = addYears(c, 12)
  return {
    label: "次回 メンテナンス期",
    windowFrom: formatYearMonth(from),
    windowTo: formatYearMonth(to),
    daysUntilFrom: daysBetween(base, from),
  }
}

/**
 * アプローチ推奨度 スコア (0-100)。
 *
 * 計算要素:
 *  - リフォーム時期との距離 (時期入っている = 高、 まだ遠い = 低)
 *  - 直近アプローチからの経過月 (長いほど高)
 *  - 工事金額 (高いほど 高 = 投資余力あり)
 *  - LINE 連絡可能 (+ 5)
 */
export function calculateApproachScore(customer: OBCustomer, base: Date = DEMO_TODAY): number {
  const reform = predictNextReform(customer, base)

  // (1) リフォーム時期との距離
  let timingScore = 0
  if (reform.daysUntilFrom <= 0) {
    // 既に時期に入っている
    timingScore = 60
  } else if (reform.daysUntilFrom <= 180) {
    timingScore = 50
  } else if (reform.daysUntilFrom <= 365) {
    timingScore = 40
  } else if (reform.daysUntilFrom <= 730) {
    timingScore = 25
  } else {
    timingScore = 10
  }

  // (2) 直近アプローチからの経過 (なし = 30、 1 年以上 = 25、 半年以上 = 15、 直近 3 ヶ月 = 0)
  let recencyScore = 30
  const sorted = [...customer.approachHistory].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )
  if (sorted.length > 0) {
    const lastDate = new Date(sorted[0]!.date)
    const monthsAgo = (base.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
    if (monthsAgo >= 12) recencyScore = 25
    else if (monthsAgo >= 6) recencyScore = 15
    else if (monthsAgo >= 3) recencyScore = 5
    else recencyScore = 0
  }

  // (3) 工事金額 (3000 万以上 = 10、 2500 万以上 = 7、 それ以下 = 4)
  let budgetScore = 4
  if (customer.constructionAmount >= 30_000_000) budgetScore = 10
  else if (customer.constructionAmount >= 25_000_000) budgetScore = 7

  // (4) LINE 連絡可能 +5
  const lineScore = customer.lineEnabled ? 5 : 0

  // (5) 最近 成約 / 次回連絡予定 がある = +5 (温度あり)
  let warmScore = 0
  const recentWarmEntry = customer.approachHistory.find(
    (h) => h.outcome === "成約" || h.outcome === "次回連絡予定",
  )
  if (recentWarmEntry) warmScore = 5

  return Math.min(100, timingScore + recencyScore + budgetScore + lineScore + warmScore)
}

/**
 * 上位 N 件 (推奨度順)。
 */
export function topApproachCandidates(
  customers: OBCustomer[],
  n: number,
  base: Date = DEMO_TODAY,
): Array<OBCustomer & { score: number; reform: PredictedReform }> {
  return customers
    .map((c) => ({
      ...c,
      score: calculateApproachScore(c, base),
      reform: predictNextReform(c, base),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
}

// ========== 日付ヘルパー ==========

function addYears(d: Date, years: number): Date {
  const r = new Date(d)
  r.setFullYear(r.getFullYear() + years)
  return r
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime()
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

function formatYearMonth(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export function formatJapaneseDate(iso: string): string {
  const [y, m, d] = iso.split("-")
  return `${y}年${parseInt(m!, 10)}月${parseInt(d!, 10)}日`
}

export function formatJapaneseYearMonth(ym: string): string {
  const [y, m] = ym.split("-")
  return `${y}年${parseInt(m!, 10)}月`
}

export function formatYen(amount: number): string {
  if (amount >= 10000) {
    return `${Math.round(amount / 10000).toLocaleString()} 万円`
  }
  return `${amount.toLocaleString()} 円`
}

export const DEMO_BASE_DATE = DEMO_TODAY
