# PIVOT_CYBER.md — Décision stratégique du pivot (document de référence)

> **Date :** 17 septembre 2026
> **Statut :** Décision proposée — Vague 1 (issue #373) en attente d'exécution
> **Origine :** Session d'analyse stratégique (vision, marché, faisabilité, monétisation)
> **Backlog :** EPIC #372 + Vagues #373–#377 (github.com/digitaleflex/joinhashcode)
>
> ⚠️ Ce document **amende** temporairement la hiérarchie des références jusqu'à
> l'exécution de la Vague 1. Il ne remplace pas `PRODUCT_VISION.md` — il propose
> de le réécrire (pivot). Les données citées sont datées et vérifiées (2026-09).

---

## 0. La décision en une phrase

> **Une seule chose pendant 12 mois : la première filière "de zéro à analyste
> cyber employable" (SOC niveau 1 + OSINT) d'Afrique francophone — gratuite,
> auto-validée par labs/CTF, avec placement vers banques, télécoms, États et
> employeurs remote — avec l'OSINT comme drapeau que personne sur le continent
> ne porte.**

Pas deux choses. Pas trois. Un pipeline cyber, du débutant zéro à l'employable.

---

## 1. Les données réelles qui ont déclenché le pivot (mesurées 2026-09-17)

| Fait | Valeur | Source |
|---|---|---|
| Invitations envoyées | ~200 | fondateur |
| Inscrits | 60 | groupe WhatsApp |
| Actifs hebdo | **10** | mesuré |
| Niveau des actifs | quasi tous débutants | mesuré |
| Budget | 0 | mesuré |
| Mentors disponibles | 0 payables | contrainte |
| Intérêt cybersécurité dans la communauté | **63 %** (n°2 après dev web 70 %) | survey 204 réponses |

**Conséquences assumées :**
- Le KPI "500 actifs en 6 mois" de `ROADMAP.md` est **enterré** (remplacé par : 10 → 25-30 actifs en 3 mois).
- Le mentorat payant est **impossible maintenant** → le domaine choisi doit être **auto-validable sans mentor**.
- Le pivot vers le cyber coche : pénurie documentée + validation objective (labs/CTF) + coût zéro + demande réelle de la communauté + vide concurrentiel francophone.

---

## 2. Étude de marché (données datées, vérifiées 2026-09)

1. **Pénurie structurelle** de talents tech en Afrique francophone : les 3 familles les plus tendues = cybersécurité (profils certifiés CISSP/CISM quasi absents hors Maroc), data/IA, cloud/DevOps. *(Xpertize Africa, juil. 2026)*
2. **Les employeurs, faute de seniors, financent la formation de juniors sur 12-18 mois** avec clauses de rétention → ils achèteront le raccourci (cohortes sponsorisées). *(Xpertize Africa)*
3. **Le Togo lance (2 sept. 2026) un appel pour un vivier national cyber** — les États ouest-africains créent des pipelines = opportunité partenariat/vivier privé. *(Agence Ecofin)*
4. **France : 30 000+ postes cyber non pourvus.** Analyste SOC N1 = 32-42 k€, recrutement remote ouvert → un analyste SOC francophone à Cotonou est employable à distance. *(marché FR 2026)*
5. **L'OSINT francophone est une rareté mondiale** : VIGINUM (État français) recrute activement des analystes OSINT francophones pour l'Afrique du Nord-MO. *(France Travail, 2026)*
6. **L'OSINT devient un métier académique** : UTT Troyes + Paris-Assas lancent des diplômes OSINT en 2026 (130h). Discipline monétisable, pas un hobby. *(UTT, Assas)*
7. **Aucune formation OSINT structurée en Afrique francophone** — la seule académie du continent (AAOSI / Code for Africa) est anglophone, orientée journalisme. *(scan 2026)*

### Concurrence (réf. session concurrence)

- **Aucun concurrent direct** (francophone + gratuit + communauté + validation humaine + boucle emploi).
- **5 anneaux indirects** : plateformes de talents vérifiés pan-africaines (**Terra Talent — déjà toggle FR** 🔴🔴🔴, FreshTalent, Gigson, Afriment "real projects, real mentors, 200+ hired in 90 days"), écoles en montée B2B (**GoMyCode recrute des B2B Business Developer**, campus Dakar/Abidjan), recruteurs locaux (Talent2Africa), freelance (Upwork/Comeup), substituts informels (groupes Facebook/WhatsApp).
- **Vérification spécifique OSINT (2026-09-17) :** **aucune entreprise spécialisée OSINT au Bénin, en Afrique de l'Ouest, ni en Afrique.** Le meilleur concurrent cyber béninois, **Cyberspector** (Ramanou Biaou, 2018, 16 employés, 100+ clients) = sensibilisation/phishing pour PME, **zéro OSINT**. Créneau vide **confirmé** — avec la réserve : un marché vide peut signifier "besoin pas exprimé". Les clients disent "fraude", "vérification", "diligence" — jamais "OSINT".
- **Veille hebdo à instaurer** : Terra Talent (FR), Afriment, FreshTalent, GoMyCode B2B → dans un futur `DOCS/CONCURRENCE.md` (n'existe pas encore).

---

## 3. La proposition de valeur unique

**Formule maîtresse :** *HashCode ne vend pas des cours et ne vend pas des CV — nous vendons la preuve.*

- **Membre :** « Apprends gratuitement, prouve tes compétences avec des labs et des rapports vérifiés, décroche ton premier contrat cyber. »
- **Entreprise :** « Des talents francophones dont les compétences sont prouvées, pas déclarées. »
- **Face aux entreprises, JAMAIS le mot "OSINT" en accroche** — toujours la douleur : *Vérification avant signature. Investigation de fraude. Diligence sur les partenaires.*
- **Le mot qui est à nous seul : "prouvé"** — chaque evidence est publique et inspectable (livrable + nom du validateur). Jamais de certification sans livrable tangible.

---

## 4. Le modèle sans mentor (réponse à la contrainte budget)

- La validation subjective (dev full-stack) exige des mentors → **on ne joue pas ce terrain**.
- La validation objective (labs, CTF, rapports OSINT notés par rubrique) n'en exige pas pour les N0→N1.
- **Un seul relecteur senior requis au dernier niveau** = le fondateur, après 6 mois d'entraînement (il est en permanence 6 mois d'avance sur ses élèves).
- À partir de 20 certifiés : peer-review structurée (les N2 relectent les N1 par rubrique).
- Sur "5 ans pour devenir expert" : non. 6-9 mois d'entraînement structuré pour être compétent N1/OSINT junior ; **12 mois de travaux publics** pour être crédible comme école. L'expertise vient des travaux publiés, pas d'un diplôme.

---

## 5. Propriété intellectuelle & secrets d'entreprise (les 7 moats)

**Ce qui n'est PAS un moat** : le code (refait en 3-6 mois), le contenu (copiable), l'idée (non protégeable), les labs (sources publiques).

| # | Actif | Pourquoi impossible à copier | Protection |
|---|---|---|---|
| 1 | **Savoir-faire OSINT localisé** (méthodologie plateformes ouest-africaines : mobile money, marketplaces, patterns de fraude UEMOA) | Non documenté nulle part ; des mois de pratique locale exigés | **Repo privé séparé** — jamais dans la doc publique ni les cours |
| 2 | **Méthodologie pédagogique éprouvée** (rubriques, séquence N0→N1 calibrée débutants africains réels, taux de réussite par lab) | Données qu'on a et que nul autre n'a | Métriques brutes internes ; publier seulement ce qui renforce la marque |
| 3 | **Réseau d'employeurs** | Historique de performance copiable seulement placement par placement | CRM privé (tableur), jamais dans un repo |
| 4 | **Marque + track record public** | Légalement déposée + liée publiquement aux premières réussites | **Dépôt OAPI** ("HashCode" + "HashCode Verified Analyst"), domaines réservés, cohérence de marque |
| 5 | **Réseau d'anciens** | 200 diplômés = réseau que même Andela ne peut pas acheter ; se réplique seul | Les 10 actifs actuels en sont les fondateurs |
| 6 | **La communauté** | Un réseau social ne se copie pas, il se construit | Ne jamais la casser (même nom, même WhatsApp, même personnes) |
| 7 | **Base de connaissance des menaces locales** | Croissance composée ; monétisable (briefs) | Base interne ; exports externes anonymisés |

**Secrets d'entreprise (ne sortent JAMAIS)** : playbooks d'investigation locale, liste employeurs + conditions, corrigés de labs (les élèves voient la rubrique, pas les corrigés), tarifs négociés, contrats.

**Actions protection (< 500 €, 1 semaine)** : ① repo interne séparé pour playbooks locaux, ② dépôt OAPI (Yaoundé, couvre 17 pays) de la marque + certification, ③ clauses confidentialité dans contrats membres/mentors/freelance, ④ un document "Secrets d'entreprise" listant ce qui ne sort jamais.

**Le paradoxe protecteur : plus on publicise la méthode (rapports OSINT publics), plus elle est intouchable — les données réelles derrière restent privées.**

---

## 6. Plan de monétisation (3 poches)

**Règle constitutionnelle proposée (amendement) :** le parcours reste gratuit ; seuls les services humains immédiats peuvent être payants, avec reversement majoritaire au prestataire (mentor 1:1 : membre paie 5-10K FCFA/séance, mentor touche 70-80 %) — **le mentorat de validation des evidences reste gratuit**. Les parcours complets payants restent interdits (piège B2C GoMyCode).

### Poche 1 — Compétences du fondateur (semaines 1-8)
- Micro-missions tech freelance sous HashCode : 50-150K FCFA/mission (Upwork, Comeup, réseau)
- Troc site PME ↔ introductions
- **Cible : 200-300K FCFA + 2 références citables fin M2.** Financement de démarrage, pas le business model.

### Poche 2 — Entreprises qui subissent la fraude (mois 2-9)

| Produit B2B | Prix à valider | Acheteur | Décollage |
|---|---|---|---|
| Session sensibilisation cyber + mini-audit phishing | 100-250K FCFA | PME, écoles, ONG | M2-4 |
| Vérification / due diligence légère (rapport en 5 j) | 75-200K FCFA/dossier | banques, assurances, cabinets | M3-6 — produit signature |
| Investigation fraude ponctuelle | 150-400K FCFA | télécoms, banques | M4-9 |
| Brief mensuel de menaces locales (abonnement) | 50-100K FCFA/mois | banques + télécoms | M6-12 — récurrent, marge ~90 % |

### Poche 3 — Employeurs (mois 6-12)
1. **Placement** : commission 50-100 % d'un salaire mensuel (analyste junior 200-400K FCFA/mois → 100-400K par placement)
2. **Cohorte sponsorisée** : banque/télécom paie sa cohorte pré-recrutée — 500K-1M FCFA
3. **Partenariat vivier (ANCy-style)** : un État finance la formation de son vivier — prêt au M9 avec des certifiés à montrer

### Trajectoire chiffrée (prudente)
| Période | Revenu mensuel réaliste | Porteur |
|---|---|---|
| M1-2 | 0-150K FCFA | freelance fondateur |
| M3-6 | 150-400K | sensibilisation + 1-2 dossiers |
| M6-9 | 300-800K | + 1er placement / cohorte |
| M10-12 | 500K-1M | + briefs récurrents + placements |

**Le Concierge MVP (rituel hebdo, zéro code)** : chaque semaine, chaque actif → 1 micro-tâche → review personnelle du fondateur → publication publique ("Sarah a livré sa première page…"). Ne coder que ce que la main ne peut plus porter.

---

## 7. Confiance à froid (les deux ladders)

**Membres** (démarrage favorable : la communauté existe déjà) : continuité (même nom/personnes/WhatsApp) → plateforme sans casse → **les premières evidences publiques** → le premier membre recruté, documenté publiquement. La confiance se transfère **des mentors connus**, pas de la plateforme.

**Entreprises** (le vrai problème) :
1. *Emprunter* : mentors connus comme vitrine B2B ; partenariats visible (incubateurs, coworkings, universités)
2. *Prouver* : 1er pilot offert ; **la preuve inspectable et cliquable** (livrable + nom du validateur) ; garantie type "replacement"
3. *Faire parler les autres* : les 3 premiers clients = des références (over-delivery + témoignage nommé) ; publier les chiffres réels chaque mois (transparence radicalise la confiance) ; documenter publiquement le premier recruté
4. *Institutions* : labels/presse seulement après les 3 premiers rungs

**Interdits** : une livraison agence ratée sur-promisie, logos exagérés, certification sans livrable, faux avis, mentors fantômes, mentors rémunérés au taux d'approbation.

**Plan 90 jours** : S1-2 recruter 3 mentors-pairs connus → S2-4 10 entretiens entreprises + 2 pilots proposés → S4-6 5 evidences publiques → S6-10 1er pilot exécuté → S8-12 "Les chiffres de HashCode — mois 1" → S10-12 1er membre recruté / 1er contrat documenté.

---

## 8. Réforme du code (triage 3 bacs + 5 vagues)

**Principe :** pas de big-bang. Chaque vague = 1 PR + test + `npm run verify` vert. Aucune suppression de **données** sans confirmation séparée.

### 🔁 Transformer (le pipeline)
`/missions` → **Labs** (livrable + rubrique) · `/reviewer` → review par rubrique · `/academy` → parcours N0→N1, lecteur minimal (PAS le moteur LMS B1) · `/dossier` → portfolio vérifié · `/talents` → vivier analystes · `/specialization` → choix de voie SOC/OSINT (2 voies) · `/quiz` → mini-diagnostic (les 13 questions + révélation gardées comme onboarding fun léger) · `/dashboard` → "ta prochaine étape" en tête · `/ateliers` → fusionné dans le parcours.

### 🟢 Garder tel quel (infra)
`(auth)/*`, `/acquisition/*`, `/u/[pseudo]`, `/settings`, notifications, `/feedback`, `/contact`, legal/privacy/cookies, SEO, `/invite/*`, admin `users`/`submissions`/`activity`.

### ❄️ Geler puis supprimer (Vague 5 + confirmation)
`/squad/*` (gamification — **option : transformer en "promotions"**/cohortes), `/leaderboard`, `/admin/{fraud,interventions,knowledge-hub,mentorat,contenus,core,analytics,ux-poll}`, `/guide`, `/team`, mécaniques streak/cohésion/j7.

### Schéma Prisma : 64 → ~25
- V1-4 : rien de destructif (nav + flag), tables intouchées.
- Créations : `Evidence` (v1 : lab réussi + lien + statut review), `LabRubric`/`RubricScore`, `Path`/`PathLevel`, `Employer`/`Placement` (léger).
- Drops (sur confirmation) : modèles squads avancés, ux-poll, referral, 0-usage déjà listés.

### Vagues
| Vague | Contenu | Durée | Issue |
|---|---|---|---|
| V1 | AMI pivot + amendement constitution + nav + gel | 2-3 j | #373 |
| V2 | Labs + rubriques + reviewer | 3-4 j | #374 |
| V3 | Parcours N0→N1 + evidence-lite + portfolio | 1 sem | #375 |
| V4 | Vitrine vivier + OSINT signature + consentement recruteur | 1 sem | #376 |
| V5 | Élagage routes + prune schéma (**destructif — OK explicite requis**) | 2-3 j | #377 |

---

## 9. Jalons 12 mois

| Période | Jalon | Livrable |
|---|---|---|
| M1-3 | Rituel hebdo 10 actifs + 3 mentors-pairs + 3 sessions "mentor invité" | 5 evidences publiques, 5 premiers CTF réussis |
| M4-6 | Parcours N0→N1 structuré (contenu = labs gratuits curatés + fiches méthode FR) | 15-25 actifs, 2 rapports OSINT fondateur publics |
| M7-9 | 1er partenariat employeur (banque/télécom/ANCy) | **1er analyste placé** |
| M10-12 | Certification "HashCode Verified Analyst" v1 (examen pratique) | fondateur = l'expert public du domaine |

---

## 10. Tests de validation AVANT engagement (zéro code)

1. **5 conversations avec les 10 actifs** : veulent-ils le cyber/OSINT ? *(si < 5 oui → hypothèse tombe)*
2. **3 entretiens banque/télécom/PME** (Cotonou-Abidjan) : "qui vérifie vos partenaires, enquête vos fraudes, combien ça coûte ?" *(réponses : personne/on subit = marché vierge ✅ ; cabinet étranger cher/lent ✅✅ ; l'agent sécurité gère = vendre la formation de ses agents ✅)*
3. **Test Terra Talent** (compte, assessment, prix $5) : suivre sa francophonisation

---

## 11. Ce qui est coupé (à ne plus jamais réouvrir sous le nouveau périmètre)

- ❌ Talent pool généraliste → remplacé par le vivier analystes
- ❌ Parcours web dev multi-domaines comme offre centrale
- ❌ Le moteur LMS complet (B1) → lecteur minimal seulement
- ❌ Kalman/CORE avancé → **enterré jusqu'à 1000 actifs**
- ❌ KPIs 500 actifs / 3 contrats en 6 mois → remplacés par 25-30 actifs / 1er placement
- ❌ Discord → WhatsApp + plateforme, c'est tout
- ❌ Parcours membres payants → jamais (sauf mentorat 1:1 humain, voir §6)

---

## 12. Décisions en attente (tracking)

| # | Décision | État |
|---|---|---|
| 1 | Exécuter Vague 1 (#373) — étape 1 (D1-D8) commitée `282ebef`, gate VERT | ✅ 17/09 |
| 2 | 18 branches non mergées (`fix/P0-01`→`fix/P3-17`, `sprint1`, `snyk-fix`, `feat/social-mission-dedicated-page` + `AtelierProgress`) : garder gelées (reco) ou archiver/supprimer | ⏳ question posée |
| 2b | Fin de Vague 1 (#378) : admin nav purgée + docs amendés (DECISIONS D-014→D-019, PRODUCT_VISION, ROADMAP, ABSORPTION) | ✅ 17/09 |
| 3 | Dépôt OAPI marque + certification | à faire cette année |
| 4 | Repo privé interne (playbooks locaux) | à créer |
| 5 | Contrats (prestation client, freelance membre, consentement RGPD/lois locales) | avant 1er client |
| 6 | Entité juridique d'encaissement (facture virement manuelle suffit pour les 3 premiers contrats) | avant 1er euro/FCFA |

---

## 13. Risques honnêtes (surveillance permanente)

1. **TryHackMe/HackTheBox** sur le contenu → défense = français + communauté réelle + placement local + rapport évalué (ils sont l'outil, nous le pipeline)
2. **Un seul relecteur final** → peer-review structurée dès 20 certifiés
3. **Juridique OSINT** : cadre éthique strict (sources ouvertes, pas de doxxing, conformité lois locales CIL/APDP/CDP) — c'est aussi un argument B2B
4. **Terra Talent francophonise** → vitesse d'exécution + ancrage communautaire
5. **Le créneau vide ≠ marché vide** → le test des 3 entretiens tranche avant engagement

---

*Document vivant — à relire chaque phase. Prochaine revue : fin Vague 1.*
*Issues : #372 (EPIC), #373-#377 (vagues). Tout ce document est falsifiable : chaque affirmation porte sa source ou sa date.*
