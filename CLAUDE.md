# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

`AGENTS.md` is the long-form reference: the full API route table with each route's auth level, squad mechanics, deployment details and VPS hardening. This file summarizes it. Docs, commits and UI copy are mostly in French; keep that language.

## Commands

The package manager is pnpm (`packageManager: pnpm@10.33.0`). Use Node 22: `.nvmrc` says 22.23.0, and `engines` requires `>=22.23 <23`.

```bash
pnpm dev                 # prisma generate + next dev (port 3000)
pnpm build               # clears .next/cache, runs prisma generate, then next build (no DB push)
pnpm lint                # eslint .
pnpm type-check          # tsc --noEmit
pnpm test                # vitest (watch mode)
pnpm exec vitest run __tests__/quiz-scoring.test.ts   # run one test file
pnpm exec vitest run -t "name of test"                # run tests matching a name
pnpm verify              # full gate: tsc, eslint, prisma validate, live HTTP probes on :3000, Playwright
pnpm verify:fast         # types + lint + prisma validate only (no network)
pnpm test:e2e            # Playwright (also playwright.public.config.ts / playwright.auth.config.ts, as CI runs them)
pnpm db:seed             # idempotent seed (CI runs it twice to check this)
pnpm hef:validate        # validate HEF curriculum JSON in content/hef/v1
pnpm check-secrets       # scan tracked files for secrets (runs in CI)
pnpm exec knip           # unused files/exports/deps (entries = Next.js routes, see knip.json)
```

CI (`.github/workflows/ci.yml`) runs these steps in order: prisma generate and validate, `hef:validate`, migrations (`scripts/ci-migrate-deploy.sh`), seed ×2, lint, type-check, `vitest run`, `check-secrets`, build, then the public and auth-OTP Playwright suites. Run `pnpm build` before pushing.

The pre-commit hook runs `lint-staged` (`eslint --fix` on staged JS/TS files).

## Architecture

The app is built with Next.js 16 (App Router, React 19), Prisma 7 on PostgreSQL through `@prisma/adapter-pg`, Better Auth, Tailwind v4 and shadcn/ui (New York style) in `components/ui/`. The product, JoinHashCode, is a learning and community platform with three domains: web, cybersecurity and applied AI. It is built around an onboarding and quiz funnel, an academy (courses, labs, paths, diplomas), labs (missions) with peer review, and a portfolio of validated proofs. Squads, XP, levels, badges and check-ins were removed (D-027, D-029).

- **Request guard: `proxy.ts`** (Next 16's replacement for `middleware.ts`). Paths listed in `PROTECTED_PATHS` require a session cookie. Signed-in users then go through a funnel: no session → `/signin`, then no `currentSituation` → `/onboarding`, then no `class` → `/quiz`, then no `primaryDomain` → `/specialization` (domain choice, active). API routes are not in the default matcher; they are added explicitly. **New private pages must be added to `PROTECTED_PATHS`.** `pnpm verify` probes the private routes and fails if one returns 200 instead of 307. `/admin` is also role-gated (ADMIN/MODERATOR) in `app/admin/layout.tsx`.
- **Auth**: server config is in `lib/auth.ts` and is read server-side with `auth.api.getSession()`. Client components use `authClient` from `lib/auth-client.ts`. The catch-all handler is `app/api/auth/[...all]`. Every API route needs one of three guards: session, ADMIN/MOD (`lib/admin-auth.ts`, `lib/auth-guard.ts`), or internal `CRON_SECRET` (`app/api/internal/cron/*`).
- **Prisma client is generated into `generated/prisma`**, not `node_modules`. Import it via the singleton in `lib/prisma.ts`. `prisma.config.ts` loads `.env.local` before `.env` and uses `DIRECT_URL` for the CLI. The runtime uses `DATABASE_URL`, which is pooled.
- **Data model**: `User` is the central table (profile, psychometric scores, `missionsCompletedCount`). Some columns and tables from the removed gamification (XP, streaks, squads) still exist in the schema until phase 4 of `DOCS/NETTOYAGE_SUIVI.md`; do not build on them. The Better Auth `organization` plugin is kept for future cohorts ("Promotions").
- **Progression rules**: no lab is locked by level; reviewer eligibility is 3 validated labs (`isEligibleReviewer` in `lib/acceptance-criteria.ts`).
- **Missions engine**: `lib/mission-*.ts` modules handle status, versioning, deadlines and prefill, with the core in `lib/mission-engine.ts` and `lib/missions.ts`.
- **HEF curriculum** (HashCode Engineering Foundations: 17 modules, labs and projects): the source of truth is an external repo. `scripts/hef/parse.mjs` turns it into versioned JSON in `content/hef/v1/`. `prisma/seed-hef.ts` imports that JSON idempotently, and `pnpm hef:validate` checks its integrity. Assets go in `public/hef/`. Never commit videos or PPTX sources.
- **Server Actions** live in `app/actions/` (the quiz, for example) and `lib/actions/`. Zod schemas live in `lib/schemas/` and `lib/validation/`.
- **Activity log**: call `logActivity()` from `lib/activity-log.ts` fire-and-forget. Never `await` it on the critical path; it swallows its own errors. New action names go in the `ActivityAction` union.
- **Public API v1** is under `app/api/v1` and documented in `docs/API_V1.md`. Product decisions, specs and audits are in `DOCS/`, with `DECISIONS.md` and `MIGRATIONS.md` as the key files.

## Rules

1. **Schema change**: run `pnpm exec prisma migrate dev --name <description>` to create the migration. Production applies migrations with `prisma migrate deploy`, so `db push` alone is not enough. Never reset, truncate or delete DB data without explicit confirmation.
2. Pages and layouts are server components by default. Add `"use client"` only when a component needs hooks, event handlers or browser APIs.
3. Keep scope tight. Do not refactor or abstract beyond what the task asks for.
4. Commits use the format `type(scope): description` (feat, fix, chore, refactor, test, docs). Split work into **granular commits**, one verifiable intent each. Never mix code changes and pivot docs in one commit. Destructive refactors must cite the issue (`#377`) and include proof that the gate passed in the commit body.
5. Deployment: on the VPS, use `./deploy.sh --image` (pull the GHCR image built by CI). Never leave a bare `npm run build` un-deployed there: the running container keeps the old `.next` inodes and CSS/JS starts returning 404.
