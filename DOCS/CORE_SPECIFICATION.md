# CORE Decision Engine — Spécification technique

> Document de spécification du moteur de décision CORE.
> Ne fait pas partie de la vision produit — décrit uniquement les entrées, règles, algorithmes et évolutions.
>
> **Référence :** `PRODUCT_VISION.md` (constitution produit)
> **Statut :** Spécification v1 — à faire évoluer avec les retours terrain

---

## 1. Vue d'ensemble

CORE est le moteur unique qui prend en entrée l'état de l'utilisateur et retourne une **décision unique** : la prochaine meilleure étape.

Il n'y a pas de règles dispersées dans le code. Toute logique de recommandation passe par CORE.

---

## 2. Entrées

### 2.1 Données statiques (changent rarement)

| Champ | Source | Type |
|---|---|---|
| `profileType` | Quiz (résultat) | `builder \| creator \| strategist \| catalyst` |
| `scores` | Quiz | `{ builder: number, creator: number, strategist: number, catalyst: number }` |
| `technicalLevel` | Onboarding | `debutant \| intermediaire \| avance` |
| `mainObjective` | Onboarding | `find_job \| learn_code \| create_startup \| freelance \| master_ai \| cybersecurity \| cloud_devops \| create_products` |
| `specialization` | Choix utilisateur | `string` (ex: `"cybersecurite"`) |
| `vision` | Défini par l'utilisateur | `string` (cap long terme) |

### 2.2 Données dynamiques (changent à chaque action)

| Champ | Source | Type |
|---|---|---|
| `completedAteliers` | Suivi ateliers | `string[]` (ids) |
| `completedProjects` | Suivi projets | `string[]` (ids) |
| `evidences` | Validations mentor | `Evidence[]` |
| `currentGoal` | Objectif 90 jours actuel | `string` |
| `goalProgress` | Étapes validées / total | `{ done: number, total: number }` |
| `feedback` | Mentor + auto-évaluation | `{ rating: number, comment: string }[]` |
| `timeAvailable` | Défini par l'utilisateur | `{ hoursPerWeek: number, preferredFormat: "video" \| "live" \| "exercice" }` |
| `squadSize` | Squad | `number` (0-5) |
| `lastActivity` | Dernière action | `Date` |
| `currentStreak` | Check-in quotidien | `number` |

---

## 3. Règles de décision

### 3.1 Prochain atelier

```
SI aucun atelier complété
  → Premier atelier de la spécialisation choisie (step 1)
SINON SI un atelier complété et projet non commencé
  → Projet associé à l'atelier (Pratique)
SINON SI projet complété et non validé
  → Proposer soumission à un mentor (Validation)
SINON SI atelier + projet + validation ok
  → Atelier suivant (step N+1)
SINON SI tous les ateliers de l'objectif sont faits
  → Nouvel objectif (voir 3.5)
```

### 3.2 Recommandation de spécialisation

```
Entrées : scores psychométriques + mainObjective + technicalLevel

Règle :
  SI mainObjective = cybersecurity ET builderScore > 30
    → spécialisation #1 : cybersecurite (poids: 0.9)
    → spécialisation #2 : cloud (poids: 0.6)
    → spécialisation #3 : dev-secure (poids: 0.4)

  SI mainObjective = cloud_devops ET strategistScore > 30
    → spécialisation #1 : cloud (poids: 0.9)
    → spécialisation #2 : devops (poids: 0.7)
    → spécialisation #3 : cybersecurite (poids: 0.3)

  SI mainObjective = learn_code ET creatorScore > 30
    → spécialisation #1 : fullstack (poids: 0.9)
    → spécialisation #2 : mobile (poids: 0.6)
    → spécialisation #3 : ux (poids: 0.4)

  [Règle par défaut]
    → spécialisation la plus fréquente pour ce profil dans la base
```

L'utilisateur voit les 3 propositions et valide son choix. La spécialisation choisie devient la référence pour toutes les décisions suivantes.

### 3.3 Objectif 90 jours

Généré automatiquement à partir de la spécialisation choisie :

```
spécialisation = "cybersecurite"
  → goal = "Réaliser ton premier audit de sécurité"
  → why = "Parce que cette compétence est la base des métiers de la cybersécurité"
  → outcomes = [
      "Analyser une cible et cartographier ses surfaces d'attaque",
      "Identifier des vulnérabilités courantes (OWASP Top 10)",
      "Rédiger un rapport d'audit professionnel"
    ]
  → steps = [
      { weekRange: "Semaine 1",   title: "Linux pour la cybersécurité",           type: "atelier" },
      { weekRange: "Semaine 2-3", title: "OWASP Top 10",                          type: "atelier" },
      { weekRange: "Semaine 4-6", title: "Audit d'une application simple",        type: "projet"  },
      { weekRange: "Semaine 7-8", title: "Rédaction du rapport + validation",     type: "validation" },
      { weekRange: "Semaine 9-12",title: "Audit d'une application réelle",        type: "projet"  },
    ]
```

### 3.4 Mentor recommandé

```
SI niveau maturité = Learner OU Practitioner
  → Trouver un mentor disponible avec :
      - Même spécialisation
      - Niveau Mentor ou Specialist
      - Moins de 5 mentorés actifs
  → Trier par : taux de validation des mentorés > expérience

SI niveau maturité = Verified OU Specialist
  → Proposer à l'utilisateur de devenir mentor à son tour
```

