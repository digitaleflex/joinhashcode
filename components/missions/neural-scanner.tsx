"use client"

import { useState, useEffect, createElement } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, 
  Search, 
  Cpu,
  Fingerprint,
  Radio
} from "lucide-react"
import { cn } from "@/lib/utils"

interface NeuralScannerProps {
  onComplete: () => void
}

export function NeuralScanner({ onComplete }: NeuralScannerProps) {
  const [step, setStep] = useState(0)
  const steps = [
    { label: "Connexion en cours...", icon: Radio, delay: 1000 },
    { label: "Analyse des profils...", icon: Search, delay: 1500 },
    { label: "Validation...", icon: Fingerprint, delay: 1200 },
    { label: "Détection du bonus...", icon: Zap, delay: 800 },
  ]

  useEffect(() => {
    let currentStep = 0
    const executeSteps = async () => {
      for (const s of steps) {
        setStep(currentStep)
        await new Promise(resolve => setTimeout(resolve, s.delay))
        currentStep++
      }
      onComplete()
    }
    executeSteps()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-8 min-h-[400px]">
      <div className="relative">
        {/* Outer Glow Ring */}
        <motion.div 
          className="absolute -inset-8 rounded-full border border-primary/20 bg-primary/[0.02]"
          animate={{ scale: [1, 1.05, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Scanning Beam */}
        <div className="relative size-32 rounded-3xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
          <motion.div 
            className="absolute inset-0 w-full h-1 bg-primary/40 shadow-[0_0_15px_#B8FF3B]"
            animate={{ top: ["0%", "100%", "0%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              className="relative z-[var(--z-content)] text-primary"
            >
              {createElement(steps[step]?.icon || Cpu, { className: "size-10" })}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-mono text-primary uppercase animate-pulse">
            Analyse en cours...
          </p>
          <h3 className="text-xl font-bold tracking-tighter text-white">
            {steps[step]?.label}
          </h3>
        </div>

        <div className="flex gap-1 justify-center">
          {steps.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 w-8 rounded-full transition-all duration-500",
                i <= step ? "bg-primary shadow-[0_0_8px_#B8FF3B]" : "bg-zinc-800"
              )} 
            />
          ))}
        </div>

      </div>

      <div className="w-full max-w-xs space-y-2">
        <p className="text-3xs font-mono text-zinc-600 text-center uppercase tracking-wider">
          Envoi des données en cours...
        </p>
        <div className="h-0.5 w-full bg-zinc-900 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-zinc-700"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "linear" }}
          />
        </div>
      </div>
    </div>
  )
}

