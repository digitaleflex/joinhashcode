"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { TECH_TREE_V2, type PrimaryDomain, type SubDomain } from "@/lib/types"

type TechnicalLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED"
type PracticeMode = "github" | "ctf_platform" | "learning_platform" | "team"

const MAIN_DOMAINS: { value: PrimaryDomain; label: string; emoji: string }[] = [
  { value: "Web", label: "Développement Web", emoji: "🌐" },
  { value: "Cybersecurity", label: "Cybersécurité", emoji: "🛡️" },
  { value: "Cloud", label: "Cloud & DevOps", emoji: "☁️" },
  { value: "IA", label: "IA & Machine Learning", emoji: "🤖" },
]

const SECONDARY_DOMAINS: { value: PrimaryDomain; label: string; emoji: string }[] = [
  { value: "Mobile", label: "Développement Mobile", emoji: "📱" },
  { value: "Automation", label: "Automatisation", emoji: "⚡" },
  { value: "UI/UX", label: "UI/UX Design", emoji: "🎨" },
  { value: "Web3", label: "Web3 & Blockchain", emoji: "⛓️" },
  { value: "Data", label: "Data Engineering", emoji: "📊" },
  { value: "DevOps", label: "DevOps", emoji: "🔧" },
]

interface SubDomainOption {
  value: SubDomain
  label: string
  description: string
}

const CYBERSEC_SUBDOMAINS: SubDomainOption[] = [
  { value: "offensive", label: "Sécurité offensive", description: "Tests d'intrusion, exploitation de vulnérabilités" },
  { value: "defensive", label: "Sécurité défensive", description: "Surveillance, réponse aux incidents" },
  { value: "appsec", label: "AppSec", description: "Sécurité des applications, code review" },
  { value: "crypto", label: "Cryptographie", description: "Chiffrement, protocoles, analyse" },
]

const WEB_SUBDOMAINS: SubDomainOption[] = [
  { value: "frontend", label: "Frontend", description: "Interfaces utilisateur, animations" },
  { value: "backend", label: "Backend", description: "APIs, bases de données, logique serveur" },
  { value: "fullstack", label: "Fullstack", description: "Du front au back, architecture complète" },
  { value: "web3", label: "Web3 / Décentralisé", description: "DApps, smart contracts, IPFS" },
]

const CLOUD_SUBDOMAINS: SubDomainOption[] = [
  { value: "cloud", label: "Cloud Providers", description: "AWS, GCP, Azure — multi-cloud" },
  { value: "containers", label: "Containers & K8s", description: "Docker, orchestration, scaling" },
  { value: "iac", label: "Infra as Code", description: "Terraform, Pulumi, automatisation infra" },
  { value: "sre", label: "SRE / Observabilité", description: "Monitoring, alerting, fiabilité" },
]

const IA_SUBDOMAINS: SubDomainOption[] = [
  { value: "ml", label: "ML Engineering", description: "Modèles, pipelines, mise en production" },
  { value: "llm", label: "LLM & Agents", description: "LLM, RAG, agents autonomes" },
  { value: "data-eng", label: "Data Engineering", description: "ETL, data pipelines, stockage" },
  { value: "analytics", label: "Analytics", description: "Analyse de données, visualisation" },
]

const LEVEL_OPTIONS: { value: TechnicalLevel; label: string; description: string }[] = [
  { value: "BEGINNER", label: "Débutant", description: "J'apprends les bases, moins d'un an de pratique" },
  { value: "INTERMEDIATE", label: "Intermédiaire", description: "1-3 ans, projets concrets déjà livrés" },
  { value: "ADVANCED", label: "Avancé", description: "3+ ans, expertise approfondie" },
]

const PRACTICE_OPTIONS: { value: PracticeMode; label: string }[] = [
  { value: "github", label: "Projets personnels (GitHub)" },
  { value: "ctf_platform", label: "Challenges / CTF" },
  { value: "learning_platform", label: "Formations en ligne" },
  { value: "team", label: "Équipe / Travail" },
]

const OBJECTIVE_OPTIONS = [
  "Décrocher un premier job / stage",
  "Monter en niveau technique",
  "Lancer un projet entrepreneurial",
  "Contribuer à l'open-source",
  "Construire un portfolio solide",
]

const LEARNING_MODES = [
  "Construire des projets concrets",
  "Résoudre des challenges / CTF",
  "Lire, expérimenter, itérer",
  "Apprendre en pair / mentorat",
]

