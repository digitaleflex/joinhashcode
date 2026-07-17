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

interface LevelUpModalProps {
  currentLevel: number
  userClass: string
}

const LEVEL_NAMES: Record<number, string> = {
  1: "INITIÉ du Réseau",
  2: "OPÉRATEUR Core",
  3: "ARCHITECTE Confirmé",
  4: "COMMANDANT Expert",
  5: "LÉGENDE du Réseau",
}

const CLASS_QUOTES: Record<string, string> = {
  builder: "Le code est ta loi. Ton empire se construit une brique à la fois.",
  creator: "Tu vois l'invisible. Ton imagination redéfinit la réalité.",
  strategist: "L'ordre naît de ta vision. Rien ne résiste à ta méthode.",
  catalyst: "Tu es l'étincelle. Ton énergie transforme l'inertie en mouvement.",
}

export function LevelUpModal({ currentLevel, userClass }: LevelUpModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const lastSeenLevel = localStorage.getItem("hashcode_last_level")
    const numericLastLevel = lastSeenLevel ? parseInt(lastSeenLevel) : 1

    if (currentLevel > numericLastLevel) {
      setIsOpen(true)
      localStorage.setItem("hashcode_last_level", currentLevel.toString())
    } else if (!lastSeenLevel) {
      localStorage.setItem("hashcode_last_level", currentLevel.toString())
    }
  }, [currentLevel])

  const levelName = LEVEL_NAMES[currentLevel] || "AGENT Habilité"
  const quote = CLASS_QUOTES[userClass.toLowerCase()] || "Ton évolution renforce le réseau HASHCODE."

  const shareProgression = () => {
    const text = `GRADE SUPÉRIEUR ATTEINT ! Je suis désormais ${levelName} (${userClass}) sur HASHCODE. 🚀\n\nPrêt pour les prochaines missions tech → https://hashcode.community`
    if (navigator.share) {
      navigator.share({ title: "Évolution de Grade HASHCODE", text })
    } else {
      navigator.clipboard.writeText(text)
      toast.success("Message de prestige copié !")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-black border-primary/20 text-white max-w-md overflow-hidden p-0 rounded-[2.5rem]">
          <DialogTitle className="sr-only">Niveau Supérieur Atteint</DialogTitle>
          <DialogDescription className="sr-only">Célébration de ton évolution au niveau {currentLevel}.</DialogDescription>
          
          {/* Cyber Header */}
          <div className="relative h-56 bg-zinc-900 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(184,255,59,0.2)_0%,transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px]" />
            
            <motion.div
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="size-28 rounded-[2rem] bg-primary/10 border-2 border-primary flex items-center justify-center shadow-[0_0_50px_rgba(184,255,59,0.4)]">
                <Award className="size-14 text-primary animate-pulse" />
              </div>
            </motion.div>

            {/* Scanning Effect */}
            <motion.div 
              initial={{ top: "0%" }}
              animate={{ top: "100%" }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 w-full h-px bg-primary/30 z-20 shadow-[0_0_10px_rgba(184,255,59,0.5)]"
            />
          </div>

          <div className="p-8 text-center space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] font-mono font-black text-primary uppercase tracking-[0.3em]">Grade_Supérieur_Débloqué</p>
              <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                {levelName}
              </h2>
              <div className="h-1 w-12 bg-primary/40 mx-auto rounded-full" />
              <p className="text-zinc-500 text-xs font-mono italic px-4">
                "{quote}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex flex-col items-center gap-1.5 group hover:bg-white/5 transition-colors">
                <Zap className="size-5 text-primary" />
                <div className="text-center">
                  <p className="text-[8px] font-mono text-zinc-500 uppercase">Gain XP Boost</p>
                  <p className="text-sm font-black text-white">+{(currentLevel-1)*10}%</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-white/2 border border-white/5 flex flex-col items-center gap-1.5 group hover:bg-white/5 transition-colors">
                <Sparkles className="size-5 text-purple-400" />
                <div className="text-center">
                  <p className="text-[8px] font-mono text-zinc-500 uppercase">Habilitation</p>
                  <p className="text-sm font-black text-white">RANG {currentLevel}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <Button 
                onClick={() => setIsOpen(false)}
                className="btn-primary-glow h-14 rounded-2xl font-black uppercase italic tracking-wider flex items-center justify-center gap-3 text-sm"
              >
                ACCÉDER AU NIVEAU {currentLevel}
                <ChevronRight className="size-5" />
              </Button>
              <Button 
                variant="ghost"
                onClick={shareProgression}
                className="text-[10px] font-mono text-zinc-600 hover:text-zinc-400 uppercase tracking-[0.2em] gap-2 py-4"
              >
                <Share2 className="size-3" /> Transmettre ma réussite
              </Button>
            </div>
          </div>
        </DialogContent>
    </Dialog>
  )
}
