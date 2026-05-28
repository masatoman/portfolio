import type { Metadata } from "next"
import { V8DemosDashboard } from "./v8-demos-dashboard"

export const metadata: Metadata = {
  title: "v8.0 6 デモ 内部評価ダッシュボード | 内部資料",
  description:
    "井原誠斗 (masatoman) 内部用 — v8.0 6 デモ 並列開発結果 + 4 AI 合議スコア + 採用判定 + 関連 docs リンク集。 ヒアリング相手には見せない。",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
}

export default function V8DemosDashboardPage() {
  return <V8DemosDashboard />
}
