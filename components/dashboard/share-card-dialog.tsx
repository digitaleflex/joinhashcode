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
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://joinhashcode.com'
  const profileUrl = `${appUrl}/u/${userId}`
  const imageUrl = `/api/card/${userId}`
  const shareText = `Habilitation HASHCODE validée. Profil calibré : ${userName.toUpperCase()} [${userId.slice(0,4)}]. Prêt pour les prochaines missions du réseau. 🚀 #HashCode #TechTalent`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    toast.success("Lien copié dans le presse-papier")
    setTimeout(() => setCopied(false), 2000)
  }

  const shareNative = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `Profil HASHCODE — ${userName}`, text: shareText, url: profileUrl })
      } catch {}
    } else {
      copyToClipboard()
    }
  }

  const shareTwitter = () => {
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(profileUrl)}`
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const shareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`
    window.open(url, "_blank", "noopener,noreferrer")
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

          <div className="grid grid-cols-2 gap-3">
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
                variant="outline"
                className="h-12 rounded-xl border-white/10 text-white font-bold uppercase text-[10px] hover:bg-white/5"
            >
                {copied ? <Check className="mr-2 size-4" /> : <Copy className="mr-2 size-4" />}
                {copied ? "Copié !" : "Copier Lien"}
            </Button>
            <Button
                onClick={shareTwitter}
                className="h-12 rounded-xl bg-black border border-white/10 hover:bg-zinc-900 text-white font-bold uppercase text-[10px] col-span-1"
            >
                <svg className="mr-2 size-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Partager sur X
            </Button>
            <Button
                onClick={shareLinkedIn}
                className="h-12 rounded-xl bg-[#0077B5]/10 border border-[#0077B5]/30 hover:bg-[#0077B5]/20 text-[#0077B5] font-bold uppercase text-[10px]"
            >
                <svg className="mr-2 size-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
            </Button>
          </div>
          <Button
            onClick={shareNative}
            className="w-full h-12 rounded-xl btn-primary-glow font-bold uppercase text-[10px]"
          >
            <Share2 className="mr-2 size-4" />
            Partager (Web Share)
          </Button>

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
