# Mission System V2 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ajouter rubriques de validation structurées, états de révision, peer review, et XP qualité au système de missions HASHCODE.

**Architecture:** La logique métier pure (critères, calcul XP, éligibilité reviewer) est isolée dans `lib/acceptance-criteria.ts` et testée unitairement. Les API routes consomment cette lib. L'UI admin et reviewer consomme les API. Les changements schema Prisma sont le fondement de tout.

**Tech Stack:** Next.js 15 App Router, Prisma 7, Vitest, TypeScript, TailwindCSS, shadcn/ui

---

## File Map

| Action | Fichier | Responsabilité |
|--------|---------|----------------|
| Modify | `prisma/schema.prisma` | Nouveaux champs Mission, MissionSubmission, User + modèle MissionReview |
| Create | `lib/acceptance-criteria.ts` | Critères par catégorie, calcul qualité XP, éligibilité reviewer |
| Create | `__tests__/acceptance-criteria.test.ts` | Tests unitaires logique pure |
| Modify | `app/api/missions/route.ts` | Autoriser re-soumission sur NEEDS_REVISION, bloquer IN_REVIEW |
| Modify | `app/api/admin/submissions/[id]/route.ts` | Support NEEDS_REVISION + qualityLevel pour APPROVE |
| Create | `app/api/missions/[id]/claim/route.ts` | Reviewer claim une soumission |
| Create | `app/api/missions/[id]/review/route.ts` | Reviewer soumet sa revue |
| Create | `app/api/reviewer/route.ts` | Queue des soumissions à reviewer |
| Modify | `app/missions/[id]/page.tsx` | Afficher état NEEDS_REVISION + IN_REVIEW |
| Modify | `app/missions/[id]/mission-submission-form.tsx` | Afficher revisionNotes quand NEEDS_REVISION |
| Create | `components/missions/reviewer-rubric-form.tsx` | Formulaire rubrique reviewer |
| Create | `app/reviewer/page.tsx` | Dashboard reviewer (liste soumissions à revoir) |
| Modify | `app/admin/submissions/page.tsx` | Rubrique + qualityLevel dans l'interface admin |
| Create | `scripts/seed-mission-criteria.ts` | Peupler les missions DB avec acceptanceCriteria |

---

## Task 1 — Prisma schema

**Files:**
- Modify: `prisma/schema.prisma`

- [ ] **Step 1 : Ajouter les champs sur Mission**

Dans `prisma/schema.prisma`, après la ligne `submissionMethod String @default("ANY_LINK")`, ajouter :

```prisma
acceptanceCriteria  Json     @default("[]")
evaluatorNotes      String?
qualityIndicators   Json     @default("[]")
```

- [ ] **Step 2 : Ajouter les champs sur MissionSubmission**

Après la ligne `reviewerId String?`, ajouter :

```prisma
qualityLevel   String?
revisionCount  Int      @default(0)
revisionNotes  String?
reviewerType   String?
```

Et ajouter la relation reviews après `mission Mission @relation(...)` :

```prisma
reviews        MissionReview[]
```

- [ ] **Step 3 : Ajouter les champs sur User**

Après `reviewerId String?` dans User, ajouter :

```prisma
canReviewProfiles  String[]       @default([])
reviewsCompleted   Int            @default(0)
reviewsGiven       MissionReview[] @relation("ReviewsGiven")
```

- [ ] **Step 4 : Ajouter le modèle MissionReview**

Après le modèle MissionSubmission, ajouter :

```prisma
model MissionReview {
  id            String            @id @default(cuid())
  submissionId  String
  reviewerId    String
  criteria      Json
  qualityLevel  String
  feedback      String
  revisionNotes String?
  createdAt     DateTime          @default(now())
  submission    MissionSubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)
  reviewer      User              @relation("ReviewsGiven", fields: [reviewerId], references: [id])

  @@index([submissionId])
  @@index([reviewerId])
  @@map("mission_review")
}
```

- [ ] **Step 5 : Appliquer le schema**

```bash
npx prisma generate
npx prisma db push
```

Expected : `Your database is now in sync with your Prisma schema.`

- [ ] **Step 6 : Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat(schema): add MissionReview model + quality/revision fields"
```

---

## Task 2 — lib/acceptance-criteria.ts + tests unitaires

**Files:**
- Create: `lib/acceptance-criteria.ts`
- Create: `__tests__/acceptance-criteria.test.ts`

- [ ] **Step 1 : Écrire les tests en premier**

Créer `__tests__/acceptance-criteria.test.ts` :

```typescript
import { describe, it, expect } from "vitest"
import {
  getCriteriaForMission,
  computeQualityLevel,
  computeXp,
  isEligibleReviewer,
  getMissingRequiredCriteria,
} from "@/lib/acceptance-criteria"

describe("getCriteriaForMission", () => {
  it("returns CODE criteria for CODE category", () => {
    const criteria = getCriteriaForMission("CODE")
    expect(criteria.some(c => c.id === "code-readme")).toBe(true)
  })

  it("falls back to GENERAL for unknown category", () => {
    const criteria = getCriteriaForMission("UNKNOWN")
    expect(criteria.some(c => c.id === "general-proof")).toBe(true)
  })
})

describe("computeQualityLevel", () => {
  it("returns STANDARD when only required criteria are checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.filter(c => c.weight === "REQUIRED").forEach(c => { checked[c.id] = true })
    criteria.filter(c => c.weight === "BONUS").forEach(c => { checked[c.id] = false })
    expect(computeQualityLevel(criteria, checked)).toBe("STANDARD")
  })

  it("returns GOOD when required + 2 bonus criteria are checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.filter(c => c.weight === "REQUIRED").forEach(c => { checked[c.id] = true })
    const bonus = criteria.filter(c => c.weight === "BONUS")
    bonus.forEach((c, i) => { checked[c.id] = i < 2 })
    expect(computeQualityLevel(criteria, checked)).toBe("GOOD")
  })

  it("returns EXEMPLARY when all criteria are checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.forEach(c => { checked[c.id] = true })
    expect(computeQualityLevel(criteria, checked)).toBe("EXEMPLARY")
  })
})

describe("computeXp", () => {
  it("returns 100% XP for STANDARD", () => {
    expect(computeXp(200, "STANDARD")).toBe(200)
  })

  it("returns 125% XP for GOOD", () => {
    expect(computeXp(200, "GOOD")).toBe(250)
  })

  it("returns 150% XP for EXEMPLARY", () => {
    expect(computeXp(200, "EXEMPLARY")).toBe(300)
  })
})

