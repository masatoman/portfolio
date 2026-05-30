"use client"

// ChatGPT 等の gap 推薦切り口 (queries.json 未登録 role) を 1 件ずつ手入力するための
// フィールド群。 CollectionQueueForm から使われる。
// 一括貼り付け版は bulk-adhoc-paste.tsx を参照。

import { LAB_NEON } from "@/lib/lab-tools/registry"

export const ADHOC_PROFILE_OPTIONS = [
  { id: "komuten", label: "🏗️ 工務店" },
  { id: "financial-planner", label: "💼 ファイナンシャルプランナー" },
  { id: "it-subsidy", label: "💴 IT 補助金" },
  { id: "micro-corp", label: "🏢 マイクロ法人 / 個人事業主" },
] as const

type Props = {
  profileId: string
  setProfileId: (v: string) => void
  role: string
  setRole: (v: string) => void
  keywords: string
  setKeywords: (v: string) => void
  watchedTools: string
  setWatchedTools: (v: string) => void
  examplePhrases: string
  setExamplePhrases: (v: string) => void
  samplingTarget: number
  setSamplingTarget: (v: number) => void
  disabled: boolean
}

export function AdhocFields({
  profileId,
  setProfileId,
  role,
  setRole,
  keywords,
  setKeywords,
  watchedTools,
  setWatchedTools,
  examplePhrases,
  setExamplePhrases,
  samplingTarget,
  setSamplingTarget,
  disabled,
}: Props) {
  return (
    <div
      className="space-y-3 border p-3"
      style={{ borderColor: `${LAB_NEON.magenta}30` }}
    >
      <div className="grid gap-3 md:grid-cols-3">
        <div>
          <label
            className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.magenta }}
          >
            // profile (固定 4 種)
          </label>
          <select
            value={profileId}
            onChange={(e) => setProfileId(e.target.value)}
            className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
            style={{ borderColor: `${LAB_NEON.magenta}40` }}
            disabled={disabled}
          >
            {ADHOC_PROFILE_OPTIONS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label
            className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.magenta }}
          >
            // 自由記入 role (ChatGPT 推薦をそのまま貼る)
          </label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="例: アトツギ向け FAX 営業 / 経理担当の妻 / 元現場監督の退職代行依頼者"
            className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
            style={{ borderColor: `${LAB_NEON.magenta}40` }}
            disabled={disabled}
            required
          />
        </div>
      </div>

      <div>
        <label
          className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: LAB_NEON.magenta }}
        >
          // 入り口キーワード (カンマ or 改行区切り、 8-12 個推奨)
        </label>
        <textarea
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          rows={3}
          placeholder="例: アトツギ 父親 IT 反対, 工務店 2 代目 ANDPAD 入れたい, 跡継ぎ 妻 経理 freee, 退職代行 工務店"
          className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
          style={{ borderColor: `${LAB_NEON.magenta}40` }}
          disabled={disabled}
          required
        />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest text-white/55">
            // 監視ツール (オプション、 カンマ区切り)
          </label>
          <input
            type="text"
            value={watchedTools}
            onChange={(e) => setWatchedTools(e.target.value)}
            placeholder="例: ANDPAD, freee, kintone"
            className="w-full border bg-black/60 p-2 font-mono text-xs text-white outline-none"
            style={{ borderColor: "#444" }}
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest text-white/55">
            // 検出したい口語フレーズ (オプション、 カンマ区切り)
          </label>
          <input
            type="text"
            value={examplePhrases}
            onChange={(e) => setExamplePhrases(e.target.value)}
            placeholder="例: もう父親と話したくない, 妻が経理やってる, 跡継ぎ嫌だ"
            className="w-full border bg-black/60 p-2 font-mono text-xs text-white outline-none"
            style={{ borderColor: "#444" }}
            disabled={disabled}
          />
        </div>
      </div>

      <div>
        <label
          className="block mb-1.5 font-mono text-[10px] uppercase tracking-widest"
          style={{ color: LAB_NEON.cyan }}
        >
          // 目標件数
        </label>
        <input
          type="number"
          min={20}
          max={500}
          step={10}
          value={samplingTarget}
          onChange={(e) => {
            const n = Number.parseInt(e.target.value, 10)
            if (Number.isFinite(n)) setSamplingTarget(n)
          }}
          className="w-full border bg-black/60 p-2 font-mono text-sm text-white outline-none"
          style={{ borderColor: `${LAB_NEON.cyan}40` }}
          disabled={disabled}
        />
      </div>
    </div>
  )
}
