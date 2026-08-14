#!/usr/bin/env bash
set -e

APP_DIR="/home/audest/hashcode-community"
STAGE="/tmp/hashcode-deploy"

if [ ! -d "$APP_DIR" ]; then
  echo "ERROR: app dir $APP_DIR missing"
  exit 1
fi
if [ ! -d "$STAGE/.next" ]; then
  echo "ERROR: staged build missing at $STAGE/.next"
  exit 1
fi

rm -rf "$APP_DIR/.next" "$APP_DIR/prisma" "$APP_DIR/generated" "$APP_DIR/public"
cp -r "$STAGE/.next" "$APP_DIR/.next"
cp -r "$STAGE/prisma" "$APP_DIR/prisma"
cp -r "$STAGE/generated" "$APP_DIR/generated"
cp -r "$STAGE/public" "$APP_DIR/public"
cp "$STAGE/Dockerfile" "$APP_DIR/Dockerfile" 2>/dev/null || true
cp "$STAGE/prisma.config.ts" "$APP_DIR/prisma.config.ts" 2>/dev/null || true
cp "$STAGE/compose.app.yml" "$APP_DIR/compose.app.yml" 2>/dev/null || true
cp "$STAGE/cluster.mjs" "$APP_DIR/cluster.mjs" 2>/dev/null || true

# Recréer les symlinks (la copie écrase les symlinks)
ln -sfn ../../static "$APP_DIR/.next/standalone/.next/static"
ln -sfn ../../public "$APP_DIR/.next/standalone/public"

cd "$APP_DIR"
docker rm -f hashcode-web 2>/dev/null || true
docker compose -f compose.app.yml \
  --env-file /home/actions-runner/secrets/.env.production \
  up -d web --force-recreate

sleep 12
HEALTH=$(docker inspect --format='{{json .State.Health.Status}}' hashcode-web 2>/dev/null || echo '"unknown"')
echo "Health: $HEALTH"
if [ "$HEALTH" != '"healthy"' ]; then
  docker logs hashcode-web --tail 50 || true
  exit 1
fi
echo "=== deploy OK ==="