# 05 — Roadmap de validation et d'exécution

## P0 — Confrontation à la réalité
- Cartographier le dépôt actuel depuis le commit de base.
- Vérifier toutes les routes, actions, composants, modèles, permissions et tests liés à l'acquisition et à l'administration.
- Relire le registre complet des décisions et choisir le prochain ID libre.
- Réconcilier D-014, D-023 et la décision multi-domaines demandée.

**Sortie :** inventaire reproductible, écarts qualifiés, décisions sans contradiction.

## P1 — Acquisition et onboarding
- Retrouver les routes réelles de brouillon et les appels client.
- Tester reprise, expiration, validation serveur, rattachement d'identité et idempotence.
- Vérifier le comportement du magic link uniquement après succès confirmé.
- Tester les trois domaines et leurs premières actions.

**Sortie :** parcours visiteur → profil → compte → orientation → première action validé en E2E.

## P2 — Schéma et intégrité
- Cartographier tous les usages de Member, User, Organization et relations.
- Définir le profil communautaire sans casser les squads.
- Comparer consentements, invitations, doublons, blacklist et événements.
- Produire migration à blanc et rollback.

**Sortie :** schéma validé et aucune régression d'appartenance.

## P3 — Administration
- Membres/prospects, statuts, notes et filtres.
- Invitations et activation.
- Anti-abus, blacklist et dédoublonnage.
- Imports/exports autorisés et audités.
- Événements/RSVP et paramètres utiles.

**Sortie :** parité démontrée par cas d'usage et tests d'autorisation.

## P4 — Communications et analytics
- Templates, journaux d'envoi et webhooks.
- Délivrabilité, désinscription et gestion des bounces/plaintes.
- Relances conformes aux consentements.
- Segmentation/campagnes uniquement si valeur démontrée.
- Dictionnaire d'événements et funnel unifiés.

**Sortie :** communications traçables et métriques cohérentes.

## P5 — Qualité et sécurité
Exécuter build, lint, type-check, tests unitaires, intégration et E2E ; vérifier rate limits, IDOR, autorisations, imports/exports et journaux.

## P6 — Bascule et lecture seule
Geler les écritures Reboot, migrer, rapprocher les données, basculer les flux, observer la production et obtenir une validation métier/technique. Reboot passe en lecture seule seulement après ces étapes ; le dépôt est conservé, non supprimé.
