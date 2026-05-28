import Link from "next/link"
import { ExternalLink, AlertTriangle, CheckCircle2, FileText, Hammer, Lightbulb } from "lucide-react"
import { V8_DEMOS, V8_DOCS, type V8Demo } from "./v8-demos-data"

const NEON = {
  cyan: "#00f0ff",
  magenta: "#ff3df0",
  green: "#39ff14",
  amber: "#ffb800",
  red: "#ff4d4d",
}

const GROUP_STYLES: Record<V8Demo["group"], { label: string; color: string; bg: string }> = {
  A: { label: "A 本命", color: NEON.cyan, bg: `${NEON.cyan}15` },
  B: { label: "B 副次", color: NEON.amber, bg: `${NEON.amber}15` },
}

const VERDICT_STYLES: Record<string, { color: string; bg: string }> = {
  "本命採用": { color: NEON.green, bg: `${NEON.green}20` },
  "次点採用": { color: NEON.cyan, bg: `${NEON.cyan}20` },
  "副軸採用": { color: NEON.magenta, bg: `${NEON.magenta}20` },
  "保留枠": { color: NEON.amber, bg: `${NEON.amber}20` },
  "ユニーク": { color: NEON.amber, bg: `${NEON.amber}20` },
}

function verdictStyle(verdict: string) {
  for (const key of Object.keys(VERDICT_STYLES)) {
    if (verdict.includes(key)) return VERDICT_STYLES[key]
  }
  return { color: "#ffffff", bg: "rgba(255,255,255,0.1)" }
}

export function V8DemosDashboard() {
  return (
    <div className="font-variant-y2k min-h-screen bg-[#06010f] text-white antialiased">
      <ScanlineLayer />
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12 space-y-16">
        <PageHero />
        <OverviewBlock />
        <EvaluationTable />
        <DemoCardsGrid />
        <ProgressStatus />
        <DocsLinks />
      </main>
      <Footer />
    </div>
  )
}

/* ───────── Scanline ───────── */
function ScanlineLayer() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40"
      style={{
        background:
          "repeating-linear-gradient(to bottom, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 3px)",
        mixBlendMode: "overlay",
      }}
    />
  )
}

/* ───────── Header ───────── */
function Header() {
  return (
    <header
      className="sticky top-0 z-30 backdrop-blur-md border-b"
      style={{
        background: "linear-gradient(180deg, rgba(6,1,15,0.9), rgba(6,1,15,0.7))",
        borderColor: `${NEON.red}50`,
      }}
    >
      <nav className="mx-auto max-w-7xl px-6 h-14 flex items-center justify-between text-xs">
        <Link href="/portfolio" className="flex items-center gap-2">
          <span
            className="grid place-items-center h-6 w-6 text-[10px] font-black"
            style={{
              background: `linear-gradient(135deg, ${NEON.red}, ${NEON.magenta})`,
              color: "#000",
              clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
            }}
          >
            v8
          </span>
          <span className="font-bold tracking-widest uppercase">v8.0 internal dashboard</span>
        </Link>
        <div
          className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
          style={{ background: NEON.red, color: "#000" }}
        >
          <AlertTriangle className="h-3 w-3" />
          internal use only
        </div>
      </nav>
    </header>
  )
}

/* ───────── Page Hero ───────── */
function PageHero() {
  return (
    <section className="relative overflow-hidden border-2 px-8 py-12" style={{ borderColor: `${NEON.red}80` }}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,77,77,0.18) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,77,77,0.10) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative">
        <div className="flex items-center gap-3 mb-4 text-xs uppercase tracking-widest">
          <span
            className="px-2 py-1 font-bold flex items-center gap-1"
            style={{ background: NEON.red, color: "#000", clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" }}
          >
            <AlertTriangle className="h-3 w-3" />
            confidential
          </span>
          <span className="text-white/75">// masatoman 内部評価専用 — ヒアリング相手 / 商談相手には見せない</span>
        </div>
        <h1
          className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] uppercase"
          style={{ textShadow: `0 0 40px ${NEON.red}50` }}
        >
          v8.0 6 デモ<br />内部評価ダッシュボード
        </h1>
        <p className="mt-6 max-w-3xl text-sm sm:text-base text-white/70 leading-relaxed">
          5/22 北原氏面談確定事項を反映した v8.0 6 デモ並列開発結果の概観 + 4 AI 合議スコア + 採用判定 + 関連 docs リンク集。
          商談前確認 + 自分のレビュー用。
        </p>
      </div>
    </section>
  )
}

