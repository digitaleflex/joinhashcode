import { Crosshair } from "lucide-react"

interface LevelData {
  total: number
  approved: number
  pending: number
  rejected: number
}

interface MissionDropoffSectionProps {
  submissionsByLevel: Record<string, LevelData>
}

export function MissionDropoffSection({ submissionsByLevel }: MissionDropoffSectionProps) {
  return (
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
  )
}
