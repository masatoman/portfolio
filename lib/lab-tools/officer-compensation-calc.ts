import {
  BASIC_DEDUCTION,
  BLUE_RETURN_DEDUCTION,
  CORPORATE_RESIDENT_FIXED,
  DEPENDENT_DEDUCTION,
  NATIONAL_PENSION_ANNUAL,
  SOCIAL_INSURANCE_MIN_MONTHLY,
  calcCorporateBusinessTax,
  calcCorporateResidentTaxOnTax,
  calcCorporateTax,
  calcEmployeeSocialInsurance,
  calcEmployerSocialInsurance,
  calcIncomeTax,
  calcNationalHealthInsurance,
  calcResidentTax,
  calcSalaryDeduction,
} from "./japan-tax-rates"

export type SimulationInput = {
  /** 個人事業の年間利益 (青色控除前、社保前) */
  personalBusinessProfit: number
  /** 法人の年間利益 (役員報酬控除前) */
  corporateProfitBeforeComp: number
  /** 役員報酬の月額 */
  monthlyOfficerComp: number
  /** 扶養人数 (一般扶養親族のみ。0 がデフォルト) */
  dependents?: number
  /** 40 歳以上か (介護保険料の加算対象) */
  isOver40?: boolean
  /** 詳細モード: 法人住民税均等割・法人事業税・国保/国民年金 を計上する */
  detailed?: boolean
}

export type CompensationPoint = {
  monthlyComp: number
  annualComp: number

  /** 本人負担社保 (年) — 社保加入時 */
  employeeSocialInsurance: number
  /** 法人負担社保 (年) — 社保加入時 */
  employerSocialInsurance: number
  /** 国民健康保険料 (本人、 詳細モード + 役員報酬下限未満時) */
  nationalHealthInsurance: number
  /** 国民年金 (本人、 詳細モード + 役員報酬下限未満時) */
  nationalPension: number
  /** 社保加入か (= 法人健保 + 厚生年金) */
  enrolledInSocialInsurance: boolean

  /** 個人の所得税 + 復興特別所得税 (個人事業 + 役員報酬の合算課税) */
  incomeTax: number
  /** 個人住民税 */
  residentTax: number

  /** 法人税 */
  corporateTax: number
  /** 法人住民税 (均等割 + 法人税割) — 詳細モードのみ */
  corporateLocalTax: number
  /** 法人事業税 (+ 特別法人事業税) — 詳細モードのみ */
  corporateBusinessTax: number

  /** 全体の税金 + 社保 合計 */
  totalTaxBurden: number
  /** 個人事業利益 + 法人利益 - 全税 - 全社保 */
  netTakehome: number
}

/**
 * 1 つの役員報酬月額に対するシミュレーション。
 *
 * 計算ロジック (詳細モード ON 時):
 *   給与所得 = 役員報酬年額 - 給与所得控除
 *   個人事業所得 = 個人事業利益 - 青色65万
 *   個人合計所得 = 給与所得 + 個人事業所得
 *
 *   if 役員報酬月額 >= 58,000 円:
 *     社保加入 → 健保 + 厚生年金 (本人/法人 折半)
 *   else:
 *     社保非加入 → 国保 + 国民年金 (全額本人負担)
 *
 *   課税所得 = 合計所得 - 基礎控除 - 社保控除 (本人負担分すべて) - 扶養控除
 *   所得税 = 速算表 + 復興特別 2.1%
 *   住民税 = 課税所得 × 10% + 5000
 *
 *   法人税前利益 = 法人利益 - 役員報酬年額 - 法人負担社保
 *   法人税 = 軽減税率 (800 万以下 15% / 超 23.2%)
 *   法人住民税 = 均等割 7 万円固定 + 法人税割 (法人税 × 10.4%)  [詳細モード]
 *   法人事業税 = 所得割 (3.5/5.3/7.0%) × 1.37 (特別法人事業税込)  [詳細モード]
 */
