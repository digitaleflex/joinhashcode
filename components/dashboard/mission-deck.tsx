"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Flame,
  X,
  Lock,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mission } from "@/lib/missions"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface MissionDeckProps {
  recommendedMissions: Mission[]
}

export function MissionDeck({ recommendedMissions }: MissionDeckProps) {
  const [currentIndex, setCurrentSetIndex] = useState(0)
  const currentMission = recommendedMissions[currentIndex]

  if (!currentMission) {
    return (
      <Card variant="premium" className="flex flex-col items-center justify-center py-12 text-center space-y-4">
        <div className="size-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <Check className="size-6 text-zinc-500" />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold text-white">Flux Épuisé</p>
          <p className="text-xs text-muted-foreground">Toutes les missions recommandées ont été traitées.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary animate-pulse" />
          <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-zinc-500">
            For You Page_
          </h3>
        </div>
        <div className="flex gap-1">
          {recommendedMissions.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 w-4 rounded-full transition-all duration-300",
                i === currentIndex ? "bg-primary w-8" : "bg-zinc-800"
              )} 
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentMission.id}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.05, y: -10 }}
          transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <Card variant="premium" className="relative overflow-hidden group min-h-[300px] flex flex-col">
            {/* Mission Watermark */}
            <div className="absolute -right-4 -top-4 text-7xl font-black text-white/[0.02] select-none pointer-events-none uppercase font-mono">
              {currentMission.category.slice(0, 3)}
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-mono uppercase tracking-widest px-2 py-0">
                  {currentMission.category}
                </Badge>
                <span className="text-[9px] font-mono text-zinc-600">NIV. {currentMission.difficulty}</span>
              </div>
              <CardTitle className="text-2xl font-bold text-white tracking-tight group-hover:text-primary transition-colors leading-tight">
                {currentMission.title}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col space-y-6 pt-2">
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                {currentMission.shortDesc || currentMission.description}
              </p>

              <div className="flex items-center justify-between pt-4 mt-auto">
                <div className="flex flex-col">
                  <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Récompense</span>
                  <span className="text-2xl font-bold text-primary">+{currentMission.xp} XP</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => setCurrentSetIndex((prev) => (prev + 1) % recommendedMissions.length)}
                    className="h-10 w-10 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/5 text-zinc-500 hover:text-white transition-all"
                  >
                    <X className="size-4" />
                  </Button>
                  <Button asChild className="btn-primary-glow h-12 px-6 rounded-2xl text-[11px] font-bold uppercase tracking-widest group/btn">
                    <Link href={`/missions/${currentMission.id}`}>
                      Engager_
                      <ArrowRight className="size-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 border-dashed text-center">
        <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest leading-relaxed">
          Algorithme de recommandation calibré sur ton <br/>
          <span className="text-primary/60 italic">behavioral_vibrancy_signal</span>
        </p>
      </div>
    </div>
  )
}

import { Check } from "lucide-react"
