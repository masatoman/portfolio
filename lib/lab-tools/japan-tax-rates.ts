/**
 * 2026 年想定の日本の税率・社保料率テーブル (簡略版)。
 *
 * 用途: 役員報酬最適化シミュレーターの計算根拠。
 * 厳密性: 税理士相談前の方向感を掴むレベル。住民税の均等割や法人事業税、
 * 国保・国民年金などは初版では割愛。disclaimer でカバー。
 */

// ─────────────────────────────────────────
// 社会保険 (法人加入)
// ─────────────────────────────────────────

// 健康保険料率 (協会けんぽ全国平均、本人負担分)
// 2025 年度 全国平均約 10.0% / 折半なので 5.0%
export const HEALTH_INSURANCE_RATE = 0.05
// 介護保険上乗せ (40 歳以上、本人負担分)
export const LONG_TERM_CARE_RATE = 0.008

// 厚生年金保険料率 (本人負担分)
// 18.3% / 2 = 9.15%
export const PENSION_RATE = 0.0915

// 標準報酬月額の上限 (厚生年金: 65 万円、健康保険: 139 万円)
export const PENSION_MONTHLY_CAP = 650_000
export const HEALTH_MONTHLY_CAP = 1_390_000

// ─────────────────────────────────────────
// 給与所得控除 (2026 想定)
// ─────────────────────────────────────────
export function calcSalaryDeduction(annualSalary: number): number {
  if (annualSalary <= 1_625_000) return 550_000
  if (annualSalary <= 1_800_000) return Math.floor(annualSalary * 0.4) - 100_000
  if (annualSalary <= 3_600_000) return Math.floor(annualSalary * 0.3) + 80_000
  if (annualSalary <= 6_600_000) return Math.floor(annualSalary * 0.2) + 440_000
  if (annualSalary <= 8_500_000) return Math.floor(annualSalary * 0.1) + 1_100_000
  return 1_950_000
}

// ─────────────────────────────────────────
// 所得控除 (基礎控除 + 扶養控除)
// ─────────────────────────────────────────
export const BASIC_DEDUCTION = 480_000
export const DEPENDENT_DEDUCTION = 380_000

// ─────────────────────────────────────────
// 青色申告特別控除 (個人事業主)
// ─────────────────────────────────────────
export const BLUE_RETURN_DEDUCTION = 650_000

// ─────────────────────────────────────────
// 所得税 (速算表)
// 復興特別所得税 (2.1%) も加算
// ─────────────────────────────────────────
type IncomeTaxBracket = { upTo: number; rate: number; deduction: number }

const INCOME_TAX_BRACKETS: IncomeTaxBracket[] = [
  { upTo: 1_950_000, rate: 0.05, deduction: 0 },
  { upTo: 3_300_000, rate: 0.10, deduction: 97_500 },
  { upTo: 6_950_000, rate: 0.20, deduction: 427_500 },
  { upTo: 9_000_000, rate: 0.23, deduction: 636_000 },
  { upTo: 18_000_000, rate: 0.33, deduction: 1_536_000 },
  { upTo: 40_000_000, rate: 0.40, deduction: 2_796_000 },
  { upTo: Infinity, rate: 0.45, deduction: 4_796_000 },
]

const RECONSTRUCTION_SURTAX = 0.021

export function calcIncomeTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0
  const bracket = INCOME_TAX_BRACKETS.find((b) => taxableIncome <= b.upTo)!
  const base = taxableIncome * bracket.rate - bracket.deduction
  return Math.max(0, Math.floor(base * (1 + RECONSTRUCTION_SURTAX)))
}

// ─────────────────────────────────────────
// 住民税 (一律 10% + 均等割 5000 円)
// ─────────────────────────────────────────
export const RESIDENT_TAX_RATE = 0.10
export const RESIDENT_TAX_FLAT = 5_000

export function calcResidentTax(taxableIncome: number): number {
  if (taxableIncome <= 0) return RESIDENT_TAX_FLAT
  return Math.floor(taxableIncome * RESIDENT_TAX_RATE) + RESIDENT_TAX_FLAT
}

// ─────────────────────────────────────────
// 法人税 (中小法人軽減税率)
// 800 万以下: 15% / 800 万超: 23.2%
// ─────────────────────────────────────────
export const CORPORATE_TAX_LOW_RATE = 0.15
export const CORPORATE_TAX_HIGH_RATE = 0.232
export const CORPORATE_TAX_THRESHOLD = 8_000_000

export function calcCorporateTax(corporateProfit: number): number {
  if (corporateProfit <= 0) return 0
  if (corporateProfit <= CORPORATE_TAX_THRESHOLD) {
    return Math.floor(corporateProfit * CORPORATE_TAX_LOW_RATE)
  }
  const low = CORPORATE_TAX_THRESHOLD * CORPORATE_TAX_LOW_RATE
  const high = (corporateProfit - CORPORATE_TAX_THRESHOLD) * CORPORATE_TAX_HIGH_RATE
  return Math.floor(low + high)
}

