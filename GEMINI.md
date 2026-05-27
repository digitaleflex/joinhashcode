# HASHCODE Community - Root Instructions

## Project Overview
HASHCODE is a community platform focused on project building, collaboration, and skill evolution. It uses a custom evolution engine (Vibrancy, Drift, Confidence) to track user progress.

## Tech Stack
- **Framework:** Next.js (App Router, TypeScript)
- **Database:** Prisma ORM (PostgreSQL)
- **Auth:** Better Auth
- **UI:** Tailwind CSS, Shadcn/UI, Lucide React
- **Icons:** Lucide React
- **Validation:** Zod
- **Toast:** Sonner

## Engineering Standards
- **Naming:** CamelCase for functions/variables, PascalCase for components.
- **Styling:** Prefer Vanilla CSS for complex animations, Tailwind for layout/spacing.
- **Security:** Follow EHAF Security Engineering Standard (Strict validation, no hardcoded secrets).
- **Architecture:** Keep logic inside `lib/` and UI inside `components/`.
- **Database:** 
  - **NEVER** use `npx prisma db push` for schema changes.
  - **ALWAYS** use `npx prisma migrate dev` to generate versioned migrations.
  - **PRODUCTION:** Use `npx prisma migrate deploy` during deployment.
  - **Validation:** Always verify generated SQL migrations before committing.

## Developer Velocity & Autonomy
To reduce authorization prompts and speed up implementation:
- **Auto-Edit Mode:** Start the CLI with `--approval-mode=auto_edit` to auto-approve surgical edits (`replace`, `write_file`) while retaining prompts for shell commands and destructive actions.
- **YOLO Mode:** For trusted environments where maximum speed is required, use `--yolo` (or `-y`) to auto-approve all actions.
- **Session Trust:** Use `--skip-trust` to bypass the workspace trust prompt on startup.

## Augmented Engineering Cockpit
- **Governance:** Use `.gemini/settings.json` for project-wide AI behavior.
- **Plan Mode:** Systematic use of `/plan` (or Shift+Tab) for architectural changes.
- **Slash Commands:** Use `/git:commit` for standardized commits.
- **Shift-Left Security:** All changes must be verified against security standards (Semgrep/SAST) if applicable.
- **Token Efficiency:** Prefer native CLI tools (git, npm) over complex MCP servers to save context.
- **Documentation:** Refer to `DOCS/ENGINEERING_STANDARD.md` for the full cockpit specification.

## Specialized Context
- **API Standards:** See `app/api/GEMINI.md`
- **UI/UX Standards:** See `components/GEMINI.md`
- **Evolution Logic:** Managed by `hashcode-evolution-engine` skill.
- **Mission Creation:** Managed by `hashcode-mission-architect` skill.

## Key Files
- `lib/evolution.ts`: Core evolution logic.
- `lib/auth.ts`: Authentication configuration.
- `prisma/schema.prisma`: Database models.
- `lib/missions.ts`: Mission definitions.
