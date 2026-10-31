import { prisma } from "@/lib/prisma"

/**
 * Public vitrine data — READ ONLY, explicit allowlists.
 * Never reuse a private API to feed the showcase.
 * Every number/card must map to a real row; empty → honest empty state.
 * Every query is DB-failure safe (try/catch → default) so `next build`
 * never crashes when the database is unreachable (EAI_AGAIN).
 */

async function safe<T>(fallback: T, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn()
  } catch {
    return fallback
  }
}

export async function getPublicStats() {
  const [totalMembers, approvedSubmissions, publishedCourses] = await Promise.all([
    safe<number | null>(null, () => prisma.user.count({ where: { role: "MEMBER", banned: { not: true } } })),
    safe<number | null>(null, () => prisma.missionSubmission.count({ where: { status: "APPROVED" } })),
    safe<number | null>(null, () => prisma.course.count({ where: { isPublished: true } })),
  ])
  return { totalMembers, approvedSubmissions, publishedCourses }
}

const MISSION_PUBLIC_SELECT = {
  id: true,
  title: true,
  shortDesc: true,
  description: true,
  slug: true,
  category: true,
  difficulty: true,
  xp: true,
  duration: true,
  missionLevel: true,
  targetProfiles: true,
  isWeeklyChallenge: true,
} as const

export async function getPublishedMissions() {
  return safe([], () =>
    prisma.mission.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: MISSION_PUBLIC_SELECT,
      orderBy: [{ isWeeklyChallenge: "asc" }, { createdAt: "desc" }],
      take: 50,
    })
  )
}

export async function getActiveAteliers() {
  return safe([], () =>
    prisma.atelier.findMany({
      where: { isActive: true },
      select: {
        id: true,
        title: true,
        description: true,
        duration: true,
        icon: true,
        category: true,
        profile: true,
        specializationLabel: true,
        xpReward: true,
      },
      orderBy: { order: "asc" },
      take: 50,
    })
  )
}

export async function getPublishedInterventions() {
  return safe([], () =>
    prisma.intervention.findMany({
      where: { status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        description: true,
        date: true,
        duration: true,
        speaker: true,
        location: true,
        locationUrl: true,
        recordingUrl: true,
      },
      orderBy: { date: "desc" },
      take: 6,
    })
  )
}

const TALENT_PUBLIC_SELECT = {
  pseudo: true,
  class: true,
  country: true,
  city: true,
  bio: true,
  tools: true,
  level: true,
  missionsCompletedCount: true,
} as const

export async function getPublicTalentsPreview(take = 6) {
  return safe([], () =>
    prisma.user.findMany({
      where: {
        class: { not: null },
        pseudo: { not: null },
        talentVisible: true,
        missionsCompletedCount: { gte: 1 },
        OR: [{ banned: { not: true } }, { banned: null }],
      },
      select: TALENT_PUBLIC_SELECT,
      orderBy: [{ missionsCompletedCount: "desc" }, { level: "desc" }],
      take,
    })
  )
}
