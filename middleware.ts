import { NextResponse, type NextRequest } from "next/server"

// /lab/tools/issue-finder は masatoman 自身用ツール。
// 本番 (Vercel production) では public access をブロックし、 dev / preview では通す。
// 集めた 1 次情報の引用を著作権・利用規約のグレーから守るため意図的に閉じる。

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const isProd = process.env.VERCEL_ENV === "production"

  // issue-finder ツールページ + 関連 API を本番で 404
  if (
    pathname === "/lab/tools/issue-finder" ||
    pathname.startsWith("/lab/tools/issue-finder/") ||
    pathname.startsWith("/api/lab-tools/issue-finder")
  ) {
    if (isProd) {
      // process-job だけは INTERNAL_KEY を持つ SKILL 経由で叩けるようにする例外
      if (
        pathname === "/api/lab-tools/issue-finder/process-job" &&
        req.headers.get("x-internal-key") === process.env.ISSUE_FINDER_INTERNAL_KEY
      ) {
        return NextResponse.next()
      }
      return new NextResponse("Not Found", { status: 404 })
    }
  }

  // demo-gallery results (集計ページ) を本番で 404
  // 投票者の個人情報 (名前・コメント) が含まれるため、 本番公開しない
  if (pathname === "/demo-gallery/results" || pathname.startsWith("/demo-gallery/results/")) {
    if (isProd) {
      return new NextResponse("Not Found", { status: 404 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/lab/tools/issue-finder/:path*",
    "/api/lab-tools/issue-finder/:path*",
    "/demo-gallery/results/:path*",
  ],
}
