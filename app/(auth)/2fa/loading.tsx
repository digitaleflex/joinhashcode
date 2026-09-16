import { Skeleton } from "@/components/ui/skeleton"

export default function TwoFactorLoading() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
      <div className="w-full max-w-md space-y-8 relative z-[var(--z-content)]">
        <div className="text-center space-y-2">
          <Skeleton className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/20 mx-auto mb-4" />
          <Skeleton className="h-8 w-48 bg-muted rounded-lg mx-auto" />
          <Skeleton className="h-4 w-64 bg-muted rounded-lg mx-auto mt-2" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-20 w-full rounded-3xl bg-zinc-900 border border-white/5" />
          </div>
          <Skeleton className="h-16 w-full rounded-3xl bg-primary/20 border border-primary/30" />
        </div>
        <Skeleton className="h-4 w-48 bg-muted rounded-lg mx-auto mt-4" />
      </div>
    </div>
  )
}