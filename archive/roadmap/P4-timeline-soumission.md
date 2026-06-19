# P4 — Timeline de suivi d'une soumission

**Priorité :** 🟡 Important  
**Effort estimé :** ~3h  
**Pourquoi c'est important :** Après soumission, l'utilisateur n'a aucune visibilité. Il ne sait pas si sa soumission a été vue, qui la review, ni depuis quand. Ajouter une timeline donne de la transparence et réduit l'anxiété d'attente.

---

## Contexte

- Page concernée : `app/missions/[id]/page.tsx`
- Composant formulaire : `app/missions/[id]/mission-submission-form.tsx`
- Données disponibles dans `MissionSubmission` :
  - `createdAt` — date de soumission
  - `updatedAt` — dernière mise à jour
  - `status` — PENDING / IN_REVIEW / NEEDS_REVISION / APPROVED
  - `reviewerId` — ID du reviewer (si claimé)
  - `revisionCount` — nombre de révisions passées
  - `reviewerFeedback` — feedback du reviewer
  - `adminFeedback` — feedback admin
- Il faudra joindre le `reviewer` (relation `User`) pour afficher son pseudo

---

## Ce qu'il faut faire

### Étape 1 — Modifier la query sur la page détail

Dans `app/missions/[id]/page.tsx`, quand on récupère la soumission existante de l'utilisateur, inclure le reviewer :

```ts
const submission = await db.missionSubmission.findFirst({
  where: { missionId: mission.id, userId: session.user.id },
  include: {
    reviewer: {          // relation User via reviewerId
      select: {
        id: true,
        pseudo: true,
        image: true,
      }
    }
  },
  orderBy: { createdAt: "desc" },
})
```

Passer `submission` (avec `reviewer`) au composant client.

### Étape 2 — Créer le composant `SubmissionTimeline`

Créer : `components/missions/submission-timeline.tsx`

```tsx
// components/missions/submission-timeline.tsx
"use client"

import { cn } from "@/lib/utils"
import { Check, Clock, AlertTriangle, Eye, RefreshCw } from "lucide-react"

interface TimelineProps {
  submission: {
    createdAt: Date | string
    updatedAt: Date | string
    status: "PENDING" | "IN_REVIEW" | "NEEDS_REVISION" | "APPROVED"
    revisionCount: number
    reviewerFeedback?: string | null
    adminFeedback?: string | null
    reviewer?: {
      pseudo?: string | null
      image?: string | null
    } | null
  }
}

const STATUS_STEPS = {
  PENDING: 1,
  IN_REVIEW: 2,
  NEEDS_REVISION: 2,
  APPROVED: 3,
}

export function SubmissionTimeline({ submission }: TimelineProps) {
  const steps = [
    {
      label: "Soumis",
      sublabel: new Date(submission.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }),
      icon: Check,
      done: true,
      color: "bg-emerald-500",
      borderColor: "border-emerald-500/40",
    },
    {
      label: submission.status === "NEEDS_REVISION" ? "Révision demandée" : "En cours de review",
      sublabel: submission.status === "IN_REVIEW"
        ? submission.reviewer?.pseudo
          ? `Pris en charge par @${submission.reviewer.pseudo}`
          : "Un reviewer va bientôt prendre en charge"
        : submission.status === "NEEDS_REVISION"
        ? submission.adminFeedback || submission.reviewerFeedback || "Voir les notes de révision"
        : "En attente d'un reviewer",
      icon: submission.status === "NEEDS_REVISION" ? AlertTriangle : Eye,
      done: ["IN_REVIEW", "NEEDS_REVISION", "APPROVED"].includes(submission.status),
      active: submission.status === "PENDING",
      color: submission.status === "NEEDS_REVISION" ? "bg-amber-500" : "bg-cyan-500",
      borderColor: submission.status === "NEEDS_REVISION" ? "border-amber-500/40" : "border-cyan-500/40",
    },
    {
      label: "Approuvé",
      sublabel: submission.status === "APPROVED"
        ? new Date(submission.updatedAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })
        : "En attente de validation",
      icon: Check,
      done: submission.status === "APPROVED",
      color: "bg-emerald-500",
      borderColor: "border-emerald-500/40",
    },
  ]

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-widest">
        Suivi de la soumission
      </p>

      {/* Révisions passées */}
      {submission.revisionCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-950/20 border border-amber-500/20">
          <RefreshCw className="size-3 text-amber-500 shrink-0" />
          <span className="text-[9px] font-mono text-amber-400">
            {submission.revisionCount} révision{submission.revisionCount > 1 ? "s" : ""} effectuée{submission.revisionCount > 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="relative pl-4">
        {/* Ligne verticale */}
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-white/5" />

        <div className="space-y-5">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              {/* Dot */}
              <div className={cn(
                "size-4 rounded-full border-2 shrink-0 flex items-center justify-center relative z-10 transition-all duration-500",
                step.done ? `${step.color} border-transparent` : "bg-zinc-900 border-white/10",
                step.active && "animate-pulse"
              )}>
                {step.done && <step.icon className="size-2.5 text-black" />}
              </div>

              {/* Texte */}
              <div className="space-y-0.5 pb-1">
                <p className={cn(
                  "text-xs font-semibold",
                  step.done ? "text-white" : "text-zinc-500"
                )}>
                  {step.label}
                </p>
                <p className="text-[9px] text-zinc-600 font-mono leading-relaxed max-w-[200px]">
                  {step.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

### Étape 3 — Intégrer dans `app/missions/[id]/page.tsx`

Dans la colonne droite (sticky sidebar), après le `MissionSubmissionForm` ou à la place du message "En cours de revue", ajouter :

```tsx
import { SubmissionTimeline } from "@/components/missions/submission-timeline"

// Dans le JSX, quand submission existe et n'est pas APPROVED :
{submission && submission.status !== "APPROVED" && (
  <div className="mt-6 p-5 bg-zinc-950/40 border border-white/5 rounded-[1.5rem]">
    <SubmissionTimeline submission={submission} />
  </div>
)}
```

---

## Résultat attendu

L'utilisateur voit dans la sidebar droite :
```
Suivi de la soumission
✓ Soumis — 20 mai, 14:32
👁 En cours de review — Pris en charge par @reviewer_pseudo
○ Approuvé — En attente de validation
```

---

## Fichiers touchés
- `app/missions/[id]/page.tsx` — modifier la query + ajouter le composant
- `components/missions/submission-timeline.tsx` — créer
