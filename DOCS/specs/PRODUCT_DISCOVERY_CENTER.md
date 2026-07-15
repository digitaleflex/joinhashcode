# Spécification fonctionnelle — Product Discovery Center

> Module du Command Center dédié à la boucle Hypothèses → Tests → Apprentissages → Décisions.
> Reflet direct de HYPOTHESES.md, APPRENTISSAGES.md, FRICTIONS.md, DECISIONS.md.

---

## 1. Vue d'ensemble

### Objectif
Centraliser la Product Discovery dans l'interface admin. Permettre de :
- Visualiser l'état des hypothèses
- Ajouter des observations de sessions utilisateurs
- Suivre les frictions et leur résolution
- Enregistrer les décisions produit avec impact mesuré

### Emplacement
`/admin/discovery` — accessible aux rôles ADMIN et MODERATOR.

### Structure de navigation
```
/admin/discovery
├── /hypotheses
├── /sessions
├── /frictions
├── /decisions
└── /dashboard (vue d'ensemble)
```

---

## 2. Base de données

### Nouvelles tables Prisma

#### `Hypothesis`
```prisma
model Hypothesis {
  id          String   @id @default(cuid())
  code        String   @unique    // H1, H2, ...
  title       String
  description String
  category    String              // "onboarding" | "atelier" | "engagement" | "communaute"
  riskLevel   String              // "critical" | "important" | "optimization"
  status      String   @default("untested")  // untested | validated | invalidated | partial
  confidence  Int?                // 0–100
  testedCount Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  sessions    DiscoverySession[]
  decisions   ProductDecision[]

  @@index([status])
  @@index([riskLevel])
  @@map("hypothesis")
}
```

#### `DiscoverySession`
```prisma
model DiscoverySession {
  id             String   @id @default(cuid())
  hypothesisId   String
  hypothesis     Hypothesis @relation(fields: [hypothesisId], references: [id])
  userId         String?
  user           User?     @relation(fields: [userId], references: [id])
  participantAge String?
  participantCity String?
  participantRole String?
  duration       Int                  // en minutes
  modality       String               // "guide" | "libre" | "non_scenario"
  behaviors      Json?
  emotions       Json?                // { "confusion": [], "surprise": [], "hesitation": [], "satisfaction": [], "frustration": [] }
  frictions      Json?                // [{ "description": "...", "gravity": "blocker"|"significant"|"minor" }]
  quotes         String[]
  decision       String?              // texte libre : ce qui a été décidé suite à cette session
  createdBy      String?
  createdAt      DateTime @default(now())

  @@index([hypothesisId])
  @@index([createdAt])
  @@map("discovery_session")
}
```

#### `Friction`
```prisma
model Friction {
  id              String   @id @default(cuid())
  description     String
  occurrences     Int      @default(1)
  gravity         String              // "blocker" | "significant" | "minor"
  status          String   @default("active")  // active | resolved
  resolution      String?
  resolvedAt      DateTime?
  sessionId       String?
  session         DiscoverySession? @relation(fields: [sessionId], references: [id])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([status])
  @@index([gravity])
  @@map("friction")
}
```

#### `ProductDecision`
```prisma
model ProductDecision {
  id            String   @id @default(cuid())
  code          String   @unique    // D-001, D-002, ...
  title         String
  description   String
  justification String?
  hypothesisId  String?
  hypothesis    Hypothesis? @relation(fields: [hypothesisId], references: [id])
  impact        String?             // description de l'impact mesuré
  impactMetric  Float?              // valeur numérique si applicable (+18% conversion)
  responsible   String
  status        String              // "decided" | "implemented" | "rolled_back"
  implementedAt DateTime?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  @@index([status])
  @@index([hypothesisId])
  @@map("product_decision")
}
```

---

## 3. Interface

### 3.1 Dashboard vue d'ensemble (`/admin/discovery`)

