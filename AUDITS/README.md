# JoinHashCode — Audit Program

Ce dossier centralise les audits du projet.

## Règle de travail
1. Auditer avant de modifier.
2. Toute conclusion doit citer des preuves.
3. Utiliser les statuts: IMPLEMENTED, PARTIAL, BROKEN, MOCKED, DEAD_CODE, DOCUMENTED_ONLY, MISSING, UNKNOWN.
4. Un audit ne modifie pas le code.
5. Les rapports sont ensuite croisés dans `99-final-synthesis`.

## Ordre recommandé
00 Inventory → 01 Auth → 02 Profile → 03 Missions → 04 Review → 05 Gamification → 06 Squads → 07 Notifications → 10 Data → 11 API → 13 Security → 14 Testing → 15 DevOps → 17 Cross-Feature → 99 Final.
