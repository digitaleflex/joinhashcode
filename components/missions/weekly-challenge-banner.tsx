"use client"

import { motion } from "framer-motion"
import { Zap, Check, ChevronRight, Clock } from "lucide-react"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface WeeklyChallengeBannerProps {
  mission: { id: string; slug?: string | null; title?: string | null; shortDesc?: string | null; xp: number }
  isCompleted: boolean
  daysLeft: number   // jours restants avant reset (lundi prochain)
}

export function WeeklyChallengeBanner({ mission, isCompleted, daysLeft }: WeeklyChallengeBannerProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "relative p-5 rounded-[1.75rem] border overflow-hidden cursor-pointer group/weekly transition-all duration-500",
        isCompleted
          ? "bg-emerald-950/10 border-emerald-500/20"
          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
      )}
      onClick={() => !isCompleted && router.push(`/missions/${mission.slug || mission.id}`)}
    >
      {/* Fond animé subtil */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(184,255,59,0.04),transparent_60%)] pointer-events-none" />

      <div className="flex items-center justify-between gap-4 relative z-[var(--z-content)]">
        <div className="flex items-center gap-4">
          {/* Icône */}
          <div className={cn(
            "size-10 rounded-xl border flex items-center justify-center shrink-0",
            isCompleted ? "bg-emerald-950/40 border-emerald-500/30" : "bg-primary/10 border-primary/30"
          )}>
            {isCompleted ? <Check className="size-5 text-emerald-400" /> : <Zap className="size-5 text-primary" />}
          </div>

          {/* Texte */}
          <div className="space-y-0.5 text-left">
            <div className="flex items-center gap-2">
              <span className="text-xs-sm font-mono font-black uppercase tracking-widest text-primary">
                Challenge de la semaine
              </span>
              <span className="text-2xs font-mono text-zinc-600">
                {isCompleted ? "Complété" : `Reset dans ${daysLeft}j`}
              </span>
              {!isCompleted && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-1 text-2xs font-mono text-zinc-600 hover:text-primary transition-colors cursor-help border-l border-white/5 pl-2 ml-1">
                        <Clock className="size-2" /> ~14h
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-zinc-900 border-white/10 text-3xs text-zinc-300 font-mono">
                      Délai de validation estimé.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-sm font-semibold text-white">{mission.title}</p>
            <p className="text-xs text-zinc-400 font-light">{mission.shortDesc}</p>
          </div>
        </div>

        {/* XP + flèche */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-xs-sm font-mono text-zinc-600 block">Récompense</span>
            <span className="text-sm font-black text-primary">+{mission.xp} XP</span>
          </div>
          {!isCompleted && (
            <ChevronRight className="size-4 text-zinc-600 group-hover/weekly:text-primary group-hover/weekly:translate-x-1 transition-all" />
          )}
        </div>
      </div>
    </motion.div>
  )
}
