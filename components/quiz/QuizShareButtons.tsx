"use client"

import { useState, useEffect } from "react"
import { Copy, Check, MessageSquare } from "lucide-react"
import { Linkedin } from "@/components/ui/brand-icons"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface QuizShareButtonsProps {
    profileType: string
    userName: string
}

export function QuizShareButtons({ profileType, userName }: QuizShareButtonsProps) {
    const [copied, setCopied] = useState(false)
    const [referralCode, setReferralCode] = useState<string | null>(null)

    useEffect(() => {
        fetch("/api/referral")
            .then(r => r.ok ? r.json() : null)
            .then(d => { if (d?.referralCode) setReferralCode(d.referralCode) })
            .catch(() => {})
    }, [])
    
    // Construct the share URL (ideally a public profile page or a dedicated result landing)
    // For now, we'll use the site root as a fallback if no public profile exists
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://joinhashcode.com"
    const shareUrl = referralCode ? `${baseUrl}/signin?ref=${referralCode}` : baseUrl
    
    const profileLabel = profileType.toUpperCase()
    const shareText = `Je viens de découvrir mon profil tech sur HASHCODE : je suis un ${profileLabel} ! 🚀\n\n${userName} — rejoins-moi et découvre ton profil.`

    const copyLink = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        toast.success("Lien copié !")
        setTimeout(() => setCopied(false), 2000)
    }

    const shareOnLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        window.open(url, '_blank', 'width=600,height=600')
    }

    const shareOnTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        window.open(url, '_blank', 'width=600,height=400')
    }

    const shareOnWhatsApp = () => {
        const url = `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`
        window.open(url, '_blank')
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-white/5" />
                <span className="text-xs font-mono text-zinc-600 uppercase tracking-[0.3em]">Partager</span>
                <div className="h-px flex-1 bg-white/5" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Button
                    onClick={shareOnLinkedIn}
                    className="h-12 bg-[#0077B5] hover:bg-[#0077B5]/90 text-white rounded-xl gap-2 font-bold uppercase text-xs tracking-widest border-none shadow-[0_0_15px_rgba(0,119,181,0.2)]"
                >
                    <Linkedin className="size-4 fill-current" />
                    LinkedIn
                </Button>

                <Button
                    onClick={shareOnTwitter}
                    className="h-12 bg-black border border-white/10 hover:bg-zinc-900 text-white rounded-xl gap-2 font-bold uppercase text-xs tracking-widest"
                >
                    <svg viewBox="0 0 24 24" className="size-3.5 fill-current">
                        <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                    </svg>
                    X / Twitter
                </Button>

                <Button
                    onClick={shareOnWhatsApp}
                    className="h-12 bg-[#25D366] hover:bg-[#25D366]/90 text-white rounded-xl gap-2 font-bold uppercase text-xs tracking-widest border-none shadow-[0_0_15px_rgba(37,211,102,0.2)]"
                >
                    <MessageSquare className="size-4 fill-current" />
                    WhatsApp
                </Button>

                <Button
                    onClick={copyLink}
                    variant="outline"
                    className="h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white rounded-xl gap-2 font-bold uppercase text-xs tracking-widest transition-all"
                >
                    {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
                    {copied ? "Copié !" : "Lien"}
                </Button>
            </div>
            
            <p className="text-center text-3xs font-mono text-zinc-600 uppercase tracking-tighter">
                Merci de partager HASHCODE
              </p>
        </div>
    )
}
