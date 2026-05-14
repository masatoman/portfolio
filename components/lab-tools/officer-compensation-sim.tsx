"use client"

import { useMemo, useState } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { LabToolPageShell } from "@/components/lab-tools/lab-tool-page-shell"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import {
  type CompensationPoint,
  findOptimalCompensation,
  simulatePoint,
  simulateRange,
} from "@/lib/lab-tools/officer-compensation-calc"

const COLORS = {
  net: LAB_NEON.cyan,
  social: LAB_NEON.magenta,
  income: LAB_NEON.amber,
  corporate: LAB_NEON.green,
}

const yen = (n: number) => `¥${Math.round(n).toLocaleString("ja-JP")}`
const man = (n: number) => `${Math.round(n / 10_000).toLocaleString("ja-JP")}万`

type Inputs = {
  personalBusinessProfit: number
  corporateProfitBeforeComp: number
  monthlyOfficerComp: number
  dependents: number
  isOver40: boolean
  detailed: boolean
}

const DEFAULT_INPUTS: Inputs = {
  personalBusinessProfit: 0,
  corporateProfitBeforeComp: 6_000_000,
  monthlyOfficerComp: 100_000,
  dependents: 0,
  isOver40: false,
  detailed: true,
}

const MIN_COMP = 0
const MAX_COMP = 1_000_000
const COMP_STEP = 10_000

export function OfficerCompensationSim() {
  const [inputs, setInputs] = useState<Inputs>(DEFAULT_INPUTS)

  const points = useMemo<CompensationPoint[]>(
    () =>
      simulateRange(
        {
          personalBusinessProfit: inputs.personalBusinessProfit,
          corporateProfitBeforeComp: inputs.corporateProfitBeforeComp,
          dependents: inputs.dependents,
          isOver40: inputs.isOver40,
          detailed: inputs.detailed,
        },
        MIN_COMP,
        MAX_COMP,
        COMP_STEP,
      ),
    [
      inputs.personalBusinessProfit,
      inputs.corporateProfitBeforeComp,
      inputs.dependents,
      inputs.isOver40,
      inputs.detailed,
    ],
  )

  const current = useMemo(
    () =>
      simulatePoint({
        personalBusinessProfit: inputs.personalBusinessProfit,
        corporateProfitBeforeComp: inputs.corporateProfitBeforeComp,
        dependents: inputs.dependents,
        isOver40: inputs.isOver40,
        detailed: inputs.detailed,
        monthlyOfficerComp: inputs.monthlyOfficerComp,
      }),
    [inputs],
  )

  const optimal = useMemo(() => findOptimalCompensation(points), [points])

  const chartData = useMemo(
    () =>
      points.map((p) => ({
        month: p.monthlyComp,
        手残り: p.netTakehome,
        社保合計: p.employeeSocialInsurance + p.employerSocialInsurance,
        所得住民税: p.incomeTax + p.residentTax,
        法人税: p.corporateTax,
      })),
    [points],
  )

  return (
    <LabToolPageShell
      eyebrow="// lab_tool / officer_compensation"
      title="役員報酬 最適化シミュレーター"
      accent="cyan"
      description="個人事業 + マイクロ法人 (これから設立予定) の年間利益見込みから、社保・所得税・法人税の合計が最小化される役員報酬月額をグラフで探します。スライダーを動かして 全体手残り (年) のピークを見てください。"
      disclaimer="2026 年度の概算です。 詳細モード ON で 法人住民税均等割 (東京 23 区想定 7 万円固定)・法人事業税 (+特別法人事業税)・国民健康保険 (全国平均料率)・国民年金 (定額 月 17,510 円) を含めます。 役員報酬月額 58,000 円未満は 健保 + 厚年に加入できないので 国保 + 国民年金で計算します。 配偶者特別控除・所得拡大促進税制・地域別最低賃金等は未計上。 マイクロ法人設立の意思決定には 必ず税理士に相談してください。"
    >
      <div className="space-y-10">
        <InputsBlock inputs={inputs} setInputs={setInputs} />

        <CurrentResultCard current={current} optimal={optimal} setInputs={setInputs} />

        <ChartBlock chartData={chartData} optimal={optimal} current={current} />

        <BreakdownTable current={current} optimal={optimal} />
      </div>
    </LabToolPageShell>
  )
}

// ─────────────────────────────────────────
// Inputs
// ─────────────────────────────────────────

