# AUDIT ARCHITECTURE LOGICIELLE — JOINHASHCODE
### Rapport Exécutif · Version 1.0 · Juin 2026

---

## PHASE 1 — CARTOGRAPHIE DU SYSTÈME

### Vue d'ensemble

```
hashcode-community/                     ~340 fichiers · ~20 000 LOC
├── app/          (114 fichiers)         Next.js 15 App Router — pages + 75+ routes API
├── components/   (146 fichiers)         102+ composants React (67 UI + 35 domaine)
├── lib/          (32 fichiers)          Logique métier, auth, DB, emails, moteurs
├── __tests__/    (23 fichiers)          Vitest — tests unitaires + intégration
├── prisma/       (8 fichiers)           Schéma 505 lignes, 25 modèles
├── scripts/      (17 fichiers)          DevOps, seeding, admin CLI
└── middleware.ts                        Garde de session, funnel 3 étapes
```

### Domaines métier identifiés

| Domaine | Fichiers clés | Complexité |
|---------|--------------|-----------|
| **Auth & Session** | `lib/auth.ts`, `middleware.ts`, `app/(auth)/` | Haute |
| **Profiling psychométrique** | `app/actions/quiz.ts`, `lib/questions.ts`, `components/quiz/` | Haute |
| **Missions & Peer Review** | `lib/missions.ts`, `app/api/missions/`, `components/missions/` | Haute |
| **Squad / Gamification** | `lib/squad-logic.ts`, `lib/badge-engine.ts`, `lib/evolution-engine.ts` | Très haute |
| **Administration** | `app/admin/`, `app/api/admin/` | Moyenne |
| **Profil utilisateur** | `lib/user-export.ts`, `lib/profile-content.ts`, `components/dossier/` | Moyenne |
| **Notifications** | `lib/qstash.ts`, `lib/email.ts`, `app/api/user/notifications/` | Moyenne |
| **Infrastructure** | `lib/db.ts`, `lib/ratelimit.ts`, `lib/security.ts`, `lib/logger.ts` | Moyenne |

### Graphe de dépendances (couplages critiques)

```
middleware.ts
    └── lib/auth.ts

app/api/*/route.ts
    ├── lib/auth.ts          (session/auth guard)
    ├── lib/db.ts            (Prisma singleton)
    ├── lib/activity-log.ts  (telemetry fire-and-forget)
    ├── lib/squad-logic.ts   (cohésion, streaks)
    ├── lib/missions.ts      (scoring XP)
    ├── lib/email.ts         (Resend, 31KB — monolithe)
    └── lib/badge-engine.ts  (badges, progression)

lib/auth.ts
    ├── lib/db.ts            (Prisma adapter)
    ├── lib/email.ts         (welcome email au signup)
    └── lib/referral.ts      (code auto-généré)

app/actions/quiz.ts
    ├── lib/auth.ts
    ├── lib/db.ts
    ├── lib/email.ts
    ├── lib/badge-engine.ts
    └── lib/evolution-engine.ts
```

**Couplages problématiques :** `lib/email.ts` (31 KB) importé depuis `lib/auth.ts`, `app/actions/quiz.ts`, et plusieurs routes API — couplage fort entre infrastructure email et logique métier.

---

## PHASE 2 — ORGANISATION DU CODE

### Fichiers critiques par taille

| Fichier | Lignes | Problème |
|---------|--------|---------|
| `components/dashboard/squad-journey.tsx` | **1 481** | God component — 6 phases, cohésion, roster, rebalancing |
| `lib/email.ts` | **~800** | Monolithe email — tous les templates dans un seul fichier |
| `lib/missions.ts` | **~600** | Données + logique mélangées |
| `components/missions/missions-list.tsx` | **513** | UI + filtrage + logique de matching |
| `components/dossier/dossier-view.tsx` | **487** | Trop de responsabilités |
| `components/quiz/quiz.tsx` | **408** | Scoring inline dans le composant |
| `lib/auth.ts` | **257** | Acceptable, mais dense |
| `middleware.ts` | **170** | Acceptable |