describe("isEligibleReviewer", () => {
  const base = {
    reviewerClass: "builder",
    reviewerLevel: 2,
    reviewerMissionsCompleted: 3,
    reviewerId: "rev1",
    submissionUserId: "user1",
    missionTargetProfiles: ["builder"],
    missionRequiredLevel: 1,
  }

  it("returns true for eligible reviewer", () => {
    expect(isEligibleReviewer(base)).toBe(true)
  })

  it("returns false if reviewer is the submitter", () => {
    expect(isEligibleReviewer({ ...base, reviewerId: "user1" })).toBe(false)
  })

  it("returns false if wrong profile", () => {
    expect(isEligibleReviewer({ ...base, reviewerClass: "creator" })).toBe(false)
  })

  it("returns false if level not high enough", () => {
    expect(isEligibleReviewer({ ...base, reviewerLevel: 1 })).toBe(false)
  })

  it("returns false if fewer than 3 missions completed", () => {
    expect(isEligibleReviewer({ ...base, reviewerMissionsCompleted: 2 })).toBe(false)
  })
})

describe("getMissingRequiredCriteria", () => {
  it("returns labels of unchecked required criteria", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.forEach(c => { checked[c.id] = true })
    checked["code-readme"] = false
    const missing = getMissingRequiredCriteria(criteria, checked)
    expect(missing).toContain("README présent avec description du projet")
    expect(missing).toHaveLength(1)
  })

  it("returns empty array when all required criteria are checked", () => {
    const criteria = getCriteriaForMission("CODE")
    const checked: Record<string, boolean> = {}
    criteria.forEach(c => { checked[c.id] = true })
    expect(getMissingRequiredCriteria(criteria, checked)).toHaveLength(0)
  })
})
```

- [ ] **Step 2 : Vérifier que les tests échouent**

```bash
npx vitest run __tests__/acceptance-criteria.test.ts
```

Expected : FAIL — `Cannot find module '@/lib/acceptance-criteria'`

- [ ] **Step 3 : Créer lib/acceptance-criteria.ts**

```typescript
export type CriterionWeight = "REQUIRED" | "BONUS"

export interface Criterion {
  id: string
  label: string
  weight: CriterionWeight
}

export type QualityLevel = "STANDARD" | "GOOD" | "EXEMPLARY"

export const XP_MULTIPLIERS: Record<QualityLevel, number> = {
  STANDARD: 1.0,
  GOOD: 1.25,
  EXEMPLARY: 1.5,
}

export const MISSION_CRITERIA: Record<string, Criterion[]> = {
  CODE: [
    { id: "code-accessible", label: "Lien accessible (repo public ou admin invité)", weight: "REQUIRED" },
    { id: "code-readme", label: "README présent avec description du projet", weight: "REQUIRED" },
    { id: "code-functional", label: "Code fonctionnel (pas un scaffold vide)", weight: "REQUIRED" },
    { id: "code-commits", label: "Minimum 3 commits réels (historique visible)", weight: "REQUIRED" },
    { id: "code-objective", label: "Objectif de la mission clairement atteint", weight: "REQUIRED" },
    { id: "code-tests", label: "Tests présents (unitaires ou intégration)", weight: "BONUS" },
    { id: "code-deployed", label: "Déployé en production avec URL live", weight: "BONUS" },
    { id: "code-architecture", label: "Architecture lisible et documentée", weight: "BONUS" },
  ],
  DESIGN: [
    { id: "design-accessible", label: "Fichiers accessibles (Figma / PDF / lien live)", weight: "REQUIRED" },
    { id: "design-elements", label: "Tous les éléments demandés présents", weight: "REQUIRED" },
    { id: "design-coherence", label: "Cohérence visuelle démontrée", weight: "REQUIRED" },
    { id: "design-brief", label: "Brief des choix de design expliqué", weight: "REQUIRED" },
    { id: "design-variants", label: "Variantes / explorations multiples", weight: "BONUS" },
    { id: "design-guide", label: "Guide de style complet (usage, do/don't)", weight: "BONUS" },
    { id: "design-moodboard", label: "Moodboard ou sources d'inspiration documentées", weight: "BONUS" },
  ],
  BUSINESS: [
    { id: "business-structure", label: "Structure imposée respectée (sections présentes)", weight: "REQUIRED" },
    { id: "business-research", label: "Recherche évidente, non générique", weight: "REQUIRED" },
    { id: "business-conclusions", label: "Conclusions actionnables (pas juste descriptives)", weight: "REQUIRED" },
    { id: "business-clarity", label: "Clarté et qualité de l'écriture", weight: "REQUIRED" },
    { id: "business-data", label: "Données chiffrées citées avec sources", weight: "BONUS" },
    { id: "business-competition", label: "Analyse concurrentielle incluse", weight: "BONUS" },
    { id: "business-validation", label: "Validation terrain ou entretiens mentionnés", weight: "BONUS" },
  ],
  NETWORK: [
    { id: "network-proof", label: "Preuve fournie (screenshot, témoignage, recap)", weight: "REQUIRED" },
    { id: "network-context", label: "Contexte de la connexion / événement expliqué", weight: "REQUIRED" },
    { id: "network-impact", label: "Impact ou résultat concret décrit", weight: "REQUIRED" },
    { id: "network-testimony", label: "Témoignage des parties impliquées", weight: "BONUS" },
    { id: "network-photos", label: "Photos ou captures multiples", weight: "BONUS" },
    { id: "network-followup", label: "Suivi post-connexion / post-événement mentionné", weight: "BONUS" },
  ],
  GENERAL: [
    { id: "general-proof", label: "Preuve de réalisation fournie", weight: "REQUIRED" },
    { id: "general-objective", label: "Objectif de la mission atteint", weight: "REQUIRED" },
    { id: "general-description", label: "Description claire du travail effectué", weight: "REQUIRED" },
    { id: "general-impact", label: "Impact ou résultat concret décrit", weight: "BONUS" },
  ],
  INTRO: [
    { id: "intro-project", label: "Description du projet en une phrase claire", weight: "REQUIRED" },
    { id: "intro-objective", label: "Objectif 3 mois précis et actionnable", weight: "REQUIRED" },
    { id: "intro-authentic", label: "Ton personnel et authentique (pas générique)", weight: "BONUS" },
  ],
}

export function getCriteriaForMission(category: string): Criterion[] {
  return MISSION_CRITERIA[category.toUpperCase()] ?? MISSION_CRITERIA.GENERAL
}

export function computeQualityLevel(
  criteria: Criterion[],
  checked: Record<string, boolean>
): QualityLevel {
  const bonus = criteria.filter(c => c.weight === "BONUS")
  const bonusPassed = bonus.filter(c => checked[c.id]).length

  if (bonusPassed >= bonus.length && bonus.length > 0) return "EXEMPLARY"
  if (bonusPassed >= 2) return "GOOD"
  return "STANDARD"
}

export function computeXp(baseXp: number, qualityLevel: QualityLevel): number {
  return Math.round(baseXp * XP_MULTIPLIERS[qualityLevel])
}

