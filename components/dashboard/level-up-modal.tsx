"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Dialog, 
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Award, Zap, Sparkles, ChevronRight, Share2 } from "lucide-react"
import { toast } from "sonner"
import Confetti from "react-confetti"
import { useWindowSize } from "react-use"

interface LevelUpModalProps {
  currentLevel: number
  userClass: string
}

const LEVEL_NAMES: Record<number, string> = {
  1: "INITIÉ",
  2: "APPRENTI",
  3: "CONFIRMÉ",
  4: "EXPERT",
  5: "ÉLITE",
}

export function LevelUpModal({ currentLevel, userClass }: LevelUpModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { width, height } = useWindowSize()

  useEffect(() => {
    const lastSeenLevel = localStorage.getItem("hashcode_last_level")
    const numericLastLevel = lastSeenLevel ? parseInt(lastSeenLevel) : 1

    if (currentLevel > numericLastLevel) {
      setIsOpen(true)
      setShowConfetti(true)
      localStorage.setItem("hashcode_last_level", currentLevel.toString())
      
      // Auto-hide confetti after 10s
      setTimeout(() => setShowConfetti(false), 10000)
    } else if (!lastSeenLevel) {
      localStorage.setItem("hashcode_last_level", currentLevel.toString())
    }
  }, [currentLevel])

  const levelName = LEVEL_NAMES[currentLevel] || "AGENT"

  const shareProgression = () => {
    const text = `Je viens de passer Niveau ${currentLevel} (${levelName}) sur HASHCODE en tant que ${userClass} ! 🚀\n\nRejoins le réseau et build ton futur tech → https://hashcode.community`
    if (navigator.share) {
      navigator.share({ title: "Montée en grade HASHCODE", text })
    } else {
      navigator.clipboard.writeText(text)
      toast.success("Message de partage copié !")
    }
  }

  return (
    <>
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={200} colors={['#B8FF3B', '#ffffff', '#22D3EE']} />}
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black border-primary/20 text-white max-w-md overflow-hidden p-0">
          <DialogTitle className="sr-only">Niveau Supérieur Atteint</DialogTitle>
          <DialogDescription className="sr-only">Célébration de ton évolution au niveau {currentLevel}.</DialogDescription>
          
          {/* Cyber Header */}
          <div className="relative h-48 bg-zinc-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,255,59,0.15)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="size-24 rounded-3xl bg-primary/10 border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(184,255,59,0.3)]">
                <Award className="size-12 text-primary" />
              </div>
            </motion.div>

            {/* Glowing Orbs */}
            <motion.div 
                animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-10 left-10 size-4 bg-primary/20 blur-xl rounded-full" 
            />
            <motion.div 
                animate={{ x: [0, -30, 0], y: [0, 15, 0] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute bottom-10 right-10 size-6 bg-blue-500/20 blur-xl rounded-full" 
            />
          </div>

          <div className="p-8 text-center space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.2em]">Évolution_Détectée</p>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase">
                Niveau {currentLevel} <span className="text-primary">{levelName}</span>
              </h2>
              <p className="text-zinc-500 text-sm font-light">
                Tes capacités de <strong>{userClass}</strong> ont été officiellement reconnues par le réseau.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex flex-col items-center gap-1">
                <Zap className="size-4 text-primary" />
                <span className="text-[8px] font-mono text-zinc-500 uppercase">Multiplicateur</span>
                <span className="text-sm font-bold text-white">x1.{(currentLevel-1)*2}</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-900 border border-white/5 flex flex-col items-center gap-1">
                <Sparkles className="size-4 text-purple-400" />
                <span className="text-[8px] font-mono text-zinc-500 uppercase">Missions</span>
                <span className="text-sm font-bold text-white">Unlock Rank {currentLevel}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <Button 
                onClick={() => setIsOpen(false)}
                className="btn-primary-glow h-12 rounded-xl font-black uppercase italic tracking-wider flex items-center justify-center gap-2"
              >
                Continuer le Build
                <ChevronRight className="size-4" />
              </Button>
              <Button 
                variant="ghost"
                onClick={shareProgression}
                className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 uppercase tracking-widest gap-2"
              >
                <Share2 className="size-3" /> Partager ma réussite
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
