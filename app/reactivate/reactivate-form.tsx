"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RotateCcw, LogOut } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export function ReactivateForm() {
  const [sending, setSending] = useState(false)
  const router = useRouter()

  const handleReactivate = async () => {
    setSending(true)
    try {
      const res = await fetch("/api/user/reactivate", { method: "PATCH" })
      if (res.ok) {
        toast.success("Compte réactivé ! Redirection...")
        setTimeout(() => router.push("/onboarding"), 1500)
      } else {
        toast.error("Erreur lors de la réactivation")
      }
    } catch {
      toast.error("Erreur réseau")
    } finally {
      setSending(false)
    }
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-6 animate-grid-drift z-[var(--z-base)]" />
      <div aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-amber-500/5 rounded-full blur-[130px] z-[var(--z-base)]" />

      <Card className="w-full max-w-md border border-white/8 glass-card relative z-[var(--z-content)] shadow-2xl rounded-2xl overflow-hidden cyber-notch-sm">
        <div className="absolute top-0 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-amber-500/50 to-transparent" />

        <CardHeader className="text-center space-y-2 pt-8 pb-6">
          <CardTitle className="text-2xl font-black uppercase tracking-tight text-white italic leading-none">
            Compte désactivé
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400 font-medium max-w-80 mx-auto leading-relaxed">
            Ton profil HASHCODE est actuellement désactivé. Tu peux le réactiver à tout moment pour retrouver l&apos;accès à ton dashboard, tes missions et ta squad.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 sm:px-8 pb-8">
          <Button
            onClick={handleReactivate}
            disabled={sending}
            className="w-full h-12 text-[11px] uppercase font-bold tracking-wider rounded-xl transition-all cursor-pointer gap-2 btn-primary-glow"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <RotateCcw className="size-4" />
            )}
            {sending ? "Réactivation..." : "Réactiver mon compte"}
          </Button>

          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full h-11 text-[10px] uppercase font-bold tracking-wider rounded-xl border-white/10 bg-white/1 hover:bg-white/5 transition-all cursor-pointer gap-2"
          >
            <LogOut className="size-3.5" />
            Me déconnecter
          </Button>

          <p className="text-[9px] text-center text-zinc-600 font-mono">
            Tu préfères supprimer définitivement ?{" "}
            <span className="text-zinc-500">Contacte-nous via le formulaire de contact.</span>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
