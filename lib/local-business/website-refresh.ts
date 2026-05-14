export type ComparisonBlock = {
  id: "hero" | "service" | "contact" | "mobile"
  label: string
  before: string
  after: string
}

export const websiteRefreshBlocks: ComparisonBlock[] = [
  {
    id: "hero",
    label: "Hero",
    before: "何をしている会社か分かりにくく、第一印象で離脱されやすい。",
    after: "地域密着の強みと相談導線を1画面目に集約し、初見でも内容が伝わる。",
  },
  {
    id: "service",
    label: "Service",
    before: "サービス説明が長文で、施工領域や強みが読み取りにくい。",
    after: "施工内容をカード化し、写真と実績を並べて比較しやすくする。",
  },
  {
    id: "contact",
    label: "Contact",
    before: "問い合わせ方法が分散し、電話かフォームか迷いやすい。",
    after: "CTAを統一し、スマホでも相談しやすい導線に整理する。",
  },
  {
    id: "mobile",
    label: "Mobile",
    before: "PC前提のレイアウトで、スマホでは文字が詰まり見づらい。",
    after: "縦スクロール前提で余白とボタンサイズを最適化し、片手操作しやすくする。",
  },
]
