"use client"

import { Globe } from "lucide-react"
import { Github, Linkedin, Twitter } from "@/components/ui/brand-icons"
import type { SVGProps, ComponentType } from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { SettingsUserData } from "@/lib/types"

interface LinksTabProps {
  userData: Partial<SettingsUserData>
  updateData: (next: Partial<SettingsUserData>) => void
}

const LINK_CONFIG: { id: keyof SettingsUserData; icon: ComponentType<SVGProps<SVGSVGElement>>; label: string; placeholder: string }[] = [
  { id: "githubUrl", icon: Github, label: "Lien GitHub", placeholder: "github.com/votre-user" },
  { id: "linkedinUrl", icon: Linkedin, label: "Profil LinkedIn", placeholder: "linkedin.com/in/profil" },
  { id: "twitterUrl", icon: Twitter, label: "Compte X (Twitter)", placeholder: "x.com/votre-user" },
  { id: "portfolioUrl", icon: Globe, label: "Site Web / Portfolio", placeholder: "votre-site.com" },
]

export function LinksTab({ userData, updateData }: LinksTabProps) {
  return (
    <div className="space-y-8">
      <div className="space-y-1 border-b border-white/5 pb-4">
        <p className="text-sm font-semibold text-cyan-400">Réseaux & Liens</p>
        <p className="text-zinc-400 text-xs font-light">Lier tes réseaux renforce ton profil et ton score de confiance.</p>
      </div>
      <div className="grid gap-5">
        {LINK_CONFIG.map((link) => {
          const isLinked = !!userData[link.id]
          return (
            <div key={link.id} className="relative p-5 bg-zinc-950/40 border border-cyan-500/10 rounded-4xl flex flex-col md:flex-row items-center justify-between gap-5 group/uplink">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="flex items-center justify-center size-10 rounded-xl bg-zinc-900 border border-white/5 shrink-0">
                  <link.icon className="size-5 text-zinc-400 group-focus-within/uplink:text-cyan-400 transition-colors" />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-semibold text-zinc-400 block">{link.label}</span>
                  <div className="flex items-center gap-2">
                    <div className={cn("size-1.5 rounded-full", isLinked ? "bg-cyan-400 shadow-[0_0_10px_#06b6d4]" : "bg-zinc-600")} />
                    <span className={cn("text-[9px] font-mono font-bold uppercase tracking-wider", isLinked ? "text-cyan-400" : "text-zinc-500")}>
                      {isLinked ? "Connecté" : "Non connecté"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative w-full md:w-80">
                <Input
                  value={String(userData[link.id] ?? "")}
                  onChange={e => updateData({ ...userData, [link.id]: e.target.value } as Partial<SettingsUserData>)}
                  className="input-premium h-12 rounded-xl text-xs font-bold pl-4 focus:border-cyan-500/60 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                  placeholder={link.placeholder}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
