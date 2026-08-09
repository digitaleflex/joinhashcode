import { Skeleton } from "@/components/ui/skeleton"

export default function AdminSubmissionsLoading() {
  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <Skeleton className="h-6 w-48 bg-muted rounded-lg" />
        <Skeleton className="h-4 w-80 bg-muted rounded-lg" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900/60 border border-white/5 rounded-xl w-fit">
        <Skeleton className="h-8 w-24 rounded-lg bg-muted" />
        <Skeleton className="h-8 w-24 rounded-lg bg-muted" />
      </div>

      {/* Table skeleton */}
      <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_100px_120px] gap-0 px-6 py-3 border-b border-white/5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-20 bg-muted rounded-full" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_100px_120px] gap-0 px-6 py-4 border-b border-white/5 last:border-0">
            <Skeleton className="h-4 w-full bg-muted rounded-lg" />
            <Skeleton className="h-4 w-full bg-muted rounded-lg" />
            <Skeleton className="h-4 w-16 bg-muted rounded-lg" />
            <Skeleton className="h-8 w-20 bg-muted rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}
