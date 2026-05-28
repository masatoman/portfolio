import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { DemoUsageGuide } from "@/components/local-business/demo-usage-guide"
import { ContentAutoDemo } from "@/components/local-business/content-auto-demo"
import { SavingsSimulation } from "@/components/local-business/savings-simulation"

export const metadata: Metadata = {
  title: "コンテンツ自動生成 SaaS | 工務店向けデモ",
  description:
    "工事現場で撮った写真と1行メモを LINE / Slack に投げるだけで、 施工事例記事 / Instagram投稿 / お客様の声 を AI が自動生成。 後継者が1タップで公開承認できる仕組みのデモです。",
}

export default function ContentAutoPage() {
  return (
    <DemoPageShell
      eyebrow="動くデモ: コンテンツ自動生成 SaaS"
      title="写真と 1行メモ で、 ホームページ更新が 止まらない 工務店に"
      description="工事現場で撮った写真と 1行メモを LINE / Slack に投げるだけで、 AI が 施工事例記事 / Instagram投稿 / お客様の声 を 3種類まとめて 自動生成。 後継者 (アトツギ) が 1タップで 公開承認できる仕組みのデモです。"
    >
      {/* v8.0 #02 候補 バッジ */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center rounded-full border border-[#7c3aed] bg-[#f3ecff] px-3 py-1 text-xs font-bold tracking-[0.08em] text-[#7c3aed]">
          v8.0 #02 候補
        </span>
        <span className="inline-flex items-center rounded-full border border-[#cfd8e6] bg-white px-3 py-1 text-xs font-bold text-[#33496d]">
          動くデモ
        </span>
        <span className="inline-flex items-center rounded-full border border-[#cfd8e6] bg-white px-3 py-1 text-xs font-bold text-[#33496d]">
          コンテンツ自動生成 SaaS
        </span>
        <span className="inline-flex items-center rounded-full border border-[#cfd8e6] bg-white px-3 py-1 text-xs font-bold text-[#33496d]">
          評価マトリクス 62/80
        </span>
      </div>

      <DemoUsageGuide
        accent="#7c3aed"
        pains={[
          "ホームページの 更新が 半年以上 止まっている",
          "現場 写真は 撮っているが、 記事化する 時間が ない",
          "Instagram も やりたいが、 文章 考えるのが 苦手",
        ]}
        steps={[
          {
            no: "1",
            title: "現場で 写真を 撮る",
            body: "工事完了時に スマホで 1枚撮るだけ。 構図や 画質は 気にしなくて OK。",
          },
          {
            no: "2",
            title: "LINE / Slack に 1行メモ を 投げる",
            body: "「○○邸の屋根葺替完成」 など、 短い メモを 添えて 送信するだけ。",
          },
          {
            no: "3",
            title: "AI が 3種類の 記事を 自動生成",
            body: "施工事例記事 / Instagram投稿 / お客様の声 を 同時生成。 後継者が 1タップで 公開承認。",
          },
        ]}
        outcomes={[
          { label: "1記事 作る時間", value: "60分 → 1分" },
          { label: "月の 更新本数", value: "0本 → 12本" },
        ]}
      />

      <ContentAutoDemo />

      <SavingsSimulation
        scenarioTitle="ホームページ 更新が 半年 止まっている 工務店の場合"
        scenarioDescription="現場で 写真は 撮っているが、 文章を書く 時間が取れず、 ホームページの 施工事例ページが 半年以上 更新されていない 工務店を想定しています。"
        before={[
          { label: "月の 施工事例 更新", value: "0本" },
          { label: "月の Instagram 投稿", value: "0本" },
          { label: "1本 書く時間 (現状)", value: "約 60分" },
          { label: "結果 サイト経由 問い合わせ", value: "月 0〜1件" },
        ]}
        after={[
          { label: "月の 施工事例 更新", value: "月 8本" },
          { label: "月の Instagram 投稿", value: "月 8本" },
          { label: "1本 確認する時間", value: "約 1分" },
          { label: "結果 サイト経由 問い合わせ", value: "月 3〜5件" },
        ]}
        delta={[
          { label: "月の コンテンツ 増加", value: "約 +16本", emphasis: true },
          { label: "年の 問い合わせ 増加 (想定)", value: "約 +36〜48件" },
          { label: "年の 売上 上振れ (想定)", value: "数千万円 単位" },
        ]}
        disclaimer="効果は 業種・地域・既存ホームページの状態によって 大きく変わります。 ご相談時に 現状の数字を 確認した上で、 もう少し現実的な見積もりを お出しします。"
      />
    </DemoPageShell>
  )
}