### Conventions

**Points positifs :**
- Nommage cohérent (`kebab-case` fichiers, `PascalCase` composants)
- Structure par feature dans `components/dashboard/squad/`
- Prefixes d'erreur taggés (`[AVATAR_POST]`, `[SQUAD_CREATE]`)
- Commit format Conventional Commits respecté

**Points négatifs :**
- `lib/` mélange utilitaires purs (`utils.ts`, `countries.ts`) et logique métier lourde (`missions.ts`, `squad-logic.ts`, `evolution-engine.ts`) — pas de séparation de couches
- `app/api/` sans organisation par version (`/v1/`)
- `components/dashboard/` commence à être surchargé (25 fichiers)
- Doublon probable : `Guild` model dans Prisma (legacy) + `Organization` actif

### Duplication détectée

```typescript
// Pattern répété dans ~30 routes API :
const session = await auth.api.getSession({ headers: await headers() });
if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

// Pattern répété dans les routes admin (~12 fois) :
if (!["ADMIN", "MODERATOR"].includes(session.user.role)) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

Ces deux patterns mériteraient des helpers `requireSession()` et `requireAdmin()`.

---

## PHASE 3 — CLEAN ARCHITECTURE

### Analyse des couches

```
┌─────────────────────────────────────────────────────┐
│  PRÉSENTATION (app/, components/)                    │
│  ✅ Server Components pour pages                     │
│  ✅ "use client" limité aux composants interactifs   │
│  ⚠️  Logique de scoring dans quiz.tsx               │
│  ⚠️  squad-journey.tsx 1481 lignes                  │
├─────────────────────────────────────────────────────┤
│  APPLICATION (app/actions/, app/api/)                │
│  ✅ Server Actions pour quiz                         │
│  ⚠️  Routes API contiennent logique métier inline   │
│  ⚠️  Pas de service layer explicite                 │
├─────────────────────────────────────────────────────┤
│  DOMAINE (lib/)                                      │
│  ✅ squad-logic.ts, missions.ts, badge-engine.ts    │
│  ✅ evolution-engine.ts, activity-log.ts             │
│  ⚠️  Pas de domain entities typées                 │
│  ⚠️  lib/ mélange domaine + infrastructure          │
├─────────────────────────────────────────────────────┤
│  INFRASTRUCTURE (lib/db.ts, lib/auth.ts, lib/email)  │
│  ✅ Singleton Prisma correct                        │
│  ✅ Better Auth bien encapsulé                      │
│  ⚠️  email.ts importé partout (couplage fort)       │
│  ⚠️  NODE_TLS_REJECT_UNAUTHORIZED=0 en dur          │
└─────────────────────────────────────────────────────┘
```

### Violations Clean Architecture

1. **Routes API avec logique métier inline** — Calculs XP, mise à jour de cohésion et déclenchement de badges directement dans les handlers HTTP.
2. **`lib/auth.ts` appelle `lib/email.ts`** — Infrastructure d'authentification qui connaît les templates d'email — violation de dépendance.
3. **`lib/missions.ts` mélange données et logique** — Définitions de missions (données statiques) et algorithmes de scoring dans le même fichier.
4. **Pas de Repository Pattern** — Accès Prisma direct dans les routes, sans abstraction testable.
5. **`squad-journey.tsx` est un God Component** — Présentation, état local, appels API, calculs de compatibilité et gestion de membres dans un seul fichier.

---

## PHASE 4 — TYPESCRIPT

### Inventaire des problèmes

| Catégorie | Occurrences | Sévérité |
|-----------|-------------|---------|
| `as any` (production) | ~20 | Haute |
| `as any` (tests) | ~45 | Moyenne |
| `typescript.ignoreBuildErrors: true` | 1 (next.config) | **Critique** |
| `eslint-disable` justifiés | 5 | Faible |
| `NODE_TLS_REJECT_UNAUTHORIZED = "0"` | 1 | Haute |

### Causes racines des `as any`

**1. `behavioralVibrancy` — type fantôme**
```typescript
// lib/evolution-engine.ts:40,53
(user.behavioralVibrancy as any)   // Stocké comme Json dans Prisma
```
Champ `Json` Prisma non typé, propagé dans dashboard, dossier, evolution engine. Un type Zod résoudrait 8+ casts.

**2. Better Auth adapter gaps**
```typescript
// components/settings/PasskeySetup.tsx:17,35,51
(authClient as any).passkey.register()
```
API passkey de Better Auth non exportée correctement dans le client.

**3. `(prisma as any).activityLog`**
```typescript
// lib/activity-log.ts — documenté dans CLAUDE.md
(prisma as any).activityLog.create(...)  // En attente de régénération du client
```
Cast connu et documenté — disparaît après `npx prisma generate`.

**4. `ignoreBuildErrors: true`**
```javascript
// next.config.mjs
typescript: { ignoreBuildErrors: true }
```
Problème TypeScript le plus critique. Des erreurs de type silencieuses peuvent passer en production.

### Note TypeScript : **52/100**
Strict mode activé mais `ignoreBuildErrors` annule la protection. Types métier (`BehavioralVibrancy`, `AcceptanceCriteria`) absents du système de types.

---

## PHASE 5 — COMPOSANTS REACT

### Analyse de complexité

| Composant | Lignes | Problèmes |
|-----------|--------|-----------|
| `squad-journey.tsx` | 1 481 | 6 phases, 4+ queries SWR, roster, rebalancing — à découper en 5 fichiers |
| `missions-list.tsx` | 513 | Filtrage + matching de profil inline |
| `dossier-view.tsx` | 487 | 10+ sections différentes |
| `quiz.tsx` | 408 | State machine implicite pour le flow |
| `evolution-radar.tsx` | 398 | Recharts + calculs de score mélangés |

### Forces
- Séparation `"use client"` bien respectée
- Shadcn/UI correctement utilisé comme primitives
- Framer Motion isolé dans les composants d'animation
- Radix UI pour l'accessibilité

### Faiblesses
- Pas de Storybook — composants UI non documentés visuellement
- Pas de lazy loading sur les composants lourds (ReactFlow, Recharts)
- État local vs server state flou — mix de `useState`, `SWR`, et `useQuery` sans stratégie claire
- `squad-journey.tsx` est une bombe à retardement pour la maintenance

---

## PHASE 6 — LOGIQUE MÉTIER

### Évaluation par domaine

#### Missions & XP
```
lib/missions.ts (~600 lignes)
├── Définitions statiques des missions        ← devrait être DB-driven
├── Calcul XP par difficulté                  ✅ isolé
├── Mapping profil → missions recommandées    ✅ logique pure
└── Acceptance criteria rubrics              ← devrait être en DB (admin-éditable)
```
**Problème majeur :** missions hardcodées dans `lib/missions.ts`. Un admin peut créer une mission en DB mais le scoring/recommandation reste basé sur les données statiques — divergence entre source de vérité DB et code.

#### Squad & Cohésion
```
lib/squad-logic.ts
├── updateCohesion()     ✅ pure function, testable
├── calculateStreak()    ✅ logique claire
├── notifyMembers()      ⚠️ appelle lib/email.ts directement
└── decayCohesion()      ✅ isolé dans le cron
```

#### Gamification
```
lib/badge-engine.ts     ✅ Logique de badges isolée
lib/evolution-engine.ts ✅ Progression psychométrique isolée
lib/activity-log.ts     ✅ Audit trail fire-and-forget parfait
```
Points forts : les moteurs de gamification sont les mieux architecturés du projet.

#### Quiz & Profiling
```
app/actions/quiz.ts
├── Scoring psychométrique   ✅ algorithme correct
├── Transaction DB           ✅ atomic
├── Email de résultat        ⚠️ couplage direct avec Resend
└── Badge unlock             ⚠️ logique métier dans Server Action
```

### Verdict
Les moteurs (`badge-engine`, `evolution-engine`, `squad-logic`) sont bien isolés. Les routes API contiennent encore trop de logique orchestratrice qui devrait être dans des services dédiés.

---

## PHASE 7 — TESTABILITÉ

### Inventaire des tests

| Catégorie | Fichiers | Couverture estimée |
|-----------|---------|-------------------|
| Auth flow | 2 | Bonne |
| Quiz scoring | 1 | Bonne |
| Squad logic | 3 | Moyenne |
| Admin workflows | 2 | Moyenne |
| Sécurité / anti-abuse | 2 | Bonne |
| Composants React | 1 (smoke) | Très faible |
| E2E / intégration | 0 | **Inexistante** |

### Problèmes de testabilité

**1. Absence de Repository Pattern**
```typescript
// Actuellement — non testable sans mocker Prisma
const submission = await prisma.missionSubmission.findFirst({ ... });

