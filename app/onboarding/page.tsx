"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Globe, Briefcase, Target, ChevronRight, 
  Loader2, Check, Sparkles 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  UserSituation, 
  MainObjective 
} from "@/lib/types"
import { toast } from "sonner"

const STEPS = [
  {
    id: "context",
    title: "Ton Contexte",
    description: "D'où viens-tu et quelle est ta situation actuelle ?",
    icon: Globe
  },
  {
    id: "objective",
    title: "Ton Objectif",
    description: "Pourquoi rejoins-tu HASHCODE aujourd'hui ?",
    icon: Target
  }
]

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    country: "",
    currentSituation: "" as UserSituation,
    mainObjective: "" as MainObjective,
  })

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast.success("Profil initial configuré !")
      router.push("/quiz") // Next step in the flow
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else handleComplete()
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,244,65,0.05),transparent_50%)] pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-1 bg-border/50">
        <motion.div 
          className="h-full bg-primary"
          initial={{ width: "0%" }}
          animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-xl z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-4 border border-primary/20">
                {(() => {
                  const Icon = STEPS[step].icon;
                  return Icon ? <Icon className="w-6 h-6" /> : null;
                })()}
              </div>
              <h1 className="text-3xl font-bold tracking-tight uppercase font-mono">
                {STEPS[step].title}
              </h1>
              <p className="text-muted-foreground">
                {STEPS[step].description}
              </p>
            </div>

            <div className="grid gap-4">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">Pays</label>
                    <input 
                      type="text"
                      placeholder="ex: France, Canada, Sénégal..."
                      className="w-full bg-card/50 border border-border/50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={formData.country}
                      onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-mono uppercase tracking-widest text-muted-foreground ml-1">Situation Actuelle</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.values(UserSituation).map((sit) => (
                        <button
                          key={sit}
                          onClick={() => setFormData({ ...formData, currentSituation: sit })}
                          className={`px-4 py-3 rounded-xl border text-sm transition-all text-left flex items-center justify-between ${
                            formData.currentSituation === sit 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-card/50 border-border/50 text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          {sit}
                          {formData.currentSituation === sit && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-3">
                  <div className="grid gap-2">
                    {Object.values(MainObjective).map((obj) => (
                      <button
                        key={obj}
                        onClick={() => setFormData({ ...formData, mainObjective: obj })}
                        className={`px-4 py-4 rounded-xl border text-sm transition-all text-left flex items-center justify-between ${
                          formData.mainObjective === obj 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "bg-card/50 border-border/50 text-muted-foreground hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Target className={`w-4 h-4 ${formData.mainObjective === obj ? "text-primary" : "text-muted-foreground"}`} />
                          {obj}
                        </div>
                        {formData.mainObjective === obj && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-8 border-t border-border/50">
              <Button 
                variant="ghost" 
                onClick={prev}
                disabled={step === 0 || isSubmitting}
                className="font-mono text-xs uppercase tracking-widest"
              >
                Retour
              </Button>
              <Button 
                onClick={next}
                disabled={isSubmitting || (step === 0 && (!formData.country || !formData.currentSituation)) || (step === 1 && !formData.mainObjective)}
                className="group shadow-[0_0_20px_rgba(197,244,65,0.15)] px-8"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    {step === STEPS.length - 1 ? "Terminer" : "Suivant"}
                    <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase tracking-[0.2em] bg-muted/30 px-3 py-1 rounded-full border border-border/50">
            <Sparkles className="w-3 h-3 text-primary" />
            Étape {step + 1} / {STEPS.length}
          </div>
        </div>
      </div>
    </div>
  )
}
