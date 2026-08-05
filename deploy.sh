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

for arg in "$@"; do
  case "$arg" in
    --skip-build) SKIP_BUILD=true ;;
    --rebuild-image) REBUILD_IMAGE=true ;;
    --prod) ENV_FILE="--env-file /home/actions-runner/secrets/.env.production" ;;
    *) echo "Usage: $0 [--skip-build] [--rebuild-image] [--prod]"; exit 1 ;;
  esac
done

# ── 1. Build Next.js (incrémental grâce au cache) ─────────────
if [ "$SKIP_BUILD" = false ]; then
  echo "🔨 Building Next.js (incremental)..."
  npm run build
  echo "✅ Build complete"
fi

# ── 2. Optionnel : rebuild image runtime ──────────────────────
if [ "$REBUILD_IMAGE" = true ]; then
  echo "🐳 Rebuilding runtime Docker image..."
  docker compose -f "$COMPOSE_FILE" $ENV_FILE build web
fi

# ── 3. Restart container (rapide — pas de rebuild image) ──────
echo "🔄 Restarting web container..."
docker compose -f "$COMPOSE_FILE" $ENV_FILE up -d web --wait --no-build

echo "✅ Deploy complete — https://joinhashcode.com"
