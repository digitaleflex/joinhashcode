#!/usr/bin/env bash
set -euo pipefail

# ────────────────────────────────────────────────────────────────
# deploy.sh — Quick deployment script for HASHCODE (VPS Docker)
# Usage:
#   ./scripts/deploy.sh                        # default env file
#   ./scripts/deploy.sh --env-file /path/to/.env
#   ./scripts/deploy.sh --skip-git-pull
#   ./scripts/deploy.sh --help
# ────────────────────────────────────────────────────────────────

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR"

ENV_FILE="/home/actions-runner/secrets/.env.production"
SKIP_GIT=false

show_help() {
  sed -n '4,10p' "$0"
  exit 0
}

# ── Parse args ─────────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file) ENV_FILE="$2"; shift 2 ;;
    --skip-git-pull) SKIP_GIT=true; shift ;;
    --help|-h) show_help ;;
    *) echo "❌ Unknown option: $1"; show_help ;;
  esac
done

echo "╔══════════════════════════════════════════════╗"
echo "║   HASHCODE — Quick Deploy                    ║"
echo "╚══════════════════════════════════════════════╝"

# ── Git pull ───────────────────────────────────────────────────
if [ "$SKIP_GIT" = false ]; then
  echo ""
  echo "▸ Pulling latest changes from git…"
  git fetch origin
  git checkout main 2>/dev/null || true

  if ! git diff --quiet HEAD; then
    echo "  ⚠️  Uncommitted changes detected. Stashing…"
    git stash --include-untracked
  fi

  BEFORE=$(git rev-parse HEAD)
  git pull origin main
  AFTER=$(git rev-parse HEAD)

  if [ "$BEFORE" = "$AFTER" ] && [ "$SKIP_GIT" = false ]; then
    echo "  ✓ Already up to date."
  fi
fi

# ── Build Next.js ──────────────────────────────────────────────
echo ""
echo "▸ Building Next.js application…"
npm run build 2>&1

# ── Standalone assets ──────────────────────────────────────────
# Les assets (static + public) sont fournis par des mounts compose
# directs (compose.app.yml). Supprimer les symlinks hérités pour que
# les mounts s'appliquent sur des chemins propres.
echo ""
echo "▸ Removing legacy standalone asset symlinks…"
rm -f .next/standalone/.next/static .next/standalone/public

# ── Docker build ───────────────────────────────────────────────
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
IMAGE_TAG="hashcode-web:${TIMESTAMP}"
LATEST_TAG="hashcode-web:latest"

echo ""
echo "▸ Building Docker image (${IMAGE_TAG})…"
echo "  (this may take 2-4 minutes)"
docker build \
  --platform linux/amd64 \
  --tag "$IMAGE_TAG" \
  --tag "$LATEST_TAG" \
  --label "built_at=$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
  --label "commit=$(git rev-parse HEAD)" \
  -f Dockerfile .

echo ""
echo "  ✓ Image built:"
echo "    - ${IMAGE_TAG}"
echo "    - ${LATEST_TAG}"

# ── Validate env file ──────────────────────────────────────────
if [ ! -f "$ENV_FILE" ]; then
  echo "  ❌ Env file not found: $ENV_FILE"
  exit 1
fi

# ── Deploy ─────────────────────────────────────────────────────
echo ""
echo "▸ Deploying with compose.app.yml…"

# Remove old container if it still exists (avoids name conflict)
docker rm -f hashcode-web 2>/dev/null || true

docker compose -f compose.app.yml \
  --env-file "$ENV_FILE" \
  up -d web --wait --pull missing

echo ""
echo "  ✓ Container is up"

# ── Health check ───────────────────────────────────────────────
echo ""
echo "▸ Running health check…"

HEALTH=$(docker inspect --format='{{json .State.Health.Status}}' hashcode-web 2>/dev/null || echo "unknown")

if [ "$HEALTH" = "\"healthy\"" ]; then
  echo "  ✓ Health check passed !"
else
  echo "  ⚠️  Health status: ${HEALTH}"
  echo "  → Checking again in 15s…"
  sleep 15
  HEALTH=$(docker inspect --format='{{json .State.Health.Status}}' hashcode-web)
  if [ "$HEALTH" = "\"healthy\"" ]; then
    echo "  ✓ Health check passed !"
  else
    echo "  ❌ Container not healthy (status: ${HEALTH})"
    echo "  → Check logs: docker logs hashcode-web --tail 50"
    # Quick rollback
    echo ""
    echo "▸ Rolling back to previous image…"
    docker tag "$(docker images --format '{{.Repository}}:{{.Tag}}' | grep hashcode-web | head -2 | tail -1)" hashcode-web:latest 2>/dev/null || true
    echo "  → Rollback done. Run deploy again after fixing."
    exit 1
  fi
fi

# ── Cleanup old images ─────────────────────────────────────────
echo ""
echo "▸ Cleaning up old images (keeping last 3)…"
docker images --format '{{.Repository}}:{{.Tag}}' \
  | grep '^hashcode-web:' \
  | grep -v ':latest$' \
  | tail -n +4 \
  | xargs -r docker rmi 2>/dev/null || true

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║   ✅  Deploy complete                        ║"
echo "║   Image : ${IMAGE_TAG}                       "
echo "║   Commit: $(git rev-parse --short HEAD)      "
echo "╚══════════════════════════════════════════════╝"
