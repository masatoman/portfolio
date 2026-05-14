"use client"

import type { Issue, SubsidyTag } from "@/lib/lab-tools/issue-finder/types"
import {
  classifyIssueTier,
  classifyOpportunityTier,
  computeCompetitorDensity,
  computeOpportunityScore,
  computePersonalFit,
  computeSalesChannelDifficulty,
  TIER_LABEL,
  type IssueTier,
} from "@/lib/lab-tools/issue-finder/scoring"
import { LAB_NEON } from "@/lib/lab-tools/registry"

const SUBSIDY_LABEL: Record<SubsidyTag, string> = {
  "it-introduction": "IT導入",
  jizokuka: "持続化",
  monodzukuri: "ものづくり",
  saikochiku: "再構築",
  none: "対象外",
}

const SUBSIDY_COLOR: Record<SubsidyTag, string> = {
  "it-introduction": LAB_NEON.cyan,
  jizokuka: LAB_NEON.magenta,
  monodzukuri: LAB_NEON.green,
  saikochiku: LAB_NEON.amber,
  none: "#666",
}

// profile_id (queries.json id) → カードに表示するラベル + 色
const PROFILE_LABEL: Record<string, string> = {
  komuten: "工務店",
  "micro-corp": "マイクロ法人",
  "it-subsidy": "IT補助金",
  "financial-planner": "FP",
}

const PROFILE_COLOR: Record<string, string> = {
  komuten: LAB_NEON.green,
  "micro-corp": LAB_NEON.amber,
  "it-subsidy": LAB_NEON.cyan,
  "financial-planner": LAB_NEON.magenta,
}

const PROFILE_ICON: Record<string, string> = {
  komuten: "🏗️",
  "micro-corp": "🏢",
  "it-subsidy": "💴",
  "financial-planner": "💼",
}

const TIER_COLOR: Record<IssueTier, string> = {
  critical: "#ff3838", // 赤 (即動け)
  high: "#ff8c00", // オレンジ (注目)
  medium: LAB_NEON.amber, // 黄 (観察)
  low: "#666", // グレー (弱)
}

const TIER_ICON: Record<IssueTier, string> = {
  critical: "🔴",
  high: "🟠",
  medium: "🟡",
  low: "⚪",
}

