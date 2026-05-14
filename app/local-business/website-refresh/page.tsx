import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { WebsiteRefreshDemo } from "@/components/local-business/website-refresh-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "架空の工務店サイト実績 | 工務店・中小企業向け",
  description: "工務店向けの架空Webサイトを実績として制作し、構成意図とあわせて見せるケーススタディです。",
}

export default function WebsiteRefreshPage() {
  return (
    <DemoPageShell
      eyebrow="架空の工務店サイト実績"
      title="工務店向けのWebサイトを、実績として見せられる形で制作"
      description="ターゲットの工務店に提案するときの温度感に合わせて、架空のコーポレートサイトを1本制作しました。サイト本体と、構成意図の両方を確認できます。"
    >
      <WebsiteRefreshDemo />
      <SavingsSimulation
        scenarioTitle="10年 そのままの ホームページを 作りなおした場合"
        scenarioDescription="月のサイト訪問者 100人、 問い合わせ率 1%、 受注率 30%、 1件あたりの 受注額 200万円 の 工務店を 想定しています。"
        before={[
          { label: "月の サイト訪問者", value: "約 100人" },
          { label: "問い合わせ率", value: "約 1%" },
          { label: "月の 問い合わせ件数", value: "月 1件" },
          { label: "月の 受注 (受注率30%)", value: "0〜1件" },
        ]}
        after={[
          { label: "月の サイト訪問者", value: "約 200人" },
          { label: "問い合わせ率", value: "約 3%" },
          { label: "月の 問い合わせ件数", value: "月 6件" },
          { label: "月の 受注 (受注率30%)", value: "月 1〜2件" },
        ]}
        delta={[
          { label: "月の 問い合わせ 増加", value: "約 +5件", emphasis: true },
          { label: "年の 受注 増加 (想定)", value: "約 +12〜18件" },
          { label: "年の 売上 上振れ (想定)", value: "数千万円 単位" },
        ]}
        disclaimer="サイト訪問者数・問い合わせ率は、 業種・地域・既存ホームページの状態によって 大きく変わります。 ご相談時に 現状の数字を 確認した上で、 もう少し現実的な見積もりを お出しします。"
      />
    </DemoPageShell>
  )
}