```
┌──────────────────────────────────────────────────────────────┐
│  🧪 Product Discovery                           [Période]   │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Hypothèses                           Sessions utilisateurs  │
│  ┌──────────────────────┐            ┌────────────────────┐ │
│  │ 18 total │ 🟡 12     │            │  8 cette semaine   │ │
│  │          │ 🟢 4      │            │  32 total          │ │
│  │          │ 🔴 2      │            └────────────────────┘ │
│  └──────────────────────┘                                    │
│                                                              │
│  Frictions actives                   Décisions               │
│  ┌──────────────────────┐            ┌────────────────────┐ │
│  │ 7 non résolues       │            │  15 total          │ │
│  │ 3 🔴 · 2 🟠 · 2 🟡  │            │  10 implémentées   │ │
│  └──────────────────────┘            └────────────────────┘ │
│                                                              │
│  ┌────── Alertes ─────────────────────────────────────────┐  │
│  │ 🔴 2 hypothèses critiques non testées depuis > 30j    │  │
│  │ 🟠 1 friction bloquante sans résolution                │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Liste des hypothèses (`/admin/discovery/hypotheses`)

Filtres : statut, niveau de risque, catégorie.

```
┌─────┬──────────────┬──────────┬──────────┬────────┬───────────┐
│ #   │ Hypothèse    │ Risque   │ Statut   │ Tests  │ Décision  │
├─────┼──────────────┼──────────┼──────────┼────────┼───────────┤
│ H1  │ Landing <30s │ 🔴 Crit. │ 🟡 Non   │ 0      │ —         │
│ H3  │ Révélation   │ 🔴 Crit. │ 🟢 Validé │ 8      │ D-003     │
│ H9  │ Widgets      │ 🟢 Opt.  │ 🟠 Part. │ 3      │ —         │
└─────┴──────────────┴──────────┴──────────┴────────┴───────────┘
```

Actions par ligne : Voir → Modifier → Tester.
Action en haut : + Nouvelle hypothèse.

**Détail d'une hypothèse :**
- Titre + description
- Niveau de risque + statut + confiance
- Liste des sessions associées
- Décisions prises suite à cette hypothèse

### 3.3 Session utilisateur (`/admin/discovery/sessions`)

```
┌──────┬────────────┬──────────────┬──────────┬──────────┬──────────┐
│ Date │ Participant│ Hypothèse    │ Émotions │ Frictions│ Décision │
├──────┼────────────┼──────────────┼──────────┼──────────┼──────────┤
│ 15/7 │ 22 ans,   │ H3           │ 😎🙂     │ 2 (1 🔴) │ D-003    │
│      │ Abidjan    │              │          │          │          │
└──────┴────────────┴──────────────┴──────────┴──────────┴──────────┘
```

**Formulaire de création :**
- Participant (âge, ville, situation, niveau tech)
- Durée, modalité
- Comportements observés (textarea)
- Émotions (cases à cocher + zone de texte par émotion)
- Frictions (ajout dynamique : description + gravité)
- Citations textuelles
- Décision prise

### 3.4 Mur des frictions (`/admin/discovery/frictions`)

```
┌─────┬──────────────────────────────────┬──────┬────────┬───────────┐
│ #   │ Friction                         │ Occ. │ Gravité│ Résolue   │
├─────┼──────────────────────────────────┼──────┼────────┼───────────┤
│ 1   │ Ne comprend pas la spécialisation│ 6    │ 🔴     │ ❌        │
│ 2   │ Ignore le bouton Atelier         │ 4    │ 🟠     │ ✅ D-012  │
└─────┴──────────────────────────────────┴──────┴────────┴───────────┘
```

Actions : Résoudre (avec solution) / Réouvrir.

### 3.5 Registre des décisions (`/admin/discovery/decisions`)

```
┌───────┬────────────────┬───────────┬──────────┬────────┬───────────┐
│ ID    │ Décision       │ Hypothèse │ Impact   │ Statut │ Responsable│
├───────┼────────────────┼───────────┼──────────┼────────┼───────────┤
│ D-001 │ Changer Landing│ H1        │ +18% clic│ ✅ Impl│ Eurin     │
│ D-002 │ Ajouter Choix  │ H4        │ +12%     │ ✅ Impl│ Product   │
└───────┴────────────────┴───────────┴──────────┴────────┴───────────┘
```

---

## 4. API

### Endpoints REST

```
GET    /api/admin/discovery/stats                    → Vue d'ensemble
GET    /api/admin/discovery/hypotheses                → Liste + filtres
POST   /api/admin/discovery/hypotheses                → Créer une hypothèse
PATCH  /api/admin/discovery/hypotheses/:id            → Màj statut / confiance
GET    /api/admin/discovery/sessions                  → Liste des sessions
POST   /api/admin/discovery/sessions                  → Créer une session
GET    /api/admin/discovery/sessions/:id              → Détail session
GET    /api/admin/discovery/frictions                 → Liste + filtre
PATCH  /api/admin/discovery/frictions/:id             → Résoudre / réouvrir
GET    /api/admin/discovery/decisions                 → Liste
POST   /api/admin/discovery/decisions                 → Créer une décision
PATCH  /api/admin/discovery/decisions/:id             → Màj impact / statut
```

### Règles métier

- Créer une session met à jour `testedCount` et la confiance de l'hypothèse associée
- Changer le statut d'une hypothèse en 🟢 ou 🔴 met à jour `updatedAt` et log dans activity_log
- Résoudre une friction crée une notification si elle est 🔴
- Les endpoints GET supportent la pagination via cursor/limit (helper existant dans `lib/schemas/pagination.ts`)

---

## 5. Sécurité

- Tous les endpoints vérifient le rôle ADMIN ou MODERATOR via `api/admin/layout.tsx` (existant)
- Les mutations loggent une entrée `activity_log` avec l'action `ADMIN_DISCOVERY_UPDATED`
- Nouvelle action à ajouter dans `lib/activity-log.ts` : `ADMIN_DISCOVERY_UPDATED`

---

## 6. Priorité d'implémentation

| # | Fonctionnalité | Dépend de | Effort |
|---|---|---|---|
| 1 | Modèle Prisma + migration | Rien | 1h |
| 2 | API endpoints CRUD | #1 | 2h |
| 3 | Dashboard vue d'ensemble | #2 | 2h |
| 4 | Liste hypothèses + détails | #2 | 3h |
| 5 | Création de session | #1, #2 | 3h |
| 6 | Mur des frictions | #1, #2 | 2h |
| 7 | Registre des décisions | #1, #2 | 2h |

**Total estimé :** 15h (développement) + 5h (tests)
