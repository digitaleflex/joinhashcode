# Audit — Issues restantes et backlog non tracké

> Date : 2026-11-05
> Référence : `main@13c20aecb3db742608b2a439f7289b9ccbf802c4`
> Sources : GitHub MCP read-only, code local, docs `DOCS/*`, `DOCS/specs/*`
> Documents liés : `DOCS/WORKLOG_2026-11-05.md`, `DOCS/AUDIT_LAB_SUBMISSIONS.md`,
> `DOCS/specs/HEF_LEARNING_WORKSPACE.md`

---

## 1. Résumé exécutif

- **10 issues GitHub ouvertes**, **0 PR ouverte**.
- **CI verte** sur `main@13c20ae` : Quality gates + Build & Push.
- **Aucune issue stale** au sens >90 jours.
- **Risques immédiats** :
  1. `#403` (auth/OTP/profil) a une échéance au **2026-11-06**.
  2. `#415` (Zod 3 → 4.6.6+, advisory mémoire) est **haute sécurité** et n'a pas bougé
     depuis sa création.
  3. `#416` (protection de branche) est **bloqué par le plan GitHub**.
  4. `#417` (HEF) est **decision-gated** : licence, D-015, Evidence, stockage média —
     mais l'implémentation avance déjà par petits morceaux.
  5. `#408` / `#407` (recette + release) dépendent de `#403` et `#406`.
- **Aucune issue n'a d'assignee ni de milestone GitHub** : les phases M1–M6 et les
  responsables existent seulement dans les titres/proses. Le retard n'est pas visible
  dans GitHub.
- **Backlog non tracké** : 7 sujets de soumission HEF + 20 sujets d'espace
  d'apprentissage + 5 sujets plateforme, détaillés §4.

---

## 2. État GitHub

### 2.1 Issues ouvertes

| # | Titre | Labels | Priorité | Échéance / état | Risque |
|---|---|---|---|---|---|
| **#417** | `[HEF] Intégrer le curriculum HashCode Engineering Foundations (17 modules / 169 missions)` | feature, high, platform | Haute | Decision-gated | **Umbrella trop large** ; les sujets labos/workspace n'ont pas d'issues enfants |
| **#416** | `[Ops] Activer la protection de branche main quand le plan GitHub le permet` | medium, infrastructure | Moyenne | **Bloquée** (403 GitHub plan) | Force-push / suppression non protégés |
| **#415** | `[Security] Passer Zod 3 → 4.6.6+ (advisory memory exhaustion)` | security, high | Haute | 0 commentaire, 0 assignee | Vulnérabilité non corrigée |
| **#414** | `[EXECUTION] Backlog post-D-024 — plan d'action agents et gates de livraison` | epic, critical | Critique | Tracking | Dépend de ses enfants |
| **#408** | `[M5] Exécuter la recette complète fonctionnelle, UX et responsive avant release` | feature, critical, pipeline | Critique | Cible 2026-11-16 | Dépend de M1–M4 |
| **#407** | `[M6] Préparer la release, déployer et valider la production` | feature, critical, pipeline | Critique | Cible 2026-11-19 | Dépend de #408 |
| **#406** | `[M4] Finaliser le centre d'administration et les communications opérationnelles` | feature, high, admin | Haute | Cible 2026-11-13 | Dépend de #405 (formellement) |
| **#405** | `[M3] Auditer et intégrer les capacités Reboot retenues` | feature, high, admin | Haute | Cible 2026-11-10 | Dépendance M0 levée |
| **#403** | `[M2] Fiabiliser inscription, vérification et création de profil` | feature, critical, platform | Critique | **Cible 2026-11-06** | Échéance imminente |
| **#391** | `Veille concurrentielle : DOCS/CONCURRENCE.md + routine hebdo` | medium, business | Moyenne | Actif | Aucun bloqueur |

### 2.2 PR et CI

- **0 PR ouverte**.
- **CI verte** à `main@13c20ae` :
  - `CI — Quality gates` : success (run 41999936639).
  - `Build & Push image` : success (run 41999936853).
  - `API v1 contract checks` : success (dernier run sur `b8ac41f`).
  - `Compose validation` : success.
- Deux échecs historiques sur `main` (2026-11-04), déjà supersédés :
  - E2E auth OTP (`f5cc1e0`) ;
  - build-push image (`cf5476d`).
- Workflows legacy sans activité récente : `docker-publish.yml`, `docker-image.yml`.
  Ils ressemblent à des doublons de `deploy.yml` et méritent un nettoyage.

