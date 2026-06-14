"use client"

import { useState } from "react"
import { Share2, Copy, Check, Users, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

interface ReferralCardProps {
    referralCode: string
    referralCount: number
}

export function ReferralCard({ referralCode, referralCount }: ReferralCardProps) {
    const [copied, setCopied] = useState(false)
    const referralLink = `${window.location.origin}/signin?ref=${referralCode}`

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink)
        setCopied(true)
        toast.success("Lien d'invitation copié !")
        setTimeout(() => setCopied(false), 2000)
    }

    const shareLink = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Rejoins-moi sur HASHCODE",
                    text: "Découvre ton profil de bâtisseur tech et rejoins une escouade d'élite.",
                    url: referralLink,
                })
            } catch (_) {
                console.error("Erreur de partage:", err)
            }
        } else {
            copyLink()
        }
    }

    return (
        <Card className="bg-zinc-900/40 border-white/5 backdrop-blur-xl overflow-hidden relative group">
            {/* Background pattern */}
            <div className="absolute inset-0 cyber-grid-primary opacity-[0.03] pointer-events-none" />
            
            <CardContent className="p-6 relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary">
                            <Gift className="size-4" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Programme Ambassadeur</span>
                        </div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight italic">
                            Invite tes alliés. <span className="text-primary">Gagne du XP.</span>
                        </h3>
                        <p className="text-zinc-400 text-xs max-w-md font-medium">
                            Partage ton lien unique. Pour chaque nouvel agent recruté via ton code, tu reçois <span className="text-white font-bold">+50 XP</span> instantanément.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-black/40 border border-white/5 min-w-[140px]">
                        <div className="text-2xl font-black text-white font-mono leading-none">
                            {referralCount}
                        </div>
                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mt-1">
                            Recrues validées
                        </div>
                        <Users className="size-4 text-zinc-700 mt-3" />
                    </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative group/input">
                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                            <span className="text-zinc-600 font-mono text-[10px] uppercase">Lien :</span>
                        </div>
                        <div className="w-full h-11 bg-black/60 border border-white/10 rounded-xl pl-16 pr-4 flex items-center text-[11px] font-mono text-zinc-300 truncate">
                            {referralLink}
                        </div>
                        <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                    </div>
                    
                    <div className="flex gap-2">
                        <Button 
                            onClick={copyLink}
                            variant="outline"
                            className="h-11 px-6 border-white/10 bg-white/1 hover:bg-white/5 text-white font-bold uppercase text-[10px] tracking-widest gap-2 rounded-xl"
                        >
                            {copied ? <Check className="size-3.5 text-primary" /> : <Copy className="size-3.5" />}
                            {copied ? "Copié" : "Copier"}
                        </Button>
                        
                        <Button 
                            onClick={shareLink}
                            className="h-11 px-6 btn-primary-glow text-black font-bold uppercase text-[10px] tracking-widest gap-2 rounded-xl"
                        >
                            <Share2 className="size-3.5" />
                            Partager
                        </Button>
                    </div>
                </div>
            </CardContent>
            
            {/* Bottom highlight */}
            <div className="absolute bottom-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        </Card>
    )
}
