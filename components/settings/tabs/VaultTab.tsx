"use client"

import { Button } from "@/components/ui/button"

interface VaultTabProps {
  userData: any
}

export function VaultTab({ userData }: VaultTabProps) {
  return (
    <div className="space-y-6">
      <div className="border-b border-white/5 pb-6">
        <h2 className="text-lg font-bold text-white">Carte de membre</h2>
        <p className="text-xs text-zinc-500 mt-1 font-mono">Ta carte partageable — visible sur ton dossier.</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/30">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/card/${userData?.id}`}
            alt="Ta carte de membre HASHCODE"
            className="w-full"
          />
        </div>
        <Button asChild className="w-full h-12 rounded-xl btn-primary-glow font-black uppercase text-[10px] cursor-pointer">
          <a href="/dossier">Voir mon dossier et partager →</a>
        </Button>
      </div>
    </div>
  )
}
