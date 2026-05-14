import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { DemoUsageGuide } from "@/components/local-business/demo-usage-guide"
import { DrawingQuickViewerDemo } from "@/components/local-business/drawing-quick-viewer-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "図面を スマホで さっと出す ツール | 工務店向けデモ",
  description:
    "現場で「あの図面どこ」と事務所に電話していませんか。 部屋名で 一発呼び出し、 手袋でも押せる 大ボタン UI の デモです。",
}

export default function DrawingQuickViewerPage() {
  return (
    <DemoPageShell
      eyebrow="現場監督向け 図面 即時呼び出し"
      title="図面を スマホで さっと出す ツール"
      description="現場で「リビングの 建具寸法 どっちだっけ」のために 事務所に電話。 手袋した手では PDF はピンチアウトもできない。 部屋名 1タップで 出る ように します。"
    >
      <DemoUsageGuide
        accent="#a855f7"
        pains={[
          "現場で「あの 寸法 どっちだっけ」のために 事務所に 電話",
          "手袋した手では PDF は ピンチアウトできない",
          "紙の 図面を 持ち歩くのは かさばる・濡れる",
        ]}
        steps={[
          {
            no: "1",
            title: "図面は 事前に 1度 アップロード",
            body: "こちらで 部屋名タグ付け・寸法情報 まで 全部 整理してお渡しします。",
          },
          {
            no: "2",
            title: "現場で 部屋名を タップ",
            body: "「リビング」「玄関」など タップするだけ。 該当箇所が 自動で ズーム表示。",
          },
          {
            no: "3",
            title: "寸法・床材・コンセント が 一覧表示",
            body: "聞かれそうな情報を 大きな文字で。 ボタンは 手袋でも 押せるサイズ。",
          },
        ]}
        outcomes={[
          { label: "事務所への 電話", value: "ゼロに" },
          { label: "寸法 取り違え", value: "ヒヤリも 減少" },
        ]}
      />
      <DrawingQuickViewerDemo />
      <SavingsSimulation
        scenarioTitle="現場監督が 1日 3〜5回 図面を確認する 工務店の場合"
        scenarioDescription="図面は事務所のキャビネットや 紙ファイル、 PDFがメールに埋もれていて、 確認のたびに 事務所に電話 or 戻っている前提です。"
        before={[
          { label: "図面 確認 (1回 約8分)", value: "1日 約30分" },
          { label: "事務所への 電話", value: "1日 3回" },
          { label: "月の作業 合計 (営業日20日)", value: "約 10時間" },
          { label: "間違い発生 (寸法 取り違え)", value: "月 1〜2件" },
        ]}
        after={[
          { label: "部屋名 検索 (1回 約10秒)", value: "1日 1分" },
          { label: "事務所への 電話", value: "1日 0回" },
          { label: "月の作業 合計", value: "約 20分" },
          { label: "間違い発生", value: "ほぼ ゼロ" },
        ]}
        delta={[
          { label: "月の 削減時間", value: "約 −9時間半", emphasis: true },
          { label: "人件費 換算 (時給2,000円)", value: "約 −1万9,000円 / 月" },
          { label: "やり直し 工事 リスク", value: "大幅減" },
        ]}
      />
    </DemoPageShell>
  )
}
