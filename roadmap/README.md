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
| [P10-better-auth-social-providers.md](./P10-better-auth-social-providers.md) | 🟡 Haute | ~1h | UX — Onboarding facilité |
| [P11-better-auth-passkeys.md](./P11-better-auth-passkeys.md) | 🔵 Moyenne | ~1h | Innovation — Login futuriste sans mot de passe |
| [P12-better-auth-multi-session.md](./P12-better-auth-multi-session.md) | 🟢 Basse | ~1h30 | Sécurité — Contrôle des sessions actives |
| [P13-better-auth-admin-impersonation.md](./P13-better-auth-admin-impersonation.md) | 🔵 Moyenne | ~1h | Support — Debugging efficace pour l'admin |
| [P14-better-auth-squad-rbac.md](./P14-better-auth-squad-rbac.md) | 🔵 Moyenne | ~2h | Collaboration — Rôles dynamiques en escouade |
| [P15-better-auth-stripe-integration.md](./P15-better-auth-stripe-integration.md) | 🟢 Basse | ~3h | Monétisation — Accès Premium natif |
| [P16-feedback-v2.md](./P16-feedback-v2.md) | 🔴 Critique | ~1h | Produit — Comprendre les blocages UX |
| [P17-referral-system.md](./P17-referral-system.md) | 🟡 Haute | ~3h | Croissance — Acquisition organique via parrainage |
| [P18-post-quiz-survey.md](./P18-post-quiz-survey.md) | 🔵 Moyenne | ~1h | Validation — Mesurer la pertinence du diagnostic |
| [P19-social-sharing.md](./P19-social-sharing.md) | 🟡 Haute | ~2h | Viralité — Partage des résultats sur LinkedIn/X |
| [P20-ux-research-poll.md](./P20-ux-research-poll.md) | 🟢 Basse | ~1h | Recherche — Valider l'esthétique du projet |

---

## Ordre d'implémentation recommandé

```
Semaine 1 → P1 + P2 + P3 + P16     (Corrections critiques & Feedback)
Semaine 2 → P4 + P5 + P6 + P19     (UX & Viralité Sociale)
Semaine 3 → P7 + P8 + P11 + P18    (Navigation & Validation Quiz)
Semaine 4 → P13 + P14 + P17        (Admin, Squads & Parrainage)
Semaine 5 → P9 + P12 + P15 + P20   (Rétention, Sécurité & Recherche UX)
```

## Stack technique de référence
- Next.js 15 App Router
- Prisma 7 + PostgreSQL (Supabase)
- TailwindCSS v4 + shadcn/ui
- Better Auth (sessions)
- QStash (crons)
- Framer Motion
- `pnpm` comme package manager
