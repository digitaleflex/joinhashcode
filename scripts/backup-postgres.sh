#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
# HASHCODE — Backup quotidien PostgreSQL + notif Discord
# Usage : ./scripts/backup-postgres.sh
# ────────────────────────────────────────────────────────────────
set -euo pipefail

# ── Configuration ──────────────────────────────────────────────
PROJECT_NAME="hashcode"
ENV_FILE="/home/actions-runner/secrets/.env.production"
BACKUP_DIR="/home/audest/backups/${PROJECT_NAME}/postgres"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${PROJECT_NAME}_${TIMESTAMP}.sql.gz"
ERROR_MSG=""

# ── Notifications Discord ──────────────────────────────────────
send_discord() {
  local title="$1"
  local message="$2"
  local color="$3"
  local webhook="${DISCORD_WEBHOOK_URL:-}"

  if [[ -z "$webhook" ]]; then
    return 0
  fi

  curl -fsS -X POST "$webhook" \
    -H "Content-Type: application/json" \
    -d "{\"embeds\":[{\"title\":\"$title\",\"description\":\"$message\",\"color\":$color,\"timestamp\":\"$(date -Iseconds)\"}]}" \
    >/dev/null 2>&1 || true
}

trap_on_error() {
  ERROR_MSG="$1"
  echo "[BACKUP] ÉCHEC : $ERROR_MSG" >&2
  send_discord \
    "🚨 Backup HASHCODE — ÉCHEC" \
    "**Erreur :** $ERROR_MSG\n**Fichier :** $BACKUP_FILE\n**Heure :** $(date '+%d/%m/%Y %H:%M:%S')" \
    15548997
  exit 1
}

trap 'trap_on_error "Erreur inattendue à la ligne $LINENO"' ERR

# ── Chargement des credentials ─────────────────────────────────
if [[ -f "$ENV_FILE" ]]; then
  # shellcheck source=/dev/null
  set -a
  # shellcheck source=/dev/null
  . "$ENV_FILE"
  set +a
else
  echo "[ERROR] Fichier env introuvable : $ENV_FILE" >&2
  exit 1
fi

DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="hashcode_prod"
CONTAINER_NAME="db"

mkdir -p "$BACKUP_DIR"

echo "[BACKUP] Démarrage du backup de ${DB_NAME}..."

# ── Dump PostgreSQL ────────────────────────────────────────────
PGPASSWORD="$DB_PASSWORD" docker exec -i "$CONTAINER_NAME" \
  pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --create \
  | gzip > "$BACKUP_FILE"

BACKUP_SIZE=$(stat -c%s "$BACKUP_FILE" 2>/dev/null || stat -f%z "$BACKUP_FILE" 2>/dev/null)
BACKUP_SIZE_HR=$(numfmt --to=iec "$BACKUP_SIZE" 2>/dev/null || echo "${BACKUP_SIZE} bytes")
echo "[BACKUP] Backup créé : $BACKUP_FILE ($BACKUP_SIZE_HR)"

# ── Nettoyage ──────────────────────────────────────────────────
find "$BACKUP_DIR" -type f -name "${PROJECT_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete
BACKUP_COUNT=$(find "$BACKUP_DIR" -type f -name "${PROJECT_NAME}_*.sql.gz" | wc -l)
echo "[BACKUP] $BACKUP_COUNT backup(s) conservé(s) (rétention ${RETENTION_DAYS} jours)."

# ── Upload Backblaze B2 ────────────────────────────────────────
B2_STATUS="non configuré"
if [[ -n "${RCLONE_B2_ACCOUNT:-}" && -n "${RCLONE_B2_KEY:-}" && -n "${BACKUP_B2_BUCKET:-}" ]]; then
  echo "[BACKUP] Upload vers Backblaze B2 : $BACKUP_B2_BUCKET"
  export RCLONE_B2_ACCOUNT
  export RCLONE_B2_KEY
  if rclone copy "$BACKUP_FILE" "b2:${BACKUP_B2_BUCKET}/${PROJECT_NAME}/" --progress=false; then
    B2_STATUS="✅ Uploadé vers \`$BACKUP_B2_BUCKET\`"
  else
    B2_STATUS="⚠️ Échec upload B2"
  fi
fi

echo "[BACKUP] Terminé avec succès."

# ── Notification succès ────────────────────────────────────────
send_discord \
  "✅ Backup HASHCODE — OK" \
  "**Base :** \`$DB_NAME\`\n**Taille :** $BACKUP_SIZE_HR\n**Backups conservés :** $BACKUP_COUNT (${RETENTION_DAYS}j)\n**Backblaze B2 :** $B2_STATUS" \
  5763719
