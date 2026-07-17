# Rapport d'Audit HashCode

**Date** : 15 juillet 2026  
**Projet** : HashCode (hashcode-community)  
**Version auditée** : 2.6.3  
**Objectif** : Nettoyer, simplifier, aligner et stabiliser la plateforme avant un lancement majeur.  
**Méthode** : Analyse statique (knip, tsc, eslint, vitest), revue de code manuelle des fichiers critiques, évaluation par dimension (architecture, code, UX, UI, performance, sécurité, accessibilité, produit, dette, overengineering).

---

## Résumé exécutif

HashCode est un projet ambitieux avec une base technique solide : Next.js 16 App Router, Better Auth, Prisma/PostgreSQL, Tailwind v4, shadcn/ui. Le produit a une vision claire et une recente pivot vers une promesse de transformation utilisateur. Cependant, l'audit révèle une codebase significativement gonflée par des fonctionnalités non utilisées, une accumulation de warnings, des choix de modèle de données surchargés, et un héritage visuel cyberpunk qui n'est pas entièrement purgé. Le risque principal est la lenteur et la fragilité du développement futur, pas une faille de sécurité critique ou un produit inutilisable.

**Verdict** : Le produit est viable mais **non prêt pour un lancement large**. Un nettoyage de 4 à 6 semaines est recommandé pour atteindre un niveau de qualité comparable aux références mentionnées (Stripe, Linear, Notion, Vercel, GitHub, Apple).

---

## Score global

| Dimension | Score /100 | Justification |
|-----------|------------|---------------|
| **Architecture** | 62 | Structure globalement correcte, mais couplage fort autour du modèle `User`, abstractions parfois superflues, et séparation client/serveur à consolider. |
| **Code Quality** | 48 | 466 warnings ESLint, nombreuses dépendances inutilisées, typage faible (`any`), 1 test échoué. |
| **UX** | 58 | Parcours principaux (onboarding, quiz, dashboard) cohérents, mais distractions visuelles, appels à l'action multiples, et confusion rôle/feature. |
| **UI** | 55 | Système de composants bien fourni, mais incohérences visuelles, héritage cyberpunk, et 54 composants UI pour une taille de projet encore précoce. |
| **Performance** | 52 | Bundle potentiellement lourd, absence de lazy loading visible, 1.6 Go de node_modules, layout global chargé partout. |
| **Sécurité** | 64 | Bonnes pratiques de base (cookies httpOnly, HSTS, CSP implicite, rate limiting), mais bugs middleware, `any` dans auth, validation inégale. |
| **Accessibilité** | 54 | Composants Radix fournissent une base, mais aucun audit automatique, contrastes non vérifiés, balises sémantiques à renforcer. |
| **Produit** | 60 | Vision claire, mais plusieurs fonctionnalités ne sont pas prouvées par des tests utilisateurs et alourdissent le scope. |
| **Maintenabilité** | 50 | Beaucoup de fichiers, duplication métier, dead code, templates email redondants. |
| **Dette Technique** | 45 | Quick wins existants, mais dette moyenne et critique accumulée sur le modèle utilisateur et les types. |
| **Overengineering** | 42 | Plusieurs systèmes résolvent des problèmes hypothétiques ou sont simplement non branchés. |

**Score global** : **54 / 100**

---

## Top 20 des problèmes critiques

