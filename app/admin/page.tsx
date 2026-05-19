import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Users, Zap, BarChart2, FileText, Activity, TrendingUp } from "lucide-react"

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/signin")

  const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } })
  if (!dbUser || !["ADMIN", "MODERATOR", "OPERATOR"].includes(dbUser.role)) redirect("/dashboard")

  const [
    userCount,
    recentUsers,
    quizByProfile,
    missionStats,
    submissionStats,
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
  ])

  const profileColors: Record<string, string> = {
    builder: "#B8FF3B",
    creator: "#A855F7",
    strategist: "#22D3EE",
    catalyst: "#F97316",
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      {/* KPI Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Membres total", value: userCount, icon: Users, color: "text-primary" },
            { label: "Profils quizés", value: quizByProfile.reduce((a, b) => a + b._count.profileType, 0), icon: BarChart2, color: "text-[#22D3EE]" },
            { label: "Missions validées", value: submissionStats.find(s => s.status === "APPROVED")?._count.status ?? 0, icon: Zap, color: "text-[#B8FF3B]" },
            { label: "En attente", value: submissionStats.find(s => s.status === "PENDING")?._count.status ?? 0, icon: FileText, color: "text-[#F97316]" },
          ].map((kpi) => (
            <div key={kpi.label} className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3">
              <div className={`flex items-center gap-2 ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">{kpi.label}</span>
              </div>
              <div className="text-4xl font-bold text-white">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Profile Distribution */}
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2"><TrendingUp className="h-3 w-3" /> Distribution des Profils</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {["builder", "creator", "strategist", "catalyst"].map((p) => {
              const count = quizByProfile.find(q => q.profileType === p)?._count.profileType ?? 0
              const total = quizByProfile.reduce((a, b) => a + b._count.profileType, 0) || 1
              const pct = Math.round((count / total) * 100)
              return (
                <div key={p} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="capitalize" style={{ color: profileColors[p] }}>{p}</span>
                    <span className="text-muted-foreground">{count} ({pct}%)</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-white/5">
                    <div className="h-1.5 rounded-full transition-all" style={{ width: `${pct}%`, background: profileColors[p] }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Users */}
          <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Users className="h-3 w-3" /> Derniers Membres</h2>
            <div className="space-y-2">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{u.name}</p>
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
          <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-4">
            <h2 className="font-mono text-xs uppercase tracking-widest text-muted-foreground flex items-center gap-2"><Zap className="h-3 w-3" /> Activité Missions</h2>
            <div className="space-y-2">
              {missionStats.map((m) => (
                <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white truncate max-w-[200px]">{m.title}</p>
                    <p className="text-[10px] text-muted-foreground font-mono">
                      {m.missionLevel} · {m.targetProfiles.join(", ")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-lg font-bold text-primary">{m._count.submissions}</span>
                    <p className="text-[9px] text-muted-foreground font-mono">soumissions</p>
                  </div>
                </div>
              ))}
              {missionStats.length === 0 && (
                <p className="text-sm text-muted-foreground py-4 text-center">Aucune soumission pour le moment.</p>
              )}
            </div>
          </div>
        </div>

      </div>
  )
}
