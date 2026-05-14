import type { Metadata } from "next"
import { SubsidyMatchDemo } from "@/components/lab-tools/subsidy-match-demo"

export const metadata: Metadata = {
  title: "AI 補助金診断 / Lab Tools",
  description:
    "業種・人数・課題・買いたいものを入れると、 主要 5 補助金 (IT 導入 / 持続化 / ものづくり / 業務改善 / 省力化) との合致率と不足要件を AI が返します。",
}

export default function Page() {
  return <SubsidyMatchDemo />
}
