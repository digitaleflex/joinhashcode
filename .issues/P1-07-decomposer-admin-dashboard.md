---
title: "[P1] Décomposer AdminDashboard (489 lignes)"
labels: ["priority: P1", "type: refactor", "area: admin"]
assignees: []
---

## Problème

`app/admin/page.tsx` fait **489 lignes** avec des requêtes inline, du rendu, des statistiques, des tableaux. Monolithe serveur impossible à tester ou décomposer.

## Action

- [ ] Extraire les sections statistiques dans des composants dédiés :
  - `components/admin/stats-overview.tsx`
  - `components/admin/recent-submissions.tsx`
  - `components/admin/user-growth.tsx`
  - `components/admin/activity-feed.tsx`
- [ ] Laisser `app/admin/page.tsx` composer ces sous-composants (< 100 lignes)

## Critères de succès

- `app/admin/page.tsx` passe sous 100 lignes
- Chaque métier a son composant testable individuellement
