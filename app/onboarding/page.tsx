"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Globe, Target, ChevronRight,
  Loader2, GraduationCap,
  Laptop, Building2, Rocket,
  RefreshCw, Brain, Sprout,
  Briefcase, Zap,
  Code2,
  Shield, Cloud, Layers,
  Sparkles, Check, AtSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserSituation, MainObjective, TechnicalLevel } from "@/lib/types"
import { toast } from "sonner"
import { CountrySelector } from "@/components/onboarding/country-selector"
import { authClient } from "@/lib/auth-client"
import { hasLocationConsent } from "@/lib/geolocation"

const ONBOARDING_KEY = "hc_onboarding_v2"

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { id: "identity",  icon: AtSign,   phase: "Profil" },
  { id: "level",     icon: Zap,      phase: "Profil" },
  { id: "context",   icon: Globe,    phase: "Profil" },
  { id: "objective", icon: Target,   phase: "Diagnostic" },
]

// ... (Meta sections)

// ─── Meta ─────────────────────────────────────────────────────────────────────

const SITUATION_META: Record<UserSituation, { icon: any; label: string }> = {
  [UserSituation.STUDENT]:       { icon: GraduationCap, label: "Étudiant(e)" },
  [UserSituation.EMPLOYEE]:      { icon: Building2,     label: "Salarié(e)" },
  [UserSituation.SELF_TAUGHT]:   { icon: Brain,         label: "Autodidacte" },
  [UserSituation.RETRAINING]:    { icon: RefreshCw,     label: "En reconversion" },
  [UserSituation.ENTREPRENEUR]:  { icon: Rocket,        label: "Entrepreneur" },
  [UserSituation.FREELANCE]:     { icon: Laptop,        label: "Freelance" },
  [UserSituation.BEGINNER]:      { icon: Sprout,        label: "Je commence" },
}

const OBJECTIVE_META: Record<MainObjective, { icon: any }> = {
  [MainObjective.FIND_JOB]:       { icon: Briefcase },
  [MainObjective.LEARN_CODE]:     { icon: Code2 },
  [MainObjective.CREATE_STARTUP]: { icon: Rocket },
  [MainObjective.FREELANCE]:      { icon: Laptop },
  [MainObjective.MASTER_AI]:      { icon: Brain },
  [MainObjective.CYBERSECURITY]:  { icon: Shield },
  [MainObjective.CLOUD_DEVOPS]:   { icon: Cloud },
  [MainObjective.CREATE_PRODUCTS]:{ icon: Layers },
}

