# Spécification fonctionnelle — Evidence & Portfolio Manager

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
