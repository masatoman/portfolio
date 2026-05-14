/**
 * In-memory IP-based rate limiter for AI-cost protection.
 *
 * 注意: Vercel (serverless) では各リクエストが別インスタンスに行くため、
 *      正確な分散 rate limit にはならない (緩い保険レベル)。
 *      正確に締めたい場合は Vercel KV / Upstash Redis に置き換えること。
 */

type Bucket = { count: number; resetAt: number }

const buckets = new Map<string, Bucket>()
const MAX_BUCKETS = 5000  // メモリ膨張防止 (簡易 LRU)

const WINDOW_MS = Number(process.env.AI_RATE_LIMIT_WINDOW_MS ?? 60 * 60 * 1000)
const LIMIT_PER_WINDOW = Number(process.env.AI_RATE_LIMIT_MAX ?? 30)

export type RateLimitResult =
  | { ok: true; remaining: number; resetAt: number }
  | { ok: false; retryAfter: number; resetAt: number }

export function checkRateLimit(req: Request): RateLimitResult {
  const ip = getClientIp(req)
  const now = Date.now()

  evictExpired(now)

  const bucket = buckets.get(ip)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return { ok: true, remaining: LIMIT_PER_WINDOW - 1, resetAt: now + WINDOW_MS }
  }

  if (bucket.count >= LIMIT_PER_WINDOW) {
    return {
      ok: false,
      retryAfter: Math.ceil((bucket.resetAt - now) / 1000),
      resetAt: bucket.resetAt,
    }
  }

  bucket.count++
  return {
    ok: true,
    remaining: LIMIT_PER_WINDOW - bucket.count,
    resetAt: bucket.resetAt,
  }
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for")
  if (xff) {
    const first = xff.split(",")[0]?.trim()
    if (first) return first
  }
  const realIp = req.headers.get("x-real-ip")
  if (realIp) return realIp
  return "unknown"
}

function evictExpired(now: number) {
  // 古いバケットを掃除。 巨大化したら一括で削る
  if (buckets.size < MAX_BUCKETS) {
    // 軽い掃除: スキャンしてもパフォーマンス的に許容できる範囲内なので skip
    return
  }
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k)
  }
  // それでも溢れていれば、 古い順に半分削除
  if (buckets.size >= MAX_BUCKETS) {
    const entries = Array.from(buckets.entries()).sort(
      (a, b) => a[1].resetAt - b[1].resetAt,
    )
    for (let i = 0; i < entries.length / 2; i++) {
      buckets.delete(entries[i][0])
    }
  }
}

/**
 * 失敗時に返す 429 レスポンスを構築するヘルパ。
 */
export function rateLimitResponse(rl: Extract<RateLimitResult, { ok: false }>): Response {
  return new Response(
    JSON.stringify({
      error: "rate_limit_exceeded",
      message: `この API は IP ごとに 1 時間 ${LIMIT_PER_WINDOW} 回までです。 ${rl.retryAfter} 秒後に再試行してください。`,
      retryAfter: rl.retryAfter,
    }),
    {
      status: 429,
      headers: {
        "content-type": "application/json",
        "retry-after": String(rl.retryAfter),
        "x-ratelimit-reset": String(rl.resetAt),
      },
    },
  )
}
