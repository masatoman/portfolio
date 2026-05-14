import type { Metadata } from "next"
import { DemoVoteForm } from "@/components/demo-gallery/vote-form"

export const metadata: Metadata = {
  title: "喉から手が出るほど欲しいツールを教えてください / 工務店業務改善ツール 8 案",
  description:
    "工務店現場で「これあったら絶対使う」 と思うツール 8 案。 最大 3 つ選んでください。",
}

const demos = [
  {
    number: 1,
    slug: "estimate-organizer",
    name: "見積 PDF 整理ツール",
    oneLiner: "PDF をアップしたら自動で項目テーブルに整理",
    description:
      "外注先 (設備・電気・水道業者など) から PDF で受け取った見積書を、 ファイルをアップすると項目・数量・単価が自動で表に整理されます。 みつも郎 17 への二重入力で潰れる時間を解消します。",
    hypothesis: "② みつも郎 17 二重入力",
    imagePath: "/images/demo-mocks/estimate-organizer.png",
    orientation: "desktop" as const,
  },
  {
    number: 2,
    slug: "call-memo-board",
    name: "電話メモ管理表",
    oneLiner: "誰が・いつ・何を話したかを後から検索できる",
    description:
      "電話 / LINE 通話の内容を、 担当者・日時・対応状態とともに記録。 「言った言わない」 問題と情報散逸を防ぎます。 ホワイトボードや付箋メモの代替。",
    hypothesis: "③ 通話記録散逸",
    imagePath: "/images/demo-mocks/call-memo-board.png",
    orientation: "desktop" as const,
  },
  {
    number: 3,
    slug: "site-photo-organizer",
    name: "現場写真自動整理",
    oneLiner: "撮りためた写真を現場名・工程・日付で自動分類",
    description:
      "現場で撮った大量の写真をアップロードすると、 「現場名 / 工程 (基礎・配筋・上棟…) / 撮影日」 で自動仕分けされます。 「あの配筋の写真どこ」 で 30 分探す手間がなくなります。",
    hypothesis: "④ 移動深夜 / 現場完結",
    imagePath: "/images/demo-mocks/site-photo-organizer.png",
    orientation: "desktop" as const,
  },
  {
    number: 4,
    slug: "voice-daily-report",
    name: "音声日報投稿",
    oneLiner: "車中で話した内容が、 家に着く頃には日報になっている",
    description:
      "現場の帰り道で話した内容を音声録音すると、 日報フォーマットに自動で整います。 「事務所に戻ってからの日報書きで残業」 を解消する仕組み。",
    hypothesis: "④ 移動深夜 / 現場完結",
    imagePath: "/images/demo-mocks/voice-daily-report.png",
    secondaryImagePath: "/images/demo-mocks/voice-daily-report-history.png",
    orientation: "mobile" as const,
  },
  {
    number: 5,
    slug: "receipt-expense-camera",
    name: "領収書カメラ OCR",
    oneLiner: "スマホで撮るだけで経費精算が完了",
    description:
      "現場で発生する材料費・燃料代の領収書をスマホで撮影するだけで、 日付 / 店名 / 金額 / 品目を自動抽出。 月末の経費まとめ作業を不要にします。",
    hypothesis: "④ 移動深夜 / 現場完結",
    imagePath: "/images/demo-mocks/receipt-expense-camera.png",
    orientation: "mobile" as const,
  },
  {
    number: 6,
    slug: "drawing-quick-viewer",
    name: "図面クイックビューア",
    oneLiner: "現場で図面を即座に開いて確認・注釈",
    description:
      "スマホ / タブレットから建築図面 PDF を瞬時に開き、 ピンチズーム + 部屋検索 + 注釈書き込みができます。 「事務所に図面確認の電話する」 を不要に。",
    hypothesis: "④ 移動深夜 / 現場完結",
    imagePath: "/images/demo-mocks/drawing-quick-viewer.png",
    orientation: "desktop" as const,
  },
  {
    number: 7,
    slug: "client-progress-page",
    name: "施主向け進捗ページ",
    oneLiner: "お客様が自分で進捗を確認できる専用ページ",
    description:
      "工事の進捗を施主 (お客様) が見られる専用ページ。 写真・工程・次の予定が時系列でまとまっており、 「進捗の電話が頻繁にかかる」 を解消します。",
    hypothesis: "③ 通話記録散逸 / 顧客満足",
    imagePath: "/images/demo-mocks/client-progress-page.png",
    orientation: "mobile" as const,
  },
  {
    number: 8,
    slug: "website-refresh",
    name: "工務店 Web リニューアル",
    oneLiner: "古臭いホームページを今っぽく整える提案",
    description:
      "古臭い工務店ホームページを、 最低限の情報を整理してモダンなデザインに置き換える提案ツール。 ビフォー / アフター比較形式で見られます。 「Web から問い合わせが来ない」 を解消。",
    hypothesis: "(補完) 工務店 Web 集客",
    imagePath: "/images/demo-mocks/website-refresh.png",
    orientation: "desktop" as const,
  },
]

export default function DemoGalleryPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <main className="mx-auto max-w-3xl px-6 py-16">
        {/* ヒーロー */}
        <section className="mb-16">
          <div className="mb-3 inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
            工務店向け業務改善ツール 8 案 / ご意見募集中
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl">
            喉から手が出るほど欲しいツールを 最大 3 つ教えてください
          </h1>
          <p className="mt-4 text-base leading-7 text-gray-600">
            工務店現場の「困りごと」 を解消するための業務改善ツール 8 案です。 すべて UI デザイン案 (実装イメージ) の段階で、 まだ動くものはありません。
          </p>
          <p className="mt-3 text-base leading-7 text-gray-600">
            「これあったら絶対使う」 と思うものを<strong>最大 3 つ</strong>選んで、 お立場と一緒に送ってください。 1〜2 分で済みます。 全部いらない場合は、 コメント欄で「全部いらない」 と書いてもらっても OK です。
          </p>
        </section>

        {/* 投票フォーム (Client Component) */}
        <DemoVoteForm demos={demos} />
      </main>

      <footer className="mt-16 border-t border-gray-200">
        <div className="mx-auto max-w-3xl px-6 py-6 text-xs text-gray-500">
          masatoman / ihara-frontend.com / 工務店向け業務改善 SaaS 検討中
        </div>
      </footer>
    </div>
  )
}
