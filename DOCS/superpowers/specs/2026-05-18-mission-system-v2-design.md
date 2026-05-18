# Mission System V2 — Standards & Protocoles de Validation

**Date :** 2026-05-18  
**Statut :** Approuvé  
**Auteur :** Eflex × Claude

---

## 1. Contexte et objectif

Le système de missions actuel fonctionne mais manque de rigueur : validation au feeling, XP fixe sans égard à la qualité, missions trop vagues, aucun état intermédiaire entre rejet et approbation. Ce document définit les standards de contenu, le protocole de validation et les changements techniques nécessaires pour rendre les missions riches et la progression juste.

---

## 2. Standard de contenu des missions

### 2.1 Structure du `fullBriefing` (Markdown)

Chaque mission doit avoir un `fullBriefing` complet en Markdown suivant cette structure :

```markdown
## Contexte
Pourquoi cette mission existe dans le parcours HASHCODE. Quelle compétence elle valide.

## Objectif
Ce à quoi ressemble exactement le succès. Une phrase précise et actionnable.

## Étapes suggérées
1. Étape 1
2. Étape 2
3. Étape 3

## Ressources (optionnel)
- [Titre](url) — description courte

## Critères d'acceptation
Ce que les reviewers vérifient (reprend les `acceptanceCriteria` du modèle).
```

### 2.2 Champs structurés par mission

| Champ DB | Type | Description |
|----------|------|-------------|
| `acceptanceCriteria` | `Json` | Tableau de critères `{ id, label, weight: "REQUIRED"\|"BONUS" }` |
| `evaluatorNotes` | `String?` | Guide caché reviewers : erreurs communes, quoi chercher |
| `qualityIndicators` | `Json` | Ce qui distingue GOOD d'EXEMPLARY pour cette mission |

---

## 3. États d'une soumission

```
PENDING
  └─▶ IN_REVIEW (reviewer a claimed, verrouillé 24h)
        ├─▶ APPROVED  [qualityLevel: STANDARD | GOOD | EXEMPLARY]
        ├─▶ NEEDS_REVISION  (checklist exacte de ce qui manque)
        │     └─▶ PENDING  (user corrige et re-soumet, max 3 fois)
        │           └─▶ (après 3ème révision sans approbation → escalade admin)
        └─▶ REJECTED  (fraude / spam uniquement, admin only)
```

**Règles :**
- `NEEDS_REVISION` n'est pas un rejet — la soumission reste ouverte.
- Chaque révision incrémente `revisionCount`. Au-delà de 3 → admin doit intervenir.
- `REJECTED` est réservé aux cas de fraude ou de contenu inapproprié, jamais pour qualité insuffisante.

---

## 4. Niveaux de qualité et XP

| Niveau | Condition d'obtention | Multiplicateur XP | Bonus |
|--------|----------------------|-------------------|-------|
| `STANDARD` | Tous les critères `REQUIRED` cochés | ×1.0 (100%) | — |
| `GOOD` | Tous `REQUIRED` + au moins 2 `BONUS` | ×1.25 (125%) | — |
| `EXEMPLARY` | Tous `REQUIRED` + tous `BONUS` + jugement reviewer | ×1.5 (150%) | Badge spécial mission |

**XP final = `mission.xp × multiplicateur`**

---

## 5. Protocole reviewer (peer review)

### 5.1 Éligibilité

Un membre peut reviewer les soumissions d'une mission si :
- Son `class` (profil) correspond au `targetProfiles` de la mission
- Son `level` ≥ niveau requis de la mission + 1
- Il a complété au moins 3 missions lui-même
- Il n'est pas l'auteur de la soumission

L'éligibilité est stockée dans `User.canReviewProfiles` (tableau mis à jour automatiquement quand les conditions sont remplies).

### 5.2 Flow d'assignation

1. Soumission créée → statut `PENDING`
2. Système notifie tous les reviewers éligibles
3. Premier reviewer à "claim" → statut `IN_REVIEW`, verrouillé 24h pour ce reviewer
4. Sans action à 48h → admin notifié + relance des reviewers éligibles

### 5.3 Niveau de validation requis par tier

| Tier mission | Validation requise |
|-------------|-------------------|
| `INIT` | 1 peer review → auto-approuvé |
| `CORE` | 1 peer review + confirmation admin |
| `PRO` | Admin uniquement |

### 5.4 Récompense reviewer

**15% de l'XP base de la mission** crédités au reviewer à chaque review complétée (indépendamment du résultat APPROVED/NEEDS_REVISION).

Exemple : reviewer d'une mission à 200 XP gagne 30 XP.

Tracking : `User.reviewsCompleted` incrémenté à chaque review.

---

## 6. Rubriques par type de mission

### CODE
| Critère | Poids |
|---------|-------|
| Lien accessible (repo public ou admin invité) | REQUIRED |
| README présent avec description du projet | REQUIRED |
| Code fonctionnel (pas un scaffold vide) | REQUIRED |
| Minimum 3 commits réels (historique visible) | REQUIRED |
| Objectif de la mission clairement atteint | REQUIRED |
| Tests présents (unitaires ou intégration) | BONUS |
| Déployé en production avec URL live | BONUS |
| Architecture lisible et documentée | BONUS |

