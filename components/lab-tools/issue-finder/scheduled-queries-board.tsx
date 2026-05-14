"use client"

import { useMemo, useState } from "react"
import {
  countPerspectives,
  expandQueries,
  getPerspectiveForDate,
  getQueriesFile,
  getUpcomingPerspectives,
  type IndustryProfile,
} from "@/lib/lab-tools/issue-finder/queries"
import { LAB_NEON } from "@/lib/lab-tools/registry"

const DEPTH_LABEL: Record<"deep" | "shallow", string> = {
  deep: "深掘り",
  shallow: "サブ",
}

const DEPTH_COLOR: Record<"deep" | "shallow", string> = {
  deep: LAB_NEON.green,
  shallow: LAB_NEON.cyan,
}

export function ScheduledQueriesBoard() {
  const file = getQueriesFile()
  const active = file.industryProfiles.filter((p) => p.active)
  const inactive = file.industryProfiles.filter((p) => !p.active)
  const totalPerspectives = expandQueries().length

  // SSR/hydration 一致のため固定日 (デフォルトは今日) を一度だけ計算
  const today = useMemo(() => new Date(), [])
  const todayInfo = useMemo(() => getPerspectiveForDate(today), [today])
  const upcoming = useMemo(
    () => getUpcomingPerspectives(today, 7),
    [today],
  )

  return (
    <div className="space-y-5">
      <ScheduleHeader
        humanReadable={file.schedule.humanReadable}
        cron={file.schedule.cron}
        samplingTarget={file.schedule.samplingTargetPerRun}
        maxClusters={file.schedule.maxClustersPerRun}
        activeProfileCount={active.length}
        inactiveProfileCount={inactive.length}
        totalPerspectives={totalPerspectives}
      />

      <TodayCard todayInfo={todayInfo} />

      <UpcomingList upcoming={upcoming} />

      <div className="grid gap-4 md:grid-cols-1">
        {active.map((profile, idx) => (
          <ProfileCard key={profile.id} profile={profile} index={idx} />
        ))}
      </div>

      <div
        className="border bg-black/20 p-4 font-mono text-[10px] leading-relaxed text-white/50"
        style={{ borderColor: `${LAB_NEON.green}30` }}
      >
        <p className="mb-2" style={{ color: LAB_NEON.green }}>
          // 業種・perspective を編集する
        </p>
        <p>
          <code className="text-white/80">data/issue-finder/queries.json</code>{" "}
          を編集してコミット → routine が次回実行から拾います。
        </p>
        <p className="mt-1">
          routine 設定手順:{" "}
          <code className="text-white/80">
            docs/scheduled-routines/issue-finder.md
          </code>
        </p>
      </div>
    </div>
  )
}

function ScheduleHeader({
  humanReadable,
  cron,
  samplingTarget,
  maxClusters,
  activeProfileCount,
  inactiveProfileCount,
  totalPerspectives,
}: {
  humanReadable: string
  cron: string
  samplingTarget: number
  maxClusters: number
  activeProfileCount: number
  inactiveProfileCount: number
  totalPerspectives: number
}) {
  return (
    <div
      className="border bg-black/30 p-4 flex items-center justify-between flex-wrap gap-3"
      style={{ borderColor: `${LAB_NEON.cyan}40` }}
    >
      <div>
        <p
          className="font-mono text-[10px] uppercase tracking-widest mb-1"
          style={{ color: LAB_NEON.cyan }}
        >
          // schedule
        </p>
        <p className="text-sm font-bold">{humanReadable}</p>
        <p className="text-[11px] font-mono text-white/50 mt-1">
          cron: <span className="text-white/70">{cron}</span> ／ 1 日{" "}
          {samplingTarget} 件サンプリング → 最大 {maxClusters} クラスタ
        </p>
      </div>
      <div className="text-right">
        <p
          className="font-mono text-[10px] uppercase tracking-widest"
          style={{ color: LAB_NEON.green }}
        >
          ● {activeProfileCount} 業種 active
          {inactiveProfileCount > 0 && (
            <span className="text-white/40">
              {" "}
              ／ ○ {inactiveProfileCount} paused
            </span>
          )}
        </p>
        <p className="text-[11px] font-mono text-white/50 mt-1">
          {totalPerspectives} perspective ／ {totalPerspectives} 日で 1 巡
        </p>
      </div>
    </div>
  )
}

