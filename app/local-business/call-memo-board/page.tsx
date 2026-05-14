import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { CallMemoBoardDemo } from "@/components/local-business/call-memo-board-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "電話メモ管理表 | 工務店・中小企業向けデモ",
  description: "誰が・いつ・何を話したかを簡単に残し、次の対応まで見えるようにするメモ管理デモです。",
}

export default function CallMemoBoardPage() {
  return (
    <DemoPageShell
      eyebrow="現場監督向け 電話メモ管理表"
      title="電話内容を残して、次の対応を流れにする"
      description="誰が・いつ・何を話したかを簡単に残し、次の対応まで見えるようにするメモ管理デモです。"
    >
      <CallMemoBoardDemo />
      <SavingsSimulation
        scenarioTitle="現場監督が 1日10件の電話を 受けている 工務店の場合"
        scenarioDescription="紙のメモ + 口頭共有 で運用していて、 月に1件ぐらい 折り返しが遅れて 失注している前提です。"
        before={[
          { label: "メモを書く・共有する 時間", value: "1日 約15分" },
          { label: "「あの件 どうなった？」確認", value: "1日 約10分" },
          { label: "月の作業 合計 (営業日20日)", value: "約 8時間" },
          { label: "対応漏れ による 失注", value: "月 1件 (受注額 約30万円)" },
        ]}
        after={[
          { label: "スマホで 入力・共有", value: "1日 約3分" },
          { label: "ステータスで 1目で確認", value: "1日 約1分" },
          { label: "月の作業 合計", value: "約 1時間半" },
          { label: "対応漏れ による 失注", value: "ほぼ ゼロ" },
        ]}
        delta={[
          { label: "月の 削減時間", value: "約 −6時間半", emphasis: true },
          { label: "人件費 換算 (時給2,000円)", value: "約 −1万3,000円 / 月" },
          { label: "失注 取り戻し (想定)", value: "約 +30万円 / 月" },
        ]}
      />
    </DemoPageShell>
  )
}