export function isEligibleReviewer(params: {
  reviewerClass: string | null
  reviewerLevel: number
  reviewerMissionsCompleted: number
  reviewerId: string
  submissionUserId: string
  missionTargetProfiles: string[]
  missionRequiredLevel: number
}): boolean {
  const {
    reviewerClass, reviewerLevel, reviewerMissionsCompleted,
    reviewerId, submissionUserId, missionTargetProfiles, missionRequiredLevel,
  } = params
  if (reviewerId === submissionUserId) return false
  if (!reviewerClass) return false
  if (!missionTargetProfiles.includes(reviewerClass.toLowerCase())) return false
  if (reviewerLevel < missionRequiredLevel + 1) return false
  if (reviewerMissionsCompleted < 3) return false
  return true
}

export function getMissingRequiredCriteria(
  criteria: Criterion[],
  checked: Record<string, boolean>
): string[] {
  return criteria
    .filter(c => c.weight === "REQUIRED" && !checked[c.id])
    .map(c => c.label)
}
```

- [ ] **Step 4 : Vérifier que les tests passent**

```bash
npx vitest run __tests__/acceptance-criteria.test.ts
```

Expected : PASS — toutes les suites vertes

- [ ] **Step 5 : Commit**

```bash
git add lib/acceptance-criteria.ts __tests__/acceptance-criteria.test.ts
git commit -m "feat(missions): acceptance criteria lib with quality level + reviewer eligibility logic"
```

---

## Task 3 — Mettre à jour la route POST /api/missions pour NEEDS_REVISION

**Files:**
- Modify: `app/api/missions/route.ts`

- [ ] **Step 1 : Mettre à jour les guards de soumission**

Dans `app/api/missions/route.ts`, remplacer le bloc de vérification de soumission existante :

```typescript
// Remplacer ce bloc :
if (existingSubmission && existingSubmission.status === "APPROVED") {
  return new NextResponse("Cette mission a déjà été validée...", { status: 400 });
}
if (existingSubmission && existingSubmission.status === "PENDING") {
  return new NextResponse("Ta soumission est déjà en attente...", { status: 400 });
}

// Par :
if (existingSubmission) {
  if (existingSubmission.status === "APPROVED") {
    return new NextResponse("Cette mission a déjà été validée. Passe à la suivante !", { status: 409 });
  }
  if (existingSubmission.status === "PENDING" || existingSubmission.status === "IN_REVIEW") {
    return new NextResponse("Ta soumission est déjà en attente de validation. Patience !", { status: 400 });
  }
  if (existingSubmission.revisionCount >= 3) {
    return new NextResponse("Nombre maximum de révisions atteint. Contacte un admin.", { status: 400 });
  }
  // status === "NEEDS_REVISION" → autoriser re-soumission
}
```

- [ ] **Step 2 : Commit**

```bash
git add app/api/missions/route.ts
git commit -m "feat(missions): allow resubmission on NEEDS_REVISION, block IN_REVIEW"
```

---

## Task 4 — Mettre à jour la route admin PATCH pour NEEDS_REVISION + qualityLevel

**Files:**
- Modify: `app/api/admin/submissions/[id]/route.ts`
- Modify: `__tests__/admin-submissions.test.ts`

- [ ] **Step 1 : Écrire les tests supplémentaires**

Ajouter à la fin de `__tests__/admin-submissions.test.ts` :

```typescript
  it("should approve with GOOD quality level and award 125% XP", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "admin1", role: "ADMIN" });

    const mockSubmission = {
      id: "sub1",
      userId: "user1",
      status: "PENDING",
      mission: { id: "m1", title: "Mission 1", xp: 200, category: "CODE", weightBuilder: 1, weightCreator: 0, weightStrategist: 0, weightCatalyst: 0 },
      user: { id: "user1", experience: 0, level: 1 }
    };
    (prisma.missionSubmission.findUnique as any).mockResolvedValue(mockSubmission);

    const req = new Request("http://localhost/api/admin/submissions/sub1", {
      method: "PATCH",
      body: JSON.stringify({ action: "APPROVE", qualityLevel: "GOOD" }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: "sub1" }) });
    expect(res.status).toBe(200);
    expect(prisma.missionSubmission.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({ xpAwarded: 250, qualityLevel: "GOOD" })
    }));
  });

  it("should set NEEDS_REVISION with revisionNotes", async () => {
    (auth.api.getSession as any).mockResolvedValue({ user: { id: "admin1" } });
    (prisma.user.findUnique as any).mockResolvedValue({ id: "admin1", role: "ADMIN" });

    const mockSubmission = {
      id: "sub1",
      userId: "user1",
      status: "PENDING",
      revisionCount: 0,
      mission: { id: "m1", title: "Mission 1", xp: 100, category: "CODE" },
      user: { id: "user1", experience: 0, level: 1 }
    };
    (prisma.missionSubmission.findUnique as any).mockResolvedValue(mockSubmission);

    const req = new Request("http://localhost/api/admin/submissions/sub1", {
      method: "PATCH",
      body: JSON.stringify({
        action: "NEEDS_REVISION",
        feedback: "Le README est insuffisant et le code n'est pas fonctionnel.",
        revisionNotes: "README présent avec description du projet\nCode fonctionnel (pas un scaffold vide)"
      }),
    });

    const res = await PATCH(req, { params: Promise.resolve({ id: "sub1" }) });
    expect(res.status).toBe(200);
    expect(prisma.missionSubmission.update).toHaveBeenCalledWith(expect.objectContaining({
      data: expect.objectContaining({
        status: "NEEDS_REVISION",
        adminFeedback: "Le README est insuffisant et le code n'est pas fonctionnel.",
        revisionNotes: "README présent avec description du projet\nCode fonctionnel (pas un scaffold vide)",
        revisionCount: { increment: 1 }
      })
    }));
  });
