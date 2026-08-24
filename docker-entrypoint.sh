#!/bin/sh
set -e

# Fix: Next.js standalone build doesn't include static files.
# The symlink .next/standalone/.next/static → ../../static is needed
# to serve CSS/JS/fonts. Bind mounts or rebuilds can wipe it.
STATIC_LINK="/app/.next/standalone/.next/static"
if [ ! -L "$STATIC_LINK" ]; then
  echo "🔗 Recreating static symlink..."
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
