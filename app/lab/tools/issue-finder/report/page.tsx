import { fetchRecentIssues } from "@/lib/lab-tools/issue-finder/db"
import { SAMPLE_ISSUES } from "@/lib/lab-tools/issue-finder/sample-data"
import { ReportContent } from "@/components/lab-tools/issue-finder/report-content"

// 商談用ペライチレポート. ビジネス調・印刷可・A4 縦 1 枚.
// Web 表示でも見られるが、 主な用途は Cmd+P → PDF 化 → 商談時に配布.
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function IssueFinderReportPage() {
  const dbIssues = await fetchRecentIssues(50)
  const issues = dbIssues.length > 0 ? dbIssues : SAMPLE_ISSUES
  const generatedDate = new Date().toISOString().slice(0, 10)

  return (
    <main className="report-page">
      <div className="print-hint">
        <span>// 商談用ペライチ (A4 縦 1 枚)</span>
        <span>
          Cmd+P → 「PDF として保存」で配布用 PDF 化 ／ background graphics ON 推奨
        </span>
      </div>
      <ReportContent issues={issues} generatedDate={generatedDate} />

      <style>{`
        /* portfolio の Y2K 黒背景を上書きして白に */
        .report-page {
          min-height: 100vh;
          background: #e8e8e8;
          padding: 20px 0;
        }
        .print-hint {
          max-width: 210mm;
          margin: 0 auto 16px;
          padding: 8px 14px;
          background: #fff8dc;
          border: 1px solid #d4af37;
          font-family: monospace;
          font-size: 11px;
          color: #5a4a00;
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        @media print {
          .report-page {
            background: #fff !important;
            padding: 0 !important;
          }
          .print-hint {
            display: none !important;
          }
        }
      `}</style>
    </main>
  )
}
