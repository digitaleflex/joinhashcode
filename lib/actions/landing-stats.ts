import { prisma } from "@/lib/prisma"
import { unstable_cache } from "next/cache"

export interface LandingStats {
  totalMembers: number        // Avec l'offset symbolique
  realUserCount: number       // Nombre réel en base
  activeSquads: number
  missionsCompleted: number
  recentActivities: Array<{
    id: string
    user: {
      name: string
      city: string | null
      class: string | null
    }
    action: string
    createdAt: Date
  }>
}

/**
 * Récupère toutes les statistiques en parallèle (Promise.all).
 * Cachée par Next.js via unstable_cache (revalidation toutes les 5 minutes).
 * ⚡ Perf: 6 requêtes DB séquentielles → 1 appel cache / 5 min en production.
 */
const fetchLandingStats = async (): Promise<LandingStats> => {
  try {
    // Toutes les requêtes en parallèle — pas de waterfall
    const [
      memberCount,
      totalCount,
      activeSquads,
      missionsCompleted,
      logs,
    ] = await Promise.all([
      prisma.user.count({
        where: { role: "MEMBER", banned: { not: true } },
      }),
      prisma.user.count(),
      prisma.organization.count(),
      prisma.missionSubmission.count({ where: { status: "APPROVED" } }),
      prisma.activityLog.findMany({
        where: {
          action: { in: ["USER_SIGNUP", "QUIZ_COMPLETED", "MISSION_APPROVED", "SQUAD_JOINED"] },
          userId: { not: null },
        },
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, city: true, class: true } },
        },
      }),
    ])

    const recentActivities = logs.map((log) => ({
      id: log.id,
      user: {
        name: log.user?.name || "Anonyme",
        city: log.user?.city || "Afrique",
        class: log.user?.class || "Builder",
      },
      action: log.action,
      createdAt: log.createdAt,
    }))

    return {
      totalMembers: memberCount,
      realUserCount: totalCount,
      activeSquads,
      missionsCompleted,
      recentActivities,
    }
  } catch (error: unknown) {
    // Silent during Next.js build phase (no DB available)
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      console.error("[GET_LANDING_STATS_ERROR]", {
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      })
    }
    return {
      totalMembers: 0,
      realUserCount: 0,
      activeSquads: 0,
      missionsCompleted: 0,
      recentActivities: [],
    }
  }
}

/**
 * Export cachée — un seul hit DB toutes les 5 minutes quelle que soit la charge.
 * Tag "landing-stats" pour invalidation manuelle via revalidateTag().
 */
export const getLandingStats = unstable_cache(
  fetchLandingStats,
  ["landing-stats"],
  { revalidate: 300, tags: ["landing-stats"] }
)
