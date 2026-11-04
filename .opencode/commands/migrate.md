---
description: Auditer et tester une migration Prisma sur base vierge
agent: migration-auditor
---

Audite la migration ou le changement de schéma suivant : $ARGUMENTS.

Vérifie :
1. La migration est **additive** (pas de perte de données).
2. Elle s'applique sur une base PostgreSQL vierge sans exception.
3. Les seeds passent **deux fois** (idempotence).
4. Le schéma Prisma et l'historique SQL sont cohérents.
5. Le rollback est documenté.

Ne modifie pas les données de production. Ne lance jamais `prisma migrate reset`.
