# SEC-018 — Pas de politique de rétention des données

- **Gravité** : 🔵 Faible · **Priorité** : P3 · **Statut** : 🔴 OPEN
- **Catégorie** : Protection des données (RGPD)
- **Concerne** : `ActivityLog`, `dailyCheckin`, `contactMessage`, notifications

## Description

Aucune politique de rétention/purge visible. Les journaux append-only et messages de contact sont conservés indéfiniment, ce qui va à l'encontre du principe de minimisation RGPD.

## Impact

Accumulation de données personnelles ; surface de fuite accrue ; non-conformité RGPD (limitation de conservation).

## Correctif recommandé

1. Définir des durées de rétention par type de donnée (ex. logs 12 mois, contact 24 mois).
2. Cron de purge périodique (`deleteMany` sur `createdAt < cutoff`).
3. Documenter la politique dans une page « Confidentialité ».

## Critères d'acceptation

- [ ] Durées de rétention définies et documentées.
- [ ] Cron de purge en place.
- [ ] Politique de confidentialité mentionnant la rétention.
