/**
 * Shared content for /preview/* design variants.
 *
 * Audience: IT-illiterate small-business owners (e.g. construction site
 * supervisors, factory owners, local restaurant owners) who do not know
 * what "mobile device" or "SaaS" means. Avoid all jargon.
 *
 * Tone:
 * - Talk about visible problems and visible outcomes.
 * - Use concrete numbers (yen, days) wherever possible.
 * - "Done by us" rather than "we use X technology".
 */

export const siteMeta = {
  ownerName: "井原 誠斗",
  brandName: "Ihara Frontend",
  catchphrase: "残業の原因を、ITで撃退します。",
  subCatch: "現場のお仕事に集中できるよう、面倒なパソコンの仕事をかわりに作ります。",
  status: "新しいご相談をうけつけ中",
}

export const heroBigStatement = {
  // Used by Tesla/Apple style large hero
  primary: "毎日の手間を、",
  primary2: "1台のスマホに。",
  description:
    "電話・紙・FAX で時間がかかっていた仕事を、お客様が ふつうに使っているスマホやパソコンの中にまとめます。むずかしい設定や専門用語は こちらで全部やります。",
}

// ─────────────────────────────────────────
// Pain points written in customer language
// ─────────────────────────────────────────
export const pains = [
  {
    headline: "電話と紙で 一日が おわってしまう",
    body: "予約の電話、見積もりのFAX、台帳への書きうつし。お客様と向き合う時間が、事務作業で消えていませんか。",
  },
  {
    headline: "ホームページが もう古い",
    body: "10年前に作ったまま、スマホで見ると文字が小さい。新しいお客様に見せるのが はずかしい。そう感じていませんか。",
  },
  {
    headline: "頭の中の作業を 人にわたせない",
    body: "ベテランの段取りや見積もりのコツが、その人の頭の中だけにある。教えたいけど、口で説明するのが むずかしい。",
  },
]

// ─────────────────────────────────────────
// Services — each item describes a *visible outcome*
// ─────────────────────────────────────────
export const services = [
  {
    no: "01",
    title: "新しいホームページを 作りなおす",
    outcome: "スマホで きれいに見える、お客様が「ちゃんとしてる会社だな」と感じるホームページ。",
    examples: [
      "今のホームページを 今っぽく作りなおす",
      "サービス・料金・お問い合わせ・実績ページをきちんと整える",
      "お問い合わせのメールが届きやすい・返しやすいかたちに",
    ],
    priceHint: "30万円ぐらいから",
  },
  {
    no: "02",
    title: "予約・お問い合わせを 自動でうける",
    outcome: "電話に出られなかった時間も、お客様が自分で予約や問い合わせを入れてくれる仕組み。",
    examples: [
      "ホームページに 予約フォームを足す",
      "LINE で 受付できるようにする",
      "予約が入ったら すぐ通知がくる",
    ],
    priceHint: "10万円ぐらいから",
  },
  {
    no: "03",
    title: "紙の作業を スマホでまとめる",
    outcome: "見積もり、報告書、現場写真、勤怠。バラバラだった紙の作業を、スマホ1台でできるように。",
    examples: [
      "現場で写真を撮ったら 自動で記録される",
      "見積もり書を ボタン1つで作る",
      "誰がどこで何をしているか 一覧で見える",
    ],
    priceHint: "50万円ぐらいから",
  },
  {
    no: "04",
    title: "AI に 文章や仕分けをまかせる",
    outcome: "問い合わせの返信、見積もりの下書き、長い動画の内容まとめ。最近よく聞く「AI」に、文章のしごとを任せる仕組み。",
    examples: [
      "問い合わせメールに AI が下書きを作る",
      "長い会議録音から 大事なところだけ抜き出す",
      "お客様データを AI が自動で分類する",
    ],
    priceHint: "20万円ぐらいから",
  },
  {
    no: "05",
    title: "今あるサイトの 直し・改善",
    outcome: "全部作り直さなくていい。気になっているところだけ、ピンポイントで直す。",
    examples: [
      "スマホで読みにくい部分を直す",
      "表示が遅いページを早くする",
      "Google で見つけてもらいやすくする",
    ],
    priceHint: "5万円ぐらいから",
  },
  {
    no: "06",
    title: "公開したあとも ずっと 面倒みる",
    outcome: "作って渡して終わり、ではなく、「ここ直したい」を 月いくらで対応しつづける。",
    examples: [
      "電話・LINE で気軽に相談できる",
      "ちょっとした修正は その日のうちに",
      "新しい機能の追加も 相談しながら",
    ],
    priceHint: "月3万円ぐらいから",
  },
]

