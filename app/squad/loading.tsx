import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function SquadLoading() {
  return (
    <SidebarProvider>
      <SidebarInset className="bg-background">
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Page header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <Skeleton className="h-3 w-40 bg-muted rounded-full" />
                <Skeleton className="h-10 w-72 bg-muted rounded-2xl" />
                <Skeleton className="h-4 w-56 bg-muted rounded-full" />
              </div>
              <Skeleton className="h-12 w-48 bg-muted rounded-2xl" />
            </div>

            {/* Meta badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Skeleton className="h-4 w-48 bg-muted rounded-full" />
              <Skeleton className="h-5 w-16 bg-muted rounded-full" />
              <Skeleton className="h-5 w-24 bg-muted rounded-full" />
            </div>

            {/* Announcement */}
            <Skeleton className="h-24 w-full rounded-2xl bg-muted" />

            {/* Incoming invitations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full rounded-3xl bg-muted" />
              ))}
            </div>

            {/* Main 2-col layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
              {/* Journey path */}
              <div className="space-y-0">
                <div className="text-xs font-mono font-bold text-zinc-600 uppercase mb-6 flex items-center gap-3">
                  <Skeleton className="h-px w-8 bg-muted" />
                  <Skeleton className="h-3 w-32 bg-muted rounded-full" />
                  <Skeleton className="h-3 w-16 bg-muted rounded-full" />
                </div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center shrink-0">
                      <Skeleton className="size-12 rounded-2xl bg-muted" />
                      {i < 5 && <Skeleton className="w-0.5 h-16 mt-1 bg-muted rounded-full" />}
                    </div>
                    <Skeleton className="flex-1 h-24 rounded-3xl border border-white/5 bg-muted/40" />
                  </div>
                ))}
              </div>

              {/* Side stats panel */}
              <div className="space-y-5 lg:sticky lg:top-24">
                {/* Cohesion gauge */}
                <Skeleton className="h-40 w-full rounded-3xl border border-white/5 bg-muted/60 p-6" />

                {/* Discord link */}
                <Skeleton className="h-20 w-full rounded-3xl border border-indigo-500/20 bg-indigo-500/5" />

                {/* Streak counter */}
                <Skeleton className="h-24 w-full rounded-3xl border border-white/5 bg-muted/60" />

                {/* Roster */}
                <Skeleton className="h-64 w-full rounded-3xl border border-white/5 bg-muted/60" />

                {/* Join requests */}
                <Skeleton className="h-48 w-full rounded-3xl border border-white/5 bg-muted/60" />

                {/* Audit */}
                <Skeleton className="h-48 w-full rounded-3xl border border-white/5 bg-muted/60" />

                {/* Personalization */}
                <Skeleton className="h-64 w-full rounded-3xl border border-white/5 bg-muted/60" />

                {/* Danger zone */}
                <Skeleton className="h-32 w-full rounded-3xl border border-white/5 bg-muted/60" />

                {/* V2 teaser */}
                <Skeleton className="h-40 w-full rounded-3xl border border-white/4 bg-muted/60" />
              </div>
            </div>

            {/* Squad Chat */}
            <Skeleton className="h-64 w-full rounded-3xl bg-muted" />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
