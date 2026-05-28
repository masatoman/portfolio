/**
 * カスタム住宅シミュレーター demo data
 * - 床材 / 壁紙 / キッチン の カタログ 13 アイテム
 * - 各々 id / 名称 / 単価 (¥/㎡ or 一式) / 仕入先 / カラー (SVG 色見本) / リベート率
 */

export type SupplierId = "lixil" | "nafco" | "local"

export type Supplier = {
  id: SupplierId
  name: string
  shortLabel: string
  /** 仕入れリベート率 (0.05 = 5%) */
  rebate: number
  /** 概念上の発注リードタイム (日) */
  leadDays: number
  badgeColor: string
}

export const suppliers: Record<SupplierId, Supplier> = {
  lixil: {
    id: "lixil",
    name: "LIXIL ショールーム 経由",
    shortLabel: "LIXIL",
    rebate: 0.08,
    leadDays: 7,
    badgeColor: "#1f6feb",
  },
  nafco: {
    id: "nafco",
    name: "ナフコ 経由",
    shortLabel: "ナフコ",
    rebate: 0.05,
    leadDays: 3,
    badgeColor: "#16a34a",
  },
  local: {
    id: "local",
    name: "地元 建材屋 (山田建材) 経由",
    shortLabel: "山田建材",
    rebate: 0.12,
    leadDays: 5,
    badgeColor: "#d97706",
  },
}

export type MaterialCategory = "floor" | "wall" | "kitchen"

export type FloorMaterial = {
  id: string
  category: "floor"
  name: string
  /** 円 / ㎡ */
  unitPrice: number
  /** 色 (平面図塗りに使う) */
  color: string
  /** 木目・タイル感を出す副色 */
  accent?: string
  defaultSupplier: SupplierId
  note: string
}

export type WallMaterial = {
  id: string
  category: "wall"
  name: string
  /** 円 / ㎡ */
  unitPrice: number
  color: string
  defaultSupplier: SupplierId
  note: string
}

export type KitchenMaterial = {
  id: string
  category: "kitchen"
  name: string
  /** 円 / 一式 */
  unitPrice: number
  color: string
  /** 天板色 */
  topColor: string
  defaultSupplier: SupplierId
  note: string
}

export type Material = FloorMaterial | WallMaterial | KitchenMaterial

export const floorMaterials: FloorMaterial[] = [
  {
    id: "floor-oak-natural",
    category: "floor",
    name: "オーク 無垢 ナチュラル",
    unitPrice: 12800,
    color: "#d9b380",
    accent: "#b08054",
    defaultSupplier: "lixil",
    note: "無垢材 ・ 30 年保証 (LIXIL D-Floor)",
  },
  {
    id: "floor-walnut-dark",
    category: "floor",
    name: "ウォルナット ダーク",
    unitPrice: 14500,
    color: "#5e3a22",
    accent: "#3d2614",
    defaultSupplier: "lixil",
    note: "高級感 ・ 落ち着いた リビング 向け",
  },
  {
    id: "floor-pine-white",
    category: "floor",
    name: "パイン ホワイト塗装",
    unitPrice: 7800,
    color: "#f0e6d2",
    accent: "#d6c8aa",
    defaultSupplier: "nafco",
    note: "明るい ・ コスト 重視 ・ 在庫 即納",
  },
  {
    id: "floor-tile-gray",
    category: "floor",
    name: "セラミックタイル グレー",
    unitPrice: 9500,
    color: "#bcbcc0",
    accent: "#9a9a9e",
    defaultSupplier: "lixil",
    note: "水回り 強い ・ 掃除 楽",
  },
  {
    id: "floor-cushion-beige",
    category: "floor",
    name: "クッションフロア ベージュ",
    unitPrice: 3200,
    color: "#e8d8be",
    accent: "#c8b894",
    defaultSupplier: "nafco",
    note: "コスト 最安 ・ 既存リフォーム 向け",
  },
]