### 3.5 Nouvel objectif (fin de cycle)

```
SI toutes les étapes de l'objectif 90 jours sont validées
  → Marquer l'objectif comme atteint
  → Ajouter l'evidence au portfolio
  → Proposer un nouvel objectif :
      - Même spécialisation, niveau supérieur
      - OU spécialisation complémentaire
      - OU nouvelle spécialisation
  → Augmenter le niveau de maturité (voir section 4)
```

---

## 4. Critères de progression (niveaux de maturité)

| Niveau | Condition de passage | Action CORE |
|---|---|---|
| `explorer` | État initial | — |
| `learner` | Objectif 90 jours défini | Débloquer le premier atelier |
| `practitioner` | Premier projet terminé | Débloquer les missions squad |
| `verified` | Première evidence validée | Rendre le portfolio publiable |
| `specialist` | 3+ evidences dans une spécialisation | Proposer le statut mentor |
| `mentor` | 5+ evidences + recommandation pairs | Activer les droits de validation |

### Transition Practitioner → Verified (moment clé)

```
Déclencheur : première soumission à un mentor
SI mentor valide (rating >= 3/5)
  → Evidence créée
  → Niveau → verified
  → Débloquer le portfolio
  → Notification : "Félicitations, ta première compétence est prouvée"
SINON
  → Feedback transmis à l'utilisateur
  → Proposer une révision ou un nouvel essai
```

---

## 5. Détection de blocage (remédiation)

CORE détecte les blocages et propose des actions correctives :

```
SI pas d'activité depuis 7 jours
  → Email de rappel avec la prochaine étape

SI atelier non commencé 3 jours après recommandation
  → Suggestion : atelier alternatif plus court
  → OU message au mentor pour relancer

SI projet non soumis 7 jours après début
  → Vérifier si l'utilisateur a besoin d'aide
  → Proposer une session avec le mentor

SI échec à une validation (rating < 3)
  → Proposer des ressources complémentaires
  → OU ajuster l'objectif (temporairement plus simple)
```

---

## 6. Structure des données

### 6.1 `UserState` (état complet de l'utilisateur pour CORE)

```ts
interface UserState {
  // Statique
  profileType: "builder" | "creator" | "strategist" | "catalyst"
  scores: Record<string, number>
  technicalLevel: "debutant" | "intermediaire" | "avance"
  mainObjective: string
  specialization: string | null
  vision: string | null

  // Dynamique
  maturityLevel: "explorer" | "learner" | "practitioner" | "verified" | "specialist" | "mentor"
  currentGoal: Goal90 | null
  completedAtelierIds: string[]
  completedProjectIds: string[]
  evidences: Evidence[]
  currentStreak: number
  lastActivityAt: Date | null
  squadId: string | null
  mentorId: string | null

  // Préférences
  timeAvailable: { hoursPerWeek: number; preferredFormat: string } | null
}
```

### 6.2 `CoreDecision` (sortie de CORE)

```ts
type CoreDecision = {
  type: "atelier" | "projet" | "validation" | "mentor" | "nouvel_objectif" | "remédiation"
  priority: number              // 1 = le plus urgent
  title: string
  description: string
  actionUrl: string
  reason: string                // pourquoi CORE recommande ça
  expiresAt?: Date
}
```

### 6.3 `Evidence`

```ts
interface Evidence {
  id: string
  userId: string
  competenceId: string
  competenceLabel: string
  projectId: string
  projectTitle: string
  mentorId: string
  mentorName: string
  mentorRating: number          // 1-5
  mentorFeedback: string
  validatedAt: Date
  livrableUrl?: string
}
```

---

## 7. Évolutions futures (post-MVP)

### 7.1 Pondérations adaptatives

Au lieu de règles statiques, CORE pourrait ajuster les poids des recommandations en fonction des taux de complétion de tous les utilisateurs :

```
SI 80% des utilisateurs avec specialization="cybersecurite" valident l'atelier Linux
  → Poids de l'atelier Linux augmente
SI 20% seulement valident l'atelier OWASP
  → Vérifier si l'atelier est trop difficile ou mal conçu
```

### 7.2 IA prédictive

À terme, CORE pourrait utiliser un modèle léger (ML) pour :
- Prédire la probabilité qu'un utilisateur termine un objectif
- Suggérer le moment optimal pour chaque étape
- Détecter les risques d'abandon avant qu'ils ne se produisent

### 7.3 Matching squad par CORE

Au lieu de laisser l'utilisateur chercher une squad, CORE pourrait proposer des squad basées sur :
- Complémentarité des profils (Builder + Creator + Strategist + Catalyst)
- Objectifs 90 jours alignés
- Disponibilités compatibles

---

## 8. Contrats d'interface (API CORE)

```ts
// Entrée unique
function getNextDecision(userState: UserState): CoreDecision

// Recommandation spécialisation
function recommendSpecializations(userState: UserState): Specialization[]

// Génération objectif 90 jours
function generateGoal(specialization: string, technicalLevel: string): Goal90

// Vérification progression
function checkMaturityLevel(userState: UserState): MaturityLevel

// Détection blocage
function detectBlockers(userState: UserState): Blocker | null
```

CORE est un module pur (pas d'effet de bord, pas d'appel DB). L'appelant (API route, server action, cron) est responsable de charger le `UserState` et de persister les décisions.
