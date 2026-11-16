import { Badge } from "@/components/ui/badge"
import { getMissionStatusMeta } from "@/lib/mission-status"
import { cn } from "@/lib/utils"

export function LabStatusBadge({
  status,
  className,
}: {
  status?: string | null
  className?: string
}) {
  const meta = getMissionStatusMeta(status)
  return (
    <Badge className={cn("border font-mono text-xs", meta.className, className)}>
      {meta.label}
    </Badge>
  )
}