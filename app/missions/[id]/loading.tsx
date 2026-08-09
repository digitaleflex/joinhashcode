import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function MissionBriefingLoading() {
  return (
    <SidebarProvider>
      <SidebarInset className="bg-background">
        <main className="flex-1 overflow-y-auto pb-(--bottom-nav-height) md:pb-0">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-8">
            {/* Back link */}
            <Skeleton className="h-4 w-40 bg-muted rounded-full mb-10" />

            {/* Hero Header */}
            <div className="relative mb-10 pb-10 border-b border-border/40">
              <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-8">
                <div className="space-y-4 flex-1">
                  <Skeleton className="h-3 w-40 bg-muted rounded-full" />
                  <Skeleton className="h-8 w-full max-w-xl bg-muted rounded-2xl" />
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <Skeleton className="h-5 w-24 bg-muted rounded-md" />
                    <Skeleton className="h-5 w-16 bg-muted rounded-md" />
                    <Skeleton className="h-5 w-20 bg-muted rounded-md" />
                  </div>
                </div>
                <div className="shrink-0 flex flex-col items-end justify-start">
                  <Skeleton className="h-3 w-16 bg-muted rounded-full mb-1" />
                  <Skeleton className="h-16 w-24 bg-muted rounded-lg" />
                  <Skeleton className="h-3 w-8 bg-muted rounded-full mt-1" />
                </div>
              </div>

              {/* Meta strip */}
              <div className="relative flex flex-wrap gap-6 mt-8">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-4 w-32 bg-muted rounded-full" />
                ))}
              </div>
            </div>

            {/* Body */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12">
              {/* Left Column */}
              <div className="space-y-12">
                {/* 01 — Briefing */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-3 w-6 bg-muted rounded-full" />
                    <Skeleton className="h-4 w-24 bg-muted rounded-full" />
                    <Skeleton className="flex-1 h-px bg-muted" />
                  </div>
                  <div className="pl-8 space-y-3">
                    <Skeleton className="h-4 w-full bg-muted rounded-lg" />
                    <Skeleton className="h-4 w-full bg-muted rounded-lg" />
                    <Skeleton className="h-4 w-3/4 bg-muted rounded-lg" />
                  </div>
                </section>

                {/* 02 — Livrables */}
                <section>
                  <div className="flex items-center gap-4 mb-6">
                    <Skeleton className="h-3 w-6 bg-muted rounded-full" />
                    <Skeleton className="h-4 w-32 bg-muted rounded-full" />
                    <Skeleton className="flex-1 h-px bg-muted" />
                  </div>
                  <div className="pl-8 space-y-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-xl bg-muted" />
                    ))}
                  </div>
                </section>

                {/* GitHub note */}
                <div className="pl-8">
                  <Skeleton className="h-20 w-full rounded-xl bg-muted" />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
                {/* Status card */}
                <Skeleton className="h-64 w-full rounded-2xl bg-muted" />

                {/* Requirements */}
                <Skeleton className="h-48 w-full rounded-2xl bg-muted" />

                {/* Ateliers */}
                <Skeleton className="h-48 w-full rounded-2xl bg-muted" />

                {/* Partners */}
                <Skeleton className="h-48 w-full rounded-2xl bg-muted" />
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
