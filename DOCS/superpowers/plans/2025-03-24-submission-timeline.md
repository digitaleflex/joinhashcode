# Submission Timeline (P4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a visual timeline for mission submissions to provide transparency on status, reviewer, and revisions.

**Architecture:**
- Update Prisma query in the Mission Page to include reviewer details.
- Create a client-side `SubmissionTimeline` component using Lucide icons and Tailwind.
- Integrate the timeline into the mission page sidebar.

**Tech Stack:** Next.js (Server Components), Prisma, Tailwind CSS, Lucide React.

---

### Task 1: Update Prisma Query

**Files:**
- Modify: `app/missions/[id]/page.tsx`

- [ ] **Step 1: Update the user fetch to include the reviewer relation**

Modify the `prisma.user.findUnique` call to include `reviewer` details in `missionSubmissions`.

```ts
// app/missions/[id]/page.tsx
const [dbUser, mission] = await Promise.all([
  prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      missionSubmissions: {
        where: { missionId: id },
        include: {
          reviewer: {
            select: {
              id: true,
              pseudo: true,
              image: true,
            }
          }
        },
        orderBy: { createdAt: "desc" },
      },
    },
  }),
  prisma.mission.findUnique({ where: { id } }),
])
```

- [ ] **Step 2: Commit changes**

```bash
git add app/missions/[id]/page.tsx
git commit -m "feat: include reviewer in mission submission query"
```

---

### Task 2: Create `SubmissionTimeline` Component

**Files:**
- Create: `components/missions/submission-timeline.tsx`

- [ ] **Step 1: Create the component file with the provided design**

```tsx
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

      {submission.revisionCount > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-950/20 border border-amber-500/20">
          <RefreshCw className="size-3 text-amber-500 shrink-0" />
          <span className="text-[9px] font-mono text-amber-400">
            {submission.revisionCount} révision{submission.revisionCount > 1 ? "s" : ""} effectuée{submission.revisionCount > 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className="relative pl-4">
        <div className="absolute left-[11px] top-3 bottom-3 w-px bg-white/5" />

        <div className="space-y-5">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-4 relative">
              <div className={cn(
                "size-4 rounded-full border-2 shrink-0 flex items-center justify-center relative z-10 transition-all duration-500",
                step.done ? `${step.color} border-transparent` : "bg-zinc-900 border-white/10",
                step.active && "animate-pulse"
              )}>
                {step.done && <step.icon className="size-2.5 text-black" />}
              </div>

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

- [ ] **Step 2: Commit component**

```bash
git add components/missions/submission-timeline.tsx
git commit -m "feat: add SubmissionTimeline component"
```

---

### Task 3: Integrate Timeline into Mission Page

**Files:**
- Modify: `app/missions/[id]/page.tsx`

- [ ] **Step 1: Import and add the `SubmissionTimeline` to the sidebar**

Update `app/missions/[id]/page.tsx` to display the timeline when a submission exists and is not approved.

```tsx
// app/missions/[id]/page.tsx
import { SubmissionTimeline } from "@/components/missions/submission-timeline"

// ... inside the right sidebar column, after the status card container
{submission && submission.status !== "APPROVED" && (
  <div className="mt-6 p-5 bg-zinc-950/40 border border-white/5 rounded-[1.5rem]">
    <SubmissionTimeline submission={submission as any} />
  </div>
)}
```

- [ ] **Step 2: Commit final integration**

```bash
git add app/missions/[id]/page.tsx
git commit -m "feat: integrate submission timeline into mission detail page"
```
