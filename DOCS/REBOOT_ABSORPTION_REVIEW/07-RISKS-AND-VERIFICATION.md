# 07 — Risques et preuves attendues

| ID | Risque | Preuve attendue avant implémentation |
|---|---|---|
| V-01 | Décision D-020 déjà utilisée | Relire tout le registre et choisir le prochain identifiant libre |
| V-02 | D-014 et D-023 contradictoires avec la nouvelle stratégie | Décision explicite sur les trois parcours produits et la priorité d'investissement |
| V-03 | Audit de chemins obsolète | Inventaire de l'arbre courant, références exactes et commit |
| V-04 | Member utilisé pour les squads | Tous les usages du modèle, relations Prisma, contraintes et tests |
| V-05 | Brouillon serveur non localisé | Route, action, appel client, TTL, sécurité et test de reprise |
| V-06 | Magic link et création de prospect | Tests succès/échec et redirection |
| V-07 | Consentement uniquement analytics | Preuve versionnée, finalité, horodatage, retrait et rétention |
| V-08 | Moteurs de qualification en doublon | Comparaison des règles et responsabilités |
| V-09 | Parité admin non démontrée | Cas d'usage, écrans, endpoints, permissions et tests |
| V-10 | Migration de personnes en doublon | Matching prudent, revue manuelle, rapport et rollback |
| V-11 | Emails marketing | Consentement par canal, opt-out, bounce, complaint et suppression |
| V-12 | Reboot basculé trop tôt | Inventaire des écritures, validation production et période d'observation |
| V-13 | Qualité inconnue | Résultats datés de build, lint, type-check, tests et E2E |

## Conditions avant toute PR technique
1. P0 terminé et revu.
2. Base commit et arbre revalidés.
3. Build et tests de référence exécutés.
4. Schéma et usages de Member cartographiés.
5. Contrat d'acquisition documenté.
6. Consentement et données personnelles validés.
7. Migration à blanc et rollback démontrés.

## Conditions avant lecture seule Reboot
Toutes les fonctions administratives retenues sont utilisables dans JoinHashCode ; données rapprochées ; tâches planifiées, emails, webhooks et liens migrés ; absence de dépendance d'écriture ; approbation technique et métier explicite.
