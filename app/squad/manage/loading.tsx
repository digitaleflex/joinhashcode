import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function SquadManageLoading() {
  return (
    <SidebarProvider>
      <SidebarInset className="bg-background">
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-500 uppercase">
                <Skeleton className="h-3 w-3 bg-muted rounded-full" />
                <Skeleton className="h-3 w-40 bg-muted rounded-full" />
              </div>
              <Skeleton className="h-10 w-80 bg-muted rounded-2xl" />
              <Skeleton className="h-4 w-full max-w-xl bg-muted rounded-full" />
            </div>

            {/* Tabs Layout */}
            <div className="glass-card rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col h-full md:min-h-[700px]">
              <div className="flex flex-col md:flex-row h-full w-full">
                {/* Tabs List */}
                <div className="flex flex-row md:flex-col h-auto md:w-72 bg-zinc-950/80 border-b md:border-b-0 md:border-r border-white/5 p-3 md:p-6 gap-2 md:gap-3 justify-start overflow-x-auto scrollbar-none backdrop-blur-xl w-full">
                  <Skeleton className="hidden md:block mb-6 h-3 w-32 bg-muted rounded-full" />

                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-xl md:rounded-2xl bg-muted" />
                  ))}

                  <Skeleton className="hidden md:block my-4 h-3 w-24 bg-muted rounded-full" />

                  <Skeleton className="h-10 w-full rounded-xl md:rounded-2xl bg-muted" />
                </div>

                {/* Content Area */}
                <div className="flex-1 p-4 md:p-12 bg-muted/40 relative">
                  <div className="space-y-6">
                    <Skeleton className="h-6 w-48 bg-muted rounded-lg" />
                    <Skeleton className="h-4 w-full bg-muted rounded-lg" />
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-xl bg-muted" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Back link */}
            <div className="flex justify-center">
              <Skeleton className="h-4 w-48 bg-muted rounded-full" />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
