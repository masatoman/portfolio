import type { Metadata } from "next"
import { OfficerCompensationSim } from "@/components/lab-tools/officer-compensation-sim"

export const metadata: Metadata = {
  title: "役員報酬 最適化シミュレーター / Lab Tools",
  description:
    "個人事業 + マイクロ法人の利益見込みから、社保・所得税・法人税の合計を最小化する役員報酬月額をグラフで探すシミュレーター。",
}

export default function Page() {
  return <OfficerCompensationSim />
}
