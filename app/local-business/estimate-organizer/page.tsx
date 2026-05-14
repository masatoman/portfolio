import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { EstimateOrganizerDemo } from "@/components/local-business/estimate-organizer-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "見積PDF整理ツール | 工務店・中小企業向けデモ",
  description: "外注先から届いた見積書PDFを、転記や確認に使いやすい項目テーブルへ整えるデモです。",
}

export default function EstimateOrganizerPage() {
  return (
    <DemoPageShell
      eyebrow="工務店向け 見積PDF整理ツール"
      title="PDF見積を、確認しやすい一覧に整理する"
      description="外注先から届いた見積書PDFを、そのままではなく、転記や確認に使いやすい項目テーブルへ整えるデモです。"
    >
      <EstimateOrganizerDemo />
      <SavingsSimulation
        scenarioTitle="月15件の PDF見積もりを 整理している場合"
        scenarioDescription="外注先5社から届く PDF を、 担当者が Excel に手入力して比較表を作っている前提です。"
        before={[
          { label: "1件あたりの 整理時間", value: "約 20分" },
          { label: "月の作業時間", value: "約 5時間" },
          { label: "転記ミスによる 確認やり直し", value: "月 2件 / 1時間" },
          { label: "月あたりの作業 合計", value: "約 6時間" },
        ]}
        after={[
          { label: "1件あたりの 整理時間", value: "約 3分" },
          { label: "月の作業時間", value: "約 45分" },
          { label: "転記ミスによる やり直し", value: "ほぼ ゼロ" },
          { label: "月あたりの作業 合計", value: "約 1時間" },
        ]}
        delta={[
          { label: "月の 削減時間", value: "約 −5時間", emphasis: true },
          { label: "人件費 換算 (時給2,000円)", value: "約 −1万円 / 月" },
          { label: "年間 換算", value: "約 −12万円 / 年" },
        ]}
      />
    </DemoPageShell>
  )
}
