/**
 * Savings simulation panel for /local-business/* demo pages.
 *
 * The point: translate the engineer's vague "this is convenient" into the
 * decision-maker's concrete "this is cost". Numbers are explicitly framed
 * as imagined examples — never represent these as real client outcomes.
 *
 * Visual language matches DemoPageShell (warm editorial, blue+orange).
 */

type Row = { label: string; value: string }
type Delta = { label: string; value: string; emphasis?: boolean }

type SavingsSimulationProps = {
  scenarioTitle: string
  scenarioDescription?: string
  before: Row[]
  after: Row[]
  delta: Delta[]
  disclaimer?: string
}

export function SavingsSimulation({
  scenarioTitle,
  scenarioDescription,
  before,
  after,
  delta,
  disclaimer = "上の数字はあくまで想定例です。実際の効果は、現状の業務量・体制・運用方法によって大きく変わります。",
}: SavingsSimulationProps) {
  return (
    <section className="mt-12 rounded-[28px] border border-[#d8e3f2] bg-white p-6 shadow-[0_18px_50px_rgba(7,27,73,0.06)] sm:p-8">
      <div className="mb-6 inline-flex items-center rounded-full border border-[#d6e9ff] bg-[#eef6ff] px-4 py-2 text-xs font-black text-[#2f6fb6]">
        導入後の 数字 シミュレーション例
      </div>
      <h2 className="text-2xl font-black tracking-tight text-[#071b49]">
        {scenarioTitle}
      </h2>
      {scenarioDescription && (
        <p className="mt-3 text-sm font-bold leading-7 text-[#33496d] sm:text-base">
          {scenarioDescription}
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card label="導入前" tone="muted">
          {before.map((r) => (
            <RowLine key={r.label} label={r.label} value={r.value} />
          ))}
        </Card>
        <Card label="導入後" tone="accent">
          {after.map((r) => (
            <RowLine key={r.label} label={r.label} value={r.value} />
          ))}
        </Card>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-[#f1dfc4] bg-[linear-gradient(135deg,#fff6e7,#ffffff_60%,#fff2de)] p-5 sm:grid-cols-3 sm:p-6">
        {delta.map((d) => (
          <div key={d.label}>
            <div className="text-xs font-black uppercase tracking-widest text-[#a37418]">
              {d.label}
            </div>
            <div
              className={`mt-1 ${
                d.emphasis ? "text-3xl text-[#c84e0c]" : "text-2xl text-[#071b49]"
              } font-black tracking-tight`}
            >
              {d.value}
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-xs font-bold leading-6 text-[#7a8aa8]">
        ※ {disclaimer}
      </p>
    </section>
  )
}

function Card({
  label,
  tone,
  children,
}: {
  label: string
  tone: "muted" | "accent"
  children: React.ReactNode
}) {
  const isAccent = tone === "accent"
  return (
    <div
      className={`rounded-2xl border p-5 ${
        isAccent
          ? "border-[#fbc89a] bg-[linear-gradient(180deg,#fff7ed,#ffffff)]"
          : "border-[#dde6f3] bg-[#f7faff]"
      }`}
    >
      <div
        className={`mb-3 text-xs font-black uppercase tracking-widest ${
          isAccent ? "text-[#c84e0c]" : "text-[#5a6f93]"
        }`}
      >
        {label}
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function RowLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-[#dde6f3] pb-2 last:border-b-0 last:pb-0">
      <span className="text-sm font-bold text-[#33496d]">{label}</span>
      <span className="font-black text-[#071b49]">{value}</span>
    </div>
  )
}
