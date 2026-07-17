# Runbook de Déploiement & Opérations — HASHCODE

> Source de vérité pour le déploiement en production, le rollback et la gestion
> des incidents. Maintenu par l'équipe infra. Dernière mise à jour : 17 juillet 2026.

---

## 1. Architecture de déploiement

| Composant | Détail |
|-----------|--------|
| **App** | Next.js 16 (`output: "standalone"`) en conteneur Docker `hashcode_web` |
| **Reverse proxy** | Traefik (TLS Let's Encrypt, entrypoint `websecure`) |
| **DB** | PostgreSQL auto-hébergé sur VPS Hostinger, conteneur Docker `db` |
| **Cache rate-limit** | Redis (via proxy local `redis-proxy:80`) — fallback in-memory si indispo |
| **CI/CD** | GitHub Actions (`deploy.yml`) sur runner self-hosted, déclenché sur `push` → `main` |
| **Secrets** | `/home/actions-runner/secrets/.env.production` sur le runner (hors repo) |

Flux : `git push main` → GitHub Actions build + `docker build` → `docker compose up -d web --force-recreate`.

---

## 2. Prérequis environnement

Variables d'environnement **obligatoires** (à placer dans `.env.production`) :

```dotenv
# Auth (Better Auth)
BETTER_AUTH_SECRET="<32+ chars, généré via openssl rand -base64 32>"
BETTER_AUTH_URL="https://joinhashcode.com"

# Base de données (pooled + direct)
DATABASE_URL="postgresql://<user>:<pass>@db:5432/<db>?schema=public&sslmode=disable"
DIRECT_URL="postgresql://<user>:<pass>@db:5432/<db>?schema=public&sslmode=disable"

# App
NEXT_PUBLIC_APP_URL="https://joinhashcode.com"
NODE_ENV="production"

# Rate limiting / Redis
REDIS_URL="http://redis-proxy:80"
REDIS_TOKEN="<token>"

# Cron interne (doit matcher CRON_SECRET côté route)
CRON_SECRET="<32 chars>"

# Emails (Resend) — optionnel, mocké si absent
RESEND_API_KEY="re_..."

# Webhook Resend — optionnel
# RESEND_WEBHOOK_SECRET="<secret>"
```

> ⚠️ `compose.app.yml` surcharge `DATABASE_URL` / `DIRECT_URL` / `REDIS_*` via ses
> propres variables d'environnement. Le `.env.production` est chargé via `env_file`
> et sert aux valeurs restantes (secrets, domaine, etc.).

---

## 3. Déploiement (voie normale)

Le déploiement est **automatique** à chaque `push` sur `main` :

```bash
git push origin main
```

GitHub Actions exécute dans l'ordre :
1. `pnpm install --frozen-lockfile`
2. `pnpm run build` (avec `.env.production` sourcé → `prisma generate` + `next build`)
3. `docker build --no-cache -t hashcode_web:latest .`
4. `docker compose -f compose.app.yml --env-file .env.production up -d web --force-recreate`

Le conteneur applique les migrations au démarrage (`npx prisma migrate deploy`
dans le `CMD` du Dockerfile), puis lance `node server.js`.

**Vérification post-déploiement (≤ 2 min) :**
```bash
# Health check (route publique /api/status)
curl -fsS https://joinhashcode.com/api/status

# Logs du conteneur
docker logs --tail 50 hashcode_web

# Statut Traefik
docker ps --filter "name=hashcode_web"
```

Le healthcheck Traefik sonde `/api/status` toutes les 15s (5 retries, 30s start_period).

---

## 4. Déploiement manuel (si CI indisponible)

```bash
# 1. Build local avec les secrets de prod
set -a; source /home/actions-runner/secrets/.env.production; set +a
pnpm install --frozen-lockfile
pnpm run build

# 2. Image
docker build --no-cache -t hashcode_web:latest .

# 3. Relance
docker compose -f compose.app.yml \
  --env-file /home/actions-runner/secrets/.env.production \
  up -d web --force-recreate
```

---

## 5. Migrations de base de données

- **En CI/CD** : `prisma migrate deploy` tourne au `CMD` du conteneur → applique
  automatiquement les migrations présentes dans `prisma/migrations/`.
- **Nouvelle migration** (en dev, avant le push) :
  ```bash
  npx prisma migrate dev --name <description>
  ```
  Puis commit le dossier `prisma/migrations/<timestamp>_<name>/`.
- **En local sans DB accessible** : utiliser `npx prisma db push` pour appliquer
  le schéma directement (pas de fichier de migration généré).

> ⚠️ Ne jamais `prisma migrate reset` ou `db push` en prod sans validation explicite.
> Les données ne doivent jamais être effacées sans confirmation du Product Owner.

---

## 6. Rollback

**Rollback applicatif (le plus fréquent) :**
```bash
# Retourner au dernier commit stable connu
git revert <sha-du-bad-commit>   # ou git reset --hard <sha>
git push origin main             # relance la CI automatiquement
```

**Rollback d'image (rapide, sans re-build) :**
```bash
docker tag hashcode_web:<previous_tag> hashcode_web:latest
docker compose -f compose.app.yml up -d web --force-recreate
```

**Rollback de migration :**
- Prisma ne fait pas de rollback automatique. Préparer un script `prisma migrate dev --create-only` inverse **avant** la mise en prod, ou restaurer la sauvegarde DB (voir §8).

---

## 7. Surveillance & alerting

| Signal | Où regarder | Seuil d'alerte |
|--------|-------------|----------------|
| Santé app | `/api/status` (HTTP 200) | échec > 5 retries consécutifs |
| Erreurs runtime | `docker logs hashcode_web` | pic d'erreurs 5xx |
| Rate limit Redis | logs `Redis` / fallback in-memory | si `redis` = `null` → limiters en mémoire (par conteneur) |
| DB | conteneur `db` (Docker health) | connexion refusée |
| Emails | `RESEND_API_KEY` valide | échecs d'envoi (`emailService` `.catch`) |

**Pas de Sentry/Datadog configuré.** Les erreurs sont remontées via :
- `console.error` dans les routes (visibles dans `docker logs`)
- `logActivity()` (append-only, ne casse jamais la requête)
- Emails d'alerte admin (`ADMIN_BROADCAST_SENT`, etc.)

**Action recommandée si incident :** sonder `/api/status`, lire `docker logs --tail 200 hashcode_web`, vérifier l'état du conteneur `db` et de `redis-proxy`.

---

## 8. Sauvegardes & reprise

- **DB** : sauvegarde automatique côté VPS Hostinger (à confirmer avec l'hébergeur).
  Restauration = snapshot Docker `db` + `prisma migrate deploy`.
- **Uploads** : volume Docker `uploads_data` (`/app/public/uploads`) — persistant
  entre recreations de conteneur.
- **Secrets** : uniquement dans `/home/actions-runner/secrets/.env.production`
  (permissions `600`). Ne jamais commiter `.env*`.

---

## 9. Sécurité (rappel durci juin 2026)

| Mesure | État |
|--------|------|
| iptables (INPUT DROP, SSH/80/443 only) | ✅ VPS |
| Docker DOCKER-USER (bloque ports internes) | ✅ |
| ICMP ping bloqué | ✅ |
| SSH clés uniquement, root interdit | ✅ |
| Fail2ban (ban 1h / 5 échecs / 10min) | ✅ |
| Headers : HSTS, CSP, X-Frame-Options, nosniff | ✅ `next.config.mjs` |
| Rate limiting (Upstash + fallback mémoire) | ✅ `lib/ratelimit.ts` |
| Validation Zod sur toutes les entrées API | ✅ `lib/validation/` |
| `pnpm audit` → 0 vulnérabilité | ✅ (juillet 2026) |

**À faire (todo sécurité) :**
- Remplacer l'auth basic Traefik par OAuth2 (Google) via oauth2-proxy
- Mettre en place Cloudflare Tunnel (zero-trust)
- Nettoyer les fichiers `.env` restants (permissions déjà `600`)

---

## 10. Checklist pré-déploiement

- [ ] `pnpm run build` réussit en local (0 erreur TS)
- [ ] `npm run lint` → 0 erreur
- [ ] `npm run test` → tous les tests passent
- [ ] Migration Prisma créée et commitée (`prisma/migrations/`)
- [ ] Variables `.env.production` à jour (nouveaux secrets si ajoutés)
- [ ] `pnpm audit` → 0 vulnérabilité
- [ ] Commit sur `main` déclenche la CI verte

---

## 11. Contacts & escalade

- **Infra/VPS** : accès Hostinger (équipe DevOps)
- **DB / migrations** : voir `lib/prisma.ts` + `prisma/schema.prisma`
- **Incident majeur** : page + canal `#incidents` (si existant), puis rollback §6
