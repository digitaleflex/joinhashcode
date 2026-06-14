"use client"

import { useState } from "react"
import { Users, Shield, Sparkles, Trophy, Cpu, ExternalLink, MessageSquare } from "lucide-react"
import { Github, Linkedin, Twitter } from "@/components/ui/brand-icons"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface Partner {
  id: string
  pseudo: string | null
  class: string | null
  githubUrl: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
}

interface SuggestedPartnersProps {
  partners: Partner[]
}

const CLASS_CONFIG: Record<string, {
  label: string
  color: string
  borderColor: string
  bgColor: string
  icon: any
}> = {
  BUILDER: {
    label: "BUILDER",
    color: "text-blue-400",
    borderColor: "border-blue-500/20",
    bgColor: "bg-blue-500/5",
    icon: Shield,
  },
  CREATOR: {
    label: "CRÉATEUR",
    color: "text-purple-400",
    borderColor: "border-purple-500/20",
    bgColor: "bg-purple-500/5",
    icon: Sparkles,
  },
  STRATEGIST: {
    label: "STRATÈGE",
    color: "text-amber-400",
    borderColor: "border-amber-500/20",
    bgColor: "bg-amber-500/5",
    icon: Trophy,
  },
  CATALYST: {
    label: "CATALYSEUR",
    color: "text-emerald-400",
    borderColor: "border-emerald-500/20",
    bgColor: "bg-emerald-500/5",
    icon: Cpu,
  },
}

export function SuggestedPartners({ partners }: SuggestedPartnersProps) {
  const [activePartner, setActivePartner] = useState<Partner | null>(null)

  if (partners.length === 0) return null

  return (
    <div className="rounded-2xl border border-border/40 bg-card/20 overflow-hidden">
      <div className="px-5 py-4 border-b border-border/30">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-primary" />
          <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-wider">
            Partenaires suggérés
          </span>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <p className="text-[10px] font-mono text-zinc-500 uppercase leading-relaxed tracking-wide">
          Renforce ton équipage pour cette mission hybride. Profils complémentaires recommandés :
        </p>

        <div className="space-y-3">
          {partners.map((partner) => {
            const config = CLASS_CONFIG[partner.class?.toUpperCase() || "BUILDER"] || CLASS_CONFIG.BUILDER
            const Icon = config.icon

            return (
              <div
                key={partner.id}
                className="flex items-center justify-between p-3.5 rounded-xl border border-border/20 bg-zinc-950/40 hover:border-primary/20 hover:bg-primary/[0.01] transition-all duration-200"
              >
                {/* Left: Pseudo & Role */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold text-zinc-200">
                    @{partner.pseudo || "agent_anonyme"}
                  </div>
                  <div className={cn("flex items-center gap-1.5 text-[9px] font-mono font-bold tracking-wide", config.color)}>
                    <Icon className="w-3 h-3" />
                    {config.label}
                  </div>
                </div>

                {/* Right: Contact Trigger */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-[9px] font-mono uppercase tracking-widest border-border/60 hover:border-primary hover:bg-primary/10 transition-colors"
                      onClick={() => setActivePartner(partner)}
                    >
                      Contacter
                    </Button>
                  </DialogTrigger>

                  <DialogContent className="border-border/40 bg-zinc-950/95 max-w-sm">
                    <DialogHeader className="space-y-2.5">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-primary/50 uppercase tracking-widest">
                        <span>Matchmaking // HASHCODE</span>
                      </div>
                      <DialogTitle className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                        <span>Transmission Directe :</span>
                        <span className="text-primary font-mono text-sm">@{partner.pseudo}</span>
                      </DialogTitle>
                      <DialogDescription className="text-xs text-zinc-400 font-mono">
                        Ce profil possède une complémentarité psychométrique élevée avec ton évolution comportementale actuelle.
                      </DialogDescription>
                    </DialogHeader>

                    {/* Partner role info */}
                    <div className="mt-2 p-3.5 rounded-xl border border-border/30 bg-zinc-900/40 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className={cn("inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border", config.borderColor, config.bgColor, config.color)}>
                          <Icon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
                        Fais équipe avec cet agent pour maximiser l&apos;XP, débloquer le badge <span className="font-mono text-primary">HYPER_LINK</span> et partager vos retours de build.
                      </p>
                    </div>

                    {/* Social networks & links */}
                    <div className="space-y-3 pt-3">
                      <div className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">
                        Canaux de communication
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        {partner.githubUrl && (
                          <a
                            href={partner.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-zinc-900/20 hover:border-zinc-300 hover:bg-zinc-100/5 transition-all text-xs font-mono text-zinc-300"
                          >
                            <span className="flex items-center gap-2">
                              <Github className="w-4 h-4 text-zinc-400" />
                              GitHub profile
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                          </a>
                        )}

                        {partner.linkedinUrl && (
                          <a
                            href={partner.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-zinc-900/20 hover:border-blue-400 hover:bg-blue-500/5 transition-all text-xs font-mono text-zinc-300"
                          >
                            <span className="flex items-center gap-2">
                              <Linkedin className="w-4 h-4 text-blue-400" />
                              LinkedIn profile
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-blue-500/50" />
                          </a>
                        )}

                        {partner.twitterUrl && (
                          <a
                            href={partner.twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-zinc-900/20 hover:border-sky-400 hover:bg-sky-500/5 transition-all text-xs font-mono text-zinc-300"
                          >
                            <span className="flex items-center gap-2">
                              <Twitter className="w-4 h-4 text-sky-400" />
                              Twitter profile
                            </span>
                            <ExternalLink className="w-3.5 h-3.5 text-sky-500/50" />
                          </a>
                        )}

                        {!partner.githubUrl && !partner.linkedinUrl && !partner.twitterUrl && (
                          <div className="p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5 text-center space-y-2">
                            <MessageSquare className="w-6 h-6 text-yellow-500/70 mx-auto" />
                            <p className="text-[10px] font-mono text-yellow-500/80 leading-normal">
                              Aucun réseau externe configuré par cet agent. Encourage-le à ajouter ses contacts sur Discord !
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
