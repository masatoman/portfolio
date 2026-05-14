import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { DemoUsageGuide } from "@/components/local-business/demo-usage-guide"
import { SitePhotoOrganizerDemo } from "@/components/local-business/site-photo-organizer-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "現場写真を 自動でしまう ツール | 工務店向けデモ",
  description:
    "現場で撮った大量の写真を、現場名・工程・撮影日 で 自動仕分け。後日「あの配筋の写真どこ」で30分探す手間をなくす業務改善デモです。",
}

export default function SitePhotoOrganizerPage() {
  return (
    <DemoPageShell
      eyebrow="現場監督向け 写真整理"
      title="現場写真を 自動でしまう ツール"
      description="1日 300枚 撮る現場写真を、現場名・工程・撮影日 で 自動仕分け。 後日「あの配筋写真どこ」で 30分 行方不明、 をなくします。"
    >
      <DemoUsageGuide
        accent="#ec4899"
        pains={[
          "スマホの 写真フォルダが 数千枚で どこに何があるか わからない",
          "「あの 配筋写真 どこやった」で 30分 行方不明",
          "報告書を作るとき 必要な1枚が 見つからない",
        ]}
        steps={[
          {
            no: "1",
            title: "現場で いつも通り 写真を撮る",
            body: "操作は 普段と 何も変わらない。 アプリ側で 自動で 取り込み。",
          },
          {
            no: "2",
            title: "撮った瞬間に 自動で 仕分け",
            body: "現場名 × 工程 (配筋・断熱・防水・仕上げ) × 撮影日 で タグ付け 済み。",
          },
          {
            no: "3",
            title: "見たい時は タブで 切替",
            body: "「山田邸 × 配筋」と 押すだけ。 数千枚から 該当の 数枚だけ 一発表示。",
          },
        ]}
        outcomes={[
          { label: "探す時間", value: "30分 → 10秒" },
          { label: "報告書 作成", value: "サクサク 進む" },
        ]}
      />
      <SitePhotoOrganizerDemo />
      <SavingsSimulation
        scenarioTitle="現場監督が 1日 100〜300枚 写真を撮る 工務店の場合"
        scenarioDescription="撮影後はスマホ・カメラのカメラロールに溜まり、 後日 報告書作成時に 必要な1枚を探し回っている前提です。"
        before={[
          { label: "1日の 写真整理 (フォルダ移動)", value: "1日 約20分" },
          { label: "「あの写真どこ」探す手間", value: "週 約2時間" },
          { label: "月の作業 合計 (営業日20日)", value: "約 14時間" },
          { label: "トラブル時 写真 行方不明", value: "月 1〜2件" },
        ]}
        after={[
          { label: "撮ると同時に 仕分け済み", value: "0分" },
          { label: "タブで 一発呼び出し", value: "1件 約10秒" },
          { label: "月の作業 合計", value: "約 30分" },
          { label: "写真 行方不明", value: "ほぼ ゼロ" },
        ]}
        delta={[
          { label: "月の 削減時間", value: "約 −13時間半", emphasis: true },
          { label: "人件費 換算 (時給2,000円)", value: "約 −2万7,000円 / 月" },
          { label: "報告書作成 短縮", value: "1件 約30分 → 5分" },
        ]}
      />
    </DemoPageShell>
  )
}
