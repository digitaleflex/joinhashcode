# SEC-020 — Scan de dépendances en CI

- **Gravité** : 🔵 Faible · **Priorité** : P3 · **Statut** : 🔴 OPEN
- **Catégorie** : Vulnerable & Outdated Components (OWASP A06)

## Description

Les dépendances sont récentes et des overrides pnpm de sécurité sont présents (bon point), mais aucun **scan automatisé** continu n'est visible dans la pipeline.

## Impact

Une CVE publiée sur une dépendance peut passer inaperçue sans alerte automatique.

## Correctif recommandé

1. Activer **Dependabot** (ou Renovate) sur le dépôt.
2. Ajouter `pnpm audit --prod` (ou Snyk) en CI, bloquant sur sévérité haute/critique.
3. Revue mensuelle des overrides pnpm.

## Critères d'acceptation

- [ ] Dependabot/Renovate actif.
- [ ] `pnpm audit` (ou équivalent) en CI.
- [ ] Process de traitement des alertes documenté.
