import { Activity, BarChart2 } from "lucide-react"

interface WeeklyData {
  dayStart: Date
  checkins: number
  signups: number
  missions: number
}

interface ActivityChartSectionProps {
  activeNow: number
  weeklyData: WeeklyData[]
}

export function ActivityChartSection({ activeNow, weeklyData }: ActivityChartSectionProps) {
  return (
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
  )
}
