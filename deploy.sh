#!/usr/bin/env bash
set -euo pipefail

# ────────────────────────────────────────────────────────────────
# deploy.sh — Déploiement incrémental HASHCODE
#
# Usage :
#   ./deploy.sh                         → build + restart
#   ./deploy.sh --skip-build            → restart seulement
#   ./deploy.sh --rebuild-image         → rebuild image runtime + restart
#   ./deploy.sh --prod                  = --env-file /home/actions-runner/secrets/.env.production
#
# Principe :
#   Le code source est bind-mounté dans le conteneur (compose.app.yml).
#   On ne rebuild l'image Docker que si --rebuild-image est passé.
# ────────────────────────────────────────────────────────────────

COMPOSE_FILE="compose.app.yml"
ENV_FILE=""

# ── Parse args ────────────────────────────────────────────────
SKIP_BUILD=false
REBUILD_IMAGE=false
IMAGE_MODE=false

for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    --rebuild-image) REBUILD_IMAGE=true ;;
    --image) IMAGE_MODE=true ; COMPOSE_FILE="compose.app.image.yml" ;;
    --prod) ENV_FILE="--env-file /home/actions-runner/secrets/.env.production" ;;
    *) echo "Usage: $0 [--skip-build] [--rebuild-image] [--image] [--prod]"; exit 1 ;;
  esac
done

if [ "$IMAGE_MODE" = true ]; then
  echo "📦 Image mode — pull depuis GHCR (aucun build VPS)"
  docker compose -f "$COMPOSE_FILE" $ENV_FILE pull web
  echo "🔄 Recreating web container from image..."
  docker compose -f "$COMPOSE_FILE" $ENV_FILE up -d web --wait --no-build --force-recreate
else

# ── 1. Build Next.js (incrémental grâce au cache) ─────────────
if [ "$SKIP_BUILD" = false ] && [ "$IMAGE_MODE" = false ]; then
  echo "🔨 Building Next.js (incremental)..."
  npm run build
  echo "✅ Build complete"
fi

# ── 1b. Cleanup anciens symlinks (remplacés par des mounts compose ─
#      directs : standalone/.next/static et standalone/public)
echo "🧹 Removing legacy standalone symlinks..."
rm -f .next/standalone/.next/static .next/standalone/public

# ── 2. Optionnel : rebuild image runtime (mode bind-mount uniquement) ──
if [ "$REBUILD_IMAGE" = true ] && [ "$IMAGE_MODE" = false ]; then
  echo "🐳 Rebuilding runtime Docker image..."
  docker compose -f "$COMPOSE_FILE" $ENV_FILE build web
fi

# ── 3. Restart container (rapide — pas de rebuild image) ──────
if [ "$IMAGE_MODE" = false ]; then
  echo "🔄 Restarting web container..."
  # --force-recreate est requis : le code est bind-mounté (.next/standalone),
  # donc compose ne détecte aucun changement et ne redémarrerait jamais le process.
  docker compose -f "$COMPOSE_FILE" $ENV_FILE up -d web --wait --no-build --force-recreate
fi

# ── 4. Vérification assets CSS/JS (garde-fou anti-404) ────────
# Le healthcheck /api/status ne détecte pas les assets cassés.
echo "🎨 Verifying static assets..."
CSS_PATH=$(docker exec hashcode-web sh -c \
  'wget -qO- http://127.0.0.1:3000/ | grep -o "/_next/static/[^\"]*\.css" | head -n1') || true
if [ -z "$CSS_PATH" ]; then
  echo "❌ No CSS asset reference found in homepage HTML"
  docker logs hashcode-web --tail 30 || true
  exit 1
fi
if ! docker exec hashcode-web wget -q -O /dev/null "http://127.0.0.1:3000${CSS_PATH}"; then
  echo "❌ Static asset ${CSS_PATH} → HTTP error (404?) — deploy KO"
  exit 1
fi
echo "✅ Static assets OK (${CSS_PATH} → 200)"

echo "✅ Deploy complete — https://joinhashcode.com"
