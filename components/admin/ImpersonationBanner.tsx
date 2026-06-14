"use client"

import { authClient } from "@/lib/auth-client"
import { ShieldAlert, LogOut, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useState } from "react"

export function ImpersonationBanner() {
    const { data: session, isPending } = authClient.useSession()
    const [isStopping, setIsStopping] = useState(false)

    // Better Auth sets impersonatedBy in the session if active
    const isImpersonating = !!session?.session?.impersonatedBy

    const stopImpersonation = async () => {
        setIsStopping(true)
        try {
            await authClient.admin.stopImpersonating()
            toast.success("Retour au compte administrateur")
            window.location.href = "/admin/users"
        } catch (_) {
            toast.error("Erreur lors de l'arrêt de l'impersonification")
        } finally {
            setIsStopping(false)
        }
    }

    if (isPending || !isImpersonating) return null

    return (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-black px-4 py-2 flex items-center justify-between shadow-[0_4px_20px_rgba(245,158,11,0.4)] animate-in slide-in-from-top duration-500">
            <div className="flex items-center gap-3">
                <div className="bg-black/10 p-1.5 rounded-lg">
                    <ShieldAlert className="size-4 animate-pulse" />
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                    <span className="text-[10px] font-black uppercase tracking-tighter leading-none sm:leading-normal">
                        Mode Impersonification Actif
                    </span>
                    <span className="text-[10px] font-medium opacity-80 font-mono hidden sm:inline">
                        — Tu navigues en tant que <span className="font-bold">{session.user.name}</span> ({session.user.email})
                    </span>
                </div>
            </div>
            
            <Button 
                variant="secondary" 
                size="sm" 
                onClick={stopImpersonation}
                disabled={isStopping}
                className="h-8 bg-black text-white hover:bg-zinc-800 border-none rounded-lg text-[9px] font-black uppercase tracking-widest gap-2 shadow-lg cursor-pointer"
            >
                {isStopping ? <Loader2 className="size-3 animate-spin" /> : <LogOut className="size-3" />}
                Arrêter
            </Button>
        </div>
    )
}
