import { Skeleton } from "@/components/ui/skeleton"
import { SidebarInset } from "@/components/ui/sidebar"

export default function JoinRequestsLoading() {
  return (
    <SidebarInset className="bg-zinc-950">
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-8 w-64 bg-muted rounded-lg" />
          <Skeleton className="h-4 w-96 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-2xl bg-muted/60 border border-white/5" />
            ))}
          </div>
          <Skeleton className="h-16 w-full rounded-2xl bg-muted/60 border border-white/5" />
          <div className="rounded-2xl border border-white/5 bg-zinc-900/60 overflow-hidden">
            <Skeleton className="h-12 w-full bg-white/5" />
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full border-t border-white/5" />
            ))}
          </div>
        </div>
      </main>
    </SidebarInset>
  )
}