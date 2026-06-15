"use client"

import { motion } from "framer-motion"
import { Activity, Zap, AlertTriangle, ShieldCheck } from "lucide-react"
import { getSyncStatus } from "@/lib/evolution-utils"
import { cn } from "@/lib/utils"

interface NeuralSyncGaugeProps {
  score: number
  confidenceScore?: number
  className?: string
}

export function NeuralSyncGauge({ score, confidenceScore, className }: NeuralSyncGaugeProps) {
  const finalScore = confidenceScore !== undefined ? Math.round(confidenceScore * 100) : score
  const status = getSyncStatus(finalScore)
  const Icon = finalScore >= 80 ? ShieldCheck : finalScore >= 50 ? Zap : finalScore >= 30 ? Activity : AlertTriangle

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={cn("size-2 rounded-full animate-pulse", status.color.replace('text-', 'bg-'))} />
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-zinc-500">Neural_Sync</span>
        </div>
        <div className={cn("px-2 py-0.5 rounded-md border font-mono text-[9px] font-black uppercase tracking-tighter", status.bg, status.color, status.border)}>
          {status.label}
        </div>
      </div>

      <div className="relative h-12 bg-white/5 border border-white/10 rounded-xl overflow-hidden group">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
        
        {/* Progress Fill */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${finalScore}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("absolute inset-y-0 left-0 bg-gradient-to-r transition-colors duration-500", 
            finalScore >= 80 ? "from-emerald-600 to-emerald-400" : 
            finalScore >= 50 ? "from-primary/80 to-primary" : 
            finalScore >= 30 ? "from-amber-600 to-amber-400" : 
            "from-destructive/80 to-destructive"
          )}
        >
          {/* Scanline Effect */}
          <div className="absolute inset-0 bg-white/10 animate-pulse" />
        </motion.div>

        {/* Center Text */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-3 px-4 w-full justify-between">
                <Icon className={cn("size-4", finalScore > 50 ? "text-black" : "text-white")} />
                <span className={cn("text-xl font-black font-mono tracking-tighter", finalScore > 50 ? "text-black" : "text-white")}>
                    {finalScore}%
                </span>
            </div>
        </div>
      </div>

      <p className="text-[9px] text-zinc-500 italic leading-relaxed text-center font-mono uppercase tracking-tight">
        {finalScore >= 80 ? "Alignement neural optimal. Tes actions sont en phase avec ton build." :
         finalScore >= 50 ? "Synchronisation stable. Tu progresses vers tes objectifs." :
         finalScore >= 30 ? "Dérive détectée. Tes actions s'écartent de ton profil cible." :
         "DÉCONNEXION CRITIQUE : Ton activité ne correspond plus à ta classe."}
      </p>
    </div>
  )
}
