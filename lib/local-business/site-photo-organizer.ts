export type SitePhotoStage = "配筋" | "断熱" | "防水" | "仕上げ"

export type SitePhotoSite = "山田邸" | "田中邸" | "鈴木邸"

export type SitePhoto = {
  id: string
  site: SitePhotoSite
  stage: SitePhotoStage
  takenAt: string
  memo: string
  swatch: string
}

export const sitePhotoStages: SitePhotoStage[] = ["配筋", "断熱", "防水", "仕上げ"]
export const sitePhotoSites: SitePhotoSite[] = ["山田邸", "田中邸", "鈴木邸"]

const stageSwatch: Record<SitePhotoStage, string> = {
  配筋: "#1f3b66",
  断熱: "#d97706",
  防水: "#0e7490",
  仕上げ: "#7c3aed",
}

function makePhoto(
  index: number,
  site: SitePhotoSite,
  stage: SitePhotoStage,
  date: string,
  memo: string,
): SitePhoto {
  return {
    id: `photo-${site}-${stage}-${index}`,
    site,
    stage,
    takenAt: date,
    memo,
    swatch: stageSwatch[stage],
  }
}

export const sampleSitePhotos: SitePhoto[] = [
  makePhoto(1, "山田邸", "配筋", "2026-04-21T09:30", "ベタ基礎 配筋検査前の状態。鉄筋ピッチ 200mm 確認済み。"),
  makePhoto(2, "山田邸", "配筋", "2026-04-21T11:10", "コーナー部 補強筋。アンカーボルトの位置確認。"),
  makePhoto(3, "山田邸", "配筋", "2026-04-22T08:45", "配筋検査 合格後。型枠組み開始前。"),
  makePhoto(4, "山田邸", "断熱", "2026-04-30T14:20", "床下断熱材 充填。隙間なし。"),
  makePhoto(5, "山田邸", "断熱", "2026-05-01T10:00", "壁の断熱 グラスウール 100mm 充填中。"),
  makePhoto(6, "山田邸", "防水", "2026-05-05T15:40", "ルーフィング 1次防水 完了。"),
  makePhoto(7, "山田邸", "防水", "2026-05-06T09:15", "サッシ周り 防水テープ 施工後。"),
  makePhoto(8, "山田邸", "仕上げ", "2026-05-08T16:00", "外壁 サイディング張り 進捗 30%。"),
  makePhoto(9, "田中邸", "配筋", "2026-03-12T10:00", "布基礎 配筋。地中梁の補強筋確認。"),
  makePhoto(10, "田中邸", "断熱", "2026-03-25T13:30", "天井断熱 セルロースファイバー 吹込み後。"),
  makePhoto(11, "田中邸", "断熱", "2026-03-26T11:00", "床断熱 既存撤去後 新規 100mm。"),
  makePhoto(12, "田中邸", "防水", "2026-04-02T09:45", "浴室まわり FRP防水 1層目 完了。"),
  makePhoto(13, "田中邸", "防水", "2026-04-03T15:20", "ベランダ 防水トップコート 仕上げ。"),
  makePhoto(14, "田中邸", "仕上げ", "2026-04-15T10:30", "リビング クロス 張替え 完了。"),
  makePhoto(15, "田中邸", "仕上げ", "2026-04-16T14:10", "キッチン 床フローリング 張替え 完了。"),
  makePhoto(16, "田中邸", "仕上げ", "2026-04-17T11:40", "玄関タイル 貼り直し 後の目地清掃。"),
  makePhoto(17, "鈴木邸", "配筋", "2026-02-08T08:50", "増築部 独立基礎 配筋。"),
  makePhoto(18, "鈴木邸", "断熱", "2026-02-20T13:00", "屋根 断熱材 ネオマフォーム 50mm 施工後。"),
  makePhoto(19, "鈴木邸", "断熱", "2026-02-21T10:20", "外壁 通気層 確保のための胴縁。"),
  makePhoto(20, "鈴木邸", "防水", "2026-03-01T15:50", "下屋 ルーフィング 立ち上がり 確保。"),
  makePhoto(21, "鈴木邸", "防水", "2026-03-02T09:10", "サイディング下地 透湿防水シート 完了。"),
  makePhoto(22, "鈴木邸", "仕上げ", "2026-03-15T11:30", "外壁サイディング 半分完了。コーナー材 在庫不足。"),
  makePhoto(23, "鈴木邸", "仕上げ", "2026-03-22T14:40", "雨樋 取付。色 施主確認後の取り直し。"),
  makePhoto(24, "鈴木邸", "仕上げ", "2026-03-25T16:15", "玄関ポーチタイル 仕上げ 完了。"),
]

export type PhotoFilter = {
  site: SitePhotoSite | "すべて"
  stage: SitePhotoStage | "すべて"
}

export function filterSitePhotos(photos: SitePhoto[], filter: PhotoFilter): SitePhoto[] {
  return photos.filter((p) => {
    if (filter.site !== "すべて" && p.site !== filter.site) return false
    if (filter.stage !== "すべて" && p.stage !== filter.stage) return false
    return true
  })
}

export function countByStage(photos: SitePhoto[]): Record<SitePhotoStage, number> {
  const result: Record<SitePhotoStage, number> = { 配筋: 0, 断熱: 0, 防水: 0, 仕上げ: 0 }
  for (const p of photos) {
    result[p.stage]++
  }
  return result
}
