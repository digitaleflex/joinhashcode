/**
 * Simple In-memory cache for HASHCODE.
 * For production with multiple containers, replace this with Redis.
 */

type CacheEntry = {
  data: any;
  expires: number;
};

const cache = new Map<string, CacheEntry>();

export function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  
  return entry.data as T;
}

export function setCache(key: string, data: any, ttlSeconds: number = 60) {
  cache.set(key, {
    data,
    expires: Date.now() + (ttlSeconds * 1000),
  });
}

