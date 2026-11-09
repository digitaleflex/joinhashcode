# JoinHashCode — HASHCODE Community Platform

JoinHashCode est la plateforme de HashCode Community. Elle aide les personnes qui
souhaitent évoluer dans le numérique à **découvrir leur orientation, apprendre,
pratiquer, construire des preuves de compétences et accéder à des opportunités**.

Le produit couvre trois domaines actifs :
- **Web Development** — développement web et construction de produits numériques.
- **Cybersécurité** — sécurité, pratique encadrée, labs et investigation.
- **IA appliquée** — compréhension et création de solutions intégrant l'intelligence artificielle.

L'expérience repose sur un compte et un profil unifiés. Les parcours, ressources et
premières actions sont proposés selon le domaine choisi et les capacités réellement
disponibles. Les contenus et fonctionnalités avancés sont livrés progressivement ;
la plateforme ne doit pas présenter comme disponible une capacité qui n'est pas encore
implémentée et testée.

## Principes produit

- **Apprendre par la pratique** : chaque domaine doit proposer des activités concrètes.
- **Prouver plutôt que simplement déclarer** : les réalisations et validations doivent
  être traçables.
- **Une expérience unifiée** : identité, profil, onboarding et espace membre partagés.
- **Communauté et opportunités** : la plateforme complète les rituels communautaires
  existants, elle ne prétend pas les remplacer.
- **Transparence** : les contenus, niveaux de maturité et fonctionnalités réellement
  disponibles sont présentés honnêtement.

## Fonctionnalités principales

- Inscription, authentification et onboarding.
- Profil membre et orientation.
- Espaces d'apprentissage et ressources.
- Missions, labs ou activités pratiques selon les domaines activés.
- Soumission de réalisations et mécanismes de validation lorsqu'ils sont disponibles.
- Outils communautaires et administration.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling & UI**: Tailwind CSS v4, [Radix UI](https://www.radix-ui.com/) Primitives, Shadcn/UI (New York style), Lucide React Icons, Framer Motion for premium micro-animations, and Sonner for toasts
- **Database & ORM**: PostgreSQL + [Prisma ORM 7](https://www.prisma.io/) with PgBouncer connection pooling
- **Authentication**: [Better Auth](https://www.better-auth.com/) with Prisma adapter and NextCookies session storage (Google, GitHub, Magic Link)
- **Validation**: [Zod](https://zod.dev/) and React Hook Form
- **Testing**: [Vitest](https://vitest.dev/)

---

## 📂 Architecture & Key Components

- `app/` — Pages and REST API routes (`app/api/`)
- `components/` — UI components and shadcn/ui base wrappers (`components/ui/`)
- `lib/` — Shared business logic, database client, evolution engine, missions scoring, and authentication configuration
- `prisma/` — Database schema (`schema.prisma`) and seed configurations
- `proxy.ts` — Handles user session validation and onboarding funnel enforcement

### Onboarding Funnel Routing

The middleware enforces a three-stage workflow:

1. **No active session** ➡️ Redirects to `/signin`
2. **Session active, but no `currentSituation`** ➡️ Redirects to `/onboarding`
3. **Session active, onboarding completed, but no profile class assigned** ➡️ Redirects to `/quiz`
4. **Profile class assigned, but no domain chosen** ➡️ Redirects to `/specialization`

### Progression : des preuves, pas des points

Il n'y a ni XP, ni niveaux, ni badges, ni squads (décisions D-027 et D-029, novembre 2026).
Tous les labs sont accessibles ; ce qui compte, ce sont les **labs validés**, visibles dans le
Portfolio et le Vivier. Un membre peut relire les soumissions des autres après 3 labs validés.

---

## 💻 Quick Start & Commands

Manage packages and run dependencies via `pnpm`:

```bash
# Start development server (generates Prisma client and boots dev on port 3000)
pnpm dev

# Build the production application
pnpm build

# Run the test suite using Vitest
pnpm test

# Run a single test
pnpm exec vitest run __tests__/smoke.test.tsx

# Quality gate before each commit (types + lint + Prisma schema)
pnpm verify:fast

# Full gate (+ HTTP probes on :3000 + Playwright)
pnpm verify

# Find unused files, exports and dependencies
pnpm exec knip

# Lint the codebase
pnpm lint

# Open Prisma Studio to browse your database locally
pnpm exec prisma studio

# Generate Prisma client
pnpm exec prisma generate

# Apply migrations and update database schema (dev mode)
pnpm exec prisma migrate dev --name <description>
```

Node 22 is required (`.nvmrc`). The local production build needs `REDIS_URL` in the Upstash
REST format (`https://…`); otherwise run `REDIS_URL= REDIS_TOKEN= pnpm build` to use the
in-memory rate-limit fallback.

### 🐳 Docker

- `compose.db.yml` — PostgreSQL + PgBouncer + Adminer (the database stack, started once).
- `compose.app.yml` — the production `web` service behind Traefik.
- Deployment: `./deploy.sh --image` pulls the image built by CI (see `AGENTS.md`, « Deployment »).

---

## 🔒 Security & Guidelines

This codebase strictly adheres to the **EHAF Security Engineering Standard**:

- Never trust external input: validate all inputs using strict Zod schemas server-side.
- Enforce authentication checks server-side.
- Ensure environment variables (`.env`, `.env.local`) are kept out of source control.
- Prevent SQL injection by relying on parameterized queries built-in to Prisma.
