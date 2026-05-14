import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { DemoUsageGuide } from "@/components/local-business/demo-usage-guide"
import { VoiceDailyReportDemo } from "@/components/local-business/voice-daily-report-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "車で しゃべるだけで 日報になる ツール | 工務店向けデモ",
  description:
    "現場の帰り道に話した内容が、家に着く頃には日報になっている仕組みのデモです。事務所に戻ってからの日報書きで残業しないための業務改善案。",
}

export default function VoiceDailyReportPage() {
  return (
    <DemoPageShell
      eyebrow="現場監督向け 日報自動化"
      title="車の中で しゃべるだけで、日報ができている"
      description="1日の終わりに事務所で日報を書くために 残業 1時間。帰り道にスマホへ話すだけで、家に着く頃には日報が出来上がっている仕組みのデモです。"
    >
      <DemoUsageGuide
        accent="#10b981"
        pains={[
          "事務所に戻って 日報を書く 1時間で 残業している",
          "1日の終わりは 疲れていて 思い出すのが しんどい",
          "結局 紙か Excel に 手で打ち直している",
        ]}
        steps={[
          {
            no: "1",
            title: "帰り道、 録音ボタンを 押す",
            body: "運転中・現場の片付け中、 手が空いた時に スマホを 1度タップ。",
          },
          {
            no: "2",
            title: "1分くらい 自由に 話す",
            body: "現場の状況・課題・明日の段取り を 思いついた順で OK。 順番は気にしない。",
          },
          {
            no: "3",
            title: "停止 → 家に着く頃には 出来ている",
            body: "話した内容が「現場名 / 進捗 / 課題 / 明日の段取り」 5項目に 自動整形される。",
          },
        ]}
        outcomes={[
          { label: "日報 書く時間", value: "1時間 → 5分" },
          { label: "残業", value: "ほぼ ゼロに" },
        ]}
      />
      <VoiceDailyReportDemo />
      <SavingsSimulation
        scenarioTitle="現場監督が 1日 1時間 日報を書いている 工務店の場合"
        scenarioDescription="事務所に戻ってから 紙またはExcelで日報を書き、 月末に上長へ提出している前提です。"
        before={[
          { label: "事務所での 日報書き", value: "1日 約60分" },
          { label: "あとで 思い出す手間", value: "1日 約10分" },
          { label: "月の作業 合計 (営業日20日)", value: "約 23時間" },
          { label: "月末の 取りまとめ", value: "約 2時間" },
        ]}
        after={[
          { label: "車中で 録音", value: "1日 約3分" },
          { label: "帰宅後 内容確認", value: "1日 約2分" },
          { label: "月の作業 合計", value: "約 1時間40分" },
          { label: "月末の 取りまとめ", value: "ほぼ自動" },
        ]}
        delta={[
          { label: "月の 削減時間", value: "約 −23時間", emphasis: true },
          { label: "人件費 換算 (時給2,000円)", value: "約 −4万6,000円 / 月" },
          { label: "残業 削減", value: "1日 約1時間 → 0分" },
        ]}
      />
    </DemoPageShell>
  )
}
