# PLAN_EXECUTION.md — Plan d'exécution détaillé 12 mois + dispositif d'agents

> **⚠️ Numérotation issues corrigée 17/09 (v2) :** la 1ère création d'issue avait
> échoué sur un label invalide → le backlog réel est #378 (rituel) → #391 (veille),
> et l'issue docs fin-V1 est **#392**. Toutes les refs ci-dessous sont alignées.
>
> **Date :** 2026-09-17 · **Références :** `DOCS/PIVOT_CYBER.md` (vision), `DOCS/AUDIT_PIVOT.md` (code),
> `DOCS/NETTOYAGE_SUIVI.md` (journal), EPIC #372
> **Règle d'or :** chaque issue = 1 agent responsable + 1 niveau de modèle + 1 gate.
> Le travail humain (issues [B-…]) n'est PAS délégable aux agents.

---

## 1. Le calendrier 12 mois — sprint par sprint

### 🔁 Cadence permanente (chaque semaine, non négociable)

| Rituel | Charge | Issue |
|---|---|---|
| Concierge MVP : micro-tâche → review perso → publication publique | 5-10 h/semaine fondateur | #378 |
| Veille concurrentielle (15 min) + digest mensuel | 1 h/semaine | #391 |
| 1 session mentor-invité par mois | 1 h/invité | #379 |

### 🗓️ M1 (sept.-oct. 2026) — Semaine 1-4 : « La boucle humaine »

| Semaine | Issue | Travail agent (parallèle) | Issue |
|---|---|---|---|
| S1-2 | #392 fin V1 : admin hors nav + **amendement docs** (verrouille la vision) | docwriter → reviewer → verifier | #392 |
| S2-3 | #378 rituel + 5 conversations actifs (validation filière) | — | #378 |
| S2-4 | #379 mentors-pairs + 1er mentor invité | — | #379 |
| S3-4 | #381 freelance fondateur (200-300K FCFA) | — | #381 |
| S4 | **Gate M1 : 10 actifs tenus + docs amendés + 2 références freelance** | | |

### 🗓️ M2 (oct.-nov.) — « Preuve publique + prospection »

| Semaine | Issue | Agents |
|---|---|---|
| S5-6 | #383 **OAPI + repo privé + contrats + entité** (IP verrouillée tôt) | git-engineer (repo), fondateur (OAPI/juridique) |
| S5-7 | #380 **10 entretiens entreprises** + 3 pilots gratuits proposés | fondateur uniquement |
| S6-8 | #384 V2-A rubriques LabRubric + reviewer structuré | builder + reviewer + verifier |
| S7-8 | #382 **1er rapport OSINT public** (signature) | fondateur + docwriter (relecture) |

### 🗓️ M3 (nov.-déc.) — « Le contenu + les premiers dossiers »

| Semaine | Issue | Agents |
|---|---|---|
| S9-10 | #385 V2 les 5 premiers labs réels | builder + docwriter, validation fondateur |
| S9-11 | Suite vitest 100% verte | tester + fixer | #390 |
| S10-12 | 1ère vente possible (sensibilisation 100-250K) | fondateur |
| S12 | **Gate M3 : 25-30 actifs · 5 evidences · 1 client payant OU pilot exécuté** | |

### 🗓️ M4-6 (déc.-fév.) — « Le pipeline tourne »

| Jalon | Issue | Agents |
|---|---|---|
| V3-A lecteur minimal + Progress + Path | #386 | builder + verifier |
| V3-B **Evidence v1** + portfolio vérifié | #387 | builder + reviewer + verifier + security (dossier public) |
| 2e rapport OSINT public (M4) | suite #384 | fondateur |
| 1er dossier vérification PAYANT (M5-6) | suite #381 | fondateur |
| 15-25 actifs, 10 evidences publiques | #379 | fondateur |

### 🗓️ M7-9 (fév.-avr.) — « Premiers placements »

| Jalon | Issue |
|---|---|
| 1er partenariat employeur (banque/télécom/ANCy-type) | suite #381 |
| **1er analyste placé** (objectif central) | suite #381 |
| Vivier recruteur + consentement + journal d'accès | #388 |
| Rémunération mentors par validation (depuis les revenus) | suite #380 |

### 🗓️ M10-12 (avr.-juin 2027) — « Certification + scale »