const CLASSES = [
  { name: "Builder",    icon: "🏗️", desc: "Tu construis. Code, produits, systèmes." },
  { name: "Creator",    icon: "🎨", desc: "Tu crées. Design, contenu, narration." },
  { name: "Strategist", icon: "🧠", desc: "Tu analyses. Data, growth, business." },
  { name: "Catalyst",   icon: "⚡", desc: "Tu fédères. Leadership, communauté." },
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSyncing, setIsSyncing] = useState(true)
  const [userName, setUserName] = useState("")
  const [pseudoError, setPseudoError] = useState("")

  const [formData, setFormData] = useState<{
    pseudo: string
    technicalLevel: TechnicalLevel | ""
    country: string
    currentSituation: UserSituation | ""
    mainObjective: MainObjective | ""
  }>(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(ONBOARDING_KEY) : null
      if (saved) return JSON.parse(saved)
    } catch { /* ignore */ }
    return {
      pseudo: "",
      technicalLevel: "",
      country: "",
      currentSituation: "",
      mainObjective: "",
    }
  })

  useEffect(() => {
    async function syncSession() {
      try {
        const res = await authClient.getSession()
        type SessionUser = {
          id: string; name: string; email: string; image?: string | null;
          pseudo?: string | null; technicalLevel?: string | null;
          country?: string | null; currentSituation?: string | null;
          mainObjective?: string | null;
        }
        const user = res.data?.user as SessionUser | undefined
        if (user) {
          setUserName(user.name?.split(" ")[0] || "")
          setFormData(prev => ({
            ...prev,
            pseudo: user.pseudo || prev.pseudo,
            technicalLevel: (user.technicalLevel as TechnicalLevel) || prev.technicalLevel,
            country: user.country || prev.country,
            currentSituation: (user.currentSituation as UserSituation) || prev.currentSituation,
            mainObjective: (user.mainObjective as MainObjective) || prev.mainObjective,
          }))
          // Resume at right step
          if (user.mainObjective) setStep(5)
          else if (user.currentSituation) setStep(4)
          else if (user.technicalLevel) setStep(3)
          else if (user.pseudo) setStep(2)
        }
      } catch (error: unknown) {
        console.error("Session sync failed:", error)
      } finally {
        setIsSyncing(false)
      }
    }
    syncSession()
  }, [])

  const updateForm = (next: typeof formData) => {
    setFormData(next)
    try { localStorage.setItem(ONBOARDING_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  // ─── API saves ──────────────────────────────────────────────────────────────

  const savePartial = async (data: Record<string, any>, onConflict?: () => void) => {
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/onboarding", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (res.status === 401) {
        toast.error("Session expirée. Reconnecte-toi.")
        router.push("/signin")
        throw new Error("Unauthorized")
      }
      if (res.status === 409) {
        const body = await res.json()
        toast.error(body.message || "Ce pseudo est déjà pris.")
        onConflict?.()
        throw new Error("Conflict")
      }
      if (!res.ok) throw new Error("Échec de l'enregistrement")
    } finally {
      setIsSubmitting(false)
    }
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────

  const next = async () => {
    setPseudoError("")
    try {
      if (step === 0) {
        if (hasLocationConsent()) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              fetch("/api/user/location", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  latitude: pos.coords.latitude,
                  longitude: pos.coords.longitude,
                  accuracy: pos.coords.accuracy,
                }),
              }).catch(() => {})
            },
            () => {},
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
          )
        }
        setStep(1)
      } else if (step === 1) {
        // Save pseudo
        await savePartial({ pseudo: formData.pseudo }, () => setPseudoError("Ce pseudo est déjà pris."))
        setStep(2)
      } else if (step === 2) {
        // Save technicalLevel
        await savePartial({ technicalLevel: formData.technicalLevel })
        setStep(3)
      } else if (step === 3) {
        // Save country + situation
        await savePartial({ country: formData.country, currentSituation: formData.currentSituation })
        setStep(4)
      } else if (step === 4) {
        // Final save with objective
        await savePartial({ mainObjective: formData.mainObjective })
        try { localStorage.removeItem(ONBOARDING_KEY) } catch { /* ignore */ }
        try { await authClient.getSession() } catch { /* ignore */ }
        setStep(5)
      } else if (step === 5) {
        // Bridge → quiz
        window.location.href = "/quiz"
      }
    } catch (err: any) {
      if (err.message !== "Unauthorized" && err.message !== "Conflict") {
        toast.error("Erreur de connexion. Vérifie ta connexion.")
      }
    }
  }

  const prev = () => {
    if (step > 0) setStep(step - 1)
  }

  // ─── Validation ─────────────────────────────────────────────────────────────

  const isNextDisabled = () => {
    if (isSubmitting) return true
    if (step === 1) return !formData.pseudo || !/^[a-zA-Z0-9_]{3,20}$/.test(formData.pseudo)
    if (step === 2) return !formData.technicalLevel
    if (step === 3) return !formData.country || !formData.currentSituation
    if (step === 4) return !formData.mainObjective
    return false
  }

  // ─── Progress ───────────────────────────────────────────────────────────────

  const profileSteps = [1, 2, 3, 4]
  const profileProgress = profileSteps.filter(s => s < step).length
  const profileTotal = profileSteps.length

  // ─── Render ─────────────────────────────────────────────────────────────────

  if (isSyncing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,244,65,0.05),transparent_50%)] pointer-events-none" />

      {/* Phase progress bar (only during profile steps 1-4) */}
      {step >= 1 && step <= 4 && (
        <div className="absolute top-0 left-0 w-full">
          <div className="h-0.5 bg-border/30">
            <motion.div
              className="h-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${(profileProgress / profileTotal) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <div className="flex justify-center gap-6 py-3">
            {["Profil", "Diagnostic", "Finalisation"].map((phase, i) => (
              <span
                key={phase}
                className={`text-[9px] font-mono uppercase tracking-widest transition-colors ${
                  i === 0 ? "text-primary" : "text-muted-foreground/40"
                }`}
              >
                {i === 0 ? `${phase} ${profileProgress}/${profileTotal}` : phase}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl z-10 px-4 mt-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="space-y-8"
          >

            {/* ── Step 0: Welcome ─────────────────────────────────────────── */}
            {step === 0 && (
              <div className="text-center space-y-8">
                <div className="space-y-2">
                  <div className="inline-flex p-4 rounded-3xl bg-primary/5 text-primary border border-primary/10 shadow-[0_0_30px_rgba(197,244,65,0.08)] mb-4">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
                    {userName ? `Bienvenue, ${userName} 👋` : "Bienvenue sur HASHCODE 👋"}
                  </h1>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
                    HASHCODE est la plateforme des <span className="text-foreground font-semibold">talents tech africains</span> — profil psychométrique, communauté ciblée, missions concrètes.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 max-w-sm mx-auto">
                  {[
                    { icon: "🎯", label: "Ton profil", sub: "Builder, Creator, Strategist ou Catalyst" },
                    { icon: "🛡️", label: "Ta squad", sub: "Trouve ta communauté" },
                    { icon: "⚡", label: "Des missions", sub: "Progresse concrètement" },
                  ].map(item => (
                    <div key={item.label} className="p-3 rounded-2xl bg-white/2 border border-white/5 text-center space-y-1">
                      <div className="text-xl">{item.icon}</div>
                      <div className="text-[10px] font-bold text-white uppercase tracking-wide">{item.label}</div>
                      <div className="text-[9px] text-zinc-500 leading-tight">{item.sub}</div>
                    </div>
                  ))}
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10">
                  <Loader2 className="w-3 h-3 text-primary" style={{ animation: "none" }} />
                  <span className="text-[10px] font-mono text-primary uppercase tracking-wider">~5 minutes pour créer ton profil</span>
                </div>

                <Button
                  onClick={next}
                  className="btn-primary-glow px-12 h-14 rounded-2xl text-sm font-black uppercase tracking-wider group"
                >
                  Commencer mon profil
                  <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* ── Step 1: Pseudo ──────────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                    <AtSign className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Ton identité HASHCODE</h2>
                  <p className="text-muted-foreground text-sm">Choisis le handle qui te représentera dans la communauté.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground">Ton pseudo</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-mono text-sm">@</span>
                    <Input
                      value={formData.pseudo}
                      onChange={e => {
                        setPseudoError("")
                        const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "")
                        updateForm({ ...formData, pseudo: val })
                      }}
                      placeholder="ton_pseudo"
                      maxLength={20}
                      className="pl-8 h-14 rounded-2xl bg-white/2 border-white/10 font-mono text-base focus:border-primary/50"
                    />
                    {formData.pseudo.length >= 3 && !pseudoError && /^[a-zA-Z0-9_]{3,20}$/.test(formData.pseudo) && (
                      <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                    )}
                  </div>
                  {pseudoError && (
                    <p className="text-xs text-red-400 font-mono">{pseudoError}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground/60">3-20 caractères · lettres, chiffres et _ uniquement</p>

                  {formData.pseudo.length >= 3 && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-xl bg-primary/5 border border-primary/10"
                    >
                      <p className="text-xs text-primary font-mono">
                        Tu apparaîtras comme <span className="font-black">@{formData.pseudo}</span> dans la communauté
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            )}

            {/* ── Step 2: Technical Level ─────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-8">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Ton niveau technique</h2>
                  <p className="text-muted-foreground text-sm">Sois honnête — ça permet d'adapter les missions et le quiz à ton niveau.</p>
                </div>

                <div className="grid gap-3">
                  {[
                    {
                      value: TechnicalLevel.BEGINNER,
                      icon: "🌱",
                      title: "Débutant(e)",
                      desc: "Je commence, moins d'1 an d'expérience tech",
                    },
                    {
                      value: TechnicalLevel.INTERMEDIATE,
                      icon: "⚡",
                      title: "Intermédiaire",
                      desc: "J'ai des bases solides, 1-3 ans d'expérience",
                    },
                    {
                      value: TechnicalLevel.ADVANCED,
                      icon: "🔥",
                      title: "Avancé(e)",
                      desc: "Je ship en production, 3+ ans d'expérience",
                    },
                  ].map(opt => {
                    const isSelected = formData.technicalLevel === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => updateForm({ ...formData, technicalLevel: opt.value })}
                        className={`relative p-5 rounded-2xl border text-left transition-all duration-200 ${
                          isSelected
                            ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(197,244,65,0.08)]"
                            : "bg-white/2 border-white/8 hover:border-primary/30 hover:bg-white/4"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{opt.icon}</span>
                          <div className="flex-1">
                            <p className={`font-bold text-sm ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>{opt.title}</p>
                            <p className="text-[11px] text-muted-foreground/70 mt-0.5">{opt.desc}</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Step 3: Context ─────────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Ton Contexte</h2>
                  <p className="text-muted-foreground text-sm">D'où viens-tu et quelle est ta situation actuelle ?</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground ml-1">Pays</label>
                  <CountrySelector
                    value={formData.country}
                    onChange={val => updateForm({ ...formData, country: val })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground ml-1">Situation Actuelle</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(Object.values(UserSituation) as UserSituation[]).map(sit => {
                      const meta = SITUATION_META[sit]
                      const Icon = meta.icon
                      const isSelected = formData.currentSituation === sit
                      return (
                        <button
                          key={sit}
                          onClick={() => updateForm({ ...formData, currentSituation: sit })}
                          className={`group p-4 rounded-2xl border transition-all duration-200 text-left min-h-[64px] flex items-center gap-3 ${
                            isSelected
                              ? "bg-primary/5 border-primary shadow-[0_0_16px_rgba(197,244,65,0.08)]"
                              : "bg-white/2 border-white/8 hover:border-primary/30 hover:bg-white/4"
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                            isSelected ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className={`text-sm font-medium leading-tight transition-colors ${isSelected ? "text-foreground" : "text-muted-foreground"}`}>
                            {meta.label}
                          </p>
                          {isSelected && <Check className="w-4 h-4 text-primary ml-auto shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Objective ───────────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-3 rounded-2xl bg-primary/5 text-primary border border-primary/10">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter">Ton Objectif Principal</h2>
                  <p className="text-muted-foreground text-sm">Pourquoi rejoins-tu HASHCODE aujourd'hui ?</p>
                </div>

                <div className="grid gap-2">
                  {(Object.values(MainObjective) as MainObjective[]).map(obj => {
                    const meta = OBJECTIVE_META[obj]
                    const Icon = meta.icon
                    const isSelected = formData.mainObjective === obj
                    return (
                      <button
                        key={obj}
                        onClick={() => updateForm({ ...formData, mainObjective: obj })}
                        className={`px-4 py-4 rounded-xl border text-sm transition-all text-left flex items-center gap-3 group min-h-[56px] ${
                          isSelected
                            ? "bg-primary/10 border-primary text-foreground ring-2 ring-primary/20"
                            : "bg-white/2 border-white/8 text-muted-foreground hover:border-primary/30 hover:bg-white/4"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected ? "bg-primary/20 text-primary" : "bg-muted/50 text-muted-foreground"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium flex-1 leading-tight">{obj}</span>
                        {isSelected && <Check className="w-4 h-4 text-primary shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── Step 5: Bridge ──────────────────────────────────────────── */}
            {step === 5 && (
              <div className="text-center space-y-8">
                <div className="space-y-3">
                  <div className="inline-flex p-4 rounded-3xl bg-primary/5 text-primary border border-primary/10 shadow-[0_0_30px_rgba(197,244,65,0.08)]">
                    <Brain className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">Ton Diagnostic de Profil</h2>
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Le quiz analyse ta façon de penser et d'agir pour t'assigner l'une des <span className="text-foreground font-semibold">4 classes HASHCODE</span>.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {CLASSES.map(cls => (
                    <div key={cls.name} className="p-4 rounded-2xl bg-white/2 border border-white/5 text-left space-y-2">
                      <div className="text-2xl">{cls.icon}</div>
                      <div className="font-black text-sm text-white uppercase tracking-wide">{cls.name}</div>
                      <div className="text-[10px] text-zinc-500 leading-relaxed">{cls.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/5 border border-primary/10 text-left">
                  <Sparkles className="w-4 h-4 text-primary shrink-0" />
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <span className="text-primary font-bold">~3 minutes.</span>{" "}
                    Réponds instinctivement — il n'y a pas de bonne ou mauvaise réponse.
                  </p>
                </div>

                <Button
                  onClick={next}
                  disabled={isSubmitting}
                  className="btn-primary-glow px-12 h-14 rounded-2xl text-sm font-black uppercase tracking-wider group w-full"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                    <>
                      Démarrer le diagnostic
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* ── Navigation (steps 1-4) ───────────────────────────────────── */}
            {step >= 1 && step <= 4 && (
              <div className="flex items-center justify-between pt-6 border-t border-border/30">
                <Button
                  variant="ghost"
                  onClick={prev}
                  disabled={isSubmitting}
                  className="font-mono text-xs uppercase tracking-wider"
                >
                  Retour
                </Button>
                <Button
                  onClick={next}
                  disabled={isNextDisabled()}
                  className="btn-primary-glow px-10 h-12 rounded-2xl group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      {step === 4 ? "Terminer le profil" : "Suivant"}
                      <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Privacy note */}
        {step >= 1 && step <= 4 && (
          <p className="mt-8 text-[9px] text-center text-muted-foreground/40 leading-relaxed max-w-sm mx-auto">
            Tes réponses sont utilisées pour personnaliser ton expérience.{" "}
            <a href="/privacy" className="underline hover:text-primary transition-colors">Politique de confidentialité</a>
          </p>
        )}
      </div>
    </div>
  )
}
