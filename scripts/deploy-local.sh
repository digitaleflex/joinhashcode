#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
# Déploiement HASHCODE depuis le VPS (sans GitHub Actions).
#
# Le VPS tire directement le dernier code depuis GitHub, build le
# standalone, puis redémarre le conteneur web avec les bind mounts.
#
# Usage :
#   bash scripts/deploy-local.sh
# ────────────────────────────────────────────────────────────────
set -euo pipefail

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$APP_DIR"

ENV_FILE="${HASHCODE_ENV_FILE:-$APP_DIR/.env.production}"
if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: env file manquant : $ENV_FILE"
  exit 1
fi

echo "=== 1/6 git pull ==="
git pull --ff-only origin main

echo "=== 2/6 pnpm install ==="
pnpm install --frozen-lockfile

echo "=== 3/6 build standalone ==="
set -a
source "$ENV_FILE"
set +a
pnpm run build

echo "=== 4/6 symlinks standalone ==="
ln -sfn ../../static .next/standalone/.next/static
ln -sfn ../../public .next/standalone/public

echo "=== 4.5/6 cache dir standalone ==="
mkdir -p .next/standalone/.next/cache
chmod 777 .next/standalone/.next/cache

echo "=== 5/6 docker compose up ==="
docker compose -f compose.app.yml \
  --env-file "$ENV_FILE" \
  up -d web --force-recreate

echo "=== 6/6 healthcheck ==="
MAX_ATTEMPTS=12
ATTEMPTS=0
while [ "$ATTEMPTS" -lt "$MAX_ATTEMPTS" ]; do
  HEALTH=$(docker inspect --format='{{json .State.Health.Status}}' hashcode-web 2>/dev/null || echo '"unknown"')
  echo "Health: $HEALTH (attempt $((ATTEMPTS + 1))/$MAX_ATTEMPTS)"
  if [ "$HEALTH" = '"healthy"' ]; then
    echo "=== deploy OK ==="
    exit 0
  fi
  if [ "$HEALTH" = '"unhealthy"' ]; then
    break
  fi
  sleep 10
  ATTEMPTS=$((ATTEMPTS + 1))
done
echo "❌ Deploy failed: container never became healthy"
docker logs hashcode-web --tail 60 || true
exit 1
