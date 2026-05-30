"use client"

// Deep Search プロンプト生成時の多様性オプション UI (本書「常識を覆す洞察」 を取りに行く仕掛け).
// deep-search-helper.tsx から切り出し。 state は親側で管理、 ここは presentational に専念。

import {
  pickRandomSeed,
  type AiVariant,
  type ContrastAxis,
  type ForcedMedium,
  type SatelliteVoice,
} from "@/lib/lab-tools/issue-finder/deep-search-prompt"
import { LAB_NEON } from "@/lib/lab-tools/registry"
import { ToggleChip } from "@/components/lab-tools/issue-finder/_partials/toggle-chip"

const FORCED_MEDIA: readonly ForcedMedium[] = [
  "youtube",
  "tiktok",
  "podcast",
  "g2-capterra",
  "openwork",
  "5ch",
  "退職代行",
  "google-map-review",
]

type Props = {
  aiVariant: AiVariant
  setAiVariant: (v: AiVariant) => void
  devilsAdvocate: boolean
  setDevilsAdvocate: (v: boolean) => void
  satelliteVoice: SatelliteVoice
  setSatelliteVoice: (v: SatelliteVoice) => void
  contrastAxis: ContrastAxis
  setContrastAxis: (v: ContrastAxis) => void
  timeShift: boolean
  setTimeShift: (v: boolean) => void
  forcedMedia: ForcedMedium[]
  setForcedMedia: (v: ForcedMedium[]) => void
  randomSeed: string | null
  setRandomSeed: (v: string | null) => void
}

