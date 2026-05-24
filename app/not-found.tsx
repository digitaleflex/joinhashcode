"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, ChevronLeft, Terminal } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(197,244,65,0.05),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#C5F441 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />

      <div className="max-w-xl w-full text-center relative z-10">
        <div className="mb-8 inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-primary/10 border border-primary/20 rotate-12 animate-pulse">
          <Terminal className="w-12 h-12 text-primary -rotate-12" />
        </div>
        
        <h1 className="text-8xl font-bold tracking-tighter mb-4 bg-linear-to-b from-foreground to-foreground/40 bg-clip-text text-transparent">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold mb-6 tracking-tight">
          Destination introuvable dans le réseau
        </h2>
        
        <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
          Le chemin que vous tentez d'emprunter n'existe pas ou a été déplacé vers un segment sécurisé. Vérifiez l'URL ou revenez à la base.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="h-12 px-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Retour au Terminal
            </Link>
          </Button>
          
          <Button variant="ghost" size="lg" onClick={() => window.history.back()} className="h-12 px-8 rounded-full border border-border/50 hover:bg-card transition-all">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Page précédente
          </Button>
        </div>

        <div className="mt-16 pt-8 border-t border-border/40 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground uppercase">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            Signal Interrompu
          </div>
          <div className="w-px h-3 bg-border/40" />
          <div className="text-[10px] font-mono text-muted-foreground uppercase">
            HASHCODE v4.0.1
          </div>
        </div>
      </div>
    </div>
  )
}
