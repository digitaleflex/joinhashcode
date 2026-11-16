# CI — contrôles de qualité

Deux workflows GitHub Actions, dans `.github/workflows/` :

| Workflow | Déclencheurs | Rôle |
|---|---|---|
| `ci.yml` — « CI — Quality gates » | chaque pull request, chaque push sur `main`, manuel | Contrôles de qualité (ci-dessous) |
| `deploy.yml` — « Build & Push image » | push sur `main`, manuel | Construit l'image Docker et la publie sur GHCR (`ghcr.io/digitaleflex/joinhashcode`). **Ne déploie pas** : le déploiement se fait sur le VPS avec `./deploy.sh --image` (voir `AGENTS.md`). |

## Job « Quality gates (PostgreSQL, tests, build, E2E) »

Il s'exécute dans un runner isolé avec une base PostgreSQL 16 temporaire. Les étapes, dans l'ordre :

1. Installer les dépendances avec le lockfile (`--frozen-lockfile`).
2. Générer le client Prisma, puis valider le schéma.
3. **Valider le contenu HEF** (`pnpm hef:validate` : 17 modules, 169 missions, quiz, slides, rubriques).
4. Appliquer les migrations sur la base vide (`scripts/ci-migrate-deploy.sh`).
5. Jouer le seed **deux fois** pour prouver qu'il est idempotent.
6. Lint (`pnpm lint`) puis TypeScript (`pnpm type-check`).
7. **Code mort** (`pnpm exec knip`) : fichiers, exports et dépendances inutilisés. *Étape ajoutée le 12/11/2026 : CLAUDE.md et AGENTS.md l'annonçaient depuis le nettoyage, mais aucun workflow ne l'appelait.*
8. Tests unitaires et d'intégration (`pnpm exec vitest run`). Contrairement à un poste de développement sans base, la CI exécute aussi `__tests__/db-connection.test.ts`.
9. Recherche de secrets dans les fichiers suivis (`pnpm check-secrets`).
10. Build de production (`pnpm build`).
11. Installer Chromium, puis jouer deux suites Playwright sur le build : la vitrine publique, et l'authentification par code à usage unique.

Un second job, **« Compose validation »**, vérifie `compose.app.yml`, `compose.app.image.yml` et `compose.db.yml` avec des variables factices.

Les identifiants de la CI sont des valeurs jetables. Le workflow ne se connecte à aucun service de production et n'utilise aucun secret de production.

## Ce que couvrent les e2e

**Vitrine publique** (`playwright.public.config.ts`, `e2e/public-site.spec.ts`) : titre et proposition de l'accueil, les trois domaines sur `/programs`, navigation de l'accueil vers un domaine, FAQ, structure des pages publiques (À propos, Labs, Communauté, Talents), menu mobile à 390 px.

**Authentification** (`playwright.auth.config.ts`, `e2e/auth-otp.spec.ts`) : un nouvel email reçoit un code, se connecte et **arrive sur l'onboarding** ; code invalide ; code expiré (aucun compte créé) ; un compte existant se reconnecte sans second profil ; les liens OAuth Google et GitHub sont initiés avec le bon callback ; parcours mobile sans débordement.

## Ce que la CI ne couvre pas

- **Le parcours de relecture par un pair** (un membre soumet, un pair à 3 labs prend en charge, relit, la soumission est validée ou à réviser) : couvert par des tests unitaires de la politique d'accès, du formulaire et de la route de prise en charge, **mais aucun e2e**. À essayer à la main avant chaque changement de ce parcours.
- Les flux authentifiés de l'Academy et des labs.
- Les contrôles d'accessibilité manuels, la revue de configuration de production et la revue de sécurité.

Une CI verte est un signal de qualité sur le code et les routes couverts ; ce n'est pas un substitut à une relecture humaine. Garder la pull request ouverte tant que les contrôles ne sont pas verts et que le diff n'a pas été relu.

## Historique des migrations

`prisma migrate deploy` est rejoué depuis une base PostgreSQL 16 vide à chaque exécution, sans exception ni `resolve` manuel. Une migration qui échoue bloque la CI. Les migrations historiques sont idempotentes (`ADD COLUMN IF NOT EXISTS`), de sorte que le même historique fonctionne sur une base vide et sur une base déjà migrée. Procédure de déploiement et de retour arrière : `DOCS/MIGRATIONS.md`.

## Reproduire les contrôles en local

```bash
export DIRECT_URL=postgresql://u:p@localhost:5432/d DATABASE_URL=$DIRECT_URL   # factice : suffit sans base
pnpm exec prisma generate
pnpm exec tsc --noEmit        # TypeScript
pnpm exec knip                # code mort : doit sortir avec le code 0
pnpm lint                     # lint
pnpm exec vitest run          # seul __tests__/db-connection.test.ts exige une vraie base
```
