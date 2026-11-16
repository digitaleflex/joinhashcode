# Glossaire — vocabulaire produit et noms techniques

> Le mot que l'on emploie **dans l'interface et les documents**, et le nom technique correspondant dans
> le code. Décision D-017 : *les mots entraînent le produit*. En cas de doute, c'est la colonne « Mot produit » qui prévaut.

## Mots produit

| Mot produit | Ce que c'est | Nom technique |
|---|---|---|
| **Lab** | Une activité pratique à livrer et à faire valider (`/missions`) | modèle `Mission`, table `mission` ; l'interface dit « Lab », le code dit « mission » |
| **Soumission** | Le travail livré par un membre pour un lab | `MissionSubmission` |
| **Livrable / artefact** | Une pièce de la soumission : lien, fichier, texte, tableau | `MissionSubmissionArtifact` |
| **Relecture** | L'évaluation d'une soumission selon les critères du lab | `MissionReview` |
| **Relecteur** | La modération, ou tout membre ayant **validé 3 labs** | `getClaimDecision` dans `lib/review-access.ts` |
| **Preuve** (*Evidence*) | Une soumission validée, montrée publiquement | soumission `APPROVED`, lue par `lib/evidence.ts` ; **aucune table dédiée** |
| **Portfolio** | L'espace du membre où ses preuves sont réunies | `/dossier` |
| **Page publique** | La page qu'un recruteur inspecte | `/u/[pseudo]` ; **privée par défaut**, visible si le membre active « Visibilité recruteur » (`User.talentVisible`) |
| **Annuaire** | La liste publique des membres visibles et ayant au moins un lab validé | `/talents` |
| **Parcours** (Academy) | Les cours et leurs étapes | `Course`, `Section`, `Content` ; `/academy` |
| **HEF** | Le cursus d'ingénierie (17 modules, 169 missions) | `content/hef/v1/`, `prisma/seed-hef.ts` |
| **Domaine** | Web, cybersécurité ou IA appliquée ; la cybersécurité est le domaine phare | `User.primaryDomain` |
| **Première action** | La carte du dashboard qui mène au premier lab | `lib/first-action.ts` |

## Deux sens du mot « quiz » et du mot « profil »

| Mot | Sens 1 | Sens 2 |
|---|---|---|
| **Quiz** | Le **quiz psychométrique** (4 profils), **facultatif** depuis D-030 | Les **quiz de l'Academy** (HEF), qui évaluent un module : à ne pas confondre, ils restent en place |
| **Profil** | Le profil du membre (identité, liens, objectif) | Le **profil psychométrique** (`class` : builder, creator, strategist, catalyst), renseigné seulement si le quiz a été passé |

## Statuts d'une soumission

`PENDING` (en attente de relecteur) → `IN_REVIEW` (prise en charge) → `APPROVED` (validée) ou `NEEDS_REVISION` (à réviser, le membre resoumet).
Pour un lab de niveau **CORE** relu par un pair : `PENDING_ADMIN` (en attente de confirmation de l'admin). Les labs de niveau **PRO** sont validés depuis l'admin.

## À ne plus employer

| Mot | Pourquoi | Que dire |
|---|---|---|
| XP, niveau, badge, série, check-in, classement | Retirés du produit (D-027, D-029) | « labs validés », « preuves » |
| Squad, guilde | Supprimées (D-027) | — (le plugin d'organisation est gardé pour de futures *Promotions*) |
| Atelier | Fusionné dans les Labs (D-030) | « Lab ». Le mot subsiste seulement dans l'Academy, où « Atelier » désigne une partie d'un module HEF |
| Agent, Dossier Agent, Bâtisseur (comme titre) | Ton « cyberpunk » abandonné (D-004) | « membre », « portfolio » |
| Vivier | Le vivier connecté a été supprimé ; l'annuaire public existe | « annuaire » |

## Défini mais pas encore implémenté

- Les **rangs** de D-020 (Auditeur → Participant → Vérifié → Certifié) : décrits par la décision, absents du produit.
- Les **Promotions** (cohortes) : le plugin d'organisation est conservé, sans écran.
- La **certification** (examen) : annoncée comme future.