// Curated 3-service set used by the lightweight (5-section) variants.
// Three concrete, AI-free deliverables that any small-business owner can
// pattern-match to their own situation. Order: visible (HP) → workflow
// (booking) → operations (paper-to-mobile).
export const servicesCore = [services[0], services[1], services[2]]

// ─────────────────────────────────────────
// Works
//
// `coreWorks` is the headline list — practical B2B demos shown on the
// main portfolio (target audience: small-business owners with low IT
// literacy). Each entry links to a real interactive demo under
// `/local-business/*`.
//
// `labWorks` is the personal / experimental list shown on the secondary
// `/lab` page. These are useful as proof-of-skill but not relevant to
// the main customer's job.
//
// Each work supports a static cover image and an optional silent screen-
// recording video that auto-plays in place of the image:
//   public/images/works/<slug>.jpg     ← cover (required when added)
//   public/videos/works/<slug>.mp4     ← optional silent loop (h.264, ≤4 MB)
//   public/videos/works/<slug>.webm    ← optional same content in webm
// ─────────────────────────────────────────
export type Work = {
  title: string
  role: string
  desc: string
  keyNumbers?: { v: string; l: string }[]
  href: string
  cover?: string
  video?: { mp4: string; webm?: string; poster?: string }
  accent: string
}

// Practical B2B demos shown on the main page.
export const coreWorks: Work[] = [
  {
    title: "PDFの 見積もりを 表で見やすくする ツール",
    role: "工務店・中小企業向け デモ",
    desc: "外注先から バラバラに届く PDF の見積もりを、ボタン1つで 表に整理。複数社の金額・項目を 一画面で 並べて比べられます。",
    href: "/local-business/estimate-organizer",
    cover: "/images/works/estimate-organizer.jpg",
    accent: "#f97316",
  },
  {
    title: "電話メモを 一元管理する 業務ボード",
    role: "現場監督・営業向け デモ",
    desc: "電話で受けた 取引先・用件・次の対応を 1画面で残す仕組み。「未対応・対応中・完了」が 色で 一目で分かるので、 漏れや重複が 減ります。",
    href: "/local-business/call-memo-board",
    cover: "/images/works/call-memo-board.jpg",
    accent: "#3b82f6",
  },
  {
    title: "工務店向け ホームページ 制作の例",
    role: "B2B 提案 サンプル",
    desc: "同じ会社・同じ素材で、 5方向で違う 見せ方を作って比較。「うちのホームページ どう変えればいいか」を 視覚的に 確認できる ケーススタディ。",
    href: "/local-business/website-refresh",
    cover: "/images/works/website-refresh.jpg",
    accent: "#6366f1",
  },
  {
    title: "車で しゃべるだけで 日報になる ツール",
    role: "現場監督向け デモ",
    desc: "1日の終わりに事務所で日報を書くために 残業1時間。 帰り道にスマホへ話すだけで、 家に着く頃には日報が出来上がっている仕組みを作りました。",
    href: "/local-business/voice-daily-report",
    cover: "/images/local-business/voice-daily-report-card.svg",
    accent: "#10b981",
  },
  {
    title: "現場写真を 自動でしまう ツール",
    role: "現場監督向け デモ",
    desc: "1日 300枚 撮る現場写真を、 現場名・工程・撮影日 で 自動仕分け。「あの配筋写真どこ」で 30分 探す手間を なくします。",
    href: "/local-business/site-photo-organizer",
    cover: "/images/local-business/site-photo-organizer-card.svg",
    accent: "#ec4899",
  },
  {
    title: "施主向け 工程進捗 お知らせページ",
    role: "工務店向け デモ",
    desc: "施主からの「今どうなってる？」 電話・LINE が 毎週来る。 そのたびに写真を撮って送る手間を、 自動更新の 公開ページに 置き換えます。",
    href: "/local-business/client-progress-page",
    cover: "/images/local-business/client-progress-page-card.svg",
    accent: "#06b6d4",
  },
  {
    title: "領収書を 撮るだけで 経費になる ツール",
    role: "工務店・現場 経費精算 デモ",
    desc: "現場のガソリン・建材・食事の 紙の領収書が ポケットと車内に散乱。 月末の経費まとめで 夜中まで残業。 これを撮るだけで 自動入力に置き換えます。",
    href: "/local-business/receipt-expense-camera",
    cover: "/images/local-business/receipt-expense-camera-card.svg",
    accent: "#facc15",
  },
  {
    title: "図面を スマホで さっと出す ツール",
    role: "現場監督向け デモ",
    desc: "現場で「リビングの 建具寸法 どっちだっけ」のために 事務所に電話。 手袋した手で PDF はめくれない。 部屋名 1タップで 出るようにします。",
    href: "/local-business/drawing-quick-viewer",
    cover: "/samples/floor-plan/sample-1f-framing.png",
    accent: "#a855f7",
  },
]

