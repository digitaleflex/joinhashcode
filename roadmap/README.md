# HASHCODE — Roadmap Missions

Chaque fichier de ce dossier correspond à une priorité d'implémentation.
Le dev implémente, le lead vérifie et corrige avant merge.

---

## Table des priorités

| Fichier | Priorité | Effort | Impact |
|---|---|---|---|
| [P1-seed-missions-db.md](./P1-seed-missions-db.md) | 🔴 Critique | ~2h | Bloquant — sans ça les missions n'existent pas en prod |
| [P2-masquer-coming-soon.md](./P2-masquer-coming-soon.md) | 🔴 Critique | ~1h | UX — liste épurée, fini le bruit |
| [P3-cron-claim-timeout.md](./P3-cron-claim-timeout.md) | 🔴 Critique | ~2h | Fiabilité — plus de soumissions bloquées |
| [P4-timeline-soumission.md](./P4-timeline-soumission.md) | 🟡 Important | ~3h | Transparence — l'utilisateur sait où en est sa mission |
| [P5-social-proof-cartes.md](./P5-social-proof-cartes.md) | 🟡 Important | ~2h | Engagement — preuve sociale sur chaque carte |
| [P6-retrospective-optionnelle.md](./P6-retrospective-optionnelle.md) | 🟡 Important | ~1h | UX — supprime la friction post-soumission |
| [P7-briefing-slideover.md](./P7-briefing-slideover.md) | 🟢 Amélioration | ~3h | UX — lecture rapide sans changer de page |
| [P8-progression-init-core-pro.md](./P8-progression-init-core-pro.md) | 🟢 Amélioration | ~2h | Clarté — l'utilisateur comprend son parcours |
| [P9-missions-quotidiennes.md](./P9-missions-quotidiennes.md) | 🟢 Long terme | ~6h | Rétention — raison de revenir chaque semaine |

---

## Ordre d'implémentation recommandé

```
Semaine 1 → P1 + P2 + P3   (corrections critiques, déployer ensemble)
Semaine 2 → P4 + P5 + P6   (améliorations UX visibles)
Semaine 3 → P7 + P8         (refonte navigation)
Semaine 4 → P9              (nouvelle feature)
```

## Stack technique de référence
- Next.js 15 App Router
- Prisma 7 + PostgreSQL (Supabase)
- TailwindCSS v4 + shadcn/ui
- Better Auth (sessions)
- QStash (crons)
- Framer Motion
- `pnpm` comme package manager
