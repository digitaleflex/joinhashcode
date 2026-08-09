import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <SidebarProvider>
      <SidebarInset className="bg-background">
        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Activation checklist */}
            <Skeleton className="h-24 w-full rounded-3xl bg-muted" />

            {/* Squad banner */}
            <Skeleton className="h-16 w-full rounded-2xl bg-muted" />

            {/* Referral cards */}
            <div className="space-y-6">
              <Skeleton className="h-32 w-full rounded-3xl bg-muted" />
              <Skeleton className="h-48 w-full rounded-3xl bg-muted" />
            </div>

            {/* Tier 1: Welcome header */}
            <Skeleton className="h-48 w-full rounded-3xl bg-muted" />

            {/* Tier 2: 90 days objective + progression */}
            <div className="space-y-5">
              <Skeleton className="h-32 w-full rounded-3xl bg-muted" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16 bg-muted rounded-full" />
                <Skeleton className="h-3 w-4 bg-muted rounded-full" />
                <Skeleton className="h-3 w-20 bg-muted rounded-full" />
                <Skeleton className="h-3 w-4 bg-muted rounded-full" />
                <Skeleton className="h-3 w-24 bg-muted rounded-full" />
              </div>
              <Skeleton className="h-28 w-full rounded-2xl bg-muted" />
            </div>

            {/* Tier 3: 2/3 vs 1/3 split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-64 w-full rounded-3xl bg-muted" />
                <Skeleton className="h-64 w-full rounded-3xl bg-muted" />
                <Skeleton className="h-96 w-full rounded-3xl bg-muted" />
                <Skeleton className="h-48 w-full rounded-3xl bg-muted" />
              </div>
              <div className="space-y-8">
                <Skeleton className="h-64 w-full rounded-3xl bg-muted" />
              </div>
            </div>

            {/* Tier 4: Bento grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Skeleton className="md:col-span-2 h-80 w-full rounded-3xl bg-muted" />
              <Skeleton className="md:col-span-1 h-80 w-full rounded-3xl bg-muted" />
              <Skeleton className="md:col-span-1 h-80 w-full rounded-3xl bg-muted" />
              <Skeleton className="md:col-span-2 h-80 w-full rounded-3xl bg-muted" />
            </div>

            {/* Tier 5: Member card */}
            <div className="space-y-6 pt-6 flex flex-col items-center w-full">
              <Skeleton className="h-4 w-48 bg-muted rounded-full" />
              <Skeleton className="h-64 w-full max-w-4xl rounded-3xl bg-muted" />
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
