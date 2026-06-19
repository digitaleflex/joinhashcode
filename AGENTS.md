# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Generate Prisma client + start dev server (port 3000)
npm run build      # Generate Prisma client + push schema + build Next.js
npm run lint       # Run ESLint
npm run test       # Run Vitest test suite
npx prisma studio  # Open Prisma database browser
npx prisma db push # Push schema changes without migration (dev)
```

To run a single test:

```bash
npx vitest run __tests__/smoke.test.tsx
```

## Architecture

HASHCODE is a Next.js 15 App Router app for AI-driven tech talent profiling and community matching — targeting African tech communities. Users complete an onboarding flow and psychometric quiz, get classified into one of four profiles (Builder, Creator, Strategist, Catalyst), then join a corresponding community (Guild).

### Routing & Middleware

Route groups live under `/app`. The middleware at `middleware.ts` enforces a three-stage funnel:

1. No session → redirect to `/signin`
2. Session but no `currentSituation` → redirect to `/onboarding`
3. Session but no `class` assigned → redirect to `/quiz`

Protected routes (middleware matcher + `isProtectedPath`): `dashboard`, `missions`, `settings`, `squad`, `dossier`, `reviewer`, `feedback`, `onboarding`, `quiz`.

`/admin/*` is protected by `app/admin/layout.tsx` (requires role `ADMIN` or `MODERATOR`) — not in the middleware matcher by design since role-checking belongs in the layout.

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

Tracked actions: `ONBOARDING_COMPLETED`, `QUIZ_COMPLETED`, `POST_QUIZ_COMPLETED`, `SQUAD_CREATED`, `SQUAD_JOINED`, `SQUAD_UPDATED`, `CHECKIN_COMPLETED`, `MISSION_CLAIMED`, `MISSION_APPROVED`, `ADMIN_SUBMISSION_REVIEWED`. Add new actions to the `ActivityAction` union in `lib/activity-log.ts`.

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
| `onboarding/`                   | PATCH     | session         | Save step 1 onboarding (situation, country, objective)                |
| `onboarding/post-quiz/`         | PATCH     | session         | Save final onboarding step (dream, focus, blocker)                    |
| `missions/`                     | GET       | session         | List available missions                                               |
| `missions/[id]/`                | GET       | session         | Mission detail                                                        |
| `missions/[id]/review/`         | POST      | session         | Peer-review a submission (claim + submit review)                      |
| `missions/[id]/claim/`          | POST      | session         | Claim a submission for peer review                                    |
| `user/update/`                  | PATCH     | session         | Update profile fields                                                 |
| `user/checkin/`                 | POST      | session         | Daily check-in (XP, streak, squad cohesion)                           |
| `user/me/`                      | GET       | session         | Current user data                                                     |
| `user/notifications/`           | GET       | session         | Fetch notifications                                                   |
| `user/avatar/`                  | POST      | session         | Update avatar                                                         |
| `user/delete/`                  | DELETE    | session         | Delete account                                                        |
| `squad/create/`                 | POST      | session         | Create a new squad (user becomes LEADER)                              |
| `squad/join/`                   | POST      | session         | Join squad by slug                                                    |
| `squad/update/`                 | PATCH     | session, LEADER | Update squad name and invite slug                                     |
| `feed/`                         | GET       | session         | Activity feed                                                         |
| `feedback/`                     | POST      | session         | Submit beta feedback                                                  |
| `contact/`                      | POST      | —               | Contact form                                                          |
| `status/`                       | GET       | —               | Health check                                                          |
| `admin/submissions/`            | GET       | ADMIN/MOD       | List all submissions                                                  |
| `admin/submissions/[id]/`       | PATCH     | ADMIN/MOD       | Approve / request revision / reject                                   |
| `admin/feedback/`               | GET/PATCH | ADMIN/MOD       | Manage beta feedback                                                  |
| `internal/cron/squad-decay/`    | POST      | internal        | Decay inactive squad cohesion scores                                  |
| `internal/cron/release-claims/` | POST      | internal        | Release stale peer-review claims                                      |
| `internal/cron/check-activity/` | POST      | internal        | Send daily reminder to inactive users                                 |

### Squad System

Squads are `Organization` records (Better Auth's org model, mapped to `organization` table). The creator is `LEADER`; others are `MEMBER`. Key mechanics:

- **Cohesion score** (0–1): boosted by daily check-ins (`+0.05`) and approved missions (`+0.1`). Decays `−0.02/day` via cron if inactive.
- **Streak**: incremented when cohesion stays ≥ 0.9 for a new day. Milestones at 3d and 7d trigger badge rewards.
- **Invite link**: `<origin>/invite/<org.slug>`. Only the LEADER can customize name + slug via `PATCH /api/squad/update`. Slug rules: 3–30 chars, lowercase alphanumeric + hyphens, no leading/trailing hyphens.

Squad journey page lives at `/squad` (`app/squad/page.tsx` → `components/dashboard/squad-journey.tsx`). It shows a 6-phase gamified path; the leader sees a personalization panel.

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
| `middleware.ts`                          | Session guard, onboarding funnel, protected route list       |
| `lib/auth.ts`                            | Better Auth configuration                                    |
| `lib/activity-log.ts`                    | Fire-and-forget activity logger — instrument new routes here |
| `lib/squad-logic.ts`                     | Cohesion updates, streak logic, member notifications         |
| `lib/prisma.ts`                          | Prisma singleton client                                      |
| `lib/missions.ts`                        | Mission data and scoring logic                               |
| `prisma/schema.prisma`                   | Full data model                                              |
| `components/auth/signin-form.tsx`        | Sign-in form (reads `?callbackURL` for invite redirects)     |
| `components/dashboard/app-sidebar.tsx`   | Main nav — add new routes here                               |
| `components/dashboard/squad-journey.tsx` | Gamified squad page                                          |
| `components/ui/`                         | shadcn/ui base components                                    |
| `next.config.mjs`                        | Build error suppression, unoptimized images                  |

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

### Verification

- **Always run `npm run build` before any `git push`.** A successful build is the minimum bar — if it fails, fix it before pushing. This catches type errors, missing imports, and broken pages that lint and tests don't cover.
- Run `npm run lint` after any TypeScript changes.
- Run `npm run test` when touching business logic: quiz scoring, cohesion math, mission XP, auth flow.
- For API route changes, verify the route appears in the table above (or add it) and that the auth guard is correct.

### Commit format

```
type(scope): short description

# types: feat, fix, chore, refactor, test, docs
# examples: feat(missions): add XP multiplier for streaks
#           fix(auth): handle expired magic-link tokens
```
