import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { DemoUsageGuide } from "@/components/local-business/demo-usage-guide"
import { ClientProgressPageDemo } from "@/components/local-business/client-progress-page-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "施主向け 工程進捗 お知らせページ | 工務店向けデモ",
  description:
    "施主からの「今どうなってる？」電話・LINE を、 自動で更新される進捗ページに置き換えます。 ホームページに足せる施主専用ページのデモ。",
}

export default function ClientProgressPage() {
  return (
    <DemoPageShell
      eyebrow="工務店向け 施主向けページ"
      title="施主向け 工程進捗 お知らせページ"
      description="施主からの「今どうなってる？」 電話・LINE が 毎週来る。 そのたびに 写真撮って 送る手間。 これを 自動更新の 公開ページに 置き換えます。"
    >
      <DemoUsageGuide
        accent="#06b6d4"
        pains={[
          "施主から「今 どうなってる？」電話・LINE が 毎週 来る",
          "そのたびに 写真を 撮って 送る手間が 積もる",
          "言った言わないの トラブルが たまに 出る",
        ]}
        steps={[
          {
            no: "1",
            title: "施主に 専用 URL を 1度 送る",
            body: "現場ごとに 1つの URL。 LINE で 1回 送るだけで 設定完了。",
          },
          {
            no: "2",
            title: "現場で 写真と 進捗を 投稿",
            body: "工程が進んだら タップで完了に。 施主向けの 文章も 自動で 整う。",
          },
          {
            no: "3",
            title: "施主は URL を 見るだけ",
            body: "ブックマーク 1度。 気が向いた時に 開けば 最新の状況・写真・予定が 全部わかる。",
          },
        ]}
        outcomes={[
          { label: "確認連絡", value: "ほぼ ゼロに" },
          { label: "施主の 安心感", value: "段違いに UP" },
        ]}
      />
      <ClientProgressPageDemo />
      <SavingsSimulation
        scenarioTitle="工事中 5件 並行で 進めている 工務店の場合"
        scenarioDescription="施主からの 進捗確認 連絡が 1日 数件入り、 そのたびに 写真撮影と 文章作成で 対応している前提です。"
        before={[
          { label: "施主への 進捗説明 連絡", value: "1日 約30分" },
          { label: "写真撮影・送付の 手間", value: "1日 約20分" },
          { label: "月の作業 合計 (営業日20日)", value: "約 17時間" },
          { label: "施主の 不安からの トラブル", value: "月 1〜2件" },
        ]}
        after={[
          { label: "現場で 写真を投稿", value: "1日 約3分" },
          { label: "工程完了 タップ", value: "1工程 約30秒" },
          { label: "月の作業 合計", value: "約 1時間半" },
          { label: "施主の 不安", value: "ほぼ 解消" },
        ]}
        delta={[
          { label: "月の 削減時間", value: "約 −15時間半", emphasis: true },
          { label: "人件費 換算 (時給2,000円)", value: "約 −3万1,000円 / 月" },
          { label: "口コミ・紹介", value: "施主の 安心感UP" },
        ]}
      />
    </DemoPageShell>
  )
}
