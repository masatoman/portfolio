import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { DemoUsageGuide } from "@/components/local-business/demo-usage-guide"
import { ReceiptExpenseCameraDemo } from "@/components/local-business/receipt-expense-camera-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "領収書を 撮るだけで 経費になる ツール | 工務店向けデモ",
  description:
    "現場のガソリン・建材・現場食の領収書を 撮るだけで 自動入力。 月末の経費まとめが ボタン1つに。 電子帳簿保存法にも対応した業務改善デモ。",
}

export default function ReceiptExpenseCameraPage() {
  return (
    <DemoPageShell
      eyebrow="工務店・現場 経費精算"
      title="領収書を 撮るだけで 経費になる ツール"
      description="現場のガソリン・建材・食事の 紙の領収書が ポケットと車内に散乱。 月末の経費まとめで 夜中まで 残業。 これを 撮るだけで 自動入力に置き換えます。"
    >
      <DemoUsageGuide
        accent="#facc15"
        pains={[
          "紙の 領収書が ポケットと 車内に 溜まっている",
          "月末に Excel に 1枚ずつ 手で 入力 (1枚 約2分)",
          "たまに 領収書を 紛失して 経費が 落とせない",
        ]}
        steps={[
          {
            no: "1",
            title: "領収書を 受け取ったら すぐ撮影",
            body: "店内・現場・車内、 どこでも OK。 撮影と同時に 改ざん防止つきで クラウドへ。",
          },
          {
            no: "2",
            title: "日付・金額・取引先 が 自動入力",
            body: "¥/円/カンマ 表記が バラバラでも 正しく読み取り。 確認するだけで 保存できる。",
          },
          {
            no: "3",
            title: "月末は ボタン1つで 集計・出力",
            body: "PDF / CSV で 一覧出力。 紙の保管も 不要 (電帳法 自動対応)。",
          },
        ]}
        outcomes={[
          { label: "月末の 入力作業", value: "2時間 → 7分" },
          { label: "紙の 保管", value: "不要に" },
        ]}
      />
      <ReceiptExpenseCameraDemo />
      <SavingsSimulation
        scenarioTitle="現場監督が 月 50〜80枚 領収書を持ち帰る 工務店の場合"
        scenarioDescription="紙の領収書を 月末にまとめて Excel に 手で入力し、 経理が 仕訳と保管を 行っている前提です。"
        before={[
          { label: "領収書 入力 (1枚 約2分)", value: "月 約2時間" },
          { label: "領収書 紛失・再発行 依頼", value: "月 1〜2件" },
          { label: "経理側の 仕訳・確認", value: "月 約4時間" },
          { label: "電帳法対応 (紙の保管)", value: "別途 工数" },
        ]}
        after={[
          { label: "現場で 撮影 (1枚 約5秒)", value: "月 約7分" },
          { label: "領収書 紛失", value: "ほぼ ゼロ" },
          { label: "経理側 確認のみ", value: "月 約1時間" },
          { label: "電帳法対応", value: "自動 (写真のまま保管)" },
        ]}
        delta={[
          { label: "月の 削減時間", value: "約 −5時間", emphasis: true },
          { label: "人件費 換算 (時給2,000円)", value: "約 −1万円 / 月" },
          { label: "電帳法 対応", value: "別途費用 → 0円" },
        ]}
      />
    </DemoPageShell>
  )
}
