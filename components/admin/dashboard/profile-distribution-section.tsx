import { TrendingUp } from "lucide-react"

interface ProfileDistributionSectionProps {
  quizByProfile: { profileType: string; _count: { profileType: number } }[]
  profileColors: Record<string, string>
}

export function ProfileDistributionSection({ quizByProfile, profileColors }: ProfileDistributionSectionProps) {
  const total = quizByProfile.reduce((a, b) => a + b._count.profileType, 0) || 1

  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
      <h2 className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2"><TrendingUp className="h-3 w-3" /> Distribution des Profils</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {["builder", "creator", "strategist", "catalyst"].map((p) => {
          const count = quizByProfile.find(q => q.profileType === p)?._count.profileType ?? 0
          const pct = Math.round((count / total) * 100)
          return (
            <div key={p} className="space-y-3">
              <div className="flex justify-between text-xs font-mono">
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
  )
}
