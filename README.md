# JoinHashCode — le dossier de preuves d'un analyste cyber junior

JoinHashCode est la plateforme de HashCode Community. Sa **mission unique** (décision
**D-030**, `DOCS/DECISIONS.md`) : permettre à un débutant francophone d'obtenir **des preuves
vérifiées** de ce qu'il sait faire en cybersécurité, assez concrètes pour qu'un recruteur les
inspecte.

```
lab  →  soumission  →  relecture par un pair  →  preuve publique  (/u/[pseudo])
```

Ce qui ne raccourcit pas le chemin vers la première preuve est supprimé ou gelé. La vision tient
en une page : [`DOCS/PRODUCT_VISION.md`](DOCS/PRODUCT_VISION.md) ; le vocabulaire est fixé dans
[`DOCS/GLOSSAIRE.md`](DOCS/GLOSSAIRE.md).

## Où en est le produit

| Sujet | État |
|---|---|
| **Domaines** | Web, cybersécurité et IA appliquée sont présentés ; **seule la cybersécurité reçoit du développement** (D-026). |
| **Labs cyber** | 5 fiches rédigées dans [`DOCS/labs/`](DOCS/labs/README.md) (Linux, tri d'alerte SOC, OSINT, CTF, rapport d'investigation), **pas encore branchées** sur la plateforme (issue #479). Le cursus d'ingénierie HEF (17 modules, 169 missions) est importé et publié. |
| **Relecture** | Ouverte à la modération et à tout membre ayant **validé 3 labs**. Jamais sa propre soumission ; les labs PRO restent validés par l'admin ; les labs CORE relus par un pair attendent la confirmation de l'admin. |
| **Preuves** | Une preuve est une soumission validée, affichée sur la page publique `/u/[pseudo]`. **Un profil est privé par défaut** : ses preuves n'apparaissent que si le membre active « Visibilité recruteur » dans ses paramètres. Pas de table dédiée. |
| **Progression** | **Des preuves, pas des points** : ni XP, ni niveaux, ni badges, ni squads (D-027, D-029). Tous les labs sont ouverts. |
| **Quiz psychométrique** | **Facultatif** (D-030). Un nouveau membre va de l'onboarding au dashboard. |
| **Engagement** | 90 jours (jusqu'au 10/02/2027) sans changer de promesse ni de domaine phare, sauf règle anti-pivot de D-030. |

> **Honnêteté du produit.** La plateforme ne présente pas comme disponible une capacité qui n'est
> pas implémentée et testée (D-024). Les hypothèses à vérifier (dont H20 et H21 : le problème
> existe-t-il, des employeurs présélectionneraient-ils sur ces preuves ?) sont dans
> [`DOCS/HYPOTHESES.md`](DOCS/HYPOTHESES.md) ; elles sont **non testées** à ce jour.

## Parcours d'un membre

1. **Connexion** (Google, GitHub ou code à usage unique par email) — `/signin`.
2. **Onboarding** (situation, niveau, objectif) — `/onboarding`.
3. **Dashboard** — une action principale : choisir son premier lab.
4. **Lab** — `/missions` : le membre livre un travail (liens, fichiers, texte).
5. **Relecture** — un pair (ou la modération) prend la soumission en charge dans `/reviewer`, la relit sur
   `/reviewer/submissions/[submissionId]` et la valide ou demande une révision.
6. **Preuve** — le lab validé apparaît sur `/u/[pseudo]` et dans le Portfolio (`/dossier`).

Le choix du domaine passe par la carte « première action » du dashboard ; `/specialization` ne
s'impose qu'aux membres qui ont passé le quiz. La garde des routes est dans `proxy.ts`.

## Stack technique

- **Framework** : [Next.js 16](https://nextjs.org/) (App Router, React 19)
- **UI** : Tailwind CSS v4, primitives [Radix UI](https://www.radix-ui.com/), shadcn/ui (style New York), Lucide, Framer Motion
- **Base de données** : PostgreSQL + [Prisma 7](https://www.prisma.io/) (`@prisma/adapter-pg`), PgBouncer
- **Authentification** : [Better Auth](https://www.better-auth.com/) (Google, GitHub, code à usage unique, lien magique, double authentification)
- **Validation** : [Zod](https://zod.dev/) et React Hook Form
- **Tests** : [Vitest](https://vitest.dev/) (unitaires) et Playwright (e2e)
- **Contenu pédagogique** : cursus HEF versionné dans `content/hef/v1/`, importé par `prisma/seed-hef.ts`

## Structure du dépôt

| Dossier | Contenu |
|---|---|
| `app/` | Pages et routes d'API (`app/api/`) |
| `components/` | Composants d'interface (`components/ui/` = shadcn) |
| `lib/` | Logique métier : moteur de missions, relecture (`review-access.ts`), preuves (`evidence.ts`), authentification |
| `prisma/` | Schéma, migrations et seeds |
| `content/hef/v1/` | Cursus HEF (JSON généré depuis le dépôt de contenu) |
| `DOCS/` | Décisions, vision, hypothèses, suivi du nettoyage, labs rédigés |
| `proxy.ts` | Garde de sessions et funnel d'onboarding |

## Démarrage et commandes

Gestionnaire de paquets : `pnpm`. **Node 22** (`.nvmrc`).

```bash
pnpm dev                  # génère le client Prisma et lance le serveur (port 3000)
pnpm build                # build de production
pnpm test                 # tests unitaires (mode watch)
pnpm exec vitest run __tests__/smoke.test.tsx    # un seul fichier de tests
pnpm verify:fast          # types + lint + schéma Prisma (avant chaque commit)
pnpm verify               # contrôle complet (+ sondes HTTP sur :3000 + Playwright)
pnpm exec knip            # fichiers, exports et dépendances inutilisés (doit rester propre)
pnpm lint                 # lint
pnpm db:seed              # seed idempotent (la CI le joue deux fois)
pnpm hef:validate         # valide le cursus HEF
pnpm exec prisma studio   # explorer la base en local
pnpm exec prisma migrate dev --name <description>   # créer une migration
```

Le build de production local exige `REDIS_URL` au format REST d'Upstash (`https://…`) ; sinon :
`REDIS_URL= REDIS_TOKEN= pnpm build` (repli de limitation de débit en mémoire).

Pour lancer les contrôles sans base de données (types, `knip`, lint, tests unitaires), une URL
factice suffit : `DIRECT_URL=postgresql://u:p@localhost:5432/d DATABASE_URL=$DIRECT_URL pnpm exec prisma generate`.
Un seul test, `__tests__/db-connection.test.ts`, exige une vraie base.

### Docker et déploiement

- `compose.db.yml` — PostgreSQL + PgBouncer + Adminer (la base, démarrée une fois).
- `compose.app.yml` — le service `web` de production derrière Traefik.
- Déploiement : `./deploy.sh --image` récupère l'image construite par la CI (voir `AGENTS.md`, « Deployment »).
  Ne jamais laisser un `npm run build` nu sur le VPS (CSS/JS en 404).

## Contribuer

- **Lire d'abord** : [`CLAUDE.md`](CLAUDE.md) (règles de travail), [`AGENTS.md`](AGENTS.md) (référence : routes, déploiement, durcissement du VPS), [`DOCS/DECISIONS.md`](DOCS/DECISIONS.md).
- **Commits** : `type(scope): description`, un commit = une intention, en français ; ne pas mélanger code et documents de décision.
- **Gel des fonctionnalités (D-028)** : aucune nouvelle fonctionnalité sans une hypothèse `H-xx` qu'elle teste. Corrections, nettoyage et contenu sont bienvenus.
- **Zéro code mort** : `pnpm exec knip` est exécuté en CI.
- **Données** : ne jamais supprimer, tronquer ou réinitialiser de données sans confirmation explicite.
- **Suite du nettoyage** : épopée [#469](https://github.com/digitaleflex/joinhashcode/issues/469) et journal `DOCS/NETTOYAGE_SUIVI.md`.

## Documentation

| Document | Contenu |
|---|---|
| [`DOCS/PRODUCT_VISION.md`](DOCS/PRODUCT_VISION.md) | La vision en une page |
| [`DOCS/DECISIONS.md`](DOCS/DECISIONS.md) | Registre des décisions (D-001 à D-030) |
| [`DOCS/HYPOTHESES.md`](DOCS/HYPOTHESES.md) | Hypothèses à tester et indicateurs |
| [`DOCS/GLOSSAIRE.md`](DOCS/GLOSSAIRE.md) | Vocabulaire produit et noms techniques |
| [`DOCS/NETTOYAGE_SUIVI.md`](DOCS/NETTOYAGE_SUIVI.md) | Journal du nettoyage et de la mise au point |
| [`DOCS/labs/`](DOCS/labs/README.md) | Les 5 premiers labs cyber (fiches rédigées) |
| [`DOCS/MIGRATIONS.md`](DOCS/MIGRATIONS.md), [`DOCS/CI.md`](DOCS/CI.md) | Migrations et contrôles de la CI |
| [`DOCS/ops/RUNBOOK.md`](DOCS/ops/RUNBOOK.md) | Exploitation en production |
| `DOCS/archive/` | Anciennes visions et plans, conservés pour mémoire |

## Sécurité

Cette base de code suit le **standard EHAF de sécurité** :

- ne jamais faire confiance aux entrées externes : validation stricte par schémas Zod côté serveur ;
- contrôles d'authentification et d'autorisation côté serveur, y compris pour chaque route d'API ;
- variables d'environnement (`.env`, `.env.local`) hors du dépôt (`pnpm check-secrets` en CI) ;
- requêtes paramétrées via Prisma ; jamais de SQL construit à la main avec des entrées utilisateur.

Signalement de vulnérabilités : voir [`SECURITY.md`](SECURITY.md).
