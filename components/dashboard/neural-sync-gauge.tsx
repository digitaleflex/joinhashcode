"use client"

import { motion } from "framer-motion"
import { Zap, Flame, Info } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip"

interface NeuralSyncGaugeProps {
  confidenceScore: number
  currentStreak: number
}

export function NeuralSyncGauge({ confidenceScore, currentStreak }: NeuralSyncGaugeProps) {
  const syncPercentage = Math.round(confidenceScore * 100)
  const isMultiplierActive = currentStreak >= 3
  const multiplierValue = currentStreak >= 7 ? "1.2x" : isMultiplierActive ? "1.1x" : "1.0x"

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className={cn("size-3", isMultiplierActive ? "text-primary animate-pulse" : "text-zinc-600")} />
            <span className="text-[10px] font-mono text-zinc-500 font-bold tracking-tight">état_de_synchronisation_</span>
          </div>
          <h4 className="text-2xl font-bold tracking-tighter text-white">
            {syncPercentage}% <span className="text-zinc-700 font-light italic text-lg tracking-tight">signal</span>
          </h4>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-end gap-1 cursor-help">
                <div className="flex items-center gap-1.5">
                  <Flame className={cn("size-4", currentStreak > 0 ? "text-orange-500" : "text-zinc-800")} />
                  <span className="text-lg font-bold font-mono tracking-tight">{currentStreak}</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-600 font-bold tracking-tight leading-none">days_streak</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="bg-zinc-900 border-white/10 text-[10px] font-mono font-bold tracking-tight text-zinc-300">
              maintiens ta sync pour booster ton XP
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Progress value={syncPercentage} variant="glow" className="h-2.5 bg-white/5" />
          {isMultiplierActive && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute -right-2 -top-6"
            >
              <Badge className="bg-primary text-black font-black text-[9px] px-2 py-0.5 shadow-[0_0_15px_#B8FF3B]">
                BOOST {multiplierValue} ACTIVE
              </Badge>
            </motion.div>
          )}
        </div>
        
        <div className="flex justify-between items-center px-1">
          <p className="text-[10px] text-zinc-500 font-mono tracking-tight max-w-[70%]">
            {syncPercentage < 40
              ? "[!] SIGNAL FAIBLE : Ton profil se dégrade. Effectue un check-in."
              : syncPercentage < 75
              ? "[+] SIGNAL STABLE : Maintiens ta régularité pour débloquer le boost."
              : "[*] SIGNAL OPTIMAL : Multiplicateur de Momentum activé."}
          </p>
          {!isMultiplierActive && (
            <span className="text-[9px] font-mono text-zinc-700 uppercase">
              Streak {currentStreak}/3 to Boost
            </span>
          )}
        </div>
      </div>

      {isMultiplierActive && (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-3 animate-in fade-in zoom-in duration-500">
          <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
            <Zap className="size-4 text-primary fill-primary" />
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-white uppercase tracking-wider">NEURAL MOMENTUM ACTIVE</p>
            <p className="text-[9px] text-primary/60 font-mono italic">
              Tes gains d&apos;XP sont multipliés par {multiplierValue} sur toutes les missions.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
