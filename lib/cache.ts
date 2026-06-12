import { redis } from "./ratelimit"

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) return null
  try {
    const val = await redis.get(key)
    if (val === null || val === undefined) return null
    return (typeof val === "string" ? JSON.parse(val) : val) as T
  } catch {
    return null
  }
}

export async function setCache(key: string, data: any, ttlSeconds = 60): Promise<void> {
  if (!redis) return
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds })
  } catch {}
}
