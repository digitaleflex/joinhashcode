import { prisma } from "@/lib/prisma"
import { Users, Zap, BarChart2, TrendingUp, Filter, Activity, Shield, Crosshair, Gift, Fingerprint, Share2, MapPin } from "lucide-react"
import Link from "next/link"
import { AdminLiveFeed } from "@/components/admin/AdminLiveFeed"

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
    fraudStats,
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

    // 7. Sécurité & Fraude
    Promise.all([
      prisma.fraudEvent.count(),
      prisma.user.count({ where: { security: { fraudRiskScore: { gte: 30 } } } }),
      prisma.user.count({ where: { visitorId: { not: null } } }),
    ]).then(([fraudEventCount, flaggedUsers, visitorIdCount]) => ({ fraudEventCount, flaggedUsers, visitorIdCount })),

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
  const { fraudEventCount, flaggedUsers, visitorIdCount } = fraudStats
  const { count: passkeyCount, users: passkeyUsers } = passkeyStats
  const { prevUserCount, prevSubmissionCount, prevActiveCount } = prevPeriodStats
  const { gpsCount, gpsConsentCount } = gpsStats

  const profileColors: Record<string, string> = {
    builder: "#B8FF3B",
    creator: "#A855F7",
    strategist: "#22D3EE",
    catalyst: "#F97316",
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white">Vue d&apos;ensemble</h1>
        <p className="text-sm text-muted-foreground font-mono">
          Vue d&apos;ensemble de l&apos;activité et des indicateurs de performance.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Membres total", value: userCount, prev: prevUserCount, icon: Users, color: "text-primary" },
          { label: "Profils quizés", value: quizByProfile.reduce((a, b) => a + b._count.profileType, 0), icon: BarChart2, color: "text-[#22D3EE]" },
          { label: "Missions validées", value: submissionStats.find(s => s.status === "APPROVED")?._count.status ?? 0, prev: prevSubmissionCount, icon: Zap, color: "text-[#B8FF3B]" },
          { label: "Actifs 7j", value: activeRecently, prev: prevActiveCount, icon: Activity, color: "text-[#F97316]" },
        ].map((kpi) => {
          const pctChange = kpi.prev != null && kpi.prev > 0
            ? Math.round(((kpi.value - kpi.prev) / kpi.prev) * 100)
            : null
          return (
            <div key={kpi.label} className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3 shadow-sm hover:border-white/10 transition-colors">
              <div className={`flex items-center gap-2 ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
              </div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-bold text-white tracking-tight">{kpi.value}</div>
                {pctChange !== null && (
                  <span className={`text-[10px] font-mono font-bold mb-1 ${
                    pctChange > 0 ? "text-emerald-400" : pctChange < 0 ? "text-red-400" : "text-zinc-500"
                  }`}>
                    {pctChange > 0 ? "↑" : pctChange < 0 ? "↓" : "→"} {Math.abs(pctChange)}%
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Active Now + Weekly Chart */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="md:col-span-1 rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <Activity className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Actifs maintenant</span>
          </div>
          <div className="text-4xl font-bold text-white tracking-tight">{activeNow}</div>
          <p className="text-[10px] font-mono text-zinc-600">sessions actives &lt; 15 min</p>
        </div>
        <div className="md:col-span-3 rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <BarChart2 className="h-4 w-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Activité hebdomadaire</span>
          </div>
          <div className="flex items-end gap-2 h-28 pt-2">
            {weeklyData.map((day, i) => {
              const max = Math.max(...weeklyData.map(d => Math.max(d.checkins, d.signups, d.missions)), 1)
              const dayName = new Intl.DateTimeFormat("fr-FR", { weekday: "short" }).format(day.dayStart)
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div className="flex items-end gap-0.5 w-full justify-center">
                    <div className="w-2 rounded-t-sm bg-amber-500/70 transition-all" style={{ height: `${(day.checkins / max) * 100}%` }} title="Check-ins" />
                    <div className="w-2 rounded-t-sm bg-primary/70 transition-all" style={{ height: `${(day.signups / max) * 100}%` }} title="Inscriptions" />
                    <div className="w-2 rounded-t-sm bg-violet-500/70 transition-all" style={{ height: `${(day.missions / max) * 100}%` }} title="Missions" />
                  </div>
                  <span className="text-[8px] font-mono text-zinc-600 uppercase mt-auto">{dayName}</span>
                </div>
              )
            })}
          </div>
          <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-600">
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-amber-500/70" /> Check-ins</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-primary/70" /> Inscriptions</span>
            <span className="flex items-center gap-1"><span className="size-2 rounded-sm bg-violet-500/70" /> Missions</span>
          </div>
        </div>
      </div>

      {/* Onboarding Funnel */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Filter className="h-3 w-3" /> Funnel d&apos;acquisition
        </h2>
        <div className="space-y-3">
          {[
            { label: "Inscrits", value: userCount, desc: "comptes créés" },
            { label: "Onboarding", value: usersWithOnboarding, desc: "ont renseigné leur situation" },
            { label: "Quiz complété", value: usersWithClass, desc: "ont un profil assigné" },
            { label: "Dans une escouade", value: usersInSquad, desc: "membres actifs" },
            { label: "Missions", value: usersWithMission, desc: "ont soumis au moins une mission" },
          ].map((step, i, arr) => {
            const base = i === 0 ? userCount : arr[i - 1].value
            const dropPct = base > 0 ? Math.round(((base - step.value) / base) * 100) : 0
            const fillPct = userCount > 0 ? Math.round((step.value / userCount) * 100) : 0
            return (
              <div key={step.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-white/5 flex items-center justify-center text-[8px] text-zinc-500 shrink-0">{i + 1}</span>
                    <span className="text-zinc-300 font-bold">{step.label}</span>
                    <span className="text-zinc-600">{step.desc}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {i > 0 && dropPct > 0 && (
                      <span className="text-red-400 text-[9px]">-{dropPct}%</span>
                    )}
                    <span className="text-white font-bold tabular-nums">{step.value}</span>
                    <span className="text-zinc-600 w-8 text-right">{fillPct}%</span>
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${fillPct}%`,
                      background: fillPct >= 60 ? "#C5F441" : fillPct >= 30 ? "#F59E0B" : "#EF4444",
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Retention row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Actifs 7 derniers jours", value: activeRecently, icon: Activity, color: "text-primary", sub: `sur ${userCount} inscrits` },
          { label: "Taux d'activité 7j", value: `${userCount > 0 ? Math.round((activeRecently / userCount) * 100) : 0}%`, icon: TrendingUp, color: "text-amber-400", sub: "check-in récent" },
          { label: "Ont déjà check-iné", value: totalCheckins7d, icon: Zap, color: "text-violet-400", sub: `sur ${userCount} inscrits` },
          { label: "Cohésion moyenne", value: squadCount > 0 ? `${Math.round((squadCohesion._avg.cohesionScore ?? 0) * 100)}%` : "—", icon: Shield, color: "text-emerald-400", sub: `${squadCount} escouade${squadCount > 1 ? "s" : ""}` },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3">
            <div className={`flex items-center gap-2 ${kpi.color}`}>
              <kpi.icon className="h-4 w-4" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="text-4xl font-bold text-white tracking-tight">{kpi.value}</div>
            <p className="text-[10px] font-mono text-zinc-600">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Profile Distribution */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2"><TrendingUp className="h-3 w-3" /> Distribution des Profils</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["builder", "creator", "strategist", "catalyst"].map((p) => {
            const count = quizByProfile.find(q => q.profileType === p)?._count.profileType ?? 0
            const total = quizByProfile.reduce((a, b) => a + b._count.profileType, 0) || 1
            const pct = Math.round((count / total) * 100)
            return (
              <div key={p} className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className="capitalize" style={{ color: profileColors[p] }}>{p}</span>
                  <span className="text-muted-foreground">{count} ({pct}%)</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: profileColors[p] }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-6">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Users className="h-3 w-3" /> Derniers Membres</h2>
          <div className="space-y-4">
            {recentUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
                <div>
                  <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{u.name}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">{u.email} · {u.country ?? "—"}</p>
                </div>
                <div className="text-right">
                  {u.class ? (
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded" style={{ background: `${profileColors[u.class] ?? "#fff"}15`, color: profileColors[u.class] ?? "#fff" }}>
                      {u.class}
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-muted-foreground">—</span>
                  )}
                  <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">LVL {u.progress?.level ?? 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Activity */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-6">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Zap className="h-3 w-3" /> Activité Missions</h2>
          <div className="space-y-4">
            {missionStats.map((m) => (
              <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
                <div className="truncate pr-4">
                  <p className="text-sm font-medium text-white group-hover:text-primary transition-colors truncate">{m.title}</p>
                  <p className="text-[10px] text-muted-foreground font-mono">
                    {m.missionLevel} · {m.targetProfiles.join(", ")}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-primary">{m._count.submissions}</span>
                  <p className="text-[9px] text-muted-foreground font-mono uppercase tracking-tighter">soumissions</p>
                </div>
              </div>
            ))}
            {missionStats.length === 0 && (
              <p className="text-sm text-muted-foreground py-8 text-center font-mono text-[10px] uppercase tracking-wider">Aucune soumission active</p>
            )}
          </div>
        </div>
      </div>

      {/* Mission Drop-off by Level */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Crosshair className="h-3 w-3" /> Drop-off Missions par Niveau</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["INIT", "CORE", "PRO"].map((level) => {
            const data = submissionsByLevel[level]
            const total = data?.total ?? 0
            const approved = data?.approved ?? 0
            const pending = data?.pending ?? 0
            const rejected = data?.rejected ?? 0
            const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0
            const dropOff = total > 0 ? Math.round(((total - approved) / total) * 100) : 0
            return (
              <div key={level} className="space-y-4 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{level}</span>
                  <span className="text-[10px] font-mono text-muted-foreground">{total} soumissions</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-emerald-400">✅ Approuvées</span>
                    <span className="text-zinc-300">{approved}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-amber-400">⏳ En attente</span>
                    <span className="text-zinc-300">{pending}</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-red-400">❌ Rejetées</span>
                    <span className="text-zinc-300">{rejected}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Taux d'approbation</span>
                    <span className={approvalRate >= 60 ? "text-emerald-400" : approvalRate >= 30 ? "text-amber-400" : "text-red-400"}>{approvalRate}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${approvalRate}%`, background: approvalRate >= 60 ? "#22c55e" : approvalRate >= 30 ? "#f59e0b" : "#ef4444" }} />
                  </div>
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-zinc-500">Drop-off</span>
                    <span className="text-red-400">{dropOff}%</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Referral + Anti-Fraud + Passkey + GPS */}
      <div className="grid md:grid-cols-4 gap-6">
        {/* Parrainage */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Gift className="h-3 w-3 text-indigo-400" /> Parrainage
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-white">{referralCount}</div>
              <p className="text-[10px] font-mono text-zinc-500">Parrainages réussis</p>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Parrains actifs</span>
              <span className="text-white font-bold">{referrers}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Conversion</span>
              <span className="text-white font-bold">{userCount > 0 ? Math.round((referralCount / userCount) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* Anti-Fraud */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Fingerprint className="h-3 w-3 text-amber-400" /> Anti-Fraude
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-white">{fraudEventCount}</div>
              <p className="text-[10px] font-mono text-zinc-500">Événements de fraude</p>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Utilisateurs signalés</span>
              <span className="text-amber-400 font-bold">{flaggedUsers}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Empreintes numériques</span>
              <span className="text-white font-bold">{visitorIdCount}</span>
            </div>
          </div>
        </div>

        {/* Passkey */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Share2 className="h-3 w-3 text-emerald-400" /> Passkeys
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-white">{passkeyCount}</div>
              <p className="text-[10px] font-mono text-zinc-500">Passkeys enregistrées</p>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Utilisateurs équipés</span>
              <span className="text-white font-bold">{passkeyUsers}</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Adoption</span>
              <span className="text-emerald-400 font-bold">{userCount > 0 ? Math.round((passkeyUsers / userCount) * 100) : 0}%</span>
            </div>
          </div>
        </div>

        {/* GPS */}
        <Link href="/admin/gps" className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5 hover:border-white/10 hover:bg-zinc-900/80 transition-all group">
          <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <MapPin className="h-3 w-3 text-cyan-400" /> Données GPS
          </h2>
          <div className="space-y-4">
            <div>
              <div className="text-3xl font-bold text-white group-hover:text-primary transition-colors">{gpsCount}</div>
              <p className="text-[10px] font-mono text-zinc-500">Coordonnées collectées</p>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Consentement</span>
              <span className="text-white font-bold">{userCount > 0 ? Math.round((gpsConsentCount / userCount) * 100) : 0}%</span>
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-zinc-400">Dernière</span>
              <span className="text-white font-bold">{new Date().toLocaleDateString("fr-FR")}</span>
            </div>
          </div>
        </Link>
      </div>

      {/* Live feed */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
        <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <Activity className="h-3 w-3 text-primary" /> Activité en direct
        </h2>
        <AdminLiveFeed />
      </div>
    </div>
  )
}

