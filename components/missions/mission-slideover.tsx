"use client"

import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { MissionBriefing } from "@/components/missions/mission-briefing"
import { useRouter } from "next/navigation"
import { Zap, Clock, ChevronRight, Lock } from "lucide-react"
import { cn } from "@/lib/utils"

interface MissionSlideOverProps {
  mission: any | null
  isOpen: boolean
  onClose: () => void
  userLevel: number
  hasSubmission?: boolean
  submissionStatus?: string | null
}

const DIFFICULTY_LABEL = ["", "Initié", "Apprenti", "Confirmé", "Expert"]
const TYPE_COLORS: Record<string, string> = {
  CODE: "text-cyan-400 bg-cyan-950/40 border-cyan-500/30",
  DESIGN: "text-purple-400 bg-purple-950/40 border-purple-500/30",
  BUSINESS: "text-amber-400 bg-amber-950/40 border-amber-500/30",
  NETWORK: "text-emerald-400 bg-emerald-950/40 border-emerald-500/30",
  GENERAL: "text-zinc-400 bg-zinc-900/40 border-zinc-500/30",
  INTRO: "text-primary bg-primary/10 border-primary/30",
}

export function MissionSlideOver({ mission, isOpen, onClose, userLevel, hasSubmission, submissionStatus }: MissionSlideOverProps) {
  const router = useRouter()

  if (!mission) return null

  const requiredLevel = mission.requiredLevel ?? 1;
  const isLocked = userLevel < requiredLevel;
  const isApproved = submissionStatus === "APPROVED";
  const isPending = submissionStatus === "PENDING" || submissionStatus === "IN_REVIEW" || submissionStatus === "NEEDS_REVISION";

  const handleCommencer = () => {
    onClose()
    router.push(`/missions/${mission.id}`)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg bg-zinc-950 border-l border-white/5 overflow-y-auto scrollbar-none p-0"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur-xl border-b border-white/5 p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider", TYPE_COLORS[mission.type] || TYPE_COLORS.GENERAL)}>
                  {mission.type}
                </span>
                <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-white/5 px-2 py-0.5 rounded-full">
                  {DIFFICULTY_LABEL[mission.level] || `Niv. ${mission.level}`}
                </span>
                {isApproved && (
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                    ✓ Complété
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-white leading-tight truncate">{mission.title}</h2>

              {/* Meta */}
              <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-500">
                <span className="flex items-center gap-1">
                  <Zap className="size-2.5 text-primary" />
                  +{mission.xpReward || mission.xp} XP
                </span>
                {mission.duration && (
                  <span className="flex items-center gap-1">
                    <Clock className="size-2.5" />
                    {mission.duration}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Corps */}
        <div className="p-6 space-y-6">
          {/* Description courte */}
          <p className="text-sm text-zinc-400 font-light leading-relaxed">
            {mission.shortDesc || mission.description}
          </p>

          {/* Livrables */}
          {mission.deliverables?.length > 0 && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Livrables attendus</p>
              <ul className="space-y-1.5">
                {mission.deliverables.map((d: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-zinc-400">
                    <span className="text-primary mt-0.5 shrink-0">›</span>
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Briefing complet si disponible */}
          {(mission.fullBriefing || mission.description) && (
            <div className="space-y-2">
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">Briefing</p>
              <div className="prose-sm max-h-60 overflow-y-auto scrollbar-none">
                <MissionBriefing content={mission.fullBriefing || mission.description} />
              </div>
            </div>
          )}
        </div>

        {/* Footer avec CTA */}
        <div className="sticky bottom-0 bg-zinc-950/95 backdrop-blur-xl border-t border-white/5 p-6">
          {isLocked ? (
            <div className="flex items-center gap-3 p-4 bg-zinc-900/60 rounded-2xl border border-white/5">
              <Lock className="size-4 text-zinc-600 shrink-0" />
              <p className="text-xs text-zinc-500">
                Niveau {requiredLevel} requis pour accéder à cette mission.
              </p>
            </div>
          ) : isApproved ? (
            <div className="flex flex-col gap-3 p-4 bg-emerald-950/20 rounded-2xl border border-emerald-500/20">
              <span className="text-emerald-400 text-sm font-bold text-center">Mission complétée ✓</span>
              <Button
                onClick={handleCommencer}
                variant="outline"
                className="w-full bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
              >
                Voir ma soumission
              </Button>
            </div>
          ) : isPending ? (
            <div className="flex flex-col gap-3 p-4 bg-amber-950/20 rounded-2xl border border-amber-500/20">
              <span className="text-amber-400 text-sm font-bold text-center">En cours de revue ●</span>
              <Button
                onClick={handleCommencer}
                variant="outline"
                className="w-full bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
              >
                Voir ma soumission
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleCommencer}
              className="w-full btn-primary-glow h-12 rounded-xl text-[11px] uppercase font-black tracking-wider gap-2"
            >
              {hasSubmission ? "Voir ma soumission" : "Commencer la mission"}
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
