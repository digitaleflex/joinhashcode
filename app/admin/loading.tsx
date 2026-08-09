import { SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <SidebarInset className="bg-zinc-950">
      <main className="flex-1 p-6 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-8 w-48 bg-muted rounded-lg" />
          <Skeleton className="h-4 w-96 bg-muted rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full rounded-2xl bg-muted/60 border border-white/5" />
            ))}
          </div>
          <Skeleton className="h-96 w-full rounded-2xl bg-muted/60 border border-white/5" />
        </div>
      </main>
    </SidebarInset>
  )
}