### 2.3 Hygiène GitHub

| Constat | Impact |
|---|---|
| Aucune issue n'a d'assignee | Responsabilité floue |
| Aucune issue n'a de milestone | Slippage invisible |
| Les phases M1–M6 sont dans les titres/proses | Pas de vue roadmap fiable |
| #417 est un méga-issue | Les sous-sujets HEF ne sont pas trackés |
| #416 bloqué par le plan GitHub | À documenter comme risque accepté ou à débloquer |

---

## 3. Audit des documents produits

### 3.1 `DOCS/AUDIT_LAB_SUBMISSIONS.md`

**Statut** : analyse terminée, aucune implémentation.

**Constats** :
- 17 labos, 62 livrables, 3 à 5 artefacts par labo.
- Tous les labos seedés en `GITHUB_LINK`.
- Tous les labos catégorie `CODE`.
- `MissionSubmission.content` mono-champ.
- Review mono-livrable + checklist générique.
- Parser sans `## Réflexion`.
- `LAB_TESTS` limité à HEF-010.

**Décisions proposées** :
- `Mission.submissionSchema` + `MissionSubmissionArtifact`.
- Formulaire dynamique + upload.
- Review par artefact + `acceptanceCriteria` du labo.
- Auto-check HEF-010 uniquement.
- Backfill `legacy`.

### 3.2 `DOCS/specs/HEF_LEARNING_WORKSPACE.md`

**Statut** : spécification terminée, aucune implémentation.

**Constats** :
- 169 missions × 13 sections.
- 845 questions de quiz éclair non importées.
- 338 questions de réflexion non collectées.
- 136 questions finales sans explication/feedback.
- Playground Python isolé (`localStorage`).
- Mentor membre absent.
- CSP bloque les embeds.

**Décisions proposées** :
- 8 hubs (Cockpit, Module, Lab Bench, Quiz & Correction, Evidence, Mentor, Progression,
  Communauté).
- 12 outils first-party.
- Services externes (Piston/Judge0, LLM, R2, LiveKit, Cal.com, etc.).
- Roadmap P0–P3.

---

## 4. Backlog non tracké

Les tableaux ci-dessous listent les sujets qui ne sont **pas** des issues GitHub ouvertes.
Ils sont proposés comme **issues enfants de #417** (HEF) ou comme issues plateforme.

### 4.1 Soumission des labos HEF

| ID proposé | Titre | Priorité | Effort | Dépend de |
|---|---|---|---|---|
| **HEF-SUB-01** | Modèle multi-artefacts : `submissionSchema` + `MissionSubmissionArtifact` + backfill | P0 | 1–2 j | — |
| **HEF-SUB-02** | Contrats des 17 labos + seed + catégories correctes | P0 | 1–2 j | HEF-SUB-01 |
| **HEF-SUB-03** | Formulaire membre dynamique + upload + validation serveur | P0 | 3–4 j | HEF-SUB-01/02 |
| **HEF-SUB-04** | Review par artefact + critères du labo | P0 | 2–3 j | HEF-SUB-03 |
| **HEF-SUB-05** | Auto-check HEF-010 (sandbox serveur + artefact de test) | P1 | 2–3 j | HEF-SUB-03 |
| **HEF-SUB-06** | Parser `## Réflexion` + quiz éclair des missions | P0 | 1–2 j | — |
| **HEF-SUB-07** | Corriger les rubriques génériques (`CODE` partout) | P0 | 0,5 j | — |

### 4.2 Espace d'apprentissage HEF

