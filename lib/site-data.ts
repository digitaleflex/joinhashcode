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
  deliverables: true,
  course: {
    select: { slug: true, title: true },
  },
} as const

export async function getPublishedMissions() {
  return safe([], () =>
    prisma.mission.findMany({
      where: { status: "PUBLISHED", deletedAt: null },
      select: MISSION_PUBLIC_SELECT,
      orderBy: [{ isWeeklyChallenge: "asc" }, { createdAt: "desc" }],
      take: 100,
    })
  )
}

export interface CourseGroup<T> {
  course: { slug: string; title: string } | null
  missions: T[]
}

/**
 * Regroupe des missions par cours d'appartenance (contexte d'abord, jamais
 * de liste à plat). Les missions sans cours vont dans un groupe orphelin en
 * fin de liste. Ordre des cours : slug croissant (hef-000, hef-010, …).
 * Fonction pure → testée unitairement.
 */
export function groupMissionsByCourse<
  T extends { course: { slug: string; title: string } | null },
>(missions: T[]): CourseGroup<T>[] {
  const groups = new Map<string, CourseGroup<T>>()
  const orphans: T[] = []

  for (const mission of missions) {
    if (!mission.course) {
      orphans.push(mission)
      continue
    }
    const existing = groups.get(mission.course.slug)
    if (existing) {
      existing.missions.push(mission)
    } else {
      groups.set(mission.course.slug, {
        course: { slug: mission.course.slug, title: mission.course.title },
        missions: [mission],
      })
    }
  }

  const ordered = [...groups.values()].sort((a, b) =>
    (a.course?.slug ?? "").localeCompare(b.course?.slug ?? ""),
  )
  if (orphans.length > 0) {
    ordered.push({ course: null, missions: orphans })
  }
  return ordered
}

export interface LevelGroup<T> {
  level: string | null
  label: string
  missions: T[]
}

const LEVEL_ORDER = ["INIT", "CORE", "PRO"] as const

const LEVEL_LABELS: Record<string, string> = {
  INIT: "Initiation",
  CORE: "Cœur du parcours",
  PRO: "Niveau pro",
}

/**
 * Regroupe des missions par niveau (INIT → CORE → PRO, sans niveau en fin).
 * Fonction pure → testée unitairement.
 */
export function groupMissionsByLevel<T extends { missionLevel: string | null }>(
  missions: T[],
): LevelGroup<T>[] {
  const groups = new Map<string | null, T[]>()
  for (const mission of missions) {
    const list = groups.get(mission.missionLevel)
    if (list) {
      list.push(mission)
    } else {
      groups.set(mission.missionLevel, [mission])
    }
  }

  const ordered: LevelGroup<T>[] = []
  for (const level of LEVEL_ORDER) {
    const list = groups.get(level)
    if (list && list.length > 0) {
      ordered.push({ level, label: LEVEL_LABELS[level], missions: list })
      groups.delete(level)
    }
  }
  const rest = [...groups.entries()].sort(([a], [b]) => (a ?? "zzz").localeCompare(b ?? "zzz"))
  for (const [level, list] of rest) {
    ordered.push({ level, label: level ?? "Sans niveau", missions: list })
  }
  return ordered
}

/**
 * Tri compacte : par cours puis par titre. Fonction pure → testée unitairement.
 */
export function sortMissionsForCompactView<
  T extends { title: string; course: { slug: string; title: string } | null },
>(missions: T[]): T[] {
  return [...missions].sort(
    (a, b) =>
      (a.course?.slug ?? "zzz").localeCompare(b.course?.slug ?? "zzz") ||
      a.title.localeCompare(b.title),
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