function InputsBlock({
  inputs,
  setInputs,
}: {
  inputs: Inputs
  setInputs: (next: Inputs) => void
}) {
  return (
    <div className="border border-white/10 bg-black/40 p-6 sm:p-8 space-y-6">
      <h2 className="text-sm font-bold uppercase tracking-widest text-white/70">
        // 前提を入力
      </h2>

      <div className="grid gap-5 sm:grid-cols-2">
        <NumberField
          label="個人事業の年間利益 (円、青色65万控除前)"
          value={inputs.personalBusinessProfit}
          onChange={(v) => setInputs({ ...inputs, personalBusinessProfit: v })}
          step={100_000}
          hint="本業の事業収入 - 経費。マイクロ法人と並行運用する前提。"
        />
        <NumberField
          label="法人の年間利益見込 (円、役員報酬控除前)"
          value={inputs.corporateProfitBeforeComp}
          onChange={(v) => setInputs({ ...inputs, corporateProfitBeforeComp: v })}
          step={100_000}
          hint="マイクロ法人にいくら売上 - 経費が立つか。"
        />
        <NumberField
          label="扶養人数 (一般)"
          value={inputs.dependents}
          onChange={(v) => setInputs({ ...inputs, dependents: Math.floor(v) })}
          step={1}
          min={0}
          max={10}
          hint="配偶者特別控除等は未計上。一般扶養親族のみ。"
        />
        <CheckboxField
          label="40 歳以上 (介護保険料の加算対象)"
          checked={inputs.isOver40}
          onChange={(v) => setInputs({ ...inputs, isOver40: v })}
        />
        <CheckboxField
          label="詳細モード (法人住民税均等割 + 法人事業税 + 国保/国民年金を含む)"
          checked={inputs.detailed}
          onChange={(v) => setInputs({ ...inputs, detailed: v })}
        />
      </div>

      <div className="pt-2">
        <Label className="text-xs uppercase tracking-widest text-white/70">
          役員報酬 月額: <span className="text-white font-bold">{yen(inputs.monthlyOfficerComp)}</span>
          <span className="ml-3 text-white/50">(年 {yen(inputs.monthlyOfficerComp * 12)})</span>
        </Label>
        <Slider
          value={[inputs.monthlyOfficerComp]}
          min={MIN_COMP}
          max={MAX_COMP}
          step={COMP_STEP}
          onValueChange={(v) => setInputs({ ...inputs, monthlyOfficerComp: v[0] })}
          className="mt-3"
        />
        <div className="mt-2 flex justify-between text-[10px] text-white/40 font-mono">
          <span>¥0</span>
          <span>¥500,000</span>
          <span>¥1,000,000</span>
        </div>
      </div>
    </div>
  )
}

function NumberField({
  label,
  value,
  onChange,
  step,
  min,
  max,
  hint,
}: {
  label: string
  value: number
  onChange: (n: number) => void
  step: number
  min?: number
  max?: number
  hint?: string
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-widest text-white/70">{label}</Label>
      <Input
        type="number"
        value={value}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          const n = Number(e.target.value)
          onChange(Number.isFinite(n) ? n : 0)
        }}
        className="bg-black/60 border-white/15 text-white font-mono"
      />
      {hint && <p className="text-[10px] text-white/40 leading-relaxed">{hint}</p>}
    </div>
  )
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (b: boolean) => void
}) {
  return (
    <label className="flex items-center gap-3 self-end pb-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#00f0ff]"
      />
      <span className="text-xs text-white/80">{label}</span>
    </label>
  )
}

// ─────────────────────────────────────────
// Current vs Optimal
// ─────────────────────────────────────────