| ID proposé | Titre | Priorité | Effort | Dépend de |
|---|---|---|---|---|
| **HEF-WS-01** | Shell `/academy/workspace` + Cockpit + reprise | P0 | 3–4 j | — |
| **HEF-WS-02** | Mission Player 13 étapes (`ContentStep` + `ContentStepProgress`) | P0 | 5–7 j | HEF-WS-01 |
| **HEF-WS-03** | Import des 845 quiz éclair + 338 réflexions | P0 | 3–4 j | HEF-SUB-06 |
| **HEF-WS-04** | Explications + feedback par option + commentaires | P0 | 3–4 j | HEF-WS-03 |
| **HEF-WS-05** | Carnet d'erreurs + révision espacée SM-2 | P0 | 3–4 j | HEF-WS-04 |
| **HEF-WS-06** | Persistance du playground + exécution serveur | P0 | 2–3 j | HEF-WS-01 |
| **HEF-WS-07** | SQL Lab (SQLite/PGlite + EXPLAIN) | P1 | 4–6 j | HEF-WS-01 |
| **HEF-WS-08** | Terminal Lab (simulateur puis sandbox) | P1 | 5–8 j | HEF-WS-01 |
| **HEF-WS-09** | Git Lab (isomorphic-git + diff + PR) | P1 | 4–6 j | HEF-WS-01 |
| **HEF-WS-10** | Docker/CI + Network Labs | P2 | 8–12 j | HEF-WS-08 |
| **HEF-WS-11** | Notebook + Diagram Studio | P2 | 5–7 j | HEF-WS-01 |
| **HEF-WS-12** | Test/Profiler + Security Labs | P2 | 8–12 j | HEF-WS-07 |
| **HEF-WS-13** | AI Lab + AI Tutor (RAG, citations, garde-fous) | P1/P2 | 8–12 j | HEF-WS-01 |
| **HEF-WS-14** | Product Lab (entretiens, métriques, RICE, mémo) | P2 | 4–6 j | HEF-WS-01 |
| **HEF-WS-15** | Mentor Hub membre + chat + booking Cal.com | P1 | 6–10 j | HEF-WS-01 |
| **HEF-WS-16** | Evidence Locker + compétences + portfolio | P0/P1 | 5–8 j | HEF-SUB-01 |
| **HEF-WS-17** | Recherche globale + notifications d'étude | P1 | 3–5 j | HEF-WS-01 |
| **HEF-WS-18** | CSP allowlist + intégrations externes + proxy | P0 | 2–3 j | — |
| **HEF-WS-19** | PWA/offline + audit accessibilité | P2 | 4–6 j | HEF-WS-01 |
| **HEF-WS-20** | Analytics apprentissage + certificats vérifiables | P2 | 5–8 j | HEF-WS-16 |

### 4.3 Plateforme / hygiène

