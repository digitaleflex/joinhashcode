"use client"

import { Suspense, useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, MessageSquare, Lightbulb, Shield, Users, Loader2 } from "lucide-react"

type ContactType = "support" | "suggestion" | "partner" | "team"

function ContactForm() {
  const searchParams = useSearchParams()
  const [type, setType] = useState<ContactType>("support")
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    content: "",
    github: "",
    portfolio: "",
    skills: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  useEffect(() => {
    const t = searchParams.get("type")
    if (t === "team" || t === "partner" || t === "suggestion") setType(t)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      const typeMap: Record<string, string> = {
        support: "BUG",
        suggestion: "FEATURE",
        partner: "PARTNERSHIP",
        team: "TEAM",
      }

      const payload: Record<string, string> = {
        type: typeMap[type] || "OTHER",
        email: formData.email,
        subject: formData.subject,
        content: formData.content,
      }
      if (formData.github) payload.github = formData.github
      if (formData.portfolio) payload.portfolio = formData.portfolio
      if (formData.skills) payload.skills = formData.skills

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        setIsSent(true)
        setFormData({ email: "", subject: "", content: "", github: "", portfolio: "", skills: "" })
      } else {
        alert("Erreur lors de la transmission. Réessaye.")
      }
    } catch {
      alert("Erreur réseau.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Nav />
      
      <div className="relative pt-8 sm:pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-20" />
        
        <div className="relative z-[var(--z-content)] mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-primary/50" />
                <span className="font-mono text-[11px] uppercase text-primary">
                  Communications_HUB
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8">
                Transmets tes <span className="text-primary text-glow">Données</span>.
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                Que ce soit pour un bug, une idée, un partenariat ou rejoindre la team HASHCODE, notre canal est ouvert 24/7.
              </p>
            </div>

            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-[2.5rem] border border-white/10 bg-zinc-900/40 backdrop-blur-xl shadow-2xl relative">
                {isSent ? (
                  <div className="py-20 text-center">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <Send className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Transmission Réussie.</h2>
                    <p className="text-zinc-400 mb-8">Ton message a été injecté dans notre flux prioritaire. Notre équipe reviendra vers toi très vite.</p>
                    <Button variant="outline" onClick={() => setIsSent(false)}>Nouvelle transmission</Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      {[
                        { id: "support", icon: MessageSquare, label: "Support" },
                        { id: "suggestion", icon: Lightbulb, label: "Idée" },
                        { id: "partner", icon: Shield, label: "Élite" },
                        { id: "team", icon: Users, label: "La Team" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setType(item.id as ContactType)}
                          className={`flex items-center sm:flex-col justify-start sm:justify-center gap-4 sm:gap-2 p-4 sm:p-4 rounded-2xl border transition-all ${
                            type === item.id 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-black/20 border-white/5 text-zinc-500 hover:border-white/20"
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="text-[10px] font-mono uppercase tracking-wider">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {type === "team" && (
                      <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20 space-y-4">
                        <p className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider font-bold">
                          Tu veux construire HASHCODE avec nous ? Raconte-nous tout.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono uppercase text-zinc-500 ml-1">GitHub / Portfolio</label>
                            <Input
                              placeholder="github.com/tonsuperpseudo"
                              value={formData.github}
                              onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                              className="bg-black/40 border-white/10 focus:border-indigo-500/50 transition-all h-11 rounded-xl"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono uppercase text-zinc-500 ml-1">LinkedIn / X</label>
                            <Input
                              placeholder="linkedin.com/in/tonprofil"
                              value={formData.portfolio}
                              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                              className="bg-black/40 border-white/10 focus:border-indigo-500/50 transition-all h-11 rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[9px] font-mono uppercase text-zinc-500 ml-1">Compétences clés</label>
                          <Input
                            placeholder="Next.js, UI/UX, DevOps, Community, etc."
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                            className="bg-black/40 border-white/10 focus:border-indigo-500/50 transition-all h-11 rounded-xl"
                          />
                        </div>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Identité / Email</label>
                        <Input 
                          placeholder="votre@email.com" 
                          required 
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="bg-black/40 border-white/10 focus:border-primary/50 transition-all h-12 rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Sujet</label>
                        <Input 
                          placeholder="Titre du message" 
                          required 
                          value={formData.subject}
                          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                          className="bg-black/40 border-white/10 focus:border-primary/50 transition-all h-12 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">
                        {type === "team" ? "Parle-nous de toi et de ta motivation" : "Transmission_Content"}
                      </label>
                      <Textarea 
                        placeholder={
                          type === "team"
                            ? "Pourquoi veux-tu rejoindre HASHCODE ? Qu'apporterais-tu à l'équipe ?"
                            : type === "suggestion"
                            ? "Décris-nous ton idée géniale..."
                            : "Comment pouvons-nous t'aider ?"
                        }
                        required 
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="min-h-[200px] bg-black/40 border-white/10 focus:border-primary/50 transition-all rounded-2xl resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSending}
                      className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold uppercase tracking-wide rounded-xl shadow-[0_10px_30px_-10px_rgba(197,244,65,0.3)] group"
                    >
                      {isSending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Encapsulation...
                        </>
                      ) : (
                        <>
                          Envoyer la Transmission
                          <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ContactForm />
    </Suspense>
  )
}
