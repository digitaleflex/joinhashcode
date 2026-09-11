# Rapport Stratégique — HashCode : Différenciation & Vision 6 Mois

> **Date :** 11 septembre 2026
> **Auteur :** EURINHASH (analyse stratégique)
> **Statut :** Document vivant — revue mensuelle
> **Périmètre :** Analyse concurrentielle Afrique, stratégie de différenciation, feuille de route 6 mois

---

## 1. Résumé exécutif

HashCode dispose d'actifs réels (communauté WhatsApp, base utilisateurs sur reboot.hashcode.com, 4 projets de code) mais souffre d'une dispersion structurelle. L'analyse concurrentielle révèle un **créneau vide en Afrique francophone** : personne ne combine *communauté + academy + certification + talent pool B2B* dans une boucle complète.

**La stratégie :** devenir **LA plateforme de talents tech vérifiés d'Afrique francophone** — membres gratuits, entreprises payantes. Un moat construit sur 4 piliers : communauté WhatsApp-first, vérification humaine par mentors, données de progression (CORE/Kalman), et boucle complète academy → emploi.

**Objectif 6 mois :** 1 codebase unifiée, funnel d'acquisition live, 500 membres actifs, 10 profils certifiés, 1 premier contrat agence.

---

## 2. État actuel : les 4 projets

| Projet | Domaine | Hébergement | Maturité | Rôle cible |
|---|---|---|---|---|
| `hashcode-community` | Plateforme (Talent Ops, missions, quiz, squads, ateliers, evidences, mentorat, CORE, leaderboard) | `joinhashcode.com` | 🟢 24 models Prisma | **BASE — la plateforme unique** |
| `hashcode_reboot` | Funnel acquisition (landing, profiling 6 étapes, invitation WhatsApp, events) | `reboot.joinhashcode.com` | 🟢 UX supérieure | **Funnel à importer** |
| `hashskills` | Academy/LMS (cours, quiz, programme HEF, IA tutor, certificats) | port 40000 | 🟡 80-90% | **Module Academy à importer** |
| `hashcode-community-portal` | Gestion membres (CRUD, pôles, import Excel) | — | 🟡 70% | **À absorber/décommissionner** |

**Problème :** 3 systèmes d'auth, 3 implémentations de Member, 4 bases de données. Dispersion = dette.

**Décision validée :** Option A — **monolithe modulaire**, 1 codebase (`hashcode-community`), 1 schema Prisma, 1 auth (better-auth). Modules séparés par dossiers : `/acquisition/*`, `/academy/*`, `/community/*`, `/admin/*`.

---

## 3. Analyse des données utilisateurs (204 réponses)

Sources : `Formulaire d'inscription HashCode` (100 réponses) + `Rejoignez innoveCode` (104 réponses).

### Profil type
- **Âge :** 22 ans médiane
- **Niveau :** 51% débutant, 33% intermédiaire, 14% avancé
- **Zone :** Afrique francophone (CI 21%, Bénin 15%, CM 11%, SN 10%, RDC 7%)
- **Acquisition :** 86% via réseaux sociaux
- **Temps disponible :** 55% font 2-5h/semaine, 25% moins de 2h

### Motivations
| Motivation | % |
|---|---|
| Apprendre | 98% |
| Projets collaboratifs | 75% |
| Opportunités pro / réseau | 68% |
| Partager connaissances | 48% |
| Mentorat | 47% |

### Domaines demandés
| Domaine | % |
|---|---|
| Développement web | 70% |
| Cybersecurity | 63% |
| Mobile | 47% |
| IA / ML | 35% |
| Data Science | 35% |
| DevOps | 21% |

### Lacunes techniques (barrières)
| Compétence | % "Non" |
|---|---|
| Entraîner ML | 77% |
| CI/CD | 74% |
| Cryptographie | 74% |
| API REST | 66% |
| Agile/Scrum | 66% |
| Docker/K8s | 9% + 45% vide |

**Lecture :** la base est débutante, motivée par l'apprentissage et le collaboratif, avec un vrai besoin de structuration. Les questions techniques avancées créent du drop-off (45% de réponses vides sur Docker).

---

## 4. Analyse concurrentielle Afrique (2026)

