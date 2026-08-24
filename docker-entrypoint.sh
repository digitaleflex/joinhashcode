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

# Run Prisma migrations + start the app
echo "📦 Running Prisma migrations..."
prisma migrate deploy 2>&1

echo "🚀 Starting server..."
exec node /app/cluster.mjs