// Personal / experimental projects shown on /lab.
export const labWorks: Work[] = [
  {
    title: "料理動画から 材料と手順を AI が取り出すアプリ",
    role: "ぜんぶ 自分で作りました",
    desc: "YouTube の料理動画は たのしいけど、長くて材料を覚えにくい。動画を入れると、AI が材料と手順をきれいにまとめて見せてくれるアプリです。",
    keyNumbers: [
      { v: "AI", l: "動画の中身を読む" },
      { v: "PWA", l: "アプリのように使える" },
      { v: "課金", l: "お金が払える仕組み" },
    ],
    href: "https://recipe-ai-opal.vercel.app/ja",
    cover: "/images/works/recipe-ai.jpg",
    accent: "#ff7a3d",
  },
  {
    title: "家族の買いもの依頼アプリ",
    role: "ぜんぶ 自分で作りました",
    desc: "「これ買ってきて」と頼みたい人と、買いに行ける人をスマホでつなぐアプリ。家族の中で 何を頼んだか・買ったかが リアルタイムで見えます。",
    keyNumbers: [
      { v: "実家族", l: "毎日つかってる" },
      { v: "片手", l: "スマホ片手で使える" },
      { v: "通知", l: "頼まれたらすぐわかる" },
    ],
    href: "https://kore-katte-kite.vercel.app",
    cover: "/images/works/kore-katte-kite.jpg",
    accent: "#39d2c0",
  },
  {
    title: "自分のブログ + 有料記事の仕組み",
    role: "ぜんぶ 自分で作りました",
    desc: "個人開発の体験談を書きためている自分のブログサイト。70本以上の記事と、お金が払える有料記事の仕組みを すべて自分で組みました。",
    keyNumbers: [
      { v: "70+", l: "記事の本数" },
      { v: "有料", l: "記事の販売もできる" },
      { v: "SEO", l: "検索でみつかる" },
    ],
    href: "https://masatoman.net",
    cover: "/images/works/masatoman.jpg",
    accent: "#7c83ff",
  },
  {
    title: "他のエンジニアが 早くアプリを出せる土台",
    role: "ぜんぶ 自分で作りました",
    desc: "ふつう数週間かかる「会員登録・お金が払える・メールが届く」までの仕組みを、買ったその日から使える形でまとめたもの。自分の他のアプリの土台にも使ってます。",
    keyNumbers: [
      { v: "1日", l: "立ち上がる" },
      { v: "決済", l: "Stripe対応" },
      { v: "メール", l: "送信機能つき" },
    ],
    href: "https://launchkit.jp",
    cover: "/images/works/launchkit.jpg",
    accent: "#ffc857",
  },
]

// Backward-compat alias: legacy `works` import keeps working in /preview/*
// pages until those previews are deprecated.
export const works = labWorks

// ─────────────────────────────────────────
// Why we are different
// ─────────────────────────────────────────
export const strengths = [
  {
    title: "全部 まる投げで OK",
    body: "「何を頼めばいいか分からない」状態で大丈夫です。話しながら、どこから手をつければお客様の困りごとが解けるか、こちらで整理します。",
  },
  {
    title: "毎月 ¥5,000 で うごく作り",
    body: "私自身が 4つのサービスを 月5,000円以下で動かし続けています。毎月のお金がかかる仕組みで損しないよう、最小限の費用で組みます。",
  },
  {
    title: "AI を ちゃんと使い切る",
    body: "AI の使い方は ニュースや書籍だけだと まちがった方向に行きがち。私自身が毎日AIで仕事を回している経験から、お客様の業務に合うかたちで取り入れます。",
  },
]

// ─────────────────────────────────────────
// Flow — relaxed, no contracts at first
// ─────────────────────────────────────────
export const flow = [
  { n: "01", title: "気軽に ご連絡ください", body: "電話、LINE、メール、どれでも大丈夫です。「○○がしたい」だけで OK。" },
  { n: "02", title: "30分 お話を伺います", body: "今のお仕事、困っていること、欲しい結果を伺います。この時点ではお金はかかりません。" },
  { n: "03", title: "やることと お見積もりを お渡しします", body: "「これだけやれば困りごとが解けます」を、紙でわかりやすくまとめて お渡しします。" },
  { n: "04", title: "ご納得いただいてから スタート", body: "見積もりを見て「お願いします」となってから、はじめて契約・着手します。" },
  { n: "05", title: "つくっている途中も 見られます", body: "お客様にも 制作中の画面をお見せしながら、感想を伺いながら進めます。" },
  { n: "06", title: "公開後も ずっと 面倒みます", body: "渡して終わりではなく、「ここ直したい」が出てきたときも 相談できる関係でいます。" },
]

