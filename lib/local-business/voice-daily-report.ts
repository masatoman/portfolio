export type VoiceDailyReportDraft = {
  id: string
  recordedAt: string
  durationSec: number
  rawTranscript: string
  formatted: {
    siteName: string
    progress: string
    issues: string
    tomorrow: string
  }
}

export const voiceDailyReportStorageKey = "ihara-local-business-voice-daily-report"

export const sampleVoiceDailyReports: VoiceDailyReportDraft[] = [
  {
    id: "voice-001",
    recordedAt: "2026-05-09T18:42",
    durationSec: 47,
    rawTranscript:
      "今日は山田邸の基礎の打設までいけた。打設後の天気が心配だけど、シート養生はかけてある。明日の朝、念のため見にいく。型枠ばらしは月曜の午後。",
    formatted: {
      siteName: "山田邸 新築工事",
      progress: "基礎コンクリート 打設まで完了。シート養生済み。",
      issues: "打設後 24時間 の天気が不安定。明朝 念のため 状態確認。",
      tomorrow: "朝一で 山田邸 養生確認 → 田中邸 へ移動 → 月曜の型枠ばらし 段取り 確認。",
    },
  },
  {
    id: "voice-002",
    recordedAt: "2026-05-08T17:55",
    durationSec: 38,
    rawTranscript:
      "佐藤工務店の大工さん、明日の朝の入りが30分遅れるって連絡あった。あと、階段の踏面の寸法、もう一度確認したい。施主の奥さんから電気の位置の相談。",
    formatted: {
      siteName: "田中邸 リフォーム工事",
      progress: "内装 大工工事 進行中。",
      issues:
        "大工 入り 30分遅れ。階段 踏面寸法 再確認 必要。施主から 電気スイッチ位置の相談あり。",
      tomorrow: "朝一で 階段寸法 図面再チェック → 施主と 電気位置 打合せ (15時) → 進捗 写真送付。",
    },
  },
  {
    id: "voice-003",
    recordedAt: "2026-05-07T19:10",
    durationSec: 55,
    rawTranscript:
      "鈴木邸、外壁のサイディング 半分まで張り終わった。シーリングは来週月曜から。建材の追加発注、コーナー材が足りない。あと、雨樋の色、施主に確認するの忘れてた。",
    formatted: {
      siteName: "鈴木邸 外装リフォーム",
      progress: "外壁 サイディング 50%完了。",
      issues: "コーナー材 在庫不足 → 月曜入荷分で追加発注。雨樋の色 施主確認 漏れ。",
      tomorrow: "朝 コーナー材 発注確定 → 施主に 雨樋色 写真送付して確認 → 残り半分 サイディング 着手。",
    },
  },
]

export function createVoiceDailyReportDraft(
  input: Omit<VoiceDailyReportDraft, "id">,
): VoiceDailyReportDraft {
  return {
    id: `voice-${Math.random().toString(36).slice(2, 10)}`,
    ...input,
  }
}

export function serializeVoiceDailyReports(entries: VoiceDailyReportDraft[]): string {
  return JSON.stringify(entries)
}

export function deserializeVoiceDailyReports(
  value: string | null | undefined,
): VoiceDailyReportDraft[] {
  if (!value) return sampleVoiceDailyReports

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return sampleVoiceDailyReports
    return parsed.filter(isVoiceDailyReportDraft)
  } catch {
    return sampleVoiceDailyReports
  }
}

function isVoiceDailyReportDraft(value: unknown): value is VoiceDailyReportDraft {
  if (typeof value !== "object" || value === null) return false
  const entry = value as Record<string, unknown>
  if (
    typeof entry.id !== "string" ||
    typeof entry.recordedAt !== "string" ||
    typeof entry.durationSec !== "number" ||
    typeof entry.rawTranscript !== "string"
  ) {
    return false
  }
  const formatted = entry.formatted as Record<string, unknown> | undefined
  if (!formatted || typeof formatted !== "object") return false
  return (
    typeof formatted.siteName === "string" &&
    typeof formatted.progress === "string" &&
    typeof formatted.issues === "string" &&
    typeof formatted.tomorrow === "string"
  )
}
