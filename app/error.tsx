"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCcw, Home } from "lucide-react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
    fetch("/api/log/client-error", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: error?.message,
        digest: (error as any)?.digest,
        stack: error?.stack,
        url: window.location.href,
        userAgent: navigator.userAgent,
      }),
    }).catch(() => {})
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background patterns with error hue */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.05),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ef4444 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />

      <div className="max-w-xl w-full text-center relative z-10">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-red-500/10 border border-red-500/20 animate-bounce">
          <AlertCircle className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-6xl font-bold tracking-tighter mb-4 text-foreground">
          Anomalie Système
        </h1>
        
        <h2 className="text-xl font-medium mb-6 text-zinc-400">
          Une erreur inattendue a compromis l'exécution actuelle.
        </h2>
        
        <div className="p-4 mb-10 rounded-2xl bg-red-500/5 border border-red-500/10 font-mono text-[11px] text-red-400/80 text-left overflow-auto max-h-32">
          <code>
            {error.message || "Erreur d'exécution fatale détectée dans le noyau HASHCODE."}
            <br />
            Digest: {error.digest || "HASH-NULL"}
          </code>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()}
            size="lg" 
            className="h-12 px-8 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Réinitialiser le processus
          </Button>
          
          <Button asChild variant="ghost" size="lg" className="h-12 px-8 rounded-full border border-border/50 hover:bg-card transition-all">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour au Terminal
            </Link>
          </Button>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            Noyau en Panique
          </div>
          <div className="w-px h-3 bg-border/40" />
          <div className="text-[10px] font-mono text-muted-foreground uppercase">
            SYSTEM_OVERLOAD_ERR
          </div>
        </div>
      </div>
    </div>
  )
}
