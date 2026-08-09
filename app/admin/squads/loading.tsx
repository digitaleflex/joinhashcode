import { Skeleton } from "@/components/ui/skeleton"

export default function AdminSquadsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <Skeleton className="h-6 w-48 bg-muted rounded-lg" />
        <Skeleton className="h-4 w-80 bg-muted rounded-lg" />
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-2xl border border-white/5 bg-muted/60 p-5" />
        ))}
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_120px_100px_100px_140px] gap-0 px-6 py-3 border-b border-white/5">
          {["Escouade", "Membres", "Cohésion", "Streak", "Statut", "Dernière activité"].map((h, i) => (
            <Skeleton key={i} className="h-3 w-16 bg-muted rounded-full" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_120px_100px_100px_140px] gap-0 px-6 py-4 border-b border-white/5 last:border-0">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-muted rounded-lg" />
              <Skeleton className="h-3 w-24 bg-muted rounded-lg" />
            </div>
            <Skeleton className="h-4 w-8 bg-muted rounded-lg" />
            <Skeleton className="h-4 w-full bg-muted rounded-lg" />
            <Skeleton className="h-4 w-8 bg-muted rounded-lg" />
            <Skeleton className="h-5 w-16 bg-muted rounded-full" />
            <Skeleton className="h-4 w-16 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
