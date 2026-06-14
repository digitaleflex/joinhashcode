"use client"

import { useState } from "react"
import { MessageSquarePlus, Loader2, Send, AlertTriangle, Lightbulb, MessageSquare, Star } from "lucide-react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { SidebarMenuButton } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export function BetaFeedbackDialog() {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState<string>("GENERAL")
    const [content, setContent] = useState("")
    const [rating, setRating] = useState<number>(0)
    const [hoverRating, setHoverRating] = useState<number>(0)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (content.length < 10) {
            toast.error("Ton message est un peu court (minimum 10 caractères).")
            return
        }

        setIsSubmitting(true)
        try {
            const formData = new FormData()
            formData.append("type", type)
            formData.append("content", content)
            if (rating > 0) {
                formData.append("rating", rating.toString())
            }

            const response = await fetch("/api/feedback", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) throw new Error("Échec de l'envoi")

            toast.success("Transmission reçue ! Merci pour ton aide.")
            setContent("")
            setRating(0)
            setOpen(false)
        } catch (_) {
            toast.error("Erreur lors de l'envoi du feedback.")
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <SidebarMenuButton tooltip="Feedback Bêta" className="h-11 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all">
                    <MessageSquarePlus className="size-4" />
                    <span>Feedback Bêta</span>
                </SidebarMenuButton>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card/95 backdrop-blur-2xl border-border/40 shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                        <span className="size-2 rounded-full bg-primary animate-pulse" />
                        Améliorer HASHCODE
                    </DialogTitle>
                    <DialogDescription className="text-zinc-400">
                        HASHCODE est en phase expérimentale. Ton retour est crucial pour construire l&apos;avenir de la communauté.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {/* Satisfaction Rating */}
                    <div className="space-y-3 p-4 rounded-xl bg-white/5 border border-white/5">
                        <Label className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">Satisfaction globale</Label>
                        <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                >
                                    <Star 
                                        className={cn(
                                            "size-6 transition-colors",
                                            (hoverRating || rating) >= star 
                                                ? "fill-primary text-primary drop-shadow-[0_0_5px_rgba(197,244,65,0.3)]" 
                                                : "text-zinc-700 fill-transparent"
                                        )} 
                                    />
                                </button>
                            ))}
                            {rating > 0 && (
                                <span className="ml-2 text-[9px] font-mono text-primary uppercase tracking-widest animate-in fade-in slide-in-from-left-1">
                                    {rating === 1 && "Décevant"}
                                    {rating === 2 && "À améliorer"}
                                    {rating === 3 && "Correct"}
                                    {rating === 4 && "Très bon"}
                                    {rating === 5 && "Excellent !"}
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="type" className="text-xs uppercase font-mono text-zinc-500">Nature du retour</Label>
                        <Select value={type} onValueChange={setType}>
                            <SelectTrigger id="type" className="bg-background/50 border-border/60">
                                <SelectValue placeholder="Choisis un type" />
                            </SelectTrigger>
                            <SelectContent className="bg-zinc-900 border-border/40">
                                <SelectItem value="BUG" className="focus:bg-destructive/10 focus:text-destructive">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="size-3.5" />
                                        <span>Signaler un bug</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="FEATURE_REQUEST" className="focus:bg-primary/10 focus:text-primary">
                                    <div className="flex items-center gap-2">
                                        <Lightbulb className="size-3.5" />
                                        <span>Suggérer une idée</span>
                                    </div>
                                </SelectItem>
                                <SelectItem value="GENERAL" className="focus:bg-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="size-3.5" />
                                        <span>Retour général</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content" className="text-xs uppercase font-mono text-zinc-500">Ton message</Label>
                        <Textarea
                            id="content"
                            placeholder="Décris-nous ce qui pourrait être amélioré..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[120px] bg-background/50 border-border/60 focus:border-primary/50 resize-none"
                            maxLength={2000}
                        />
                        <div className="text-[10px] text-right text-zinc-600 font-mono">
                            {content.length}/2000
                        </div>
                    </div>
                    <DialogFooter className="pt-2">
                        <Button 
                            type="submit" 
                            className="w-full btn-primary-glow font-bold uppercase tracking-wide h-11"
                            disabled={isSubmitting || content.length < 10}
                        >
                            {isSubmitting ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <>
                                    <Send className="mr-2 size-4" />
                                    Envoyer le feedback
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
