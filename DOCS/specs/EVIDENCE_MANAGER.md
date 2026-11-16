# Spécification fonctionnelle — Evidence & Portfolio Manager

> **Statut (12/11/2026) : remplacée par une version minimale (D-030).** Les preuves sont des soumissions `APPROVED` lues par `lib/evidence.ts` et affichées sur `/u/[pseudo]` (issues #440, #455, #456), sans nouvelle table. Ne sont **pas** retenus : `Skill` / `SkillEvidence`, les niveaux Explorer → Mentor (contraires à D-029), l'export PDF et le « Locker ». Conservée pour mémoire.

> ## ⚠️ NOTE DE CADRAGE — 2026-09-16 (à lire AVANT d'implémenter)
>
> Ce spec est bon et complet. Confronté au code réel et à `PRODUCT_VISION.md`,
> **trois écarts** ont été identifiés. À trancher **avant** d'écrire la migration.

### Écart 1 — Le spec créerait un 3ᵉ système de validation

`MissionSubmission` + `MissionReview` portent **déjà 5 des 6 attributs** de l'Evidence :

| Attribut exigé par `PRODUCT_VISION.md` | Où il existe déjà |
|---|---|
| **Compétence validée** | ❌ **le seul qui manque** |
| Projet / mission réalisé | `MissionSubmission.missionId` |
| Validation du mentor (avec feedback) | `MissionSubmission.reviewerId`, `.reviewerFeedback`, `MissionReview.criteria` |
| Date de validation | `MissionReview.createdAt` |
| Lien vers le livrable | `MissionSubmission.content`, `.projectDescription` |

Le projet a **déjà 2 moteurs de mission en parallèle** et un **double-écrit** à chaque
soumission (`app/api/missions/route.ts:79` **et** `app/api/missions/[id]/attempt/submit/route.ts:169`).
Le spec tel quel en ajouterait un **troisième**.

> **Règle à graver :** l'approbation d'une mission crée l'`Evidence` **dans la même
> transaction** — un seul geste, un seul écrivain, jamais une 2ᵉ saisie manuelle.
> Ensuite l'`Evidence` devient **la seule source du portfolio**
> (*« Le portfolio = une collection d'evidences, pas une liste de projets »*).

### Écart 2 — `skill String` ne permet pas les niveaux de maturité

Le spec propose `skill String` (ex. `"html_css_responsive"`). Or la constitution exige :

- **Specialist** = « 3+ evidences **dans une spécialisation** »
- **Mentor** = « 5+ evidences + recommandation pairs »

Impossible de compter « dans une spécialisation » avec une chaîne libre.

→ Ajouter une FK vers `Specialization.specializationId` (**modèle déjà existant**).
Convention : `skill` = la compétence précise (outil / techno) ; `specializationId` = le regroupement.

### Écart 3 — Les niveaux de maturité ne sont pas modélisés

La constitution définit `Explorer → Learner → Practitioner → Verified → Specialist → Mentor`.
Aucun n'existe dans le schéma. Ce sont des niveaux **dérivés**, pas des champs :

| Niveau | Déclencheur | Source de vérité |
|---|---|---|
| Explorer | inscription | `User` existe |
| Learner | objectif 90 jours défini | à câbler |
| Practitioner | 1er projet terminé | 1 `MissionSubmission` non `PENDING` |
| **Verified** | **1ʳᵉ evidence validée** | `count(Evidence where status=approved) >= 1` |
| Specialist | 3+ evidences dans une spécialisation | `groupBy(specializationId)` |
| Mentor | 5+ + recommandation des pairs | à définir |

→ **Fonction dérivée** (`lib/maturity.ts`), pas de champ à maintenir à la main.

### Ce qui est conservé tel quel

Le modèle, les 8 routes API, la vue portfolio et l'export (PDF / lien public) sont **bons**.
Coût réel : **11 h + 4 h de tests** (estimation du spec) **+ ~3 h** pour les 3 écarts ci-dessus.

---

> Module du Command Center dédié à la validation des compétences et au portfolio des membres.

---

## 1. Vue d'ensemble

### Objectif
Gérer le cycle de vie des Evidences (atelier → projet → validation mentor → Evidence) et visualiser les portfolios.

### Emplacement
`/admin/evidences`

### Structure
```
/admin/evidences
├── /dashboard          → Stats : evidences totales, en attente, validées
├── /pending            → Evidences en attente de validation mentor
├── /all                → Toutes les evidences (filtrée par statut, membre, compétence)
├── /members/:id        → Portfolio complet d'un membre
└── /templates          → Modèles de critères d'évaluation par compétence
```

---

## 2. Nouveau modèle

```prisma
model Evidence {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])

  // Compétence visée
  skill           String              // ex: "html_css_responsive"
  skillLabel      String              // ex: "HTML/CSS Responsive"

  // Source
  sourceType      String              // "atelier" | "projet" | "mission"
  sourceId        String?
  sourceTitle     String?

  // Validation
  status          String              // "pending" | "approved" | "rejected"
  mentorId        String?
  mentor          User?    @relation("MentorEvidence", fields: [mentorId], references: [id])
  criteria        Json?               // [{ "label": "...", "validated": true }]
  mentorComment   String?
  validatedAt     DateTime?

  // Livrable
  deliverableUrl  String?
  deliverableType String?             // "github" | "figma" | "doc" | "video"

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@index([status])
  @@index([skill])
  @@index([mentorId])
  @@map("evidence")
}
```

---

## 3. Interface

### 3.1 Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  📂 Evidence & Portfolio                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Total              En attente           Validées             │
│  ┌──────────┐      ┌──────────┐        ┌──────────┐         │
│  │ 342      │      │  28 🔴   │        │ 268 🟢   │         │
│  └──────────┘      └──────────┘        └──────────┘         │
│                                                              │
│  Taux de validation : 78%                                    │
│  Délai moyen de validation : 3.2 jours                       │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Evidences en attente

```
┌──────┬────────────┬────────────────┬──────────┬──────────┬──────────┐
│ Mbr  │ Compétence │ Source         │ Attente  │ Mentor   │ Action   │
├──────┼────────────┼────────────────┼──────────┼──────────┼──────────┤
│ #042 │ HTML/CSS   │ Atelier #ac01  │ 4 jours  │ Non      │[Assigner]│
│ #127 │ API REST   │ Projet #pj03   │ 8 jours  │ Nommé    │[Valider] │
└──────┴────────────┴────────────────┴──────────┴──────────┴──────────┘
```

### 3.3 Portfolio membre

```
┌──────────────────────────────────────────────────────────────┐
│  Portfolio — Joanice K. (#042)                               │
│  Builder · Fullstack · 4 evidences                           │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  🟢 HTML/CSS Responsive     — 15/07/2026 — Mentor: José P.  │
│     Projet : Page d'accueil portfolio                        │
│     Critères : ✅ Sémantique ✅ Responsive ✅ Accessibilité  │
│     Commentaire : "Propre, bien structuré"                   │
│                                                              │
│  🟢 API REST Node.js        — 10/07/2026 — Mentor: José P.  │
│     Projet : API de gestion de tâches                        │
│     Critères : ✅ Routes ✅ Middleware ✅ Tests              │
│                                                              │
│  🟡 JavaScript (en attente) — Soumis le 12/07/2026          │
│  🔴 Docker (rejeté)         — Motif : "Manque Dockerfile"   │
│                                                              │
│  Export : [📄 PDF] [🔗 Lien public]                          │
└──────────────────────────────────────────────────────────────┘
```

---

## 4. API

```
GET    /api/admin/evidences/stats            → Dashboard
GET    /api/admin/evidences/pending          → En attente
GET    /api/admin/evidences                  → Liste complète
GET    /api/admin/evidences/:id              → Détail
PATCH  /api/admin/evidences/:id/approve      → Approuver + critères
PATCH  /api/admin/evidences/:id/reject       → Rejeter + motif
POST   /api/admin/evidences/:id/assign       → Assigner mentor
GET    /api/admin/evidences/members/:id      → Portfolio membre
```

---

## 5. Priorité

| # | Fonctionnalité | Effort |
|---|---|---|
| 1 | Modèle Evidence + migration | 1h |
| 2 | API CRUD | 2h |
| 3 | Dashboard stats | 2h |
| 4 | Liste en attente + validation | 3h |
| 5 | Portfolio membre | 3h |

**Total :** 11h + 4h tests
