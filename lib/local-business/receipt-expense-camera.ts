export type ExpenseCategory =
  | "ガソリン"
  | "建材・資材"
  | "現場食"
  | "事務用品"
  | "駐車場"
  | "工具"

export type Receipt = {
  id: string
  capturedAt: string
  vendor: string
  amount: number
  category: ExpenseCategory
  projectName: string
  swatch: string
  ocrConfidence: number
  raw: {
    vendor: string
    amount: string
    date: string
  }
}

const categorySwatch: Record<ExpenseCategory, string> = {
  ガソリン: "#dc2626",
  "建材・資材": "#0e7490",
  現場食: "#d97706",
  事務用品: "#7c3aed",
  駐車場: "#475569",
  工具: "#0d9488",
}

export const sampleReceipts: Receipt[] = [
  {
    id: "receipt-001",
    capturedAt: "2026-05-08T07:30",
    vendor: "ENEOS 山田町SS",
    amount: 6840,
    category: "ガソリン",
    projectName: "山田邸 新築工事",
    swatch: categorySwatch["ガソリン"],
    ocrConfidence: 0.98,
    raw: { vendor: "エネオス山田町SS", amount: "¥6,840", date: "2026/05/08" },
  },
  {
    id: "receipt-002",
    capturedAt: "2026-05-08T10:15",
    vendor: "コーナン 西宮店",
    amount: 12480,
    category: "建材・資材",
    projectName: "山田邸 新築工事",
    swatch: categorySwatch["建材・資材"],
    ocrConfidence: 0.95,
    raw: { vendor: "コーナン西宮店", amount: "¥12,480", date: "2026/5/8" },
  },
  {
    id: "receipt-003",
    capturedAt: "2026-05-08T12:40",
    vendor: "なか卯 国道2号線店",
    amount: 1680,
    category: "現場食",
    projectName: "田中邸 リフォーム工事",
    swatch: categorySwatch["現場食"],
    ocrConfidence: 0.92,
    raw: { vendor: "なか卯", amount: "1,680円", date: "20260508" },
  },
  {
    id: "receipt-004",
    capturedAt: "2026-05-08T14:20",
    vendor: "アスクル",
    amount: 3290,
    category: "事務用品",
    projectName: "事務所",
    swatch: categorySwatch["事務用品"],
    ocrConfidence: 0.99,
    raw: { vendor: "ASKUL", amount: "¥3,290", date: "2026-05-08" },
  },
  {
    id: "receipt-005",
    capturedAt: "2026-05-08T16:05",
    vendor: "タイムズ 三宮駅前",
    amount: 1200,
    category: "駐車場",
    projectName: "鈴木邸 外装リフォーム",
    swatch: categorySwatch["駐車場"],
    ocrConfidence: 0.94,
    raw: { vendor: "タイムズ三宮駅前", amount: "¥1,200", date: "2026/05/08" },
  },
  {
    id: "receipt-006",
    capturedAt: "2026-05-09T08:50",
    vendor: "アストロプロダクツ",
    amount: 8650,
    category: "工具",
    projectName: "山田邸 新築工事",
    swatch: categorySwatch["工具"],
    ocrConfidence: 0.96,
    raw: { vendor: "アストロプロダクツ", amount: "¥8,650", date: "2026/5/9" },
  },
]

export type CategorySummary = {
  category: ExpenseCategory
  total: number
  count: number
  swatch: string
}

export function summarizeByCategory(receipts: Receipt[]): CategorySummary[] {
  const map = new Map<ExpenseCategory, CategorySummary>()
  for (const r of receipts) {
    const existing = map.get(r.category)
    if (existing) {
      existing.total += r.amount
      existing.count += 1
    } else {
      map.set(r.category, {
        category: r.category,
        total: r.amount,
        count: 1,
        swatch: r.swatch,
      })
    }
  }
  return Array.from(map.values()).sort((a, b) => b.total - a.total)
}

export function totalAmount(receipts: Receipt[]): number {
  return receipts.reduce((sum, r) => sum + r.amount, 0)
}

export function formatYen(value: number): string {
  return `¥${value.toLocaleString("ja-JP")}`
}
