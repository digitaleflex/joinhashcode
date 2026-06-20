import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// Supports both Upstash standard names and Vercel KV aliased names
const restUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL
const restToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN
const configured = !!restUrl && !!restToken

// Shared Redis client — exported for auth.ts secondaryStorage (SEC-011)
export const redis = configured ? new Redis({ url: restUrl!, token: restToken! }) : null

// Fix SEC-005: Fail closed in production if rate limiting is not configured
// Skip during Next.js build phase (no runtime env vars available)
if (!configured && process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
  console.error("❌ [CRITICAL] UPSTASH_REDIS_REST_URL or TOKEN missing in production. Rate limiting is REQUIRED.");
}

function makeRatelimit(tokens: number, window: `${number} s` | `${number} m` | `${number} h`) {
  if (!configured || !redis) return null
  return new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(tokens, window),
    analytics: false,
  })
}

/**
 * Standard limiters
 */

// 5 check-ins per user per 24h (game mechanic: once per day anyway)
export const checkinLimiter = makeRatelimit(5, "24 h")

// 10 claims per user per hour
export const claimLimiter = makeRatelimit(10, "1 h")

// 5 squad joins per user per hour
export const squadJoinLimiter = makeRatelimit(5, "1 h")

// Default limiter for generic mutations (POST/PATCH/DELETE)
// 30 requests per minute per user/IP
export const mutationLimiter = makeRatelimit(30, "1 m")

// Strict limiter for sensitive operations (squad creation, etc.)
// 5 requests per hour
export const strictMutationLimiter = makeRatelimit(5, "1 h")

export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<{ limited: boolean; reset?: number }> {
  if (!limiter) {
    // Fix SEC-005: If limiter is null (not configured), block in production, allow in dev.
    if (process.env.NODE_ENV === "production") {
      console.warn(`[SECURITY] Blocking request for ${identifier} because rate limiter is not configured.`);
      return { limited: true };
    }
    return { limited: false };
  }
  
  try {
    const { success, reset } = await limiter.limit(identifier)
    return { limited: !success, reset }
  } catch (error: unknown) {
    console.error("[RATELIMIT_ERROR]", error);
    // Fail closed on Redis error in production
    return { limited: process.env.NODE_ENV === "production" };
  }
}
