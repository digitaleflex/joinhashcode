#!/usr/bin/env bash
# CI migration runner.
#
# The migration history is now replayable from a fresh PostgreSQL database
# without any exception: the legacy duplicate-add of `user.confidenceScore`
# was made idempotent (`ADD COLUMN IF NOT EXISTS`), so `prisma migrate deploy`
# succeeds on both empty and already-migrated databases.
#
# Any migration failure is therefore blocking: no bypass, no resolve.
set -euo pipefail

exec pnpm exec prisma migrate deploy
