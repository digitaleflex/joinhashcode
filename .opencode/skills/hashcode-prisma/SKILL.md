---
name: HashCode Prisma
description: Créer, tester et réconcilier les migrations PostgreSQL/Prisma de JoinHashCode
---

# Migrations JoinHashCode

## Règles
- Migrations **forward-only** et **additives**.
- Ne jamais éditer une migration déjà appliquée sans réconciliation explicite.
- Ne jamais lancer `prisma migrate reset` ni `db push --force-reset`.
- Tester sur une base **vierge** puis sur un clone de prod.

## Création
```bash
npx prisma migrate dev --name <description>
npx prisma db push   # uniquement en local si la base VPS n'est pas accessible
```

## Vérification base vierge
```bash
# base de test sur le conteneur db
docker exec db psql -U postgres -c "CREATE DATABASE hashcode_mig_test;"
DATABASE_URL=...hashcode_mig_test npx prisma migrate deploy
```
Puis lancer le seed **deux fois** pour vérifier l'idempotence.

## CI
`scripts/ci-migrate-deploy.sh` doit rester un simple `prisma migrate deploy`.
Aucune exception `confidenceScore` ne doit réapparaître.

## Documentation
Mettre à jour `DOCS/MIGRATIONS.md` et `DOCS/CI.md` si la procédure change.
