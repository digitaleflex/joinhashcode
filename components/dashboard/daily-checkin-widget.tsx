"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Zap, Loader2, Check, Clock, 
  Terminal, Palette, TrendingUp, 
  Layout, Users, Brain, HelpCircle 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

const DOMAINS = [
  { id: "Code", icon: Terminal },
  { id: "Design", icon: Palette },
  { id: "Business", icon: TrendingUp },
  { id: "Contenu", icon: Layout },
  { id: "Réseau", icon: Users },
  { id: "Apprentissage", icon: Brain },
  { id: "Autre", icon: HelpCircle },
]

const DURATIONS = [
  { label: "15min", val: 15 },
  { label: "30min", val: 30 },
  { label: "1h", val: 60 },
  { label: "2h+", val: 120 },
]

const ENERGIES = [
  { val: 1, emoji: "😫" },
  { val: 2, emoji: "😕" },
  { val: 3, emoji: "😐" },
  { val: 4, emoji: "🙂" },
  { val: 5, emoji: "🔥" },
]

export function DailyCheckinWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSubSuccess] = useState(false)

  const [formData, setFormData] = useState({
    note: "",
    domain: "",
    energy: 3,
    duration: 30,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.note || !formData.domain) return

    setIsSubmitting(true)
    try {
      const res = await fetch("/api/user/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed")

      setIsSubSuccess(true)
      toast.success("Check-in enregistré !")
      setTimeout(() => {
        setIsOpen(false)
        setIsSubSuccess(false)
        setFormData({ note: "", domain: "", energy: 3, duration: 30 })
      }, 2000)
    } catch {
      toast.error("Erreur lors de l'enregistrement")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="bg-card/30 border-border/40 backdrop-blur-xl relative overflow-hidden group">
      {!isOpen ? (
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div className="space-y-1">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Check-in Quotidien
            </CardTitle>
            <CardDescription className="text-xs">
              30 secondes pour ancrer tes progrès du jour.
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsOpen(true)}
            className="btn-primary-glow h-9 rounded-xl px-4 text-xs font-bold"
          >
            Faire mon check-in
          </Button>
        </CardHeader>
      ) : (
        <CardContent className="pt-6">
          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="h-16 w-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-primary">
                  <Check className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-bold">Trace enregistrée</p>
                  <p className="text-xs text-muted-foreground">À demain pour la suite du build.</p>
                </div>
              </motion.div>
            ) : (
              <motion.form 
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Qu&apos;as-tu avancé aujourd&apos;hui ?</label>
                  <Textarea 
                    placeholder="Ex: J'ai fini le refactoring du schéma Prisma, j'ai envoyé 3 emails à des clients..."
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                    className="bg-background/50 border-border/40 rounded-xl min-h-[80px] text-sm"
                    maxLength={150}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Domaine</label>
                    <div className="flex flex-wrap gap-1.5">
                      {DOMAINS.map((d) => (
                        <button
                          key={d.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, domain: d.id })}
                          className={`p-2 rounded-lg border transition-all ${
                            formData.domain === d.id 
                            ? "bg-primary/10 border-primary text-primary" 
                            : "bg-background/40 border-border/40 text-muted-foreground hover:border-primary/30"
                          }`}
                          title={d.id}
                        >
                          <d.icon className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Énergie</label>
                    <div className="flex gap-1.5 h-full items-center">
                      {ENERGIES.map((e) => (
                        <button
                          key={e.val}
                          type="button"
                          onClick={() => setFormData({ ...formData, energy: e.val })}
                          className={`flex-1 h-9 rounded-lg border text-lg transition-all ${
                            formData.energy === e.val 
                            ? "bg-primary/10 border-primary shadow-[0_0_10px_rgba(197,244,65,0.1)]" 
                            : "bg-background/40 border-border/40 opacity-50 grayscale hover:opacity-100 hover:grayscale-0"
                          }`}
                        >
                          {e.emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <div className="flex gap-1">
                      {DURATIONS.map((d) => (
                        <button
                          key={d.val}
                          type="button"
                          onClick={() => setFormData({ ...formData, duration: d.val })}
                          className={`px-2 py-1 rounded text-[10px] font-mono border transition-all ${
                            formData.duration === d.val 
                            ? "bg-muted border-primary/40 text-primary" 
                            : "border-transparent text-muted-foreground hover:bg-muted/50"
                          }`}
                        >
                          {d.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      type="button"
                      variant="ghost"
                      onClick={() => setIsOpen(false)}
                      className="h-9 text-xs font-mono uppercase"
                    >
                      Annuler
                    </Button>
                    <Button 
                      type="submit"
                      disabled={isSubmitting || !formData.note || !formData.domain}
                      className="btn-primary-glow h-9 rounded-xl px-6 text-xs font-bold"
                    >
                      {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Signer"}
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </CardContent>
      )}
    </Card>
  )
}
