"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, MessageSquare, Lightbulb, Shield, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [type, setType] = useState<"support" | "suggestion" | "partner">("support")
  const [formData, setFormData] = useState({
    email: "",
    subject: "",
    content: ""
  })
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          ...formData
        })
      })

      if (response.ok) {
        setIsSent(true)
        setFormData({ email: "", subject: "", content: "" })
      } else {
        alert("Erreur lors de la transmission. Réessaye.")
      }
    } catch (error) {
      console.error(error)
      alert("Erreur réseau.")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Nav />
      
      <div className="relative pt-8 sm:pt-32 pb-24 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-20" />
        
        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16">
            
            {/* Left Content: Text & Info */}
            <div className="lg:col-span-5">
              <div className="inline-flex items-center gap-3 mb-6">
                <span className="h-px w-8 bg-primary/50" />
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-primary">
                  Communications_HUB
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-8">
                Transmets tes <span className="text-primary text-glow">Données</span>.
              </h1>
              <p className="text-zinc-400 text-lg leading-relaxed mb-12">
                Que ce soit pour un bug critique, une idée révolutionnaire ou une alliance stratégique, notre canal est ouvert 24/7.
              </p>

              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/30 backdrop-blur-sm">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Shield className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-xs uppercase tracking-widest text-white">System Status</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                      <span className="text-zinc-500">Support Latency</span>
                      <span className="text-emerald-500">{"<"} 24h</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase">
                      <span className="text-zinc-500">Core Network</span>
                      <span className="text-emerald-500">Operational</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content: The Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-[2.5rem] border border-white/10 bg-zinc-900/40 backdrop-blur-xl shadow-2xl relative">
                {isSent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-20 text-center"
                  >
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
                      <Send className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-white">Transmission Réussie.</h2>
                    <p className="text-zinc-400 mb-8">Ton message a été injecté dans notre flux prioritaire. Notre équipe reviendra vers toi très vite.</p>
                    <Button variant="outline" onClick={() => setIsSent(false)}>Nouvelle transmission</Button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        { id: "support", icon: MessageSquare, label: "Support" },
                        { id: "suggestion", icon: Lightbulb, label: "Idée" },
                        { id: "partner", icon: Shield, label: "Elite" },
                      ].map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setType(item.id as any)}
                          className={`flex items-center sm:flex-col justify-start sm:justify-center gap-4 sm:gap-2 p-4 sm:p-4 rounded-2xl border transition-all ${
                            type === item.id 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-black/20 border-white/5 text-zinc-500 hover:border-white/20"
                          }`}
                        >
                          <item.icon className="h-5 w-5 shrink-0" />
                          <span className="text-[10px] font-mono uppercase tracking-widest">{item.label}</span>
                        </button>
                      ))}
                    </div>

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
                      <label className="text-[10px] font-mono uppercase text-zinc-500 ml-1">Transmission_Content</label>
                      <Textarea 
                        placeholder={type === "suggestion" ? "Décris-nous ton idée géniale..." : "Comment pouvons-nous t'aider ?"} 
                        required 
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="min-h-[200px] bg-black/40 border-white/10 focus:border-primary/50 transition-all rounded-2xl resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      disabled={isSending}
                      className="w-full h-14 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold uppercase tracking-widest rounded-xl shadow-[0_10px_30px_-10px_rgba(197,244,65,0.3)] group"
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