function TodayCard({
  todayInfo,
}: {
  todayInfo: ReturnType<typeof getPerspectiveForDate>
}) {
  const { query, dayIndex, totalPerspectives, cycleNumber } = todayInfo
  return (
    <div
      className="border bg-black/40 p-5"
      style={{
        borderColor: LAB_NEON.green,
        boxShadow: `0 0 12px ${LAB_NEON.green}40`,
      }}
    >
      <p
        className="font-mono text-[10px] uppercase tracking-widest mb-2"
        style={{ color: LAB_NEON.green }}
      >
        // today / day {dayIndex + 1} / {totalPerspectives}　・　cycle {cycleNumber}
      </p>
      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight mb-1">
        {query.profileName}
      </h3>
      <p
        className="text-sm font-bold uppercase tracking-wide mb-3"
        style={{ color: LAB_NEON.cyan }}
      >
        → {query.role}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {query.keywords.map((kw) => (
          <span
            key={kw}
            className="border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/70"
          >
            {kw}
          </span>
        ))}
      </div>
    </div>
  )
}

function UpcomingList({
  upcoming,
}: {
  upcoming: ReturnType<typeof getUpcomingPerspectives>
}) {
  return (
    <details>
      <summary
        className="cursor-pointer font-mono text-[10px] uppercase tracking-widest hover:text-white"
        style={{ color: LAB_NEON.amber }}
      >
        // upcoming 7 days
      </summary>
      <ul className="mt-3 space-y-1.5 font-mono text-[11px]">
        {upcoming.map((u, i) => (
          <li
            key={u.dateLabel}
            className="flex items-center justify-between border-b border-white/10 pb-1.5"
          >
            <span className="text-white/40 w-20 shrink-0">
              {i === 0 ? "today" : u.dateLabel}
            </span>
            <span className="flex-1 truncate text-white/80">
              {u.query.profileName} → {u.query.role}
            </span>
            <span className="text-white/30 ml-3">cycle {u.cycleNumber}</span>
          </li>
        ))}
      </ul>
    </details>
  )
}

function ProfileCard({
  profile,
  index,
}: {
  profile: IndustryProfile
  index: number
}) {
  const [expanded, setExpanded] = useState(profile.depth === "deep")
  const depthColor = DEPTH_COLOR[profile.depth]

  return (
    <article
      className="border bg-black/40"
      style={{ borderColor: `${depthColor}40` }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 transition hover:bg-white/5"
      >
        <div className="min-w-0 flex-1">
          <p
            className="font-mono text-[10px] uppercase tracking-widest mb-1"
            style={{ color: depthColor }}
          >
            // industry_{String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="text-base font-black uppercase tracking-tight leading-snug">
            {profile.name}
          </h3>
          {profile.rationale && (
            <p className="mt-1.5 text-xs text-white/55 font-variant-y2k-body leading-relaxed">
              {profile.rationale}
            </p>
          )}
        </div>
        <div className="shrink-0 flex flex-col items-end gap-1">
          <span
            className="border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest"
            style={{ borderColor: `${depthColor}80`, color: depthColor }}
          >
            {DEPTH_LABEL[profile.depth]}
          </span>
          <span className="font-mono text-[10px] text-white/50">
            {countPerspectives(profile)} 視点
          </span>
          <span className="font-mono text-[10px] text-white/40">
            {expanded ? "▾ 折りたたむ" : "▸ 開く"}
          </span>
        </div>
      </button>

      {expanded && (
        <div className="border-t px-5 py-4 space-y-4" style={{ borderColor: `${depthColor}30` }}>
          {profile.phases && profile.phases.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="font-mono text-[9px] uppercase tracking-widest"
                style={{ color: LAB_NEON.amber }}
              >
                // phases
              </span>
              {profile.phases.map((phase) => (
                <span
                  key={phase}
                  className="border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/65"
                >
                  {phase}
                </span>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {profile.perspectives.map((persp, pIdx) => (
              <div
                key={persp.role}
                className="border-l-2 pl-4"
                style={{ borderColor: `${LAB_NEON.cyan}60` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className="font-mono text-[9px]"
                    style={{ color: LAB_NEON.cyan }}
                  >
                    {String(pIdx + 1).padStart(2, "0")}
                  </span>
                  <h4 className="text-sm font-bold tracking-tight">
                    {persp.role}
                  </h4>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {persp.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="border border-white/15 px-2 py-0.5 font-mono text-[10px] text-white/70"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
                {persp.examplePhrasesToWatch &&
                  persp.examplePhrasesToWatch.length > 0 && (
                    <details>
                      <summary className="cursor-pointer font-mono text-[10px] uppercase tracking-widest text-white/35 hover:text-white/70">
                        // 検出フレーズ例 ({persp.examplePhrasesToWatch.length})
                      </summary>
                      <ul className="mt-1.5 space-y-0.5 pl-4 text-[11px] text-white/55 font-mono">
                        {persp.examplePhrasesToWatch.map((p) => (
                          <li key={p}>“{p}”</li>
                        ))}
                      </ul>
                    </details>
                  )}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