```

- [ ] **Step 2 : Vérifier que les nouveaux tests échouent**

```bash
npx vitest run __tests__/admin-submissions.test.ts
```

Expected : les 2 nouveaux tests FAIL

- [ ] **Step 3 : Mettre à jour la route admin**

Remplacer entièrement `app/api/admin/submissions/[id]/route.ts` :

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { XP_THRESHOLDS } from "@/lib/missions";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { triggerNotification } from "@/lib/qstash";
import { BehavioralVibrancy } from "@/lib/evolution";
import { computeXp, type QualityLevel } from "@/lib/acceptance-criteria";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const body = await req.json();
    const { action, feedback, qualityLevel, revisionNotes } = body;
    const { id } = await params;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id },
      include: { mission: true, user: true }
    });

    if (!submission) return new NextResponse("Submission not found", { status: 404 });
    if (submission.status === "APPROVED" || submission.status === "REJECTED") {
      return new NextResponse("Submission already processed", { status: 400 });
    }

    if (action === "APPROVE") {
      const level: QualityLevel = qualityLevel ?? "STANDARD";
      const xpAwarded = computeXp(submission.mission.xp, level);
      const newXp = (submission.user.experience || 0) + xpAwarded;

      let newLevel = submission.user.level || 1;
      for (const [levelStr, threshold] of Object.entries(XP_THRESHOLDS)) {
        const levelNum = parseInt(levelStr);
        if (newXp >= threshold && levelNum > newLevel) newLevel = levelNum;
      }

      const missionWeights: BehavioralVibrancy = {
        builder: submission.mission.weightBuilder || 0,
        creator: submission.mission.weightCreator || 0,
        strategist: submission.mission.weightStrategist || 0,
        catalyst: submission.mission.weightCatalyst || 0,
      };

      await prisma.$transaction(async (tx) => {
        await tx.missionSubmission.update({
          where: { id },
          data: { status: "APPROVED", xpAwarded, qualityLevel: level, adminFeedback: feedback ?? null }
        });
        await updateUserEvolution(submission.userId, missionWeights, 0.05, tx);
        await tx.user.update({
          where: { id: submission.userId },
          data: { experience: newXp, level: newLevel, missionsCompletedCount: { increment: 1 } }
        });
      });

      try {
        const qualityMsg = level === "EXEMPLARY" ? " Travail exemplaire !" : level === "GOOD" ? " Très bon travail !" : "";
        await triggerNotification({
          userId: submission.userId,
          type: "MISSION_APPROVED",
          title: `Mission validée : ${submission.mission.title}`,
          message: `Félicitations ! Tu as gagné +${xpAwarded} XP.${qualityMsg}`,
          link: "/missions"
        });
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      return NextResponse.json({ success: true, newLevel, leveledUp: newLevel > (submission.user.level || 1), xpAwarded });
    }

    if (action === "NEEDS_REVISION") {
      await prisma.missionSubmission.update({
        where: { id },
        data: {
          status: "NEEDS_REVISION",
          adminFeedback: feedback ?? null,
          revisionNotes: revisionNotes ?? null,
          revisionCount: { increment: 1 }
        }
      });

      try {
        await triggerNotification({
          userId: submission.userId,
          type: "SYSTEM",
          title: `Révision requise : ${submission.mission.title}`,
          message: feedback || "Ta soumission nécessite des améliorations. Consulte le feedback.",
          link: `/missions/${submission.missionId}`
        });
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      return NextResponse.json({ success: true });
    }

    if (action === "REJECT") {
      await prisma.missionSubmission.update({
        where: { id },
        data: { status: "REJECTED", adminFeedback: feedback }
      });

      try {
        await triggerNotification({
          userId: submission.userId,
          type: "SYSTEM",
          title: `Mission refusée : ${submission.mission.title}`,
          message: feedback || "Ta soumission n'a pas été retenue.",
          link: "/missions"
        });
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      return NextResponse.json({ success: true });
    }

    return new NextResponse("Invalid action", { status: 400 });
  } catch (error) {
    console.error("[ADMIN_SUBMISSION_PATCH]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

- [ ] **Step 4 : Vérifier que tous les tests passent**

```bash
npx vitest run __tests__/admin-submissions.test.ts
```

Expected : PASS — 5 tests verts

- [ ] **Step 5 : Commit**

```bash
git add app/api/admin/submissions/[id]/route.ts __tests__/admin-submissions.test.ts
git commit -m "feat(admin): support NEEDS_REVISION + qualityLevel in submission validation"
```

---

## Task 5 — Endpoint : claim une soumission (peer review)

**Files:**
- Create: `app/api/missions/[id]/claim/route.ts`

- [ ] **Step 1 : Créer le fichier**

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isEligibleReviewer } from "@/lib/acceptance-criteria";

const LEVEL_REQUIREMENT: Record<string, number> = { INIT: 1, CORE: 2, PRO: 3 };

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id: submissionId } = await params;

    const [submission, reviewer] = await Promise.all([
      prisma.missionSubmission.findUnique({
        where: { id: submissionId },
        include: { mission: true },
      }),
      prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, class: true, level: true, missionsCompletedCount: true },
      }),
    ]);

    if (!submission) return new NextResponse("Submission not found", { status: 404 });
    if (!reviewer) return new NextResponse("User not found", { status: 404 });

    if (submission.status !== "PENDING") {
      return new NextResponse("Submission is not available for review", { status: 400 });
    }

    const missionRequiredLevel = LEVEL_REQUIREMENT[submission.mission.missionLevel ?? "INIT"] ?? 1;

    const eligible = isEligibleReviewer({
      reviewerClass: reviewer.class,
      reviewerLevel: reviewer.level,
      reviewerMissionsCompleted: reviewer.missionsCompletedCount,
      reviewerId: reviewer.id,
      submissionUserId: submission.userId,
      missionTargetProfiles: submission.mission.targetProfiles,
      missionRequiredLevel,
    });

    if (!eligible) {
      return new NextResponse("Tu n'es pas éligible pour reviewer cette mission.", { status: 403 });
    }

    const updated = await prisma.missionSubmission.update({
      where: { id: submissionId },
      data: { status: "IN_REVIEW", reviewerId: reviewer.id, reviewerType: "PEER" },
    });

    return NextResponse.json({ success: true, submission: updated });
  } catch (error) {
    console.error("[CLAIM_REVIEW]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

- [ ] **Step 2 : Commit**

```bash
git add app/api/missions/[id]/claim/route.ts
git commit -m "feat(reviewer): claim submission endpoint with eligibility check"
```

---

## Task 6 — Endpoint : soumettre une revue (peer review)

**Files:**
- Create: `app/api/missions/[id]/review/route.ts`

- [ ] **Step 1 : Créer le fichier**

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getCriteriaForMission,
  computeQualityLevel,
  computeXp,
  getMissingRequiredCriteria,
} from "@/lib/acceptance-criteria";
import { XP_THRESHOLDS } from "@/lib/missions";
import { triggerNotification } from "@/lib/qstash";
import { updateUserEvolution } from "@/lib/evolution-engine";
import { BehavioralVibrancy } from "@/lib/evolution";

const reviewSchema = z.object({
  criteria: z.record(z.boolean()),
  feedback: z.string().min(20),
  forceApprove: z.boolean().optional().default(false),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { id: submissionId } = await params;
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return new NextResponse("Invalid data", { status: 400 });

    const { criteria, feedback, forceApprove } = parsed.data;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id: submissionId },
      include: { mission: true, user: true },
    });

    if (!submission) return new NextResponse("Submission not found", { status: 404 });
    if (submission.reviewerId !== session.user.id) {
      return new NextResponse("Tu n'es pas le reviewer assigné à cette soumission.", { status: 403 });
    }
    if (submission.status !== "IN_REVIEW") {
      return new NextResponse("Cette soumission n'est pas en cours de revue.", { status: 400 });
    }

    const missionCriteria = getCriteriaForMission(submission.mission.category);
    const missingRequired = getMissingRequiredCriteria(missionCriteria, criteria);
    const allRequiredPassed = missingRequired.length === 0;

    // Reviewer reward: 15% of base XP
    const reviewerXpReward = Math.round(submission.mission.xp * 0.15);

    if (allRequiredPassed || forceApprove) {
      const qualityLevel = computeQualityLevel(missionCriteria, criteria);
      const xpAwarded = computeXp(submission.mission.xp, qualityLevel);
      const newXp = (submission.user.experience || 0) + xpAwarded;

      let newLevel = submission.user.level || 1;
      for (const [levelStr, threshold] of Object.entries(XP_THRESHOLDS)) {
        const levelNum = parseInt(levelStr);
        if (newXp >= threshold && levelNum > newLevel) newLevel = levelNum;
      }

      const missionWeights: BehavioralVibrancy = {
        builder: submission.mission.weightBuilder || 0,
        creator: submission.mission.weightCreator || 0,
        strategist: submission.mission.weightStrategist || 0,
        catalyst: submission.mission.weightCatalyst || 0,
      };

      await prisma.$transaction(async (tx) => {
        await tx.missionReview.create({
          data: {
            submissionId,
            reviewerId: session.user.id,
            criteria,
            qualityLevel,
            feedback,
          },
        });
        await tx.missionSubmission.update({
          where: { id: submissionId },
          data: { status: "APPROVED", xpAwarded, qualityLevel },
        });
        await updateUserEvolution(submission.userId, missionWeights, 0.05, tx);
        await tx.user.update({
          where: { id: submission.userId },
          data: { experience: newXp, level: newLevel, missionsCompletedCount: { increment: 1 } },
        });
        // Reward reviewer
        await tx.user.update({
          where: { id: session.user.id },
          data: { experience: { increment: reviewerXpReward }, reviewsCompleted: { increment: 1 } },
        });
      });

      try {
        await triggerNotification({
          userId: submission.userId,
          type: "MISSION_APPROVED",
          title: `Mission validée : ${submission.mission.title}`,
          message: `Félicitations ! +${xpAwarded} XP. Niveau : ${qualityLevel}.`,
          link: `/missions/${submission.missionId}`,
        });
      } catch (err) {
        console.error("[NOTIFICATION_ERROR]", err);
      }

      return NextResponse.json({ success: true, qualityLevel, xpAwarded });
    }

    // Needs revision
    const revisionNotes = missingRequired.join("\n");

    await prisma.$transaction(async (tx) => {
      await tx.missionReview.create({
        data: {
          submissionId,
          reviewerId: session.user.id,
          criteria,
          qualityLevel: "STANDARD",
          feedback,
          revisionNotes,
        },
      });
      await tx.missionSubmission.update({
        where: { id: submissionId },
        data: { status: "NEEDS_REVISION", revisionNotes, revisionCount: { increment: 1 }, adminFeedback: feedback },
      });
      // Reward reviewer even on revision
      await tx.user.update({
        where: { id: session.user.id },
        data: { experience: { increment: reviewerXpReward }, reviewsCompleted: { increment: 1 } },
      });
    });

    try {
      await triggerNotification({
        userId: submission.userId,
        type: "SYSTEM",
        title: `Révision requise : ${submission.mission.title}`,
        message: feedback,
        link: `/missions/${submission.missionId}`,
      });
    } catch (err) {
      console.error("[NOTIFICATION_ERROR]", err);
    }

    return NextResponse.json({ success: true, status: "NEEDS_REVISION", missingRequired });
  } catch (error) {
    console.error("[SUBMIT_REVIEW]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

- [ ] **Step 2 : Commit**

```bash
git add app/api/missions/[id]/review/route.ts
git commit -m "feat(reviewer): submit review endpoint with quality level + XP reward"
```

---

## Task 7 — Endpoint : queue des soumissions à reviewer

**Files:**
- Create: `app/api/reviewer/route.ts`

- [ ] **Step 1 : Créer le fichier**

```typescript
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { isEligibleReviewer } from "@/lib/acceptance-criteria";

