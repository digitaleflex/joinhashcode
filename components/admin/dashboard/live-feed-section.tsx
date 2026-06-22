import { Activity } from "lucide-react"
import { AdminLiveFeed } from "@/components/admin/AdminLiveFeed"

export function LiveFeedSection() {
  return (
    <div className="rounded-2xl border border-white/5 bg-zinc-900/60 p-6 space-y-5">
      <h2 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Activity className="h-3 w-3 text-primary" /> Activité en direct
      </h2>
      <AdminLiveFeed />
    </div>
  )
}