export function DiversityOptions({
  aiVariant,
  setAiVariant,
  devilsAdvocate,
  setDevilsAdvocate,
  satelliteVoice,
  setSatelliteVoice,
  contrastAxis,
  setContrastAxis,
  timeShift,
  setTimeShift,
  forcedMedia,
  setForcedMedia,
  randomSeed,
  setRandomSeed,
}: Props) {
  const anyActive =
    aiVariant !== "neutral" ||
    devilsAdvocate ||
    satelliteVoice !== null ||
    contrastAxis !== null ||
    timeShift ||
    forcedMedia.length > 0 ||
    randomSeed !== null

  return (
    <details className="mb-4 border border-white/10 bg-black/30 p-3">
      <summary
        className="cursor-pointer font-mono text-[10px] uppercase tracking-widest hover:text-white"
        style={{ color: LAB_NEON.magenta }}
      >
        // 多様性オプション (AI 別差分 / Devil's Advocate / 周辺当事者 / 対立軸 / 時系列 / 媒体強制 / random seed)
        {anyActive && (
          <span className="ml-2" style={{ color: LAB_NEON.green }}>
            ● 有効
          </span>
        )}
      </summary>

      <div className="mt-3 space-y-3">
        <div>
          <label
            className="block mb-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.cyan }}
          >
            // AI 別差分 (どの AI に投げるか — 結果の癖を逆手に取る)
          </label>
          <select
            value={aiVariant}
            onChange={(e) => setAiVariant(e.target.value as AiVariant)}
            className="w-full border bg-black/60 p-1.5 font-mono text-xs text-white outline-none"
            style={{ borderColor: `${LAB_NEON.cyan}40` }}
          >
            <option value="neutral">neutral (AI 指定なし / どれにでも)</option>
            <option value="chatgpt">ChatGPT 向け (退職代行担当者 role)</option>
            <option value="claude">Claude 向け (家族 / 妻 視点)</option>
            <option value="perplexity">Perplexity 向け (最新ニュース)</option>
            <option value="gemini">Gemini 向け (YouTube / TikTok)</option>
          </select>
        </div>

        <div>
          <label
            className="block mb-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.cyan }}
          >
            // 周辺当事者視点 (本人より周辺が本音を漏らす)
          </label>
          <select
            value={satelliteVoice ?? ""}
            onChange={(e) =>
              setSatelliteVoice((e.target.value || null) as SatelliteVoice)
            }
            className="w-full border bg-black/60 p-1.5 font-mono text-xs text-white outline-none"
            style={{ borderColor: `${LAB_NEON.cyan}40` }}
          >
            <option value="">(指定なし)</option>
            <option value="wife">妻 / 彼女 / アトツギの母親</option>
            <option value="accountant">経理 (社長妻が多い)</option>
            <option value="subcontractor">下請 / 一人親方</option>
            <option value="client">顧客 / 施主</option>
            <option value="ob">退職者 / OB</option>
            <option value="succession">アトツギ (2 代目 3 代目)</option>
          </select>
        </div>

        <div>
          <label
            className="block mb-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.cyan }}
          >
            // 対立軸 (2 つの立場の差分を炙り出す)
          </label>
          <select
            value={contrastAxis ?? ""}
            onChange={(e) =>
              setContrastAxis((e.target.value || null) as ContrastAxis)
            }
            className="w-full border bg-black/60 p-1.5 font-mono text-xs text-white outline-none"
            style={{ borderColor: `${LAB_NEON.cyan}40` }}
          >
            <option value="">(指定なし)</option>
            <option value="mgmt-vs-field">経営者 vs 現場</option>
            <option value="master-vs-atotsugi">親方 vs アトツギ</option>
            <option value="rich-vs-poor">儲かってる vs 苦しい工務店</option>
            <option value="tool-adopter-vs-rejecter">
              ANDPAD 入れた vs 入れてない
            </option>
            <option value="small-vs-mid">個人事業主 vs 中堅 (10-30 人)</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2">
          <ToggleChip
            label="😈 Devil's Advocate (通説 3 つ覆す)"
            active={devilsAdvocate}
            onToggle={() => setDevilsAdvocate(!devilsAdvocate)}
          />
          <ToggleChip
            label="⏰ 時系列変化 (2019-21 vs 2025-26)"
            active={timeShift}
            onToggle={() => setTimeShift(!timeShift)}
          />
        </div>

        <div>
          <label
            className="block mb-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.cyan }}
          >
            // 媒体強制 (最低 1 件ずつ拾う制約)
          </label>
          <div className="flex flex-wrap gap-1.5">
            {FORCED_MEDIA.map((m) => (
              <ToggleChip
                key={m}
                label={m}
                active={forcedMedia.includes(m)}
                onToggle={() => {
                  setForcedMedia(
                    forcedMedia.includes(m)
                      ? forcedMedia.filter((x) => x !== m)
                      : [...forcedMedia, m],
                  )
                }}
              />
            ))}
          </div>
        </div>

        <div>
          <label
            className="block mb-1 font-mono text-[10px] uppercase tracking-widest"
            style={{ color: LAB_NEON.cyan }}
          >
            // ランダム seed (今回の切り口を 1 句で固定 — 同じ AI でも違う結果)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={randomSeed ?? ""}
              onChange={(e) => setRandomSeed(e.target.value || null)}
              placeholder="例: 金銭面のみ / メンタル面のみ / DX 逆効果のみ"
              className="flex-1 border bg-black/60 p-1.5 font-mono text-xs text-white outline-none"
              style={{ borderColor: `${LAB_NEON.cyan}40` }}
            />
            <button
              type="button"
              onClick={() => setRandomSeed(pickRandomSeed())}
              className="border px-3 py-1 font-mono text-[10px] uppercase tracking-widest hover:text-white"
              style={{
                color: LAB_NEON.amber,
                borderColor: `${LAB_NEON.amber}60`,
              }}
              title="プリセットからランダムに 1 つ選ぶ"
            >
              🎲 random
            </button>
            {randomSeed && (
              <button
                type="button"
                onClick={() => setRandomSeed(null)}
                className="border px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-white/50 hover:text-white"
                style={{ borderColor: "#555" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
    </details>
  )
}
