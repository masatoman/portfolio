export type CallMemoStatus = "未対応" | "対応中" | "完了"

export type CallMemoEntry = {
  id: string
  client: string
  dateTime: string
  person: string
  summary: string
  status: CallMemoStatus
  nextAction: string
}

export const callMemoStorageKey = "ihara-local-business-call-memo-board"

export const sampleCallMemos: CallMemoEntry[] = [
  {
    id: "memo-001",
    client: "株式会社 OO建設",
    dateTime: "2026-05-09T09:30",
    person: "山田様",
    summary: "現場写真の共有方法を確認。追加見積の相談あり。",
    status: "対応中",
    nextAction: "午後までに追加見積の叩き台を送付",
  },
  {
    id: "memo-002",
    client: "有限会社 田中工務店",
    dateTime: "2026-05-08T16:00",
    person: "田中様",
    summary: "ホームページの施工事例更新を依頼。写真3点受領。",
    status: "未対応",
    nextAction: "受領写真を確認して更新案を作成",
  },
]

export function createCallMemoEntry(input: Omit<CallMemoEntry, "id">): CallMemoEntry {
  return {
    id: `memo-${Math.random().toString(36).slice(2, 10)}`,
    ...input,
  }
}

export function serializeCallMemos(entries: CallMemoEntry[]): string {
  return JSON.stringify(entries)
}

export function deserializeCallMemos(value: string | null | undefined): CallMemoEntry[] {
  if (!value) return sampleCallMemos

  try {
    const parsed = JSON.parse(value)
    if (!Array.isArray(parsed)) return sampleCallMemos
    return parsed.filter(isCallMemoEntry)
  } catch {
    return sampleCallMemos
  }
}

export function updateCallMemoStatus(entries: CallMemoEntry[], id: string, status: CallMemoStatus): CallMemoEntry[] {
  return entries.map((entry) => (entry.id === id ? { ...entry, status } : entry))
}

function isCallMemoEntry(value: unknown): value is CallMemoEntry {
  if (typeof value !== "object" || value === null) return false
  const entry = value as Record<string, unknown>

  return (
    typeof entry.id === "string" &&
    typeof entry.client === "string" &&
    typeof entry.dateTime === "string" &&
    typeof entry.person === "string" &&
    typeof entry.summary === "string" &&
    typeof entry.status === "string" &&
    typeof entry.nextAction === "string"
  )
}
