"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight, ArrowLeft, Check, Loader2, Globe, Sparkles,
  Code2, Lightbulb, Zap, Send, Trophy,
} from "lucide-react"

const SKILL_OPTIONS = [
  "Next.js", "React", "TypeScript", "Node.js", "Prisma", "PostgreSQL",
  "UI/UX Design", "Figma", "TailwindCSS", "DevOps", "Docker", "CI/CD",
  "Community", "Marketing", "Product", "Data", "Mobile", "API Design",
]

type FormData = {
  name: string
  email: string
  github: string
  portfolio: string
  skills: string[]
  proofOfWork: string
  motivation: string
  referral: string
}

const initialForm: FormData = {
  name: "",
  email: "",
  github: "",
  portfolio: "",
  skills: [],
  proofOfWork: "",
  motivation: "",
  referral: "",
}

export default function JoinTeamPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormData>(initialForm)
  const [customSkill, setCustomSkill] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [isSent, setIsSent] = useState(false)

  const addSkill = (s: string) => {
    if (!form.skills.includes(s)) setForm({ ...form, skills: [...form.skills, s] })
  }
  const removeSkill = (s: string) => {
    setForm({ ...form, skills: form.skills.filter((x) => x !== s) })
  }
  const addCustomSkill = () => {
    const s = customSkill.trim()
    if (s && !form.skills.includes(s)) {
      setForm({ ...form, skills: [...form.skills, s] })
      setCustomSkill("")
    }
  }

  const steps = [
    { icon: Code2, title: "Identité", desc: "Qui es-tu ?" },
    { icon: Zap, title: "Compétences", desc: "Ta stack technique" },
    { icon: Trophy, title: "Preuves", desc: "Proof of Work" },
    { icon: Lightbulb, title: "Motivation", desc: "Pourquoi nous ?" },
  ]

  const canProceed = () => {
    if (step === 0) return form.name.length >= 2 && form.email.length > 0 && form.email.includes("@")
    if (step === 1) return form.skills.length > 0
    if (step === 2) return form.proofOfWork.length >= 10
    if (step === 3) return form.motivation.length >= 20
    return false
  }

  const handleSubmit = async () => {
    setIsSending(true)
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TEAM",
          email: form.email,
          subject: `Candidature Team — ${form.name} — ${form.skills.slice(0, 3).join(", ")}`,
          content: `--- MOTIVATION ---\n${form.motivation}\n\n--- PROOF OF WORK ---\n${form.proofOfWork}\n\n--- SKILLS ---\n${form.skills.join(", ")}`,
          github: form.github,
          portfolio: form.portfolio,
          skills: form.skills.join(", "),
        }),
      })
      setIsSent(true)
    } catch {
      alert("Erreur réseau. Réessaie.")
    } finally {
      setIsSending(false)
    }
  }

  if (isSent) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Nav />
        <div className="relative pt-32 pb-24 flex items-center justify-center min-h-[80vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6 max-w-lg mx-auto px-4"
          >
            <div className="mx-auto size-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Check className="size-8 text-primary" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tight">Transmission reçue</h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Ton profil a atterri dans notre boîte. On étudie chaque candidature avec attention.
              Si on détecte une synergie, on te contacte sous 48h.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <a href="/">Retour à l&apos;accueil</a>
            </Button>
          </motion.div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-primary selection:text-black">
      <Nav />

      <div className="relative pt-24 sm:pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] opacity-30" />

        <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Sparkles className="size-3.5 text-primary" />
              <span className="text-[9px] font-mono font-black uppercase text-primary">Recrutement</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight uppercase italic">
              Rejoins la <span className="text-primary">Team</span>
            </h1>
            <p className="text-zinc-500 text-sm font-light max-w-xl mx-auto">
              On ne recrute pas des CV, on recrute des bâtisseurs. Montre-nous ce que tu sais faire.
            </p>
          </div>

          {/* Progress stepper */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-10">
            {steps.map((s, i) => {
              const Icon = s.icon
              const isActive = i === step
              const isDone = i < step
              return (
                <button
                  key={s.title}
                  onClick={() => { if (i < step) setStep(i) }}
                  disabled={i > step}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer
                    ${isActive ? "bg-primary/10 border border-primary/30 text-primary" : ""}
                    ${isDone ? "text-emerald-400" : ""}
                    ${i > step ? "text-zinc-700 cursor-not-allowed" : "text-zinc-500 hover:text-zinc-300"}
                  `}
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline text-[10px] font-mono font-bold uppercase">{s.title}</span>
                </button>
              )
            })}
          </div>

          {/* Form card */}
          <div className="rounded-[2rem] border border-white/10 bg-zinc-900/40 backdrop-blur-xl p-8 sm:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Step 0: Identity */}
                {step === 0 && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Qui es-tu ?</h3>
                      <p className="text-xs text-zinc-500">On a besoin de te connaître pour commencer.</p>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Nom / Pseudo</label>
                        <Input
                          placeholder="Ton nom ou pseudo"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="bg-black/40 border-white/10 h-12 rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Email</label>
                        <Input
                          placeholder="ton@email.com"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="bg-black/40 border-white/10 h-12 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">GitHub</label>
                        <Input
                          placeholder="github.com/tonpseudo"
                          value={form.github}
                          onChange={(e) => setForm({ ...form, github: e.target.value })}
                          className="bg-black/40 border-white/10 h-12 rounded-xl text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono uppercase text-zinc-500">Portfolio / LinkedIn</label>
                        <Input
                          placeholder="linkedin.com/in/tonprofil"
                          value={form.portfolio}
                          onChange={(e) => setForm({ ...form, portfolio: e.target.value })}
                          className="bg-black/40 border-white/10 h-12 rounded-xl text-sm"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 1: Skills */}
                {step === 1 && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Ta stack technique</h3>
                      <p className="text-xs text-zinc-500">Sélectionne ce qui te correspond, ajoute du sur-mesure.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {SKILL_OPTIONS.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => form.skills.includes(s) ? removeSkill(s) : addSkill(s)}
                          className={`px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border transition-all
                            ${form.skills.includes(s)
                              ? "bg-primary/15 border-primary/40 text-primary"
                              : "bg-zinc-900/60 border-white/10 text-zinc-400 hover:border-white/30"
                            }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Autre compétence..."
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomSkill() } }}
                        className="bg-black/40 border-white/10 h-10 rounded-xl text-sm flex-1"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addCustomSkill} className="rounded-xl h-10">
                        Ajouter
                      </Button>
                    </div>
                    {form.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {form.skills.filter(s => !SKILL_OPTIONS.includes(s)).map((s) => (
                          <Badge key={s} variant="outline" className="text-[9px] font-mono border-indigo-500/30 text-indigo-400">
                            {s}
                            <button type="button" onClick={() => removeSkill(s)} className="ml-1.5 hover:text-white">&times;</button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Proof of Work */}
                {step === 2 && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Proof of Work</h3>
                      <p className="text-xs text-zinc-500">Montre-nous ce que tu as déjà construit. Pas de CV, du concret.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Liens vers tes réalisations</label>
                      <Textarea
                        placeholder={
                          "https://github.com/tonpseudo/projet-x\n" +
                          "https://ton-projet.vercel.app\n" +
                          "https://figma.com/file/ta-maquette\n" +
                          "Décris ce que tu as fait et ton rôle précis sur chaque projet."
                        }
                        rows={6}
                        required
                        value={form.proofOfWork}
                        onChange={(e) => setForm({ ...form, proofOfWork: e.target.value })}
                        className="bg-black/40 border-white/10 rounded-xl text-sm resize-none font-mono text-[12px]"
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Motivation */}
                {step === 3 && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white">Pourquoi nous ?</h3>
                      <p className="text-xs text-zinc-500">On veut entendre ta voix, pas une lettre de motivation générique.</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">Ta motivation</label>
                      <Textarea
                        placeholder={
                          "Ce qui te passionne dans la tech africaine\n" +
                          "Pourquoi tu veux construire HASHCODE avec nous\n" +
                          "Ce que tu apporterais à l'équipe"
                        }
                        rows={8}
                        required
                        value={form.motivation}
                        onChange={(e) => setForm({ ...form, motivation: e.target.value })}
                        className="bg-black/40 border-white/10 rounded-xl text-sm resize-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono uppercase text-zinc-500">
                        Comment nous as-tu connus ? <span className="text-zinc-700">(optionnel)</span>
                      </label>
                      <Input
                        placeholder="Twitter, bouche-à-oreille, GitHub, etc."
                        value={form.referral}
                        onChange={(e) => setForm({ ...form, referral: e.target.value })}
                        className="bg-black/40 border-white/10 h-12 rounded-xl text-sm"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-10 pt-8 border-t border-white/5">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setStep(Math.max(0, step - 1))}
                disabled={step === 0}
                className="text-zinc-400 hover:text-white rounded-xl"
              >
                <ArrowLeft className="size-4 mr-2" />
                Retour
              </Button>

              <div className="text-[10px] font-mono text-zinc-600">
                {step + 1} / {steps.length}
              </div>

              {step < steps.length - 1 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="rounded-xl bg-primary text-black hover:bg-primary/90 font-bold"
                >
                  Suivant
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSending}
                  className="rounded-xl bg-primary text-black hover:bg-primary/90 font-bold"
                >
                  {isSending ? (
                    <><Loader2 className="size-4 mr-2 animate-spin" /> Envoi...</>
                  ) : (
                    <><Send className="size-4 mr-2" /> Envoyer ma candidature</>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Trust footer */}
          <div className="mt-8 text-center">
            <p className="text-[10px] font-mono text-zinc-700">
              <Globe className="size-3 inline mr-1 text-zinc-600" />
              Toutes les candidatures sont lues par un humain. Pas d&apos;IA, pas de ATS.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
