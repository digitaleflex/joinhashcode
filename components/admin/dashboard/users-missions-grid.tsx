import { Users, Zap } from "lucide-react"

interface RecentUser {
  id: string
  name: string | null
  email: string
  country: string | null
  class: string | null
  level: number
}

interface MissionStat {
  id: string
  title: string
  missionLevel: string | null
  targetProfiles: string[]
  _count: { submissions: number }
}

interface UsersMissionsGridProps {
  recentUsers: RecentUser[]
  missionStats: MissionStat[]
  profileColors: Record<string, string>
}

export function UsersMissionsGrid({ recentUsers, missionStats, profileColors }: UsersMissionsGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Recent Users */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Users className="h-3 w-3" /> Derniers Membres</h2>
        <div className="space-y-4">
          {recentUsers.map((u) => (
            <div key={u.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
              <div>
                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">{u.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{u.email} · {u.country ?? "—"}</p>
              </div>
              <div className="text-right">
                {u.class ? (
                  <span className="text-xs font-mono font-bold uppercase px-2 py-0.5 rounded" style={{ background: `${profileColors[u.class] ?? "#fff"}15`, color: profileColors[u.class] ?? "#fff" }}>
                    {u.class}
                  </span>
                ) : (
                  <span className="text-xs font-mono text-muted-foreground">—</span>
                )}
                 <p className="text-3xs text-muted-foreground/60 font-mono mt-0.5">LVL {u.level}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mission Activity */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-6">
        <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2"><Zap className="h-3 w-3" /> Activité Missions</h2>
        <div className="space-y-4">
          {missionStats.map((m) => (
            <div key={m.id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0 group">
              <div className="truncate pr-4">
                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors truncate">{m.title}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {m.missionLevel} · {m.targetProfiles.join(", ")}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="text-lg font-bold text-primary">{m._count.submissions}</span>
                <p className="text-3xs text-muted-foreground font-mono uppercase tracking-tighter">soumissions</p>
              </div>
            </div>
          ))}
          {missionStats.length === 0 && (
            <p className="text-sm text-muted-foreground py-8 text-center font-mono text-xs uppercase tracking-wider">Aucune soumission active</p>
          )}
        </div>
      </div>
    </div>
  )
}
