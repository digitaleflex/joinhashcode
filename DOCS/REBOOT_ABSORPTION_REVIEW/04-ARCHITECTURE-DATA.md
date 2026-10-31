# 04 — Architecture et données cibles

## Architecture cible
Conserver un monolithe modulaire Next.js avec PostgreSQL et Prisma 7. Ne pas créer de microservices pour cette absorption.

Modules logiques :
- Acquisition : session, source/campagne, brouillon, consentement, qualification, conversion et handoff.
- Identity & Access : Better Auth JoinHashCode, rôles et permissions canoniques.
- Member Profile : profil communautaire distinct de l'appartenance à une organisation/squad.
- Orientation & Paths : parcours et orientation pour les trois domaines.
- Missions & Evidence : missions, soumissions, validation et preuves.
- Administration : membres, invitations, modération, événements, imports/exports et paramètres.
- Communications : notifications, emails, templates, délivrabilité et relances.
- Analytics & Audit : funnel, cohortes, événements et journal d'audit.

## Identité
- Une seule identité Better Auth.
- Ne pas importer le namespace d'authentification administrateur Reboot, ses comptes, sessions, tokens ou secrets.
- Mapper les rôles et permissions vers le modèle JoinHashCode.
- Vérifier l'autorisation côté serveur pour chaque opération administrative.

## Modèle conceptuel — à confirmer sur le schéma existant
- `User` : identité canonique.
- `MemberProfile` : profil communautaire/prospect rattaché à User, si aucun modèle existant ne couvre ce besoin.
- `Member` : appartenance organisationnelle/squad ; préserver sa sémantique.
- `ProfilingDraft` : brouillon serveur à durée de vie limitée, uniquement si absent.
- `ConsentRecord` : preuve par finalité, version, horodatage, origine et retrait, si le modèle actuel ne suffit pas.
- `Invitation`, `Event`, `EventRsvp`, `EmailEvent`, `AuditLog` : réutiliser d'abord les modèles existants.

## Risque Member / squad
La route `app/api/squad/create/route.ts` recherche un enregistrement `Member` par `userId` pour déterminer si l'utilisateur appartient déjà à une squad. Toute création d'un Member par le flux prospect pourrait donc modifier le comportement des squads. Il faut inspecter tous les usages et contraintes Prisma avant de conclure à un conflit ou de proposer une migration.

## Flux cible
Visiteur → diagnostic → brouillon validé côté serveur → création/connexion Better Auth → rattachement idempotent du profil → preuve de consentement → orientation JoinHashCode → première action pertinente dans l'un des trois domaines.

## Données
- Conserver source, campagne, consentement, provenance et historique utile.
- Ne pas migrer les mots de passe, sessions ou tokens Reboot.
- Dédupliquer automatiquement seulement les correspondances exactes et sûres ; mettre les cas ambigus en revue manuelle.
- Prévoir rapport de migration, import à blanc, contrôles post-migration et rollback.
- Définir finalité, durée de conservation, accès, export et suppression pour les données personnelles.