// ─────────────────────────────────────────
// FAQ — written from beginner's questions
// ─────────────────────────────────────────
export const faq = [
  {
    q: "パソコンが あまり得意ではないのですが、頼めますか？",
    a: "もちろん大丈夫です。むずかしい設定や言葉は こちらで ぜんぶ片付けます。お客様には 出来あがった画面を 普通に使ってもらうだけです。",
  },
  {
    q: "何を作ればいいか分かりません。それでも相談できますか？",
    a: "それで大丈夫です。「忙しい」「困っている」だけ教えてください。何を作るかを 一緒に考えるところから 始めます。",
  },
  {
    q: "いくらかかりますか？",
    a: "ホームページの作り直しで 30万円ぐらいから、業務アプリで 50万円ぐらいから、というのが ひとつの目安です。中身で大きく変わるので、まずは お話を聞いてから具体的な金額をお出しします。",
  },
  {
    q: "急ぎの場合 どれくらいで できますか？",
    a: "小さな修正なら 数日、ホームページなら 1ヶ月、業務アプリなら 2〜3ヶ月が目安です。「いつまでに」がある場合は 最初に教えてください。",
  },
  {
    q: "作ったあと 自分で更新できますか？",
    a: "更新したい部分は、お客様自身でも かんたんに直せる作りにします。「ここは自分でいじりたい」を 最初にうかがって設計します。",
  },
]

// ─────────────────────────────────────────
// Profile — a bit warmer in tone
// ─────────────────────────────────────────
export const profile = {
  name: "井原 誠斗",
  nameRomaji: "Masato Ihara",
  role: "ホームページ・業務アプリを作る人",
  intro:
    "5年以上、Web のしごとをしています。ホームページ・業務アプリ・既存サイトの改善まで、企画から納品まで すべて 一人で組み上げます。お客様自身では作れない部分を こちらで全部かたちにして、お渡しします。",
  rows: [
    { l: "屋号", v: "Ihara Frontend（井原フロントエンド）" },
    { l: "活動", v: "オンラインで 全国対応" },
    { l: "得意なこと", v: "ホームページ作り直し / 業務アプリ / 既存サイトの改善" },
    { l: "対応範囲", v: "ヒアリング、設計、制作、公開、その後の改善まで" },
    { l: "連絡手段", v: "電話 / LINE / メール / Google Meet（テレビ電話）" },
  ],
  numbers: [
    { v: "5+", l: "年の経験" },
    { v: "4", l: "じぶんで作って動かしている" },
    { v: "1人", l: "設計から納品まで" },
  ],
}

// ─────────────────────────────────────────
// Contact CTA messaging
// ─────────────────────────────────────────
export const contact = {
  heading: "まずは お話だけ してみませんか",
  body:
    "「むずかしい話は分からないけど、何かしたい」で大丈夫です。最初の30分は お金はかかりません。電話・LINE・メールのどれでも どうぞ。",
  primaryLabel: "メールで相談する",
  primaryHref: "#contact-form",
  secondaryLabel: "LINE で 相談する",
  secondaryHref: "https://lin.ee/aHMYDKEu",
}

// ─────────────────────────────────────────
// Big numbers used as visual anchors
// ─────────────────────────────────────────
export const headlineNumbers = [
  { v: "5+", l: "年", sub: "Web開発の経験" },
  { v: "4", l: "本", sub: "じぶんで作って動かしているサービス" },
  { v: "30万円〜", l: "", sub: "ホームページ作り直しの目安" },
  { v: "1ヶ月〜", l: "", sub: "ふつうの納期" },
]

export const previewVariants = [
  {
    slug: "dark-grid",
    name: "Dark Grid",
    tagline: "Vercel × Linear × Anthropic",
    summary: "黒背景に細いグリッド線とスポットライト。落ち着いた高級感。",
  },
  {
    slug: "cinematic",
    name: "Cinematic",
    tagline: "Tesla / Apple",
    summary: "大きな写真と動画が主役。文字最小、視覚で伝える。",
  },
  {
    slug: "y2k",
    name: "Y2K Cyber",
    tagline: "Cyberpunk / Y2K",
    summary: "ネオンとグリッチ。インパクト最大、派手好み向け。",
  },
  {
    slug: "3d",
    name: "Generative 3D",
    tagline: "Three.js × Geometry",
    summary: "回転する幾何形状とパーティクル。最も「未来」感が強い。",
  },
] as const
