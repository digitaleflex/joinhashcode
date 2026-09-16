"use client"

import { useState, useEffect } from "react"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { Shield, Cookie, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import Link from "next/link"

export default function CookiesPage() {
  const [analyticsConsent, setAnalyticsConsent] = useState(false)

  useEffect(() => {
    setAnalyticsConsent(localStorage.getItem("hc_cookie_consent") === "accepted")
  }, [])

  const handleSave = () => {
    localStorage.setItem("hc_cookie_consent", analyticsConsent ? "accepted" : "declined")
    toast.success("Préférences enregistrées")
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Nav />
      <div className="pt-24 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Shield className="size-3.5 text-primary" />
              <span className="text-3xs font-mono font-black uppercase text-primary">Consentement</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Gestion des <span className="text-primary">Cookies</span>
            </h1>
            <p className="text-zinc-400 text-sm">
              Tu contrôles les données que tu souhaites partager. HASHCODE respecte tes choix et ne collecte rien sans ton accord explicite.
            </p>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-primary/20 transition-colors">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-1 h-5 w-5 rounded border-white/20 bg-zinc-800 text-primary opacity-60"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Cookie className="size-4 text-zinc-500" />
                  <span className="text-sm font-bold text-white">Cookies essentiels</span>
                  <span className="text-3xs font-mono uppercase text-zinc-600 px-2 py-0.5 rounded-full bg-zinc-800">Obligatoire</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Nécessaires au fonctionnement de la plateforme : authentification, session sécurisée, protection anti-fraude de base.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-4 p-5 rounded-2xl bg-zinc-900/40 border border-white/5 hover:border-primary/20 transition-colors cursor-pointer">
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-white/20 bg-zinc-800 text-primary focus:ring-primary"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Cookie className="size-4 text-primary" />
                  <span className="text-sm font-bold text-white">Cookies analytiques</span>
                </div>
                <p className="text-xs text-zinc-500 mt-1">
                  Nous aident à comprendre comment tu utilises la plateforme pour l&apos;améliorer. Données anonymisées.
                </p>
              </div>
            </label>


          </div>

          <Button onClick={handleSave} className="btn-primary-glow h-12 px-10 rounded-xl text-xs font-bold uppercase tracking-wider">
            <Save className="size-4 mr-2" />
            Enregistrer mes préférences
          </Button>

          <div className="border-t border-white/5 pt-8">
            <p className="text-xs text-zinc-600 leading-relaxed">
              Tu peux modifier ces préférences à tout moment. En savoir plus dans notre{" "}
              <Link href="/privacy" className="underline hover:text-primary transition-colors">Politique de confidentialité</Link>.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
