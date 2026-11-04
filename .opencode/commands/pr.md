---
description: Préparer une PR propre avec commits granulaires
---

Prépare une PR pour : $ARGUMENTS.

1. Lis l'issue et les documents concernés (`AGENTS.md`, `DOCS/DECISIONS.md`).
2. Crée une branche dédiée (jamais de commit direct sur `main`).
3. Découpe en commits granulaires selon `AGENTS.md` (une intention par commit).
4. Lance le gate : lint, types, tests, build.
5. Rédige une description de PR : résumé, fichiers, tests exécutés, risques.
6. Ne pousse pas et ne crée pas la PR sans confirmation explicite.
