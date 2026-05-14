// 商談用ペライチレポート (A4 縦 1 枚 / ビジネス調 / 印刷対応)
// /lab/tools/issue-finder/report で表示。 Web 表示と print の両対応。

import type { Issue } from "@/lib/lab-tools/issue-finder/types"
import {
  computeOpportunityScore,
  computePersonalFit,
} from "@/lib/lab-tools/issue-finder/scoring"

type RootCategory = {
  id: "tool-misfit" | "photo-album" | "labor-burnout"
  label: string
  description: string
  issueIds: string[]
}

export type ReportAudience = "intermediary" | "owner"

type Props = {
  issues: Issue[]
  generatedDate: string // YYYY-MM-DD
  audience?: ReportAudience
}

const AUDIENCE_COPY = {
  intermediary: {
    eyebrow: "工務店現場 業務改善レポート 2026",
    title: "写真台帳が残業の主因、 既存 SaaS は現場で機能していない",
    subtitle: "ネット上の 1 次情報からの構造化分析",
    rootsTitle: "工務店現場が抱える 3 大課題",
    signalsTitle: "当事者の声から見えた 8 つの具体課題",
    offerTitle: "井原が支援できること",
    altLinkLabel: "→ 工務店オーナー向け版",
    altLinkHref: "/lab/tools/issue-finder/report/komuten",
    roots: [
      {
        num: "01",
        label: "既存ツールが現場に合っていない",
        body: "ANDPAD・Photoruction・蔵衛門・kintone 等 主要ツールで『使いにくい』『写真が消える』『元請優先で職人が使えない』という声が頻出。 導入したのに定着せず、 結局紙運用に戻る工務店も多数。",
      },
      {
        num: "02",
        label: "写真台帳業務が深夜残業の主因",
        body: "昼は現場業務で撮影だけ・夜は事務所で写真整理という構造で、 平均 50〜100h/月の残業が発生。 業務改善 SaaS の活用で残業を 1/4 まで削減した工務店もあり、 解決の道筋は明確。",
      },
      {
        num: "03",
        label: "若手離職と労務リスクの背景",
        body: "サービス残業 200h・残業代未払・1 年目離職・家族関係への影響が業界全体に波及。 直接 IT で解けるテーマではないが、 業務効率化が間接的に改善余地。",
      },
    ],
    offers: [
      {
        num: "A",
        label: "業務改善ツール開発",
        body: "Next.js / React / PWA で、 オフライン対応の現場向けツールを設計から実装まで一人で。 写真台帳・日報・原価管理など 工務店業務に特化したカスタム開発。",
      },
      {
        num: "B",
        label: "既存 SaaS の運用フォロー",
        body: "ANDPAD / kintone 等 既存ツールの設定・カスタマイズ・現場研修。 完全置換ではなく 現場が使い続けられる運用設計に。",
      },
      {
        num: "C",
        label: "補助金申請の業務改善計画書作成",
        body: "IT 導入補助金 / 持続化補助金 向けの事業計画書ドラフト + 成果報告書作成支援。 GビズID 取得から伴走。",
      },
    ],
  },
  owner: {
    eyebrow: "工務店さま 向け ご提案資料 2026",
    title: "写真整理で夜遅くまで残業、 やめませんか",
    subtitle: "他の工務店さん 235 件の声から見えた 共通の困りごと",
    rootsTitle: "工務店の現場でよくある 3 つの困りごと",
    signalsTitle:
      "実際に出ていた 8 つのお困りごと (235 件の現場の声から)",
    offerTitle: "井原がお手伝いできること",
    altLinkLabel: "→ 補助金支援事業者・商工会議所 向け版",
    altLinkHref: "/lab/tools/issue-finder/report",
    roots: [
      {
        num: "01",
        label: "今使っているアプリが現場に合わない",
        body: "ANDPAD・蔵衛門・kintone など、 入れてみたものの『使いにくい』『写真が消える』『職人さんが使ってくれない』というお声が多数。 結局紙運用に戻った、 という工務店さんも少なくありません。",
      },
      {
        num: "02",
        label: "写真の整理で夜遅くまで残業",
        body: "昼間は現場、 夜は事務所で写真整理。 平均で月 50〜100 時間の残業が発生しています。 アプリを変えるだけで残業を 4 分の 1 に減らした工務店さんもいて、 解決の方法は見つかっています。",
      },
      {
        num: "03",
        label: "若手が辞めていく・家族との時間がない",
        body: "サービス残業 200 時間・1 年目で辞める・家族関係に影響、 という声が業界全体に。 アプリだけでは全部は解決できませんが、 業務を楽にすることで間接的に改善できます。",
      },
    ],
    offers: [
      {
        num: "A",
        label: "現場で使える業務アプリを作ります",
        body: "スマホでもパソコンでも使えて、 電波が悪い現場でも動くアプリを 設計から完成まで一人で対応。 写真整理・日報・原価管理など 工務店さんの業務に合わせて作ります。",
      },
      {
        num: "B",
        label: "今お使いのアプリのフォロー",
        body: "ANDPAD などすでに導入しているアプリの 設定や使い方を 現場の方が続けられる形に調整します。 完全に乗り換えなくても、 続けられる運用を一緒に考えます。",
      },
      {
        num: "C",
        label: "補助金の申請をお手伝いします",
        body: "IT 導入補助金・持続化補助金 の申請書類を一緒に作ります。 G ビズ ID の取得から成果報告書まで 伴走可能。 まず無料でご相談ください。",
      },
    ],
  },
} as const

