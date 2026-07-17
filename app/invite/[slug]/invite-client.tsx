"use client"

import { useState } from "react"
import { Zap, Loader2, ArrowRight, ShieldCheck, Lock, Globe, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"

interface InviteUser {
  id?: string
  name?: string | null
  pseudo?: string | null
  image?: string | null
}

interface InviteMember {
  userId?: string
  role?: string | null
  user: InviteUser
}

interface InviteSquad {
  slug: string | null
  members: InviteMember[]
}

interface InviteClientProps {
  squad: InviteSquad
  leader: InviteUser
  isLoggedIn: boolean
  userId?: string
}

export function InviteClient({ squad, leader, isLoggedIn, userId }: InviteClientProps) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const isAlreadyMember = squad.members.some((m) => m.userId === userId)

    const handleJoin = async () => {
        if (!isLoggedIn) {
            // Cookie fallback: new users will traverse the full onboarding funnel
            // before landing back here. The cookie survives the redirect chain.
            document.cookie = `pending-squad=${squad.slug ?? ""}; path=/; max-age=3600; SameSite=Lax`
            router.push(`/signin?callbackURL=/invite/${squad.slug ?? ""}`)
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch("/api/squad/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug: squad.slug }),
            })

            const data = await response.json()
            if (!response.ok) throw new Error(data.error || "Échec de l'adhésion")

            // Clear the pending invite cookie after successful join
            document.cookie = "pending-squad=; path=/; max-age=0"
            toast.success("Tu as rejoint l'escouade !")
            router.push("/dashboard")
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Erreur inconnue")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-primary/10 rounded-full blur-[140px] pointer-events-none" />

            <div className="mb-10 text-center space-y-4 relative z-10">
                <Image
                    src="/hashcodejoin.png"
                    alt="HASHCODE"
                    width={180}
                    height={48}
                    className="h-10 w-auto mx-auto mb-6 drop-shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                />
                <div className="flex flex-col items-center gap-3">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        <ShieldCheck className="size-3.5" />
                        <span className="text-[10px] font-mono font-black uppercase">Accès_Sécurisé_Approuvé</span>
                    </div>
                    <div className="text-[9px] font-mono text-zinc-500 uppercase animate-pulse">
                        Formation de l&apos;équipe en cours...
                    </div>
                </div>
            </div>

            <Card className="w-full max-w-md bg-zinc-900/40 border-white/5 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-50" />
                
                <CardHeader className="text-center pb-8 border-b border-white/5 relative">
                    <div className="flex justify-center mb-8">
                        <div className="relative">
                            <div className="size-28 rounded-4xl bg-zinc-800 border-2 border-primary/40 rotate-6 group-hover:rotate-0 transition-transform duration-700 overflow-hidden shadow-2xl">
                                <Avatar className="w-full h-full rounded-none">
                                    <AvatarImage src={leader.image || ""} />
                                    <AvatarFallback className="bg-primary/20 text-primary font-black text-4xl">
                                        {leader.pseudo?.charAt(0) || (leader.name ?? "").charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute -bottom-3 -right-3 p-2 bg-primary rounded-xl shadow-[0_0_20px_rgba(var(--primary),0.4)] animate-bounce">
                                <Zap className="size-5 text-black fill-black" />
                            </div>
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-black uppercase tracking-tighter italic text-white leading-tight">
                        {leader.pseudo || (leader.name ?? "").split(' ')[0]} <span className="text-zinc-600 not-italic">t&apos;a sélectionné</span>
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-3 text-sm leading-relaxed">
                        Le Bâtisseur <span className="text-white font-bold">@{leader.pseudo}</span> a besoin de ton expertise pour compléter son équipe. Ensemble, débloquez tout le potentiel <span className="text-primary font-mono font-bold tracking-wide">HASHCODE</span>.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-8 space-y-8">
                    {/* Social Proof Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-2">
                            <span>Membres de l&apos;équipe</span>
                            <span className="text-primary font-bold">{squad.members.length}/5</span>
                        </div>
                        <div className="flex justify-center -space-x-3">
                            {squad.members.map((m, i: number) => (
                                <div key={i} className="relative group/avatar">
                                    <div className="size-14 rounded-2xl border-2 border-zinc-950 bg-zinc-800 overflow-hidden shadow-xl transition-transform hover:-translate-y-1 hover:z-10 cursor-pointer">
                                            <Avatar className="h-full w-full">
                                                <AvatarImage src={m.user.image || ""} />
                                                <AvatarFallback className="bg-zinc-700 text-xs font-bold">
                                                    {m.user.pseudo?.slice(0, 2) || (m.user.name ?? "").slice(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                    </div>
                                    {m.role === "owner" && (
                                        <div className="absolute -top-1 -right-1 size-4 bg-primary rounded-full flex items-center justify-center border-2 border-zinc-950">
                                            <Sparkles className="size-2 text-black fill-black" />
                                        </div>
                                    )}
                                </div>
                            ))}
                            {[...Array(5 - squad.members.length)].map((_, i) => (
                                <div key={i} className="size-14 rounded-2xl border-2 border-dashed border-white/5 bg-white/2 flex items-center justify-center text-zinc-800 animate-pulse">
                                    <Lock className="size-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mission Benefit Box */}
                    <div className="bg-primary/3 border border-primary/10 rounded-3xl p-5 text-center relative group/box overflow-hidden">
                        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover/box:opacity-100 transition-opacity duration-500" />
                        <p className="text-xs text-zinc-300 leading-relaxed relative z-10 italic">
                            &quot;Une équipe complète débloque <span className="text-white font-bold">100% des missions</span> et active les bonus d&apos;évolution collective.&quot;
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="pb-8 pt-2">
                    {isAlreadyMember ? (
                        <Button asChild className="w-full h-16 btn-primary-glow font-black uppercase tracking-wide text-sm shadow-[0_0_30px_rgba(var(--primary),0.2)]">
                            <Link href="/dashboard">
                                Entrer dans le Système
                                <ArrowRight className="ml-2 size-5" />
                            </Link>
                        </Button>
                    ) : (
                        <div className="w-full space-y-4">
                            <Button 
                                onClick={handleJoin} 
                                disabled={isLoading || squad.members.length >= 5}
                                className="w-full h-16 btn-primary-glow font-black uppercase tracking-wide text-sm shadow-[0_0_30px_rgba(var(--primary),0.2)] active:scale-[0.98] transition-all"
                            >
                                {isLoading ? <Loader2 className="animate-spin" /> : (
                                    <>
                                        {isLoggedIn ? "Rejoindre l'Équipe" : "Activer mon Accès & Rejoindre"}
                                        <ArrowRight className="ml-2 size-5" />
                                    </>
                                )}
                            </Button>
                            <div className="flex items-center justify-center gap-4 text-[9px] font-mono text-zinc-600 uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Globe className="size-3" /> Chiffrage SSL</span>
                                <span className="flex items-center gap-1"><ShieldCheck className="size-3" /> Vérifié</span>
                            </div>
                        </div>
                    )}
                </CardFooter>
            </Card>

            <Link href="/" className="mt-8 text-[10px] font-mono text-zinc-600 hover:text-white uppercase transition-colors border-b border-transparent hover:border-white/20 pb-1">
                -- Terminal HASHCODE v2.0 --
            </Link>
        </div>
    )
}