/* ───────── Overview ───────── */
function OverviewBlock() {
  return (
    <section>
      <SectionHeader label="// overview" title="v8.0 化 背景 + ステータス" />
      <div className="grid gap-6 md:grid-cols-3">
        <InfoCard
          accent={NEON.cyan}
          title="5/22 北原氏面談 確定事項"
          items={[
            "主顧客 = 30-40 代 アトツギ + 展示会層 + やる気層 + 儲かってる層",
            "避ける顧客 = 60 代 IT 弱者層 (現状でいい層 = 動機ゼロ)",
            "提供形態 = SaaS / BPaaS ハイブリッド (IT 強弱でトップ分岐)",
            "集客 = 紹介芋蔓式 + 商工会 + 建設業協会 + 展示会",
            "動くデモ前提 + 紹介者から困りごと事前ヒアリング",
          ]}
        />
        <InfoCard
          accent={NEON.magenta}
          title="v8.0 化 背景"
          items={[
            "v7.0 までの「現場写真整理 / 見積もり PDF」 2 択を廃止",
            "アトツギ層に効く商品候補を 6 デモまで拡張",
            "4 AI (Claude / ChatGPT / Gemini / Grok) 合議でスコアリング",
            "基礎 6 軸 (/30) + 追加 10 観点 (/50) で評価",
            "本命 3 + 副次 3 の構成で並列開発",
          ]}
        />
        <InfoCard
          accent={NEON.green}
          title="開発ステータス (2026-05-23)"
          items={[
            "✅ 6 デモ 並列開発 完了",
            "✅ 全デモ tsc 構文チェック OK",
            "✅ demo data 投入済 (多摩エリア整合)",
            "🟡 友人 N=1 ヒアリング 待ち (反応次第で絞り込み)",
            "🟡 12/2-4 JAPAN BUILD TOKYO 出展 候補",
          ]}
        />
      </div>
    </section>
  )
}

function InfoCard({ accent, title, items }: { accent: string; title: string; items: string[] }) {
  return (
    <div className="border-2 p-5" style={{ borderColor: `${accent}80`, background: `${accent}08` }}>
      <h3 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: accent }}>
        {title}
      </h3>
      <ul className="space-y-2 text-xs text-white/80 leading-relaxed">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-white/40">▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ───────── Evaluation Table ───────── */
