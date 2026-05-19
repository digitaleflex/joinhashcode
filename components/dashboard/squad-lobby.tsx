"use client"

import { useState } from "react"
import { Users, UserPlus, Copy, Check, ShieldAlert, Zap, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { ScrambleText } from "@/components/ui/scramble-text"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SquadLobby({ user, squad }: { user: any, squad: any }) {
    const [isCopying, setIsLocked] = useState(false)
    const [isCreating, setIsCreating] = useState(false)
    
    // Fallback pseudo if not set
    const pseudo = user.pseudo || user.name.split(' ')[0]
    
    // Squad members (max 3 for the logic)
    const members = squad?.members || []
    const memberCount = members.length
    const slots = [0, 1, 2] // 3 slots total

    const inviteLink = `${window.location.origin}/invite/${squad?.slug || pseudo.toLowerCase()}`

    const copyInvite = () => {
        navigator.clipboard.writeText(inviteLink)
        toast.success("Lien de recrutement copié !")
        setIsLocked(true)
        setTimeout(() => setIsLocked(false), 2000)
    }

    const createSquad = async () => {
        setIsCreating(true)
        try {
            const response = await fetch("/api/squad/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            })
            if (!response.ok) throw new Error("Échec de création")
            toast.success("Escouade initialisée !")
            window.location.reload()
        } catch (error) {
            toast.error("Erreur lors de la création de l'escouade.")
            console.error(error)
        } finally {
            setIsCreating(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-10">
            {/* Header Lock Section */}
            <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 animate-pulse">
                    <ShieldAlert className="size-4" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Protocole d&apos;Assemblage : Actif</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                    Terminal <span className="text-zinc-700">Verrouillé</span>
                </h1>
                <p className="text-zinc-500 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                    Agent <span className="text-primary font-bold">@{pseudo}</span>, ton accès aux missions de haut niveau est suspendu. 
                    Le protocole HASHCODE impose une équipe de <span className="text-white font-bold">3 membres</span> pour activer ton arsenal.
                </p>
            </div>

            {/* Squad Slots */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {slots.map((index) => {
                    const member = members[index]
                    const isActive = !!member
                    const isUser = member?.user?.id === user.id

                    return (
                        <div key={index} className={cn(
                            "relative group rounded-[2rem] border-2 transition-all duration-500 overflow-hidden",
                            isActive 
                                ? "bg-zinc-900/40 border-primary/30 shadow-[0_0_30px_rgba(var(--primary),0.1)]" 
                                : "bg-black/40 border-white/5 border-dashed"
                        )}>
                            <div className="aspect-[4/5] flex flex-col items-center justify-center p-8 space-y-6">
                                {isActive ? (
                                    <>
                                        <div className="relative">
                                            <div className="size-24 rounded-2xl bg-zinc-900 border-2 border-primary/50 overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-500">
                                                <Avatar className="w-full h-full rounded-none">
                                                    <AvatarImage src={member.user.image || ""} />
                                                    <AvatarFallback className="bg-primary/20 text-primary font-black text-3xl">
                                                        {member.user.pseudo?.charAt(0) || member.user.name.charAt(0)}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="absolute -bottom-2 -right-2 px-2 py-0.5 bg-primary text-black text-[8px] font-black uppercase tracking-tighter -rotate-3">
                                                Activé
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-lg font-black text-white uppercase tracking-tighter italic">
                                                {member.user.pseudo || member.user.name.split(' ')[0]}
                                            </div>
                                            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-1">
                                                {member.user.class || "Agent_Init"}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="size-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center bg-white/[0.02]">
                                            <UserPlus className="size-8 text-zinc-800" />
                                        </div>
                                        <div className="text-center space-y-4 w-full">
                                            <div className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
                                                Slot_Vide
                                            </div>
                                            {!squad && isUser === false ? null : (
                                                <Button 
                                                    variant="outline" 
                                                    onClick={copyInvite}
                                                    className="w-full border-white/5 bg-white/5 hover:bg-primary/10 hover:border-primary/30 h-10 text-[10px] font-bold uppercase tracking-widest"
                                                >
                                                    {isCopying ? <Check className="size-3 mr-2" /> : <Copy className="size-3 mr-2" />}
                                                    Recruter
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Action Section */}
            {!squad ? (
                <div className="flex flex-col items-center gap-6 pt-10">
                    <Button 
                        size="lg" 
                        onClick={createSquad}
                        disabled={isCreating}
                        className="btn-primary-glow px-10 h-14 text-sm font-black uppercase tracking-[0.2em]"
                    >
                        {isCreating ? <Loader2 className="animate-spin" /> : "Initialiser mon Escouade"}
                    </Button>
                    <p className="text-[10px] text-zinc-600 font-mono uppercase tracking-[0.3em]">
                        [ Protocol: Team_First_Onboarding ]
                    </p>
                </div>
            ) : (
                <div className="p-8 rounded-3xl border border-white/5 bg-zinc-900/20 text-center space-y-6">
                    <div className="flex justify-center gap-2">
                        {[...Array(memberCount)].map((_, i) => (
                            <Zap key={i} className="size-5 text-primary fill-primary" />
                        ))}
                        {[...Array(3 - memberCount)].map((_, i) => (
                            <Zap key={i} className="size-5 text-zinc-800" />
                        ))}
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-zinc-400">Progression de l&apos;assemblage : <span className="text-white font-bold">{memberCount}/3</span></p>
                        <p className="text-[10px] text-zinc-600 font-mono uppercase">En attente de synchronisation neuronale...</p>
                    </div>
                </div>
            )}
        </div>
    )
}