const CERTIFICATION_OPTIONS = [
  "J'ai des certifications professionnelles",
  "J'ai terminé des parcours certifiants",
  "Je vise une certification prochainement",
  "Apprentissage autonome, sans certification",
]

const EXPERIENCE_OPTIONS = [
  "App en production / audit livré",
  "Projet perso fonctionnel",
  "Projet en cours de développement",
  "Je commence, tout est à construire",
]

interface QuizState {
  currentStep: number
  domain: PrimaryDomain | null
  showSecondaryDomains: boolean
  subDomain: SubDomain | null
  technicalLevel: TechnicalLevel | null
  tools: string[]
  learningTools: string[]
  practiceMode: PracticeMode | null
  objective: string | null
  learningMode: string | null
  certifications: string[]
  experience: string | null
}

interface SpecializationQuizProps {
  pseudo?: string | null
  existingData?: {
    primaryDomain?: string | null
    subDomain?: string | null
    technicalLevel?: string | null
    tools?: string[]
    learningTools?: string[]
    practiceMode?: string | null
    certifications?: string[]
  } | null
}

export function SpecializationQuiz({ pseudo, existingData }: SpecializationQuizProps) {
  const [state, setState] = useState<QuizState>({
    currentStep: 0,
    domain: (existingData?.primaryDomain as PrimaryDomain) ?? null,
    showSecondaryDomains: false,
    subDomain: (existingData?.subDomain as SubDomain) ?? null,
    technicalLevel: (existingData?.technicalLevel as TechnicalLevel) ?? null,
    tools: existingData?.tools ?? [],
    learningTools: existingData?.learningTools ?? [],
    practiceMode: (existingData?.practiceMode as PracticeMode) ?? null,
    objective: null,
    learningMode: null,
    certifications: existingData?.certifications ?? [],
    experience: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)

  const steps = useMemo(() => {
    if (!state.domain) return 1
    return 10
  }, [state.domain])

  const domainTools = useMemo(() => {
    if (!state.domain) return []
    return TECH_TREE_V2[state.domain]?.tools ?? []
  }, [state.domain])

  const availableLearningTools = useMemo(() => {
    return domainTools.filter(t => !state.tools.includes(t))
  }, [domainTools, state.tools])

  const subDomainOptions = useMemo((): SubDomainOption[] => {
    switch (state.domain) {
      case "Cybersecurity": return CYBERSEC_SUBDOMAINS
      case "Web": return WEB_SUBDOMAINS
      case "Cloud": return CLOUD_SUBDOMAINS
      case "IA": return IA_SUBDOMAINS
      default: return []
    }
  }, [state.domain])

  const cybersecPlatforms = ["HackTheBox", "TryHackMe", "Root-Me", "PicoCTF", "CTFtime", "PortSwigger"]

  const update = (partial: Partial<QuizState>) => setState(s => ({ ...s, ...partial }))

  const nextStep = () => {
    if (state.currentStep === 0 && !state.domain) {
      toast.error("Choisis un domaine principal")
      return
    }
    if (state.currentStep === 1 && !state.subDomain && subDomainOptions.length > 0) {
      toast.error("Choisis un sous-domaine")
      return
    }
    if (state.currentStep === 2 && !state.technicalLevel) {
      toast.error("Sélectionne ton niveau")
      return
    }
    setState(s => ({ ...s, currentStep: s.currentStep + 1 }))
  }

  const prevStep = () => setState(s => ({ ...s, currentStep: Math.max(0, s.currentStep - 1) }))

  const toggleTool = (tool: string) => {
    setState(s => {
      const has = s.tools.includes(tool)
      if (has) return { ...s, tools: s.tools.filter(t => t !== tool) }
      if (s.tools.length >= 5) {
        toast.error("Maximum 5 outils")
        return s
      }
      return { ...s, tools: [...s.tools, tool] }
    })
  }

  const toggleLearningTool = (tool: string) => {
    setState(s => {
      const has = s.learningTools.includes(tool)
      if (has) return { ...s, learningTools: s.learningTools.filter(t => t !== tool) }
      if (s.learningTools.length >= 3) {
        toast.error("Maximum 3 outils en apprentissage")
        return s
      }
      return { ...s, learningTools: [...s.learningTools, tool] }
    })
  }

  const toggleCertification = (cert: string) => {
    setState(s => {
      const has = s.certifications.includes(cert)
      if (has) return { ...s, certifications: s.certifications.filter(c => c !== cert) }
      if (s.certifications.length >= 5) return s
      return { ...s, certifications: [...s.certifications, cert] }
    })
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const res = await fetch("/api/specialization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          primaryDomain: state.domain,
          subDomain: state.subDomain,
          technicalLevel: state.technicalLevel,
          tools: state.tools,
          learningTools: state.learningTools,
          practiceMode: state.practiceMode,
          certifications: state.certifications,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: "Erreur inconnue" }))
        throw new Error(err.message || "Erreur serveur")
      }
      setIsDone(true)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Erreur inconnue"
      toast.error(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isDone) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg mx-auto py-20 px-4 text-center"
      >
        <div className="size-20 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle2 className="size-10 text-primary" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-4">
          Spécialisation enregistrée
        </h2>
        <p className="text-sm text-zinc-400 mb-8">
          {pseudo ? `@${pseudo}, ` : ""}ton parcours est maintenant personnalisé avec des missions adaptées à ton domaine.
        </p>
        <Button onClick={() => window.location.href = "/dashboard"} className="gap-2">
          <Sparkles className="size-4" />
          Accéder au dashboard
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono uppercase text-primary/60">
            [ SPÉCIALISATION ]
          </span>
          <span className="text-[10px] font-mono text-zinc-500">
            Q{state.currentStep + 1}/{steps}
          </span>
        </div>
        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${((state.currentStep + 1) / steps) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Q0 — Domaine principal */}
        {state.currentStep === 0 && (
          <motion.div key="q0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Quel est ton domaine principal ?
            </h3>
            <p className="text-xs text-zinc-500">Choisis le domaine qui correspond le mieux à ton parcours</p>
            <div className="space-y-3">
              {MAIN_DOMAINS.map(d => (
                <button
                  key={d.value}
                  onClick={() => update({ domain: d.value, showSecondaryDomains: false, subDomain: null, tools: [], learningTools: [] })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    state.domain === d.value
                      ? "border-primary bg-primary/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <span className="text-lg mr-3">{d.emoji}</span>
                  <span className="text-sm font-bold text-white">{d.label}</span>
                </button>
              ))}
            </div>
            {!state.showSecondaryDomains && (
              <button
                onClick={() => update({ showSecondaryDomains: true })}
                className="text-xs text-primary font-mono uppercase hover:underline"
              >
                + Voir plus de domaines
              </button>
            )}
            {state.showSecondaryDomains && (
              <div className="space-y-3 pt-2">
                {SECONDARY_DOMAINS.map(d => (
                  <button
                    key={d.value}
                    onClick={() => update({ domain: d.value, showSecondaryDomains: false, subDomain: null, tools: [], learningTools: [] })}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      state.domain === d.value
                        ? "border-primary bg-primary/5"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <span className="text-lg mr-3">{d.emoji}</span>
                    <span className="text-sm font-bold text-white">{d.label}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Q1 — Sous-domaine */}
        {state.currentStep === 1 && subDomainOptions.length > 0 && (
          <motion.div key="q1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Quelle est ta spécialité dans {state.domain} ?
            </h3>
            <div className="space-y-3">
              {subDomainOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update({ subDomain: opt.value })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    state.subDomain === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <div className="text-sm font-bold text-white">{opt.label}</div>
                  <div className="text-xs text-zinc-500 mt-1">{opt.description}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skip subdomain if none available */}
        {state.currentStep === 1 && subDomainOptions.length === 0 && (
          <motion.div key="q1-skip" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Spécialité
            </h3>
            <p className="text-xs text-zinc-500">Pas de sous-domaine spécifique pour {state.domain} — on passe à la suite.</p>
          </motion.div>
        )}

        {/* Q2 — Niveau */}
        {state.currentStep === 2 && (
          <motion.div key="q2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Quel est ton niveau actuel ?
            </h3>
            <p className="text-xs text-zinc-500">Sois honnête — ça nous aide à te recommander les bonnes missions</p>
            <div className="space-y-3">
              {LEVEL_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update({ technicalLevel: opt.value })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    state.technicalLevel === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <div className="text-sm font-bold text-white">{opt.label}</div>
                  <div className="text-xs text-zinc-500 mt-1">{opt.description}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Q3 — Outils maîtrisés */}
        {state.currentStep === 3 && (
          <motion.div key="q3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Quels outils maîtrises-tu ?
            </h3>
            <p className="text-xs text-zinc-500">Sélectionne jusqu&apos;à 5 outils ({state.tools.length}/5)</p>
            <div className="grid grid-cols-2 gap-2">
              {domainTools.map(tool => (
                <button
                  key={tool}
                  onClick={() => toggleTool(tool)}
                  className={`p-3 rounded-lg border text-xs font-medium transition-all text-left ${
                    state.tools.includes(tool)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/10"
                  }`}
                >
                  {tool}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Q4 — Outils en apprentissage */}
        {state.currentStep === 4 && (
          <motion.div key="q4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Quels outils apprends-tu en ce moment ?
            </h3>
            <p className="text-xs text-zinc-500">Sélectionne jusqu&apos;à 3 ({state.learningTools.length}/3)</p>
            {availableLearningTools.length > 0 ? (
              <div className="grid grid-cols-2 gap-2">
                {availableLearningTools.map(tool => (
                  <button
                    key={tool}
                    onClick={() => toggleLearningTool(tool)}
                    className={`p-3 rounded-lg border text-xs font-medium transition-all text-left ${
                      state.learningTools.includes(tool)
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/10"
                    }`}
                  >
                    {tool}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-zinc-500">Tous les outils sont déjà sélectionnés comme maîtrisés.</p>
            )}
          </motion.div>
        )}

        {/* Q5 — Plateforme de pratique */}
        {state.currentStep === 5 && (
          <motion.div key="q5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Où pratiques-tu principalement ?
            </h3>
            <div className="space-y-3">
              {PRACTICE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => update({ practiceMode: opt.value })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    state.practiceMode === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <span className="text-sm font-bold text-white">{opt.label}</span>
                </button>
              ))}
            </div>
            {state.domain === "Cybersecurity" && state.practiceMode === "ctf_platform" && (
              <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <p className="text-[10px] font-mono uppercase text-primary/60 mb-2">Plateformes recommandées</p>
                <div className="flex flex-wrap gap-2">
                  {cybersecPlatforms.map(p => (
                    <span key={p} className="text-xs px-2 py-1 rounded bg-white/5 text-zinc-400">{p}</span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Q6 — Objectif */}
        {state.currentStep === 6 && (
          <motion.div key="q6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Quel est ton objectif dans cette spécialisation ?
            </h3>
            <div className="space-y-3">
              {OBJECTIVE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => update({ objective: opt })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    state.objective === opt
                      ? "border-primary bg-primary/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <span className="text-sm font-bold text-white">{opt}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Q7 — Mode d'apprentissage */}
        {state.currentStep === 7 && (
          <motion.div key="q7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Comment apprends-tu le mieux ?
            </h3>
            <div className="space-y-3">
              {LEARNING_MODES.map(opt => (
                <button
                  key={opt}
                  onClick={() => update({ learningMode: opt })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    state.learningMode === opt
                      ? "border-primary bg-primary/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <span className="text-sm font-bold text-white">{opt}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Q8 — Certifications */}
        {state.currentStep === 8 && (
          <motion.div key="q8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Quel est ton parcours de certification ?
            </h3>
            <p className="text-xs text-zinc-500">Sélectionne tout ce qui s&apos;applique</p>
            <div className="space-y-3">
              {CERTIFICATION_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => toggleCertification(opt)}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    state.certifications.includes(opt)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <span className="text-sm font-bold">{opt}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Q9 — Expérience terrain */}
        {state.currentStep === 9 && (
          <motion.div key="q9" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tighter text-white">
              Quelle est ton expérience terrain ?
            </h3>
            <p className="text-xs text-zinc-500">
              {state.domain === "Cybersecurity"
                ? "As-tu déjà livré un audit ou un pentest ?"
                : "As-tu déjà mis en production un projet ?"}
            </p>
            <div className="space-y-3">
              {EXPERIENCE_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => update({ experience: opt })}
                  className={`w-full p-4 rounded-xl border text-left transition-all ${
                    state.experience === opt
                      ? "border-primary bg-primary/5"
                      : "border-white/5 bg-white/[0.02] hover:border-white/10"
                  }`}
                >
                  <span className="text-sm font-bold text-white">{opt}</span>
                </button>
              ))}
            </div>
            {/* Submit button on last step */}
            <div className="pt-6">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full gap-2"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4" />
                    Terminer la spécialisation
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation — hidden on last step (submit button takes over) */}
      {state.currentStep < 9 && (
        <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={state.currentStep === 0}
            className="gap-2 text-zinc-400"
          >
            <ChevronLeft className="size-4" />
            Précédent
          </Button>
          <Button onClick={nextStep} className="gap-2">
            {state.currentStep === steps - 1 ? "Terminer" : "Suivant"}
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
