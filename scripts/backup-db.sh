#!/bin/sh
set -e

# ────────────────────────────────────────────────────────────────
# backup-db.sh — PostgreSQL backup for HASHCODE
#
# Usage (manual):
#   docker compose -f compose.db.yml exec db /app/backup-db.sh
#
# Automated via cron (compose.db.yml healthcheck-sidecar or host cron).
# Backups are stored in the named volume `hashcode-db-backups`.
# ────────────────────────────────────────────────────────────────

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-hashcode}"
DB_USER="${DB_USER:-hashcode}"
FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "📦 Dumping database ${DB_NAME}..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --no-owner --no-acl --clean --if-exists \
  | gzip > "$FILE"

FILESIZE=$(du -h "$FILE" | cut -f1)
echo "✅ Backup saved: ${FILE} (${FILESIZE})"

# Keep only last 7 backups
echo "🧹 Cleaning old backups (keeping last 7)..."
ls -1t "${BACKUP_DIR}/${DB_NAME}_"*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -v

echo "✅ Done. $(ls -1 ${BACKUP_DIR}/${DB_NAME}_*.sql.gz 2>/dev/null | wc -l) backup(s) retained."
