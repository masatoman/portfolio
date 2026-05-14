/**
 * 開発工数ログ用の軽量 CSV パーサ + 集計関数。
 * 外部依存を増やしたくないので papaparse は使わず手書きで処理する。
 */

export type WorkLog = {
  /** ISO date (YYYY-MM-DD) */
  date: string
  task: string
  hours: number
  category?: string
}

export type PeriodStats = {
  from: string
  to: string
  totalHours: number
  days: number
  /** 1 営業日あたり平均工数 (= totalHours / days) */
  avgPerDay: number
}

export type MonthlyAggregate = {
  /** YYYY-MM */
  month: string
  hours: number
}

export type BeforeAfterStats = {
  beforePeriod: PeriodStats
  afterPeriod: PeriodStats
  /** (avgBefore - avgAfter) × 月 22 日換算 */
  deltaHoursPerMonth: number
  hourlyWage: number
  /** deltaHoursPerMonth × 12 × hourlyWage */
  monetaryImpactPerYear: number
  monthlyBefore: MonthlyAggregate[]
  monthlyAfter: MonthlyAggregate[]
}

// ─────────────────────────────────────────
// CSV parse
// ─────────────────────────────────────────

/**
 * Excel-friendly な軽量 CSV パーサ。 quote ("..." → 内側の "" を " に展開) のみ対応。
 * 期待ヘッダー: date, hours, task, category (大文字小文字無視、 順不同)
 */
export function parseWorkLogCsv(input: string): WorkLog[] {
  const text = input.replace(/^﻿/, "").trim()
  if (!text) return []

  const rows = splitCsvRows(text)
  if (rows.length === 0) return []

  const headers = rows[0].map((h) => h.toLowerCase().trim())
  const idx = {
    date: headers.indexOf("date"),
    hours: headers.indexOf("hours"),
    task: headers.indexOf("task"),
    category: headers.indexOf("category"),
  }

  if (idx.date < 0 || idx.hours < 0) {
    throw new Error("CSV ヘッダーに date と hours が必要です")
  }

  const out: WorkLog[] = []
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    if (row.length === 1 && row[0] === "") continue
    const date = normalizeDate(row[idx.date] ?? "")
    const hours = Number(row[idx.hours] ?? "0")
    if (!date || !Number.isFinite(hours) || hours < 0) continue
    out.push({
      date,
      hours,
      task: row[idx.task]?.trim() ?? "",
      category: idx.category >= 0 ? row[idx.category]?.trim() || undefined : undefined,
    })
  }
  return out
}

function splitCsvRows(text: string): string[][] {
  const rows: string[][] = []
  let current: string[] = []
  let cell = ""
  let inQuote = false

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (inQuote) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') {
        inQuote = false
      } else {
        cell += ch
      }
    } else {
      if (ch === '"') inQuote = true
      else if (ch === ",") {
        current.push(cell)
        cell = ""
      } else if (ch === "\n") {
        current.push(cell)
        rows.push(current)
        current = []
        cell = ""
      } else if (ch === "\r") {
        // skip
      } else {
        cell += ch
      }
    }
  }
  current.push(cell)
  if (current.length > 1 || current[0] !== "") rows.push(current)
  return rows
}

function normalizeDate(s: string): string | null {
  const trimmed = s.trim()
  if (!trimmed) return null
  // YYYY-MM-DD or YYYY/MM/DD
  const m = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/)
  if (!m) return null
  const y = m[1]
  const mo = m[2].padStart(2, "0")
  const d = m[3].padStart(2, "0")
  return `${y}-${mo}-${d}`
}

// ─────────────────────────────────────────
// Aggregate
// ─────────────────────────────────────────

export function filterByPeriod(logs: WorkLog[], from: string, to: string): WorkLog[] {
  return logs.filter((l) => l.date >= from && l.date <= to)
}

export function periodStats(logs: WorkLog[], from: string, to: string): PeriodStats {
  const totalHours = logs.reduce((acc, l) => acc + l.hours, 0)
  const distinctDays = new Set(logs.map((l) => l.date)).size
  const days = Math.max(1, distinctDays)
  return {
    from,
    to,
    totalHours: round2(totalHours),
    days: distinctDays,
    avgPerDay: round2(totalHours / days),
  }
}

export function aggregateMonthly(logs: WorkLog[]): MonthlyAggregate[] {
  const map = new Map<string, number>()
  for (const l of logs) {
    const month = l.date.slice(0, 7)
    map.set(month, (map.get(month) ?? 0) + l.hours)
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, hours]) => ({ month, hours: round2(hours) }))
}

export function buildBeforeAfterStats(input: {
  logs: WorkLog[]
  beforeFrom: string
  beforeTo: string
  afterFrom: string
  afterTo: string
  hourlyWage: number
}): BeforeAfterStats {
  const beforeLogs = filterByPeriod(input.logs, input.beforeFrom, input.beforeTo)
  const afterLogs = filterByPeriod(input.logs, input.afterFrom, input.afterTo)

  const before = periodStats(beforeLogs, input.beforeFrom, input.beforeTo)
  const after = periodStats(afterLogs, input.afterFrom, input.afterTo)

  const deltaHoursPerDay = before.avgPerDay - after.avgPerDay
  const deltaHoursPerMonth = round2(deltaHoursPerDay * 22)
  const monetaryImpactPerYear = Math.round(deltaHoursPerMonth * 12 * input.hourlyWage)

  return {
    beforePeriod: before,
    afterPeriod: after,
    deltaHoursPerMonth,
    hourlyWage: input.hourlyWage,
    monetaryImpactPerYear,
    monthlyBefore: aggregateMonthly(beforeLogs),
    monthlyAfter: aggregateMonthly(afterLogs),
  }
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}