| Jalon | Issue |
|---|---|
| Certification HashCode Verified Analyst v1 (examen pratique) | #389 |
| Promotions/cohortes (plugin org) | #390 |
| Cohorte sponsorisée (500K-1M) si traction B2B | suite #380 |
| Brief mensuel de menaces → abonnement (50-100K/mois) | suite #380 |
| Vague 5 : élague final (schéma 64→25) — **sur confirmation explicite** | #377 |

---

## 2. La cartographie issue → agent → modèle

### Principe d'allocation (AGENTS.md — le coût = le contexte, pas le tarif)

```
Agents FRÉQUENTS  → flash  (planner, reviewer : glm-5.3-flash)
Agents RÉCURRENTS → flash workhorse (builder, verifier, tester, fixer : deepseek-v4.1-flash)
Agents DOC/REPO   → qwen3.8-flash (docwriter, git-engineer, tester)
Agents RARES/L3+  → lourd (architect, security : glm-5.3)
Exploration/scan  → explore (modèles gratuits opencode/*-free)
Tâches simples L1 → worker gratuits (groq/novita/zhipu/codestral — 0 quota abonnement)
```

### Table de routage par issue

| Issue | Type | Agent principal | Agent secondaire | Modèle | Gate |
|---|---|---|---|---|---|
| #392 admin nav + amendement docs | docs | **docwriter** | reviewer → verifier | qwen3.8-flash → glm-5.3-flash | verify + cohérence docs |
| #378 rituel + conversations | 🧑 humain | **fondateur** | — | — | n/a |
| #379 mentors-pairs | 🧑 humain | **fondateur** | — | — | n/a |
| #380 entretiens B2B | 🧑 humain | **fondateur** | librarian (prépa fiches entreprise) | librarian gratuit | n/a |
| #381 freelance trésorerie | 🧑 humain | **fondateur** | — | — | n/a |
| #382 rapport OSINT public | 🧑 humain | **fondateur** | docwriter (relire) + reviewer | fond. + flash | relecture éthique obligatoire |
| #383 (OAPI/juridique) | 🧑 humain | **fondateur** | — | — | n/a |
| #384 rubriques LabRubric | feature | **builder** | reviewer, verifier | deepseek-v4.1-flash | verify + E2E review |
| #385 5 labs réels | contenu | **docwriter** | fondateur (valide) | qwen3.8-flash | fondateur OK |
| #386 lecteur parcours | feature | **builder** | tester | deepseek-v4.1-flash | verify + E2E |
| #387 Evidence v1 + portfolio | feature | **builder** | reviewer, verifier | deepseek-v4.1-flash | verify + E2E |
| #390 tests préexistants | bug | **tester** + fixer | reviewer | qwen3.8-flash | suite 100% verte |
| #391 veille | recherche | **librarian** | — | gratuit | digest mensuel |
| #388 vivier recruteur | **security zone** | **security** (conception) | builder, verifier | glm-5.3 (rare, L3+) | verify + audit journal |
| #389 certification + Promotions | feature+secu | **security** + builder | verifier | glm-5.3 + deepseek | verify + anti-garde-fou check |
| Vague 5 élague | destructif | **architect** (plan) + builder | verifier | glm-5.3 plan + flash exec | **confirmation propriétaire** + db push |

### Dispositif FREE-first (coût ~0 par session de travail)

| Niveau | Modèles | Usage |
|---|---|---|
| 1-3 (gratuits) | `worker-groq`, `worker-novita` (168 tok/s), `worker-zhipu`, `worker-codestral` | exploration, résumés, rédaction simple, code standard |
| 4 (abonnement flash) | `opencode-go/deepseek-v4.1-flash` (builder), `glm-5.3-flash` (planner/reviewer), `qwen3.8-flash` (doc/tests) | le gros du travail |
| 5 (rare) | `opencode-go/glm-5.3` | architect, security, conception L3+ |
| ❌ jamais | `*-max`, `*-pro`, `kimi-k3`, `grok-4.6`, `zenmux/anthropic` | interdits sans validation |

---

## 3. Definition of Done — standard pour TOUTE issue code

