import { redis } from "./ratelimit";
import { prisma } from "./prisma";

const CACHE_TTL = 300; // 5 minutes (en secondes)

export async function getCachedUser(userId: string) {
  const cacheKey = `user:profile:${userId}`;
  
  if (!redis) {
    return prisma.user.findUnique({
      where: { id: userId },
      include: {
        psychometrics: true,
        socials: true,
        stats: true,
      }
    });
  }

  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      if (typeof cached === "string") {
        return JSON.parse(cached);
      }
      return cached;
    }
  } catch (err) {
    console.error("🟢 [Cache User] Redis read error, falling back to database:", err);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      psychometrics: true,
      socials: true,
      stats: true,
    }
  });

  if (user && redis) {
    try {
      await redis.set(cacheKey, JSON.stringify(user), { ex: CACHE_TTL });
    } catch (err) {
      console.error("🟢 [Cache User] Redis write error:", err);
    }
  }

  return user;
}

export async function invalidateUserCache(userId: string) {
  if (!redis) return;
  const cacheKey = `user:profile:${userId}`;
  try {
    await redis.del(cacheKey);
  } catch (err) {
    console.error(`🟢 [Cache User] Redis invalidate error for user ${userId}:`, err);
  }
}
