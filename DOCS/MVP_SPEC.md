# MVP Spec — JoinHashCode (Lancement)

> **Amendé le 12/11/2026 (D-030).** Le périmètre du MVP est désormais la boucle *lab → relecture par un pair →
> preuve publique* (`DOCS/PRODUCT_VISION.md`). Le quiz psychométrique n'est plus une étape du parcours, les ateliers
> sont fusionnés dans les Labs, et la relecture est ouverte aux membres ayant validé 3 labs. Les lignes ci-dessous
> qui parlent du quiz ont été mises à jour ; le reste du document reste valable.


*Document de référence pour [#400](https://github.com/digitaleflex/joinhashcode/issues/400). Aligné sur `PRODUCT_VISION.md`, `DOCS/DECISIONS.md` (D-024/D-025), `README.md`. Statut : vivant.*

## 1) Objectif

Définir un MVP minimal, honnête et testable qui permette à un nouvel utilisateur de découvrir les 3 domaines actifs (Web Development, Cybersécurité, IA appliquée), de s'orienter, et de réaliser une **première action concrète** dans son domaine choisi. Tout ce qui n'est pas listé ici est considéré "bientôt disponible" ou hors périmètre du lancement.

## 2) Périmètre fonctionnel

### Parcours critique (must have)
| Étape | Description | État attendu |
|---|---|---|
| Landing | Page d'accueil publique, présentation claire des 3 domaines, CTA vers inscription | Fonctionnel, honnête (pas de promesses non implémentées) |
| Inscription / Authentification | Sign up/sign in (Better Auth) - email/password ou OAuth selon config. Gestion session. | Fonctionnel |
| Vérification / profil | Création profil, pseudo, état utilisateur cohérent. | Fonctionnel |
| Onboarding | Collecte minimale (situation/contexte) selon `app/onboarding`. | Fonctionnel |
| Orientation | Choix du domaine (carte « première action » du dashboard ; `/specialization` pour qui a passé le quiz). **Le quiz psychométrique est facultatif** (D-030). | Fonctionnel |
| Première action par domaine | Pour chaque domaine, une **première action exécutable** et observable (lien/activité/lab). Si aucun contenu exploitable → afficher "Bientôt disponible" honnêtement. | À garantir (lié à #404) |
| Navigation membre | `Mon Parcours` / espace membre cohérent. | Fonctionnel |

### Espaces / fonctionnalités (must have si exposés)
| Espace | Règle |
|---|---|
| `/dashboard` ou équivalent "Mon Parcours" | Afficher prochaine étape claire. Respecter gels D-015/D-019 (pas de gamification générique comme fondation). |
| Missions/Labs | Exposer uniquement ce qui est réellement utilisable. Ne pas afficher un catalogue vide comme "complet". |
| Profil / Portfolio | Si evidences existent, afficher honnêtement. Pas de faux contenus. |

### Hors périmètre MVP (explicitement exclus)
- Gamification générique (XP/streaks/cohésion squads/leaderboards) comme moteurs — gelé (D-015)
- Moteur CORE avancé / Kalman (D-019)
- Vendre des parcours membres payants (D-018) — seuls services humains ponctuels payants
- Fonctionnalités admin "génériques" non nécessaires au lancement
- Intégrations non validées (Reboot) — voir #405
- Gamification squads avancées (peuvent exister mais ne doivent pas bloquer le MVP)

## 3) Rôles et permissions (matrice minimale)
| Rôle | Accès | Notes |
|---|---|---|
| Visiteur (anonyme) | Landing, pages publiques, `/invite/[slug]` géré | Accès restreint |
| Membre authentifié (USER) | Espace membre, onboarding si non complété, labs, relecture après 3 labs validés | Par défaut |
| Modérateur (MODERATOR) | Selon layout admin existant + permissions minimales | Existant |
| Administrateur (ADMIN) | Admin restreint nécessaire au lancement (membres/état activation, modération basique) | Minimal, cf #406 |

Règles: contrôles côté serveur obligatoires, pas d'exposition de données sensibles, respecter guards existants.

## 4) États, erreurs, reprise
| Scénario | Comportement attendu |
|---|---|
| Non authentifié accédant route protégée | Redirection vers signin avec callback si pertinent (cf middleware/proxy) |
| Onboarding non complété | Redirigé vers `/onboarding` selon funnel |
| Quiz non complété | Aucune redirection : le quiz est facultatif, le membre va au dashboard (D-030) |
| Erreur réseau/serveur | Messages clairs, pas de crash, possibilité de réessayer |
| Email/magic-link/OAuth échec | Messages explicites, pas de fuite d'info |
| Première action indisponible | Affichage honnête "Bientôt disponible" + alternative communautaire si utile |

## 5) Critères d'acceptation

### Fonctionnel
- [ ] Parcours complet visiteur→première action fonctionne en conditions réelles (test manuel)
- [ ] 3 domaines présentés correctement, chacun avec première action ou état "bientôt disponible" justifié
- [ ] L'onboarding mène au dashboard sans passer par le quiz ; `/quiz` reste accessible tant qu'il n'a pas été passé
- [ ] Authentification stable (session, redirections)

### UX/Accessibilité
- [ ] Navigation claire, une action principale par étape
- [ ] Responsive basique (mobile/desktop)
- [ ] États de chargement/erreur présents
- [ ] Messages en français cohérents avec ton produit

### Sécurité/Technique
- [ ] Routes protégées avec guards corrects
- [ ] Pas de fuite de données entre rôles
- [ ] Migrations non destructives uniquement (cf #411)
- [ ] Pas de régression sur auth

### Performance/Qualité
- [ ] Pas d'erreurs console bloquantes sur parcours critique
- [ ] Build OK (`npm run build`)
- [ ] Lint raisonnable

## 6) Matrice de tests
| Type | Cible | Notes |
|---|---|---|
| Manuel | Parcours critique complet | Obligatoire avant go/no-go |
| E2E (si existant) | Auth/onboarding ; **parcours de relecture par un pair non couvert** (essai manuel requis) | Étendre si facile, ne pas bloquer sur refonte |
| Unitaire/Intégration | Logique métier touchée | Selon périmètre changement |

## 7) Définition "Prêt à lancer" (Go/No-Go)
**GO** si tous les critères must-have sont cochés + recette #408 validée + release #407 prête.
**NO-GO** si : parcours critique cassé, première action indisponible pour tous les domaines sans alternative honnête, faille auth/guards, migration risquée non vérifiée.

## 8) Découpage en issues
- **#411** (M2) : Migrations/schema - prérequis
- **#404** (M3) : Première expérience utile par domaine
- **#403** (M2) : Auth/onboarding
- **#406** (M4) : Admin minimal si nécessaire
- **#408/#407** : Recette/release

## Références
- `PRODUCT_VISION.md`, `DOCS/DECISIONS.md`, `README.md`, `DOCS/PIVOT_CYBER.md` (contexte historique)
- `#414` backlog post-D-024