### 4.1 Les marketplaces de talents B2B

| Acteur | Origine | Évolution | Modèle | Langue |
|---|---|---|---|---|
| **Andela** | Nigéria/Global | 2014 → **licorne $1.5B**, 150K talents, 135 pays, Talent Cloud + assessment IA (Qualify), acquisition Codewars/Qualified/Woven | B2B — entreprises paient pour recruter/embarquer | Anglophone |
| **Gebeya** | Éthiopie | 2020 → marketplace panafricaine, matching intelligent (localisation, langue, budget), clients Orange | B2B — freelance pré-vérifié | Anglophone |

**Leçons :**
- Le modèle "usine à talents" est **prouvé** (Andela = 1ère licorne africaine)
- La vérification par assessment est un pilier (Andela Qualify)
- **Ils sont anglophones et globaux** — le marché francophone est sous-servi

### 4.2 Les bootcamps payants B2C

| Acteur | Origine | Évolution | Modèle | Prix |
|---|---|---|---|---|
| **GoMyCode** | Tunisie | 2018 → 40-50K étudiants, 35 campus, 8 pays (Tunisie, Algérie, Maroc, Sénégal, CI, Nigéria, Kenya, Arabie) | B2C — les membres paient | 495 000 FCFA (CI) ≈ 750€ |
| **Kadea Academy** | RDC | Kinshasa/Lubumbashi, "meilleure école de code d'Afrique francophone", 100% insertion revendiqué, certif Simplon, Mentor4Job + Kadea Software | B2C — "étudie puis paie" | $1800 |
| **FivePoints** | Tunisie | 2017 → EdTech + coaching IT, academy.fivepoints.fr ciblant l'Afrique francophone | B2C + recrutement | Variable |

**Leçons :**
- Le B2C francophone est **occupé et financé** (GoMyCode = leader)
- Ils dépendent du **pouvoir d'achat des membres** (faible en Afrique francophone)
- **Aucun n'inverse le modèle** (membres gratuits, entreprises paient)

### 4.3 Les communautés gratuites

| Acteur | Origine | Évolution | Modèle |
|---|---|---|---|
| **Dev Benin** | Bénin | Communauté devs, quiz hebdo, showroom projets, leaderboard, DevSearch IA, WhatsApp | Gratuit — **aucune monétisation** |
| **CodingHQ** | Cameroun | 200 membres, meetups, bootcamps, campus tours | Gratuit — petit |
| **WordPress Francophone** | France | Association, meetups/WordCamps | Gratuit — associatif |
| **CNF (AUF)** | International | 44 Campus Numériques Francophones, formations Moodle | Institutionnel |

**Leçons :**
- Les communautés existent mais **restent au stade communauté** — pas de chemin vers l'emploi, pas de modèle économique
- Dev Benin est le plus proche de nous (quiz, leaderboard, projets) mais **sans boucle de valeur**

### 4.4 Synthèse concurrentielle

```
Andela/Gebeya  →  B2B prouvé mais ANGLOPHONE + global
GoMyCode/Kadea →  Francophone mais B2C (membres paient)
Dev Benin/CodingHQ →  Communauté francophone mais AUCUN modèle
                    ↓
        CRÉNEAU VIDE : Communauté + Academy + Certification + Talent Pool B2B
        en Afrique francophone
```

---

## 5. Le créneau et la différenciation

### 5.1 Le créneau exact

**Le talent pool B2B communautaire francophone.** Les entreprises francophones (CI, Bénin, CM, SN, RDC) galèrent à recruter des profils tech vérifiés localement. Les acteurs existants sont soit anglophones (Andela), soit des écoles payantes (GoMyCode), soit des communautés sans modèle (Dev Benin).

### 5.2 Les 4 piliers du moat (difficile à copier)

| Pilier | Description | Pourquoi c'est dur à copier |
|---|---|---|
| **1. Communauté WhatsApp-first** | La communauté vit sur WhatsApp (déjà existante), la plateforme la structure | Un réseau social ne se copie pas — il se construit dans le temps |
| **2. Vérification humaine** | Les mentors valident les compétences (evidences, certifications) | La confiance humaine ne s'automatise pas — c'est du capital social |
| **3. Données de progression (CORE)** | Kalman filter + quiz psychométrique + tracking de progression | Les données accumulées sur des mois sont un actif unique |
| **4. Boucle complète** | Academy → communauté → evidences → certification → talent pool → emploi | Personne en Afrique francophone n'a la boucle entière |

