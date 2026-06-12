import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"

export default function SquadLoading() {
  return (
    <SidebarProvider>
      <SidebarInset className="bg-background">
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12">
          <div className="max-w-6xl mx-auto space-y-10 animate-pulse">
            {/* Header skeleton */}
            <div className="space-y-3">
              <div className="h-3 w-32 bg-zinc-800 rounded-full" />
              <div className="h-10 w-72 bg-zinc-800 rounded-2xl" />
              <div className="h-4 w-56 bg-zinc-800/60 rounded-full" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
              {/* Journey path skeleton */}
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="size-12 rounded-2xl bg-zinc-800" />
                      {i < 5 && <div className="w-0.5 h-16 mt-1 bg-zinc-800/60 rounded-full" />}
                    </div>
                    <div className="flex-1 rounded-3xl border border-white/5 bg-zinc-900/40 p-5 mb-3">
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-zinc-800 rounded-full" />
                        <div className="h-5 w-40 bg-zinc-700 rounded-full" />
                        <div className="h-3 w-56 bg-zinc-800/60 rounded-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Side panel skeleton */}
              <div className="space-y-5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="rounded-3xl border border-white/5 bg-zinc-900/40 p-6 space-y-3">
                    <div className="h-4 w-24 bg-zinc-800 rounded-full" />
                    <div className="h-2 w-full bg-zinc-800/60 rounded-full" />
                    <div className="h-2 w-3/4 bg-zinc-800/40 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
