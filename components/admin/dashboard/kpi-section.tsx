import { Users, Zap, BarChart2, Activity } from "lucide-react"

interface KpiSectionProps {
  userCount: number
  prevUserCount: number
  quizTotal: number
  approvedMissions: number
  prevSubmissionCount: number
  activeRecently: number
  prevActiveCount: number
}

export function KpiSection({
  userCount,
  prevUserCount,
  quizTotal,
  approvedMissions,
  prevSubmissionCount,
  activeRecently,
  prevActiveCount,
}: KpiSectionProps) {
  const kpis = [
    { label: "Membres total", value: userCount, prev: prevUserCount, icon: Users, color: "text-primary" },
    { label: "Profils quizés", value: quizTotal, icon: BarChart2, color: "text-[#22D3EE]" },
    { label: "Missions validées", value: approvedMissions, prev: prevSubmissionCount, icon: Zap, color: "text-[#B8FF3B]" },
    { label: "Actifs 7j", value: activeRecently, prev: prevActiveCount, icon: Activity, color: "text-[#F97316]" },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi) => {
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
  )
}