export const wallMaterials: WallMaterial[] = [
  {
    id: "wall-white-standard",
    category: "wall",
    name: "標準 白 クロス (量産品)",
    unitPrice: 980,
    color: "#f7f5f0",
    defaultSupplier: "nafco",
    note: "コスト 最安 ・ どんな 部屋でも 合う",
  },
  {
    id: "wall-warm-beige",
    category: "wall",
    name: "ウォームベージュ クロス",
    unitPrice: 1500,
    color: "#ece1cd",
    defaultSupplier: "lixil",
    note: "温かみ ・ リビング ・ 寝室 向け",
  },
  {
    id: "wall-mint-accent",
    category: "wall",
    name: "ミントグリーン アクセント",
    unitPrice: 2200,
    color: "#cfe5d8",
    defaultSupplier: "lixil",
    note: "1 面だけ アクセント ・ 子供部屋 向け",
  },
  {
    id: "wall-shikkui",
    category: "wall",
    name: "本漆喰 (左官 仕上げ)",
    unitPrice: 6800,
    color: "#f0ede4",
    defaultSupplier: "local",
    note: "高級 ・ 調湿 ・ 地元 左官職人 手配",
  },
  {
    id: "wall-navy-deep",
    category: "wall",
    name: "ディープネイビー クロス",
    unitPrice: 2800,
    color: "#2c3e58",
    defaultSupplier: "lixil",
    note: "落ち着き ・ 書斎 ・ 寝室 アクセント",
  },
]

export const kitchenMaterials: KitchenMaterial[] = [
  {
    id: "kitchen-standard-white",
    category: "kitchen",
    name: "標準 I 型 ホワイト (2.55m)",
    unitPrice: 680000,
    color: "#ffffff",
    topColor: "#e8e8ea",
    defaultSupplier: "nafco",
    note: "コスト 重視 ・ 在庫 即納 ・ 工期 短い",
  },
  {
    id: "kitchen-mid-wood",
    category: "kitchen",
    name: "対面型 木目調 (2.7m, ソフトクローズ)",
    unitPrice: 1280000,
    color: "#c89a72",
    topColor: "#3a2f24",
    defaultSupplier: "lixil",
    note: "対面 ・ 食洗機 込み ・ LIXIL リシェル",
  },
  {
    id: "kitchen-premium-stone",
    category: "kitchen",
    name: "アイランド 御影石天板 (3.0m)",
    unitPrice: 2480000,
    color: "#3d3d42",
    topColor: "#8a8a92",
    defaultSupplier: "lixil",
    note: "高級 ・ 御影石 ・ 浄水器 込み",
  },
]

export const allMaterials: Material[] = [
  ...floorMaterials,
  ...wallMaterials,
  ...kitchenMaterials,
]

/**
 * 部屋 (リビング / キッチン / 寝室) ごとの面積 (㎡) と 床 / 壁 の対象㎡
 * 簡易計算: 床は床面積、 壁は床面積 × 2.4 (天井高) × 周囲展開係数
 * (実プロダクトでは図面側で詳細計算するが、 デモは固定値で簡略化)
 */
export type Room = {
  id: "living" | "kitchen" | "bedroom"
  name: string
  /** 床面積 ㎡ */
  floorArea: number
  /** 壁面積 ㎡ */
  wallArea: number
  /** 平面図上の四角形 (x, y, w, h) % 単位 */
  rect: { x: number; y: number; w: number; h: number }
  /** ラベル位置 */
  label: { x: number; y: number }
}

export const rooms: Room[] = [
  {
    id: "living",
    name: "リビング",
    floorArea: 18,
    wallArea: 38,
    rect: { x: 4, y: 4, w: 56, h: 50 },
    label: { x: 32, y: 29 },
  },
  {
    id: "kitchen",
    name: "キッチン",
    floorArea: 8,
    wallArea: 22,
    rect: { x: 60, y: 4, w: 36, h: 30 },
    label: { x: 78, y: 19 },
  },
  {
    id: "bedroom",
    name: "寝室",
    floorArea: 14,
    wallArea: 32,
    rect: { x: 60, y: 34, w: 36, h: 60 },
    label: { x: 78, y: 64 },
  },
]

/** 合計 床面積 / 壁面積 (リビング + 寝室 = 床 / キッチンは別計上、 壁は 3 室合計) */
export const totals = {
  /** リビング + 寝室 床面積 */
  floorArea: rooms
    .filter((r) => r.id !== "kitchen")
    .reduce((sum, r) => sum + r.floorArea, 0),
  /** 全室 壁面積 */
  wallArea: rooms.reduce((sum, r) => sum + r.wallArea, 0),
}
