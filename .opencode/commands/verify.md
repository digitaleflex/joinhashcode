---
description: Gate complet du repo (lint, types, tests, build, HEF)
---

Exécute le gate de vérification de JoinHashCode, dans cet ordre :

1. `npx eslint .`
2. `npx tsc --noEmit`
3. `npx vitest run --reporter=dot`
4. `npm run build`
5. `node scripts/hef/validate.mjs`

Règles :
- Corrige uniquement les erreurs causées par les changements en cours.
- Ne contourne jamais un test, un type ou une règle de lint.
- Ne pousse rien et ne déploie rien.
- Termine par un bilan : étape, statut, erreurs restantes.