1. `npm run verify` **VERT** (types · lint · prisma · 15 sondes HTTP · E2E) — pas de "ça compile, ça marche"
2. Tests E2E/unitaires pour le comportement nouveau (pas de test sauté sans annonce)
3. Route/API → vérifier la table des guards (session / ADMIN / CRON_SECRET)
4. Schéma changé → migration documentée, jamais destructif sans confirmation
5. Vocabulaire conformité : Labs · Parcours · Portfolio · Vivier · Evidence (pas Dashboard/Mission/Agent)
6. Doc à jour (tracker + issue fermée avec preuve)

## 4. Gates humains (non délégables)

| Moment | Validation |
|---|---|
| Avant Vague 3 | 5 conversations actifs positives (#378) |
| Avant Vague 4 | 1er pilot B2B exécuté (#380) |
| Avant certification v1 | 10 evidences validées + 3 mentors-pairs actifs |
| Avant Vague 5 (destructif) | confirmation explicite du propriétaire |
| Chaque 1er vendu (grid prices) | recueillir le prix réel accepté → ajuster la grille |

## 5. Risques du plan (rappel PIVOT_CYBER §13)

TryHackMe concurrence contenu · un seul relecteur final (goulot M7-12) · juridique OSINT · Terra Talent FR · créneau vide ≠ marché vide (les 10 entretiens #380 tranchent en 4 semaines).

---

*Fichier vivant — mis à jour à chaque sprint review. Prochaine revue : fin S4 (Gate M1).*
---

## 6. Correspondance rituel communautaire ↔ code (inventaire 17/09, vérifié)

| Décision | ✅ Existe déjà dans le code | ❌ Manquant | Quand coder |
|---|---|---|---|
| **D-020 Rangs A/P/V/C** | `memberNumber` (n° unique), `talentVisible` (drapeau Vivier), modèle `Certificate` | Evidence (condition du rang Vérifié), filtre du Vivier | V3 (#387) pour "Vérifié" · V4 (#389) pour "Certifié" |
| **D-021 Classement hebdo** | **`isWeeklyChallenge` + cycleKey "WEEKLY"** : les soumissions hebdo sont DÉJÀ regroupées par cycle ! `qualityLevel` (STANDARD/GOOD/EXEMPLARY) sur chaque soumission = la note | 1 requête de calcul + une page — **mais manuel d'abord** | après Vague 3 |
| **Défi de la semaine** | Le flag `isWeeklyChallenge` est encaissé dans l'admin (PATCH) + cycle system | le **contenu cyber** : 0 lab cyber en base (12 missions = ancienne vision) → #385 ; le GET `/api/missions` ne filtre pas `publishAt` → les vieilles missions restent visibles | Vague 2 (#384-385) |
| **Rentrée mensuelle + parrainage** | RIEN — et c'est normal (manuel tant que < 50 nouveaux/mois) | rien | Vague 4 (#389 Promotions) |
| **Invitation** | funnel `/acquisition` (3 pages, 200) · `/invite/[slug]` existe (ciblait squads — gelé) | réorienter `/invite` → le parcours (au lieu de join-squad) | Vague 2, petit ajustement |
| **Evidence** | `MissionSubmission` + `qualityLevel` = **précurseurs directs** (la donnée existe déjà à chaque défi passé par le site) | modèle `Evidence` + UI + portfolio (`/dossier` a le trou D4) | Vague 3 (#387) |
| **Suivi membres** | `ActivityLog`, `AnalyticsEvent`, sessions actives (dashboard admin "activeNow") | le "signe de vie" hebdo → manuel (feuille) | CRM codé si > 50 inscrits |
| **Certification** | modèle `Certificate` existe (academy, câblé) | examen pratique + émission depuis les evidences | Vague 4 (#389) |

### ⚡ Conséquence : le plan Vague 2-3 est PLUS LÉGER que prévu
1. Le système de cycle hebdo existe → #384 "rubriques" peut rester léger (qualityLevel suffit pour le classement manuel → le classement codé viendra après Vague 3 sans refonte)
2. Les soumissions du Défi 1 de CETTE SEMAINE produisent déjà les données qu'Evidence consommera
3. Le seul candidat "code tout de suite" (exception au moratoire, 10 lignes) : filtrer le GET des missions sur `publishAt` — pour masquer les vieilles missions depuis l'admin. **Sur validation explicite du propriétaire.**
4. Le travail "tout de suite" réellement utile = **le contenu des 5 labs (#385)** — des fiches, pas du code — préparables PENDANT le moratoire par docwriter + fondateur.

