import { Skeleton } from "@/components/ui/skeleton"

export default function SpecializationLoading() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <div className="scanline opacity-20" />
      <nav className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Skeleton className="h-8 w-32 bg-muted rounded-lg" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-24 bg-muted rounded-lg" />
              <Skeleton className="h-8 w-24 bg-muted rounded-lg" />
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1 p-4 pt-24 md:pt-32 relative z-[var(--z-content)]">
        <div className="max-w-lg mx-auto text-center mb-8">
          <Skeleton className="h-8 w-48 bg-muted rounded-lg mx-auto" />
          <Skeleton className="h-4 w-64 bg-muted rounded-lg mx-auto mt-2" />
        </div>
        <div className="max-w-lg mx-auto space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl bg-muted/60 border border-white/5" />
          <Skeleton className="h-48 w-full rounded-2xl bg-muted/60 border border-white/5" />
          <Skeleton className="h-48 w-full rounded-2xl bg-muted/60 border border-white/5" />
          <Skeleton className="h-48 w-full rounded-2xl bg-muted/60 border border-white/5" />
          <Skeleton className="h-48 w-full rounded-2xl bg-muted/60 border border-white/5" />
          <Skeleton className="h-48 w-full rounded-2xl bg-muted/60 border border-white/5" />
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl bg-muted/60 border border-white/5" />
            <Skeleton className="h-12 w-full rounded-xl bg-muted/60 border border-white/5" />
            <Skeleton className="h-12 w-full rounded-xl bg-muted/60 border border-white/5" />
          </div>
          <Skeleton className="h-16 w-full rounded-xl bg-muted/60 border border-white/5" />
        </div>
      </main>
      <footer className="border-t border-white/5 bg-zinc-950/80 backdrop-blur-sm py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-4 w-48 bg-muted rounded-lg mx-auto" />
        </div>
      </footer>
    </div>
  )
}