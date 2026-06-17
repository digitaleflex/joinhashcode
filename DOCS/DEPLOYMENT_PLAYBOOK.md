# Deployment Playbook

## Architecture

### Compose Files

| File | Purpose | Managed by |
|---|---|---|
| `compose.db.yml` | PostgreSQL + Adminer | Independent — never touched by deploy |
| `compose.app.yml` | Web app (web-a / web-b) | Pipeline — blue-green deploy |
| `compose.yaml` | Combined file for local dev only | Developers |
| `compose.blue.yml` | **Deprecated** — kept for reference | N/A |

The database and application are **fully separated** to prevent accidental data loss.

### Blue-Green Deployment (no docker rename)

Two fixed services run side-by-side with **identical Traefik labels**:

- `web-a` → container `hashcode-web-a`
- `web-b` → container `hashcode-web-b`

**How it works:**
1. Pipeline detects which container is currently active
2. Starts the inactive one with the new image
3. Waits for health check (`--wait` flag)
4. Stops the old container
5. Traefik auto-routes to the running container

No `docker rename`, no port conflicts, no downtime.

---

## Secrets Management

### Production secrets are stored outside the project directory:

```
/home/actions-runner/secrets/.env.production
```

- **Never copied or renamed** during deployment
- Referenced by **absolute path** in `compose.app.yml` and pipeline
- File permissions: `600` (owner only)
- Local `.env.production` in project root is for development only

### GitHub Secrets required:

| Secret | Description |
|---|---|
| `SSH_PATH` | Deploy directory on VPS (`/home/audest/hashcode-community`) |
| `GH_PAT` | GitHub Personal Access Token with repo scope |
| `B2_KEY_ID` | Backblaze B2 Application Key ID |
| `B2_APP_KEY` | Backblaze B2 Application Key |
| `B2_BUCKET` | B2 bucket name (`hashcode-backups`) |

### VPS Setup (one-time):

```bash
# Install rclone for B2 sync
sudo apt install -y rclone

# Configure rclone (already done on this VPS)
rclone config  # name: b2, type: b2

# Create production env file (one-time)
sudo mkdir -p /home/actions-runner/secrets
sudo cp /home/audest/hashcode-community/.env.production /home/actions-runner/secrets/
sudo chmod 600 /home/actions-runner/secrets/.env.production
```

---

## Backup System

Three-layer backup strategy:

| Layer | When | Target | Retention |
|---|---|---|---|
| 1. **Pre-migration** | Every deploy | Local (VPS) + GitHub Artifacts + B2 | 10 local / 30 days |
| 2. **Daily scheduled** | Every night at 00:00 UTC | Local (VPS) + GitHub Artifacts + B2 | 30 local / 30 days |
| 3. **Backblaze B2** | Both events above | `b2:hashcode-backups/deploy/` or `/daily/` | Indefinite (B2) |

### Backup files naming:

```
pre_migrate_YYYYMMDD_HHMMSS.dump     # From deploy pipeline
daily_YYYYMMDD_HHMMSS.dump           # From daily cron
```

### Restore from backup:

```bash
# Find the desired backup
ls -la /home/audest/hashcode-community/backups/

# Copy into DB container
docker cp /path/to/backup.dump hashcode-db:/tmp/restore.dump

# Stop web containers
docker stop hashcode-web-a hashcode-web-b

# Drop and recreate database
docker exec hashcode-db psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='hashcode';"
docker exec hashcode-db psql -U postgres -c "DROP DATABASE hashcode;"
docker exec hashcode-db psql -U postgres -c "CREATE DATABASE hashcode;"

# Restore
docker exec hashcode-db pg_restore -U postgres -d hashcode -F c /tmp/restore.dump

# Restart web
docker start hashcode-web-a
```

---

## Failure Alerting

When a workflow fails, a GitHub Issue is automatically created:

| Workflow | Issue Title | Labels |
|---|---|---|
| Deployment | `🚨 Deploy failed — <image-tag>` | `deploy`, `automated`, `critical` |
| Daily backup | `🚨 Backup failed — <date>` | `backup`, `automated`, `critical` |

Issues include a link to the failed run and context (branch, image, date).

---

## Pipeline Steps (reusable-deploy.yml)

```
[1/9] Pulling code & image         → git pull, docker login, pull new image
[2/9] Ensure volume exists         → create hashcode-postgres-data if missing
[3/9] Ensure DB is running         → docker compose -f compose.db.yml up -d db
[4/9] Backup DB + migrate          → pg_dump → prisma migrate deploy
[5/9] Blue-Green swap              → start inactive web, stop old one
[6/9] Health check                 → verify /api/status inside container
[7/9] Upload backup to artifacts   → GitHub Actions (30 days)
[8/9] Sync to Backblaze B2         → rclone copy (if B2 configured)
[9/9] Cleanup                      → keep last 10 backups, prune images
[10/9] Create issue on failure     → if any step failed
```

---

## Volume Security

The PostgreSQL data volume `hashcode-postgres-data` is marked `external: true` in
`compose.db.yml`. This means:

- `docker compose down -v` **will NOT delete it**
- Must be created manually if missing (pipeline does it automatically)
- Data survives any Compose operation

### Check volume health:

```bash
docker volume inspect hashcode-postgres-data
docker exec hashcode-db pg_isready -U postgres
```

---

## Quick Reference

### Deploy manually

```bash
# Trigger workflow from GitHub UI
# Or push to main:
git push origin main
```

### Check deploy status

```bash
# On VPS:
docker ps --filter name=hashcode
docker compose -f compose.db.yml ps
docker compose -f compose.app.yml ps
```

### View logs

```bash
docker logs hashcode-web-a --tail 50
docker logs hashcode-db --tail 20
```

### Manual backup

```bash
docker exec hashcode-db pg_dump -U postgres -d hashcode -F c -f /tmp/manual_backup.dump
docker cp hashcode-db:/tmp/manual_backup.dump ./backups/
```

### List backups

```bash
ls -lh /home/audest/hashcode-community/backups/
# Or on B2:
rclone ls b2:hashcode-backups/
```

---

## Changelog

### v2.7.0 — Production Hardening (2026-06-17)

- **Production hardening**: DB and app separated into `compose.db.yml` / `compose.app.yml`
- **Secrets**: `.env.production` moved outside project to `/home/actions-runner/secrets/`
- **Blue-Green**: `docker rename` eliminated — uses `web-a`/`web-b` toggle with Traefik
- **Migrations**: `prisma db seed` removed from pipeline; migrations run in temp containers
- **Backups**: Pre-migration backup → GitHub Artifacts + Backblaze B2
- **Daily backup**: Cron workflow backs up DB every night independently
- **Alerting**: Automatic GitHub issues on pipeline/backup failure
- **Volume safety**: PostgreSQL volume marked `external: true` — protected from `down -v`
- **Bug fix**: Migration failures no longer silently swallowed (operator precedence fix)
- **DB healthcheck**: `start_period: 30s` added for slow-start scenarios
- **Adminer**: Host port removed (Traefik-only access)