// Testable :
const submission = await submissionRepo.findPending(userId);
```

**2. Dépendances directes à Resend/QStash dans la logique métier**
Appels email et notifications dans les Server Actions et routes — tests unitaires dépendants de mocks complexes, d'où les 45+ `as any` dans les tests.

**3. God Component non testable**
`squad-journey.tsx` 1481 lignes — impossible à tester unitairement.

**4. Pas de test E2E (Playwright/Cypress)**
Funnel onboarding, quiz psychométrique, et flow de peer review sont des chemins critiques sans aucun test E2E.

### Zones à risque sans tests
- Calcul de XP lors de l'approbation d'une mission
- Funnel onboarding complet (3 étapes)
- Flow d'invitation squad (cookie → auth → redirect)
- Génération de la dossier card (Satori/OG image)
- Webhook Resend (bounces email)

---

## PHASE 8 — DETTE TECHNIQUE

| # | Dette | Fichier | Coût correction | Impact futur |
|---|-------|---------|----------------|-------------|
| 1 | `ignoreBuildErrors: true` | `next.config.mjs` | 1-2j | Types invalides en prod silencieux |
| 2 | `behavioralVibrancy` non typé | Partout | 1j | Crashes runtime sur refactor |
| 3 | `squad-journey.tsx` God Component | 1481 lignes | 3-5j | Impossible à maintenir à 3+ devs |
| 4 | `lib/email.ts` monolithe 31KB | `lib/email.ts` | 2-3j | Toute modif email = risque global |
| 5 | Missions hardcodées | `lib/missions.ts` | 3-5j | Admin ne peut pas créer de vraies missions |
| 6 | Pas de service layer | Routes API | 5-8j | Logique non réutilisable, non testable |
| 7 | `NODE_TLS_REJECT_UNAUTHORIZED=0` | `lib/prisma.ts` | 0.5j | Vuln MITM en prod |
| 8 | Model `Guild` legacy | `prisma/schema.prisma` | 1j | Confusion nouveaux devs |
| 9 | Pas de Repository Pattern | Tout | 5-10j | Tests coûteux, logique DB exposée |
| 10 | Pas de tests E2E | `__tests__/` | 3-5j | Régressions silencieuses |
| 11 | `as any` dans tests (45x) | `__tests__/` | 2-3j | Tests qui passent mais mentent |
| 12 | CSP avec `unsafe-inline` + `unsafe-eval` | `next.config.mjs` | 2-3j | XSS possible malgré CSP |
| 13 | Absence de pagination sur logs admin | `app/api/admin/log/` | 1j | OOM sur grande volumétrie |
| 14 | SWR + React Query mélangés | `components/` | 2j | Deux caches, comportements imprévisibles |
| 15 | Acceptance criteria statiques | `lib/missions.ts` | 3j | Admin ne peut pas personnaliser les critères |
| 16 | Pas de Storybook / design system doc | — | 3-5j | Onboarding UX devs lent |
| 17 | `lib/` non structuré (domain vs infra) | `lib/` | 2-3j | Confusion architecture |
| 18 | Logs `console.error` sans aggregation | Routes API | 1j | Erreurs prod invisibles |
| 19 | Pas de versioning API (`/v1/`) | `app/api/` | 3-5j | Breaking changes sans migration possible |
| 20 | `typedoc` en devDep mais non configuré | `package.json` | 1j | Pas de doc API auto-générée |

**Coût total estimé de remédiation : ~50-80 jours-développeur**

---

## PHASE 9 — PRÉPARATION ÉQUIPE

> "Si 10 développeurs rejoignent le projet demain, pourront-ils comprendre rapidement l'architecture ?"

**Réponse : Non, pas sans 2-3 semaines d'onboarding.**

### Ce qui aide
- CLAUDE.md exceptionnel — architecture bien documentée
- CHANGELOG.md présent et maintenu
- Commits Conventional Commits propres
- Nommage cohérent des fichiers et composants
- `prisma/schema.prisma` auto-documentant

### Ce qui bloque

| Zone complexe | Problème pour un nouvel arrivant |
|--------------|----------------------------------|
| `squad-journey.tsx` 1481 lignes | 2-3 jours pour comprendre les 6 phases |
| `lib/auth.ts` avec 8 plugins Better Auth | Pas de documentation sur ce qui est activé/désactivé et pourquoi |
| Funnel middleware → onboarding → quiz | Logique de redirect répartie sur 3 fichiers |
| `behavioralVibrancy` | Type fantôme — `as any` partout, comportement imprévisible |
| Conventions de test | Mix de mocks `as any`, patterns non homogènes |
| Missions statiques vs DB | Ambiguïté source de vérité |

### Documentation manquante
- `ARCHITECTURE.md` — vue d'ensemble des couches et décisions ADR
- `CONTRIBUTING.md` — comment créer une route API, un composant, un test
- `docs/domain/` — règles métier documentées (XP, cohésion, scoring)
- Storybook — catalogue des composants UI
- OpenAPI/Swagger — spec des routes API
- `docs/adr/` — Architecture Decision Records

---

## PHASE 10 — RAPPORT EXÉCUTIF

### Notes sur 100

| Dimension | Note | Commentaire |
|-----------|------|------------|
| **Architecture globale** | 62/100 | Bonne intuition des domaines, absence de couches formelles |
| **Maintenabilité** | 55/100 | God components, pas de service layer, dette accumulée |
| **Lisibilité** | 68/100 | Nommage bon, conventions respectées, fichiers trop larges |
| **Scalabilité** | 50/100 | Pas de pagination partout, missions statiques, pas de CDN uploads |
| **Sécurité du code** | 70/100 | CSP `unsafe-*`, TLS disabled, mais auth robuste avec 2FA+passkeys |
| **Qualité TypeScript** | 52/100 | Strict mode mais `ignoreBuildErrors` annule la protection |
| **Dette technique** | 48/100 | 20 items identifiés, ~70j de remédiation |

**Score global : 58/100** — Projet solide en fonctionnalités, architecture à restructurer avant d'accueillir une équipe.

---

### TOP 20 — PROBLÈMES LES PLUS IMPORTANTS

| Priorité | Problème | Sévérité | Impact |
|----------|---------|---------|--------|
| 1 | `typescript.ignoreBuildErrors: true` — bugs silencieux en prod | Critique | Stabilité |
| 2 | `NODE_TLS_REJECT_UNAUTHORIZED=0` — MITM possible | Critique | Sécurité |
| 3 | CSP avec `unsafe-inline` + `unsafe-eval` — XSS possible | Haute | Sécurité |
| 4 | `squad-journey.tsx` 1481 lignes — God Component | Haute | Maintenabilité |
| 5 | Pas de service layer — logique métier dans les routes HTTP | Haute | Testabilité |
| 6 | `lib/email.ts` monolithe 31KB — couplage fort | Haute | Maintenabilité |
| 7 | Missions hardcodées — divergence DB vs code | Haute | Fonctionnel |
| 8 | Pas de tests E2E — funnels critiques non couverts | Haute | Qualité |
| 9 | `behavioralVibrancy` non typé — 8+ casts `as any` | Haute | Stabilité |
| 10 | Pas de Repository Pattern — Prisma exposé partout | Haute | Testabilité |
| 11 | Model `Guild` legacy non supprimé | Moyenne | Confusion |
| 12 | SWR et React Query coexistent sans stratégie | Moyenne | Performance |
| 13 | Logs `console.error` sans aggregation centralisée | Moyenne | Observabilité |
| 14 | Pas de versioning API — breaking changes impossibles à déployer progressivement | Moyenne | Scalabilité |
| 15 | 45 `as any` dans les tests — mocks qui mentent | Moyenne | Confiance tests |
| 16 | Acceptance criteria statiques non éditables par admin | Moyenne | Fonctionnel |
| 17 | Pas de pagination sur `admin/log` — OOM à volumétrie | Moyenne | Performance |
| 18 | Avatar stocké sur disque — perdu au redéploiement | Moyenne | Données |
| 19 | Pas de documentation `ARCHITECTURE.md` / ADR | Moyenne | Onboarding |
| 20 | `lib/` sans séparation domain/infrastructure | Faible | Lisibilité |

---

### TOP 20 — AMÉLIORATIONS PRIORITAIRES

| Priorité | Amélioration | Effort | ROI |
|----------|-------------|--------|-----|
| 1 | Retirer `ignoreBuildErrors` + corriger les erreurs TypeScript | 2j | Critique |
| 2 | Certificat SSL valide pour VPS + retirer `NODE_TLS_REJECT_UNAUTHORIZED=0` | 0.5j | Critique |
| 3 | Remplacer `unsafe-inline`/`unsafe-eval` CSP par nonces Next.js | 2j | Haute |
| 4 | Créer `requireSession()` et `requireAdmin()` helpers | 1j | Haute |
| 5 | Typer `BehavioralVibrancy` avec Zod — éliminer 8+ `as any` | 1j | Haute |
| 6 | Découper `squad-journey.tsx` en 5 composants | 3j | Haute |
| 7 | Créer `lib/services/` — extraire orchestration métier des routes API | 5j | Haute |
| 8 | Migrer avatars vers Supabase Storage ou S3 | 1j | Haute |
| 9 | Ajouter tests E2E Playwright — funnel onboarding, quiz, mission review | 4j | Haute |
| 10 | Séparer `lib/missions.ts` — `data/missions.ts` + `services/mission-service.ts` | 1j | Moyenne |
| 11 | Supprimer model `Guild` legacy de Prisma + migration | 0.5j | Moyenne |
| 12 | Unifier data fetching — choisir SWR ou React Query | 2j | Moyenne |
| 13 | Intégrer Sentry ou Axiom pour centraliser les erreurs prod | 1j | Moyenne |
| 14 | Ajouter pagination sur `admin/log` et `admin/users` (cursor-based) | 1j | Moyenne |
| 15 | Créer `ARCHITECTURE.md` + 3 ADR initiaux | 1j | Moyenne |
| 16 | Splitter `lib/email.ts` en modules (`emails/welcome.ts`, `emails/mission.ts`, etc.) | 1.5j | Moyenne |
| 17 | Ajouter versioning API `/api/v1/` avec redirect des anciennes routes | 2j | Moyenne |
| 18 | Typer les mocks de tests avec factories typées — éliminer 45 `as any` | 2j | Moyenne |
| 19 | Configurer TypeDoc + générer doc API auto dans CI | 1j | Faible |
| 20 | Ajouter Storybook pour les 10 composants UI les plus utilisés | 3j | Faible |

---

### ROADMAP 30 JOURS — Stabilisation critique

**Objectif : Rendre le projet safe pour une équipe de 3-5 devs**

```
Semaine 1 — Sécurité & TypeScript
├── J1-2 : Retirer ignoreBuildErrors, corriger les erreurs TS
├── J2   : Certificat SSL VPS + retirer NODE_TLS_REJECT_UNAUTHORIZED
├── J3-4 : CSP nonces Next.js (remplacer unsafe-inline/unsafe-eval)
└── J5   : requireSession() + requireAdmin() helpers

