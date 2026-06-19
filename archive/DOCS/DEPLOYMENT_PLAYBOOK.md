# Deployment Playbook

## Architecture

### Compose Files

| File | Purpose | Managed by |
|---|---|---|
| `compose.db.yml` | PostgreSQL + Adminer | Independent — never touched by deploy |
| `compose.app.yml` | Web app (web-a / web-b) | Pipeline — blue-green deploy |
| `compose.yaml` | Combined file for local dev only | Developers |

The database and application are **fully separated** to prevent accidental data loss.

### Blue-Green Deployment (no docker rename)

Two fixed services run side-by-side with **identical Traefik labels**:

- `web-a` → container `hashcode-web-a`
- `web-b` → container `hashcode-web-b`

**How it works:**
1. Pipeline detects which container is currently active
2. Starts the inactive one with the new image (`docker compose up --wait`)
3. `--wait` blocks until the compose healthcheck (`/api/status`) passes
4. On success → stops & removes the old container (zero downtime)
5. On failure → removes the failed new container, keeps the old one serving (**automatic rollback**)

No `docker rename`, no port conflicts, no downtime, automatic rollback on unhealthy deploy.

---

## Secrets Management

> **WARNING**: Never keep `.env.production` in the project root. It must live only in `/home/actions-runner/secrets/.env.production` on the VPS. If it was ever present in the repo directory, consider the secrets compromised and rotate them.

### Production secrets are stored outside the project directory:

```
/home/actions-runner/secrets/.env.production
```

- **Never copied or renamed** during deployment
- Referenced by **absolute path** in `compose.app.yml` and pipeline
- File permissions: `600` (owner only)
- Local development must use `.env.development` or `.env.local`, never `.env.production`

### Rotation checklist (if `.env.production` was exposed locally):

1. **Better Auth**: regenerate `BETTER_AUTH_SECRET` (all active sessions will be invalidated)
2. **Database**: rotate PostgreSQL password and update `DATABASE_URL` / `DIRECT_URL`
3. **OAuth**: regenerate Google & GitHub client secrets
4. **Resend**: rotate `RESEND_API_KEY`
5. **QStash**: rotate signing keys and token
6. **Sentry**: regenerate `SENTRY_AUTH_TOKEN`
7. **CRON_SECRET**: regenerate
8. **Backblaze B2**: rotate application key
9. **GitHub PAT (`GH_PAT`)**: regenerate with repo scope
10. Update `/home/actions-runner/secrets/.env.production` and restart containers

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
| 1. **Pre-migration** | Every deploy | Local (VPS) + Backblaze B2 | 10 local / indefinite B2 |
| 2. **Daily scheduled** | Every night at 00:00 UTC | Local (VPS) + GitHub Artifacts + B2 | 30 local / 30 days artifacts / indefinite B2 |
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
[1/6] Pull code & image         → git pull, docker login, pull new image
[2/6] Ensure DB is running      → start hashcode-db if missing, brief health wait
[3/6] Backup DB + migrate       → pg_dump → prisma migrate deploy (temp container)
[4/6] Blue-Green swap           → up --wait on inactive; stop+rm old on success, rollback on failure
[5/6] Sync to B2 + cleanup      → rclone to B2, keep last 10 backups, prune images
[6/6] Create issue on failure   → if any step failed
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

### v2.8.0 — Pipeline Optimization (2026-06-18)

- **Tests branchés** : `reusable-test.yml` (unit) et `reusable-e2e.yml` (PR only) désormais appelés par `pipeline.yml` — un push cassant les tests ne part plus en prod
- **Rollback automatique** : `docker compose up --wait` remplace le health check manuel ; en cas d'échec le nouveau conteneur est supprimé et l'ancien continue de servir
- **Étapes supprimées** : `Ensure volume exists`, double health check DB (60s→16s), upload artifact GitHub (B2 suffit), `check-auth-limits.ts` hors chemin critique
- **Dockerfile allégé** : `scripts/`, `lib/`, `prisma.config.ts`, `pnpm-lock.yaml`, `.npmrc` retirés du runner ; Prisma CLI installé globalement ; image 3-5x plus petite
- **Builds plus rapides** : `build` et `tests` parallèles ; cache pnpm persistant via `RUN --mount=type=cache` ; pnpm épinglé à `10.33.0`
- **Shutdown gracieux** : `docker compose stop -t 60` laisse 60s aux requêtes en cours
- **Smoke tests** : vérification post-deploy de `/api/status`, `/signin`, `/dashboard`
- **Nettoyage repo** : `compose.blue.yml` (déprécié) et dump IPs GitHub (126 KB) supprimés ; `.env.production` retiré du repo local
- **Fix B2_BUCKET** : secret désormais transmis au workflow de deploy
- **Numérotation** : steps renumérotés proprement [1/7]…[7/7]