export function ReportContent({
  issues,
  generatedDate,
  audience = "intermediary",
}: Props) {
  const copy = AUDIENCE_COPY[audience]
  // 動くべき度で並べ替え + 上位 8 件
  const ranked = [...issues]
    .map((i) => {
      const fit = computePersonalFit({
        subsidyTags: i.subsidyTags,
        industryTags: i.industryTags,
        title: i.title,
        painSummary: i.painSummary,
        solvabilityScore: i.solvabilityScore,
      })
      const opportunity = computeOpportunityScore({
        issueScore: i.issueScore,
        solvabilityScore: i.solvabilityScore,
        personalFit: fit,
      })
      return { issue: i, opportunity, fit }
    })
    .sort((a, b) => b.opportunity - a.opportunity)
  const top8 = ranked.slice(0, 8)

  const samplingTotal = issues.reduce(
    (acc, i) => Math.max(acc, i.samplingTotal ?? 0),
    0,
  )

  return (
    <div className="report-root">
      <header className="report-header">
        <div>
          <p className="report-eyebrow">{copy.eyebrow}</p>
          <h1 className="report-title">{copy.title}</h1>
          <p className="report-subtitle">
            {audience === "intermediary"
              ? `ネット上の 1 次情報 ${samplingTotal || "235"} 件 (Yahoo!知恵袋 / note / X / OpenWork / App Store レビュー等) からの構造化分析`
              : `他の工務店さんが実際に話している声 ${samplingTotal || "235"} 件をまとめました`}
          </p>
        </div>
        <div className="report-meta">
          <p className="report-meta-label">作成</p>
          <p className="report-meta-value">
            井原誠斗{audience === "intermediary" ? " (フロントエンドエンジニア)" : ""}
          </p>
          <p className="report-meta-date">{generatedDate}</p>
        </div>
      </header>

      <section className="report-roots">
        <h2 className="report-section-title">{copy.rootsTitle}</h2>
        <div className="report-roots-grid">
          {copy.roots.map((r) => (
            <RootCard key={r.num} num={r.num} label={r.label} body={r.body} />
          ))}
        </div>
      </section>

      <section className="report-signals">
        <h2 className="report-section-title">
          {copy.signalsTitle}
        </h2>
        <table className="report-signal-table">
          <thead>
            <tr>
              <th className="col-rank">No.</th>
              <th className="col-title">課題</th>
              <th className="col-count">該当件数</th>
              <th className="col-it">IT で解決</th>
              <th className="col-subsidy">対応補助金</th>
            </tr>
          </thead>
          <tbody>
            {top8.map((r, idx) => {
              const total = r.issue.samplingTotal ?? 0
              const size = r.issue.clusterSize ?? 0
              const percent = total > 0 ? Math.round((size / total) * 100) : 0
              const solv = r.issue.solvabilityScore
              const itMark =
                solv >= 65 ? "○" : solv >= 45 ? "△" : "×"
              const itLabel =
                solv >= 65
                  ? "可能"
                  : solv >= 45
                    ? "部分的"
                    : "業界文化の課題"
              return (
                <tr key={r.issue.id}>
                  <td className="col-rank">{idx + 1}</td>
                  <td className="col-title">{r.issue.title}</td>
                  <td className="col-count">
                    {size > 0 && total > 0 ? (
                      <>
                        <span className="count-main">
                          {size}
                          <span className="count-sep">/</span>
                          {total}
                        </span>
                        <span className="count-pct">({percent}%)</span>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="col-it">
                    <span
                      className={`it-mark it-${itMark === "○" ? "ok" : itMark === "△" ? "partial" : "ng"}`}
                    >
                      {itMark}
                    </span>
                    <span className="it-label">{itLabel}</span>
                  </td>
                  <td className="col-subsidy">
                    {r.issue.subsidyTags
                      .filter((t) => t !== "none")
                      .map((t) =>
                        t === "it-introduction"
                          ? "IT導入"
                          : t === "jizokuka"
                            ? "持続化"
                            : t === "monodzukuri"
                              ? "ものづくり"
                              : "—",
                      )
                      .join(" / ") || "—"}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <p className="report-signal-note">
          ※ 該当件数 = 同じ趣旨の発言が 1 次情報サンプル中に出現した数 ／
          IT で解決 ○ = ツール導入で対処可能、 △ = 部分的に効果あり、 × = 組織変革が必要
        </p>
      </section>

      <section className="report-offer">
        <h2 className="report-section-title">{copy.offerTitle}</h2>
        <div className="report-offer-grid">
          {copy.offers.map((o) => (
            <div key={o.num} className="report-offer-card">
              <p className="report-offer-num">{o.num}</p>
              <p className="report-offer-label">{o.label}</p>
              <p className="report-offer-body">{o.body}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="report-footer">
        <div>
          <p className="report-footer-name">井原誠斗</p>
          <p className="report-footer-role">
            {audience === "intermediary"
              ? "フロントエンドエンジニア (個人事業主・2026/6 マイクロ法人設立予定)"
              : "業務アプリ開発・補助金申請サポート (一人でやっています)"}
          </p>
        </div>
        <div className="report-footer-contact">
          <p>Web: ihara-frontend.com</p>
          <p>Mail: kanon02sky@gmail.com</p>
        </div>
      </footer>

      <style>{`
        .report-root {
          background: #ffffff;
          color: #111;
          font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif;
          max-width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          padding: 14mm 14mm 12mm;
          box-sizing: border-box;
          line-height: 1.5;
        }

        .report-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12mm;
          padding-bottom: 4mm;
          border-bottom: 2px solid #111;
          margin-bottom: 6mm;
        }
        .report-eyebrow {
          font-size: 9pt;
          letter-spacing: 0.1em;
          color: #555;
          margin: 0 0 1mm;
          text-transform: uppercase;
        }
        .report-title {
          font-size: 18pt;
          line-height: 1.3;
          font-weight: 700;
          margin: 0;
          color: #111;
        }
        .report-subtitle {
          font-size: 9pt;
          color: #555;
          margin: 2mm 0 0;
        }
        .report-meta {
          text-align: right;
          font-size: 8.5pt;
          flex-shrink: 0;
        }
        .report-meta-label {
          color: #888;
          margin: 0;
        }
        .report-meta-value {
          font-weight: 600;
          color: #111;
          margin: 0;
        }
        .report-meta-date {
          color: #555;
          margin: 1mm 0 0;
          font-variant-numeric: tabular-nums;
        }

        .report-section-title {
          font-size: 11pt;
          font-weight: 700;
          color: #111;
          margin: 0 0 3mm;
          padding-left: 2mm;
          border-left: 3px solid #111;
        }

        .report-roots {
          margin-bottom: 5mm;
        }
        .report-roots-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3mm;
        }
        .report-root-card {
          border: 1px solid #ccc;
          padding: 3mm;
          background: #fafafa;
        }
        .root-num {
          font-size: 8pt;
          color: #888;
          margin: 0 0 1mm;
          letter-spacing: 0.1em;
        }
        .root-label {
          font-size: 10pt;
          font-weight: 700;
          color: #111;
          margin: 0 0 2mm;
          line-height: 1.3;
        }
        .root-body {
          font-size: 8.5pt;
          color: #333;
          margin: 0;
          line-height: 1.5;
        }

        .report-signals {
          margin-bottom: 5mm;
        }
        .report-signal-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 8.5pt;
        }
        .report-signal-table th {
          background: #111;
          color: #fff;
          padding: 1.5mm 2mm;
          text-align: left;
          font-weight: 600;
        }
        .report-signal-table td {
          padding: 1.5mm 2mm;
          border-bottom: 1px solid #ddd;
          color: #222;
          vertical-align: middle;
        }
        .report-signal-table tr:last-child td {
          border-bottom: none;
        }
        .col-rank { width: 5%; text-align: center; font-weight: 700; }
        .col-title { width: 50%; }
        .col-count { width: 16%; text-align: center; font-variant-numeric: tabular-nums; }
        .count-main { display: inline-block; font-weight: 700; color: #111; }
        .count-sep { color: #aaa; padding: 0 1px; font-weight: 400; }
        .count-pct { display: inline-block; margin-left: 4px; color: #777; font-size: 7.5pt; }
        .col-it { width: 16%; text-align: center; }
        .it-mark { display: inline-block; font-weight: 700; font-size: 11pt; margin-right: 3px; vertical-align: middle; }
        .it-ok { color: #1a7f37; }
        .it-partial { color: #d97706; }
        .it-ng { color: #999; }
        .it-label { display: inline-block; font-size: 8pt; color: #555; vertical-align: middle; }
        .col-subsidy { width: 13%; font-size: 8pt; color: #555; text-align: center; }
        .report-signal-note {
          margin: 2mm 0 0;
          font-size: 7.5pt;
          color: #777;
          line-height: 1.4;
        }

        .report-offer {
          margin-bottom: 5mm;
        }
        .report-offer-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 3mm;
        }
        .report-offer-card {
          border: 1px solid #111;
          padding: 3mm;
        }
        .report-offer-num {
          font-size: 14pt;
          font-weight: 700;
          color: #111;
          margin: 0 0 1mm;
        }
        .report-offer-label {
          font-size: 10pt;
          font-weight: 700;
          color: #111;
          margin: 0 0 1.5mm;
          line-height: 1.3;
        }
        .report-offer-body {
          font-size: 8.5pt;
          color: #333;
          margin: 0;
          line-height: 1.5;
        }

        .report-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          padding-top: 3mm;
          border-top: 1px solid #111;
          font-size: 8.5pt;
        }
        .report-footer-name {
          font-weight: 700;
          font-size: 10pt;
          margin: 0 0 1mm;
        }
        .report-footer-role {
          color: #555;
          margin: 0;
        }
        .report-footer-contact {
          text-align: right;
          color: #333;
        }
        .report-footer-contact p { margin: 0.5mm 0; }

        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          html, body {
            background: #fff !important;
            color: #111 !important;
          }
          /* portfolio の親レイアウト (#06010f bg) を上書き */
          .report-root {
            padding: 12mm 14mm 10mm;
            max-width: 100%;
            min-height: auto;
          }
          /* 改ページしない */
          .report-roots,
          .report-signals,
          .report-offer {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </div>
  )
}

function RootCard({
  num,
  label,
  body,
}: {
  num: string
  label: string
  body: string
}) {
  return (
    <div className="report-root-card">
      <p className="root-num">// {num}</p>
      <p className="root-label">{label}</p>
      <p className="root-body">{body}</p>
    </div>
  )
}