| ID proposé | Titre | Priorité | Effort | Dépend de |
|---|---|---|---|---|
| **PLAT-01** | `#415` Zod 3 → 4.6.6+ | P0 sécurité | 1–2 j | — |
| **PLAT-02** | `#416` protection de branche | P1 | bloqué plan GitHub | — |
| **PLAT-03** | `#403` auth/OTP/profil | P0 | en cours | — |
| **PLAT-04** | `#408`/`#407` recette + release | P0 | gates | #403/#406 |
| **PLAT-05** | `#406`/`#405` admin/Reboot | P1 | en cours | — |
| **PLAT-06** | Nettoyer les workflows Docker legacy | P2 | 0,5 j | — |
| **PLAT-07** | Ajouter assignees + milestones GitHub | P1 | 0,5 j | — |
| **PLAT-08** | Mettre à jour `DOCS/PLAN_EXECUTION.md` (issues #384–390 non ouvertes) | P2 | 0,5 j | — |
| **PLAT-09** | Documenter `#416` comme risque accepté si le plan GitHub ne change pas | P2 | 0,5 j | — |

---

## 5. Mapping vers les issues existantes

| Sujet | Issue existante | Action recommandée |
|---|---|---|
| HEF global | **#417** | Ajouter les liens vers les deux specs + créer les issues enfants HEF-SUB/WS |
| Auth/OTP/profil | **#403** | Priorité absolue, échéance 2026-11-06 |
| Zod | **#415** | Traiter avant la release ; sinon risque sécurité documenté |
| Protection de branche | **#416** | Bloqué ; documenter ou changer de plan |
| Recette/release | **#408**, **#407** | Ne pas lancer avant #403/#406 |
| Admin/Reboot | **#406**, **#405** | Garder la séquence, mais #405 est un prérequis formel |
| Epic d'exécution | **#414** | Mettre à jour avec les nouvelles issues HEF |
| Veille | **#391** | Indépendant |
| Labos/workspace | **aucune** | Créer les issues enfants sous #417 |

---

## 6. Priorisation

### P0 — Avant la release / ce qui bloque

1. **#403** — auth/OTP/profil (échéance 2026-11-06).
2. **#415** — Zod sécurité.
3. **#408** / **#407** — recette et release.
4. **HEF-SUB-01/02/03/04** — multi-artefacts labos.
5. **HEF-WS-01/02/03/04/05** — shell, 13 étapes, quiz, corrections, erreurs.
6. **HEF-WS-06** — persistance playground.
7. **HEF-WS-18** — CSP/embeds.
8. **HEF-WS-16** — Evidence Locker minimal.

### P1 — Après la release

- HEF-WS-07/08/09 (SQL, Terminal, Git).
- HEF-WS-13 (AI Tutor).
- HEF-WS-15 (Mentor Hub).
- HEF-WS-17 (recherche/notifications).
- HEF-SUB-05 (auto-check HEF-010).
- PLAT-02/07 (protection de branche, hygiène GitHub).

### P2 — Ensuite

- HEF-WS-10/11/12/14 (labos avancés).
- HEF-WS-19/20 (PWA, analytics, certificats).
- PLAT-06/08/09 (nettoyage docs/workflows).

### P3 — Continu

- Marketplace mentors, sessions live, API publique, certifications avancées.

---

## 7. Décisions à prendre

1. **#417** : créer les issues enfants maintenant, ou garder un seul méga-issue ?
   Recommandation : créer les enfants, sinon le suivi est impossible.
2. **Multi-artefacts** : valider `MissionSubmissionArtifact` vs réutilisation de
   `MissionStep`/`MissionAttempt`. Recommandation : `MissionSubmissionArtifact` pour P0,
   refactor du moteur d'étapes plus tard.
3. **Contenu** : qui rédige/relit les explications des 845 + 136 questions ?
4. **Sandbox** : Piston/Judge0/E2B/Modal ? Recommandation : Piston self-hosted pour P0/P1,
   E2B/Modal pour les labs avancés.
5. **LLM** : fournisseur, modèle, budget, quotas. Recommandation : proxy serveur + RAG
   pgvector, modèle économique pour le tuteur, modèle plus fort pour les reviews.
6. **Mentor** : humain + IA ou IA-first ? Recommandation : IA pour l'aide immédiate,
   humain pour la validation et le déblocage.
7. **CSP** : quels domaines autoriser, et qui valide la sécurité ?
8. **Release** : le P0 HEF entre-t-il dans #407/#408, ou sort-il après ?

---

## 8. Prochaines actions concrètes

1. **Aujourd'hui** :
   - vérifier `#403` (échéance demain) ;
   - ouvrir `#415` (Zod) ;
   - commenter `#416` (blocage plan GitHub).
2. **Cette semaine** :
   - commenter `#417` avec les liens vers `DOCS/AUDIT_LAB_SUBMISSIONS.md` et
     `DOCS/specs/HEF_LEARNING_WORKSPACE.md` ;
   - créer les issues enfants `HEF-SUB-01..07` et `HEF-WS-01..20` (ou au moins P0) ;
   - ajouter assignees + milestones aux 10 issues ouvertes.
3. **Avant la release** :
   - trancher les 8 décisions du §7 ;
   - valider le P0 HEF ;
   - mettre à jour `#408`/`#407` avec le périmètre HEF retenu.
4. **Après validation** :
   - lancer HEF-SUB-01/02 (schéma + contrats) ;
   - puis HEF-WS-01/02 (shell + 13 étapes) ;
   - puis HEF-WS-03/04/05 (quiz, corrections, erreurs).

---

## 10. Issues créées le 2026-11-05

31 issues ont été créées et rattachées à l'epic #417.

| ID | Issue |
|---|---|
| **HEF-SUB-01** | [#418 — Modèle multi-artefacts pour les labos (schema + migration + backfill)](https://github.com/digitaleflex/joinhashcode/issues/418) |
| **HEF-SUB-02** | [#419 — Contrats de soumission des 17 labos + seed + catégories](https://github.com/digitaleflex/joinhashcode/issues/419) |
| **HEF-SUB-03** | [#420 — Formulaire membre dynamique + upload + validation serveur](https://github.com/digitaleflex/joinhashcode/issues/420) |
| **HEF-SUB-04** | [#421 — Review par artefact + critères du labo](https://github.com/digitaleflex/joinhashcode/issues/421) |
| **HEF-SUB-05** | [#422 — Auto-check HEF-010 (sandbox serveur + artefact de test)](https://github.com/digitaleflex/joinhashcode/issues/422) |
| **HEF-SUB-06** | [#423 — Parser `## Réflexion` + quiz éclair des missions](https://github.com/digitaleflex/joinhashcode/issues/423) |
| **HEF-SUB-07** | [#424 — Corriger les rubriques génériques `CODE` des labos](https://github.com/digitaleflex/joinhashcode/issues/424) |
| **HEF-WS-01** | [#425 — Shell `/academy/workspace` + Cockpit + reprise](https://github.com/digitaleflex/joinhashcode/issues/425) |
| **HEF-WS-02** | [#426 — Mission Player en 13 étapes](https://github.com/digitaleflex/joinhashcode/issues/426) |
| **HEF-WS-03** | [#427 — Importer les 845 quiz éclair et 338 questions de réflexion](https://github.com/digitaleflex/joinhashcode/issues/427) |
| **HEF-WS-04** | [#428 — Explications de quiz + feedback par option + commentaires](https://github.com/digitaleflex/joinhashcode/issues/428) |
| **HEF-WS-05** | [#429 — Carnet d'erreurs + révision espacée SM-2](https://github.com/digitaleflex/joinhashcode/issues/429) |
| **HEF-WS-06** | [#430 — Persistance du playground + exécution serveur](https://github.com/digitaleflex/joinhashcode/issues/430) |
| **HEF-WS-07** | [#431 — SQL Lab (SQLite/PGlite + EXPLAIN)](https://github.com/digitaleflex/joinhashcode/issues/431) |
| **HEF-WS-08** | [#432 — Terminal Lab (simulateur puis sandbox)](https://github.com/digitaleflex/joinhashcode/issues/432) |
| **HEF-WS-09** | [#433 — Git Lab (isomorphic-git + diff + PR)](https://github.com/digitaleflex/joinhashcode/issues/433) |
| **HEF-WS-10** | [#434 — Docker/CI + Network Labs](https://github.com/digitaleflex/joinhashcode/issues/434) |
| **HEF-WS-11** | [#435 — Notebook + Diagram Studio](https://github.com/digitaleflex/joinhashcode/issues/435) |
| **HEF-WS-12** | [#436 — Test/Profiler + Security Labs](https://github.com/digitaleflex/joinhashcode/issues/436) |
| **HEF-WS-13** | [#437 — AI Lab + AI Tutor (RAG, citations, garde-fous)](https://github.com/digitaleflex/joinhashcode/issues/437) |
| **HEF-WS-14** | [#438 — Product Lab (entretiens, métriques, RICE, mémo)](https://github.com/digitaleflex/joinhashcode/issues/438) |
| **HEF-WS-15** | [#439 — Mentor Hub membre + chat + booking](https://github.com/digitaleflex/joinhashcode/issues/439) |
| **HEF-WS-16** | [#440 — Evidence Locker + compétences + portfolio](https://github.com/digitaleflex/joinhashcode/issues/440) |
| **HEF-WS-17** | [#441 — Recherche globale + notifications d'étude](https://github.com/digitaleflex/joinhashcode/issues/441) |
| **HEF-WS-18** | [#442 — CSP allowlist + intégrations externes + proxy](https://github.com/digitaleflex/joinhashcode/issues/442) |
| **HEF-WS-19** | [#443 — PWA/offline + audit accessibilité](https://github.com/digitaleflex/joinhashcode/issues/443) |
| **HEF-WS-20** | [#444 — Analytics apprentissage + certificats vérifiables](https://github.com/digitaleflex/joinhashcode/issues/444) |
| **PLAT-06** | [#445 — Nettoyer les workflows Docker legacy](https://github.com/digitaleflex/joinhashcode/issues/445) |
| **PLAT-07** | [#446 — Ajouter assignees + milestones aux issues ouvertes](https://github.com/digitaleflex/joinhashcode/issues/446) |
| **PLAT-08** | [#447 — Mettre à jour `DOCS/PLAN_EXECUTION.md`](https://github.com/digitaleflex/joinhashcode/issues/447) |
| **PLAT-09** | [#448 — Documenter #416 comme risque accepté si le plan GitHub ne change pas](https://github.com/digitaleflex/joinhashcode/issues/448) |

---

## 9. Annexes

### A. Issues GitHub fermées citées par #414

`#395`, `#396`, `#398`, `#400`, `#404`, `#411` — toutes fermées `completed`
les 2026-11-02/04.

### B. Documents à ne pas utiliser comme source active

- `DOCS/archive/ROADMAP_ISSUES.md` : archivé le 2026-09-16, contient du périmètre
  explicitement éliminé. Ne pas s'en servir pour décider.
- `DOCS/FRICTIONS.md` : vide, à remplir après les premiers bêta-tests.

### C. Workflows legacy

- `docker-publish.yml` : aucun run récent.
- `docker-image.yml` : aucun run récent.
- `deploy.yml` : workflow actif.
- À vérifier avant suppression : ne pas casser un déploiement manuel.