function CurrentResultCard({
  current,
  optimal,
  setInputs,
}: {
  current: CompensationPoint
  optimal: CompensationPoint
  setInputs: (updater: (prev: Inputs) => Inputs) => void
}) {
  const diff = optimal.netTakehome - current.netTakehome
  const isAtOptimal = diff === 0

  return (
    <div className="grid gap-5 md:grid-cols-2">
      <ResultPanel
        accent="cyan"
        eyebrow="// 現在の役員報酬"
        monthly={current.monthlyComp}
        net={current.netTakehome}
        burden={current.totalTaxBurden}
      />
      <div className="border border-[#39ff14]/40 bg-black/40 p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[#39ff14] mb-3">
          // 推奨 (手残り最大化)
        </p>
        <div className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
          {man(optimal.monthlyComp)}円<span className="text-base text-white/50">/月</span>
        </div>
        <div className="text-xs text-white/50 mb-4">年 {yen(optimal.annualComp)}</div>
        <div className="space-y-1 text-sm">
          <Row label="全体手残り (年)" value={yen(optimal.netTakehome)} highlight />
          <Row label="税 + 社保合計" value={yen(optimal.totalTaxBurden)} muted />
        </div>
        {!isAtOptimal && (
          <button
            onClick={() => setInputs((prev) => ({ ...prev, monthlyOfficerComp: optimal.monthlyComp }))}
            className="mt-5 w-full text-xs font-bold uppercase tracking-widest border border-[#39ff14]/60 bg-[#39ff14]/10 px-4 py-3 text-[#39ff14] hover:bg-[#39ff14]/20 transition"
          >
            この額に スライダーを合わせる ({diff > 0 ? "+" : ""}{yen(diff)})
          </button>
        )}
        {isAtOptimal && (
          <p className="mt-5 text-xs text-[#39ff14] font-mono">
            ✓ 現在のスライダー位置が最適点です
          </p>
        )}
      </div>
    </div>
  )
}

function ResultPanel({
  accent,
  eyebrow,
  monthly,
  net,
  burden,
}: {
  accent: keyof typeof LAB_NEON
  eyebrow: string
  monthly: number
  net: number
  burden: number
}) {
  const color = LAB_NEON[accent]
  return (
    <div className="border p-6 sm:p-8 bg-black/40" style={{ borderColor: `${color}40` }}>
      <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>
        {eyebrow}
      </p>
      <div className="text-3xl sm:text-4xl font-black tracking-tight mb-1">
        {man(monthly)}円<span className="text-base text-white/50">/月</span>
      </div>
      <div className="text-xs text-white/50 mb-4">年 {yen(monthly * 12)}</div>
      <div className="space-y-1 text-sm">
        <Row label="全体手残り (年)" value={yen(net)} highlight />
        <Row label="税 + 社保合計" value={yen(burden)} muted />
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  highlight,
  muted,
}: {
  label: string
  value: string
  highlight?: boolean
  muted?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/60">{label}</span>
      <span
        className={
          highlight
            ? "font-mono text-base font-bold text-white"
            : muted
              ? "font-mono text-sm text-white/50"
              : "font-mono text-sm text-white"
        }
      >
        {value}
      </span>
    </div>
  )
}

// ─────────────────────────────────────────
// Chart
// ─────────────────────────────────────────

function ChartBlock({
  chartData,
  optimal,
  current,
}: {
  chartData: { month: number; 手残り: number; 社保合計: number; 所得住民税: number; 法人税: number }[]
  optimal: CompensationPoint
  current: CompensationPoint
}) {
  return (
    <div className="border border-white/10 bg-black/40 p-6 sm:p-8">
      <h2 className="text-sm font-bold uppercase tracking-widest text-white/70 mb-1">
        // 役員報酬月額ごとの 手残り と 内訳
      </h2>
      <p className="text-[11px] text-white/40 mb-6">
        x: 役員報酬月額 / y: 円 (年額)。シアンの線が全体手残り (高い方が良い)。
      </p>
      <div className="h-[420px] -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 16, bottom: 6, left: 8 }}>
            <CartesianGrid stroke="#ffffff10" strokeDasharray="2 4" />
            <XAxis
              dataKey="month"
              stroke="#ffffff60"
              tick={{ fontSize: 10, fill: "#ffffff80" }}
              tickFormatter={(v) => man(v)}
            />
            <YAxis
              stroke="#ffffff60"
              tick={{ fontSize: 10, fill: "#ffffff80" }}
              tickFormatter={(v) => man(v)}
              width={60}
            />
            <Tooltip
              contentStyle={{
                background: "#000",
                border: `1px solid ${LAB_NEON.cyan}60`,
                fontSize: 11,
              }}
              labelFormatter={(v) => `役員報酬 月 ${yen(Number(v))}`}
              formatter={(v: number) => yen(v)}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: "#fff" }} />
            <ReferenceLine
              x={optimal.monthlyComp}
              stroke={LAB_NEON.green}
              strokeDasharray="4 4"
              label={{
                value: `推奨 ${man(optimal.monthlyComp)}`,
                position: "top",
                fill: LAB_NEON.green,
                fontSize: 10,
              }}
            />
            <ReferenceLine
              x={current.monthlyComp}
              stroke={LAB_NEON.cyan}
              strokeDasharray="2 2"
              opacity={0.5}
            />
            <Line
              type="monotone"
              dataKey="手残り"
              stroke={COLORS.net}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, fill: COLORS.net }}
            />
            <Line
              type="monotone"
              dataKey="社保合計"
              stroke={COLORS.social}
              strokeWidth={1.5}
              dot={false}
              opacity={0.7}
            />
            <Line
              type="monotone"
              dataKey="所得住民税"
              stroke={COLORS.income}
              strokeWidth={1.5}
              dot={false}
              opacity={0.7}
            />
            <Line
              type="monotone"
              dataKey="法人税"
              stroke={COLORS.corporate}
              strokeWidth={1.5}
              dot={false}
              opacity={0.7}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// Breakdown table
