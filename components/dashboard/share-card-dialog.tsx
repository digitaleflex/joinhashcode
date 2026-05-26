"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Share2, Download, Copy, Check, ExternalLink } from "lucide-react"
import { toast } from "sonner"

interface ShareCardDialogProps {
  userId: string
  userName: string
}

export function ShareCardDialog({ userId, userName }: ShareCardDialogProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}/dossier/${userId}` // Hypothetical public profile URL
  const imageUrl = `/api/card/${userId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success("Lien copié dans le presse-papier")
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 text-white font-black uppercase group transition-all">
          <Share2 className="mr-2 size-4 group-hover:text-primary" />
          Générer Carte Partage
          <ExternalLink className="ml-auto size-4 opacity-30 group-hover:opacity-100" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-150 bg-zinc-950 border-white/10 p-0 overflow-hidden rounded-[2.5rem]">
        <div className="absolute inset-0 bg-gradient-mesh opacity-20 pointer-events-none" />
        
        <div className="p-8 space-y-6 relative z-10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic text-white flex items-center gap-3">
                <Share2 className="size-6 text-primary" />
                Partager mon Habilitation
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-mono text-[10px] uppercase">
                Génération de l'empreinte numérique .Data_H26
            </DialogDescription>
          </DialogHeader>

          <div className="aspect-1200/630 w-full rounded-2xl border border-white/10 bg-black/50 overflow-hidden relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imageUrl} 
              alt={`Carte Habilitation de ${userName}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                <p className="text-[10px] font-mono text-white/60 uppercase">Format optimisé pour LinkedIn / X</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
                onClick={() => window.open(imageUrl, '_blank')}
                variant="outline" 
                className="h-12 rounded-xl border-white/10 text-white font-bold uppercase text-[10px] hover:bg-white/5"
            >
                <Download className="mr-2 size-4" />
                Télécharger HD
            </Button>
            <Button 
                onClick={copyToClipboard}
                className="h-12 rounded-xl btn-primary-glow font-bold uppercase text-[10px]"
            >
                {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
                {copied ? "Copié !" : "Copier Lien Profil"}
            </Button>
          </div>

          <div className="pt-6 border-t border-white/5">
             <div className="flex items-center gap-4 p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_#C5F441]" />
                <p className="text-[10px] text-zinc-400 font-mono leading-tight">
                    <span className="text-primary font-black uppercase">Conseil :</span> Partager ton habilitation augmente ton score de Vibrancy et attire de potentiels membres pour ta Squad.
                </p>
             </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
