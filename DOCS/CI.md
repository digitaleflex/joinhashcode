# CI — Quality gates

JoinHashCode runs its quality gate on every pull request and on pushes to `main`.

Workflow: `.github/workflows/ci.yml`

## Checks

The workflow runs in an isolated GitHub Actions runner with a temporary PostgreSQL 16 database.

1. Install dependencies with the committed pnpm lockfile (`--frozen-lockfile`).
2. Generate and validate the Prisma client/schema.
3. Apply database migrations to the temporary PostgreSQL instance.
4. Run ESLint and the TypeScript check.
5. Run the Vitest unit/integration suite.
6. Scan tracked repository files for accidentally committed secrets.
7. Build the Next.js application in production mode.
8. Install Chromium and run the public-showcase Playwright suite against the production build.

CI credentials are disposable placeholders. The workflow does not connect to production services or use production secrets.

## Public E2E scope

The public showcase suite is configured by `playwright.public.config.ts` and currently verifies:

- Homepage title, primary proposition and main calls to action.
- The three active domains on `/programs`.
- Navigation from the homepage to a domain.
- FAQ visibility and expansion.
- Main public pages: About, Labs, Community and Talents.
- Mobile navigation at a 390px viewport.

It intentionally does not run the authenticated E2E global setup or the Academy seed. The Academy seed currently depends on LMS tables (including `Program`) that do not yet exist in the deployable migration history. This is a separate schema/migration task; the public CI gate must not claim to validate the Academy LMS until that migration work is complete.

## Known migration-history exception

The CI migration runner (`scripts/ci-migrate-deploy.sh`) handles one documented legacy inconsistency: migration `20260809000000_add_user_confidence_score` attempts to add `user.confidenceScore` even though it already exists from an earlier migration.

The runner skips that migration only when Prisma's recorded failure contains the exact duplicate-column error and the column is confirmed to exist. It resolves the migration as applied only in the disposable CI database, then reruns the remaining migrations. Any other migration failure remains blocking. No production migration history is rewritten.

## Pull request policy

A successful run is a quality signal for the code and routes covered above; it is not a substitute for human review, manual accessibility checks, production configuration review or security review. Keep pull requests open until the checks are green and the diff has been reviewed.
