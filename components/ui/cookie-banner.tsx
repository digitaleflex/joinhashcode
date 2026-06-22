"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cookie, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("hc_cookie_consent")
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("hc_cookie_consent", "accepted")
    setIsVisible(false)
  }

  const handleAcceptEssential = () => {
    localStorage.setItem("hc_cookie_consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("hc_cookie_consent", "declined")
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-100 z-100"
        >
          <div className="bg-zinc-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute -top-24 -right-24 size-48 bg-primary/5 rounded-full blur-[80px]" />
            
            <div className="relative space-y-4">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <Cookie className="size-5" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Respect de ta vie numérique</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Nous utilisons des cookies essentiels pour ta sécurité et ton confort de navigation.
                  </p>
                </div>
              </div>

              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="space-y-3 border-t border-white/5 pt-4"
                >
                  <p className="text-[10px] text-zinc-500">
                    Les cookies essentiels sont toujours actifs. Aucune donnée de localisation n'est collectée.
                  </p>
                </motion.div>
              )}

              <p className="text-[10px] text-zinc-500 leading-tight">
                Tu as le plein contrôle : tu peux modifier ces choix à tout moment sur{" "}
                <Link href="/cookies" className="underline hover:text-zinc-300 transition-colors">la page des cookies</Link>.{" "}
                <button onClick={() => setShowDetails(!showDetails)} className="underline hover:text-zinc-300">
                  {showDetails ? "Masquer" : "Personnaliser"}
                </button>
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  onClick={handleAccept}
                  className="btn-primary-glow flex-1 h-10 rounded-xl text-[10px] font-bold uppercase tracking-wider"
                >
                  {showDetails ? "Tout accepter" : "Accepter"}
                </Button>
                {showDetails && (
                  <Button
                    onClick={handleAcceptEssential}
                    variant="outline"
                    className="flex-1 h-10 rounded-xl text-[10px] font-bold uppercase tracking-wider border-white/10 text-zinc-400 hover:text-white"
                  >
                    Essentiels uniquement
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleDecline}
                  className="flex-1 h-10 rounded-xl text-[10px] font-bold uppercase tracking-wider text-zinc-500 hover:text-white border border-white/5 hover:border-white/10"
                >
                  Continuer sans cookies
                </Button>
              </div>
            </div>
            
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
