# 03 — Matrice de parité fonctionnelle

**Légende :** Repéré = existence constatée ; Partiel/à comparer = couverture non démontrée ; À vérifier = aucune conclusion d'absence.

| Capacité | JoinHashCode observé | Reboot selon l'audit antérieur | Travail requis |
|---|---|---|---|
| Profilage / diagnostic | `lib/acquisition/engine.ts` repéré ; domaines web/cyber/ai présents | moteur de profilage | comparer règles et conserver un moteur cible |
| Brouillon serveur | chemin API exact non confirmé sur le main actuel | API de brouillon repérée | retrouver le flux réel et valider reprise/TTL |
| Qualification | moteur d'acquisition présent | moteur de qualification | comparer les critères ; versionner les règles |
| Orientation | responsabilités produit JoinHashCode | orientation/handoff documentés | garder la propriété de l'orientation dans JoinHashCode |
| Identité | Better Auth 1.7.7 dans la stack | auth membre et auth admin distinctes | garder Better Auth JoinHashCode ; ne pas migrer sessions/tokens admin |
| Membres / prospects | admin users et modèle à réexaminer | gestion membres, statuts, notes, filtres | cartographier cas d'usage et modèle réel |
| Invitations | parité à vérifier | module invitations | intégrer au système d'identité et de permissions existant |
| Blacklist / anti-abus | module fraud mentionné dans l'arbre antérieur ; couverture actuelle à vérifier | blacklist et anti-abus | réutiliser/étendre les contrôles existants |
| Doublons / fusion | à vérifier | détection et fusion documentées | matching prudent, revue manuelle des ambiguïtés, audit |
| Imports / exports | exports repérés précédemment | import/export membres | vérifier permissions, validations et traçabilité |
| Événements / RSVP | interventions repérées précédemment ; équivalence non prouvée | événements et RSVP | comparer modèles, rôles, filtres, notifications |
| Segmentation / campagnes | à vérifier | segments et marketing | n'intégrer que les campagnes utiles et consenties |
| Email / délivrabilité | Resend présent dans la stack ; fonctions précises à vérifier | templates, logs, webhooks, délivrabilité | pipeline unique, gestion bounce/complaint/unsubscribe |
| Relances | à vérifier | cron de relance | règles de consentement, fréquence, opt-out et idempotence |
| Analytics funnel | analytics présents selon l'audit antérieur | funnel/cohortes | dictionnaire d'événements unique |
| Audit log | activité/admin log repérés précédemment | audit log et activity | journal canonique avec acteur, ressource, action, résultat |
| Missions / mentorat | modules JoinHashCode | modules Reboot | JoinHashCode reste propriétaire ; ne pas dupliquer |
| Paramètres admin | à vérifier | settings | intégrer uniquement les paramètres opérationnels nécessaires |

## Vérifications obligatoires
Pour chaque ligne, documenter les écrans, composants, routes API, actions serveur, modèles Prisma, permissions, tests et état de production. Une route présente ne prouve pas une fonctionnalité complète ; un écran présent ne prouve pas que les contrôles serveur existent.
