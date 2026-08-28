"use client"

import { useState } from "react"
import { Check, X, Star, Loader2, MessageSquareText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface QuizFeedbackCardProps {
    quizResultId: string
}

export function QuizFeedbackCard({ quizResultId }: QuizFeedbackCardProps) {
    const [step, setStep] = useState<"initial" | "rating" | "thanks">("initial")
    const [isAccurate, setIsAccurate] = useState<boolean | null>(null)
    const [usefulness, setUsefulness] = useState<number>(0)
    const [hoverRating, setHoverRating] = useState<number>(0)
    const [comment, setComment] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleInitialResponse = (accurate: boolean) => {
        setIsAccurate(accurate)
        setStep("rating")
    }

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const res = await fetch("/api/quiz/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    quizResultId,
                    isAccurate,
                    usefulness: usefulness || 3,
                    comment
                })
            })

            if (!res.ok) throw new Error()
            setStep("thanks")
        } catch (error: unknown) {
            toast.error("Erreur lors de l'envoi de ton avis")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (step === "thanks") {
        return (
            <Card className="bg-primary/5 border-primary/20 backdrop-blur-sm overflow-hidden animate-in fade-in zoom-in duration-500">
                <CardContent className="p-8 text-center space-y-3">
                    <div className="size-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="size-6 text-primary" />
                    </div>
                    <h3 className="text-white font-bold uppercase tracking-tight">Merci pour ton aide !</h3>
                    <p className="text-zinc-400 text-xs">Tes réponses nous permettent d'affiner notre algorithme de diagnostic.</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl overflow-hidden relative group cyber-notch-sm">
            <div className="absolute inset-0 cyber-grid-primary opacity-[0.03] pointer-events-none" />
            
            <CardHeader className="pb-4 relative">
                <CardTitle className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquareText className="size-4 text-primary" />
                    Verdict de l'agent
                </CardTitle>
                <CardDescription className="text-xs text-zinc-500 uppercase font-mono">Validation du diagnostic de profilage</CardDescription>
            </CardHeader>

            <CardContent className="relative space-y-6">
                {step === "initial" ? (
                    <div className="space-y-4">
                        <p className="text-zinc-300 text-sm font-medium">Ce résultat te semble-t-il pertinent par rapport à ton parcours ?</p>
                        <div className="flex gap-3">
                            <Button 
                                onClick={() => handleInitialResponse(true)}
                                variant="outline" 
                                className="flex-1 h-11 border-white/10 bg-white/1 hover:bg-primary/10 hover:border-primary/30 hover:text-primary transition-all gap-2 font-bold uppercase text-xs tracking-widest rounded-xl"
                            >
                                <Check className="size-4" /> Oui, totalement
                            </Button>
                            <Button 
                                onClick={() => handleInitialResponse(false)}
                                variant="outline" 
                                className="flex-1 h-11 border-white/10 bg-white/1 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400 transition-all gap-2 font-bold uppercase text-xs tracking-widest rounded-xl"
                            >
                                <X className="size-4" /> Pas vraiment
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6 animate-in slide-in-from-right duration-300">
                        <div className="space-y-3">
                            <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Utilité globale du quiz (1-5)</label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setUsefulness(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        className="transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star 
                                            className={cn(
                                                "size-6 transition-colors",
                                                (hoverRating || usefulness) >= star 
                                                    ? "fill-primary text-primary drop-shadow-[0_0_8px_rgba(197,244,65,0.4)]" 
                                                    : "text-zinc-800 fill-transparent"
                                            )} 
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Un commentaire ? (Optionnel)</label>
                            <Textarea 
                                placeholder="Dis-nous ce que tu en penses..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="min-h-[80px] bg-black/40 border-white/10 focus:ring-primary/20 text-sm rounded-xl"
                            />
                        </div>

                        <Button 
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full btn-primary-glow h-11 font-bold uppercase text-xs tracking-[0.2em] rounded-xl"
                        >
                            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : "Envoyer mon avis"}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
