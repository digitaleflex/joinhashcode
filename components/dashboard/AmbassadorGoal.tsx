"use client"

import { Trophy, ArrowRight, ShieldCheck, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AmbassadorGoalProps {
    referralCount: number
}

export function AmbassadorGoal({ referralCount }: AmbassadorGoalProps) {
    const target = 3
    const progress = Math.min(100, (referralCount / target) * 100)
    const isUnlocked = referralCount >= target

    return (
        <Card className={cn(
            "border transition-all duration-700 relative overflow-hidden",
            isUnlocked 
                ? "bg-primary/5 border-primary/30 shadow-[0_0_30px_rgba(197,244,65,0.15)]" 
                : "bg-zinc-950/40 border-white/5"
        )}>
            {/* Animated background for unlocked state */}
            {isUnlocked && (
                <div className="absolute inset-0 cyber-grid-primary opacity-[0.05] animate-pulse" />
            )}

            <CardContent className="p-6">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Badge Icon Container */}
                    <div className="relative group">
                        <div className={cn(
                            "size-20 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
                            isUnlocked 
                                ? "bg-primary border-primary shadow-[0_0_20px_#C5F441]" 
                                : "bg-black/40 border-white/10 group-hover:border-primary/30"
                        )}>
                            <Trophy className={cn(
                                "size-10 transition-all duration-500",
                                isUnlocked ? "text-black scale-110" : "text-zinc-800"
                            )} />
                        </div>
                        
                        {/* Glow effect */}
                        <div className={cn(
                            "absolute inset-0 rounded-2xl blur-xl opacity-0 transition-opacity duration-1000",
                            isUnlocked ? "bg-primary/40 opacity-100" : "bg-primary/10 group-hover:opacity-100"
                        )} />
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <span className={cn(
                                    "text-[10px] font-black uppercase tracking-[0.3em]",
                                    isUnlocked ? "text-primary" : "text-zinc-600"
                                )}>
                                    Mission Prioritaire
                                </span>
                                {isUnlocked && <ShieldCheck className="size-3 text-primary" />}
                            </div>
                            <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">
                                {isUnlocked ? "Badge Ambassadeur Débloqué" : "Objectif Ambassadeur"}
                            </h3>
                            <p className="text-zinc-400 text-xs font-medium max-w-sm">
                                {isUnlocked 
                                    ? "Félicitations Agent. Ton influence est reconnue. Le badge d'élite sera affiché sur ton dossier." 
                                    : "Recrute 3 nouveaux agents via ton lien de parrainage pour débloquer le badge exclusif d'AMBASSADEUR."}
                            </p>
                        </div>

                        {!isUnlocked && (
                            <div className="space-y-2">
                                <div className="flex justify-between items-end text-[10px] font-mono uppercase font-bold">
                                    <span className="text-zinc-500">Recrutement en cours</span>
                                    <span className="text-primary">{referralCount} / {target}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <div 
                                        className="h-full bg-primary shadow-[0_0_10px_#C5F441] transition-all duration-1000"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="shrink-0">
                        {isUnlocked ? (
                            <div className="px-6 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                <Star className="size-3 fill-primary" />
                                Rang Atteint
                            </div>
                        ) : (
                            <Button 
                                variant="outline"
                                onClick={() => {
                                    document.getElementById('referral-card')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                className="h-11 px-6 border-white/10 bg-white/2 hover:bg-white/5 text-white font-bold uppercase text-[10px] tracking-widest gap-2 rounded-xl group/btn"
                            >
                                Partager mon lien
                                <ArrowRight className="size-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
