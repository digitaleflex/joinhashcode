"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Rocket, Sparkles, Loader2, ChevronRight, 
  Target, AlertCircle, Brain, Layout, 
  Palette, TrendingUp, Users, HeartPulse, 
  Leaf, CreditCard, Terminal, HelpCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const FOCUS_DOMAINS = [
  { id: "tech", label: "Tech / Code", icon: Terminal },
  { id: "design", label: "Design / UI-UX", icon: Palette },
  { id: "business", label: "Business / Stratégie", icon: TrendingUp },
  { id: "content", label: "Contenu / Vidéo", icon: Layout },
  { id: "education", label: "Éducation / Formation", icon: Brain },
  { id: "health", label: "Santé / Bien-être", icon: HeartPulse },
  { id: "fintech", label: "Fintech / Finance", icon: CreditCard },
  { id: "ecology", label: "Écologie / Impact", icon: Leaf },
  { id: "community", label: "Communauté / Réseau", icon: Users },
  { id: "other", label: "Autre", icon: HelpCircle },
]

const BLOCKERS = [
  { id: "skills", label: "Manque de compétences techniques" },
  { id: "network", label: "Manque de visibilité / réseau" },
  { id: "clarity", label: "Manque de clarté sur ma direction" },
  { id: "time", label: "Manque de temps / organisation" },
  { id: "resources", label: "Manque de ressources / financement" },
  { id: "other", label: "Autre" },
]

export default function PostQuizOnboarding() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    dreamStatement: "",
    currentFocus: [] as string[],
    mainBlocker: "",
  })

  const toggleDomain = (id: string) => {
    setFormData(prev => ({
      ...prev,
      currentFocus: prev.currentFocus.includes(id)
        ? prev.currentFocus.filter(d => d !== id)
        : [...prev.currentFocus, id]
    }))
  }

  const handleComplete = async () => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/onboarding/post-quiz", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save")

      toast.success("Configuration terminée !")
      // Check for a pending squad invite set before the user went through sign-up
      const pendingCookie = document.cookie.split(";").find(c => c.trim().startsWith("pending-squad="))
      const rawSlug = pendingCookie?.split("=")[1]?.trim()
      // Validate slug: only lowercase alphanum + hyphens, 3–30 chars — rejects tampered cookies
      const safeSlug = rawSlug && /^[a-z0-9-]{3,30}$/.test(rawSlug) ? rawSlug : null
      window.location.href = safeSlug ? `/invite/${safeSlug}` : "/dashboard"
    } catch (error) {
      toast.error("Une erreur est survenue")
    } finally {
      setIsSubmitting(false)
    }
  }

  const next = () => {
    if (step < 2) setStep(step + 1)
    else handleComplete()
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,244,65,0.05),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-2xl z-10 px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-10"
          >
            <div className="text-center space-y-4">
              <div className="inline-flex p-4 rounded-3xl bg-primary/5 text-primary mb-2 border border-primary/10">
                {step === 0 && <Rocket className="w-8 h-8" />}
                {step === 1 && <Target className="w-8 h-8" />}
                {step === 2 && <AlertCircle className="w-8 h-8" />}
              </div>
              <div className="space-y-2">
                <h1 className="text-xl font-bold tracking-tight uppercase font-mono">
                  {step === 0 && "Ton Rêve à 12 Mois"}
                  {step === 1 && "Tes Domaines de Focus"}
                  {step === 2 && "Ton Principal Obstacle"}
                </h1>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {step === 0 && "Si tout se passe comme tu le veux, où en es-tu dans un an ?"}
                  {step === 1 && "Sur quoi concentres-tu ton énergie en ce moment ?"}
                  {step === 2 && "Qu'est-ce qui t'empêche d'avancer plus vite ?"}
                </p>
              </div>
            </div>

            <div className="min-h-[300px] flex flex-col justify-center">
              {step === 0 && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <Textarea
                    placeholder="Ex: J'ai lancé mon SaaS et je vis de mes revenus, je suis devenu Senior Dev dans une boîte de cybersécurité..."
                    value={formData.dreamStatement}
                    onChange={(e) => setFormData({ ...formData, dreamStatement: e.target.value })}
                    className={cn(
                      "min-h-[150px] bg-card/20 border-border/40 text-lg p-6 rounded-2xl transition-all",
                      formData.dreamStatement.length > 0 && formData.dreamStatement.length < 10 && "border-amber-500/50 focus-visible:ring-amber-500/50"
                    )}
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center">
                    <p className="text-[10px] font-mono text-amber-500">
                      {formData.dreamStatement.length > 0 && formData.dreamStatement.length < 10 && (
                        <span className="flex items-center gap-1">
                          <AlertCircle className="size-3" /> Minimum 10 caractères requis
                        </span>
                      )}
                    </p>
                    <p className={cn(
                      "text-[10px] font-mono",
                      formData.dreamStatement.length >= 10 ? "text-primary" : "text-muted-foreground"
                    )}>
                      {formData.dreamStatement.length} / 200
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {FOCUS_DOMAINS.map((domain) => {
                      const Icon = domain.icon
                      const isSelected = formData.currentFocus.includes(domain.id)
                      return (
                        <button
                          key={domain.id}
                          onClick={() => toggleDomain(domain.id)}
                          className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                            isSelected 
                            ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(197,244,65,0.1)]" 
                            : "bg-card/20 border-border/40 hover:border-primary/30"
                          }`}
                        >
                          <Icon className="w-6 h-6" />
                          <span className="text-xs font-medium">{domain.label}</span>
                        </button>
                      )
                    })}
                  </div>
                  {formData.currentFocus.length === 0 && (
                    <p className="text-[10px] font-mono text-amber-500 text-center flex items-center justify-center gap-1">
                      <AlertCircle className="size-3" /> Sélectionne au moins un domaine pour continuer
                    </p>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-in fade-in duration-500">
                  <div className="space-y-3">
                    {BLOCKERS.map((blocker) => (
                      <button
                        key={blocker.id}
                        onClick={() => setFormData({ ...formData, mainBlocker: blocker.id })}
                        className={`w-full p-4 rounded-xl border text-left transition-all ${
                          formData.mainBlocker === blocker.id 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "bg-card/20 border-border/40 hover:border-primary/30"
                        }`}
                      >
                        <span className="text-sm font-medium">{blocker.label}</span>
                      </button>
                    ))}
                  </div>
                  {!formData.mainBlocker && (
                    <p className="text-[10px] font-mono text-amber-500 text-center flex items-center justify-center gap-1">
                      <AlertCircle className="size-3" /> Choisis ton obstacle principal
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pt-8 border-t border-border/50">
                <Button 
                  variant="ghost" 
                  onClick={() => setStep(step - 1)}
                  disabled={step === 0 || isSubmitting}
                  className="font-mono text-xs uppercase tracking-wider"
                >
                  Retour
                </Button>
                <Button 
                  onClick={next}
                  disabled={
                    isSubmitting || 
                    (step === 0 && formData.dreamStatement.length < 10) ||
                    (step === 1 && formData.currentFocus.length === 0) ||
                    (step === 2 && !formData.mainBlocker)
                  }
                  className="btn-primary-glow px-10 h-12 rounded-2xl group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {step === 2 ? "Valider mon profil" : "Suivant"}
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase bg-muted/30 px-3 py-1 rounded-full border border-border/50">
            <Sparkles className="w-3 h-3 text-primary" />
            Phase Finale d&apos;Analyse
          </div>
        </div>
      </div>
    </div>
  )
}
