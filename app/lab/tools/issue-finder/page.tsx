import { IssueFinderShell } from "@/components/lab-tools/issue-finder/issue-finder-shell"
import {
  fetchPerspectiveRunStatus,
  fetchRecentIssues,
  fetchRecentJobs,
} from "@/lib/lab-tools/issue-finder/db"

// Server Component: Supabase 未設定なら fetchRecent* は空配列を返すので落ちない.
// 動的レンダリング (ジョブの最新状態を毎リクエストで取得).
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function IssueFinderPage() {
  const [dbIssues, jobs, perspectiveStatus] = await Promise.all([
    fetchRecentIssues(300),
    fetchRecentJobs(20),
    fetchPerspectiveRunStatus(),
  ])
  return (
    <IssueFinderShell
      dbIssues={dbIssues}
      jobs={jobs}
      perspectiveStatus={perspectiveStatus}
    />
  )
}
