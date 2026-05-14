export type BuilderVariantSlug = "watanabetomi" | "iba" | "kojima" | "obama" | "gamou"

export type BuilderVariant = {
  slug: BuilderVariantSlug
  name: string
  reference: string
  title: string
  oneLiner: string
  characteristic: string
  theme: string
  heroLabel: string
  heroCopy: string
  ctaPrimary: string
  ctaSecondary: string
}

export const builderBrand = {
  company: "風ノ木舎建築工房",
  roman: "KAZENOKISHA ARCHITECTS",
  baseTitle: "風景になじむ家を、丁寧につくる。",
  description:
    "埼玉・千葉エリアを中心に、木の質感と暮らしやすさを大切にした住まいづくりを行う、架空の工務店サイトです。",
  serviceLine: "設計・施工 / リノベーション / 造作家具",
  regionLine: "埼玉県川口市を拠点に、埼玉・千葉・東京西部を中心に対応",
  hoursLine: "9:00 - 18:00 / 日曜・祝日休",
  phone: "048-000-1234",
} as const

export const builderImages = {
  exteriorDay: "/images/local-business/kazenokisha/exterior-day.png",
  exteriorEvening: "/images/local-business/kazenokisha/exterior-evening.png",
  livingDining: "/images/local-business/kazenokisha/living-dining.png",
  kitchen: "/images/local-business/kazenokisha/kitchen.png",
  stairDetail: "/images/local-business/kazenokisha/stair-detail.png",
  craftsmanship: "/images/local-business/kazenokisha/craftsmanship.png",
} as const

export const builderWorks = [
  {
    title: "中庭とつながる平屋",
    place: "埼玉県越谷市",
    text: "軒下の影と木の天井がゆるやかにつながる、庭中心の住まい。",
    image: builderImages.livingDining,
  },
  {
    title: "光庭を囲む住まい",
    place: "千葉県流山市",
    text: "家族の気配がやわらかく伝わる、明るい中庭のある計画。",
    image: builderImages.kitchen,
  },
  {
    title: "土間のある木の家",
    place: "東京都青梅市",
    text: "庭仕事や趣味道具が自然と暮らしに溶け込む、土間中心の住まい。",
    image: builderImages.stairDetail,
  },
  {
    title: "夕景に映える住まい",
    place: "埼玉県川口市",
    text: "照明の温度感と外構を含めて、帰宅時の印象まで設計した住まい。",
    image: builderImages.exteriorEvening,
  },
] as const

export const builderStrengths = [
  {
    title: "設計から施工まで一貫して向き合う",
    text: "敷地条件や暮らし方を丁寧に伺いながら、設計と施工の距離が近い体制で進める想定です。",
  },
  {
    title: "木の質感と光のやわらかさを大切にする",
    text: "大きな装飾より、手ざわりや日々の居心地が伝わる写真とコピーを中心にしています。",
  },
  {
    title: "相談しやすい接点を最後まで保つ",
    text: "施工実績を見たあとに迷わず相談できるよう、電話と問い合わせの導線を整理しています。",
  },
] as const

export const builderTags = ["平屋", "土間", "造作洗面", "勾配天井", "木の家", "中庭", "回遊動線", "収納計画"] as const

export const builderVariants: BuilderVariant[] = [
  {
    slug: "watanabetomi",
    name: "渡辺富工務店系",
    reference: "渡辺富工務店",
    title: "作品と理念で、会社の格を静かに伝える案",
    oneLiner: "重厚・信頼感・作品集寄り",
    characteristic: "作品、考え方、会社の佇まいを先に見せて、問い合わせより前に信頼を積む構成。",
    theme: "dark-editorial",
    heroLabel: "PHILOSOPHY AND WORKS",
    heroCopy: "作品と理念を静かに積み上げ、まず信頼してもらう構成。",
    ctaPrimary: "施工実績を見る",
    ctaSecondary: "家づくりを相談する",
  },
  {
    slug: "iba",
    name: "伊庭工務店系",
    reference: "伊庭工務店",
    title: "施工事例の見やすさで回遊させる案",
    oneLiner: "事例一覧・回遊性重視",
    characteristic: "最初から施工実績へ入りやすくして、一覧性と探しやすさで比較検討を進める構成。",
    theme: "works-grid",
    heroLabel: "PROJECT INDEX",
    heroCopy: "施工事例を入り口にして、自分に近い家を探しやすくする構成。",
    ctaPrimary: "事例一覧を見る",
    ctaSecondary: "資料を請求する",
  },
  {
    slug: "kojima",
    name: "小嶋工務店系",
    reference: "小嶋工務店",
    title: "言葉と思想で世界観をつくる案",
    oneLiner: "コピー・思想重視",
    characteristic: "木や地域性などの考え方を先に打ち出し、写真とコピーでブランドの芯を作る構成。",
    theme: "manifesto",
    heroLabel: "OUR BELIEF",
    heroCopy: "言葉の強さと思想の一貫性で、会社の世界観を記憶に残す構成。",
    ctaPrimary: "考え方を読む",
    ctaSecondary: "施工実績を見る",
  },
  {
    slug: "obama",
    name: "おばま工務店系",
    reference: "おばま工務店",
    title: "暮らしのイメージから選びやすい案",
    oneLiner: "生活者目線・タグ導線重視",
    characteristic: "平屋や土間などの切り口から事例へ入れるようにして、暮らし方ベースで選びやすくする構成。",
    theme: "lifestyle-tags",
    heroLabel: "FIND YOUR STYLE",
    heroCopy: "暮らしのイメージやタグから、自分に合う家を探せる構成。",
    ctaPrimary: "好きな実例を探す",
    ctaSecondary: "相談してみる",
  },
  {
    slug: "gamou",
    name: "蒲生工務店系",
    reference: "蒲生工務店",
    title: "事業整理と相談導線を両立する案",
    oneLiner: "事業整理・情報導線重視",
    characteristic: "注文住宅、リフォーム、店舗などの入口を整理しつつ、写真と相談導線のバランスを取る構成。",
    theme: "service-categories",
    heroLabel: "SERVICES AND WORKS",
    heroCopy: "事業の入口を整理しながら、相談しやすさまでまとめる構成。",
    ctaPrimary: "対応内容を見る",
    ctaSecondary: "無料で相談する",
  },
] as const

export const builderVariantMap = Object.fromEntries(
  builderVariants.map((variant) => [variant.slug, variant]),
) as Record<BuilderVariantSlug, BuilderVariant>
