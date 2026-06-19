#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
# HASHCODE — Healthcheck + alertes basiques
# Vérifie la DB et les conteneurs web. Envoie une alerte si KO.
# Usage : ./scripts/healthcheck-alert.sh
# ────────────────────────────────────────────────────────────────
set -euo pipefail

ENV_FILE="/home/actions-runner/secrets/.env.production"
LOG_DIR="/home/audest/backups/hashcode/logs"
LOG_FILE="${LOG_DIR}/healthcheck.log"
ALERT_STATE_FILE="${LOG_DIR}/.alert_state"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck source=/dev/null
  . "$ENV_FILE"
  set +a
fi

DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-hashcode}"
DB_CONTAINER="hashcode-db"
WEB_CONTAINERS=("hashcode-web-a" "hashcode-web-b")
DISCORD_WEBHOOK="${DISCORD_WEBHOOK_URL:-}"
ADMIN_EMAIL="${ADMIN_EMAIL:-}"

mkdir -p "$LOG_DIR"

log() {
  local msg="$1"
  echo "[$(date -Iseconds)] $msg" | tee -a "$LOG_FILE"
}

send_discord_alert() {
  local message="$1"
  if [[ -z "$DISCORD_WEBHOOK" ]]; then
    return 0
  fi
  curl -fsS -X POST "$DISCORD_WEBHOOK" \
    -H "Content-Type: application/json" \
    -d "{\"content\":\"🚨 **HASHCODE ALERT** 🚨\n$message\"}" >/dev/null 2>&1 || true
}

alert() {
  local message="$1"
  log "ALERT: $message"
  send_discord_alert "$message"

  # Écrit l'état d'alerte pour éviter le spam (une seule alerte jusqu'à récupération)
  echo "ALERT" > "$ALERT_STATE_FILE"
}

recover() {
  if [[ -f "$ALERT_STATE_FILE" ]]; then
    log "RECOVERY: Tous les services sont de nouveau OK."
    send_discord_alert "✅ Tous les services HASHCODE sont de nouveau opérationnels."
    rm -f "$ALERT_STATE_FILE"
  fi
}

ERRORS=""

# 1. Vérification DB
if ! docker exec "$DB_CONTAINER" pg_isready -U "$DB_USER" -d "$DB_NAME" >/dev/null 2>&1; then
  ERRORS+="- PostgreSQL ($DB_CONTAINER / $DB_NAME) ne répond pas.\n"
fi

# 2. Vérification conteneurs web
for container in "${WEB_CONTAINERS[@]}"; do
  if ! docker inspect --format='{{.State.Health.Status}}' "$container" 2>/dev/null | grep -q "healthy"; then
    ERRORS+="- Conteneur $container n'est pas healthy.\n"
  fi
done

# 3. Vérification endpoint public critique
if ! curl -fsS -m 10 "https://www.joinhashcode.com/api/status" >/dev/null 2>&1; then
  ERRORS+="- Endpoint public /api/status inaccessible.\n"
fi

if [[ -n "$ERRORS" ]]; then
  alert "Problèmes détectés sur le serveur HASHCODE :\n$ERRORS"
else
  log "OK: DB, conteneurs web et endpoint public sont healthy."
  recover
fi
