import { prisma } from "@/lib/prisma"
import { Activity, TrendingUp, Zap, Shield } from "lucide-react"
import { KpiSection } from "@/components/admin/dashboard/kpi-section"
import { ActivityChartSection } from "@/components/admin/dashboard/activity-chart-section"
import { FunnelSection } from "@/components/admin/dashboard/funnel-section"
import { RetentionSection } from "@/components/admin/dashboard/retention-section"
import { ProfileDistributionSection } from "@/components/admin/dashboard/profile-distribution-section"
import { UsersMissionsGrid } from "@/components/admin/dashboard/users-missions-grid"
import { MissionDropoffSection } from "@/components/admin/dashboard/mission-dropoff-section"
import { SecondaryStatsSection } from "@/components/admin/dashboard/secondary-stats-section"
import { LiveFeedSection } from "@/components/admin/dashboard/live-feed-section"

export default async function AdminPage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)

  // Blocs de requêtes thématiques pour éviter les limitations de tuples TS (max 25)
  const [
    userStats,
    onboardingStats,
    retentionStats,
    squadStats,
    missionStatsData,
    referralStats,
    passkeyStats,
    prevPeriodStats,
    weeklyData,
    activeNow,
    gpsStats
  ] = await Promise.all([
    // 1. Statistiques utilisateurs basiques
    Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, email: true, class: true, createdAt: true, country: true, progress: { select: { level: true } } },
      }),
      prisma.quizResult.groupBy({ by: ["profileType"], _count: { profileType: true } }),
    ]).then(([total, recent, byProfile]) => ({ total, recent, byProfile })),

    // 2. Étape du funnel onboarding
    Promise.all([
      prisma.user.count({ where: { currentSituation: { not: null } } }),
      prisma.user.count({ where: { class: { not: null } } }),
      prisma.member.count(),
      prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(DISTINCT "userId")::int as "count" FROM "mission_submission"`.then(r => r[0]?.count ?? 0),
    ]).then(([withOnboarding, withClass, inSquad, withMission]) => ({ withOnboarding, withClass, inSquad, withMission })),

    // 3. Rétention
    Promise.all([
      prisma.user.count({ where: { stats: { lastCheckinAt: { gte: sevenDaysAgo } } } }),
      prisma.user.count({ where: { stats: { lastCheckinAt: { not: null } } } }),
    ]).then(([activeRecently, totalCheckins7d]) => ({ activeRecently, totalCheckins7d })),

    // 4. Escouades
    Promise.all([
      prisma.organization.aggregate({ _avg: { cohesionScore: true } }),
      prisma.organization.count(),
    ]).then(([cohesion, count]) => ({ cohesion, count })),

    // 5. Missions & Soumissions
    Promise.all([
      prisma.mission.findMany({ select: { id: true, title: true, missionLevel: true, targetProfiles: true, _count: { select: { submissions: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
      prisma.missionSubmission.groupBy({ by: ["status"], _count: { status: true } }),
      prisma.$queryRaw<{ missionLevel: string | null; status: string; count: number }[]>`
        SELECT m."missionLevel" as "missionLevel", s."status" as "status", COUNT(s."id")::int as "count"
        FROM "mission_submission" s
        JOIN "mission" m ON s."missionId" = m."id"
        GROUP BY m."missionLevel", s."status"
      `.then(rows => {
        const byLevel: Record<string, { total: number; approved: number; pending: number; rejected: number }> = {}
        for (const row of rows) {
          const lvl = row.missionLevel || "INIT"
          if (!byLevel[lvl]) byLevel[lvl] = { total: 0, approved: 0, pending: 0, rejected: 0 }
          const count = Number(row.count)
          byLevel[lvl].total += count
          if (row.status === "APPROVED") byLevel[lvl].approved += count
          else if (row.status === "PENDING" || row.status === "IN_REVIEW") byLevel[lvl].pending += count
          else byLevel[lvl].rejected += count
        }
        return byLevel
      }),
    ]).then(([stats, submissions, byLevel]) => ({ stats, submissions, byLevel })),

    // 6. Parrainages
    Promise.all([
      prisma.userReferral.aggregate({ _sum: { referralCount: true } }).then(r => r._sum.referralCount ?? 0),
      prisma.userReferral.count({ where: { referralCount: { gt: 0 } } }),
    ]).then(([count, referrers]) => ({ count, referrers })),

    // 8. Passkeys
    Promise.all([
      prisma.passkey.count(),
      prisma.$queryRaw<{ count: number }[]>`SELECT COUNT(DISTINCT "userId")::int as "count" FROM "passkey"`.then(r => r[0]?.count ?? 0),
    ]).then(([count, users]) => ({ count, users })),

    // 9. Période précédente
    Promise.all([
      prisma.user.count({ where: { createdAt: { lt: sevenDaysAgo } } }),
      prisma.missionSubmission.count({ where: { createdAt: { lt: sevenDaysAgo } } }),
      prisma.user.count({ where: { stats: { lastCheckinAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } } }),
    ]).then(([prevUserCount, prevSubmissionCount, prevActiveCount]) => ({ prevUserCount, prevSubmissionCount, prevActiveCount })),

    // 10. Données hebdomadaires graphiques
    Promise.all([
      prisma.$queryRaw<{ day: Date; count: number }[]>`
        SELECT DATE_TRUNC('day', "createdAt") as "day", COUNT("id")::int as "count"
        FROM "daily_checkin"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY 1
      `,
      prisma.$queryRaw<{ day: Date; count: number }[]>`
        SELECT DATE_TRUNC('day', "createdAt") as "day", COUNT("id")::int as "count"
        FROM "user"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY 1
      `,
      prisma.$queryRaw<{ day: Date; count: number }[]>`
        SELECT DATE_TRUNC('day', "createdAt") as "day", COUNT("id")::int as "count"
        FROM "mission_submission"
        WHERE "createdAt" >= ${sevenDaysAgo}
        GROUP BY 1
      `,
    ]).then(([checkinsRaw, usersRaw, submissionsRaw]) => {
      return Array.from({ length: 7 }, (_, i) => {
        const dayStart = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(dayStart)
        dayEnd.setHours(23, 59, 59, 999)

        const matchDay = (date: Date) => {
          const d = new Date(date)
          return d.getFullYear() === dayStart.getFullYear() &&
                 d.getMonth() === dayStart.getMonth() &&
                 d.getDate() === dayStart.getDate()
        }

        const checkins = checkinsRaw.find(r => matchDay(r.day))?.count ?? 0
        const signups = usersRaw.find(r => matchDay(r.day))?.count ?? 0
        const missions = submissionsRaw.find(r => matchDay(r.day))?.count ?? 0

        return { dayStart, checkins, signups, missions }
      })
    }),

    // 11. Sessions actives en direct (déduplication manuelle)
    prisma.session.findMany({
      where: { expiresAt: { gte: new Date() }, createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } },
      select: { userId: true },
    }).then(sessions => new Set(sessions.map(s => s.userId)).size),

    // 12. Statistiques GPS
    Promise.all([
      prisma.userLocation.count(),
      prisma.user.count({ where: { consentLocation: true } }),
    ]).then(([gpsCount, gpsConsentCount]) => ({ gpsCount, gpsConsentCount }))
  ])

  // Variables extraites pour le rendu
  const { total: userCount, recent: recentUsers, byProfile: quizByProfile } = userStats
  const { withOnboarding: usersWithOnboarding, withClass: usersWithClass, inSquad: usersInSquad, withMission: usersWithMission } = onboardingStats
  const { activeRecently, totalCheckins7d } = retentionStats
  const { cohesion: squadCohesion, count: squadCount } = squadStats
  const { stats: missionStats, submissions: submissionStats, byLevel: submissionsByLevel } = missionStatsData
  const { count: referralCount, referrers } = referralStats
  const { count: passkeyCount, users: passkeyUsers } = passkeyStats
  const { prevUserCount, prevSubmissionCount, prevActiveCount } = prevPeriodStats
  const { gpsCount, gpsConsentCount } = gpsStats

  const profileColors: Record<string, string> = {
    builder: "#B8FF3B",
    creator: "#A855F7",
    strategist: "#22D3EE",
    catalyst: "#F97316",
  }

  const quizTotal = quizByProfile.reduce((a, b) => a + b._count.profileType, 0)
  const approvedMissions = submissionStats.find(s => s.status === "APPROVED")?._count.status ?? 0

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white">Vue d&apos;ensemble</h1>
        <p className="text-sm text-muted-foreground font-mono">
          Vue d&apos;ensemble de l&apos;activité et des indicateurs de performance.
        </p>
      </div>

      <KpiSection
        userCount={userCount}
        prevUserCount={prevUserCount}
        quizTotal={quizTotal}
        approvedMissions={approvedMissions}
        prevSubmissionCount={prevSubmissionCount}
        activeRecently={activeRecently}
        prevActiveCount={prevActiveCount}
      />

      <ActivityChartSection activeNow={activeNow} weeklyData={weeklyData} />

      <FunnelSection
        steps={[
          { label: "Inscrits", value: userCount, desc: "comptes créés" },
          { label: "Onboarding", value: usersWithOnboarding, desc: "ont renseigné leur situation" },
          { label: "Quiz complété", value: usersWithClass, desc: "ont un profil assigné" },
          { label: "Dans une escouade", value: usersInSquad, desc: "membres actifs" },
          { label: "Missions", value: usersWithMission, desc: "ont soumis au moins une mission" },
        ]}
      />

      <RetentionSection
        kpis={[
          { label: "Actifs 7 derniers jours", value: activeRecently, icon: Activity, color: "text-primary", sub: `sur ${userCount} inscrits` },
          { label: "Taux d'activité 7j", value: `${userCount > 0 ? Math.round((activeRecently / userCount) * 100) : 0}%`, icon: TrendingUp, color: "text-amber-400", sub: "check-in récent" },
          { label: "Ont déjà check-iné", value: totalCheckins7d, icon: Zap, color: "text-violet-400", sub: `sur ${userCount} inscrits` },
          { label: "Cohésion moyenne", value: squadCount > 0 ? `${Math.round((squadCohesion._avg.cohesionScore ?? 0) * 100)}%` : "—", icon: Shield, color: "text-emerald-400", sub: `${squadCount} escouade${squadCount > 1 ? "s" : ""}` },
        ]}
      />

      <ProfileDistributionSection quizByProfile={quizByProfile} profileColors={profileColors} />

      <UsersMissionsGrid
        recentUsers={recentUsers}
        missionStats={missionStats}
        profileColors={profileColors}
      />

      <MissionDropoffSection submissionsByLevel={submissionsByLevel} />

      <SecondaryStatsSection
        referralCount={referralCount}
        referrers={referrers}
        userCount={userCount}
        passkeyCount={passkeyCount}
        passkeyUsers={passkeyUsers}
        gpsCount={gpsCount}
        gpsConsentCount={gpsConsentCount}
      />

      <LiveFeedSection />
    </div>
  )
}

