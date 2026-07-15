#!/usr/bin/env bash
# ────────────────────────────────────────────────────────────────
# HASHCODE — Backup quotidien PostgreSQL
# Usage : ./scripts/backup-postgres.sh
# ────────────────────────────────────────────────────────────────
set -euo pipefail

# Configuration
PROJECT_NAME="hashcode"
ENV_FILE="/home/actions-runner/secrets/.env.production"
BACKUP_DIR="/home/audest/backups/${PROJECT_NAME}/postgres"
RETENTION_DAYS=7
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${PROJECT_NAME}_${TIMESTAMP}.sql.gz"

# Chargement des credentials depuis l'env de production
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
DB_NAME="${DB_NAME:-hashcode}"
CONTAINER_NAME="db"

mkdir -p "$BACKUP_DIR"

echo "[BACKUP] Démarrage du backup de ${DB_NAME}..."

# Dump via le conteneur Postgres et compression à la volée
PGPASSWORD="$DB_PASSWORD" docker exec -i "$CONTAINER_NAME" \
  pg_dump -U "$DB_USER" -d "$DB_NAME" --clean --if-exists --create \
  | gzip > "$BACKUP_FILE"

# Vérification taille
BACKUP_SIZE=$(stat -c%s "$BACKUP_FILE" 2>/dev/null || stat -f%z "$BACKUP_FILE" 2>/dev/null)
echo "[BACKUP] Backup créé : $BACKUP_FILE ($BACKUP_SIZE bytes)"

# Nettoyage des vieux backups
find "$BACKUP_DIR" -type f -name "${PROJECT_NAME}_*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Liste des backups restants
BACKUP_COUNT=$(find "$BACKUP_DIR" -type f -name "${PROJECT_NAME}_*.sql.gz" | wc -l)
echo "[BACKUP] $BACKUP_COUNT backup(s) conservé(s) (rétention ${RETENTION_DAYS} jours)."

# Optionnel : upload vers Backblaze B2 si configuré
if [[ -n "${RCLONE_B2_ACCOUNT:-}" && -n "${RCLONE_B2_KEY:-}" && -n "${BACKUP_B2_BUCKET:-}" ]]; then
  echo "[BACKUP] Upload vers Backblaze B2 : $BACKUP_B2_BUCKET"
  export RCLONE_B2_ACCOUNT
  export RCLONE_B2_KEY
  rclone copy "$BACKUP_FILE" "b2:${BACKUP_B2_BUCKET}/${PROJECT_NAME}/" --progress=false
fi

echo "[BACKUP] Terminé avec succès."
