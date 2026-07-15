# Spécification fonctionnelle — Analytics & Insights

> Module du Command Center dédié aux métriques produit, cohortes, entonnoir de conversion et rapports.

---

## 1. Vue d'ensemble

### Objectif
Mesurer l'impact de chaque décision produit via des KPI clairs. Visualiser l'entonnoir de conversion, la rétention, et la santé des cohortes.

### Emplacement
`/admin/analytics`

### Structure
```
/admin/analytics
├── /overview          → KPI principaux + tendances
├── /funnel            → Entonnoir de conversion (Landing → Evidence)
├── /cohorts           → Analyse par cohorte d'inscription
├── /retention         → Courbe de rétention
├── /reports           → Rapports exportables
└── /events            → Timeline des événements produit
```

---

## 2. Interface

### 2.1 Overview

```
┌──────────────────────────────────────────────────────────────┐
│  📈 Analytics & Insights                                     │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Membres  │ │ Actifs/  │ │ TTV      │ │ Rétention│        │
│  │ 342      │ │ semaine  │ │ 4.2 min  │ │ J+7     │        │
│  │ +12%   🟢│ │ 58%    🟢│ │ 🟢      │ │ 43%   🟠│        │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘        │
│                                                              │
│  ┌────── Entonnoir de conversion ───────────────────────────┐ │
│  │ Landing    ── 100%                                      │ │
│  │    ↓                                                     │ │
│  │ Quiz       ── 72% (228/342)                             │ │
│  │    ↓                                                     │ │
│  │ Choix      ── 62% (212/342)                             │ │
│  │    ↓                                                     │ │
│  │ Orientation ── 58% (198/342)                             │ │
│  │    ↓                                                     │ │
│  │ Atelier 1  ── 41% (140/342)                             │ │
│  │    ↓                                                     │ │
│  │ Evidence   ── 12% (41/342)                              │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Entonnoir détaillé

Chaque étape de l'entonnoir est cliquable et affiche :
- Taux de conversion absolu et relatif
- Comparaison avec la période précédente
- Délai moyen entre les étapes
- Segment qui décroche le plus (par profil, spécialisation, pays)

### 2.3 Cohortes

```
┌────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐
│ Cohorte    │ Membres  │ J+7      │ J+30     │ Evidence │ Santé    │
├────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤
│ Juin 2026  │ 45       │ 42%      │ 28%      │ 11%      │ 72 🟢    │
│ Mai 2026   │ 38       │ 38%      │ 22%      │ 8%       │ 65 🟢    │
│ Avr. 2026  │ 52       │ 28%      │ 15%      │ 4%       │ 48 🟠    │
└────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘
```

### 2.4 Rétention

Courbe de rétention sur 7, 30, 90 jours.
Filtrable par : profil, spécialisation, pays, source d'acquisition.

### 2.5 Rapports exportables

- Rapport mensuel automatique (PDF)
- Export CSV des KPI
- Snapshots comparatifs (avant/après une décision)

---

## 3. API

```
GET    /api/admin/analytics/overview          → KPI principaux
GET    /api/admin/analytics/funnel            → Entonnoir
GET    /api/admin/analytics/cohorts           → Cohortes
GET    /api/admin/analytics/retention         → Rétention
GET    /api/admin/analytics/reports           → Rapports disponibles
POST   /api/admin/analytics/reports/generate  → Générer un rapport
```

---

## 4. Remarque technique

Les données analytics sont agrégées à partir des tables existantes :
- `User.createdAt` → cohortes
- `QuizResult` → complétion quiz
- `CoreDecision` → progression
- `Evidence` → validation
- `DailyCheckin` → rétention
- `ActivityLog` → événements

Aucun nouveau modèle nécessaire dans un premier temps.

---

## 5. Priorité

| # | Fonctionnalité | Effort |
|---|---|---|
| 1 | Entonnoir de conversion | 3h |
| 2 | KPI overview | 2h |
| 3 | Cohortes | 3h |
| 4 | Rétention | 2h |
| 5 | Rapports exportables | 3h |

**Total :** 13h + 4h tests
