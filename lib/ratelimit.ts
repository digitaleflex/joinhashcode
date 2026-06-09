import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Supports both Upstash standard names and Vercel KV aliased names
const restUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const restToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const configured = !!restUrl && !!restToken

function makeRatelimit(tokens: number, window: `${number} s` | `${number} m` | `${number} h`) {
  if (!configured) return null
  return new Ratelimit({
    redis: new Redis({ url: restUrl!, token: restToken! }),
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: false,
  })
}

// 5 check-ins per user per 24h (game mechanic: once per day anyway)
export const checkinLimiter = makeRatelimit(5, "24 h")

// 10 claims per user per hour
export const claimLimiter = makeRatelimit(10, "1 h")

// 5 squad joins per user per hour
export const squadJoinLimiter = makeRatelimit(5, "1 h")

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ limited: boolean; reset?: number }> {
  if (!limiter) return { limited: false }
  const { success, reset } = await limiter.limit(identifier)
  return { limited: !success, reset }
}