### 5.3 Le modèle économique inversé

```
OpenClassrooms / GoMyCode / Kadea :  MEMBRES paient (B2C)
HashCode :                            ENTREPRISES paient (B2B) — membres 100% gratuits
```

**Pourquoi c'est structurellement supérieur en Afrique francophone :**
- Pouvoir d'achat des membres : faible → B2C plafonne vite
- Besoin des entreprises : fort (pénurie de talents tech) → B2B scale
- La gratuité attire la masse → la masse produit des talents → les talents se vendent

### 5.4 Ce qui nous différencie de chaque concurrent

| Concurrent | Leur force | Notre réponse |
|---|---|---|
| Andela | Scale global, assessment IA | **Francophone + communautaire** — on joue le terrain qu'ils ignorent |
| GoMyCode | 40K étudiants, campus | **Gratuit + communautaire** — eux vendent des cours, nous vendons des talents |
| Kadea | Réseau entreprise local | **Boucle complète** — eux font formation, nous faisons formation + preuve + placement |
| Dev Benin | Communauté active, DevSearch | **Modèle économique + chemin emploi** — eux restent un hobby, nous devenons une entreprise |

---

## 6. Les actifs existants (à capitaliser)

| Actif | État | Stratégie |
|---|---|---|
| **Communauté WhatsApp** | ✅ Existante | C'est le canal d'acquisition n°1 (86% viennent des réseaux sociaux). La plateforme structure ce qui existe déjà. |
| **Discord** | ⚠️ Inactive | Soit réactiver avec un rôle précis (support technique, squads), soit abandonner au profit de WhatsApp. Décision : **réactiver en canal squads/projets** — WhatsApp = annonces/communauté, Discord = travail collaboratif. |
| **Utilisateurs reboot.hashcode.com** | ✅ Existants | Base de membres à migrer vers la plateforme unifiée. Le profiling 6 étapes a déjà collecté leurs données. |
| **4 projets de code** | ✅ Code existant | Unifier en 1 codebase (monolithe modulaire) — capitaliser, pas réécrire. |

---

## 7. La nouvelle vision (6 mois)

### 7.1 Énoncé de vision

> **HashCode transforme les débutants tech francophones en talents employables et vérifiés — et donne aux entreprises un accès direct à ce vivier.**

### 7.2 La boucle de valeur

```
Débutant (WhatsApp) → Funnel (landing + profiling) → Academy (cours, quiz, HEF)
→ Communauté (squads, missions, projets) → Evidences vérifiées par mentors
→ Certification HashCode → Talent Pool → Entreprises paient (recrutement/agence)
```

### 7.3 Positionnement

- **Pour les membres :** gratuit, communautaire, chemin structuré vers l'employabilité
- **Pour les entreprises :** accès à un vivier de talents vérifiés par la communauté
- **Contre les écoles :** nous ne vendons pas des cours, nous vendons des gens capables
- **Contre les marketplaces :** nous sommes francophones et communautaires, pas un CV-thèque

---

## 8. Feuille de route 6 mois (Sept 2026 → Mars 2027)

### Phase 0 — Unification (Semaines 1-4) 🎯 PRIORITÉ ABSOLUE

| Action | Détail | Livrable |
|---|---|---|
| Audit schema | Mapper les champs de reboot/portal/hashskills dans le schema community | Schema unifié |
| Import funnel | Landing + profiling 6 étapes + invitation WhatsApp dans `/acquisition/*` | Funnel live sur joinhashcode.com |
| Import academy | Modules cours/quiz/HEF de hashskills dans `/academy/*` | Academy live |
| Auth unifiée | better-auth unique, migration des membres reboot | 1 login partout |
| Redirects | `reboot.joinhashcode.com` → 301 vers `/acquisition/*` | Zéro dispersion |

**Objectifs mesurables :** 1 codebase, 1 schema, 1 auth, funnel + academy live, +30% complétion profiling.

