"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export interface ReviewCriterion {
  id: string
  label: string
  weight: "REQUIRED" | "BONUS"
}

/** Longueur minimale du retour écrit, identique à la validation de la route `review`. */
const MIN_FEEDBACK_LENGTH = 20

export function ReviewForm({ submissionId, criteria }: { submissionId: string; criteria: ReviewCriterion[] }) {
  const router = useRouter()
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)

  const missingRequired = criteria.filter((c) => c.weight === "REQUIRED" && !checked[c.id])
  const approves = missingRequired.length === 0
  const feedbackOk = feedback.trim().length >= MIN_FEEDBACK_LENGTH

  const submit = async () => {
    setLoading(true)
    try {
      // La route attend une valeur booléenne pour chaque critère.
      const payload = Object.fromEntries(criteria.map((c) => [c.id, !!checked[c.id]]))
      const res = await fetch(`/api/missions/${submissionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria: payload, feedback: feedback.trim() }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        toast.error(data.message ?? "Impossible d'enregistrer ta relecture.")
        return
      }
      toast.success(approves ? "Soumission validée. Merci pour ta relecture." : "Révision demandée au membre.")
      router.push("/reviewer")
      router.refresh()
    } catch {
      toast.error("Erreur réseau. Réessaie dans un instant.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault()
        if (feedbackOk && !loading) void submit()
      }}
    >
      <fieldset className="space-y-3">
        <legend className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
          Critères d&apos;acceptation
        </legend>
        {criteria.map((c) => (
          <label key={c.id} className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-primary"
              checked={!!checked[c.id]}
              onChange={(e) => setChecked((prev) => ({ ...prev, [c.id]: e.target.checked }))}
            />
            <span className="flex-1 text-zinc-200">
              {c.label}
              <span className="ml-2 text-xs font-mono text-zinc-500">
                {c.weight === "REQUIRED" ? "obligatoire" : "bonus"}
              </span>
            </span>
          </label>
        ))}
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="review-feedback" className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
          Ton retour au membre
        </label>
        <Textarea
          id="review-feedback"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={5}
          placeholder="Ce qui est réussi, ce qui manque, comment progresser (au moins 20 caractères)."
        />
        {!feedbackOk && (
          <p className="text-xs text-zinc-500">
            Encore {MIN_FEEDBACK_LENGTH - feedback.trim().length} caractère(s) pour pouvoir envoyer.
          </p>
        )}
      </div>

      {!approves && (
        <p className="rounded-xl border border-amber-400/25 bg-amber-400/[0.06] p-3 text-xs text-amber-200">
          {missingRequired.length} critère(s) obligatoire(s) non coché(s) : le membre devra réviser son travail.
        </p>
      )}

      <Button type="submit" disabled={!feedbackOk || loading} className="btn-primary-glow h-11 rounded-xl px-5">
        {loading ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : approves ? (
          "Valider la soumission"
        ) : (
          "Demander une révision"
        )}
      </Button>
    </form>
  )
}
