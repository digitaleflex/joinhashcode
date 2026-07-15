# Spécification fonctionnelle — Knowledge Hub

> Module du Command Center dédié à la documentation interne et aux playbooks.

---

## 1. Vue d'ensemble

### Objectif
Centraliser toute la documentation HashCode (HOP, HOA, HAIOS, playbooks, RFC, templates) et la rendre consultable depuis l'interface admin.

### Emplacement
`/admin/knowledge`

---

## 2. Interface

### 2.1 Bibliothèque

```
┌──────────────────────────────────────────────────────────────┐
│  📚 Knowledge Hub                               [Recherche] │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  📂 Product                                                  │
│  ├── PRODUCT_VISION.md                                       │
│  ├── CORE_SPECIFICATION.md                                   │
│  └── COMMAND_CENTER_VISION.md                                │
│                                                              │
│  📂 Discovery                                                │
│  ├── HYPOTHESES.md                                           │
│  ├── APPRENTISSAGES.md                                       │
│  ├── DECISIONS.md                                            │
│  └── FRICTIONS.md                                            │
│                                                              │
│  📂 Specs techniques                                          │
│  ├── PRODUCT_DISCOVERY_CENTER.md                              │
│  ├── CORE_DECISION_CENTER.md                                  │
│  ├── ACADEMY_MANAGER.md                                       │
│  ├── EVIDENCE_MANAGER.md                                      │
│  ├── MENTOR_OPERATIONS.md                                     │
│  └── ANALYTICS_INSIGHTS.md                                    │
│                                                              │
│  📂 Playbooks                                                 │
│  ├── onboarding-founder-lab.md                                │
│  ├── beta-test-protocol.md                                    │
│  └── deploy-checklist.md                                      │
│                                                              │
│  📂 Standards                                                 │
│  ├── commit-conventions.md                                    │
│  ├── code-review-standards.md                                 │
│  └── security-guidelines.md                                   │
└──────────────────────────────────────────────────────────────┘
```

### 2.2 Visualisation

Un clic sur un document l'ouvre dans le panneau de droite : rendu Markown stylisé, barre de recherche interne, export PDF.

---

## 3. Note technique

Aucun modèle Prisma nécessaire. Les documents sont des fichiers `.md` lus côté serveur via `fs.readFileSync()` et rendus en HTML. Une migration vers une table `Document` pourra être faite ultérieurement si le volume le justifie.

---

## 4. API

```
GET    /api/admin/knowledge               → Arborescence
GET    /api/admin/knowledge/:path          → Contenu d'un document
GET    /api/admin/knowledge/search?q=...   → Recherche plein texte
```

---

## 5. Priorité

| # | Fonctionnalité | Effort |
|---|---|---|
| 1 | Arborescence + rendu Markdown | 2h |
| 2 | Recherche plein texte | 2h |
| 3 | Export PDF | 1h |

**Total :** 5h
