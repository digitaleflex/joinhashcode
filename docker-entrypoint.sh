#!/bin/sh
set -e

# Fix: Next.js standalone build doesn't include static files.
# compose.app.yml mounts .next/static directly at
# /app/.next/standalone/.next/static. Only fall back to the legacy
# symlink when running the image without that mount.
# NB: never rm -rf the path — if it is a mountpoint, unlink fails
# (EBUSY) and with set -e the container would crash-loop.
STATIC_LINK="/app/.next/standalone/.next/static"
if [ ! -d "$STATIC_LINK" ]; then
  ln -sfn ../../static "$STATIC_LINK"
fi

# Run Prisma migrations — fail hard if migration fails
echo "📦 Running Prisma migrations..."
if ! prisma migrate deploy 2>&1; then
  echo "❌ Prisma migration failed — aborting startup"
  exit 1
fi

echo "🚀 Starting server..."
exec node /app/cluster.mjs
