# AGENTS.md

This file provides guidance to OpenCode (and other agents reading AGENTS.md) when working with code in this repository.

## Commands

```bash
pnpm dev           # Generate Prisma client + start dev server (port 3000)
pnpm build         # Clear .next/cache + generate Prisma client + next build (no DB push)
pnpm lint          # Run ESLint
pnpm test          # Run Vitest test suite
pnpm verify:fast   # tsc + eslint + prisma validate (gate before each commit)
pnpm verify        # full gate (+ live HTTP probes + Playwright)
npx prisma studio  # Open Prisma database browser
```

To run a single test:

```bash
pnpm exec vitest run __tests__/smoke.test.tsx
```

## Architecture

HASHCODE is a Next.js 16 App Router app for AI-driven tech talent profiling and community matching — targeting African tech communities. Users complete an onboarding flow and psychometric quiz, get classified into one of four profiles (Builder, Creator, Strategist, Catalyst), then join a corresponding community (Guild).

### Routing & Middleware

Route groups live under `/app`. The middleware at `proxy.ts` enforces a three-stage funnel:

1. No session → redirect to `/signin`
2. Session but no `currentSituation` → redirect to `/onboarding`
3. Session but no `class` assigned → redirect to `/quiz`

Protected routes: see `PROTECTED_PATHS` in `proxy.ts` (source of truth — includes `/academy/my-courses` and `/academy/certificates`). Any new private page must be added there; `pnpm verify` fails if a private route returns 200.

`/admin/*` is additionally guarded by `app/admin/layout.tsx` (requires role `ADMIN` or `MODERATOR`) for fine-grained role-based access control beyond the session check.

`/invite/[slug]` is intentionally public — it handles its own auth state internally and redirects to `/signin?callbackURL=/invite/[slug]` when unauthenticated.

### Auth

Better Auth (`lib/auth.ts`) with Prisma adapter, NextCookies session storage. Providers: Google, GitHub, Magic Link (via Resend email). The auth catch-all handler is at `app/api/auth/[...all]/route.ts`. Use `authClient` from `lib/auth-client.ts` in client components; access session server-side via `auth.api.getSession()`.

### Database

PostgreSQL auto-hébergé sur un VPS Hostinger avec Docker, accessible via Prisma 7 avec `@prisma/adapter-pg`. Singleton client in `lib/prisma.ts`. `DATABASE_URL` pointe vers le conteneur PostgreSQL du VPS. `DIRECT_URL` pour les migrations directes.

The `User` model is the central data structure — it holds psychometric scores (`builderScore`, `creatorScore`, `strategistScore`, `catalystScore`), behavioral vectors, community data, and progression all in one table. Key related models: `QuizResult`, `Mission`, `MissionSubmission`, `Organization`, `Member`, `ActivityLog`.

**ActivityLog** (`prisma/schema.prisma` → `activity_log` table): append-only event trail for every significant user action. Never throws — failures are swallowed so a log error never breaks a request. Use `logActivity()` from `lib/activity-log.ts`.

```ts
// Always fire-and-forget — do NOT await in the critical path
logActivity({ userId, action: "QUIZ_COMPLETED", entity: "quiz_result", entityId, metadata: { ... }, request: req })
```

Tracked actions: `ONBOARDING_COMPLETED`, `QUIZ_COMPLETED`, `POST_QUIZ_COMPLETED`, `MISSION_CLAIMED`, `MISSION_APPROVED`, `ADMIN_SUBMISSION_REVIEWED`, `EMAIL_OPT_OUT`. Add new actions to the `ActivityAction` union in `lib/activity-log.ts`.

> **After any schema change:** run `npx prisma db push` to apply the migration and regenerate the client. The `(prisma as any).activityLog` cast in `lib/activity-log.ts` can be removed once the client is regenerated.

### UI Stack

Radix UI primitives + TailwindCSS v4 + shadcn/ui wrappers (New York style, CSS variables). All shadcn components are in `components/ui/`. Framer Motion for animations, Sonner for toasts, next-themes for dark mode.

### Component Patterns

- Pages are server components by default; they fetch session and data server-side before rendering
- Interactive components are marked `"use client"` — quiz, onboarding, dashboard widgets
- Forms use React Hook Form + Zod validation

### API Routes

REST endpoints under `app/api/`:

| Route                           | Method    | Auth            | Purpose                                                               |
| ------------------------------- | --------- | --------------- | --------------------------------------------------------------------- |
| `quiz/`                         | —         | —               | Quiz uses a Server Action at `app/actions/quiz.ts` (not an API route) |
| `quiz/feedback/`                | POST      | session         | Submit quiz feedback                                                  |
| `onboarding/`                   | PATCH     | session         | Save step 1 onboarding (situation, country, objective)                |
| `onboarding/post-quiz/`         | PATCH     | session         | Save final onboarding step (dream, focus, blocker)                    |
| `missions/`                     | GET       | session         | List available missions                                               |
| `missions/[id]/`                | GET       | session         | Mission detail                                                        |
| `missions/[id]/attempt/`        | GET/PUT   | session         | Get/update mission attempt status                                     |
| `missions/[id]/attempt/submit/` | POST      | session         | Submit mission attempt with proof                                     |
| `missions/[id]/review/`         | POST      | session         | Peer-review a submission (claim + submit review)                      |
| `missions/[id]/claim/`          | POST      | session         | Claim a submission for peer review                                    |
| `user/update/`                  | PATCH     | session         | Update profile fields                                                 |
| `user/me/`                      | GET       | session         | Current user data                                                     |
| `user/notifications/`           | GET       | session         | Fetch notifications                                                   |
| `user/avatar/`                  | POST      | session         | Update avatar                                                         |
| `user/delete/`                  | DELETE    | session         | Delete account                                                        |
| `user/deactivate/`              | POST      | session         | Soft-deactivate account                                               |
| `user/reactivate/`              | POST      | session         | Reactivate deactivated account                                        |
| `user/export/`                  | GET       | session         | Export user data (GDPR)                                               |
| `user/check-pseudo/`            | GET       | session         | Check pseudo availability                                             |
| `user/j7-activation/`           | POST      | session         | Track J7 activation milestone                                         |
| `user/quiz-status/`             | GET       | session         | Check if user completed quiz                                          |
| `feed/`                         | GET       | session         | Activity feed                                                         |
| `feedback/`                     | POST      | session         | Submit beta feedback                                                  |
| `contact/`                      | POST      | —               | Contact form                                                          |
| `email/unsubscribe/`            | POST      | — (signé HMAC)  | Désabonnement des relances opérationnelles                            |
| `status/`                       | GET       | —               | Health check                                                          |
| `referral/`                     | POST      | session         | Referral tracking                                                     |
| `reviewer/`                     | GET       | session         | Reviewer dashboard data                                               |
| `specialization/`               | GET       | session         | Specialization data                                                   |
| `og/`                           | GET       | —               | OpenGraph image generation                                            |
| `log/client-error/`             | POST      | —               | Client-side error logging                                             |
| `webhooks/resend/`              | POST      | —               | Resend email webhooks                                                 |
| `ux-poll/`                      | GET/POST  | session         | UX poll responses                                                     |
| `public/talent/`                | GET       | —               | Public talent profiles                                                |
| `admin/submissions/`            | GET       | ADMIN/MOD       | List all submissions                                                  |
| `admin/submissions/[id]/`       | PATCH     | ADMIN/MOD       | Approve / request revision / reject                                   |
| `admin/missions/`               | GET/PATCH | ADMIN/MOD       | Manage missions                                                       |
| `admin/missions/[id]/`          | GET/PATCH | ADMIN/MOD       | Manage single mission                                                 |
| `admin/missions/attempts/`      | GET       | ADMIN/MOD       | List all mission attempts                                             |
| `admin/missions/attempts/[attemptId]/` | GET/PATCH | ADMIN/MOD | Manage single attempt                                           |
| `admin/users/`                  | GET       | ADMIN/MOD       | List all users                                                        |
| `admin/users/[id]/export/`      | GET       | ADMIN/MOD       | Export single user data                                               |
| `admin/users/export/`           | GET       | ADMIN/MOD       | Export all users data                                                 |
| `admin/feedback/`               | GET/PATCH | ADMIN/MOD       | Manage beta feedback                                                  |
| `admin/ux-poll/`                | GET       | ADMIN/MOD       | View UX poll results                                                  |
| `admin/log/`                    | GET       | ADMIN/MOD       | View activity logs                                                    |
| `admin/keys/`                   | GET/POST  | ADMIN/MOD       | Manage API keys                                                       |
| `admin/keys/[id]/`              | DELETE    | ADMIN/MOD       | Delete API key                                                        |
| `admin/notifications/broadcast/`| POST      | ADMIN/MOD       | Broadcast notification to all users                                   |
| `internal/cron/release-claims/` | POST      | internal        | Release stale peer-review claims                                      |
| `internal/cron/onboarding-drip/`| POST      | internal        | Onboarding drip email sequence                                        |
| `internal/cron/purge-data/`     | POST      | internal        | Purge stale data                                                      |