**`evaluatorNotes` :** Vérifier l'historique git (pas un seul commit "initial"). Un README vide ou copié-collé = NEEDS_REVISION. Pour EXEMPLARY : le code doit pouvoir être relu par un tiers sans explication.

### DESIGN
| Critère | Poids |
|---------|-------|
| Fichiers accessibles (Figma / PDF / lien live) | REQUIRED |
| Tous les éléments demandés présents | REQUIRED |
| Cohérence visuelle démontrée | REQUIRED |
| Brief des choix de design expliqué | REQUIRED |
| Variantes / explorations multiples | BONUS |
| Guide de style complet (usage, do/don't) | BONUS |
| Moodboard ou sources d'inspiration documentées | BONUS |

**`evaluatorNotes` :** La cohérence primaire > la beauté subjective. Un design avec une logique claire mais simple vaut mieux qu'un design élaboré incohérent. Pour EXEMPLARY : le livrable doit être utilisable directement par un développeur.

### BUSINESS
| Critère | Poids |
|---------|-------|
| Structure imposée respectée (sections présentes) | REQUIRED |
| Recherche évidente, non générique | REQUIRED |
| Conclusions actionnables (pas juste descriptives) | REQUIRED |
| Clarté et qualité de l'écriture | REQUIRED |
| Données chiffrées citées avec sources | BONUS |
| Analyse concurrentielle incluse | BONUS |
| Validation terrain ou entretiens mentionnés | BONUS |

**`evaluatorNotes` :** "Marché en croissance" sans chiffre = NEEDS_REVISION. L'objectif n'est pas un bon texte, c'est une bonne décision business documentée. Pour EXEMPLARY : quelqu'un d'extérieur pourrait investir ou agir sur ce document.

### NETWORK
| Critère | Poids |
|---------|-------|
| Preuve fournie (screenshot, témoignage, recap) | REQUIRED |
| Contexte de la connexion / événement expliqué | REQUIRED |
| Impact ou résultat concret décrit | REQUIRED |
| Témoignage des parties impliquées | BONUS |
| Photos ou captures multiples | BONUS |
| Suivi post-connexion / post-événement mentionné | BONUS |

**`evaluatorNotes` :** Une preuve sans contexte ne suffit pas. Pour EXEMPLARY : l'impact doit être mesurable ou avoir une suite documentée.

---

## 7. Processus de review (UX reviewer)

1. Reviewer ouvre la soumission → voit : contenu soumis, briefing mission, critères
2. Coche chaque critère (required + bonus)
3. Choisit le niveau de qualité (STANDARD / GOOD / EXEMPLARY) — pré-suggéré selon critères cochés
4. Écrit un feedback (min 30 caractères pour APPROVED, min 80 pour NEEDS_REVISION)
5. Pour NEEDS_REVISION : liste automatiquement les critères `REQUIRED` non cochés comme "points à corriger"
6. Soumet → système applique le résultat + notifie l'utilisateur

---

## 8. Changements schema Prisma

### Mission (champs ajoutés)
```prisma
acceptanceCriteria  Json    @default("[]")
evaluatorNotes      String?
qualityIndicators   Json    @default("[]")
```

### MissionSubmission (champs ajoutés)
```prisma
qualityLevel   String?          // STANDARD | GOOD | EXEMPLARY
revisionCount  Int    @default(0)
revisionNotes  String?           // liste des critères à corriger
reviewerType   String?           // PEER | ADMIN
```

### Nouveau modèle MissionReview
```prisma
model MissionReview {
  id            String            @id @default(cuid())
  submissionId  String
  reviewerId    String
  criteria      Json              // { criterionId: string, checked: boolean }[]
  qualityLevel  String            // STANDARD | GOOD | EXEMPLARY
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

### User (champs ajoutés)
```prisma
canReviewProfiles  String[]       @default([])
reviewsCompleted   Int            @default(0)
reviewsGiven       MissionReview[] @relation("ReviewsGiven")
```

### MissionSubmission (relation ajoutée)
```prisma
reviews  MissionReview[]
```

---

## 9. Logique métier clé (API)

### Calcul XP final
```typescript
const XP_MULTIPLIERS = { STANDARD: 1.0, GOOD: 1.25, EXEMPLARY: 1.5 }
const xpAwarded = Math.round(mission.xp * XP_MULTIPLIERS[qualityLevel])
```

### Éligibilité reviewer
```typescript
const isEligible = (reviewer, mission, submission) =>
  reviewer.id !== submission.userId &&
  mission.targetProfiles.some(p => reviewer.class?.toLowerCase() === p) &&
  reviewer.level >= (missionRequiredLevel + 1) &&
  reviewer.missionsCompletedCount >= 3
```

### Escalade après 3 révisions
```typescript
if (submission.revisionCount >= 3 && newStatus === "NEEDS_REVISION") {
  // Notifier admin, bloquer peer review, forcer révision admin
  await notifyAdmin(submission)
}
```

---

## 10. Ce qui n'est PAS dans ce scope

- Interface UI du panel reviewer (dashboard membre)
- Migration des missions existantes vers le nouveau format de briefing
- Système de badges (référencé mais implémenté séparément)
- Gamification du leaderboard reviewer