1. **Modèle `User` monolithique** (`prisma/schema.prisma`). 50+ champs, mélange identité, profil, géolocalisation, consentement, sécurité, progression. Risque : couplage extrême, migrations difficiles, lecture/écriture coûteuses.
2. **466 warnings ESLint**, principalement `no-explicit-any`. Le typage n'est pas un outil de confiance.
3. **Dépendances inutilisées en production** : `@better-auth/passkey`, `@fingerprintjs/fingerprintjs`, `@radix-ui/react-aspect-ratio`, `embla-carousel-react`, `vaul`, `zustand`, `react-day-picker`, etc. Cela allonge le bundle, les temps d'install et la surface d'attaque.
4. **Test `__tests__/notifications-api.test.ts` échoue**. La route retourne 500 au lieu de 401 quand la DB n'est pas disponible. Cela masque potentiellement une mauvaise gestion d'erreur.
5. **Middleware `middleware.ts` : bug en mode maintenance**. Les routes `/signin` et `/feedback` retournent un `NextResponse.json` 503 au lieu d'être redirigées vers `/maintenance`, ce qui casse le flux de connexion.
6. **`as any` explicite dans `lib/auth.ts`** pour le plugin `organization`. Cela désactive le typage sur les rôles et permissions.
7. **Layout global surchargé** (`app/layout.tsx`). `Noise`, `UXPollBanner`, `FloatingFeedbackButton`, `NextTopLoader`, `CookieBanner`, `ServiceWorkerRegister`, `AuthErrorToast`, `ImpersonationBanner` sont injectés sur chaque page. Cela crée de la distraction et des conflits.
8. **Aucun lazy loading** repéré dans les composants lourds (quiz, dashboard, landing). Risque de Time-to-Interactive élevé.
9. **Dead code et composants fantômes** : `Noise`, `UXPollBanner`, `FloatingFeedbackButton`, `CookieBanner`, `AuthErrorToast`, `ServiceWorkerRegister` — leur valeur réelle est à prouver.
10. **29 templates email** pour un produit en phase de découverte. Maintenance lourde, risque d'incohérence de ton.
11. **Double modèle de progression** : `User` a `level`, `experience`, `missionsCompletedCount` ET `UserProgress` avec les mêmes champs. Risque de divergence.
12. **Géolocalisation complexe** : `latitude`, `longitude`, `locationAccuracy`, `locationUpdatedAt`, `ipCountry`, `consentLocation`, `UserLocation`. Si le feature est secondaire, c'est du bruit.
13. **VisitorId / fingerprinting** (`@fingerprintjs/fingerprintjs`, `visitorId`) présent mais non branché visiblement.
14. **Passkey** (`@better-auth/passkey`) installé mais non utilisé.
15. **Pas de validation d'inputs unifiée** : certains endpoints utilisent Zod, d'autres non ; absence de schémas communs.
16. **Absence de Content-Security-Policy explicite** dans `next.config.mjs`.
17. **`lib/types.ts` contient de nombreux `any`** et des types génériques mal définis. Cela réduit la sûreté du code.
18. **Système de Guildes vs Squads (Organizations)**. Deux concepts de communauté existent (`Guild` et `Organization` Better Auth). Risque de confusion produit.
19. **Trop de routes API** (56) pour le stade de maturité. Beaucoup d'opportunités de consolidation.
20. **Absence de tests d'accessibilité** (axe, Lighthouse) et de tests E2E complets sur les parcours critiques (onboarding, quiz, paiement).

---

## Top 20 des Quick Wins

1. **Supprimer les dépendances inutilisées** identifiées par knip.
2. **Corriger le test `notifications-api.test.ts`** ou la route associée.
3. **Corriger le bug maintenance mode** dans `middleware.ts`.
4. **Remplacer `as any` dans `lib/auth.ts`** par un typage correct ou un cast justifié.
5. **Supprimer `Noise`, `UXPollBanner`, `FloatingFeedbackButton` du layout** si non essentiels à la mission.
6. **Réduire les templates email** à 5-6 templates essentiels.
7. **Activer `eslint-plugin-unused-imports`** et fixer les imports morts.
8. **Ajouter une CSP** dans `next.config.mjs`.
9. **Nettoyer les champs géolocalisation** du modèle `User` si le feature n'est pas actif.
10. **Dédoublonner `User.level/experience` et `UserProgress`**.
11. **Supprimer `@fingerprintjs/fingerprintjs` et `@better-auth/passkey`** si non utilisés.
12. **Ajouter `React.Suspense` + lazy loading** sur les pages quiz et dashboard.
13. **Réduire le nombre de variables globales** dans `globals.css` si inutilisées.
14. **Consolider les helpers de dates** (`date-fns` + native + `Intl`) en un seul point.
15. **Supprimer `react-confetti` et `driver.js`** si ce sont des distorsions.
16. **Lancer un audit Lighthouse** et corriger les scores basiques.
17. **Supprimer les composants UI non utilisés** parmi les 54 shadcn/ui.
18. **Rendre `CookieBanner` inerte si RGPD/France simplifiée** ou le simplifier drastiquement.
19. **Créer un `lib/validation.ts`** avec les schémas Zod partagés.
20. **Documenter les règles de middleware** et les tests associés.