// ─────────────────────────────────────────

function BreakdownTable({
  current,
  optimal,
}: {
  current: CompensationPoint
  optimal: CompensationPoint
}) {
  const rows: { label: string; current: number; optimal: number }[] = [
    { label: "役員報酬 (年)", current: current.annualComp, optimal: optimal.annualComp },
    { label: "本人負担 社保 (健保+厚年)", current: current.employeeSocialInsurance, optimal: optimal.employeeSocialInsurance },
    { label: "法人負担 社保 (健保+厚年)", current: current.employerSocialInsurance, optimal: optimal.employerSocialInsurance },
    { label: "国民健康保険 (社保未加入時)", current: current.nationalHealthInsurance, optimal: optimal.nationalHealthInsurance },
    { label: "国民年金 (社保未加入時)", current: current.nationalPension, optimal: optimal.nationalPension },
    { label: "個人 所得税 (復興税込)", current: current.incomeTax, optimal: optimal.incomeTax },
    { label: "個人 住民税", current: current.residentTax, optimal: optimal.residentTax },
    { label: "法人税", current: current.corporateTax, optimal: optimal.corporateTax },
    { label: "法人住民税 (均等割+法人税割)", current: current.corporateLocalTax, optimal: optimal.corporateLocalTax },
    { label: "法人事業税 (+特別法人事業税)", current: current.corporateBusinessTax, optimal: optimal.corporateBusinessTax },
    { label: "税 + 社保 合計", current: current.totalTaxBurden, optimal: optimal.totalTaxBurden },
    { label: "全体手残り (年)", current: current.netTakehome, optimal: optimal.netTakehome },
  ]

  return (
    <div className="border border-white/10 bg-black/40 overflow-hidden">
      <h2 className="text-sm font-bold uppercase tracking-widest text-white/70 px-6 sm:px-8 pt-6">
        // 内訳 (現在 vs 推奨)
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full mt-4 text-sm">
          <thead>
            <tr className="text-[10px] uppercase tracking-widest text-white/50 border-b border-white/10">
              <th className="text-left px-6 sm:px-8 py-3 font-normal">項目</th>
              <th className="text-right px-6 sm:px-8 py-3 font-normal">現在</th>
              <th className="text-right px-6 sm:px-8 py-3 font-normal">推奨</th>
              <th className="text-right px-6 sm:px-8 py-3 font-normal">差</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const diff = r.optimal - r.current
              const isLast = i === rows.length - 1
              const isBurden = i === rows.length - 2
              return (
                <tr
                  key={r.label}
                  className={`border-b border-white/5 ${isLast ? "bg-[#00f0ff]/5" : ""}`}
                >
                  <td
                    className={`px-6 sm:px-8 py-3 ${isLast || isBurden ? "font-bold" : "text-white/70"}`}
                  >
                    {r.label}
                  </td>
                  <td className="px-6 sm:px-8 py-3 text-right font-mono text-white/80">
                    {yen(r.current)}
                  </td>
                  <td
                    className={`px-6 sm:px-8 py-3 text-right font-mono ${isLast ? "text-[#00f0ff] font-bold" : "text-white/80"}`}
                  >
                    {yen(r.optimal)}
                  </td>
                  <td
                    className={`px-6 sm:px-8 py-3 text-right font-mono text-xs ${
                      diff === 0
                        ? "text-white/30"
                        : diff > 0
                          ? isLast
                            ? "text-[#39ff14]"
                            : "text-[#ff3df0]"
                          : isLast
                            ? "text-[#ff3df0]"
                            : "text-[#39ff14]"
                    }`}
                  >
                    {diff > 0 ? "+" : ""}
                    {yen(diff)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