const LEVEL_REQUIREMENT: Record<string, number> = { INIT: 1, CORE: 2, PRO: 3 };

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const reviewer = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, class: true, level: true, missionsCompletedCount: true },
    });

    if (!reviewer) return new NextResponse("User not found", { status: 404 });

    const pendingSubmissions = await prisma.missionSubmission.findMany({
      where: { status: "PENDING" },
      include: {
        mission: { select: { id: true, title: true, category: true, xp: true, missionLevel: true, targetProfiles: true } },
        user: { select: { id: true, name: true, pseudo: true, level: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    const eligible = pendingSubmissions.filter(sub => {
      const missionRequiredLevel = LEVEL_REQUIREMENT[sub.mission.missionLevel ?? "INIT"] ?? 1;
      return isEligibleReviewer({
        reviewerClass: reviewer.class,
        reviewerLevel: reviewer.level,
        reviewerMissionsCompleted: reviewer.missionsCompletedCount,
        reviewerId: reviewer.id,
        submissionUserId: sub.userId,
        missionTargetProfiles: sub.mission.targetProfiles,
        missionRequiredLevel,
      });
    });

    return NextResponse.json(eligible);
  } catch (error) {
    console.error("[REVIEWER_QUEUE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
```

- [ ] **Step 2 : Commit**

```bash
git add app/api/reviewer/route.ts
git commit -m "feat(reviewer): reviewer queue endpoint — returns eligible submissions"
```

---

## Task 8 — Mettre à jour la page de détail mission pour NEEDS_REVISION

**Files:**
- Modify: `app/missions/[id]/page.tsx`
- Modify: `app/missions/[id]/mission-submission-form.tsx`

- [ ] **Step 1 : Mettre à jour la query dans page.tsx**

Dans `app/missions/[id]/page.tsx`, mettre à jour la query missionSubmissions pour récupérer les nouveaux champs. Remplacer :

```typescript
include: {
  missionSubmissions: {
    where: { missionId: id },
  },
},
```

Par :

```typescript
include: {
  missionSubmissions: {
    where: { missionId: id },
    select: {
      status: true,
      revisionNotes: true,
      revisionCount: true,
      adminFeedback: true,
      qualityLevel: true,
      xpAwarded: true,
    },
  },
},
```

- [ ] **Step 2 : Ajouter les nouveaux états**

Après `const isPending = submission?.status === "PENDING"`, ajouter :

```typescript
const isNeedsRevision = submission?.status === "NEEDS_REVISION"
const isInReview = submission?.status === "IN_REVIEW"
```

- [ ] **Step 3 : Mettre à jour le rendu du status card dans page.tsx**

Remplacer le bloc `{isCompleted ? (...) : isPending ? (...) : (<MissionSubmissionForm .../>)}` par :

```tsx
{isCompleted ? (
  <div className="flex flex-col items-center text-center py-8 gap-4">
    <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
      <CheckCircle2 className="w-7 h-7 text-emerald-500" />
    </div>
    <div>
      <h3 className="font-bold text-emerald-400 font-mono text-sm uppercase tracking-widest">Mission validée</h3>
      {submission?.qualityLevel && submission.qualityLevel !== "STANDARD" && (
        <p className="text-xs text-emerald-400/60 mt-1 font-mono">
          {submission.qualityLevel === "EXEMPLARY" ? "⭐ Travail exemplaire" : "✦ Très bon travail"}
          {" · "}+{submission.xpAwarded} XP
        </p>
      )}
    </div>
  </div>
) : isInReview ? (
  <div className="flex flex-col items-center text-center py-8 gap-4">
    <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
      <Rocket className="w-7 h-7 text-blue-400 animate-pulse" />
    </div>
    <div>
      <h3 className="font-bold text-blue-400 font-mono text-sm uppercase tracking-widest">En cours de revue</h3>
      <p className="text-xs text-zinc-500 mt-2">Un reviewer analyse ta soumission.</p>
    </div>
  </div>
) : isPending ? (
  <div className="flex flex-col items-center text-center py-8 gap-4">
    <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
      <Rocket className="w-7 h-7 text-amber-400 animate-pulse" />
    </div>
    <div>
      <h3 className="font-bold text-amber-400 font-mono text-sm uppercase tracking-widest">En attente de revue</h3>
      <p className="text-xs text-zinc-500 mt-2 leading-relaxed">Nos opérateurs analysent ta transmission.</p>
    </div>
  </div>
) : (
  <MissionSubmissionForm
    missionId={mission.id}
    submissionMethod={mission.submissionMethod}
    revisionNotes={isNeedsRevision ? (submission?.revisionNotes ?? null) : null}
    reviewerFeedback={isNeedsRevision ? (submission?.adminFeedback ?? null) : null}
    revisionCount={submission?.revisionCount ?? 0}
  />
)}
```

- [ ] **Step 4 : Mettre à jour mission-submission-form.tsx pour afficher les notes de révision**

En tête du fichier, mettre à jour l'interface :

```typescript
interface MissionSubmissionFormProps {
  missionId: string;
  submissionMethod: string;
  revisionNotes?: string | null;
  reviewerFeedback?: string | null;
  revisionCount?: number;
}
```

Mettre à jour la signature de la fonction :

```typescript
export function MissionSubmissionForm({
  missionId,
  submissionMethod,
  revisionNotes,
  reviewerFeedback,
  revisionCount = 0,
}: MissionSubmissionFormProps) {
```

Ajouter juste avant le `return` du step 1 (form), après l'ouverture de la fonction :

```tsx
const hasRevision = !!revisionNotes

return (
  <div className="space-y-4">
    {hasRevision && (
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
          Révision #{revisionCount} — Points à corriger
        </p>
        {reviewerFeedback && (
          <p className="text-xs text-zinc-300 leading-relaxed italic">"{reviewerFeedback}"</p>
        )}
        <ul className="space-y-1.5">
          {revisionNotes.split("\n").filter(Boolean).map((note, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-amber-300/80">
              <span className="text-amber-500 mt-0.5">—</span>
              {note}
            </li>
          ))}
        </ul>
      </div>
    )}
    {/* ... reste du form existant */}
  </div>
)
```

Note : entourer le `<form>` existant dans un `<div className="space-y-4">` et ajouter le bloc de révision avant.

- [ ] **Step 5 : Commit**

```bash
git add app/missions/[id]/page.tsx app/missions/[id]/mission-submission-form.tsx
git commit -m "feat(missions): display NEEDS_REVISION state with revision notes and feedback"
```

---

## Task 9 — Composant rubrique reviewer + page reviewer

**Files:**
- Create: `components/missions/reviewer-rubric-form.tsx`
- Create: `app/reviewer/page.tsx`

- [ ] **Step 1 : Créer le composant de rubrique**

Créer `components/missions/reviewer-rubric-form.tsx` :

```tsx
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Loader2, CheckCircle2, Circle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { getCriteriaForMission, computeQualityLevel, type Criterion } from "@/lib/acceptance-criteria"

interface ReviewerRubricFormProps {
  submissionId: string
  missionCategory: string
  missionXp: number
}

export function ReviewerRubricForm({ submissionId, missionCategory, missionXp }: ReviewerRubricFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState("")
  const [checked, setChecked] = useState<Record<string, boolean>>({})

  const criteria = getCriteriaForMission(missionCategory)
  const required = criteria.filter(c => c.weight === "REQUIRED")
  const bonus = criteria.filter(c => c.weight === "BONUS")
  const allRequiredPassed = required.every(c => checked[c.id])
  const suggestedQuality = allRequiredPassed ? computeQualityLevel(criteria, checked) : null

  const toggle = (id: string) => setChecked(prev => ({ ...prev, [id]: !prev[id] }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim() || feedback.length < 20) {
      toast.error("Le feedback doit contenir au moins 20 caractères.")
      return
    }
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/missions/${submissionId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ criteria: checked, feedback }),
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      if (data.status === "NEEDS_REVISION") {
        toast.info("Révision demandée. Le membre a été notifié.")
      } else {
        toast.success(`Mission validée — Niveau ${data.qualityLevel} (+${data.xpAwarded} XP pour le membre)`)
      }
      router.push("/reviewer")
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de la soumission de la revue.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const CriterionRow = ({ criterion }: { criterion: Criterion }) => (
    <button
      type="button"
      onClick={() => toggle(criterion.id)}
      className={`w-full flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
        checked[criterion.id]
          ? "border-primary/30 bg-primary/5 text-zinc-200"
          : "border-border/30 bg-card/20 text-zinc-400 hover:border-border/60"
      }`}
    >
      {checked[criterion.id]
        ? <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        : <Circle className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
      }
      <span className="text-sm leading-relaxed">{criterion.label}</span>
      {criterion.weight === "BONUS" && (
        <span className="ml-auto text-[9px] font-mono text-primary/40 uppercase tracking-widest shrink-0 mt-0.5">bonus</span>
      )}
    </button>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Critères requis</p>
        {required.map(c => <CriterionRow key={c.id} criterion={c} />)}
      </div>

      {bonus.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Critères bonus</p>
          {bonus.map(c => <CriterionRow key={c.id} criterion={c} />)}
        </div>
      )}

      {suggestedQuality && (
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs font-mono text-primary text-center uppercase tracking-widest">
          Niveau suggéré : {suggestedQuality} · +{Math.round(missionXp * (suggestedQuality === "EXEMPLARY" ? 1.5 : suggestedQuality === "GOOD" ? 1.25 : 1))} XP
        </div>
      )}

      <div className="space-y-2">
        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Feedback pour le membre {!allRequiredPassed && <span className="text-amber-400">(explique ce qui manque)</span>}
        </label>
        <Textarea
          placeholder={allRequiredPassed ? "Commentaire sur le travail réalisé..." : "Explique précisément ce qui doit être amélioré..."}
          value={feedback}
          onChange={e => setFeedback(e.target.value)}
          className="bg-card/30 border-border/40 rounded-xl min-h-[100px] text-sm"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full h-11 rounded-xl btn-primary-glow"
        disabled={isSubmitting || feedback.length < 20}
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
        {allRequiredPassed ? "Valider la soumission" : "Demander une révision"}
      </Button>
    </form>
  )
}
```

- [ ] **Step 2 : Créer la page reviewer**

Créer `app/reviewer/page.tsx` :

```tsx
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { ReviewerQueue } from "@/components/missions/reviewer-queue"

export default async function ReviewerPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/signin")

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!dbUser) redirect("/signin")

  return (
    <SidebarProvider>
      <AppSidebar user={dbUser} />
      <BottomNav />
      <SidebarInset className="bg-background">
        <UserTopBar user={dbUser} />
        <main className="flex-1 p-4 md:p-8 pb-(--bottom-nav-height) md:pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight">Espace Reviewer</h1>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Soumissions éligibles pour ta revue — même profil, niveau supérieur.
              </p>
            </div>
            <ReviewerQueue reviewerId={dbUser.id} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
```

- [ ] **Step 3 : Créer le composant ReviewerQueue**

Créer `components/missions/reviewer-queue.tsx` :

```tsx
"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, ExternalLink, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ReviewerRubricForm } from "./reviewer-rubric-form"

interface QueueItem {
  id: string
  content: string | null
  projectDescription: string | null
  createdAt: string
  user: { name: string; pseudo: string | null; level: number }
  mission: { id: string; title: string; category: string; xp: number }
}

export function ReviewerQueue({ reviewerId }: { reviewerId: string }) {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [claiming, setClaiming] = useState<string | null>(null)
  const [activeReview, setActiveReview] = useState<QueueItem | null>(null)

  useEffect(() => {
    fetch("/api/reviewer")
      .then(r => r.json())
      .then(setQueue)
      .catch(() => toast.error("Impossible de charger la queue."))
      .finally(() => setLoading(false))
  }, [])

  const handleClaim = async (item: QueueItem) => {
    setClaiming(item.id)
    try {
      const res = await fetch(`/api/missions/${item.id}/claim`, { method: "POST" })
      if (!res.ok) throw new Error(await res.text())
      setActiveReview(item)
      setQueue(q => q.filter(i => i.id !== item.id))
    } catch (err: any) {
      toast.error(err.message || "Impossible de claim cette soumission.")
    } finally {
      setClaiming(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    )
  }

  if (activeReview) {
    return (
      <div className="rounded-2xl border border-border/40 bg-card/30 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/30">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">En cours de revue</p>
          <h2 className="text-lg font-bold mt-1">{activeReview.mission.title}</h2>
          <p className="text-xs text-zinc-400 mt-1">par {activeReview.user.pseudo ?? activeReview.user.name}</p>
        </div>
        <div className="p-6 space-y-6">
          {activeReview.content && (
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Soumission</p>
              <a
                href={activeReview.content}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
              >
                {activeReview.content}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
          {activeReview.projectDescription && (
            <div className="space-y-1">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Description du projet</p>
              <p className="text-sm text-zinc-300 leading-relaxed">{activeReview.projectDescription}</p>
            </div>
          )}
          <ReviewerRubricForm
            submissionId={activeReview.id}
            missionCategory={activeReview.mission.category}
            missionXp={activeReview.mission.xp}
          />
        </div>
      </div>
    )
  }

  if (queue.length === 0) {
    return (
      <div className="text-center py-20 text-sm text-muted-foreground font-mono">
        Aucune soumission disponible pour ta revue actuellement.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {queue.map(item => (
        <div key={item.id} className="flex items-center justify-between gap-4 p-5 rounded-2xl border border-border/40 bg-card/20 hover:border-border/60 transition-colors">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[9px] font-mono uppercase text-primary border-primary/20 bg-primary/5">
                {item.mission.category}
              </Badge>
              <span className="text-[10px] font-mono text-primary">+{Math.round(item.mission.xp * 0.15)} XP reviewer</span>
            </div>
            <p className="font-medium text-sm truncate">{item.mission.title}</p>
            <p className="text-[11px] text-muted-foreground font-mono">
              {item.user.pseudo ?? item.user.name} · LVL {item.user.level} · {new Date(item.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="shrink-0 border-primary/30 text-primary hover:bg-primary/10 font-mono text-[10px] uppercase tracking-widest"
            onClick={() => handleClaim(item)}
            disabled={claiming === item.id}
          >
            {claiming === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <>Reviewer <ChevronRight className="w-3 h-3 ml-1" /></>}
          </Button>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 4 : Commit**

```bash
git add components/missions/reviewer-rubric-form.tsx components/missions/reviewer-queue.tsx app/reviewer/page.tsx
git commit -m "feat(reviewer): rubric form + reviewer queue component + dashboard page"
```

---

## Task 10 — Mettre à jour le dashboard admin avec rubrique + qualityLevel

**Files:**
- Modify: `app/admin/submissions/page.tsx`

- [ ] **Step 1 : Remplacer le composant de dialog de rejet par un drawer complet**

Dans `app/admin/submissions/page.tsx`, remplacer le state et les handlers existants. Ajouter en tête du composant :

```typescript
const [activeSubmission, setActiveSubmission] = useState<Submission | null>(null)
const [adminFeedback, setAdminFeedback] = useState("")
const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({})
```

- [ ] **Step 2 : Mettre à jour handleAction pour envoyer criteria + qualityLevel**

Remplacer la fonction `handleAction` existante :

```typescript
const handleAction = async (
  id: string,
  action: "APPROVE" | "REJECT" | "NEEDS_REVISION",
  options?: { criteria?: Record<string, boolean>; feedback?: string; qualityLevel?: string }
) => {
  setProcessingId(id)
  try {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        feedback: options?.feedback,
        qualityLevel: options?.qualityLevel,
        revisionNotes: options?.criteria
          ? getCriteriaForMission(activeSubmission?.mission.category ?? "GENERAL")
              .filter(c => c.weight === "REQUIRED" && !options.criteria![c.id])
              .map(c => c.label)
              .join("\n")
          : undefined,
      }),
    })
    if (res.ok) {
      toast({ title: action === "APPROVE" ? "Validée" : action === "NEEDS_REVISION" ? "Révision demandée" : "Refusée" })
      setSubmissions(s => s.filter(sub => sub.id !== id))
      setActiveSubmission(null)
      setAdminFeedback("")
      setCheckedCriteria({})
    } else {
      const err = await res.text()
      toast({ title: "Erreur", description: err, variant: "destructive" })
    }
  } catch (e) {
    toast({ title: "Erreur réseau", variant: "destructive" })
  } finally {
    setProcessingId(null)
  }
}
```

- [ ] **Step 3 : Ajouter l'import getCriteriaForMission en tête du fichier**

```typescript
import { getCriteriaForMission, computeQualityLevel } from "@/lib/acceptance-criteria"
```

- [ ] **Step 4 : Remplacer les boutons d'action dans le tableau**

Remplacer le contenu de `<TableCell className="text-right">` pour chaque soumission :

```tsx
<TableCell className="text-right">
  <Button
    size="sm"
    variant="outline"
    className="h-8 border-primary/20 text-primary hover:bg-primary/10 font-mono text-[9px] uppercase tracking-widest"
    onClick={() => {
      setActiveSubmission(s)
      setCheckedCriteria({})
      setAdminFeedback("")
    }}
    disabled={processingId === s.id}
  >
    Réviser
  </Button>
</TableCell>
```

- [ ] **Step 5 : Ajouter le panel de révision en dehors du tableau**

Ajouter après la div du tableau, avant la fermeture du `div.max-w-7xl` :

```tsx
{activeSubmission && (
  <div className="rounded-2xl border border-primary/20 bg-zinc-900/60 p-6 space-y-6">
    <div className="flex items-start justify-between">
      <div>
        <h2 className="font-bold text-lg">{activeSubmission.mission.title}</h2>
        <p className="text-xs text-muted-foreground font-mono mt-1">
          {activeSubmission.user.name} · LVL {activeSubmission.user.level}
        </p>
      </div>
      <button onClick={() => setActiveSubmission(null)} className="text-xs font-mono text-muted-foreground hover:text-white">✕ Fermer</button>
    </div>

    {activeSubmission.content && (
      <div>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">Soumission</p>
        <a href={activeSubmission.content} target="_blank" rel="noopener noreferrer"
          className="text-sm text-primary hover:underline inline-flex items-center gap-1">
          {activeSubmission.content} <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    )}

    <div className="space-y-3">
      <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Rubrique d'évaluation</p>
      {getCriteriaForMission(activeSubmission.mission.category).map(criterion => (
        <button
          key={criterion.id}
          type="button"
          onClick={() => setCheckedCriteria(prev => ({ ...prev, [criterion.id]: !prev[criterion.id] }))}
          className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all text-sm ${
            checkedCriteria[criterion.id]
              ? "border-primary/30 bg-primary/5 text-zinc-200"
              : "border-white/5 bg-white/[0.02] text-zinc-500 hover:border-white/10"
          }`}
        >
          {checkedCriteria[criterion.id]
            ? <Check className="w-4 h-4 text-primary shrink-0" />
            : <div className="w-4 h-4 rounded border border-white/20 shrink-0" />
          }
          {criterion.label}
          {criterion.weight === "BONUS" && (
            <span className="ml-auto text-[9px] font-mono text-primary/40 uppercase tracking-widest">bonus</span>
          )}
        </button>
      ))}
    </div>

    <div className="space-y-2">
      <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Feedback</label>
      <Textarea
        placeholder="Commentaire pour le membre..."
        className="bg-black/40 border-white/5 min-h-[100px] text-sm"
        value={adminFeedback}
        onChange={e => setAdminFeedback(e.target.value)}
      />
    </div>

    <div className="flex items-center gap-3">
      <Button
        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
        onClick={() => {
          const criteria = getCriteriaForMission(activeSubmission.mission.category)
          const quality = computeQualityLevel(criteria, checkedCriteria)
          handleAction(activeSubmission.id, "APPROVE", { criteria: checkedCriteria, feedback: adminFeedback, qualityLevel: quality })
        }}
        disabled={processingId === activeSubmission.id}
      >
        {processingId === activeSubmission.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Check className="w-4 h-4 mr-2" />}
        Valider
      </Button>
      <Button
        variant="outline"
        className="flex-1 border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
        onClick={() => handleAction(activeSubmission.id, "NEEDS_REVISION", { criteria: checkedCriteria, feedback: adminFeedback })}
        disabled={processingId === activeSubmission.id || !adminFeedback.trim()}
      >
        Demander révision
      </Button>
      <Button
        variant="outline"
        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
        onClick={() => handleAction(activeSubmission.id, "REJECT", { feedback: adminFeedback })}
        disabled={processingId === activeSubmission.id || !adminFeedback.trim()}
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  </div>
)}
```

- [ ] **Step 6 : Commit**

```bash
git add app/admin/submissions/page.tsx
git commit -m "feat(admin): rubric-based validation panel with quality level selection"
```

---

## Task 11 — Seed des missions DB avec acceptanceCriteria

**Files:**
- Create: `scripts/seed-mission-criteria.ts`

- [ ] **Step 1 : Créer le script**

```typescript
import { PrismaClient } from "../generated/prisma"
import { getCriteriaForMission } from "../lib/acceptance-criteria"

const prisma = new PrismaClient()

async function main() {
  const missions = await prisma.mission.findMany()

  for (const mission of missions) {
    const criteria = getCriteriaForMission(mission.category)
    await prisma.mission.update({
      where: { id: mission.id },
      data: { acceptanceCriteria: criteria },
    })
    console.log(`✓ ${mission.title} — ${criteria.length} critères`)
  }

  console.log(`\nSeed terminé : ${missions.length} missions mises à jour.`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

- [ ] **Step 2 : Exécuter le script**

```bash
npx tsx scripts/seed-mission-criteria.ts
```

Expected : liste des missions avec ✓ et le nombre de critères

- [ ] **Step 3 : Commit**

```bash
git add scripts/seed-mission-criteria.ts
git commit -m "feat(missions): seed acceptance criteria for all existing missions"
```

---

## Task 12 — Run complet des tests + vérification finale

- [ ] **Step 1 : Lancer la suite de tests complète**

```bash
npm run test
```

Expected : tous les tests passent, aucune régression

- [ ] **Step 2 : Vérifier le build**

```bash
npm run build
```

Expected : build sans erreurs TypeScript

- [ ] **Step 3 : Commit final**

```bash
git add -A
git commit -m "feat(missions): mission system v2 — full implementation"
```