---

## Fonctionnalités à supprimer

| Fonctionnalité | Localisation | Risque | Action |
|----------------|--------------|--------|--------|
| Passkey | `@better-auth/passkey` dans `package.json` | 🔴 | Supprimer. Non branché. |
| Fingerprinting visiteur | `visitorId`, `@fingerprintjs/fingerprintjs` | 🔴 | Supprimer. Non utilisé et question éthique. |
| Localisation précise | `User.latitude`, `longitude`, `locationAccuracy`, `UserLocation` | 🟠 | Supprimer ou reporter. Aucun use case visible. |
| UXPollBanner | `components/ui/ux-poll-banner.tsx` | 🟡 | Supprimer. Distraction au lancement. |
| FloatingFeedbackButton | `components/ui/floating-feedback-button.tsx` | 🟡 | Supprimer. Page `/feedback` suffit. |
| Tour driver.js | `driver.js` dans `package.json` | 🟡 | Supprimer. Pas de preuve d'utilisation. |
| Confetti | `react-confetti` | 🟢 | Supprimer. Distraction. |
| Trop de templates email | `lib/email-templates/` | 🟠 | Réduire à 6 templates. |
| Guilds (vs Squads) | `model Guild` | 🟠 | Fusionner ou clarifier avec `Organization`. |
| Double système de progression | `User.level/experience` + `UserProgress` | 🟡 | Consolidation. |

---

## Composants à supprimer ou simplifier

| Composant | Raison | Action |
|-----------|--------|--------|
| `Noise` | Effet visuel cyberpunk, héritage non aligné | Supprimer |
| `UXPollBanner` | Distraction, pas de priorité produit | Supprimer |
| `FloatingFeedbackButton` | Doublon avec page `/feedback` | Supprimer |
| `CookieBanner` | Complexité si non auditée juridiquement | Simplifier ou supprimer temporairement |
| `AuthErrorToast` | Peut être géré par `sonner` + URL params | Simplifier |
| `ServiceWorkerRegister` | Pas de preuve de SW | Vérifier / supprimer |
| `ImpersonationBanner` | Utile admin, mais pas en layout global | Rendre conditionnel |
| `NextTopLoader` | OK, mais couleur cyberpunk à vérifier | Garder, harmoniser couleur |

---

## Code mort

D'après `knip` et la revue manuelle :

- `lib/location.ts` : purgeOldLocations seul reste, probablement des helpers morts.
- `lib/email.ts` : `sendSquadInvitationEmail` appelé par `app/api/squad/invite/route.ts` mais peut-être pas de front-end.
- `@better-auth/passkey` : non importé nulle part.
- `@fingerprintjs/fingerprintjs` : non importé nulle part.
- `zustand` : non importé nulle part.
- `vaul` : non importé nulle part.
- `embla-carousel-react` : non importé nulle part.
- `react-day-picker` : non importé nulle part.
- `@radix-ui/react-aspect-ratio` : non importé nulle part.
- `@radix-ui/react-collapsible` : non importé nulle part.
- `@radix-ui/react-context-menu` : non importé nulle part.
- `better-call` : non importé nulle part.
- Plusieurs composants UI shadcn sont probablement installés mais jamais utilisés.

**Action** : lancer `knip --fix` avec précaution ou supprimer manuellement les éléments confirmés.

