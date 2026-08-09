import { Skeleton } from "@/components/ui/skeleton"

export default function AdminUsersLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="space-y-1">
        <Skeleton className="h-6 w-48 bg-muted rounded-lg" />
        <Skeleton className="h-4 w-80 bg-muted rounded-lg" />
      </div>

      {/* Header with export + search */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <Skeleton className="h-6 w-48 bg-muted rounded-lg mb-2" />
          <Skeleton className="h-4 w-32 bg-muted rounded-lg" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Skeleton className="h-10 w-32 bg-muted rounded-lg" />
          <Skeleton className="h-10 w-64 bg-muted rounded-lg" />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-8 bg-muted rounded-full mr-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-10 bg-muted rounded-lg" />
          ))}
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-3 w-8 bg-muted rounded-full mr-2" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-12 bg-muted rounded-lg" />
          ))}
        </div>
      </div>

      {/* Table skeleton */}
      <div className="rounded-xl border border-white/5 bg-zinc-950/50 backdrop-blur-sm overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_120px_140px_100px_100px] gap-0 px-6 py-4 border-b border-white/5">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16 bg-muted rounded-full" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_100px_120px_140px_100px_100px] gap-0 px-6 py-4 border-b border-white/5 last:border-0">
            <div className="flex items-center gap-3">
              <Skeleton className="h-9 w-9 rounded-full bg-muted" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-24 bg-muted rounded-lg" />
                <Skeleton className="h-3 w-32 bg-muted rounded-lg" />
              </div>
            </div>
            <Skeleton className="h-5 w-12 bg-muted rounded-lg" />
            <Skeleton className="h-4 w-12 bg-muted rounded-lg" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-12 bg-muted rounded-lg" />
              <Skeleton className="h-3 w-16 bg-muted rounded-lg" />
            </div>
            <Skeleton className="h-4 w-20 bg-muted rounded-lg" />
            <Skeleton className="h-5 w-12 bg-muted rounded-lg" />
            <Skeleton className="h-8 w-8 bg-muted rounded-lg ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
