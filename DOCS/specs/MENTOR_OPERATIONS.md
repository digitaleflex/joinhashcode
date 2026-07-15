# Spécification fonctionnelle — Mentor Operations

> Module du Command Center dédié à la gestion des mentors et des sessions de mentorat.

---

## 1. Vue d'ensemble

### Objectif
Recruter, suivre et évaluer les mentors. Assigner des mentorés. Suivre les sessions.

### Emplacement
`/admin/mentors`

### Structure
```
/admin/mentors
├── /dashboard          → Stats : mentors actifs, sessions, ratio mentor/mentoré
├── /mentors            → Liste des mentors + profil
├── /mentors/:id        → Détail d'un mentor (mentorés, sessions, évaluations)
├── /sessions           → Sessions de mentorat (passées, en cours, planifiées)
├── /matching           → Suggestions d'appairage CORE
└── /applications       → Candidatures mentor
```

---

## 2. Nouveaux modèles

```prisma
model Mentor {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])

  specializations String[]             // spécialisations couvertes
  bio             String?
  availability    String?              // "weekly" | "biweekly" | "monthly"
  maxMentees      Int      @default(3)
  sessionsDone    Int      @default(0)
  rating          Float?               // moyenne des évaluations
  isActive        Boolean  @default(true)
  activatedAt     DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  mentees         Mentee[]
  sessions        MentorSession[]

  @@index([isActive])
  @@index([specializations])
  @@map("mentor")
}

model Mentee {
  id              String   @id @default(cuid())
  userId          String   @unique
  user            User     @relation(fields: [userId], references: [id])
  mentorId        String
  mentor          Mentor   @relation(fields: [mentorId], references: [id])
  startedAt       DateTime @default(now())
  status          String   @default("active")  // active | completed | paused

  @@index([mentorId])
  @@map("mentee")
}

model MentorSession {
  id          String   @id @default(cuid())
  mentorId    String
  mentor      Mentor   @relation(fields: [mentorId], references: [id])
  menteeId    String
  mentee      Mentee   @relation(fields: [menteeId], references: [id])
  date        DateTime
  duration    Int?                 // minutes
  type        String               // "atelier" | "projet" | "validation" | "suivi"
  notes       String?
  rating      Int?                 // 1–5
  feedback    String?
  createdAt   DateTime @default(now())

  @@index([mentorId])
  @@index([menteeId])
  @@index([date])
  @@map("mentor_session")
}
```

---

## 3. Interface

### 3.1 Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  👨‍🏫 Mentor Operations                                         │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Mentors actifs              Mentorés                         │
│  ┌──────────────────────┐   ┌────────────────────┐          │
│  │ 12                   │   │ 31                 │          │
│  └──────────────────────┘   └────────────────────┘          │
│                                                              │
│  Ratio mentor/mentoré         Sessions cette semaine          │
│  ┌──────────────────────┐   ┌────────────────────┐          │
│  │ 1:2.6 🟢             │   │ 18                 │          │
│  └──────────────────────┘   └────────────────────┘          │
│                                                              │
│  ┌────── Alertes ──────────────────────────────────────────┐ │
│  │ 🟠 3 mentorés sans session depuis > 14 jours            │ │
│  │ 🟢 2 nouvelles candidatures mentor                      │ │
│  └─────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 3.2 Matching CORE

Suggestions automatiques basées sur : spécialisation, objectif, progression.

```
┌──────┬────────────┬────────────┬──────────────┬───────────────┐
│ Mbr  │ Profil     │ Spécialis.│ Mentor suggéré│ Compatibilité │
├──────┼────────────┼────────────┼──────────────┼───────────────┤
│ #042 │ Builder    │ Fullstack  │ José P.      │ 92% 🟢        │
│ #127 │ Catalyst   │ Comm.     │ Daniella M.  │ 78% 🟢        │
└──────┴────────────┴────────────┴──────────────┴───────────────┘
```

---

## 4. API

```
GET    /api/admin/mentors/stats          → Dashboard
GET    /api/admin/mentors                → Liste
GET    /api/admin/mentors/:id            → Détail
PATCH  /api/admin/mentors/:id/activate   → Activer/désactiver
GET    /api/admin/mentors/sessions       → Sessions
GET    /api/admin/mentors/matching       → Suggestions CORE
POST   /api/admin/mentors/assign         → Assigner mentoré
GET    /api/admin/mentors/applications   → Candidatures
POST   /api/admin/mentors/applications/:id/approve
POST   /api/admin/mentors/applications/:id/reject
```

---

## 5. Priorité

| # | Fonctionnalité | Effort |
|---|---|---|
| 1 | Modèles + migration (3 tables) | 2h |
| 2 | API mentors CRUD | 2h |
| 3 | Dashboard stats | 2h |
| 4 | Matching CORE | 3h |
| 5 | Sessions + suivi | 3h |

**Total :** 12h + 4h tests