---

## Refactorings prioritaires

### 1. Refonte du modèle `User`

**Problème** : `User` contient identité, profil, progression, sécurité, géolocalisation, consentement, statistiques.

**Recommandation** : Extraire en tables séparées :
- `UserProfile` (bio, objectifs, situation, focus, blocker)
- `UserProgress` (déjà existant, mais à utiliser comme source unique)
- `UserSecurity` (déjà existant, activer)
- `UserConsent` (RGPD/tracking)
- `UserLocation` (déjà existant, reporter si inutile)

**Impact** : Réduction du couplage, meilleure lecture, migrations plus sûres.

**Risque** : 🟠 (touches à l'auth et au middleware)

### 2. Unified validation layer

**Problème** : Schémas Zod dispersés, certains endpoints sans validation.

**Recommandation** : Créer `lib/validation/` avec les schémas métier partagés : onboarding, quiz, squad, feedback, etc.

**Impact** : Moins de bugs, sécurité renforcée, tests plus simples.

**Risque** : 🟡

### 3. Consolidation des composants UI

**Problème** : 54 composants UI shadcn et 29 dashboard components.

**Recommandation** : Auditer chaque composant UI et ne garder que ceux réellement utilisés. Créer une `components/ui/index.ts` d'export si nécessaire.

**Impact** : Bundle plus léger, moins de confusion.

**Risque** : 🟢

### 4. Email templates rationalisation

**Problème** : 29 templates.

**Recommandation** : Conserver : welcome, magic-link, OTP, orientation, mission-approved, feedback-confirmation, admin-alert. Migrer les autres vers un système de variables.

**Impact** : Maintenance, cohérence de ton.

**Risque** : 🟢

### 5. Simplification du layout global

**Problème** : Trop de providers/global UI dans `app/layout.tsx`.

**Recommandation** : Déplacer `ImpersonationBanner` dans le layout admin, `UXPollBanner` et `FloatingFeedbackButton` dans une page ou un feature flag, `CookieBanner` simplifié.

**Impact** : Pages plus rapides, moins de bruit visuel.

**Risque** : 🟢

### 6. Lazy loading et bundle split

**Problème** : Pas de lazy loading.

**Recommandation** : Envelopper quiz, dashboard, settings, admin dans `dynamic()` ou `Suspense`.

**Impact** : First load JS réduit.

**Risque** : 🟡

### 7. Type safety

**Problème** : `any` partout.

**Recommandation** : Éliminer progressivement les `any` dans `lib/types.ts`, `lib/auth.ts`, `middleware.ts`.

**Impact** : Moins de bugs runtime, meilleure DX.

**Risque** : 🟠

---

## Plan de nettoyage

### Sprint 1 — Stabilité et tests (1 semaine)

| ID | Description | Pourquoi | Impact | Temps estimé | Risque | Fichiers concernés |
|----|-------------|----------|--------|--------------|--------|-------------------|
| S1-1 | Corriger `__tests__/notifications-api.test.ts` | Éviter le faux 500, garantir auth | Sécurité, CI | 2h | 🟢 | `app/api/user/notifications/route.ts` |
| S1-2 | Corriger le bug maintenance mode | `/signin` et `/feedback` redirigées correctement | UX, sécurité | 2h | 🟢 | `middleware.ts` |
| S1-3 | Supprimer 10 dépendances inutilisées | Réduire bundle/node_modules | Perf, maintenance | 4h | 🟢 | `package.json` |
| S1-4 | Fixer imports inutilisés et dead code léger | Nettoyer codebase | Code quality | 4h | 🟢 | multiples |
| S1-5 | Remplacer `as any` dans `lib/auth.ts` organization | Type safety | Maintenabilité | 3h | 🟡 | `lib/auth.ts` |

### Sprint 2 — Simplification UI/UX (1 semaine)

| ID | Description | Pourquoi | Impact | Temps estimé | Risque | Fichiers concernés |
|----|-------------|----------|--------|--------------|--------|-------------------|
| S2-1 | Supprimer `Noise`, `UXPollBanner`, `FloatingFeedbackButton` du layout | Réduire distractions | UX, perf | 4h | 🟢 | `app/layout.tsx`, composants |
| S2-2 | Simplifier ou supprimer `CookieBanner` | Réduire friction | UX | 2h | 🟢 | `components/ui/cookie-banner.tsx` |
| S2-3 | Rendre `ImpersonationBanner` conditionnel admin | Pas de bannière inutile | UX | 2h | 🟢 | `components/admin/ImpersonationBanner.tsx`, layout |
| S2-4 | Réduire templates email à 6-8 essentiels | Cohérence, maintenance | Produit | 6h | 🟢 | `lib/email-templates/` |
| S2-5 | Supprimer `react-confetti` et `driver.js` | Éliminer distorsions | UX, perf | 2h | 🟢 | `package.json`, composants |

### Sprint 3 — Modèle de données et métier (1.5 semaine)

| ID | Description | Pourquoi | Impact | Temps estimé | Risque | Fichiers concernés |
|----|-------------|----------|--------|--------------|--------|-------------------|
| S3-1 | Dédoublonner `User` vs `UserProgress` | Source unique de vérité | Architecture | 8h | 🟠 | `prisma/schema.prisma`, `lib/experience.ts`, `app/actions/` |
| S3-2 | Extraire le profil de `User` vers `UserProfile` | Réduire le monolithe | Architecture | 12h | 🔴 | `prisma/schema.prisma`, `lib/`, `app/api/` |
| S3-3 | Supprimer géolocalisation précise si inutile | Réduire données sensibles | Sécurité, simplicité | 4h | 🟠 | `prisma/schema.prisma`, `lib/location.ts` |
| S3-4 | Clarifier `Guild` vs `Organization` | Éviter confusion produit | Produit | 6h | 🟠 | `prisma/schema.prisma`, `lib/squad-logic.ts` |
| S3-5 | Créer `lib/validation/` avec schémas Zod | Validation unifiée | Sécurité, qualité | 6h | 🟡 | `lib/validation/`, `app/api/` |

### Sprint 4 — Performance et accessibilité (1 semaine)

| ID | Description | Pourquoi | Impact | Temps estimé | Risque | Fichiers concernés |
|----|-------------|----------|--------|--------------|--------|-------------------|
| S4-1 | Ajouter lazy loading sur quiz, dashboard, settings | Réduire FCP/TTFB | Performance | 6h | 🟡 | `app/quiz/`, `app/dashboard/`, `app/settings/` |
| S4-2 | Analyser bundle avec `@next/bundle-analyzer` | Identifier sources lourdes | Performance | 3h | 🟢 | `next.config.mjs` |
| S4-3 | Lancer audit Lighthouse et fixer score > 80 | Accessibilité/perf | A11y, perf | 8h | 🟡 | multiples |
| S4-4 | Vérifier contrastes et labels formulaires | WCAG | Accessibilité | 4h | 🟢 | `components/ui/`, `components/quiz/`, `components/onboarding/` |
| S4-5 | Ajouter CSP explicite | Sécurité | Sécurité | 3h | 🟡 | `next.config.mjs` |

### Sprint 5 — Code quality et type safety (1 semaine)

| ID | Description | Pourquoi | Impact | Temps estimé | Risque | Fichiers concernés |
|----|-------------|----------|--------|--------------|--------|-------------------|
| S5-1 | Éliminer 50% des `any` | Type safety | Maintenabilité | 12h | 🟠 | `lib/types.ts`, `lib/auth.ts`, `middleware.ts` |
| S5-2 | Consolider helpers de dates | Éviter duplication | Code quality | 3h | 🟢 | `lib/` |
| S5-3 | Audit des composants UI shadcn | Réduire bundle | Perf | 4h | 🟢 | `components/ui/` |
| S5-4 | Réorganiser `app/api/` si pertinent | Réduire 56 routes | Architecture | 6h | 🟠 | `app/api/` |
| S5-5 | Ajouter tests sur parcours critiques | Confiance | Qualité | 8h | 🟡 | `__tests__/`, Playwright |

### Sprint 6 — Hardening sécurité et prod (0.5 semaine)

| ID | Description | Pourquoi | Impact | Temps estimé | Risque | Fichiers concernés |
|----|-------------|----------|--------|--------------|--------|-------------------|
| S6-1 | Vérifier rate limiting et Redis fallback | Robustesse | Sécurité | 4h | 🟡 | `lib/ratelimit.ts`, `lib/auth.ts` |
| S6-2 | Valider toutes les entrées API avec Zod | Injections, validation | Sécurité | 6h | 🟠 | `app/api/` |
| S6-3 | Sécuriser headers et CSP | Headers sécurisés | Sécurité | 3h | 🟡 | `next.config.mjs` |
| S6-4 | Run `pnpm audit` et fixer vulnérabilités | Dépendances | Sécurité | 2h | 🟡 | `package.json` |
| S6-5 | Documenter le runbook de déploiement | Ops | Maintenance | 3h | 🟢 | `docs/ops/` |

---

## Matrice des risques

| Changement | Risque | Justification | Précautions |
|------------|--------|---------------|-------------|
| Suppression dépendances | 🟢 | knip confirme ; aucune utilisation | Vérifier imports dynamiques, tests |
| Nettoyage layout | 🟢 | Aucune logique métier | Tests visuels manuels |
| Réduction templates email | 🟢 | Aucune dépendance cassante | Vérifier les appels à `emailService` |
| Correction middleware | 🟢 | Bug évident | Ajouter tests middleware |
| Refonte modèle `User` | 🔴 | Touche auth, middleware, API, actions | Migration, tests E2E, backup DB |
| Lazy loading | 🟡 | Peut impacter SEO/hydratation | Utiliser `next/dynamic` avec SSR where needed |
| Type safety | 🟠 | Peut révéler des bugs cachés | Étape par étape, fichier par fichier |
| CSP | 🟡 | Peut bloquer ressources tierces | Tester en staging |
| Validation API | 🟠 | Peut rejeter des requêtes valides | Schémas compatibles avec front |

---

## Estimation finale

| Item | Valeur |
|------|--------|
| **Temps total estimé** | 5 à 6 semaines (1 équipe de 2 développeurs) |
| **Complexité** | Moyenne à élevée (modèle de données) |
| **Effort** | ~320 à 400 heures de développement |
| **Dette supprimée** | ~30% de code mort, 15% de dépendances, nettoyage modèle |
| **Gain utilisateur** | Élevé : pages plus rapides, moins de friction, parcours plus clair |
| **Gain développeur** | Élevé : DX améliorée, builds plus rapides, moins de warnings |
| **Gain performance** | Moyen : réduction bundle, lazy loading, moins de JS global |
| **Gain maintenance** | Élevé : moins de fichiers, moins de duplication, modèle propre |

**ROI estimé** : 2.5x à 4x sur la vitesse de développement des 6 prochains mois, avec une baisse significative des bugs liés au modèle de données et à la validation.

---

## Conclusion et recommandation stratégique

**Ne pas lancer** avant d'avoir terminé au minimum les Sprints 1, 2 et 3. Le Sprint 3 (modèle de données) est le plus critique car il conditionne toute la capacité d'évolution du produit. Les Sprints 4, 5 et 6 peuvent être réalisés en parallèle partiel.

**Règle d'or à appliquer pendant le nettoyage** : chaque suppression doit être justifiée par une question simple : *"Cette ligne/composant/feature rapproche-t-elle HashCode de sa mission d'identifier, développer, connecter et faire évoluer les talents ?"*

Si la réponse n'est pas immédiatement oui, il faut supprimer, reporter ou simplifier.

---

*Rapport produit par le comité d'audit HashCode — 15 juillet 2026.*
