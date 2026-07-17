import { prisma } from "@/lib/prisma"
import { formatYYYYMMDD } from "@/lib/dates"

export interface UxPollStats {
  total: number
  darkMode: { yes: number; no: number }
  modernity: {
    average: number
    min: number
    max: number
    distribution: Record<number, number>
  }
  issues: {
    text: string | null
    date: Date
    user: { name: string; email: string } | null
  }[]
  dailyTrend: { date: string; count: number }[]
}

export async function getUxPollStats(): Promise<UxPollStats> {
  const [
    total,
    darkModeCount,
    lightModeCount,
    avgRating,
    minRating,
    maxRating,
    distribution,
    recentIssues,
    rawRows,
  ] = await Promise.all([
    prisma.uXPollResponse.count(),
    prisma.uXPollResponse.count({ where: { prefersDarkMode: true } }),
    prisma.uXPollResponse.count({ where: { prefersDarkMode: false } }),
    prisma.uXPollResponse.aggregate({ _avg: { modernityRating: true } }).then(r => r._avg.modernityRating ?? 0),
    prisma.uXPollResponse.aggregate({ _min: { modernityRating: true } }).then(r => r._min.modernityRating ?? 0),
    prisma.uXPollResponse.aggregate({ _max: { modernityRating: true } }).then(r => r._max.modernityRating ?? 0),
    prisma.uXPollResponse.groupBy({ by: ["modernityRating"], _count: { modernityRating: true } }),
    prisma.uXPollResponse.findMany({
      where: { readabilityIssues: { not: null } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { readabilityIssues: true, createdAt: true, user: { select: { name: true, email: true } } },
    }),
    prisma.uXPollResponse.findMany({
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    }),
  ])

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const item of distribution) {
    ratingDistribution[item.modernityRating] = item._count.modernityRating
  }

  const counts: Record<string, number> = {}
  for (const row of rawRows) {
    const key = formatYYYYMMDD(row.createdAt)
    counts[key] = (counts[key] || 0) + 1
  }
  const dailyTrend = Object.entries(counts)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    total,
    darkMode: { yes: darkModeCount, no: lightModeCount },
    modernity: {
      average: Number(avgRating.toFixed(2)),
      min: minRating,
      max: maxRating,
      distribution: ratingDistribution,
    },
    issues: recentIssues
      .filter(i => i.readabilityIssues && i.readabilityIssues.trim().length > 0)
      .map(i => ({
        text: i.readabilityIssues,
        date: i.createdAt,
        user: i.user,
      })),
    dailyTrend,
  }
}
