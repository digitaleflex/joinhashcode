import type { ComponentType } from "react"

interface RetentionKpi {
  label: string
  value: string | number
  icon: ComponentType<{ className?: string }>
  color: string
  sub: string
}

interface RetentionSectionProps {
  kpis: RetentionKpi[]
}

export function RetentionSection({ kpis }: RetentionSectionProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map(kpi => (
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
  )
}
