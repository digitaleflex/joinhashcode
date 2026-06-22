import { Badge } from "@/components/ui/badge"

const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  PENDING_ADMIN: { label: "Admin requis", className: "bg-orange-500/10 text-orange-400 border-orange-500/20" },
  IN_REVIEW: { label: "En revue", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  APPROVED: { label: "Approuvé", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Rejeté", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  NEEDS_REVISION: { label: "Révision", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
}

interface StatusBadgeProps {
  status: string
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const meta = STATUS_META[status] ?? { label: status, className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" }
  return (
    <Badge variant="outline" className={`text-[9px] uppercase tracking-tighter font-mono ${meta.className}`}>
      {meta.label}
    </Badge>
  )
}