### Squads (supprimées) → futures Promotions

Les squads ont été supprimées du produit (D-027, 11/2026) : plus de pages, d'API, de cohésion ni de streaks. Le plugin better-auth `organization` est conservé pour les futures **Promotions** (cohortes, D-016) ; les tables `organization`/`member` gardent leurs données jusqu'à la phase 4 du nettoyage. Les anciens liens `/squad/*` redirigent vers `/dashboard`, `/invite/*` vers `/signin`. Rôles org si réutilisés : `owner` / `admin` / `member`, jamais `"LEADER"`.

### Progression : preuves, pas de points

XP, niveaux, badges et check-in ont été retirés (D-029). Aucun lab n'est verrouillé par niveau ; un membre devient éligible relecteur après **3 labs validés** (`isEligibleReviewer` dans `lib/acceptance-criteria.ts`). La mesure de progression est le nombre de labs validés (`User.missionsCompletedCount`).

### Environment Variables

Required:

```
BETTER_AUTH_SECRET, BETTER_AUTH_URL
GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET
GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
DATABASE_URL          # pooled (PgBouncer)
DIRECT_URL            # direct connection for migrations
```

Optional:

```
RESEND_API_KEY        # email (mocked if absent)
NEXT_PUBLIC_APP_URL   # base URL for auth callbacks
```

The repo uses `.env.development` and `.env.production` for environment-specific database instances, with `.env.local` for local overrides.

### Key Files

| File                                     | Purpose                                                      |
| ---------------------------------------- | ------------------------------------------------------------ |
| `proxy.ts`                          | Session guard, onboarding funnel, protected route list       |
| `lib/auth.ts`                            | Better Auth configuration                                    |
| `lib/activity-log.ts`                    | Fire-and-forget activity logger — instrument new routes here |
| `lib/prisma.ts`                          | Prisma singleton client                                      |
| `lib/missions.ts`                        | Mission data and scoring logic                               |
| `prisma/schema.prisma`                   | Full data model                                              |
| `components/auth/signin-form.tsx`        | Sign-in form (reads `?callbackURL` for invite redirects)     |
| `components/dashboard/app-sidebar.tsx`   | Main nav — add new routes here                               |
| `components/ui/`                         | shadcn/ui base components                                    |
| `next.config.mjs`                        | Standalone output, CSP headers, image domains, redirects            |

### Deployment

The app runs in Docker on a VPS (Hostinger) with Traefik as reverse proxy.

**Key deployment files:**

| File | Purpose |
| --- | --- |
| `Dockerfile` | Multi-stage build: Prisma CLI + standalone Node.js server |
| `compose.app.yml` | Production Docker Compose — single `web` service with Traefik labels |
| `cluster.mjs` | Node.js cluster wrapper — forks `WEB_CONCURRENCY` workers (1–4), respawns on crash |
| `deploy.sh` | Deploy script: `npm run build` → `docker compose up -d web --wait` |

**Standalone output structure:**

Next.js builds with `output: "standalone"` in `next.config.mjs`. The Dockerfile CMD runs `node /app/cluster.mjs`, which imports `.next/standalone/server.js`.

Critical bind mounts in `compose.app.yml`:
- `.next/standalone:/app/.next/standalone` — server code
- `.next/static:/app/.next/standalone/.next/static:ro` — CSS/fonts, mounted directly inside the standalone tree (no symlink)
- `./public:/app/public:rw` + `uploads_data:/app/public/uploads` — write path for uploads
- `./public:/app/.next/standalone/public:ro` + `uploads_data:/app/.next/standalone/public/uploads` — serving path for public files
- `./cluster.mjs:/app/cluster.mjs:ro` and `./docker-entrypoint.sh:/app/docker-entrypoint.sh:ro` — mounted scripts, edits apply without image rebuild

