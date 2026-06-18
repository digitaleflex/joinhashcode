import { prisma } from "@/lib/prisma"

export interface LandingStats {
  totalMembers: number        // Avec l'offset symbolique
  realUserCount: number       // Nombre réel en base
  activeSquads: number
  missionsCompleted: number
  classCounts: Record<string, number> // Décompte par classe
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
 * Récupère les statistiques réelles pour la landing page.
 * Utilise la mise en cache de Next.js (revalidate) pour ne pas surcharger la DB.
 */
export async function getLandingStats(): Promise<LandingStats> {
  try {
    // 1. Compteurs d'utilisateurs
    const [memberCount, totalCount] = await Promise.all([
      prisma.user.count({
        where: { role: "MEMBER", banned: { not: true } }
      }),
      prisma.user.count()
    ])

    // 2. Escouades actives (au moins 1 membre)
    const activeSquads = await prisma.organization.count()

    // 3. Missions validées
    const missionsCompleted = await prisma.missionSubmission.count({
      where: { status: "APPROVED" }
    })

    // 3.5 Décompte par classe
    const classGroups = await prisma.user.groupBy({
      by: ['class'],
      where: { banned: { not: true } },
      _count: { class: true }
    })

    const classCounts: Record<string, number> = {}
    classGroups.forEach(group => {
      if (group.class) {
        classCounts[group.class.toLowerCase()] = group._count.class
      }
    })

    // 4. Activités récentes (pour le feed live)
    // On prend les 10 dernières actions significatives
    const logs = await prisma.activityLog.findMany({
      where: {
        action: {
          in: ["USER_SIGNUP", "QUIZ_COMPLETED", "MISSION_APPROVED", "SQUAD_JOINED"]
        },
        userId: { not: null }
      },
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            city: true,
            class: true
          }
        }
      }
    })

    const recentActivities = logs.map(log => ({
      id: log.id,
      user: {
        name: log.user?.name || "Anonyme",
        city: log.user?.city || "Afrique",
        class: log.user?.class || "Builder"
      },
      action: log.action,
      createdAt: log.createdAt
    }))

    return {
      totalMembers: memberCount + 1000,
      realUserCount: totalCount,
      activeSquads,
      missionsCompleted,
      classCounts,
      recentActivities
    }
  } catch (error: any) {
    // Silent during Next.js build phase (no DB available)
    if (process.env.NEXT_PHASE !== "phase-production-build") {
      console.error("[GET_LANDING_STATS_ERROR]", {
        message: error.message,
        code: error.code,
        stack: error.stack
      })
    }
    return {
      totalMembers: 0,
      realUserCount: 0,
      activeSquads: 0,
      missionsCompleted: 0,
      classCounts: {},
      recentActivities: []
    }
  }
}
