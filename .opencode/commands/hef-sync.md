---
description: Synchroniser et valider le curriculum HEF
agent: hef-curator
---

Synchronise le curriculum HEF.

1. Vérifie la référence `hef` (17 modules, 169 missions).
2. Pour chaque module concerné :
   `node scripts/hef/parse.mjs --source <ref> --module HEF-XXX --out content/hef/v1/modules/HEF-XXX.json`
3. Lance `pnpm hef:validate` (ou `node scripts/hef/validate.mjs`).
4. Vérifie les compteurs : 17 modules, 169 missions, 34 labs/projets, 17 quiz, 169 slides.
5. Si le contenu change, signale les écarts avant de lancer le seed.

Ne modifie aucune donnée de production sans confirmation.
