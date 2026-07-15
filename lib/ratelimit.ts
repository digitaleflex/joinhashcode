/**
 * Rate Limiter — Redis-backed with Upstash SDK.
 * Falls back to in-memory if Redis is unavailable.
 */

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

interface RateLimiter {
  check(identifier: string): Promise<{ success: boolean; reset: number }>
}

// ── Redis client (connects to SRH proxy or Upstash cloud) ────────────────────
const redisUrl = process.env.REDIS_URL
const redisToken = process.env.REDIS_TOKEN

export const redis: Redis | null = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null

// ── Fallback: in-memory limiter (used when Redis is unavailable) ─────────────
class MemoryLimiter implements RateLimiter {
  private store = new Map<string, { count: number; resetAt: number }>()
  private readonly maxTokens: number
  private readonly windowMs: number

  constructor(maxTokens: number, windowMs: number) {
    this.maxTokens = maxTokens
    this.windowMs = windowMs
  }

  async check(identifier: string): Promise<{ success: boolean; reset: number }> {
    const now = Date.now()
    const entry = this.store.get(identifier)

    if (!entry || now > entry.resetAt) {
      this.store.set(identifier, { count: 1, resetAt: now + this.windowMs })
      return { success: true, reset: now + this.windowMs }
    }

    if (entry.count >= this.maxTokens) {
      return { success: false, reset: entry.resetAt }
    }

    entry.count++
    return { success: true, reset: entry.resetAt }
  }
}

// ── Upstash Ratelimit wrapper ────────────────────────────────────────────────
class UpstashLimiter implements RateLimiter {
  private ratelimit: Ratelimit

  constructor(maxTokens: number, windowSec: number) {
    this.ratelimit = new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(maxTokens, `${windowSec}s`),
      analytics: false,
    })
  }

  async check(identifier: string): Promise<{ success: boolean; reset: number }> {
    const result = await this.ratelimit.limit(identifier)
    return { success: result.success, reset: result.reset }
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function parseWindow(value: `${number} s` | `${number} m` | `${number} h`): number {
  const [num, unit] = value.split(" ") as [string, string]
  const n = parseInt(num, 10)
  if (unit === "s") return n
  if (unit === "m") return n * 60
  if (unit === "h") return n * 3600
  return n
}

function makeLimiter(tokens: number, window: `${number} s` | `${number} m` | `${number} h`): RateLimiter {
  if (redis) {
    return new UpstashLimiter(tokens, parseWindow(window))
  }
  // Fallback to in-memory when Redis is unavailable
  const windowMs =
    window.endsWith("s") ? parseInt(window) * 1000 :
    window.endsWith("m") ? parseInt(window) * 60 * 1000 :
    parseInt(window) * 3600 * 1000
  return new MemoryLimiter(tokens, windowMs)
}

// ── Exported limiters ────────────────────────────────────────────────────────

// 5 check-ins per user per 24h
export const checkinLimiter = makeLimiter(5, "24 h")

// 10 claims per user per hour
export const claimLimiter = makeLimiter(10, "1 h")

// 5 squad joins per user per hour
export const squadJoinLimiter = makeLimiter(5, "1 h")

// 30 requests per minute per user/IP
export const mutationLimiter = makeLimiter(30, "1 m")

// 5 requests per hour (sensitive ops)
export const strictMutationLimiter = makeLimiter(5, "1 h")

export async function checkRateLimit(
  limiter: RateLimiter | null,
  identifier: string
): Promise<{ limited: boolean; reset?: number }> {
  if (!limiter) return { limited: false }

  try {
    const { success, reset } = await limiter.check(identifier)
    return { limited: !success, reset }
  } catch {
    // Fail open: si le rate limiter plante, on laisse passer
    return { limited: false }
  }
}
