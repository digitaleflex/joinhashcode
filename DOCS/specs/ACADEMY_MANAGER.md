# Spécification fonctionnelle — Academy Manager

> **Statut (12/11/2026) : non implémentée et hors périmètre (D-030).** Cette spécification décrit un module du futur « Command Center » ; aucune implémentation n'est prévue pendant l'engagement de 90 jours (`DOCS/PRODUCT_VISION.md`). Conservée pour mémoire.

> Module du Command Center dédié au catalogue d'ateliers et à la gestion des parcours pédagogiques.

---

## 1. Vue d'ensemble

### Objectif
Gérer le catalogue d'ateliers, suivre les taux de complétion, et optimiser les parcours pédagogiques.

### Emplacement
`/admin/academy`

### Structure
```
/admin/academy
├── /ateliers          → Catalogue + stats par atelier
├── /ateliers/:id      → Détail atelier (stats, feedback)
├── /parcours          → Définition des parcours par spécialisation
├── /parcours/:id      → Vue d'un parcours (arbre des étapes)
└── /analytics         → Taux de complétion, abandon par étape
```

---

## 2. Interface

### 2.1 Catalogue ateliers

```
┌──────┬──────────────────────────┬──────────┬──────┬──────────┬────────────┐
│ ID   │ Titre                    │ Spécial. │ Durée│ Taux compl│ Abandon    │
├──────┼──────────────────────────┼──────────┼──────┼──────────┼────────────┤
│ ac01 │ HTML/CSS — Page resp.   │ Fullstack│ 45m  │ 78% 🟢   │ 12% 🟢    │
│ ac02 │ Linux pour le cloud     │ Cloud    │ 45m  │ 45% 🟠   │ 35% 🔴    │
│ ac03 │ Principes SOLID         │ Archi.   │ 45m  │ 22% 🔴   │ 60% 🔴    │
└──────┴──────────────────────────┴──────────┴──────┴──────────┴────────────┘
```

Filtres : spécialisation, format, statut.
Actions : Voir → Modifier → Archiver.

### 2.2 Détail atelier

```
┌──────────────────────────────────────────────────────────────┐
│  Atelier : HTML/CSS — Page responsive                        │
│  Spécialisation : Fullstack · Étape 1/5 · Durée : 45 min    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Stats                                                        │
│  142 lancés · 110 terminés (78%) · 17 abandons (12%)        │
│  Temps moyen : 52 min                                        │
│                                                              │
│  ┌────── Feedback ──────────────────────────────────────────┐ │
│  │ ⭐ 4.2 / 5 (32 avis)                                    │ │
│  │ "Trop long pour un débutant" × 3                        │ │
│  │ "Manque d'exercices pratiques" × 5                      │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                              │
│  Contenu                                                      │
│  [Voir le contenu] [Modifier] [Remplacer vidéo]              │
└──────────────────────────────────────────────────────────────┘
```

### 2.3 Parcours par spécialisation

Vue arborescente d'un parcours complet :

```
Fullstack (5 étapes)
├── 🟢 Étape 1 : HTML/CSS — Page responsive (78% complétion)
├── 🟡 Étape 2 : JavaScript — premiers pas (62% complétion)
├── 🟡 Étape 3 : Créer une API avec Node.js (45% complétion)
├── 🔴 Étape 4 : Projet fullstack (22% complétion)
└── 🔴 Étape 5 : Déploiement + revue mentor (8% complétion)
```

Les couleurs indiquent la santé de l'étape. Un clic ouvre le détail.

---

## 3. API

```
GET    /api/admin/academy/stats           → Vue d'ensemble
GET    /api/admin/academy/ateliers        → Catalogue + filtres
GET    /api/admin/academy/ateliers/:id    → Détail + stats + feedback
PATCH  /api/admin/academy/ateliers/:id    → Modifier contenu/métadonnées
GET    /api/admin/academy/parcours        → Liste des parcours
GET    /api/admin/academy/parcours/:id    → Arbre d'un parcours
PUT    /api/admin/academy/parcours/:id    → Réordonner les étapes
```

---

## 4. Priorité

| # | Fonctionnalité | Effort |
|---|---|---|
| 1 | Catalogue ateliers + filtres | 2h |
| 2 | Détail atelier + stats | 2h |
| 3 | Vue parcours par spécialisation | 3h |
| 4 | Analytics (taux complétion, abandon) | 3h |

**Total :** 10h + 3h tests
