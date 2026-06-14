"use client"

import { useState } from "react"
import { CheckCircle2, Eye, RotateCcw, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function FeedbackStatusToggle({ id, currentStatus }: { id: string, currentStatus: string }) {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const updateStatus = async (newStatus: string) => {
        setLoading(true)
        try {
            const response = await fetch("/api/admin/feedback", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            })

            if (!response.ok) throw new Error("Erreur lors de la mise à jour")

            toast.success(`Statut mis à jour : ${newStatus}`)
            router.refresh()
        } catch (_) {
            toast.error("Échec de la mise à jour du statut.")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <Loader2 className="size-5 animate-spin text-zinc-600" />

    return (
        <div className="flex gap-2">
            {currentStatus === "NEW" && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-[9px] uppercase font-bold border-white/10 hover:bg-amber-500/10 hover:text-amber-500"
                    onClick={() => updateStatus("REVIEWED")}
                >
                    <Eye className="mr-1.5 size-3" />
                    Marquer comme lu
                </Button>
            )}
            
            {(currentStatus === "NEW" || currentStatus === "REVIEWED") && (
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 text-[9px] uppercase font-bold border-white/10 hover:bg-emerald-500/10 hover:text-emerald-500"
                    onClick={() => updateStatus("RESOLVED")}
                >
                    <CheckCircle2 className="mr-1.5 size-3" />
                    Résoudre
                </Button>
            )}

            {currentStatus === "RESOLVED" && (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-[9px] uppercase font-bold text-zinc-500 hover:text-white"
                    onClick={() => updateStatus("NEW")}
                >
                    <RotateCcw className="mr-1.5 size-3" />
                    Réouvrir
                </Button>
            )}
        </div>
    )
}
