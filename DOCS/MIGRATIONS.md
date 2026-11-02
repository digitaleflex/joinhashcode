# Migrations & déploiement — JoinHashCode

Ce document décrit la stratégie de migration de la base PostgreSQL et la
procédure de rollback. Il complète `DOCS/CI.md`.

## Source de vérité

- Schéma : `prisma/schema.prisma`.
- Historique : `prisma/migrations/` (forward-only).
- Application : `prisma migrate deploy`, exécuté au démarrage du conteneur par
  `docker-entrypoint.sh`, et en CI sur une base PostgreSQL 16 vierge.

## Rejouabilité (vérifiée)

L'historique complet se rejoue sur une base **vide** sans exception ni
`migrate resolve` :

```bash
prisma migrate deploy
# All migrations have been successfully applied.
```

La migration `20260809000000_add_user_confidence_score` est idempotente
(`ADD COLUMN IF NOT EXISTS`) car `20260629012226_add_last_combo_at_to_organization`
recrée déjà la colonne. C'était la seule exception historique ; elle est
supprimée du runner CI (`scripts/ci-migrate-deploy.sh`).

Contrôle de non-régression : la CI applique tout l'historique sur un PostgreSQL
16 éphémère avant lint/tests/build. Toute migration en échec bloque le workflow.

## Concurrence

`prisma migrate deploy` prend un verrou consultatif PostgreSQL : deux instances
qui démarrent en même temps ne peuvent pas appliquer une migration en double —
la seconde attend. Le déploiement est donc sûr, mais :

- **Recommandé** : un seul conteneur/job applique les migrations, puis les
  instances applicatives démarrent (`cluster.mjs` forke les workers *après*
  l'entrypoint).
- Si le nombre d'instances augmente, sortir les migrations de l'entrypoint et
  lancer un job dédié avant le rolling update, pour éviter d'allonger le
  démarrage du pool.

## Rollback

Les migrations sont **forward-only** : ne jamais éditer une migration déjà
appliquée pour « annuler » un changement. En cas de problème :

1. **Rollback applicatif** : redéployer l'image précédente
   (`IMAGE_TAG=<sha> ./deploy.sh --image`). Le schéma reste compatible car les
   migrations sont additives.
2. **Rollback base** : restaurer le snapshot PostgreSQL pris avant déploiement
   (`hashcode-db-backup`), puis redéployer l'image correspondante.
3. **Correctif** : écrire une nouvelle migration compensatoire explicite.

Ne jamais supprimer ni renommer une migration déjà appliquée (Prisma la
considère comme manquante et le déploiement devient incohérent).

## Rotation du secret Redis (SRH)

Le proxy Redis local (SRH) et l'application partagent `REDIS_TOKEN`.

1. Générer un jeton long (`openssl rand -hex 32`).
2. Le définir dans `.env.production` (gitignoré) — **jamais** dans un fichier
   versionné ni dans `compose.*.yml`.
3. Recréer `redis-proxy` avec le même jeton.
4. Redéployer l'application : `./deploy.sh --image`.
5. Vérifier : `POST /` sur le proxy avec `Authorization: Bearer <token>` doit
   répondre `200`, et `/api/status` doit rester `200`.