function EvaluationTable() {
  return (
    <section>
      <SectionHeader label="// evaluation" title="6 デモ 評価テーブル (4 AI 合議 スコアリング)" />
      <div className="overflow-x-auto border-2" style={{ borderColor: `${NEON.cyan}40` }}>
        <table className="w-full text-xs">
          <thead style={{ background: `${NEON.cyan}15`, borderBottom: `2px solid ${NEON.cyan}80` }}>
            <tr className="uppercase tracking-widest">
              <th className="px-3 py-3 text-left font-bold">#</th>
              <th className="px-3 py-3 text-left font-bold">群</th>
              <th className="px-3 py-3 text-left font-bold">デモ名</th>
              <th className="px-3 py-3 text-left font-bold">カテゴリ</th>
              <th className="px-3 py-3 text-center font-bold">Score</th>
              <th className="px-3 py-3 text-center font-bold">基礎/30</th>
              <th className="px-3 py-3 text-center font-bold">追加/50</th>
              <th className="px-3 py-3 text-left font-bold">採用判定</th>
              <th className="px-3 py-3 text-left font-bold">動くデモ</th>
              <th className="px-3 py-3 text-left font-bold">ヒアリング資料 P</th>
            </tr>
          </thead>
          <tbody>
            {V8_DEMOS.map((d, i) => {
              const gs = GROUP_STYLES[d.group]
              const vs = verdictStyle(d.verdict)
              return (
                <tr
                  key={d.id}
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                  style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}
                >
                  <td className="px-3 py-3 font-mono tabular-nums">{d.id}</td>
                  <td className="px-3 py-3">
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ background: gs.bg, color: gs.color, border: `1px solid ${gs.color}80` }}
                    >
                      {gs.label}
                      {d.starred && " ⭐"}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold">{d.title}</td>
                  <td className="px-3 py-3 text-white/70">{d.category}</td>
                  <td className="px-3 py-3 text-center font-mono font-bold" style={{ color: NEON.cyan }}>
                    {d.score}
                  </td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums">{d.baseScore}</td>
                  <td className="px-3 py-3 text-center font-mono tabular-nums">{d.extraScore}</td>
                  <td className="px-3 py-3">
                    <span
                      className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
                      style={{ background: vs.bg, color: vs.color, border: `1px solid ${vs.color}80` }}
                    >
                      {d.verdict}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <Link
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 hover:underline"
                      style={{ color: NEON.green }}
                    >
                      開く
                      <ExternalLink className="h-3 w-3" />
                    </Link>
                  </td>
                  <td className="px-3 py-3 font-mono text-white/60">{d.hearingPage}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-[11px] text-white/50 leading-relaxed">
        ⭐ = 本命中の本命 (最優先候補) / Score は 4 AI の総合スコア (基礎 6 軸 + 追加 10 観点 を合算した内部指標) / ヒアリング資料 P ={" "}
        <code className="text-white/70">docs/v8.0-hearing-resource-2026-05-23.html</code> の対応ページ番号
      </p>
    </section>
  )
}

/* ───────── Demo Cards Grid ───────── */
function DemoCardsGrid() {
  return (
    <section>
      <SectionHeader label="// detail cards" title="6 デモ カード詳細" />
      <div className="grid gap-6 lg:grid-cols-2">
        {V8_DEMOS.map((d) => (
          <DemoCard key={d.id} demo={d} />
        ))}
      </div>
    </section>
  )
}

function DemoCard({ demo: d }: { demo: V8Demo }) {
  const gs = GROUP_STYLES[d.group]
  const vs = verdictStyle(d.verdict)
  return (
    <article
      className="border-2 p-6 flex flex-col gap-4"
      style={{ borderColor: `${gs.color}80`, background: `${gs.color}05` }}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-mono text-[10px] text-white/40">#{d.id}</span>
            <span
              className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: gs.bg, color: gs.color, border: `1px solid ${gs.color}80` }}
            >
              {gs.label}
              {d.starred && " ⭐"}
            </span>
            <span
              className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest"
              style={{ background: vs.bg, color: vs.color, border: `1px solid ${vs.color}80` }}
            >
              {d.verdict}
            </span>
          </div>
          <h3 className="text-xl font-black uppercase tracking-tight">{d.title}</h3>
          <p className="text-[11px] text-white/50 mt-1">{d.category}</p>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl font-bold" style={{ color: NEON.cyan }}>
            {d.score}
          </div>
          <div className="text-[10px] text-white/50 uppercase tracking-widest">score</div>
        </div>
      </div>

      {/* Pain */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: NEON.magenta }}>
          // 痛み (内部認識)
        </div>
        <p className="text-xs text-white/80 leading-relaxed">{d.pain}</p>
      </div>

      {/* Product */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: NEON.cyan }}>
          // 商品像 (技術スタック)
        </div>
        <p className="text-xs text-white/80 leading-relaxed">{d.product}</p>
      </div>

      {/* Pricing */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: NEON.green }}>
          // 価格設計
        </div>
        <ul className="text-xs text-white/80 leading-relaxed space-y-0.5">
          {d.pricing.map((p, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-white/40">▸</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Strengths + Risks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: NEON.green }}>
            // 強み (P02-P21)
          </div>
          <ul className="text-[11px] text-white/75 leading-relaxed space-y-0.5">
            {d.strengths.map((s, i) => (
              <li key={i} className="flex gap-1">
                <span style={{ color: NEON.green }}>+</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: NEON.amber }}>
            // リスク (P02-P21)
          </div>
          <ul className="text-[11px] text-white/75 leading-relaxed space-y-0.5">
            {d.risks.map((r, i) => (
              <li key={i} className="flex gap-1">
                <span style={{ color: NEON.amber }}>!</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer: link + tsc */}
      <div className="flex items-center justify-between pt-3 border-t border-white/10 flex-wrap gap-2">
        <Link
          href={d.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest hover:underline"
          style={{ color: NEON.cyan }}
        >
          動くデモを開く
          <ExternalLink className="h-3 w-3" />
        </Link>
        <span className="inline-flex items-center gap-1 text-[10px] text-white/60 uppercase tracking-widest">
          <CheckCircle2 className="h-3 w-3" style={{ color: NEON.green }} />
          tsc OK
        </span>
      </div>
    </article>
  )
}

/* ───────── Progress Status ───────── */
function ProgressStatus() {
  return (
    <section>
      <SectionHeader label="// progress" title="開発進捗ステータス (2026-05-23 時点)" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {V8_DEMOS.map((d) => (
          <div key={d.id} className="border-2 p-4" style={{ borderColor: `${NEON.cyan}40` }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold">
                #{d.id} {d.title}
              </h4>
              <span className="font-mono text-xs" style={{ color: NEON.cyan }}>
                {d.progress}
              </span>
            </div>
            <div className="space-y-2 text-[11px] text-white/70">
              <div className="flex gap-2">
                <Hammer className="h-3 w-3 mt-0.5 text-white/40 flex-shrink-0" />
                <span>{d.devStatus}</span>
              </div>
              <ProgressBar pct={d.progressPct} color={NEON.green} />
              {d.todos.length > 0 && (
                <div className="pt-2">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-white/50 mb-1 flex items-center gap-1">
                    <Lightbulb className="h-3 w-3" /> TODO 案
                  </div>
                  <ul className="space-y-0.5">
                    {d.todos.map((t, i) => (
                      <li key={i} className="flex gap-1">
                        <span className="text-white/40">▸</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 border-2 p-4" style={{ borderColor: `${NEON.amber}60`, background: `${NEON.amber}08` }}>
        <div className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center gap-1" style={{ color: NEON.amber }}>
          <Lightbulb className="h-3 w-3" /> 共通 TODO
        </div>
        <p className="text-xs text-white/80">
          友人 N=1 ヒアリングで反応次第で機能絞り込み or 拡張。 5/23-25 で v8.0 商品方向性 決定 → 友人ヒアリング Phase 3 (5 代行サービス順位付け 30 分) → 7-9 月 仮説修正期 → 10-12 月 MVP 投入期。
        </p>
      </div>
    </section>
  )
}

function ProgressBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="w-full h-2 bg-white/5 border border-white/20 relative overflow-hidden">
      <div
        className="h-full"
        style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${color}, ${NEON.cyan})` }}
      />
    </div>
  )
}

/* ───────── Docs Links ───────── */
function DocsLinks() {
  return (
    <section>
      <SectionHeader label="// docs" title="関連 docs リンク集" />
      <div className="grid gap-4 md:grid-cols-2">
        {V8_DOCS.map((doc) => (
          <a
            key={doc.path}
            href={doc.path}
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 p-5 hover:bg-white/5 transition-colors group"
            style={{ borderColor: `${NEON.magenta}50` }}
          >
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: NEON.magenta }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold group-hover:underline">{doc.label}</h4>
                  <ExternalLink className="h-3 w-3 text-white/50" />
                </div>
                <p className="text-[11px] text-white/60 leading-relaxed mb-2">{doc.description}</p>
                <code className="text-[10px] text-white/40 break-all">{doc.path}</code>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6">
        <h4 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: NEON.cyan }}>
          // 各デモ URL リンク (一括)
        </h4>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {V8_DEMOS.map((d) => (
            <Link
              key={d.id}
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-2 px-3 py-2 border hover:bg-white/5 transition-colors"
              style={{ borderColor: `${NEON.cyan}40` }}
            >
              <span className="text-xs">
                <span className="font-mono text-white/40">#{d.id}</span> {d.title}
              </span>
              <ExternalLink className="h-3 w-3 text-white/50 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ───────── Section Header helper ───────── */
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: NEON.green }}>
        {label}
      </p>
      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight">{title}</h2>
    </div>
  )
}

/* ───────── Footer ───────── */
function Footer() {
  return (
    <footer
      className="mt-24 border-t py-8"
      style={{ borderColor: `${NEON.red}40`, background: "rgba(255,77,77,0.05)" }}
    >
      <div className="mx-auto max-w-7xl px-6 text-center">
        <div className="text-[10px] uppercase tracking-widest text-white/50 mb-2">
          // confidential — internal use only
        </div>
        <p className="text-xs text-white/60">
          このページは masatoman (井原誠斗) 個人の内部評価専用ダッシュボード。 noindex + nofollow + nocache 設定済。
          ヒアリング相手 / 商談相手には絶対に共有しないこと。
        </p>
        <p className="text-[10px] text-white/40 mt-3">
          last updated: 2026-05-23 / parent:{" "}
          <Link href="/portfolio" className="hover:underline" style={{ color: NEON.cyan }}>
            /portfolio
          </Link>
        </p>
      </div>
    </footer>
  )
}
