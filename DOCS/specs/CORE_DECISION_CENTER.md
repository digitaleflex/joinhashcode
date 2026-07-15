# Spécification fonctionnelle — CORE Decision Center

> Module du Command Center dédié au moteur de recommandation et à la détection de blocages.
> Reflet direct de CORE_SPECIFICATION.md.

---

## 1. Vue d'ensemble

### Objectif
Visualiser et piloter le moteur CORE : comprendre pourquoi une recommandation a été faite, détecter les membres bloqués, et ajuster les règles.

### Emplacement
`/admin/core` — accessible ADMIN/MODERATOR.

### Structure
```
/admin/core
├── /dashboard          → Vue d'ensemble : stats, alertes
├── /members            → Liste des membres avec décision CORE
├── /members/:id        → Décision détaillée d'un membre
├── /blocked            → Membres bloqués + causes
├── /rules              → Règles du moteur CORE
└── /simulate           → Simulateur de décision
```

---

## 2. Nouveaux modèles

### `CoreDecision`
Stocke la dernière décision CORE pour chaque membre.

```prisma
model CoreDecision {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  // Profil calculé
  profileType     String              // builder | creator | strategist | catalyst
  specialization  String?             // spécialisation choisie
  goal90days      String?

  // Progression
  level           Int
  experience      Int
  missionsDone    Int
  ateliersDone    Int
  evidencesObtained Int

  // État
  status          String              // "active" | "stuck" | "completed" | "inactive"
  stuckReason     String?             // null si actif
  stuckSince      DateTime?

  // Recommandation courante
  nextActionType  String?             // "atelier" | "projet" | "validation" | "mentor"
  nextActionId    String?
  nextActionTitle String?
  nextActionDueAt DateTime?

  // Métriques
  healthScore     Float?              // 0–100
  engagementScore Float?              // 0–100
  daysSinceLastAction Int?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([status])
  @@index([healthScore])
  @@map("core_decision")
}
```

### `CoreRule`
Règles explicites du moteur (pas de ML au début).

```prisma
model CoreRule {
  id          String   @id @default(cuid())
  name        String
  description String
  condition   Json                 // { "field": "ateliersDone", "operator": "<", "value": 1 }
  action      Json                 // { "type": "recommend", "target": "atelier:html-css" }
  priority    Int
  enabled     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("core_rule")
}
```

---

## 3. Interface

### 3.1 Dashboard CORE (`/admin/core`)

