"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Fingerprint, Loader2, Plus, Trash2, Smartphone, Monitor } from "lucide-react"
import { toast } from "sonner"

export function PasskeySetup() {
    // Correct Better Auth v1 Passkey hooks
    const { data: passkeys, isPending } = authClient.useListPasskeys()
    const [adding, setAdding] = useState(false)

    const handleAddPasskey = async () => {
        setAdding(true)
        try {
            // Correct method: authClient.passkey.addPasskey()
            const { error } = await authClient.passkey.addPasskey()
            if (error) throw new Error(error.message || "Erreur inconnue")
            toast.success("Passkey ajouté avec succès")
        } catch (error: any) {
            if (!error.message?.includes("cancel")) {
                toast.error("Erreur lors de l'ajout du Passkey")
            }
        } finally {
            setAdding(false)
        }
    }

    const handleDeletePasskey = async (id: string) => {
        if (!confirm("Supprimer ce Passkey ?")) return
        try {
            const { error } = await authClient.passkey.deletePasskey({ id })
            if (error) throw new Error(error.message)
            toast.success("Passkey supprimé")
        } catch (error: any) {
            toast.error("Erreur lors de la suppression")
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">Mes Passkeys</h3>
                    <p className="text-[10px] text-zinc-500 font-medium">Connecte-toi instantanément via FaceID, TouchID ou Windows Hello.</p>
                </div>
                <Button
                    onClick={handleAddPasskey}
                    disabled={adding}
                    className="btn-primary-glow h-9 px-4 text-[10px] uppercase font-bold tracking-wider rounded-xl gap-2 cursor-pointer"
                >
                    {adding ? <Loader2 className="size-3 animate-spin" /> : <Plus className="size-3" />}
                    Ajouter
                </Button>
            </div>

            <div className="grid gap-3">
                {isPending ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="size-6 animate-spin text-zinc-700" />
                    </div>
                ) : !passkeys?.length ? (
                    <div className="border border-dashed border-white/5 rounded-2xl p-8 text-center bg-white/1 space-y-2">
                        <Fingerprint className="size-8 text-zinc-700 mx-auto opacity-35" />
                        <p className="text-[10px] text-zinc-300 font-mono uppercase tracking-widest font-black">Aucune clé d&apos;accès enregistrée</p>
                        <p className="text-[9px] text-zinc-500 max-w-sm mx-auto leading-normal font-medium">
                            Enregistre cet appareil en cliquant sur le bouton <span className="text-primary font-bold">Ajouter</span> ci-dessus.
                            Tu pourras ensuite te connecter de manière ultra-sécurisée sans mot de passe en scannant ton visage ou ton empreinte.
                        </p>
                    </div>
                ) : (
                    passkeys.map((pk: any) => (
                        <div key={pk.id} className="group relative p-4 rounded-2xl bg-white/2 border border-white/5 flex items-center justify-between hover:bg-white/4 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-primary shadow-[0_0_15px_rgba(184,255,59,0.05)]">
                                    {pk.deviceType === "mobile" ? <Smartphone className="size-4" /> : <Monitor className="size-4" />}
                                </div>
                                <div className="space-y-0.5">
                                    <div className="text-[11px] font-bold text-zinc-200">
                                        {pk.name || "Appareil sans nom"}
                                    </div>
                                    <div className="text-[9px] font-mono text-zinc-500 uppercase tracking-tighter">
                                        Ajouté le {new Date(pk.createdAt).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeletePasskey(pk.id)}
                                className="size-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer transition-colors"
                            >
                                <Trash2 className="size-3.5" />
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
