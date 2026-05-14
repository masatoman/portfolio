import type { Metadata } from "next"
import { SubsidyPlanWriterDemo } from "@/components/lab-tools/subsidy-plan-writer-demo"

export const metadata: Metadata = {
  title: "事業計画 逆算ジェネレーター / Lab Tools",
  description:
    "買いたい機材と業務課題から、 IT 導入補助金 / 持続化補助金 / ものづくり補助金 の事業計画書ドラフトを Claude が生成します。 「である調」で 6 セクション以上 + 生産性向上ロジック付き。",
}

export default function Page() {
  return <SubsidyPlanWriterDemo />
}
