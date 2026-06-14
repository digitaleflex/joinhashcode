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
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { cn } from "@/lib/utils"

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

export function DailyCheckinWidget({ 
  isModal = false, 
  onClose 
}: { 
  isModal?: boolean; 
  onClose?: () => void 
}) {
  const queryClient = useQueryClient()
  const [isOpen, setIsOpen] = useState(isModal)
  const [surgeActive, setSurgeActive] = useState(false)
  const [formData, setFormData] = useState({
    note: "",
    domain: "",
    energy: 3,
    duration: 30,
  })

  const checkin = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/user/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    onSuccess: (data) => {
      // La cloche de notifications se rafraîchit automatiquement
      queryClient.invalidateQueries({ queryKey: ["notifications"] })

      if (data.isCriticalHit) {
        setSurgeActive(true)
        toast.success(data.finalMessage, { duration: 5000 })
      } else {
        toast.success(`Check-in enregistré · +${data.totalXP} XP`)
      }

      setTimeout(() => {
        if (!isModal) {
          setIsOpen(false)
          setSurgeActive(false)
          setFormData({ note: "", domain: "", energy: 3, duration: 30 })
          checkin.reset()
        } else {
          onClose?.()
        }
      }, 3500)
    },
    onError: (err: Error) => {
      toast.error(err.message || "Erreur lors de l'enregistrement")
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.note || !formData.domain) return
    if (formData.note.length < 20) {
      toast.error("Ta note est trop courte. Détaille un peu plus tes progrès (min 20 car.).")
      return
    }
    checkin.mutate(formData)
  }

  const FormContent = (
    <div className={cn("space-y-5", isModal && "p-6")}>
      {isModal && (
        <div className="space-y-1 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="size-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Synchronisation Globale</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">Neural Check-in</h2>
          <p className="text-zinc-400 text-xs font-light">Ancre tes progrès et maintiens ta synchronisation.</p>
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {checkin.isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className={cn(
              "h-20 w-20 rounded-full flex items-center justify-center transition-all duration-700",
              surgeActive ? "bg-primary/20 border-2 border-primary animate-bounce shadow-[0_0_30px_rgba(var(--primary),0.3)]" : "bg-primary/10 border border-primary/20"
            )}>
              {surgeActive ? <Zap className="h-10 w-10 text-primary fill-primary" /> : <Check className="h-10 w-10 text-primary" />}
            </div>
            <div className="space-y-2 max-w-xs">
              <p className={cn("text-lg font-black uppercase tracking-tighter italic", surgeActive ? "text-primary" : "text-white")}>
                {surgeActive ? "BOOST DÉTECTÉ !" : "Trace enregistrée"}
              </p>
              <p className="text-[10px] font-mono text-zinc-400 uppercase leading-relaxed">
                {checkin.data?.finalMessage || "Signal stabilisé."}
              </p>
              <div className="pt-2">
                <Badge variant="outline" className="font-mono text-primary border-primary/20">+{checkin.data?.totalXP || 10} XP</Badge>
              </div>
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
              <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Qu&apos;as-tu avancé aujourd&apos;hui ?</label>
              <Textarea
                placeholder="Ex: J'ai fini le refactoring du schéma Prisma, j'ai envoyé 3 emails à des clients..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="bg-white/5 border-white/10 rounded-xl min-h-[80px] text-sm focus:border-primary/50 transition-colors"
                maxLength={150}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Domaine</label>
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
                <label className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Énergie</label>
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
                  onClick={() => isModal ? onClose?.() : setIsOpen(false)}
                  className="h-9 text-xs font-mono uppercase"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={checkin.isPending || !formData.note || !formData.domain}
                  className="btn-primary-glow h-9 rounded-xl px-6 text-xs font-bold"
                >
                  {checkin.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
                </Button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )

  if (isModal) return FormContent

  return (
    <Card variant="premium" className="relative overflow-hidden group">
      {!isOpen ? (
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-8 px-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="size-2 rounded-full bg-primary animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase">Ma Synchro</span>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              Check-in Quotidien
            </CardTitle>
            <CardDescription className="text-zinc-400 text-sm font-light">
              30 secondes pour ancrer tes progrès et maintenir ta synchronisation.
            </CardDescription>
          </div>
          <Button
            onClick={() => setIsOpen(true)}
            className="btn-primary-glow h-12 rounded-2xl px-6 text-[11px] uppercase font-bold tracking-wide shrink-0 w-full sm:w-auto"
          >
            DÉMARRER LE CHECK-IN
          </Button>
        </CardHeader>
      ) : (
        <CardContent className="pt-6">
          {FormContent}
        </CardContent>
      )}
    </Card>
  )
}