**Deploy command:**

```bash
./deploy.sh              # full build + deploy (mode legacy bind-mount)
./deploy.sh --skip-build # restart only (no rebuild)
./deploy.sh --image      # pull image GHCR + recreate — AUCUN build sur le VPS
```

> **Mode recommandé : `--image`.** GitHub Actions construit l'image (`Dockerfile.prod`) à chaque push sur `main` et la publie sur `ghcr.io/digitaleflex/joinhashcode`. Le VPS ne fait que pull + recreate (~30s, charge quasi nulle). Rollback : `IMAGE_TAG=<sha> ./deploy.sh --image`.
>
> **Golden rule:** on the VPS, never leave a bare `npm run build` un-deployed. A build wipes `.next/` (new inodes) while the running container stays pinned to the OLD bind-mount inodes → CSS/JS 404 until the container is recreated. Use `./deploy.sh --image` or `./deploy.sh`, never a bare build.

### Security - VPS Hardening (June 2026)

| Measure             | Detail                                                                                          |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| **iptables**        | INPUT DROP, only SSH 22 / HTTP 80 / HTTPS 443 allowed                                           |
| **Docker**          | DOCKER-USER chain blocks Jaeger 16686, PG 5434, Luna 8001, OTel ports                           |
| **ICMP**            | Ping blocked via `net.ipv4.icmp_echo_ignore_all=1`                                              |
| **SSH**             | Passwords disabled (keys only), `PermitRootLogin prohibit-password`, `X11Forwarding no`         |
| **Fail2ban**        | Ban 1h after 5 failed SSH attempts in 10min                                                     |
| **Dependencies**    | `pnpm audit` → 0 vulnerabilities (overrides in `package.json`)                                  |
| **Cron killswitch** | `/etc/cron.d/iptables-killswitch` restores iptables every 5min                                  |
| **phpMyAdmin**      | `cap_drop: ALL`, `no-new-privileges`, `read_only: true` (digi-innova, channel-market)           |
| **Traefik**         | `cap_drop: ALL`, `no-new-privileges`, only `CAP_NET_BIND_SERVICE` + `CAP_DAC_OVERRIDE`          |
| **Uptime Kuma**     | `cap_drop: ALL`, `no-new-privileges`, only `CAP_NET_BIND_SERVICE` + `CAP_SETUID` + `CAP_SETGID` |

Security docs: `https://github.com/digitaleflex/infra-docs` → `/security/`

### To-Do (sécurité)

- Replace Traefik dashboard basic-auth with OAuth2 (Google) via oauth2-proxy
- Implement Cloudflare Tunnel for zero-trust networking
- Clean up remaining `.env` files (permissions already fixed → 600)

## Working Guidelines

### Rules (always follow)

1. **Prisma schema change** → two steps required:
   - `npx prisma migrate dev --name <description>` to create the migration file (required by CI/CD pipeline that uses `prisma migrate deploy` in prod)
   - `npx prisma db push` to apply locally if VPS DB is not accessible in dev
2. **ActivityLog** → always fire-and-forget. Never `await logActivity(...)` on the critical path; swallow errors silently.
3. **Server vs. client components** → pages and layouts are server components by default. Add `"use client"` only when the component needs browser APIs, event handlers, or React hooks.
4. **DB safety** → never reset, truncate, or delete data without explicit user confirmation. Schema changes affect the database directly.
5. **Scope discipline** → implement only what was asked. Don't refactor surrounding code, extract helpers, or add abstractions unless directly required by the task.
6. **Auth guard** → every new API route must match the auth pattern in the table above (session / ADMIN+MOD / internal CRON_SECRET). Never skip the guard.
7. **Gel des fonctionnalités (D-028)** → aucune nouvelle fonctionnalité sans une hypothèse `H-xx` de `DOCS/HYPOTHESES.md` qu'elle teste (à citer dans le commit). Correctifs, nettoyage et contenu restent libres.
8. **Pas de code mort** → `pnpm exec knip` tourne en CI et doit rester vide (fichiers, exports, dépendances inutilisés).

### Verification