### Phase 1 — Communauté & Progression (Semaines 5-10)

| Action | Détail |
|---|---|
| Réactivation Discord | Canal squads/projets, événements hebdo |
| WhatsApp → plateforme | Pont automatique : annonces WhatsApp → actions plateforme |
| Parcours guidé | Roadmap perso par domaine (web/cyber/IA) + badges |
| Dashboard membre | Progression visible : XP, skills, prochaine étape |
| Première contribution | Micro-challenge dès l'inscription (convertir les observateurs) |

**Objectifs mesurables :** 500 membres actifs, 25% actifs/semaine, +40% missions complétées.

### Phase 2 — Certification & Premiers Revenus (Semaines 11-18)

| Action | Détail |
|---|---|
| Workflow certification | Mentors valident les evidences → profils certifiés |
| Espace recruteur | Admin : filtrer profils certifiés par domaine/niveau |
| Premier contrat agence | 1 client réel, 1 équipe de 3-4 membres encadrés |
| Talent pool v1 | Liste publique de talents certifiés |

**Objectifs mesurables :** 10 profils certifiés, 1 contrat agence signé, premiers revenus.

### Phase 3 — Scale & Optimisation (Semaines 19-26)

| Action | Détail |
|---|---|
| Matching IA | Étendre CORE (Kalman) au matching projets/mentors |
| Webinars/events live | Le 48% qui veut du live → acquisition virale |
| Boucle feedback entreprises | Adapter les parcours aux besoins réels des recruteurs |
| Analyse rétention | J30/J60/J90, ajuster le funnel |

**Objectifs mesurables :** 1000 membres, 25 certifiés, 3 contrats, unité économique en vue.

---

## 9. Principes anti-dispersion (non négociables)

1. **1 codebase** — pas de second projet Next.js
2. **1 schema Prisma** — pas de duplication de models
3. **1 auth** — better-auth unique
4. **1 branche main** — feature flags pour les expérimentations
5. **Nouvelle feature → PR avec test + doc**
6. **Import → dossier module** (`/acquisition/`, `/academy/`), jamais à la racine
7. **Décisions architecturales → documentées** (ARCHITECTURE_AUDIT.md)

---

## 10. Risques et garde-fous

| Risque | Gravité | Garde-fou |
|---|---|---|
| Dispersion codebase (retour en arrière) | Élevée | Règle #1 : 1 repo, feature flags |
| GoMyCode ajoute un volet B2B | Moyenne | Vitesse : on ship la boucle complète avant |
| Andela francophonise | Moyenne | Ancrage communautaire local (WhatsApp, mentors) |
| Sur-monétisation prématurée | Moyenne | Phases 0-1 gratuites strictes |
| Baisse d'engagement communauté | Moyenne | Leaderboard + missions + squads maintenus |
| Dépendance WhatsApp | Faible | Canal email + OTP backup |
| Données sensibles recruteur | Élevée | RLS Prisma + audit logs |

---

## 11. Indicateurs clés (KPIs à suivre chaque semaine)

| KPI | Cible 6 mois |
|---|---|
| Membres actifs (7 jours) | 500 |
| Complétion profiling | +30% |
| Missions complétées | +40% |
| Profils certifiés | 25 |
| Contrats agence | 3 |
| Entreprises en contact | 10 |
| Rétention J30 | >40% |

---

## 12. Conclusion

**Le moment est bon.** Le marché francophone tech explose, les entreprises cherchent des talents, les écoles sont chères, les marketplaces sont anglophones, les communautés n'ont pas de modèle. HashCode a déjà : une communauté WhatsApp, une base d'utilisateurs, 4 projets de code, et une vision claire.

**La stratégie :** unifier vite (4 semaines), capitaliser la communauté (WhatsApp + Discord), construire la boucle complète (academy → certification → talent pool), et vendre aux entreprises ce que personne d'autre ne vend en Afrique francophone : **des talents vérifiés par la communauté**.

**L'arme : la vitesse.** Chaque semaine de dispersion est une semaine de retard sur GoMyCode et Dev Benin. Les 6 prochains mois décident de la position de HashCode sur le marché.

---

*Document vivant — revue mensuelle. Prochaine revue : mi-octobre 2026 (fin Phase 0).*