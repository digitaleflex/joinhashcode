import { Skeleton } from "@/components/ui/skeleton"

export default function AdminMissionsLoading() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <Skeleton className="h-8 w-64 bg-muted rounded-lg mb-2" />
          <Skeleton className="h-4 w-80 bg-muted rounded-lg" />
        </div>
        <Skeleton className="h-10 w-40 bg-muted rounded-lg" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg border border-zinc-800 bg-muted/60 p-6" />
        ))}
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden border border-white/5 bg-muted/60">
        <div className="grid grid-cols-[1fr_100px_100px_100px_100px_140px] gap-0 px-6 py-3 border-b border-white/5 bg-white/5">
          {["Mission", "Catégorie", "Niveau", "Difficulté", "XP", "Actions"].map((h, i) => (
            <Skeleton key={i} className="h-3 w-16 bg-muted rounded-full" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_100px_100px_100px_140px] gap-0 px-6 py-4 border-b border-zinc-800 last:border-0">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-muted rounded-lg" />
              <Skeleton className="h-3 w-20 bg-muted rounded-lg" />
            </div>
            <Skeleton className="h-5 w-12 bg-muted rounded-md" />
            <Skeleton className="h-4 w-10 bg-muted rounded-lg" />
            <Skeleton className="h-5 w-10 bg-muted rounded-md" />
            <Skeleton className="h-4 w-12 bg-muted rounded-lg" />
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 bg-muted rounded-lg" />
              <Skeleton className="h-8 w-8 bg-muted rounded-lg" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
