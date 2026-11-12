import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import {
  Activity, TrendingUp, Zap, Shield,
} from "lucide-react"
import { KpiSection } from "@/components/admin/dashboard/kpi-section"
import { ActivityChartSection } from "@/components/admin/dashboard/activity-chart-section"
import { RetentionSection } from "@/components/admin/dashboard/retention-section"
import { ProfileDistributionSection } from "@/components/admin/dashboard/profile-distribution-section"
import { UsersMissionsGrid } from "@/components/admin/dashboard/users-missions-grid"
import { FunnelSection } from "@/components/admin/dashboard/funnel-section"
import { LiveFeedSection } from "@/components/admin/dashboard/live-feed-section"
import { AdminRoleBanner } from "@/components/admin/dashboard/admin-role-banner"

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userRole = session?.user?.role ?? "ADMIN"

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const fourteenDaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000)
  const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000)

  const [
    userStats,
    onboardingStats,
    retentionStats,
    missionStatsData,
    weeklyData,
    activeNow,
  ] = await Promise.all([

    Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { id: true, name: true, email: true, class: true, createdAt: true, country: true, level: true },
      }),
      prisma.quizResult.groupBy({ by: ["profileType"], _count: { profileType: true } }),
    ]).then(([total, recent, byProfile]) => ({ total, recent, byProfile })),

    Promise.all([
      prisma.user.count({ where: { currentSituation: { not: null } } }),
      prisma.user.count({ where: { class: { not: null } } }),
    ]).then(([withOnboarding, withClass]) => ({ withOnboarding, withClass })),

    Promise.all([
      // Membres actifs = au moins une action journalisée (activity_log) sur la période.
      prisma.activityLog.findMany({ where: { createdAt: { gte: sevenDaysAgo }, userId: { not: null } }, distinct: ["userId"], select: { userId: true } }).then((r) => r.length),
      prisma.user.count({ where: { missionsCompletedCount: { gt: 0 } } }),
      prisma.activityLog.findMany({ where: { createdAt: { gte: thirtyDaysAgo }, userId: { not: null } }, distinct: ["userId"], select: { userId: true } }).then((r) => r.length),
      prisma.activityLog.findMany({ where: { createdAt: { gte: sixtyDaysAgo }, userId: { not: null } }, distinct: ["userId"], select: { userId: true } }).then((r) => r.length),
      prisma.activityLog.findMany({ where: { createdAt: { gte: ninetyDaysAgo }, userId: { not: null } }, distinct: ["userId"], select: { userId: true } }).then((r) => r.length),
    ]).then(([active7d, withValidatedLab, active30d, active60d, active90d]) => ({
      active7d, withValidatedLab, active30d, active60d, active90d
    })),

    Promise.all([
      prisma.mission.findMany({ select: { id: true, title: true, missionLevel: true, targetProfiles: true, _count: { select: { submissions: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
      prisma.missionSubmission.groupBy({ by: ["status"], _count: { status: true } }),
    ]).then(([stats, submissions]) => ({ stats, submissions })),

    Promise.all([
      prisma.$queryRaw<{ day: Date; count: number }[]>`
        SELECT DATE_TRUNC('day', "createdAt") as "day", COUNT(DISTINCT "userId")::int as "count"
        FROM "activity_log"
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
    ]).then(([activeRaw, usersRaw, submissionsRaw]) => {
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
        const active = activeRaw.find(r => matchDay(r.day))?.count ?? 0
        const signups = usersRaw.find(r => matchDay(r.day))?.count ?? 0
        const missions = submissionsRaw.find(r => matchDay(r.day))?.count ?? 0
        return { dayStart, active, signups, missions }
      })
    }),

    prisma.session.findMany({
      where: { expiresAt: { gte: new Date() }, createdAt: { gte: new Date(Date.now() - 15 * 60 * 1000) } },
      select: { userId: true },
    }).then(sessions => new Set(sessions.map(s => s.userId)).size),
  ])

  const { total: userCount, recent: recentUsers, byProfile: quizByProfile } = userStats
  const { withOnboarding: usersWithOnboarding, withClass: usersWithClass } = onboardingStats
  const { active7d, withValidatedLab, active30d, active60d, active90d } = retentionStats
  const { stats: missionStats, submissions: submissionStats } = missionStatsData

  const profileColors: Record<string, string> = {
    builder: "#B8FF3B",
    creator: "#A855F7",
    strategist: "#22D3EE",
    catalyst: "#F97316",
  }

  const quizTotal = quizByProfile.reduce((a, b) => a + b._count.profileType, 0)
  const approvedMissions = submissionStats.find(s => s.status === "APPROVED")?._count.status ?? 0
  const pendingMissions = submissionStats.find(s => s.status === "PENDING")?._count.status ?? 0

  const retention30 = userCount > 0 ? Math.round((active30d / userCount) * 100) : 0
  const retention60 = userCount > 0 ? Math.round((active60d / userCount) * 100) : 0
  const retention90 = userCount > 0 ? Math.round((active90d / userCount) * 100) : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <AdminRoleBanner role={userRole} />

      <KpiSection
        userCount={userCount}
        activeRecently={active7d}
        quizTotal={quizTotal}
        parcoursDemarres={usersWithOnboarding}
        projetsEnCours={pendingMissions}
        evidencesValidees={approvedMissions}
        objectifsAtteints={null}
        mentorsActifs={null}
        retention30={retention30}
        retention60={retention60}
        retention90={retention90}
      />

      <ActivityChartSection activeNow={activeNow} weeklyData={weeklyData} />

      <FunnelSection
        steps={[
          { label: "Inscrits", value: userCount, desc: "comptes créés" },
          { label: "Onboarding", value: usersWithOnboarding, desc: "situation renseignée" },
          { label: "Quiz complété", value: usersWithClass, desc: "profil CORE assigné" },
          { label: "Premier projet", value: approvedMissions + pendingMissions, desc: "mission soumise" },
          { label: "Évidence validée", value: approvedMissions, desc: "compétence prouvée" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProfileDistributionSection quizByProfile={quizByProfile} profileColors={profileColors} />
        <UsersMissionsGrid
          recentUsers={recentUsers}
          missionStats={missionStats}
          profileColors={profileColors}
        />
      </div>

      <RetentionSection
        kpis={[
          { label: "Actifs 7 derniers jours", value: active7d, icon: Activity, color: "text-primary", sub: `sur ${userCount} inscrits` },
          { label: "Taux d'activité 7j", value: `${userCount > 0 ? Math.round((active7d / userCount) * 100) : 0}%`, icon: TrendingUp, color: "text-amber-400", sub: "action dans les 7 jours" },
          { label: "Ont validé un lab", value: withValidatedLab, icon: Zap, color: "text-violet-400", sub: `sur ${userCount} inscrits` },
          { label: "Rétention J30", value: `${retention30}%`, icon: Shield, color: retention30 >= 70 ? "text-emerald-400" : "text-amber-400", sub: "30 jours" },
        ]}
      />

      {userRole === "ADMIN" && <LiveFeedSection />}
    </div>
  )
}
