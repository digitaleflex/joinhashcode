"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, 
  Cpu, 
  Target, 
  ChevronRight, 
  Check, 
  Plus, 
  Search, 
  Sparkles, 
  ShieldAlert,
  Loader2,
  Layout
} from "lucide-react"
import { TECH_TREE, SPECIALIZATION_QUIZ } from "@/lib/tech-tree"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function ExpertiseDiagnostic({ userData, updateData }: { userData: any, updateData: (next: any) => void }) {
    const [step, setStep] = useState<"intro" | "quiz" | "result">(() => {
        const hasDomains = userData?.domains && userData.domains.length > 0
        const hasTools = userData?.tools && userData.tools.length > 0
        return (hasDomains || hasTools) ? "result" : "intro"
    })
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [toolSearch, setToolSearch] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Current selections
    const selectedDomains = userData?.domains || []
    const selectedTools = userData?.tools || []

    // 1. Suggest tools based on selected domains
    const suggestedTools = useMemo(() => {
        const allSuggestions = new Set<string>()
        selectedDomains.forEach((d: string) => {
            if (TECH_TREE[d]) {
                TECH_TREE[d].forEach(t => allSuggestions.add(t))
            }
        })
        // Filter out tools already selected
        return Array.from(allSuggestions).filter(t => !selectedTools.includes(t))
    }, [selectedDomains, selectedTools])

    // 2. Filter tools from search
    const allAvailableTools = useMemo(() => {
        const tools = new Set<string>()
        Object.values(TECH_TREE).flat().forEach(t => tools.add(t))
        return Array.from(tools).sort().filter(t => t.toLowerCase().includes(toolSearch.toLowerCase()))
    }, [toolSearch])

    const toggleTool = (tool: string) => {
        const next = selectedTools.includes(tool)
            ? selectedTools.filter((t: string) => t !== tool)
            : [...selectedTools, tool]
        updateData({ ...userData, tools: next })
    }

    const toggleDomain = (domain: string) => {
        const next = selectedDomains.includes(domain)
            ? selectedDomains.filter((d: string) => d !== domain)
            : [...selectedDomains, domain]
        updateData({ ...userData, domains: next })
    }

    const handleAnswer = (option: any) => {
        // Add domains/tools from answer
        let nextData = { ...userData }
        if (option.domains) {
            nextData.domains = Array.from(new Set([...(nextData.domains || []), ...option.domains]))
        }
        if (option.tools) {
            nextData.tools = Array.from(new Set([...(nextData.tools || []), ...option.tools]))
        }
        updateData(nextData)

        if (currentQuestion < SPECIALIZATION_QUIZ.length - 1) {
            setCurrentQuestion(prev => prev + 1)
        } else {
            setIsAnalyzing(true)
            setTimeout(() => {
                setIsAnalyzing(false)
                setStep("result")
            }, 1500)
        }
    }

    if (isAnalyzing) {
        return (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-1000">
                <div className="relative">
                    <div className="size-20 rounded-full border-2 border-primary/20 flex items-center justify-center animate-spin-slow">
                        <div className="size-12 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
                    </div>
                    <Cpu className="absolute inset-0 m-auto size-6 text-primary animate-pulse" />
                </div>
                <div className="space-y-1">
                    <p className="text-sm font-bold text-white tracking-tight">Calibration du profil</p>
                    <p className="text-[10px] text-zinc-500">Analyse du profil technique en cours...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <AnimatePresence mode="wait">
                {step === "intro" && (
                    <motion.div 
                        key="intro"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-8 rounded-[2rem] border border-white/5 bg-white/[0.01] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                            <Target className="size-24" />
                        </div>
                        <div className="space-y-6 relative z-10">
                            <div className="space-y-2">
                                <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold normal-case tracking-wide">Diagnostic disponible</Badge>
                                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">Définissez votre spécialisation</h3>
                                <p className="text-zinc-400 text-sm font-light leading-relaxed max-w-lg">
                                    Répondez à 3 questions rapides pour cartographier vos domaines d&apos;expertise et obtenir des suggestions d&apos;outils adaptées à votre profil.
                                </p>
                            </div>
                            <Button 
                                onClick={() => setStep("quiz")}
                                className="btn-primary-glow px-8 h-12 rounded-xl text-xs font-semibold tracking-wide gap-2"
                            >
                                Lancer le diagnostic <ChevronRight className="size-4" />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {step === "quiz" && (
                    <motion.div 
                        key="quiz"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        <div className="space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-xs font-semibold text-zinc-400">Question {currentQuestion + 1} sur 3</span>
                                <span className="text-primary font-mono text-[10px] font-bold">{Math.round(((currentQuestion + 1) / 3) * 100)}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${((currentQuestion + 1) / 3) * 100}%` }} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-snug">
                                {SPECIALIZATION_QUIZ[currentQuestion].question}
                            </h3>
                            <div className="grid gap-3">
                                {SPECIALIZATION_QUIZ[currentQuestion].options.map((option, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleAnswer(option)}
                                        className="w-full flex items-center justify-between p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-primary/[0.03] hover:border-primary/40 transition-all text-left group"
                                    >
                                        <span className="text-sm font-medium text-zinc-400 group-hover:text-white transition-colors">{option.text}</span>
                                        <ChevronRight className="size-4 text-zinc-700 group-hover:text-primary transition-all group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {step === "result" && (
                    <motion.div 
                        key="result"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-10"
                    >
                        {/* Summary & Suggestions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                    <ShieldCheck className="size-4 text-emerald-500" />
                                </div>
                                <h3 className="text-lg font-bold text-white tracking-tight">Diagnostic terminé : profil mis à jour</h3>
                            </div>

                            {/* Recommandations Logic */}
                            <div className="p-6 rounded-[2rem] border border-primary/20 bg-primary/5 space-y-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="size-4 text-primary" />
                                    <span className="text-xs font-semibold text-primary tracking-wide">Recommandations personnalisées</span>
                                </div>
                                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                                    Sur la base de vos réponses, voici une sélection de technologies recommandées pour votre profil :
                                </p>
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {suggestedTools.slice(0, 8).map(tool => (
                                        <button
                                            key={tool}
                                            onClick={() => toggleTool(tool)}
                                            className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide hover:bg-primary hover:text-black transition-all group"
                                        >
                                            <span className="flex items-center gap-2">
                                                <Plus className="size-3 group-hover:rotate-90 transition-transform" />
                                                {tool}
                                            </span>
                                        </button>
                                    ))}
                                    {suggestedTools.length === 0 && (
                                        <span className="text-xs text-zinc-500">Vos technologies sélectionnées correspondent à vos domaines d&apos;expertise.</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Full Arsenal Management */}
                        <div className="space-y-8 pt-6 border-t border-white/5">
                            <div className="space-y-6">
                                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
                                    Domaines d&apos;expertise
                                </label>
                                <div className="flex flex-wrap gap-3">
                                    {Object.keys(TECH_TREE).map(domain => (
                                        <button
                                            key={domain}
                                            onClick={() => toggleDomain(domain)}
                                            className={cn(
                                                "px-6 py-3 rounded-xl text-xs font-medium border transition-all duration-500",
                                                selectedDomains.includes(domain)
                                                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary),0.2)]"
                                                    : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
                                            )}
                                        >
                                            {domain}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                    <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400"><Search className="size-3"/> Outils & Frameworks</label>
                                    <div className="relative w-full sm:w-80 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
                                        <Input 
                                            value={toolSearch}
                                            onChange={e => setToolSearch(e.target.value)}
                                            placeholder="Rechercher un outil..."
                                            className="input-premium h-12 pl-12 text-sm rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-3 max-h-[400px] overflow-y-auto p-1 pr-4 custom-scrollbar">
                                    {allAvailableTools.map(tool => (
                                        <button
                                            key={tool}
                                            onClick={() => toggleTool(tool)}
                                            className={cn(
                                                "px-4 py-2 rounded-lg text-xs font-medium border transition-all duration-300",
                                                selectedTools.includes(tool)
                                                    ? "bg-white/10 border-white/30 text-white shadow-[0_0_10px_rgba(255,255,255,0.05)]"
                                                    : "bg-black/20 border-white/5 text-zinc-500 hover:border-primary/40 hover:text-primary"
                                            )}
                                        >
                                            {tool}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="text-center pt-10">
                            <Button 
                                variant="ghost" 
                                onClick={() => setStep("intro")}
                                className="text-xs font-semibold text-zinc-500 hover:text-zinc-300"
                            >
                                Recommencer le diagnostic
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
