# HASHCODE Community Platform

HASHCODE is an AI-driven tech talent profiling and community matching platform targeting African tech communities. Users complete an onboarding flow and psychometric quiz, get classified into one of four distinct archetypes, and join a corresponding community (Guild) to participate in projects, collaboration, and skill evolution.

## 🚀 Key Features

*   **Psychometric Profiling Quiz**: Classifies users into one of four professional profiles:
    *   🛠️ **Builder**
    *   🎨 **Creator**
    *   🧠 **Strategist**
    *   ⚡ **Catalyst**
*   **Custom Evolution Engine**: Tracks user progress using standard metrics:
    *   **Vibrancy**: Energy, activity, and contribution level.
    *   **Drift**: Path focus, exploration index, and behavioral alignment.
    *   **Confidence**: Skill depth, task success rate, and progression certainty.
*   **Onboarding & Interactive Funnel**: Enforces progression from registration, through onboarding, to community matching.
*   **Missions & Collaboration**: Enables users to accept, submit, and grow through missions inside their Guild.

---

## 🛠️ Technology Stack

*   **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
*   **Styling & UI**: Tailwind CSS v4, [Radix UI](https://www.radix-ui.com/) Primitives, Shadcn/UI (New York style), Lucide React Icons, Framer Motion for premium micro-animations, and Sonner for toasts
*   **Database & ORM**: PostgreSQL (Supabase) + [Prisma ORM 7](https://www.prisma.io/) with PgBouncer connection pooling
*   **Authentication**: [Better Auth](https://www.better-auth.com/) with Prisma adapter and NextCookies session storage (Google, GitHub, Magic Link)
*   **Validation**: [Zod](https://zod.dev/) and React Hook Form
*   **Testing**: [Vitest](https://vitest.dev/)

---

## 📂 Architecture & Key Components

*   `app/` — Pages and REST API routes (`app/api/`)
*   `components/` — UI components and shadcn/ui base wrappers (`components/ui/`)
*   `lib/` — Shared business logic, database client, evolution engine, missions scoring, and authentication configuration
*   `prisma/` — Database schema (`schema.prisma`) and seed configurations
*   `middleware.ts` — Handles user session validation and onboarding funnel enforcement

### Onboarding Funnel Routing
The middleware enforces a three-stage workflow:
1. **No active session** ➡️ Redirects to `/signin`
2. **Session active, but no `currentSituation`** ➡️ Redirects to `/onboarding`
3. **Session active, onboarding completed, but no profile class assigned** ➡️ Redirects to `/quiz`

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
npx vitest run __tests__/smoke.test.tsx

# Lint the codebase
pnpm lint

# Open Prisma Studio to browse your database locally
npx prisma studio

# Push database schema changes directly (dev mode)
npx prisma db push
```

### 🐳 Docker & Local Environment

We provide a specialized local environment setup using Docker to run both the database and the web application in a consistent containerized environment.

```bash
# Start the full local environment (Web + DB + Adminer)
# Requires Git Bash, WSL, or Linux/Mac
./dev.sh
```

- **Web App**: [http://localhost:3000](http://localhost:3000)
- **Adminer (DB Management)**: [http://localhost:8081](http://localhost:8081)
- **Local DB Port**: `5434` (external) / `5432` (internal)

---

## 🔒 Security & Guidelines

This codebase strictly adheres to the **EHAF Security Engineering Standard**:
*   Never trust external input: validate all inputs using strict Zod schemas server-side.
*   Enforce authentication checks server-side.
*   Ensure environment variables (`.env`, `.env.local`) are kept out of source control.
*   Prevent SQL injection by relying on parameterized queries built-in to Prisma.
