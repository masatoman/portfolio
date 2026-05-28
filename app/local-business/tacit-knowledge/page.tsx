import type { Metadata } from "next"
import { DemoPageShell } from "@/components/local-business/demo-page-shell"
import { TacitKnowledgeDemo } from "./_demo"

export const metadata: Metadata = {
  title: "暗黙知継承 AI | 親方の頭の中を AI が継続取材する 工務店向けデモ",
  description:
    "40-50 年の経験 / 職人ネットワーク / 仕入れノウハウ / 過去トラブル対応 を AI が週 1 LINE 通話で継続取材。 後継者は親方の口調で答えが返ってくる。 v8.0 #07 候補 / 事業承継軸ど真ん中のデモです。",
}

export default function TacitKnowledgePage() {
  return (
    <DemoPageShell
      eyebrow="動くデモ: 暗黙知継承 AI / v8.0 #07 候補 / 事業承継軸"
      title="親方の頭の中を、 AI が 毎週 LINE 通話で 聞き取って残す"
      description="40-50 年の現場経験、 職人ネットワーク、 仕入れの コツ、 過去の トラブル対応 — 親方が引退すると 一緒に 消えてしまう知識を AI が継続取材して 後継者に渡す。 「あの時 どうしたんやっけ?」 と聞けば、 親方の口調風に 答えが返ってくる。"
    >
      <TacitKnowledgeDemo />
    </DemoPageShell>
  )
}