- **Always run `pnpm build` before any `git push`.** A successful build is the minimum bar — if it fails, fix it before pushing. This catches type errors, missing imports, and broken pages that lint and tests don't cover.
- **Node 22 required** (`.nvmrc` = 22.23.0, `engines` = `>=22.23 <23`). Package manager: pnpm 10.33.
- Run `pnpm lint` after any TypeScript changes.
- Run `pnpm test` when touching business logic: quiz scoring, review eligibility, mission engine, auth flow.
- For API route changes, verify the route appears in the table above (or add it) and that the auth guard is correct.

### OpenCode tooling

- **GitHub (issues, PR, CI)** → sous-agent `github-ops` via `/gh` ou `/issue` (MCP GitHub en lecture seule). Les écritures passent par `gh` et demandent confirmation.
- **Audit UI** → `ui-auditor` via `/ui-audit` (MCP Playwright, captures 390/1440).
- **Gate complet** → `/verify` (lint, types, tests, build, HEF).
- **Migrations** → `/migrate` (audit sur base vierge, jamais de reset).
- Détails et permissions : `.opencode/README.md` et `opencode.jsonc`.

### Commit format

```
type(scope): short description

# types: feat, fix, chore, refactor, test, docs
# examples: feat(labs): add artifact validation for HEF-020
#           fix(auth): handle expired magic-link tokens
```

### Séries de commits (règle permanente, demandée 2026-09-17)

**Toujours découper en séries de commits granulaires — jamais un gros commit fourre-tout.**
Un commit = une intention vérifiable :

| Découpage | Exemple |
|---|---|
| 1 étape de découplage = 1 commit | `refactor(pivot): D1 retirer squad-logic du review` |
| 1 vague de docs = 1 commit | `docs(pivot): amendement DECISIONS D-014-D-019` |
| 1 feature issue = 1 commit (ou 2 si schéma + UI) | `feat(evidence): modele + migration` puis `feat(evidence): UI portfolio` |
| Gate avant chaque commit, preuve dans le body | `npm run verify` VERT |

Ne jamais mélanger code + docs de pivot dans un même commit. Les commits de
refactor destructifs citent toujours l'issue (#377, etc.) et la preuve du gate.

## Master Prompt Quality Checklist

Cette section définit le standard de qualité pour tout prompt structuré (master prompt, skill, commande IA) rédigé dans ce dépôt. Appliquer cette checklist à chaque nouveau prompt.

### Sections requises

| Section           | Obligatoire | Description                                                                   |
| ----------------- | ----------- | ----------------------------------------------------------------------------- |
| **ROLE**          | oui         | Rôle exact et niveau d'expertise de l'IA.                                     |
| **CONTEXTE**      | oui         | Description claire du projet, utilisateurs, contraintes techniques et métier. |
| **OBJECTIVE**     | oui         | Objectif principal mesurable et orienté résultat.                             |
| **INPUTS**        | oui         | Données fournies à l'IA (args, fichiers, conventions).                        |
| **TASKS**         | oui         | Liste d'actions détaillées couvrant toutes les dimensions importantes.        |
| **METHODOLOGY**   | oui         | Méthode de raisonnement et démarche à suivre par l'IA.                        |
| **DELIVERABLES**  | oui         | Résultats attendus — livrables actionnables et bien décrits.                  |
| **FORMAT**        | oui         | Structure de sortie demandée (tableaux, listes, code, diagrammes).            |
| **QUALITY GATES** | oui         | Critères de qualité et niveau d'exigence (seuils, règles à respecter).        |
| **VERIFICATION**  | oui         | Checklist d'auto-vérification que l'IA doit cocher avant livraison.           |

### Critères d'évaluation

- [ ] Le prompt est-il utilisable sans information externe ?
- [ ] Le rôle est-il professionnel et adapté au périmètre ?
- [ ] Le contexte inclut-il les contraintes techniques et métier ?
- [ ] L'objectif est-il clair, complet et orienté résultat ?
- [ ] Les tâches couvrent-elles toutes les dimensions importantes ?
- [ ] La méthodologie guide-t-elle le raisonnement de l'IA ?
- [ ] Les livrables sont-ils actionnables et bien décrits ?
- [ ] Le format de sortie est-il explicite ?
- [ ] Les critères de qualité sont-ils applicables ?
- [ ] La vérification finale permet-elle d'identifier les oublis ?

### Exemple

Voir les commandes `.opencode/commands/` pour des prompts structurés.
