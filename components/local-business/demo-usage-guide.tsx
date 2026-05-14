/**
 * Usage guide block for /local-business/* demo pages.
 *
 * 3 sections in plain Japanese:
 *  1. こんな ことに 困っていませんか
 *  2. 使い方は 3ステップ
 *  3. どうなる
 *
 * Visual language matches DemoPageShell (warm editorial blue + accent).
 */

type UsageGuideStep = {
  no: string
  title: string
  body: string
}

type UsageGuideOutcome = {
  label: string
  value: string
}

type DemoUsageGuideProps = {
  /** Hex color string for the section accent (matches the demo's accent). */
  accent: string
  pains: string[]
  steps: UsageGuideStep[]
  outcomes: UsageGuideOutcome[]
}

export function DemoUsageGuide({ accent, pains, steps, outcomes }: DemoUsageGuideProps) {
  return (
    <section className="mb-10 grid gap-6 lg:grid-cols-3">
      <Card title="こんな ことに 困っていませんか" tone="muted">
        <ul className="space-y-3">
          {pains.map((p) => (
            <li key={p} className="flex items-start gap-3">
              <span
                className="mt-2 h-2 w-2 shrink-0 rounded-full"
                style={{ background: accent }}
              />
              <span className="text-sm font-bold leading-7 text-[#33496d]">{p}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card title="使い方は 3 ステップ" tone="accent" accent={accent}>
        <ol className="space-y-4">
          {steps.map((s) => (
            <li key={s.no} className="flex items-start gap-3">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-black text-white"
                style={{ background: accent }}
              >
                {s.no}
              </span>
              <div>
                <p className="text-sm font-black text-[#071b49]">{s.title}</p>
                <p className="mt-1 text-xs font-bold leading-6 text-[#5f6f89]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      <Card title="やった結果 こうなります" tone="muted">
        <div className="space-y-3">
          {outcomes.map((o) => (
            <div
              key={o.label}
              className="rounded-2xl border border-[#dde6f3] bg-[#f7faff] px-4 py-3"
            >
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#5f6f89]">
                {o.label}
              </p>
              <p
                className="mt-1 text-lg font-black tracking-tight"
                style={{ color: accent }}
              >
                {o.value}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </section>
  )
}

function Card({
  title,
  tone,
  accent,
  children,
}: {
  title: string
  tone: "muted" | "accent"
  accent?: string
  children: React.ReactNode
}) {
  const isAccent = tone === "accent"
  return (
    <div
      className={`rounded-[24px] border p-6 ${
        isAccent
          ? "bg-white shadow-[0_14px_40px_rgba(7,27,73,0.08)]"
          : "border-[#d8e3f2] bg-white shadow-[0_14px_40px_rgba(7,27,73,0.06)]"
      }`}
      style={isAccent && accent ? { borderColor: `${accent}55` } : undefined}
    >
      <h2
        className="mb-4 text-base font-black tracking-tight text-[#071b49]"
        style={isAccent && accent ? { color: accent } : undefined}
      >
        {title}
      </h2>
      {children}
    </div>
  )
}
