"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Globe, Briefcase, Target, ChevronRight, 
  Loader2, Check, Sparkles, GraduationCap, 
  Laptop, Building2, Rocket, Coffee, 
  RefreshCw, Brain, Lightbulb
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  UserSituation, 
  MainObjective 
} from "@/lib/types"
import { toast } from "sonner"
import { CountrySelector } from "@/components/onboarding/country-selector"
import { track } from "@vercel/analytics"
import { authClient } from "@/lib/auth-client"

const ONBOARDING_KEY = "hc_onboarding_progress";

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
  const [isSyncing, setIsSyncing] = useState(true)

  const [formData, setFormData] = useState<{
    country: string;
    currentSituation: UserSituation;
    mainObjective: MainObjective;
    secondaryObjectives: MainObjective[];
  }>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(ONBOARDING_KEY) : null;
      if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return {
      country: "",
      currentSituation: "" as UserSituation,
      mainObjective: "" as MainObjective,
      secondaryObjectives: [] as MainObjective[],
    };
  })

  // Sync with DB on mount - use direct API fetch to bypass stale cache
  useEffect(() => {
    async function syncSession() {
      try {
        const res = await authClient.getSession();
        const session = res.data;
        if (session?.user) {
          const user = session.user as any;
          if (user.currentSituation || user.country) {
            setFormData(prev => ({
              ...prev,
              country: user.country || prev.country,
              currentSituation: (user.currentSituation as UserSituation) || prev.currentSituation,
              mainObjective: (user.mainObjective as MainObjective) || prev.mainObjective,
              secondaryObjectives: (user.secondaryObjectives as MainObjective[]) || prev.secondaryObjectives,
            }));
            
            if (user.currentSituation) {
              setStep(1);
            }
          }
        }
      } catch (err) {
        console.error("Session sync failed:", err);
      } finally {
        setIsSyncing(false);
      }
    }
    syncSession();
  }, []);

  const updateForm = (next: typeof formData) => {
    setFormData(next);
    try { localStorage.setItem(ONBOARDING_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save")

      try { localStorage.removeItem(ONBOARDING_KEY); } catch { /* ignore */ }
      track("onboarding_completed", { situation: formData.currentSituation, objective: formData.mainObjective });
      toast.success("Profil initial configuré !")
      
      // Force refresh Better Auth session so cookies updated in browser immediately
      try {
        await authClient.getSession();
      } catch (err) {
        console.error("Session refresh failed:", err);
      }

      window.location.href = "/quiz"
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  const saveStepProgress = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country: formData.country,
          currentSituation: formData.currentSituation,
        }),
      })

      if (res.status === 401) {
        toast.error("Session expirée. Veuillez vous reconnecter.");
        router.push("/signin");
        throw new Error("Unauthorized");
      }

      if (!res.ok) throw new Error("Partial save failed")
    } catch (error: any) {
      if (error.message !== "Unauthorized") {
        toast.error("Erreur de sauvegarde. Vérifiez votre connexion.");
      }
      throw error;
    } finally {
      setIsSubmitting(false)
    }
  }

  const next = async () => {
    try {
      if (step === 0) {
        await saveStepProgress()
        setStep(1)
      } else if (step < STEPS.length - 1) {
        setStep(step + 1)
      } else {
        await handleComplete()
      }
    } catch (err) {
      console.error("Step navigation failed:", err);
    }
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
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

      <div className="w-full max-w-2xl z-10 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-3xl bg-primary/5 text-primary mb-2 border border-primary/10 shadow-[0_0_30px_rgba(197,244,65,0.05)]">
                {(() => {
                  const Icon = STEPS[step].icon;
                  return Icon ? <Icon className="w-8 h-8" /> : null;
                })()}
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight uppercase font-mono text-foreground">
                  {STEPS[step].title}
                </h1>
                <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                  {STEPS[step].description}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {step === 0 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground ml-1">Pays</label>
                    <CountrySelector 
                      value={formData.country}
                      onChange={(val) => updateForm({ ...formData, country: val })}
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground ml-1">Situation Actuelle</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(Object.values(UserSituation) as UserSituation[]).map((sit) => {
                        const Icon = {
                          [UserSituation.STUDENT]: GraduationCap,
                          [UserSituation.FREELANCE]: Laptop,
                          [UserSituation.EMPLOYEE]: Building2,
                          [UserSituation.ENTREPRENEUR]: Rocket,
                          [UserSituation.UNEMPLOYED]: Coffee,
                          [UserSituation.RETRAINING]: RefreshCw,
                          [UserSituation.SELF_TAUGHT]: Brain,
                          [UserSituation.PROJECT_LEAD]: Lightbulb,
                        }[sit] || Briefcase;

                        const isSelected = formData.currentSituation === sit;

                        return (
                          <button
                            key={sit}
                            onClick={() => updateForm({ ...formData, currentSituation: sit })}
                            className={`group relative p-4 rounded-2xl border transition-all duration-300 text-left overflow-hidden ${
                              isSelected 
                              ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(197,244,65,0.1)]" 
                              : "bg-card/20 border-border/40 hover:border-primary/30 hover:bg-card/40"
                            }`}
                          >
                            <div className="relative z-10 flex flex-col gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                isSelected ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground group-hover:text-primary/70"
                              }`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="space-y-1">
                                <p className={`text-sm font-medium transition-colors ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                                  {sit}
                                </p>
                              </div>
                            </div>
                            {isSelected && (
                              <motion.div 
                                layoutId="active-bg"
                                className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent pointer-events-none"
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-primary text-center">
                      Sélectionnez 1 objectif principal + jusqu&apos;à 2 secondaires
                    </p>
                  </div>
                  <div className="grid gap-2">
                    {(Object.values(MainObjective) as MainObjective[]).map((obj) => {
                      const isMain = formData.mainObjective === obj
                      const isSecondary = formData.secondaryObjectives.includes(obj)
                      
                      const handleToggle = () => {
                        if (isMain) {
                          updateForm({ ...formData, mainObjective: "" as MainObjective })
                        } else if (isSecondary) {
                          updateForm({
                            ...formData,
                            secondaryObjectives: formData.secondaryObjectives.filter((o: MainObjective) => o !== obj)
                          })
                        } else if (!formData.mainObjective) {
                          updateForm({ ...formData, mainObjective: obj })
                        } else if (formData.secondaryObjectives.length < 2) {
                          updateForm({
                            ...formData,
                            secondaryObjectives: [...formData.secondaryObjectives, obj]
                          })
                        } else {
                          toast.error("Maximum 2 objectifs secondaires")
                        }
                      }

                      return (
                        <button
                          key={obj}
                          onClick={handleToggle}
                          className={`px-4 py-4 rounded-xl border text-sm transition-all text-left flex items-center justify-between group ${
                            isMain 
                            ? "bg-primary/10 border-primary text-primary ring-2 ring-primary/20" 
                            : isSecondary
                            ? "bg-primary/5 border-primary/40 text-primary/80 border-dashed"
                            : "bg-card/50 border-border/50 text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Target className={`w-4 h-4 transition-colors ${isMain || isSecondary ? "text-primary" : "text-muted-foreground group-hover:text-primary/50"}`} />
                            <div className="flex flex-col">
                              <span className="font-medium">{obj}</span>
                              {isMain && <span className="text-[9px] uppercase tracking-tighter opacity-70">Objectif Principal</span>}
                              {isSecondary && <span className="text-[9px] uppercase tracking-tighter opacity-70">Objectif Secondaire</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isMain && <Check className="w-4 h-4" />}
                            {isSecondary && <div className="w-2 h-2 rounded-full bg-primary/40" />}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between pt-8 border-t border-border/50">
                <Button 
                  variant="ghost" 
                  onClick={prev}
                  disabled={step === 0 || isSubmitting}
                  className="font-mono text-xs uppercase tracking-wider"
                >
                  Retour
                </Button>
                <Button 
                  onClick={next}
                  disabled={isSubmitting || (step === 0 && (!formData.country || !formData.currentSituation)) || (step === 1 && !formData.mainObjective)}
                  className="btn-primary-glow px-10 h-12 rounded-2xl group"
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
              
              <p className="text-[10px] text-center text-muted-foreground/60 leading-relaxed max-w-sm mx-auto">
                En poursuivant, vous acceptez que HASHCODE utilise vos réponses et interactions afin de <span className="text-muted-foreground">personnaliser votre expérience d&apos;apprentissage</span>. 
                Consultez notre <a href="/privacy" className="underline hover:text-primary transition-colors">Politique de Confidentialité</a>.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase bg-muted/30 px-3 py-1 rounded-full border border-border/50">
            <Sparkles className="w-3 h-3 text-primary" />
            Étape {step + 1} / {STEPS.length}
          </div>
        </div>
      </div>
    </div>
  )
}
