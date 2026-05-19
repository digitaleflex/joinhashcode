"use client"

import { useState } from "react"
import { Users, Zap, Loader2, ArrowRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"

export function InviteClient({ squad, leader, isLoggedIn, userId }: any) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const isAlreadyMember = squad.members.some((m: any) => m.userId === userId)

    const handleJoin = async () => {
        if (!isLoggedIn) {
            router.push(`/signin?callbackURL=/invite/${squad.slug}`)
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

            toast.success("Tu as rejoint l'escouade !")
            router.push("/dashboard")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden text-white">
            {/* Background Effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="mb-10 text-center space-y-2">
                <Image
                    src="/hashcodejoin.png"
                    alt="HASHCODE"
                    width={180}
                    height={48}
                    className="h-10 w-auto mx-auto mb-6"
                />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary">
                    <ShieldCheck className="size-3.5" />
                    <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white">Invitation_Prioritaire</span>
                </div>
            </div>

            <Card className="w-full max-w-md bg-zinc-900/60 border-white/5 backdrop-blur-2xl shadow-2xl relative">
                <CardHeader className="text-center pb-8 border-b border-white/5">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="size-24 rounded-2xl bg-zinc-800 border-2 border-primary/40 rotate-3 overflow-hidden shadow-2xl">
                                <Avatar className="w-full h-full rounded-none">
                                    <AvatarImage src={leader.image || ""} />
                                    <AvatarFallback className="bg-primary/20 text-primary font-black text-3xl">
                                        {leader.pseudo?.charAt(0) || leader.name.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="absolute -bottom-2 -right-2 p-1.5 bg-primary rounded-lg shadow-lg">
                                <Zap className="size-4 text-black fill-black" />
                            </div>
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-black uppercase tracking-tighter italic text-white">
                        {leader.pseudo || leader.name.split(' ')[0]} <span className="text-zinc-600 not-italic">t&apos;appelle</span>
                    </CardTitle>
                    <CardDescription className="text-zinc-400 mt-2">
                        Rejoins l&apos;escouade <span className="text-white font-mono font-bold">[{squad.name}]</span> et active ton accès au réseau neuronal HASHCODE.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-8 space-y-6">
                    <div className="space-y-4">
                        <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest text-center">Membres Actuels</div>
                        <div className="flex justify-center -space-x-4">
                            {squad.members.map((m: any, i: number) => (
                                <div key={i} className="size-12 rounded-full border-2 border-background bg-zinc-800 overflow-hidden shadow-lg">
                                    <Avatar className="h-full w-full">
                                        <AvatarImage src={m.user.image} />
                                        <AvatarFallback className="bg-zinc-700 text-[10px] font-bold">
                                            {m.user.pseudo?.slice(0, 2) || m.user.name.slice(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            ))}
                            {[...Array(3 - squad.members.length)].map((_, i) => (
                                <div key={i} className="size-12 rounded-full border-2 border-dashed border-white/10 bg-white/[0.02] flex items-center justify-center text-zinc-700">
                                    <Users className="size-5" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center">
                        <p className="text-xs text-zinc-300 leading-relaxed italic">
                            &quot;Seul, on avance plus vite. Ensemble, on débloque le code de demain.&quot;
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="pb-8">
                    {isAlreadyMember ? (
                        <Button asChild className="w-full h-14 btn-primary-glow font-black uppercase tracking-widest">
                            <Link href="/dashboard">
                                Entrer dans le Dashboard
                                <ArrowRight className="ml-2 size-4" />
                            </Link>
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleJoin} 
                            disabled={isLoading || squad.members.length >= 3}
                            className="w-full h-14 btn-primary-glow font-black uppercase tracking-widest"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : (
                                <>
                                    {isLoggedIn ? "Rejoindre l'Escouade" : "S'inscrire et Rejoindre"}
                                    <ArrowRight className="ml-2 size-4" />
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>

            <Link href="/" className="mt-8 text-[10px] font-mono text-zinc-600 hover:text-white uppercase tracking-widest transition-colors">
                En savoir plus sur HASHCODE
            </Link>
        </div>
    )
}
