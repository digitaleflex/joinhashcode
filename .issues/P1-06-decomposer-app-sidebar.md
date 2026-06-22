---
title: "[P1] Décomposer AppSidebar (361 lignes)"
labels: ["priority: P1", "type: refactor", "area: ui"]
assignees: []
---

## Problème

`components/dashboard/app-sidebar.tsx` fait **361 lignes** et mélange :

- Logique de navigation
- Affichage des données utilisateur
- Feature flags
- Dialogues (checkin, feedback, etc.)
- Gestion d'état auth
- Notifications

C'est une violation du **Single Responsibility Principle**. Tout changement de navigation casse potentiellement l'app.

## Action

- [ ] Extraire la logique de navigation dans `components/dashboard/sidebar-nav.tsx`
- [ ] Extraire les dialogues dans `components/dashboard/sidebar-dialogs.tsx`
- [ ] Extraire le header utilisateur dans `components/dashboard/sidebar-user.tsx`
- [ ] Laisser `app-sidebar.tsx` comme simple orchestrateur (< 80 lignes)

## Critères de succès

- Chaque sous-composant a une responsabilité unique
- `app-sidebar.tsx` fait moins de 100 lignes
- Aucune régression UI
