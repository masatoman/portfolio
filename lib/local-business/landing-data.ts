/**
 * 新トップ ( / ) と /preview/top-* 3 案で共有するランディングデータ。
 * lucide アイコンは Component で渡したいので JSX が必要 → 各ページ側で import + JSX マウント。
 * ここでは生データのみ。
 */

export type ProblemKey =
  | "estimate"
  | "phone"
  | "old-hp"
  | "scattered"
  | "daily-report"
  | "site-photo"
  | "receipt"
  | "drawing"

export const problems: Array<{
  key: ProblemKey
  iconName: "FileSpreadsheet" | "Phone" | "Monitor" | "Search" | "FileText" | "Camera" | "Receipt" | "Map"
  title: string
  text: string
  /** 案 3 で 直接該当デモへのリンク先 */
  demoHref?: string
}> = [
  {
    key: "estimate",
    iconName: "FileSpreadsheet",
    title: "見積の確認に時間がかかる",
    text: "協力業者から届く PDF や紙の見積書を見比べるだけで、 思った以上に時間を使ってしまう。",
    demoHref: "/local-business/estimate-organizer",
  },
  {
    key: "phone",
    iconName: "Phone",
    title: "電話内容が残りにくい",
    text: "現場確認や仕様変更のやり取りが口頭中心で、 あとから確認しづらい。",
    demoHref: "/local-business/call-memo-board",
  },
  {
    key: "site-photo",
    iconName: "Camera",
    title: "現場写真を探すのが大変",
    text: "1 日に数百枚撮る現場写真。「あの配筋写真どこ?」 で時間が消える。",
    demoHref: "/local-business/site-photo-organizer",
  },
  {
    key: "receipt",
    iconName: "Receipt",
    title: "領収書の入力が月末まとめて辛い",
    text: "ガソリン・建材・食事の紙の領収書、 月末に山積みになって 2 時間溶ける。",
    demoHref: "/local-business/receipt-expense-camera",
  },
]

export const examples: Array<{
  slug: string
  title: string
  shortTitle: string
  desc: string
  href: string
  image: string
  /** 削減効果のキャッチ (案 1 で バッジに使う) */
  savingsTag: string
  /** 案 3 で 「この困りごと用のデモ」 と紐付ける */
  problemKey?: ProblemKey
}> = [
  {
    slug: "voice-daily-report",
    title: "車で しゃべるだけで 日報を作る",
    shortTitle: "音声日報",
    desc: "帰り道に話すだけで、 家に着く頃には日報が出来上がっている仕組み。 事務所での残業 1 時間をなくすデモ。",
    href: "/local-business/voice-daily-report",
    image: "/images/local-business/voice-daily-report-card.svg",
    savingsTag: "日報 1h → 3 分",
    problemKey: "daily-report",
  },
  {
    slug: "site-photo-organizer",
    title: "現場写真を自動で仕分ける",
    shortTitle: "写真 自動仕分け",
    desc: "1 日に撮る数百枚の現場写真を、 現場名・工程・撮影日で自動仕分け。 「あの配筋写真どこ」 をなくすデモ。",
    href: "/local-business/site-photo-organizer",
    image: "/images/local-business/site-photo-organizer-card.svg",
    savingsTag: "探す時間 -90%",
    problemKey: "site-photo",
  },
  {
    slug: "client-progress-page",
    title: "施主向け 工程進捗ページを自動更新",
    shortTitle: "施主向け 進捗",
    desc: "「今どうなってる?」 と聞かれるたびの写真撮影と送信を、 自動更新の公開ページに置き換えるデモ。",
    href: "/local-business/client-progress-page",
    image: "/images/local-business/client-progress-page-card.svg",
    savingsTag: "問合せ -70%",
  },
  {
    slug: "receipt-expense-camera",
    title: "領収書を撮るだけで経費に",
    shortTitle: "領収書 → 経費",
    desc: "現場のガソリン・建材・食事の紙の領収書を、 撮るだけで日付・金額・取引先が自動入力されるデモ。 電帳法対応。",
    href: "/local-business/receipt-expense-camera",
    image: "/images/local-business/receipt-expense-camera-card.svg",
    savingsTag: "月末 2h → 10 分",
    problemKey: "receipt",
  },
  {
    slug: "drawing-quick-viewer",
    title: "図面をスマホで一発呼び出し",
    shortTitle: "図面 ビューワ",
    desc: "現場で 「あの図面どこ」 の電話をなくす。 部屋名で検索 → 該当箇所だけ拡大表示。 手袋でも押せる大ボタン。",
    href: "/local-business/drawing-quick-viewer",
    image: "/samples/floor-plan/sample-1f-framing.png",
    savingsTag: "電話 月 30 → 0 件",
  },
  {
    slug: "estimate-organizer",
    title: "協力業者の見積確認を軽くする",
    shortTitle: "見積 整理",
    desc: "届いた見積書 PDF を整理し、 項目確認や転記の手間を減らすデモ。",
    href: "/local-business/estimate-organizer",
    image: "/images/local-business/estimate-organizer-card.svg",
    savingsTag: "確認 30 分 → 5 分",
    problemKey: "estimate",
  },
  {
    slug: "call-memo-board",
    title: "現場連絡の抜け漏れを減らす",
    shortTitle: "電話 メモ",
    desc: "電話内容と次の対応を残し、 共有漏れや確認漏れを起こしにくくするデモ。",
    href: "/local-business/call-memo-board",
    image: "/images/local-business/call-memo-board-card.svg",
    savingsTag: "対応漏れ ゼロ",
    problemKey: "phone",
  },
  {
    slug: "website-refresh",
    title: "工務店ホームページの作り直し",
    shortTitle: "HP リフレッシュ",
    desc: "施工実績と会社の姿勢が伝わる、 提案用の工務店コーポレートサイト制作実績。",
    href: "/local-business/website-refresh",
    image: "/images/local-business/kazenokisha/exterior-day.png",
    savingsTag: "新規問合せ +",
  },
]

export const HERO_PRICE = {
  initial: "10 万円",
  monthly: "1 万円",
  scope: "5〜30 人の工務店向け",
}

export const LINE_URL = "https://lin.ee/aHMYDKEu"

export const NUMBERS = [
  { v: "8", l: "触れる制作例" },
  { v: "月¥5,000以下", l: "ランニング目安" },
  { v: "5+ 年", l: "Web 開発経験" },
]
