import type { Metadata } from "next"
import { DevProductivityReportDemo } from "@/components/lab-tools/dev-productivity-report-demo"

export const metadata: Metadata = {
  title: "残業撃退 定量化レポーター / Lab Tools",
  description:
    "開発工数 CSV をアップして導入前後の期間を指定すると、 月別工数の比較グラフ + 効果額試算 + 補助金成果報告書フォーマットの文章を Claude が生成します。",
}

export default function Page() {
  return <DevProductivityReportDemo />
}
