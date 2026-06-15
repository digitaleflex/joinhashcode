import { prisma } from "@/lib/prisma"
import { Users, Zap, BarChart2, FileText, TrendingUp, Filter, Activity, Shield, Crosshair, Gift, Fingerprint, Share2 } from "lucide-react"

export default async function AdminPage() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const [
    userCount,
    recentUsers,
    quizByProfile,
    missionStats,
    submissionStats,
    // Funnel
    usersWithOnboarding,
    usersWithClass,
    usersInSquad,
    usersWithMission,
    // Retention
    activeRecently,
    totalCheckins7d,
    // Squad cohesion
    squadCohesion,
    squadCount,
    // Mission drop-off by level
    submissionsByLevel,
    // Referral
    referralCount,
    referrers,
    // Anti-fraud
    fraudEventCount,
    flaggedUsers,
    visitorIdCount,
    // Passkey
    passkeyCount,
    passkeyUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, class: true, level: true, createdAt: true, country: true },
    }),
    prisma.quizResult.groupBy({ by: ["profileType"], _count: { profileType: true } }),
    prisma.mission.findMany({ select: { id: true, title: true, missionLevel: true, targetProfiles: true, _count: { select: { submissions: true } } }, orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.missionSubmission.groupBy({ by: ["status"], _count: { status: true } }),
    // Funnel steps
    prisma.user.count({ where: { currentSituation: { not: null } } }),
    prisma.user.count({ where: { class: { not: null } } }),
    prisma.member.count().then(async () => {
      const distinct = await prisma.member.findMany({ select: { userId: true }, distinct: ["userId"] })
      return distinct.length
    }),
    prisma.missionSubmission.findMany({ select: { userId: true }, distinct: ["userId"] }).then(r => r.length),
    // Retention
    prisma.user.count({ where: { stats: { lastCheckinAt: { gte: sevenDaysAgo } } } }),
    prisma.user.count({ where: { stats: { lastCheckinAt: { not: null } } } }),
    // Squad cohesion
    prisma.organization.aggregate({ _avg: { cohesionScore: true } }),
    prisma.organization.count(),
    // Mission drop-off: submissions grouped by mission level + status
    prisma.mission.findMany({
      select: {
        missionLevel: true,
        _count: { select: { submissions: true } },
        submissions: { select: { status: true } },
      },
    }).then(ms => {
      const byLevel: Record<string, { total: number; approved: number; pending: number; rejected: number }> = {}
      for (const m of ms) {
        const lvl = m.missionLevel || "INIT"
        if (!byLevel[lvl]) byLevel[lvl] = { total: 0, approved: 0, pending: 0, rejected: 0 }
        byLevel[lvl].total += m._count.submissions
        for (const s of m.submissions) {
          if (s.status === "APPROVED") byLevel[lvl].approved++
          else if (s.status === "PENDING" || s.status === "IN_REVIEW") byLevel[lvl].pending++
          else byLevel[lvl].rejected++
        }
      }
      return byLevel
    }),
    // Referral
    prisma.user.aggregate({ _sum: { referralCount: true } }).then(r => r._sum.referralCount ?? 0),
    prisma.user.count({ where: { referralCount: { gt: 0 } } }),
    // Anti-fraud
    prisma.fraudEvent.count(),
    prisma.user.count({ where: { fraudRiskScore: { gte: 30 } } }),
    prisma.user.count({ where: { visitorId: { not: null } } }),
    // Passkey
    prisma.passkey.count(),
    prisma.passkey.groupBy({ by: ["userId"], _count: { userId: true } }).then(r => r.length),
  ])

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
          { label: "Membres total", value: userCount, icon: Users, color: "text-primary" },
          { label: "Profils quizés", value: quizByProfile.reduce((a, b) => a + b._count.profileType, 0), icon: BarChart2, color: "text-[#22D3EE]" },
          { label: "Missions validées", value: submissionStats.find(s => s.status === "APPROVED")?._count.status ?? 0, icon: Zap, color: "text-[#B8FF3B]" },
          { label: "En attente", value: submissionStats.find(s => s.status === "PENDING")?._count.status ?? 0, icon: FileText, color: "text-[#F97316]" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3 shadow-sm hover:border-white/10 transition-colors">
            <div className={`flex items-center gap-2 ${kpi.color}`}>
              <kpi.icon className="h-4 w-4" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="text-4xl font-bold text-white tracking-tight">{kpi.value}</div>
          </div>
        ))}
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
                  <p className="text-[9px] text-muted-foreground/60 font-mono mt-0.5">LVL {u.level}</p>
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

      {/* Referral + Anti-Fraud + Passkey */}
      <div className="grid md:grid-cols-3 gap-6">
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
      </div>
    </div>
  )
}

