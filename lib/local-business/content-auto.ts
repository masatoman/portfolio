/**
 * Demo data for /local-business/content-auto.
 *
 * Hard-coded sample photos (reusing existing kazenokisha images) and
 * past-generated content list. No real AI API call — templates are filled
 * with user input on the client.
 */

import { builderImages } from "./builder-showcase"

export type ContentAutoPhoto = {
  id: string
  src: string
  label: string
  defaultMemo: string
}

/** 5 sample photos (固定画像) shown in the input form. */
export const contentAutoPhotos: ContentAutoPhoto[] = [
  {
    id: "photo-001",
    src: builderImages.exteriorDay,
    label: "外観 (日中)",
    defaultMemo: "○○邸の外壁塗装完成",
  },
  {
    id: "photo-002",
    src: builderImages.exteriorEvening,
    label: "外観 (夕景)",
    defaultMemo: "△△邸の屋根葺替完成",
  },
  {
    id: "photo-003",
    src: builderImages.livingDining,
    label: "リビング ダイニング",
    defaultMemo: "□□邸の内装リフォーム完成",
  },
  {
    id: "photo-004",
    src: builderImages.kitchen,
    label: "キッチン",
    defaultMemo: "◇◇邸のキッチン入替完成",
  },
  {
    id: "photo-005",
    src: builderImages.craftsmanship,
    label: "造作 ディテール",
    defaultMemo: "造作家具の納品完了",
  },
]

export type ContentAutoPastItem = {
  id: string
  date: string
  memo: string
  type: "施工事例記事" | "Instagram投稿" | "お客様の声"
  preview: string
  status: "公開済" | "下書き" | "承認待ち"
}

/** 過去生成済み一覧 (12件) */
export const contentAutoPastItems: ContentAutoPastItem[] = [
  {
    id: "past-001",
    date: "2026-05-22",
    memo: "山田邸の屋根葺替完成",
    type: "施工事例記事",
    preview: "20年使った瓦屋根を、 軽量で耐震性の高いガルバリウム鋼板に葺き替えました。 工期 5日間、 ご家族にも安心して暮らしていただける仕上がりに...",
    status: "公開済",
  },
  {
    id: "past-002",
    date: "2026-05-21",
    memo: "山田邸の屋根葺替完成",
    type: "Instagram投稿",
    preview: "屋根葺替工事、 無事完了しました🏠 軽くて丈夫なガルバリウム鋼板で、 これからも安心。 #屋根葺替 #リフォーム #工務店",
    status: "公開済",
  },
  {
    id: "past-003",
    date: "2026-05-20",
    memo: "鈴木邸の外壁塗装完成",
    type: "お客様の声",
    preview: "「築15年で外壁の色あせが気になっていました。 ご提案いただいた配色がイメージ通りで、 家族みんな大満足です。」 — 鈴木様 (60代)",
    status: "公開済",
  },
  {
    id: "past-004",
    date: "2026-05-18",
    memo: "佐藤邸のキッチン入替",
    type: "施工事例記事",
    preview: "対面式キッチンへの入替工事。 配管位置の調整に時間をかけ、 ご家族の動線に合わせた配置を実現。 仕上げまで含めて 8日間で完了...",
    status: "承認待ち",
  },
  {
    id: "past-005",
    date: "2026-05-17",
    memo: "佐藤邸のキッチン入替",
    type: "Instagram投稿",
    preview: "新しい対面キッチン、 完成です✨ 料理しながらリビングの様子が見えるって、 本当に便利。 #キッチンリフォーム #対面キッチン",
    status: "下書き",
  },
  {
    id: "past-006",
    date: "2026-05-15",
    memo: "田中邸の浴室リフォーム",
    type: "施工事例記事",
    preview: "在来工法のタイル浴室から、 最新ユニットバスへの入替。 断熱性能が大幅にアップし、 冬場のヒートショック対策にも...",
    status: "公開済",
  },
  {
    id: "past-007",
    date: "2026-05-14",
    memo: "田中邸の浴室リフォーム",
    type: "お客様の声",
    preview: "「冬のお風呂が本当に寒くて困っていました。 今は脱衣所もあたたかくて、 高齢の母も安心して入浴できます。」 — 田中様 (50代)",
    status: "公開済",
  },
  {
    id: "past-008",
    date: "2026-05-12",
    memo: "中庭のある平屋 新築完成",
    type: "施工事例記事",
    preview: "敷地 60坪、 延床 28坪の平屋。 中庭を中心に LDK と寝室をぐるりと配置し、 どの部屋からも緑が見える設計に...",
    status: "公開済",
  },
  {
    id: "past-009",
    date: "2026-05-11",
    memo: "中庭のある平屋 新築完成",
    type: "Instagram投稿",
    preview: "中庭を囲む平屋、 引渡し完了しました🌳 風が通り、 光が回り、 季節を感じる家。 ご家族の新しい暮らしが楽しみです。 #平屋 #中庭",
    status: "公開済",
  },
  {
    id: "past-010",
    date: "2026-05-09",
    memo: "高橋邸の床リフォーム",
    type: "施工事例記事",
    preview: "リビング 20帖の床を、 オーク無垢材に張替。 既存の家具を仮置きしながらの作業で、 ご家族の生活を止めない段取りを工夫しました...",
    status: "承認待ち",
  },
  {
    id: "past-011",
    date: "2026-05-07",
    memo: "伊藤邸の外構工事完成",
    type: "Instagram投稿",
    preview: "外構工事 完成です。 アプローチに使った石材は、 ご主人と一緒に選びました。 これから雨に濡れて、 さらに表情が出てくるはず☔ #外構",
    status: "公開済",
  },
  {
    id: "past-012",
    date: "2026-05-05",
    memo: "伊藤邸の外構工事完成",
    type: "お客様の声",
    preview: "「打合せの段階から、 何度も現地で確認していただきました。 完成した今、 朝の家の前を見るのが楽しみです。」 — 伊藤様 (40代)",
    status: "公開済",
  },
]

/** ハッシュタグの候補 (Instagram用) */
export const contentAutoTags = [
  "#工務店",
  "#リフォーム",
  "#施工事例",
  "#家づくり",
  "#マイホーム",
  "#住まいの相談",
] as const
