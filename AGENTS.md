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

Protected routes: `dashboard`, `community`, `missions`, `tools`, `settings`.

### Auth

Better Auth (`lib/auth.ts`) with Prisma adapter, NextCookies session storage. Providers: Google, GitHub, Magic Link (via Resend email). The auth catch-all handler is at `app/api/auth/[...all]/route.ts`. Use `authClient` from `lib/auth-client.ts` in client components; access session server-side via `auth.api.getSession()`.

### Database

PostgreSQL on Supabase, accessed via Prisma 7 with `@prisma/adapter-pg` (connection pooling). Singleton client is in `lib/db.ts`. Two URLs required: `DATABASE_URL` (pooled, for queries) and `DIRECT_URL` (direct, for migrations).

The `User` model is the central data structure — it holds psychometric scores (`builderScore`, `creatorScore`, `strategistScore`, `catalystScore`), behavioral vectors, community data, and progression all in one table. Key related models: `QuizResult`, `Mission`, `MissionSubmission`, `Guild`, `GuildMember`, `ContactMessage`.

### UI Stack

Radix UI primitives + TailwindCSS v4 + shadcn/ui wrappers (New York style, CSS variables). All shadcn components are in `components/ui/`. Framer Motion for animations, Sonner for toasts, next-themes for dark mode.

### Component Patterns

- Pages are server components by default; they fetch session and data server-side before rendering
- Interactive components are marked `"use client"` — quiz, onboarding, dashboard widgets
- Forms use React Hook Form + Zod validation

### API Routes

REST endpoints under `app/api/`:
- `quiz/` — POST quiz results, calculate profile classification
- `missions/` — GET available missions, POST submission
- `onboarding/` — POST onboarding data
- `user/update/` — PATCH user profile fields
- `contact/` — POST contact form submission
- `status/` — GET health check

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

The repo uses `.env.development` and `.env.production` for environment-specific Supabase instances, with `.env.local` for local overrides.

### Key Files

| File | Purpose |
|------|---------|
| `middleware.ts` | Session guard and onboarding funnel |
| `lib/auth.ts` | Better Auth configuration |
| `lib/db.ts` | Prisma singleton client |
| `lib/missions.ts` | Mission data and scoring logic |
| `prisma/schema.prisma` | Full data model |
| `components/ui/` | shadcn/ui base components |
| `next.config.mjs` | Build error suppression, unoptimized images |