export function IssueCard({ issue }: { issue: Issue }) {
  const isCluster =
    typeof issue.clusterSize === "number" &&
    typeof issue.samplingTotal === "number" &&
    issue.clusterSize > 0 &&
    issue.samplingTotal > 0
  const clusterPercent = isCluster
    ? Math.round(
        ((issue.clusterSize as number) / (issue.samplingTotal as number)) * 100,
      )
    : 0

  const issueTier = classifyIssueTier(issue.issueScore)
  const issueColor = TIER_COLOR[issueTier]

  const personalFit = computePersonalFit({
    subsidyTags: issue.subsidyTags,
    industryTags: issue.industryTags,
    title: issue.title,
    painSummary: issue.painSummary,
    solvabilityScore: issue.solvabilityScore,
  })
  const competitorDensity = computeCompetitorDensity({
    title: issue.title,
    painSummary: issue.painSummary,
    scoreReason: issue.scoreReason,
    sourceExcerpt: issue.sourceExcerpt,
    relatedQuotes: issue.relatedQuotes,
  })
  const { score: salesChannelDifficulty, reason: channelReason } =
    computeSalesChannelDifficulty(issue.industryTags)
  const opportunityScore = computeOpportunityScore({
    issueScore: issue.issueScore,
    solvabilityScore: issue.solvabilityScore,
    personalFit,
    competitorDensity,
    salesChannelDifficulty,
  })
  const opportunityTier = classifyOpportunityTier(opportunityScore)
  const opportunityColor = TIER_COLOR[opportunityTier]

  // 真のイシュー: issueScore × solvabilityScore どちらも 50 以上 = 右上象限
  const isTrueIssue = issue.issueScore >= 50 && issue.solvabilityScore >= 50

  return (
    <article
      className="border bg-black/40 p-4 sm:p-5 transition hover:-translate-y-0.5 relative overflow-hidden"
      style={{ borderColor: `${issueColor}50` }}
    >
      {isTrueIssue && (
        <div
          className="absolute top-0 right-0 border-b border-l bg-black px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest whitespace-nowrap"
          style={{
            borderColor: LAB_NEON.green,
            color: LAB_NEON.green,
            boxShadow: `0 0 8px ${LAB_NEON.green}40`,
          }}
          title="issueScore ≥ 50 かつ solvabilityScore ≥ 50 (右上象限)"
        >
          🎯 真のイシュー
        </div>
      )}

      <header className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {issue.profileId && (
            <div className="mb-2">
              <ProfileBadge profileId={issue.profileId} role={issue.role} />
            </div>
          )}
          <div className="mb-2 flex items-center gap-1.5 flex-wrap">
            <TierBadge
              label="動くべき度"
              tier={opportunityTier}
              value={opportunityScore}
            />
            <TierBadge
              label="イシュー度"
              tier={issueTier}
              value={issue.issueScore}
              compact
            />
          </div>
          <h3 className="text-base font-black uppercase tracking-tight leading-snug break-words">
            {issue.title}
          </h3>
        </div>
      </header>

      {isCluster && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5 font-mono text-[10px] uppercase tracking-widest">
            <span style={{ color: issueColor }}>// 規模</span>
            <span className="text-white/70">
              <span className="font-bold">{issue.clusterSize}</span>
              <span className="text-white/40">
                {" "}
                / {issue.samplingTotal} 件 ({clusterPercent}%)
              </span>
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/10 overflow-hidden">
            <div
              className="h-full"
              style={{
                width: `${clusterPercent}%`,
                background: `linear-gradient(90deg, ${issueColor}, ${issueColor}aa)`,
              }}
            />
          </div>
        </div>
      )}

      <p className="text-sm text-white/70 leading-relaxed font-variant-y2k-body mb-3">
        {issue.painSummary}
      </p>

      {issue.episode && (
        <blockquote
          className="border-l-2 pl-3 mb-4 text-xs text-white/55 italic font-variant-y2k-body"
          style={{ borderColor: `${LAB_NEON.amber}80` }}
        >
          {issue.episode}
        </blockquote>
      )}

      {issue.scoreReason && (
        <p
          className="mb-3 border-l-2 pl-3 text-[11px] text-white/50 leading-relaxed font-mono"
          style={{ borderColor: `${LAB_NEON.green}80` }}
        >
          <span
            className="block mb-1 uppercase tracking-widest text-[9px]"
            style={{ color: LAB_NEON.green }}
          >
            // score 根拠
          </span>
          {issue.scoreReason}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {issue.subsidyTags.map((tag) => (
          <span
            key={tag}
            className="inline-block border px-2 py-0.5 text-[10px] font-mono uppercase"
            style={{
              borderColor: `${SUBSIDY_COLOR[tag]}80`,
              color: SUBSIDY_COLOR[tag],
            }}
          >
            {SUBSIDY_LABEL[tag]}
          </span>
        ))}
        {issue.industryTags.map((tag) => (
          <span
            key={tag}
            className="inline-block border border-white/20 px-2 py-0.5 text-[10px] font-mono text-white/60"
          >
            {tag}
          </span>
        ))}
      </div>

      {issue.relatedQuotes && issue.relatedQuotes.length > 0 && (
        <details className="mb-3">
          <summary
            className="cursor-pointer font-mono text-[10px] uppercase tracking-widest hover:text-white"
            style={{ color: LAB_NEON.cyan }}
          >
            // 関連引用 ({issue.relatedQuotes.length} 件)
          </summary>
          <ul className="mt-2 space-y-2 pl-3 border-l border-white/10 min-w-0">
            {issue.relatedQuotes.map((q, i) => (
              <li key={i} className="font-variant-y2k-body min-w-0">
                <p className="text-[11px] text-white/55 leading-relaxed break-words">
                  “{q.excerpt}”
                </p>
                {q.sourceUrl && (
                  <a
                    href={q.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-0.5 w-full font-mono text-[9px] text-white/30 hover:text-white truncate"
                  >
                    → {q.sourceUrl}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </details>
      )}

      <div className="grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-widest text-white/50 border-t border-white/10 pt-3">
        <ScoreInline
          label="動く"
          value={opportunityScore}
          color={opportunityColor}
        />
        <ScoreInline label="ｲｼｭｰ" value={issue.issueScore} color={issueColor} />
        <ScoreInline
          label="解質"
          value={issue.solvabilityScore}
          color={LAB_NEON.green}
        />
      </div>
      <div className="mt-1.5 grid grid-cols-3 gap-2 text-[10px] font-mono uppercase tracking-widest text-white/50">
        <ScoreInline label="適合" value={personalFit} color={LAB_NEON.cyan} />
        <ScoreInline
          label="競合↓"
          value={competitorDensity}
          color={competitorDensity >= 70 ? LAB_NEON.magenta : LAB_NEON.green}
        />
        <ScoreInline
          label="販路↓"
          value={salesChannelDifficulty}
          color={salesChannelDifficulty >= 70 ? LAB_NEON.magenta : LAB_NEON.green}
        />
      </div>

      {issue.sourceUrl && (
        <a
          href={issue.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block w-full text-[10px] font-mono uppercase tracking-widest text-white/40 hover:text-white truncate"
        >
          → 代表 1次情報: {issue.sourceUrl.replace(/^https?:\/\//, "")}
        </a>
      )}
    </article>
  )
}

function TierBadge({
  label,
  tier,
  value,
  compact = false,
}: {
  label: string
  tier: IssueTier
  value: number
  compact?: boolean
}) {
  const color = TIER_COLOR[tier]
  const icon = TIER_ICON[tier]
  if (compact) {
    return (
      <span
        className="inline-flex items-center gap-1 border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest"
        style={{ borderColor: `${color}80`, color }}
        title={`${TIER_LABEL[tier]} (${value})`}
      >
        <span>{label}</span>
        <span className="font-black">{value}</span>
      </span>
    )
  }
  return (
    <span
      className="inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[11px] uppercase tracking-widest font-bold whitespace-nowrap"
      style={{
        borderColor: color,
        color,
        boxShadow: tier === "critical" ? `0 0 6px ${color}80` : undefined,
      }}
      title={`${TIER_LABEL[tier]} — ${label} ${value}`}
    >
      <span className="text-[10px]">{icon}</span>
      <span>
        {label} <span className="text-base font-black">{value}</span>
      </span>
      <span className="text-[9px] opacity-70">/ {TIER_LABEL[tier]}</span>
    </span>
  )
}

function ScoreInline({
  label,
  value,
  color,
}: {
  label: string
  value: number
  color: string
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span>{label}</span>
      <span className="font-black" style={{ color }}>
        {value}
      </span>
    </div>
  )
}

function ProfileBadge({
  profileId,
  role,
}: {
  profileId: string
  role?: string | null
}) {
  const label = PROFILE_LABEL[profileId] ?? profileId
  const color = PROFILE_COLOR[profileId] ?? "#888"
  const icon = PROFILE_ICON[profileId] ?? "📌"
  return (
    <span
      className="inline-flex items-center gap-1.5 border bg-black/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest font-bold max-w-full"
      style={{
        borderColor: color,
        color,
        boxShadow: `0 0 6px ${color}40`,
      }}
      title={role ? `${label} / ${role}` : label}
    >
      <span className="text-[11px] leading-none">{icon}</span>
      <span className="whitespace-nowrap">{label}</span>
      {role && (
        <span className="text-white/50 normal-case truncate max-w-[140px] sm:max-w-[200px]">
          {role}
        </span>
      )}
    </span>
  )
}
