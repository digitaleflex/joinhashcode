"use client"

import { useState } from "react"
import { MessageSquarePlus, Loader2, Send, AlertTriangle, Lightbulb, MessageSquare } from "lucide-react"
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

export function BetaFeedbackDialog() {
    const [open, setOpen] = useState(false)
    const [type, setType] = useState<string>("GENERAL")
    const [content, setContent] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (content.length < 10) {
            toast.error("Ton message est un peu court (minimum 10 caractères).")
            return
        }

        setIsSubmitting(true)
        try {
            const response = await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type, content }),
            })

            if (!response.ok) throw new Error("Échec de l'envoi")

            toast.success("Transmission reçue ! Merci pour ton aide.")
            setContent("")
            setOpen(false)
        } catch (error) {
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
