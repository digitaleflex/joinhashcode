"use client"

import { Fingerprint, Shield, Lock, AlertTriangle, Key, MonitorSmartphone } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { TwoFactorSetup } from "@/components/settings/TwoFactorSetup"
import { PasskeySetup } from "@/components/settings/PasskeySetup"
import { ActiveSessions } from "@/components/settings/ActiveSessions"
import { authClient } from "@/lib/auth-client"

interface AccountTabProps {
  userData: any
}

export function AccountTab({ userData }: AccountTabProps) {
  const emailLocal = userData?.email?.split("@")[0] || ""
  const emailDomain = userData?.email?.split("@")[1] || ""

  return (
    <div className="space-y-8">
      {/* Email / connection info */}
      <div className="space-y-6">
        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <Fingerprint className="size-4 text-emerald-500" /> Informations de connexion
        </label>
        <div className="relative p-[1.5px] cyber-notch bg-linear-to-r from-emerald-500/20 via-emerald-500/5 to-transparent">
          <div className="p-8 bg-black/85 cyber-notch space-y-6 relative overflow-hidden group/acc">
            <div className="absolute inset-0 cyber-grid-emerald pointer-events-none opacity-40" aria-hidden="true" />
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/acc:opacity-10 transition-opacity" aria-hidden="true">
              <Shield className="size-16 text-emerald-400" />
            </div>
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" aria-hidden="true" />
                <span className="text-[9px] font-mono text-emerald-400 uppercase tracking-wider font-bold">Connexion sécurisée</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                <span className="text-emerald-400">{emailLocal}</span>
                <span className="text-zinc-600 font-light">@</span>
                <span className="text-zinc-400 text-sm">{emailDomain}</span>
              </h3>
              <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
                Identifiant unifié : <span className="text-zinc-400 font-bold select-all">{userData?.id}</span>
              </p>
            </div>
            <div className="pt-4 border-t border-white/5 flex flex-wrap items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-2">
                <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" aria-hidden="true" />
                <span className="text-[9px] font-mono text-emerald-400/80 uppercase font-bold tracking-wider">Authentification gérée par Better Auth</span>
              </div>
              <div className="text-[9px] font-mono text-zinc-500">STATUT : VÉRIFIÉ</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2FA Section */}
      <div className="pt-4 border-t border-white/5 space-y-6">
        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <Lock className="size-4 text-primary" /> Protection du compte (2FA)
        </label>
        <TwoFactorSetup user={userData} />
      </div>

      {/* Passkey Section */}
      <div className="pt-4 border-t border-white/5 space-y-6">
        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <Key className="size-4 text-primary" /> Clés d&apos;accès biométriques
        </label>
        <div className="relative p-[1.5px] cyber-notch bg-linear-to-r from-primary/20 via-primary/5 to-transparent">
          <div className="p-8 bg-black/85 cyber-notch relative overflow-hidden group/passkey">
             <div className="absolute inset-0 cyber-grid-primary pointer-events-none opacity-20" aria-hidden="true" />
             <PasskeySetup />
          </div>
        </div>
      </div>

      {/* Active Sessions Section */}
      <div className="pt-4 border-t border-white/5 space-y-6">
        <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
          <MonitorSmartphone className="size-4 text-emerald-500" /> Appareils et Sessions actives
        </label>
        <div className="relative p-[1.5px] cyber-notch bg-linear-to-r from-emerald-500/20 via-emerald-500/5 to-transparent">
          <div className="p-8 bg-black/85 cyber-notch relative overflow-hidden group/sessions">
             <div className="absolute inset-0 cyber-grid-emerald pointer-events-none opacity-10" aria-hidden="true" />
             <ActiveSessions />
          </div>
        </div>
      </div>

      {/* Export data */}
      <div className="pt-4 border-t border-white/5 space-y-6">
        <div className="relative p-[1.5px] cyber-notch bg-linear-to-r from-zinc-700/30 to-zinc-900/10 overflow-hidden">
          <div className="p-8 md:p-10 bg-zinc-950/90 cyber-notch flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-3 left-3 size-3 border-t border-l border-zinc-500/30 pointer-events-none" aria-hidden="true" />
            <div className="absolute top-3 right-3 size-3 border-t border-r border-zinc-500/30 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-3 left-3 size-3 border-b border-l border-zinc-500/30 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-3 right-3 size-3 border-b border-r border-zinc-500/30 pointer-events-none" aria-hidden="true" />
            <div className="space-y-2 text-center sm:text-left relative z-10 flex-1">
              <h3 className="text-base font-bold text-zinc-200 uppercase tracking-wider">Télécharger mes données</h3>
              <p className="text-xs text-zinc-400 max-w-sm font-light leading-relaxed">
                Exporte toutes tes données personnelles conformément au RGPD (Art. 20). Profil, missions, check-ins, activité.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 z-10">
              <a
                href="/api/user/export?format=json"
                download
                className="h-10 px-5 inline-flex items-center justify-center text-[10px] font-mono font-black uppercase tracking-wider cyber-notch-sm border border-zinc-600 text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                JSON
              </a>
              <a
                href="/api/user/export?format=zip"
                download
                className="h-10 px-5 inline-flex items-center justify-center text-[10px] font-mono font-black uppercase tracking-wider cyber-notch-sm border border-zinc-600 text-zinc-300 bg-zinc-900 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
              >
                ZIP
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Delete account */}
      <div className="pt-4 border-t border-white/5 space-y-6">
        <div className="relative p-[1.5px] cyber-notch bg-linear-to-r from-red-500/30 to-red-950/10 overflow-hidden">
          <div className="absolute inset-x-0 h-[1.5px] bg-red-500 opacity-30 shadow-[0_0_12px_#ef4444] animate-laser-sweep z-10 pointer-events-none" style={{ '--laser-color': '#ef4444' } as React.CSSProperties} aria-hidden="true" />
          <div className="p-8 md:p-10 bg-zinc-950/90 cyber-notch flex flex-col sm:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_10px,#450a0a_10px,#450a0a_20px)] pointer-events-none" aria-hidden="true" />
            <div className="absolute top-3 left-3 size-3 border-t border-l border-red-500/50 pointer-events-none" aria-hidden="true" />
            <div className="absolute top-3 right-3 size-3 border-t border-r border-red-500/50 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-3 left-3 size-3 border-b border-l border-red-500/50 pointer-events-none" aria-hidden="true" />
            <div className="absolute bottom-3 right-3 size-3 border-b border-r border-red-500/50 pointer-events-none" aria-hidden="true" />
            <div className="absolute inset-0 cyber-grid-red pointer-events-none opacity-20" aria-hidden="true" />

            <div className="space-y-4 text-center sm:text-left relative z-10 flex-1">
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <div className="size-1.5 rounded-full bg-red-500 animate-ping" aria-hidden="true" />
                <h3 className="text-base font-bold text-red-500 uppercase tracking-wider">Suppression du profil</h3>
              </div>
              <p className="text-xs text-zinc-400 max-w-sm font-light leading-relaxed">
                Supprime définitivement ton dossier, tes habilitations et toute ta progression. Cette action est irréversible.
              </p>
              <div className="bg-red-950/40 border border-red-500/30 p-4 rounded-xl flex items-start gap-3 w-full mt-4">
                <AlertTriangle className="size-4 text-red-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="space-y-1 font-mono text-[9px] text-left">
                  <div className="text-red-400 font-black uppercase tracking-wider">ACTION IRRÉVERSIBLE</div>
                  <div className="text-zinc-500 leading-normal">
                    Ton profil, score d&apos;évolution et permissions communautaires seront définitivement effacés.
                  </div>
                </div>
              </div>
            </div>

            <div className="relative shrink-0 z-10">
              <Button
                variant="destructive"
                className="h-14 font-mono font-black px-8 text-[10px] uppercase cyber-notch-sm bg-red-950/80 border border-red-500 text-red-400 hover:bg-red-500 hover:text-black shadow-[0_0_20px_rgba(239,68,68,0.2)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] cursor-pointer"
                onClick={async () => {
                  if (!confirm("Supprimer ton profil HASHCODE ? Toutes tes données seront effacées.")) return
                  const res = await fetch("/api/user/delete", { method: "DELETE" })
                  if (res.ok) {
                    await authClient.signOut()
                    window.location.href = "/"
                  } else {
                    toast.error("Erreur lors de la désactivation")
                  }
                }}
              >
                DÉSACTIVER_PROFIL
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
