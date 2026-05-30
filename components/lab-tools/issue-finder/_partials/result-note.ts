// 結果セクションのサマリ文字列を組み立てる純粋関数。
// 「Supabase ${visible}/${total} 件表示 (XX 件除外)」 みたいなテキストを返す。

export function buildResultsNote({
  totalCount,
  visibleCount,
  hideSubsidy,
  subsidyCount,
  onlyValueZone,
  valueZoneCount,
  hideDogPath,
  dogPathCount,
  hideNeedsRework,
  needsReworkCount,
  hideUnscored,
  unscoredCount,
}: {
  totalCount: number
  visibleCount: number
  hideSubsidy: boolean
  subsidyCount: number
  onlyValueZone: boolean
  valueZoneCount: number
  hideDogPath: boolean
  dogPathCount: number
  hideNeedsRework: boolean
  needsReworkCount: number
  hideUnscored: boolean
  unscoredCount: number
}): string {
  const reasons: string[] = []
  if (onlyValueZone) reasons.push(`バリュー帯 ${valueZoneCount} 件のみ`)
  if (hideDogPath) reasons.push(`犬の道 ${dogPathCount} 件除外`)
  if (hideNeedsRework) reasons.push(`needs-rework ${needsReworkCount} 件除外`)
  if (hideUnscored) reasons.push(`未採点 ${unscoredCount} 件除外`)
  if (hideSubsidy) reasons.push(`補助金系 ${subsidyCount} 件除外`)
  if (reasons.length === 0) {
    return `Supabase から ${totalCount} 件読込`
  }
  return `Supabase ${visibleCount}/${totalCount} 件表示 (${reasons.join(" / ")})`
}
