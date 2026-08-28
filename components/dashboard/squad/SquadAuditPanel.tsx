"use client"

import { useState, useMemo } from "react"
import { Sparkles, Loader2, ChevronRight, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import type { SquadData } from "@/components/dashboard/squad-journey"

interface AuditMember {
  id: string
  role: string
  user?: { id: string; name?: string | null; pseudo?: string | null; class?: string | null }
}

interface AuditResult {
  score: number
  strengths: string[]
  warnings: string[]
  advices: string[]
  excessMembers: { memberId: string; userId: string; name: string; pseudo: string; class: string }[]
  memberCount: number
}

function computeAudit(squad: SquadData | null): AuditResult | null {
  if (!squad) return null
  const members = (squad.members ?? []) as AuditMember[]
  if (members.length === 0) return null

  const classes = members.map((m) => m.user?.class?.toLowerCase()).filter((c): c is string => Boolean(c))
  const uniqueClasses = Array.from(new Set(classes)) as string[]
  const hasBuilder = classes.includes("builder")
  const hasCreator = classes.includes("creator")
  const hasStrategist = classes.includes("strategist")
  const hasCatalyst = classes.includes("catalyst")

  let score = members.length === 1 ? 25 : Math.min(100, uniqueClasses.length * 20 + Math.min(5, members.length) * 4)

  const strengths: string[] = []
  const warnings: string[] = []
  const advices: string[] = []

  if (uniqueClasses.length >= 3) strengths.push("Grande diversité de profils : votre squad bénéficie de multiples angles de réflexion.")
  if (hasBuilder && hasCreator) strengths.push("Binôme d'action solide : la synergie Builder-Créateur assure un pont direct du concept au code.")
  if (hasStrategist && hasCatalyst) strengths.push("Moteur de croissance actif : la synergie Stratège-Catalyseur permet de cibler et diffuser efficacement.")

  if (!hasBuilder) { warnings.push("Carence technique : Aucun Builder n'est présent."); advices.push("Recrutez en priorité un Builder pour ancrer vos projets dans la réalité technique.") }
  if (!hasCreator) { warnings.push("Carence d'expérience : Aucun Créateur n'est présent."); advices.push("Invitez un Créateur pour soigner l'ergonomie et l'impact visuel.") }
  if (!hasStrategist) { warnings.push("Carence d'impact : Aucun Stratège n'est présent."); advices.push("Recrutez un Stratège pour focaliser vos efforts sur des leviers mesurables.") }
  if (!hasCatalyst) { warnings.push("Carence de cohésion : Aucun Catalyseur n'est présent."); advices.push("Intégrez un Catalyseur pour faciliter l'entraide et décupler la diffusion.") }

  const classCounts: Record<string, number> = {}
  classes.forEach((c: string) => { classCounts[c] = (classCounts[c] || 0) + 1 })
  const nameMap: Record<string, string> = { builder: "Builders", creator: "Créateurs", strategist: "Stratèges", catalyst: "Catalyseurs" }

  const excessMembers: AuditResult["excessMembers"] = []
  Object.entries(classCounts).forEach(([cls, count]) => {
    if (count > 2) {
      warnings.push(`Hyper-concentration : Trop de ${nameMap[cls] || cls} (${count}).`)
      const matching = members.filter((m) => m.user?.class?.toLowerCase() === cls && m.role !== "owner")
      matching.slice(1).forEach((m) => {
        excessMembers.push({ memberId: m.id, userId: m.user?.id ?? "", name: m.user?.name || "Agent", pseudo: m.user?.pseudo || m.user?.name?.split(" ")[0] || "Agent", class: m.user?.class || "" })
      })
    }
  })

  if (uniqueClasses.length === 4) {
    strengths.push("Harmonie cognitive complète ! Les 4 piliers fondamentaux de HASHCODE sont représentés.")
    advices.push("Structure parfaite. Utilisez les check-ins réguliers pour maintenir le streak.")
  }

  return { score, strengths, warnings, advices, excessMembers, memberCount: members.length }
}

interface SquadAuditPanelProps {
  squad: SquadData | null
  isLeader: boolean
}

export function SquadAuditPanel({ squad, isLeader }: SquadAuditPanelProps) {
  const [isAuditing, setIsAuditing] = useState(false)
  const [auditDone, setAuditDone] = useState(false)
  const [suggestingSendId, setSuggestingSendId] = useState<string | null>(null)
  const [suggestedIds, setSuggestedIds] = useState<Set<string>>(new Set())

  const auditResult = useMemo(() => computeAudit(squad), [squad])

  const suggestMove = async (targetUserId: string) => {
    setSuggestingSendId(targetUserId)
    try {
      const res = await fetch("/api/squad/suggest-move", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      })
      if (!res.ok) throw new Error(await res.text())
      setSuggestedIds(prev => new Set([...prev, targetUserId]))
      toast.success("Suggestion envoyée.")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Erreur lors de l'envoi.")
    } finally {
      setSuggestingSendId(null)
    }
  }

  if (!squad) return null

  return (
    <div className="rounded-3xl border border-white/5 bg-zinc-900/60 p-6 space-y-4 relative overflow-hidden group">
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary animate-pulse" />
          <span className="text-sm-plus font-mono font-bold text-zinc-400 uppercase tracking-wide">Audit de compatibilité</span>
        </div>
        {auditDone && <span className="text-xs font-mono text-primary font-bold">Analyse complétée</span>}
      </div>

      {!auditDone ? (
        <div className="space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed font-light">
            Évalue l&apos;équilibre cognitif et la cohésion de ton équipe pour obtenir des conseils stratégiques d&apos;optimisation.
          </p>
          <Button
            onClick={() => {
              setIsAuditing(true)
              setTimeout(() => { setIsAuditing(false); setAuditDone(true); toast.success("Audit généré !") }, 1200)
            }}
            disabled={isAuditing}
            className="w-full h-10 text-sm-plus font-bold uppercase tracking-wide btn-primary-glow"
          >
            {isAuditing ? (
              <><Loader2 className="size-3.5 mr-2 animate-spin" />Calcul de synchronicité...</>
            ) : (
              <>Lancer l&apos;audit de squad<ChevronRight className="size-3.5 ml-1.5" /></>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div>
              <div className="text-3xl font-extrabold text-white tracking-tight">
                {auditResult?.score}<span className="text-primary text-lg">%</span>
              </div>
              <div className="text-3xs font-mono text-zinc-500 uppercase tracking-wider mt-0.5">Taux de compatibilité</div>
            </div>
            <span className={cn(
              "px-2.5 py-1 rounded-full text-xs font-bold uppercase font-mono tracking-wide",
              (auditResult?.score ?? 0) >= 80 ? "bg-primary/10 text-primary border border-primary/20" :
              (auditResult?.score ?? 0) >= 50 ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
              "bg-red-500/10 text-red-400 border border-red-500/20"
            )}>
              {(auditResult?.score ?? 0) >= 80 ? "Synchro élevée" : (auditResult?.score ?? 0) >= 50 ? "Synchro moyenne" : "Synchro critique"}
            </span>
          </div>

          {auditResult?.strengths && auditResult.strengths.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Points forts</h4>
              <ul className="space-y-1.5">
                {auditResult.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-zinc-300 flex items-start gap-2 leading-relaxed">
                    <span className="text-primary shrink-0 mt-0.5">✓</span><span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {auditResult?.warnings && auditResult.warnings.length > 0 && (
            <div className="space-y-2 border-t border-white/5 pt-4">
              <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Points d&apos;attention</h4>
              <ul className="space-y-1.5">
                {auditResult.warnings.map((warn, idx) => (
                  <li key={idx} className="text-xs text-amber-400 flex items-start gap-2 leading-relaxed">
                    <span className="shrink-0 mt-0.5">⚠️</span><span>{warn}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {auditResult?.advices && auditResult.advices.length > 0 && (
            <div className="space-y-2 border-t border-white/5 pt-4">
              <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Conseils de recrutement</h4>
              <ul className="space-y-1.5">
                {auditResult.advices.map((adv, idx) => (
                  <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed">
                    <span className="text-primary shrink-0 mt-0.5">→</span><span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isLeader && auditResult?.excessMembers && auditResult.excessMembers.length > 0 && (
            <div className="border-t border-white/5 pt-4 space-y-3">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="size-3 text-amber-400 shrink-0" />
                <h4 className="text-xs font-mono font-bold text-zinc-500 uppercase tracking-wider">Rééquilibrage suggéré</h4>
              </div>
              <p className="text-sm-plus text-zinc-500 leading-relaxed">
                Ces membres ont un profil sur-représenté. Tu peux leur suggérer d&apos;explorer d&apos;autres escouades.
              </p>
              <div className="space-y-2">
                {auditResult.excessMembers.map((em) => {
                  const sent = suggestedIds.has(em.userId)
                  return (
                    <div key={em.userId} className="flex items-center justify-between gap-3 p-2.5 rounded-xl border border-amber-500/10 bg-amber-500/3">
                      <div className="min-w-0">
                        <span className="text-sm font-bold text-white">@{em.pseudo}</span>
                        <span className="text-3xs font-mono text-amber-400/70 ml-2 uppercase">{em.class}</span>
                      </div>
                      <button
                        onClick={() => suggestMove(em.userId)}
                        disabled={sent || suggestingSendId === em.userId}
                        className={cn(
                          "shrink-0 text-xs font-mono font-bold px-3 py-1.5 rounded-lg border transition-all",
                          sent ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5 cursor-default" : "border-amber-500/20 text-amber-400 hover:bg-amber-500/10"
                        )}
                      >
                        {suggestingSendId === em.userId ? <Loader2 className="size-3 animate-spin" /> : sent ? "✓ Envoyé" : "Suggérer"}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          <div className="pt-2">
            <button onClick={() => setAuditDone(false)} className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors underline">
              Réanalyser l&apos;équipe
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
