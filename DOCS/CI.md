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

It intentionally does not run the authenticated E2E global setup or the Academy seed. The public route diagnostics previously reported missing tables for `Atelier`, `Intervention` and `Course`; the corrective migration `20261031000000_fix_missing_tables_and_columns` now creates them (plus `Program` and the Better Auth `twoFactor`/`passkey` tables), and the whole history replays cleanly from an empty PostgreSQL 16 database. Authenticated/LMS flows are still not claimed by the public CI gate until their own E2E coverage exists.

## Migration history

`prisma migrate deploy` is replayed from an empty PostgreSQL 16 service on every CI run with no exception or manual `resolve`. The historical duplicate add of `user.confidenceScore` is now idempotent (`ADD COLUMN IF NOT EXISTS`), so the same history works on empty and already-migrated databases. Any migration failure is blocking.


## Pull request policy

A successful run is a quality signal for the code and routes covered above; it is not a substitute for human review, manual accessibility checks, production configuration review or security review. Keep pull requests open until the checks are green and the diff has been reviewed.
