import type { Metadata } from "next"
import { PortfolioContent } from "./portfolio-content"

export const metadata: Metadata = {
  title: "Portfolio | 井原誠斗 — Web 制作 + 業務改善エンジニア",
  description:
    "個人開発の経験から業務アプリ制作まで。 一人で企画から納品まで組み上げるフロントエンドエンジニア・井原誠斗のポートフォリオ。 中小企業・小規模事業者向けに動くデモを公開しています。",
  alternates: {
    canonical: "/portfolio",
  },
}

export default function PortfolioPage() {
  return <PortfolioContent />
}
