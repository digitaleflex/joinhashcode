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
CONTAINER_NAME="hashcode-db"

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

# Optionnel : upload vers un stockage externe si configuré
if [[ -n "${BACKUP_S3_BUCKET:-}" && -n "${AWS_ACCESS_KEY_ID:-}" && -n "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  echo "[BACKUP] Upload vers S3 : $BACKUP_S3_BUCKET"
  aws s3 cp "$BACKUP_FILE" "s3://${BACKUP_S3_BUCKET}/${PROJECT_NAME}/$(basename "$BACKUP_FILE")" --storage-class STANDARD_IA
fi

echo "[BACKUP] Terminé avec succès."