Semaine 2 — Types & Données
├── J6   : Typer BehavioralVibrancy avec Zod (élimine 8 casts)
├── J7   : Séparer lib/missions.ts en data/ + service
├── J8-9 : Migration avatars vers Supabase Storage
└── J10  : Supprimer model Guild legacy + migration Prisma

Semaine 3 — Observabilité & Tests
├── J11  : Intégrer Sentry (erreurs prod)
├── J12-14: Tests E2E Playwright — funnel onboarding + quiz
└── J15  : Pagination admin/log + admin/users

Semaine 4 — Documentation & Architecture
├── J16-17: ARCHITECTURE.md + 3 ADR
├── J18-19: Découper squad-journey.tsx (début)
└── J20  : CONTRIBUTING.md pour nouveaux devs
```

---

### ROADMAP 90 JOURS — Refactoring structurel

**Objectif : Base maintenable pour 10 développeurs**

```
Mois 2 — Service Layer & Composants
├── Créer lib/services/ (mission-service, squad-service, user-service)
├── Finir découpage squad-journey.tsx
├── Unifier SWR vs React Query
├── Splitter lib/email.ts en modules
└── Repository Pattern sur les 5 entités critiques (User, Mission, Squad, Submission, Badge)

Mois 3 — API & Testabilité
├── Versioning API /v1/ + OpenAPI spec (Swagger)
├── Tests E2E Playwright — peer review, squad invite flow
├── Storybook — 10 composants UI core
├── TypeDoc + CI documentation generation
└── Missions admin-éditables (acceptance criteria en DB)
```

---

### ROADMAP 12 MOIS — Platform SaaS de référence

**Objectif : 50 000+ utilisateurs, équipe 10+ devs, zéro dette critique**

```
Q3 2026 — Multi-tenancy & Performance
├── Architecture multi-tenant (organisations multiples par utilisateur)
├── CDN pour assets statiques (avatars, dossier cards)
├── Cache Redis pour missions/leaderboard (Upstash déjà présent)
├── Database read replicas + connection pooling (PgBouncer)
├── Observabilité complète (Sentry + Datadog ou Grafana)
└── Feature flags (LaunchDarkly ou Posthog)