```
┌──────────────────────────────────────────────────────────────┐
│  🧠 CORE Decision Center                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Membres suivis                       Évolution               │
│  ┌──────────────────────┐            ┌────────────────────┐ │
│  │ 245 actifs           │            │  +12 cette semaine  │ │
│  │ 18 bloqués 🔴        │            │  -3 bloqués         │ │
│  └──────────────────────┘            └────────────────────┘ │
│                                                              │
│  Health Score moyen                  Prochaine action        │
│  ┌──────────────────────┐            ┌────────────────────┐ │
│  │ 72 / 100             │            │ 142 → Atelier       │ │
│  │ ████████░░           │            │ 67 → Projet         │ │
│  └──────────────────────┘            │   9 → Mentor        │ │
│                                      └────────────────────┘ │
│                                                              │
│  ┌────── Blocages ─────────────────────────────────────────┐ │
│  │ 🔴 8 membres bloqués depuis > 7 jours                   │ │
│  │ 🔴 5 membres bloqués (aucun atelier démarré)            │ │
│  │ 🟠 3 membres bloqués (atelier non terminé)              │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Liste des membres (`/admin/core/members`)

```
┌──────┬──────────┬────────────┬──────────┬──────────┬───────────┬────────────┐
│ Mbr  │ Profil   │ Spécialis. │ Level    │ Santé    │ Prochaine │ Bloqué     │
├──────┼──────────┼────────────┼──────────┼──────────┼───────────┼────────────┤
│ #042 │ Builder  │ Fullstack  │ 2 (CORE) │ 85 🟢    │ Atelier   │ ❌         │
│ #127 │ Catalyst │ Comm.     │ 1 (INIT) │ 23 🔴    │ —         │ ✅ 12 jours│
└──────┴──────────┴────────────┴──────────┴──────────┴───────────┴────────────┘
```

Filtres : statut, profil, spécialisation, santé.
Actions : Voir → Détail → Simuler.

### 3.3 Détail membre (`/admin/core/members/:id`)

```
┌──────────────────────────────────────────────────────────────┐
│  Membre #042 — Joanice K.                                    │
│  Builder · Fullstack · Level 2 (CORE)                        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Progression                                                 │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ 85 %          │
│  3 ateliers · 2 missions · 0 evidence · 1 mentor             │
│                                                              │
│  Dernière action : 2 jours (Atelier HTML/CSS)                │
│  Prochaine action : Atelier JavaScript (semaine 2-3)         │
│                                                              │
│  ┌────── Décision CORE ────────────────────────────────────┐ │
│  │ Profil : Builder (confiance 78%)                        │ │
│  │ Spécialisation : Fullstack (choisie par l'utilisateur)  │ │
│  │ Objectif 90 jours : Construire une app web complète     │ │
│  │ Étape actuelle : Atelier JavaScript (étape 2/5)         │ │
│  │ Prochaine deadline : 5 jours                            │ │
│  │                                                         │ │
│  │ Règle appliquée : R-003 (atelier suivant = parcours +1) │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Actions : [Simuler] [Modifier recommandation] [Contacter]   │
└──────────────────────────────────────────────────────────────┘
```

### 3.4 Membres bloqués (`/admin/core/blocked`)

```
┌──────┬──────────┬─────────────┬──────────┬───────────┬──────────┐
│ Mbr  │ Bloqué   │ Cause       │ Santé    | Action     │ Priorité │
├──────┼──────────┼─────────────┼──────────┼───────────┼──────────┤
│ #127 │ 12 jours │ Aucun atel.│ 23 🔴    | [Assigner] │ 🔴       │
│ #205 │ 8 jours  │ Atel. non   │ 31 🔴   | [Relancer] │ 🔴       │
│      │          │ terminé     │          │            │          │
└──────┴──────────┴─────────────┴──────────┴───────────┴──────────┘
```

### 3.5 Règles (`/admin/core/rules`)

```
┌──────┬──────────────────┬───────────────────┬──────────┬────────┐
│ ID   │ Règle            │ Condition         │ Action   │ Activé │
├──────┼──────────────────┼───────────────────┼──────────┼────────┤
│ R-001│ Nouveau membre   │ ateliersDone = 0  │ ✅ Atelier│ ✅     │
│ R-002│ Blocage 7j       │ lastAction > 7j   │ 🔔 Notif │ ✅     │
│ R-003│ Étape suivante   │ atelierDone       │ ➡️ +1    │ ✅     │
└──────┴──────────────────┴───────────────────┴──────────┴────────┘
```

Toggle activé/désactivé. Création de nouvelle règle via formulaire.

### 3.6 Simulateur (`/admin/core/simulate`)

```
Paramètres d'entrée :
┌───────────────────────┐
│ Profil : [Builder]    │
│ Niveau : [1]          │
│ Ateliers faits : [0]  │
│ Missions faites : [0] │
│ Dernière action : [—] │
└───────────────────────┘

Résultat :
┌───────────────────────┐
│ Statut : ACTIF        │
│ Prochaine action :    │
│ Atelier HTML/CSS      │
│ Règle : R-001         │
└───────────────────────┘
```

---

## 4. API

```
GET    /api/admin/core/stats              → Dashboard stats
GET    /api/admin/core/members            → Liste + filtres
GET    /api/admin/core/members/:id        → Décision détaillée
GET    /api/admin/core/blocked            → Membres bloqués
POST   /api/admin/core/blocked/:id/assign → Assigner un mentor
GET    /api/admin/core/rules              → Liste des règles
POST   /api/admin/core/rules              → Créer une règle
PATCH  /api/admin/core/rules/:id          → Activer/désactiver
POST   /api/admin/core/simulate           → Simuler une décision
```

---

## 5. Règles CORE (v1)

| Règle | Condition | Action |
|---|---|---|
| R-001 | `ateliersDone = 0` | Recommander atelier parcours step 1 |
| R-002 | `daysSinceLastAction > 7 && status = active` | Notification de relance |
| R-003 | `atelier terminé && step < max` | Recommander atelier step + 1 |
| R-004 | `ateliersDone >= 3 && missionsDone = 0` | Recommander mission d'ancrage |
| R-005 | `ateliersDone >= 3 && evidences = 0` | Suggérer validation mentor |
| R-006 | `healthScore < 30 && daysSinceLastAction > 7` | Statut → STUCK, notifier admin |
| R-007 | `evidencesObtained >= 3` | Proposer statut mentor |

---

## 6. Priorité

| # | Fonctionnalité | Effort |
|---|---|---|
| 1 | Modèle CoreDecision + migration | 1h |
| 2 | Dashboard stats | 2h |
| 3 | Liste membres + détails | 3h |
| 4 | Vue membres bloqués | 2h |
| 5 | Simulateur | 3h |
| 6 | Règles CRUD | 2h |

**Total :** 13h + 4h tests
