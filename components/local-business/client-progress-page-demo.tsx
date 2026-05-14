"use client"

import { useMemo } from "react"
import { CheckCircle2, Clock, Calendar, ImageIcon, Link as LinkIcon, MessageCircle } from "lucide-react"
import {
  calculateProgressPercent,
  sampleProjectMeta,
  sampleProjectMilestones,
  sampleQuestions,
  type ProjectMilestone,
  type ProjectMilestoneStatus,
} from "@/lib/local-business/client-progress-page"

export function ClientProgressPageDemo() {
  const progress = useMemo(() => calculateProgressPercent(sampleProjectMilestones), [])

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[28px] border border-[#bae6fd] bg-[linear-gradient(135deg,#ecfeff,#f0f9ff_50%,#ffffff)] shadow-[0_18px_50px_rgba(6,182,212,0.12)]">
        <div className="border-b border-[#bae6fd]/60 bg-white/60 px-6 py-4 backdrop-blur sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0e7490]">
              <LinkIcon className="h-3.5 w-3.5" />
              <span className="font-mono">
                ihara-frontend.example.com/projects/{sampleProjectMeta.publicUrlSuffix}
              </span>
            </div>
            <span className="rounded-full border border-[#bae6fd] bg-white px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#0e7490]">
              施主専用 公開ページ
            </span>
          </div>
        </div>

        <div className="px-6 py-8 sm:px-10 sm:py-12">
          <p className="text-xs font-black uppercase tracking-[0.25em] text-[#0e7490]">
            {sampleProjectMeta.builderName}
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#071b49] sm:text-4xl">
            {sampleProjectMeta.projectName}
          </h2>
          <p className="mt-2 text-sm font-bold text-[#33496d] sm:text-base">
            {sampleProjectMeta.ownerName} のお家を 進めています
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <InfoBlock label="着工" value={formatJapaneseDate(sampleProjectMeta.startedAt)} />
            <InfoBlock label="完成 (予定)" value={formatJapaneseDate(sampleProjectMeta.expectedFinish)} />
            <InfoBlock label="現在の 進捗" value={`${progress}%`} emphasis />
          </div>

          <div className="mt-6">
            <div className="h-3 overflow-hidden rounded-full bg-white/60">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#06b6d4,#0e7490)]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-bold text-[#5f6f89]">
              全 {sampleProjectMilestones.length}工程 中 {sampleProjectMilestones.filter((m) => m.status === "完了").length}工程 完了
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)] sm:p-8">
        <h3 className="text-xl font-black text-[#071b49]">工事の流れ</h3>
        <p className="mt-2 text-sm font-bold text-[#5f6f89]">
          現場が 1工程 進むごとに 自動で更新されます。
        </p>

        <ol className="mt-6 space-y-4">
          {sampleProjectMilestones.map((m, i) => (
            <Milestone
              key={m.id}
              milestone={m}
              isLast={i === sampleProjectMilestones.length - 1}
            />
          ))}
        </ol>
      </section>

      <section className="rounded-[24px] border border-[#d8e3f2] bg-white p-6 shadow-[0_14px_40px_rgba(7,27,73,0.08)] sm:p-8">
        <h3 className="text-xl font-black text-[#071b49]">施主からの ご相談</h3>
        <p className="mt-2 text-sm font-bold text-[#5f6f89]">
          ページ内で やりとり。 電話・LINE が 来なくなります。
        </p>

        <div className="mt-6 space-y-4">
          {sampleQuestions.map((q) => (
            <article key={q.id} className="rounded-[20px] border border-[#d8e3f2] p-5">
              <div className="flex items-start gap-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#fef3c7] text-[#b45309]">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black text-[#071b49]">{q.askedBy} 様</p>
                  <p className="text-xs font-bold text-[#5f6f89]">
                    {q.askedAt.replace("T", " ")}
                  </p>
                  <p className="mt-2 text-sm font-bold leading-7 text-[#33496d]">{q.question}</p>
                </div>
              </div>
              {q.answer ? (
                <div className="mt-4 flex items-start gap-3 rounded-2xl bg-[#ecfeff] p-4">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-[#0e7490]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-[#0e7490]">井原工務店からの返答</p>
                    <p className="text-xs font-bold text-[#5f6f89]">
                      {q.answeredAt?.replace("T", " ")}
                    </p>
                    <p className="mt-2 text-sm font-bold leading-7 text-[#33496d]">{q.answer}</p>
                  </div>
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-[#d97706]/40 bg-[#fffbeb] p-4">
                  <p className="text-xs font-black text-[#b45309]">未対応</p>
                  <p className="mt-1 text-sm font-bold text-[#33496d]">
                    返答待ち。 通知が届いています。
                  </p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] border border-[#bae6fd] bg-[linear-gradient(135deg,#ecfeff,#f0f9ff)] p-6 sm:p-8">
        <h3 className="text-xl font-black text-[#071b49]">この ページは 施主にも スマホで 見えます</h3>
        <p className="mt-2 text-sm font-bold text-[#33496d]">
          施主には URL を 1度 LINE で送るだけ。 「今どうなってる？」の 電話・LINE が 大幅に減ります。
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e7490]">施主の体験</p>
            <ul className="mt-3 space-y-2 text-sm font-bold leading-7 text-[#33496d]">
              <li>・URLを 1度 ブックマーク</li>
              <li>・気が向いた時に 開くだけ</li>
              <li>・写真と進捗が 自動で増える</li>
              <li>・気になる事は そのページから 質問</li>
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e7490]">工務店の体験</p>
            <ul className="mt-3 space-y-2 text-sm font-bold leading-7 text-[#33496d]">
              <li>・現場で 写真を 撮って投稿</li>
              <li>・工程が 進んだら タップで完了に</li>
              <li>・「今どうなってる？」電話 ほぼゼロ</li>
              <li>・施主の 安心感が 段違いに上がる</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

function Milestone({ milestone, isLast }: { milestone: ProjectMilestone; isLast: boolean }) {
  const icon = statusIcon(milestone.status)
  const dateLabel =
    milestone.status === "完了"
      ? `${formatJapaneseDate(milestone.completedAt!)} 完了`
      : milestone.status === "進行中"
        ? "進行中"
        : `${formatJapaneseDate(milestone.scheduledAt!)} 予定`

  return (
    <li className="relative pl-12">
      {!isLast && (
        <span
          aria-hidden
          className="absolute left-[18px] top-10 bottom-[-16px] w-0.5 bg-[#dbeafe]"
        />
      )}
      <span
        className="absolute left-0 top-1 grid h-9 w-9 place-items-center rounded-full text-white shadow-[0_6px_18px_rgba(7,27,73,0.15)]"
        style={{ background: milestone.swatch }}
      >
        {icon}
      </span>
      <div className="rounded-2xl border border-[#d8e3f2] p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 className="text-base font-black text-[#071b49]">
            <span className="mr-2 text-xs font-black uppercase tracking-widest text-[#5f6f89]">
              工程 {milestone.order}
            </span>
            {milestone.stage}
          </h4>
          <StatusBadge status={milestone.status} />
        </div>
        <p className="mt-1 text-xs font-bold text-[#5f6f89]">{dateLabel}</p>
        <p className="mt-3 text-sm font-bold leading-7 text-[#33496d]">{milestone.summary}</p>
        {milestone.photoCount > 0 && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#ecfeff] px-3 py-1 text-xs font-black text-[#0e7490]">
            <ImageIcon className="h-3.5 w-3.5" />
            写真 {milestone.photoCount}枚
          </div>
        )}
      </div>
    </li>
  )
}

function StatusBadge({ status }: { status: ProjectMilestoneStatus }) {
  const colors: Record<ProjectMilestoneStatus, string> = {
    完了: "bg-[#dcfce7] text-[#166534]",
    進行中: "bg-[#fef3c7] text-[#b45309]",
    予定: "bg-[#e2e8f0] text-[#475569]",
  }
  return (
    <span
      className={`rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider ${colors[status]}`}
    >
      {status}
    </span>
  )
}

function statusIcon(status: ProjectMilestoneStatus) {
  if (status === "完了") return <CheckCircle2 className="h-4 w-4" />
  if (status === "進行中") return <Clock className="h-4 w-4" />
  return <Calendar className="h-4 w-4" />
}

function InfoBlock({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) {
  return (
    <div className="rounded-2xl border border-white/60 bg-white/70 px-4 py-3 backdrop-blur">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#0e7490]">{label}</p>
      <p className={`mt-1 font-black text-[#071b49] ${emphasis ? "text-3xl" : "text-lg"}`}>
        {value}
      </p>
    </div>
  )
}

function formatJapaneseDate(iso: string): string {
  const [y, m, d] = iso.split("-")
  return `${y}年${parseInt(m, 10)}月${parseInt(d, 10)}日`
}