Q4 2026 — Scalabilité Équipe
├── Monorepo Turborepo (séparation web/api/packages)
├── Design system documenté (Storybook published)
├── Contract testing API (Pact)
├── Load testing (k6) sur les routes critiques
└── SLA 99.9% avec runbooks d'incident

Q1 2027 — Croissance SaaS
├── API publique v2 (GraphQL ou tRPC)
├── Webhooks pour intégrations tierces
├── Analytics produit avancés (Posthog / Mixpanel)
├── Internationalisation i18n complète
└── Marketplace de missions (contenu communautaire)

Q2 2027 — Maturité Platform
├── SOC 2 Type I compliance
├── GDPR automation complète (audit trail + purge automatique)
├── Blue/green deployments + canary releases
├── Disaster recovery plan testé
└── Certification ISO 27001 roadmap
```

---

### Conclusion

JoinHashcode est un projet **ambitieux et fonctionnellement riche** avec des fondations correctes — Better Auth robuste, Prisma bien configuré, gamification pensée, audit trail exemplaire. Le CLAUDE.md reflète une discipline de développeur solo sérieux.

Les risques principaux ne sont pas dans les fonctionnalités mais dans la **structure** : un God Component critique, des couches métier trop couplées à l'infrastructure, et l'absence de filet de sécurité TypeScript (`ignoreBuildErrors`) qui peut laisser passer des régressions silencieuses en production.

Avec 30 jours de stabilisation ciblée sur les priorités 1-5 de cette liste, le projet peut accueillir une équipe de 5 développeurs en toute confiance. Avec 90 jours de refactoring structurel, il est prêt pour 10+ développeurs et une croissance SaaS sérieuse.
