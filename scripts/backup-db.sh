#!/bin/sh
set -e

# ────────────────────────────────────────────────────────────────
# backup-db.sh — PostgreSQL backup for HASHCODE with email notif
#
# Usage (manual):
#   docker compose -f compose.db-backup.yml exec db-backup /app/backup-db.sh
#
# Automated via cron at 03:00 daily.
# Backups stored in named volume `hashcode-db-backups`.
# Email sent to ADMIN_EMAIL on success/failure via Resend API.
# ────────────────────────────────────────────────────────────────

BACKUP_DIR="/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_HOST="${DB_HOST:-db}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-hashcode}"
DB_USER="${DB_USER:-hashcode}"
FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql.gz"
ADMIN_EMAIL="${ADMIN_EMAIL:-ghostehaf@gmail.com}"
RESEND_API_KEY="${RESEND_API_KEY:-}"
APP_URL="${APP_URL:-https://joinhashcode.com}"

send_notification() {
  local status="$1"
  local message="$2"
  local color="$3"  # green or red

  if [ -z "$RESEND_API_KEY" ]; then
    echo "⚠️  RESEND_API_KEY not set — skipping email notification"
    return 0
  fi

  curl -s --max-time 10 \
    -H "Authorization: Bearer ${RESEND_API_KEY}" \
    -H "Content-Type: application/json" \
    "https://api.resend.com/emails" \
    -d "{
      \"from\": \"HASHCODE Backup <noreply@joinhashcode.com>\",
      \"to\": [\"${ADMIN_EMAIL}\"],
      \"subject\": \"[${status}] Backup PostgreSQL — ${DB_NAME}\",
      \"html\": \"<div style='font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px;'><div style='background:${color};color:white;padding:12px 20px;border-radius:8px 8px 0 0;'><h2 style='margin:0;'>${status} — Backup DB</h2></div><div style='border:1px solid #e5e7eb;border-top:none;padding:20px;border-radius:0 0 8px 8px;'><p>${message}</p><table style='width:100%;border-collapse:collapse;margin-top:12px;'><tr><td style='padding:6px 0;color:#6b7280;'>Database</td><td style='padding:6px 0;font-weight:600;'>${DB_NAME}</td></tr><tr><td style='padding:6px 0;color:#6b7280;'>Timestamp</td><td style='padding:6px 0;font-weight:600;'>${TIMESTAMP}</td></tr><tr><td style='padding:6px 0;color:#6b7280;'>File</td><td style='padding:6px 0;font-weight:600;'>$(basename $FILE)</td></tr></table><p style='margin-top:16px;font-size:12px;color:#9ca3af;'>Backup auto — ${APP_URL}</p></div></div>\"
    }" > /dev/null 2>&1 && echo "📧 Email notification sent to ${ADMIN_EMAIL}" || echo "⚠️  Failed to send email notification"
}

# Trap errors to send failure notification
trap 'send_notification "❌ ÉCHEC" "Le backup de la base <b>${DB_NAME}</b> a échoué. Vérifie les logs du container <code>hashcode-db-backup</code>." "#dc2626"' ERR

mkdir -p "$BACKUP_DIR"

echo "📦 Dumping database ${DB_NAME}..."
pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
  --no-owner --no-acl --clean --if-exists \
  | gzip > "$FILE"

FILESIZE=$(du -h "$FILE" | cut -f1)
FILECOUNT=$(ls -1 ${BACKUP_DIR}/${DB_NAME}_*.sql.gz 2>/dev/null | wc -l)
echo "✅ Backup saved: ${FILE} (${FILESIZE})"

# Keep only last 7 backups
echo "🧹 Cleaning old backups (keeping last 7)..."
ls -1t "${BACKUP_DIR}/${DB_NAME}_"*.sql.gz 2>/dev/null | tail -n +8 | xargs -r rm -v

REMAINING=$(ls -1 ${BACKUP_DIR}/${DB_NAME}_*.sql.gz 2>/dev/null | wc -l)
echo "✅ Done. ${REMAINING} backup(s) retained."

# Send success notification
send_notification "✅ SUCCÈS" "Backup de la base <b>${DB_NAME}</b> terminé avec succès.<br><b>Taille :</b> ${FILESIZE}<br><b>Sauvegardes conservées :</b> ${REMAINING}/7" "#16a34a"
