import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function MissionsLoading() {
  return (
    <SidebarProvider>
      <SidebarInset className="bg-background">
        <main className="flex-1 p-4 md:p-10 pb-(--bottom-nav-height) md:pb-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Back link */}
            <Skeleton className="h-4 w-40 bg-muted rounded-full" />

            {/* Header */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-48 bg-muted rounded-full" />
              <Skeleton className="h-12 w-80 bg-muted rounded-2xl" />
              <Skeleton className="h-4 w-full max-w-2xl bg-muted rounded-full" />
            </div>

            {/* Weekly challenge banner */}
            <Skeleton className="h-32 w-full max-w-3xl rounded-3xl bg-muted" />

            {/* Stats grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 p-8 rounded-4xl bg-muted/50 border border-white/5">
                <div className="flex justify-between items-end mb-6">
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-40 bg-muted rounded-full" />
                    <Skeleton className="h-4 w-56 bg-muted rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-24 bg-muted rounded-full" />
                </div>
                <Skeleton className="h-1.5 w-full bg-muted rounded-full" />
                <Skeleton className="h-3 w-48 bg-muted rounded-full mt-4" />
              </div>
              <div className="hidden md:flex p-8 rounded-4xl border border-dashed border-white/5 bg-white/1 items-center justify-center">
                <Skeleton className="h-3 w-32 bg-muted rounded-full" />
              </div>
            </div>

            {/* Stage bar */}
            <div className="flex items-center gap-0">
              {["INIT", "CORE", "PRO"].map((stage, i) => (
                <div key={stage} className="flex items-center flex-1">
                  <Skeleton className="flex-1 py-3 px-4 rounded-2xl border bg-muted/30" />
                  {i < 2 && <Skeleton className="h-px w-4 shrink-0 bg-muted" />}
                </div>
              ))}
            </div>

            {/* Mission cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-72 w-full rounded-4xl bg-muted" />
              ))}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
