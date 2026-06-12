import { prisma } from "@/lib/prisma"
import { Users, Zap, Shield, AlertTriangle, TrendingDown } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { SquadRowActions } from "@/components/admin/squads/SquadRowActions"

function healthLabel(cohesion: number, memberCount: number): { label: string; color: string; bg: string } {
  if (memberCount < 3 || cohesion < 0.2)
    return { label: "Critique", color: "text-red-400", bg: "bg-red-400/10 border-red-400/20" }
  if (memberCount < 5 || cohesion < 0.5)
    return { label: "Fragile", color: "text-amber-400", bg: "bg-amber-400/10 border-amber-400/20" }
  if (cohesion >= 0.8 && memberCount === 5)
    return { label: "Optimale", color: "text-primary", bg: "bg-primary/10 border-primary/20" }
  return { label: "Active", color: "text-emerald-400", bg: "bg-emerald-400/10 border-emerald-400/20" }
}

export default async function AdminSquadsPage() {
  const squads = await prisma.organization.findMany({
    include: {
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              pseudo: true,
              class: true,
              stats: {
                select: {
                  lastCheckinAt: true,
                }
              }
            }
          },
        },
      },
    },
    orderBy: { cohesionScore: "asc" },
  })

  const total = squads.length
  const critical = squads.filter(s => s.cohesionScore < 0.2 || s.members.length < 3).length
  const full = squads.filter(s => s.members.length >= 5).length
  const avgCohesion = total > 0
    ? Math.round((squads.reduce((acc, s) => acc + s.cohesionScore, 0) / total) * 100)
    : 0

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <h1 className="text-lg font-bold tracking-tight text-white">Santé des Escouades</h1>
        <p className="text-sm text-muted-foreground font-mono">
          {total} escouade{total !== 1 ? "s" : ""} · triées par cohésion croissante (les plus à risque en premier)
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total escouades", value: total, icon: Shield, color: "text-primary" },
          { label: "Critiques", value: critical, icon: AlertTriangle, color: "text-red-400" },
          { label: "Complètes (5/5)", value: full, icon: Users, color: "text-emerald-400" },
          { label: "Cohésion moy.", value: `${avgCohesion}%`, icon: Zap, color: "text-amber-400" },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl border border-white/5 bg-zinc-900/60 p-5 space-y-3">
            <div className={`flex items-center gap-2 ${kpi.color}`}>
              <kpi.icon className="h-4 w-4" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
            </div>
            <div className="text-4xl font-bold text-white tracking-tight">{kpi.value}</div>
          </div>
        ))}
      </div>

      {/* Squads table */}
      {total === 0 ? (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-12 text-center">
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">Aucune escouade créée</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
          <div className="grid grid-cols-[1fr_100px_120px_100px_100px_140px] gap-0 px-6 py-3 border-b border-white/5">
            {["Escouade", "Membres", "Cohésion", "Streak", "Statut", "Dernière activité"].map(h => (
              <span key={h} className="text-[9px] font-mono uppercase tracking-wider text-muted-foreground">{h}</span>
            ))}
          </div>
          {squads.map(squad => {
            const memberCount = squad.members.length
            const health = healthLabel(squad.cohesionScore, memberCount)
            const leader = squad.members.find(m => m.role === "owner" || m.role === "LEADER")
            const lastCheckin = squad.members
              .map(m => m.user.stats?.lastCheckinAt)
              .filter(Boolean)
              .sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0]

            return (
              <div
                key={squad.id}
                className="grid grid-cols-[1fr_100px_120px_100px_100px_140px] gap-0 px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors items-center"
              >
                {/* Name + slug */}
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{squad.name}</p>
                  <p className="text-[10px] font-mono text-zinc-600 truncate">
                    /invite/{squad.slug}
                    {leader && <> · chef: {leader.user.pseudo || leader.user.name}</>}
                  </p>
                </div>

                {/* Members */}
                <div className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-zinc-600" />
                  <span className={`text-sm font-bold tabular-nums ${memberCount >= 5 ? "text-primary" : memberCount >= 3 ? "text-amber-400" : "text-red-400"}`}>
                    {memberCount}/5
                  </span>
                </div>

                {/* Cohesion bar */}
                <div className="space-y-1">
                  <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.round(squad.cohesionScore * 100)}%`,
                        background: squad.cohesionScore >= 0.7 ? "#C5F441" : squad.cohesionScore >= 0.4 ? "#F59E0B" : "#EF4444",
                      }}
                    />
                  </div>
                  <p className="text-[10px] font-mono text-zinc-500 tabular-nums">
                    {Math.round(squad.cohesionScore * 100)}%
                  </p>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-1.5">
                  <Zap className={`h-3.5 w-3.5 ${squad.streakCount >= 3 ? "text-amber-400 fill-amber-400" : "text-zinc-700"}`} />
                  <span className="text-sm font-bold text-white tabular-nums">{squad.streakCount}j</span>
                </div>

                {/* Health badge */}
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider w-fit ${health.bg} ${health.color}`}>
                  {health.label}
                </span>

                {/* Last activity */}
                <span className="text-[10px] font-mono text-zinc-600">
                  {lastCheckin
                    ? formatDistanceToNow(new Date(lastCheckin), { locale: fr, addSuffix: true })
                    : "Jamais"}
                </span>
                
                {/* Actions Admin */}
                <div className="flex justify-end">
                  <SquadRowActions squad={squad} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
