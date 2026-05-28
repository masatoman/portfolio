import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DemoUsageGuide } from "@/components/local-business/demo-usage-guide"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"
import { OBManagementDemo } from "./ob-management-demo"

export const metadata: Metadata = {
  title: "OB 10 年管理 SaaS | 工務店向け 動くデモ",
  description:
    "過去 10 年の OB 顧客名簿を「眠った資産」 から「リフォーム源泉」 へ。 リフォーム時期 AI 予測 + アプローチ自動化 を 1 つにまとめた SaaS の 動くデモ。",
}

export default function OBManagementPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <Link
            href="/#examples"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            戻る
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-[#bae6fd] bg-[#ecfeff] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#0e7490]">
              動くデモ: OB 10 年管理 SaaS
            </span>
            <span className="inline-flex items-center rounded-full border border-[#fed7aa] bg-[#fff7ed] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.15em] text-[#b45309]">
              v8.0 #01 候補
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        {/* 開発中: 3 案デザイン比較バナー (2026-05-24 追加) */}
        <div className="mb-8 rounded-xl border border-dashed border-[#b85c3a] bg-[#fef5f1] p-4 text-sm">
          <p className="font-bold text-[#a73a3a]">🎨 3 つのデザイン案を比較中 (2026-05-24)</p>
          <p className="mt-1 text-xs text-[#5f6871]">
            warm editorial 方向の 3 案を 並べて 検討中。 現在のページは 既存版 (青系)。
          </p>
          <nav className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/local-business/ob-management/option-a"
              className="inline-flex items-center rounded-full border border-[#d6cfc2] bg-white px-3 py-1.5 text-[11px] font-bold text-[#5f6871] transition hover:border-[#b85c3a] hover:bg-[#b85c3a] hover:text-white"
            >
              案 A 数字主役 →
            </Link>
            <Link
              href="/local-business/ob-management/option-b"
              className="inline-flex items-center rounded-full border border-[#d6cfc2] bg-white px-3 py-1.5 text-[11px] font-bold text-[#5f6871] transition hover:border-[#b85c3a] hover:bg-[#b85c3a] hover:text-white"
            >
              案 B タイムライン →
            </Link>
            <Link
              href="/local-business/ob-management/option-c"
              className="inline-flex items-center rounded-full border border-[#d6cfc2] bg-white px-3 py-1.5 text-[11px] font-bold text-[#5f6871] transition hover:border-[#b85c3a] hover:bg-[#b85c3a] hover:text-white"
            >
              案 C 三層レイヤー →
            </Link>
          </nav>
        </div>

        <div className="mb-12 max-w-3xl">
          <div className="mb-3 inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            工務店向け OB 顧客資産活用
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            OB 10 年管理 SaaS
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-600">
            過去 10 年に建てた施主さんの 名簿が Excel や 紙台帳に 散らばっていて、 築 10-15 年の リフォーム時期になっても 連絡しそびれる。 親方の頭の中の顧客情報を ダッシュボード化して、 リフォーム機会を 取り戻す SaaS の 動くデモです。
          </p>
        </div>

        <DemoUsageGuide
          accent="#0e7490"
          pains={[
            "過去 10 年の OB 名簿が Excel と 紙に 散らばっている",
            "築 10-15 年の リフォーム時期に なっても 連絡しそびれる",
            "競合のチラシ広告で 同じ施主さんが 他社に リフォーム発注",
          ]}
          steps={[
            {
              no: "1",
              title: "Excel / 紙台帳 を SaaS に 移行 (BPaaS 代行可)",
              body: "初期 3-6 ヶ月は 弊社で 移行作業を 代行。 親方は 既存名簿を 渡すだけ。",
            },
            {
              no: "2",
              title: "ダッシュボードで「次に動くべき OB」 が 一目でわかる",
              body: "工事日 / 工事種別 / 経過年数 を AI が 解析し、 リフォーム時期 接近順に 並び替え。",
            },
            {
              no: "3",
              title: "アプローチ文面 自動生成 → 1 タップで LINE 送信",
              body: "OB ごとの 文面を 自動生成。 親方は 確認して 送信ボタンを 押すだけ。",
            },
          ]}
          outcomes={[
            { label: "OB リフォーム獲得率", value: "20-30% → 40%+" },
            { label: "アプローチ漏れ", value: "ほぼ ゼロに" },
          ]}
        />

        <OBManagementDemo />

        <SavingsSimulation
          scenarioTitle="OB 顧客 100 件 を 抱えている 工務店の場合"
          scenarioDescription="新築 1 件 = リフォーム機会 5-7 回 (10-15 年 / 25-30 年 / 屋根葺替)。 リフォーム平均 ¥150 万、 獲得率 20-30% が 業界平均です。"
          before={[
            { label: "OB 名簿の 整理場所", value: "Excel + 紙 + 親方の頭" },
            { label: "リフォーム時期の 把握", value: "勘と 思い出し" },
            { label: "OB アプローチ 月間 件数", value: "1〜3 件 (思い出した時)" },
            { label: "OB リフォーム 獲得率", value: "20-30% (業界平均)" },
            { label: "年間 リフォーム売上", value: "約 ¥1,500-3,000 万" },
          ]}
          after={[
            { label: "OB 名簿の 一元化", value: "SaaS で 100 件 統合" },
            { label: "リフォーム時期 推定", value: "AI 自動 (10-15 年 / 25-30 年)" },
            { label: "OB アプローチ 月間 件数", value: "10〜15 件 (推奨順)" },
            { label: "OB リフォーム 獲得率", value: "40%+ (試算)" },
            { label: "年間 リフォーム売上 (試算)", value: "約 ¥3,000-4,500 万" },
          ]}
          delta={[
            { label: "年間 売上 機会", value: "約 +¥1,500-3,000 万", emphasis: true },
            { label: "1 件 取れれば", value: "SaaS 月額 12 ヶ月分 以上 回収" },
            { label: "IT 導入補助金", value: "通常枠 1/2 対象 見込み" },
          ]}
          disclaimer="上の数字は あくまで想定例です。 業界平均の 獲得率 20-30%、 リフォーム平均単価 ¥150 万 をもとに 試算しています。 実際の効果は、 名簿の質や 地域性、 施主との関係性によって 大きく 変わります。"
        />

        <section className="mt-20 rounded-lg border border-gray-200 bg-gray-50 p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-gray-900">
            この方向で 相談したい場合
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            初期 3-6 ヶ月の Excel / 紙台帳 から SaaS への 移行は BPaaS (業務代行) で 弊社が 巻き取ります。 親方の手は ほぼ 動きません。
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <PriceTier
              amount="月 3 万円"
              label="SaaS のみ"
              note="(移行は 自分でやる)"
            />
            <PriceTier
              amount="月 5 万円"
              label="SaaS + 月 1 回 操作サポート"
              note="親方 + アトツギで 共有"
              emphasis
            />
            <PriceTier
              amount="月 8 万円"
              label="SaaS + アプローチ代行"
              note="文面作成・送信を 弊社が 巻き取り"
            />
          </div>
          <p className="mt-4 text-xs font-bold text-gray-500">
            初期 BPaaS (Excel / 紙 → SaaS 移行): <strong>50 万 / 100 万 / 150 万</strong> の 3 段階で 見積もり可 (件数次第)
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              asChild
              className="h-10 rounded-md bg-gray-900 px-4 text-sm font-medium text-white shadow-none hover:bg-gray-800"
            >
              <Link href="/#contact">
                無料で相談する
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-10 rounded-md border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 shadow-none hover:bg-gray-50"
            >
              <Link href="/">トップへ戻る</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

function PriceTier({
  amount,
  label,
  note,
  emphasis = false,
}: {
  amount: string
  label: string
  note: string
  emphasis?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        emphasis
          ? "border-[#0e7490] bg-white shadow-[0_8px_24px_rgba(14,116,144,0.15)]"
          : "border-gray-200 bg-white"
      }`}
    >
      <p
        className={`text-xl font-black tracking-tight ${
          emphasis ? "text-[#0e7490]" : "text-gray-900"
        }`}
      >
        {amount}
      </p>
      <p className="mt-1 text-sm font-bold text-gray-700">{label}</p>
      <p className="mt-1 text-xs font-bold text-gray-500">{note}</p>
    </div>
  )
}