// ─────────────────────────────────────────
// 法人住民税 均等割 (赤字でも発生する固定費)
// 資本金 1000 万以下 + 従業員 50 人以下 = 標準的なマイクロ法人想定
// 東京 23 区の場合、 約 7 万円/年。 他地域は 5〜7 万 + 都道府県分。
// ─────────────────────────────────────────
export const CORPORATE_RESIDENT_FIXED = 70_000

// ─────────────────────────────────────────
// 法人事業税 + 特別法人事業税 (中小企業所得割)
// 400 万以下: 3.5% / 400-800 万: 5.3% / 800 万超: 7.0%
// 特別法人事業税は所得割の 37% を加算 (簡略化のため標準税率で計算)
// 法人事業税は損金算入だが、 シミュレーション上は概算で OK
// ─────────────────────────────────────────
export function calcCorporateBusinessTax(corporateProfit: number): number {
  if (corporateProfit <= 0) return 0
  let tax = 0
  const t1 = Math.min(corporateProfit, 4_000_000)
  tax += t1 * 0.035
  if (corporateProfit > 4_000_000) {
    const t2 = Math.min(corporateProfit - 4_000_000, 4_000_000)
    tax += t2 * 0.053
  }
  if (corporateProfit > 8_000_000) {
    tax += (corporateProfit - 8_000_000) * 0.07
  }
  // 特別法人事業税 (所得割の 37%) を加算
  tax = tax * 1.37
  return Math.floor(tax)
}

// ─────────────────────────────────────────
// 法人住民税 法人税割 (法人税額の 10.4% — 標準税率)
// ─────────────────────────────────────────
export const CORPORATE_RESIDENT_TAX_RATE = 0.104

export function calcCorporateResidentTaxOnTax(corporateTax: number): number {
  return Math.floor(corporateTax * CORPORATE_RESIDENT_TAX_RATE)
}

// ─────────────────────────────────────────
// 国民健康保険料 (役員報酬が社保加入下限未満のとき)
// 自治体によって大きく異なるため、 全国平均的な概算:
//   所得割: (所得 - 43万円) × 約 10%  (医療 7% + 後期支援 3%)
//   均等割: 約 5 万円/人
//   介護分 (40 歳以上): 所得割 +約 2.5%、 均等割 +1.5 万
//   上限: 医療 65万 + 後期 24万 + 介護 17万 = 約 106 万 (世帯)
// ─────────────────────────────────────────
const NHI_RATE_BASE = 0.10
const NHI_RATE_LTC_ADD = 0.025
const NHI_FLAT_BASE = 50_000
const NHI_FLAT_LTC_ADD = 15_000
const NHI_DEDUCTION = 430_000
const NHI_CAP = 1_060_000

export function calcNationalHealthInsurance(
  annualIncome: number,
  isOver40 = false,
): number {
  if (annualIncome <= 0) return NHI_FLAT_BASE + (isOver40 ? NHI_FLAT_LTC_ADD : 0)
  const taxable = Math.max(0, annualIncome - NHI_DEDUCTION)
  const rate = isOver40 ? NHI_RATE_BASE + NHI_RATE_LTC_ADD : NHI_RATE_BASE
  const flat = NHI_FLAT_BASE + (isOver40 ? NHI_FLAT_LTC_ADD : 0)
  const total = taxable * rate + flat
  return Math.floor(Math.min(total, NHI_CAP))
}

// ─────────────────────────────────────────
// 国民年金 (定額、 2025 年度 17,510 円/月)
// ─────────────────────────────────────────
export const NATIONAL_PENSION_MONTHLY = 17_510
export const NATIONAL_PENSION_ANNUAL = NATIONAL_PENSION_MONTHLY * 12

// ─────────────────────────────────────────
// 社会保険加入の最低基準 (健康保険・厚生年金 標準報酬月額の最低)
// 月額 58,000 円未満は法人加入の社保対象外 (= 国保 + 国民年金になる)
// ─────────────────────────────────────────
export const SOCIAL_INSURANCE_MIN_MONTHLY = 58_000

// ─────────────────────────────────────────
// 社保 (本人負担分の年額)
// ─────────────────────────────────────────
export function calcEmployeeSocialInsurance(monthlyComp: number, isOver40 = false): number {
  if (monthlyComp <= 0) return 0
  const healthBase = Math.min(monthlyComp, HEALTH_MONTHLY_CAP)
  const pensionBase = Math.min(monthlyComp, PENSION_MONTHLY_CAP)
  const healthRate = isOver40 ? HEALTH_INSURANCE_RATE + LONG_TERM_CARE_RATE : HEALTH_INSURANCE_RATE
  const monthly = healthBase * healthRate + pensionBase * PENSION_RATE
  return Math.floor(monthly * 12)
}

// 法人負担分は本人負担と同額 (折半)
export function calcEmployerSocialInsurance(monthlyComp: number, isOver40 = false): number {
  return calcEmployeeSocialInsurance(monthlyComp, isOver40)
}
