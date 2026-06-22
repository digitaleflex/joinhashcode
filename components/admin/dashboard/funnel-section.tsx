import { Filter } from "lucide-react"

interface FunnelStep {
  label: string
  value: number
  desc: string
}

interface FunnelSectionProps {
  steps: FunnelStep[]
}

export function FunnelSection({ steps }: FunnelSectionProps) {
  const userCount = steps[0]?.value ?? 0

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
      <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Filter className="h-3 w-3" /> Funnel d&apos;acquisition
      </h2>
      <div className="space-y-3">
        {steps.map((step, i, arr) => {
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
  )
}
