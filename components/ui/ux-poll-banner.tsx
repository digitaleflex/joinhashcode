"use client"

import { useState, useEffect } from "react"
import { Eye, Moon, Zap, Star, X, Loader2, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

export function UXPollBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [step, setStep] = useState<"initial" | "questions" | "thanks">("initial")
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)

    // Form data
    const [prefersDarkMode, setPrefersDarkMode] = useState<boolean>(true)
    const [modernityRating, setModernityRating] = useState<number>(0)
    const [readabilityIssues, setReadabilityIssues] = useState("")

    useEffect(() => {
        // Check if already answered
        fetch("/api/ux-poll")
            .then(res => res.json())
            .then(data => {
                if (!data.hasAnswered) {
                    setIsVisible(true)
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false))
    }, [])

    const handleSubmit = async () => {
        if (modernityRating === 0) {
            toast.error("Veuillez noter la modernité du design.")
            return
        }

        setSubmitting(true)
        try {
            const res = await fetch("/api/ux-poll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prefersDarkMode,
                    modernityRating,
                    readabilityIssues
                })
            })

            if (!res.ok) throw new Error()
            setStep("thanks")
            setTimeout(() => setIsVisible(false), 3000)
        } catch (error) {
            toast.error("Erreur lors de l'envoi du sondage.")
        } finally {
            setSubmitting(false)
        }
    }

    if (!isVisible || loading) return null

    return (
        <div className="fixed bottom-24 left-6 right-6 z-40 sm:left-auto sm:right-6 sm:w-96 animate-in slide-in-from-bottom-10 duration-700">
            <Card className="bg-zinc-950/90 border-primary/20 backdrop-blur-xl shadow-[0_0_30px_rgba(197,244,65,0.1)] overflow-hidden cyber-notch-sm">
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary/50 via-primary to-primary/50" />
                
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute top-3 right-3 text-zinc-600 hover:text-white transition-colors"
                >
                    <X className="size-4" />
                </button>

                <CardContent className="p-6">
                    {step === "initial" && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <Eye className="size-5" />
                                </div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Aide-nous à forger l'UX</h3>
                            </div>
                            <p className="text-xs text-zinc-400 leading-relaxed">
                                Ton avis sur l'identité visuelle de HASHCODE est crucial. Cela prend moins d'une minute.
                            </p>
                            <Button 
                                onClick={() => setStep("questions")}
                                className="w-full btn-primary-glow h-10 text-[10px] font-black uppercase tracking-widest rounded-xl"
                            >
                                Participer au sondage
                            </Button>
                        </div>
                    )}

                    {step === "questions" && (
                        <div className="space-y-5">
                            {/* Dark Mode */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Moon className="size-3" /> Préférences de thème
                                </label>
                                <div className="flex gap-2">
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setPrefersDarkMode(true)}
                                        className={cn(
                                            "flex-1 text-[9px] font-bold uppercase rounded-lg border-white/5",
                                            prefersDarkMode ? "bg-primary/20 border-primary/40 text-primary" : "bg-white/2"
                                        )}
                                    >
                                        Mode Sombre
                                    </Button>
                                    <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => setPrefersDarkMode(false)}
                                        className={cn(
                                            "flex-1 text-[9px] font-bold uppercase rounded-lg border-white/5",
                                            !prefersDarkMode ? "bg-primary/20 border-primary/40 text-primary" : "bg-white/2"
                                        )}
                                    >
                                        Mode Clair
                                    </Button>
                                </div>
                            </div>

                            {/* Modernity */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <Zap className="size-3" /> Modernité du design (1-5)
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => setModernityRating(s)}
                                            className={cn(
                                                "size-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                                                modernityRating === s 
                                                    ? "bg-primary text-black" 
                                                    : "bg-white/5 text-zinc-500 hover:bg-white/10"
                                            )}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Readability */}
                            <div className="space-y-3">
                                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                    <MessageSquare className="size-3" /> Éléments difficiles à lire ?
                                </label>
                                <Textarea 
                                    placeholder="Ex: Textes trop petits, contrastes..."
                                    value={readabilityIssues}
                                    onChange={(e) => setReadabilityIssues(e.target.value)}
                                    className="min-h-[60px] bg-black/40 border-white/10 text-xs rounded-xl"
                                />
                            </div>

                            <Button 
                                onClick={handleSubmit}
                                disabled={submitting || modernityRating === 0}
                                className="w-full btn-primary-glow h-10 text-[10px] font-black uppercase tracking-widest rounded-xl"
                            >
                                {submitting ? <Loader2 className="size-4 animate-spin" /> : "Envoyer mes réponses"}
                            </Button>
                        </div>
                    )}

                    {step === "thanks" && (
                        <div className="text-center py-4 space-y-3 animate-in fade-in zoom-in duration-500">
                            <div className="size-10 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                                <Star className="size-5 text-primary fill-primary" />
                            </div>
                            <h3 className="text-white font-bold uppercase tracking-tight text-sm">Signal reçu !</h3>
                            <p className="text-zinc-500 text-[10px] uppercase font-mono">Merci pour ta contribution à l'évolution.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
