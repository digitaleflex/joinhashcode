"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  User, Mail, Globe, Briefcase, 
  Target, Github, Link as LinkIcon, 
  Save, Loader2, ChevronLeft, Camera,
  Shield, Bell, Sparkles,
  Linkedin, Twitter
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { CountrySelector } from "@/components/onboarding/country-selector"
import { UserSituation, MainObjective } from "@/lib/types"

export default function SettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    fetch("/api/auth/get-session") // Assuming there's a route to get full user data
      .then(res => res.json())
      .then(data => {
        if (data?.user) setUserData(data.user)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    // Client-side pseudo validation
    if (userData?.pseudo) {
      const pseudoRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!pseudoRegex.test(userData.pseudo)) {
        toast.error("Le pseudo doit contenir entre 3 et 20 caractères (lettres, chiffres et '_' uniquement).")
        return;
      }
    }

    setSaving(true)
    try {
      const res = await fetch("/api/user/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })

      if (!res.ok) {
        const errorMsg = await res.text()
        throw new Error(errorMsg || "Mise à jour échouée")
      }
      
      toast.success("Profil mis à jour avec succès !")
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="gap-2">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Button>
          <h1 className="text-sm font-mono uppercase tracking-widest font-bold">Paramètres du Compte</h1>
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={saving}
            className="btn-primary-glow px-6 h-10 rounded-xl"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Profile Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <User className="w-5 h-5" />
            <h2 className="text-lg font-mono uppercase tracking-wider">Identité</h2>
          </div>
          
          <div className="grid md:grid-cols-[200px_1fr] gap-8 bg-card/20 border border-border/40 p-8 rounded-3xl">
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full bg-muted overflow-hidden border-2 border-border/40">
                  {userData?.image ? (
                    <img src={userData.image} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-muted-foreground">
                      {userData?.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-110 transition-transform">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground uppercase text-center leading-tight">
                Cliquez pour modifier<br/>votre avatar
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Nom Complet</label>
                  <Input 
                    value={userData?.name || ""} 
                    onChange={e => setUserData({...userData, name: e.target.value})}
                    className="bg-card/30 border-border/40 h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Pseudo</label>
                  <Input 
                    value={userData?.pseudo || ""} 
                    onChange={e => setUserData({...userData, pseudo: e.target.value})}
                    className="bg-card/30 border-border/40 h-12 rounded-xl"
                    placeholder="@votre_pseudo"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Email (Non modifiable)</label>
                <div className="flex items-center gap-3 px-4 h-12 bg-muted/30 border border-border/20 rounded-xl text-muted-foreground text-sm cursor-not-allowed">
                  <Mail className="w-4 h-4" />
                  {userData?.email}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Context Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Globe className="w-5 h-5" />
            <h2 className="text-lg font-mono uppercase tracking-wider">Contexte & Localisation</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 bg-card/20 border border-border/40 p-8 rounded-3xl">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Pays de résidence</label>
              <CountrySelector 
                value={userData?.country || ""} 
                onChange={val => setUserData({...userData, country: val})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Situation Actuelle</label>
              <select 
                value={userData?.currentSituation || ""} 
                onChange={e => setUserData({...userData, currentSituation: e.target.value})}
                className="w-full bg-card/30 border border-border/40 h-14 rounded-2xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 appearance-none"
              >
                <option value="" disabled>Sélectionner...</option>
                {Object.values(UserSituation).map(sit => (
                  <option key={sit} value={sit}>{sit}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* Links Section */}
        <section className="space-y-6">
          <div className="flex items-center gap-2 text-primary">
            <Github className="w-5 h-5" />
            <h2 className="text-lg font-mono uppercase tracking-wider">Liens Sociaux</h2>
          </div>

          <div className="grid gap-4 bg-card/20 border border-border/40 p-8 rounded-3xl">
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">URL GitHub</label>
              <div className="relative">
                <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  value={userData?.githubUrl || ""} 
                  onChange={e => setUserData({...userData, githubUrl: e.target.value})}
                  className="bg-card/30 border-border/40 h-12 rounded-xl pl-12"
                  placeholder="https://github.com/votre-user"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">LinkedIn</label>
              <div className="relative">
                <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0077B5]" />
                <Input 
                  value={userData?.linkedinUrl || ""} 
                  onChange={e => setUserData({...userData, linkedinUrl: e.target.value})}
                  className="bg-card/30 border-border/40 h-12 rounded-xl pl-12"
                  placeholder="https://linkedin.com/in/votre-profil"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">X (Twitter)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current text-white">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                  </svg>
                </div>
                <Input 
                  value={userData?.twitterUrl || ""} 
                  onChange={e => setUserData({...userData, twitterUrl: e.target.value})}
                  className="bg-card/30 border-border/40 h-12 rounded-xl pl-12"
                  placeholder="https://x.com/votre-user"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-mono uppercase text-muted-foreground ml-1">Portfolio / Site Web</label>
              <div className="relative">
                <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input 
                  value={userData?.portfolioUrl || ""} 
                  onChange={e => setUserData({...userData, portfolioUrl: e.target.value})}
                  className="bg-card/30 border-border/40 h-12 rounded-xl pl-12"
                  placeholder="https://votre-site.com"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="pt-12 border-t border-border/40">
          <div className="bg-destructive/5 border border-destructive/20 p-8 rounded-3xl flex items-center justify-between">
            <div>
              <h3 className="text-destructive font-bold">Zone de Danger</h3>
              <p className="text-xs text-muted-foreground">Supprimer votre compte et toutes vos données de progression.</p>
            </div>
            <Button variant="destructive" size="sm">Supprimer mon compte</Button>
          </div>
        </section>
      </div>

      {/* Floating Sparkles for Premium Feel */}
      <div className="fixed bottom-10 right-10 pointer-events-none opacity-20">
        <Sparkles className="w-12 h-12 text-primary animate-pulse" />
      </div>
    </div>
  )
}
