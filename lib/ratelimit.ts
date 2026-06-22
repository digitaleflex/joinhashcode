/**
 * Rate Limiter — in-process memory implementation.
 * Suffisant jusqu'à plusieurs milliers d'utilisateurs.
 * Remplace l'ancien système Upstash/Redis (fail-closed problématique).
 */

interface RateLimiter {
  check(identifier: string): Promise<{ success: boolean; reset: number }>
}

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

function windowMs(value: `${number} s` | `${number} m` | `${number} h`): number {
  const [num, unit] = value.split(" ") as [string, string]
  const n = parseInt(num, 10)
  if (unit === "s") return n * 1000
  if (unit === "m") return n * 60 * 1000
  if (unit === "h") return n * 60 * 60 * 1000
  return n * 1000
}

function makeLimiter(tokens: number, window: `${number} s` | `${number} m` | `${number} h`): MemoryLimiter {
  return new MemoryLimiter(tokens, windowMs(window))
}

// 5 check-ins per user per 24h (game mechanic: once per day anyway)
export const checkinLimiter = makeLimiter(5, "24 h")

// 10 claims per user per hour
export const claimLimiter = makeLimiter(10, "1 h")

// 5 squad joins per user per hour
export const squadJoinLimiter = makeLimiter(5, "1 h")

// Default limiter for generic mutations (POST/PATCH/DELETE)
// 30 requests per minute per user/IP
export const mutationLimiter = makeLimiter(30, "1 m")

// Strict limiter for sensitive operations (squad creation, etc.)
// 5 requests per hour
export const strictMutationLimiter = makeLimiter(5, "1 h")

// Redis client exporté pour compatibilité ascendante (auth.ts secondaryStorage)
// Peut être supprimé quand auth.ts n'en a plus besoin
export const redis = null

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