export function simulatePoint(input: SimulationInput): CompensationPoint {
  const monthlyComp = Math.max(0, input.monthlyOfficerComp)
  const annualComp = monthlyComp * 12
  const dependents = Math.max(0, input.dependents ?? 0)
  const isOver40 = input.isOver40 ?? false
  const detailed = input.detailed ?? true

  // ─── 社保 / 国保切替 ───
  const enrolled = monthlyComp >= SOCIAL_INSURANCE_MIN_MONTHLY
  const employeeSI = enrolled ? calcEmployeeSocialInsurance(monthlyComp, isOver40) : 0
  const employerSI = enrolled ? calcEmployerSocialInsurance(monthlyComp, isOver40) : 0

  // 個人事業所得 (青色控除済み)
  const businessIncome = Math.max(
    0,
    input.personalBusinessProfit - BLUE_RETURN_DEDUCTION,
  )

  // 給与所得 (役員報酬から)
  const salaryDeduction = annualComp > 0 ? calcSalaryDeduction(annualComp) : 0
  const employmentIncome = Math.max(0, annualComp - salaryDeduction)

  // 国保・国民年金 (詳細モード + 社保未加入時)
  let nhi = 0
  let nationalPension = 0
  if (detailed && !enrolled) {
    // 国保の所得割は 個人事業所得 + 給与所得 をベースにする
    const nhiBaseIncome = businessIncome + employmentIncome
    nhi = calcNationalHealthInsurance(nhiBaseIncome, isOver40)
    nationalPension = NATIONAL_PENSION_ANNUAL
  }

  // 本人負担社保等の合計 (= 所得控除に使う社会保険料控除)
  const personalSocialBurden = employeeSI + nhi + nationalPension

  // 合計所得
  const totalIncome = employmentIncome + businessIncome

  // 所得控除合計
  const totalDeductions =
    BASIC_DEDUCTION + personalSocialBurden + DEPENDENT_DEDUCTION * dependents

  // 課税所得
  const taxableIncome = Math.max(0, totalIncome - totalDeductions)

  // 個人税
  const incomeTax = calcIncomeTax(taxableIncome)
  const residentTax = calcResidentTax(taxableIncome)

  // 法人税
  const corporateProfit = Math.max(
    0,
    input.corporateProfitBeforeComp - annualComp - employerSI,
  )
  const corporateTax = calcCorporateTax(corporateProfit)
  const corporateLocalTax = detailed
    ? CORPORATE_RESIDENT_FIXED + calcCorporateResidentTaxOnTax(corporateTax)
    : 0
  const corporateBusinessTax = detailed ? calcCorporateBusinessTax(corporateProfit) : 0

  const totalTaxBurden =
    incomeTax +
    residentTax +
    corporateTax +
    corporateLocalTax +
    corporateBusinessTax +
    employeeSI +
    employerSI +
    nhi +
    nationalPension

  const netTakehome =
    input.personalBusinessProfit +
    input.corporateProfitBeforeComp -
    employeeSI -
    employerSI -
    nhi -
    nationalPension -
    incomeTax -
    residentTax -
    corporateTax -
    corporateLocalTax -
    corporateBusinessTax

  return {
    monthlyComp,
    annualComp,
    employeeSocialInsurance: employeeSI,
    employerSocialInsurance: employerSI,
    nationalHealthInsurance: nhi,
    nationalPension,
    enrolledInSocialInsurance: enrolled,
    incomeTax,
    residentTax,
    corporateTax,
    corporateLocalTax,
    corporateBusinessTax,
    totalTaxBurden,
    netTakehome,
  }
}

/**
 * 役員報酬月額の範囲を走査して全点を返す。
 */
export function simulateRange(
  input: Omit<SimulationInput, "monthlyOfficerComp">,
  from: number,
  to: number,
  step: number,
): CompensationPoint[] {
  const points: CompensationPoint[] = []
  for (let m = from; m <= to; m += step) {
    points.push(simulatePoint({ ...input, monthlyOfficerComp: m }))
  }
  return points
}

/**
 * 手残りが最大化される点を返す。
 */
export function findOptimalCompensation(
  points: CompensationPoint[],
): CompensationPoint {
  return points.reduce((best, p) => (p.netTakehome > best.netTakehome ? p : best))
}
