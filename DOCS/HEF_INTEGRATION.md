# Intégration du curriculum HEF — plan

> Source : [`letriplenesty-ai/hashcode-engineering-foundations`](https://github.com/letriplenesty-ai/hashcode-engineering-foundations) (privé)
> Document de travail — aucune modification de code applicatif n'est incluse ici.

## 1. Ce qu'est ce dépôt, et où il se branche

**HashCode Engineering Foundations (HEF)** est le **socle commun d'ingénierie** de l'écosystème HashCode : 17 modules répartis en 4 blocs (Foundations, Systems, Engineering, Advanced), écrits en format « missions » (histoire, concept, exercices, mini-boss, quiz, projet, évaluation, preuves).

Ce n'est **pas un quatrième domaine** à côté de Web / Cyber / IA. C'est le **tronc commun** que tous les membres parcourent avant ou pendant leur spécialisation. Il correspond déjà, dans la base JoinHashCode, au programme `hef` : 4 `ProgramPhase` et 17 `Pillar` (mêmes intitulés).

**Conclusion de positionnement :** HEF alimente l'Academy (`/academy`, `/academy/paths`, `/academy/programme`, `/academy/courses`) et le parcours membre (`/dashboard`, `/missions`, `/dossier`). Il ne crée pas de nouvelle route racine.

## 2. Inventaire de la source

| Élément | Volume |
|---|---|
| Modules | **17** (4 blocs) |
| Missions / chapitres | **169** (9 à 10 par module) |
| Fichiers Markdown | **372** |
| Présentations PowerPoint | **169** (33,7 Mo) |
| Illustrations / cartes SVG | **191** (0,4 Mo) |
| Playground Python (Pyodide) | 17 défis, 11 fiches, XP/badges locaux |
| `EDUCATION-SYSTEM/` | gouvernance, pédagogie, assessment, qualité, rôles |
| `tools/check_repo.py` | validation liens / images / structure |
| Assets vidéo | ~190 Mo (à ne **jamais** versionner dans l'app) |

Structure d'un module :

```text
HEF-NNN-Nom/
├── README.md
├── 01-Course/chapters/NN-titre.md     ← la mission (contenu principal)
├── 03-Labs/lab-01.md                  ← atelier pratique
├── 04-Assessment/final-assessment.md  ← QCM + mise en pratique
├── 04-Assessment/rubrics/             ← grille d'évaluation
├── 05-Project/README.md               ← projet du module
├── 06-Resources/glossary.md|cheatsheet.md
├── 07-Evidence/ (HEF-000 seulement)   ← guide portfolio
└── 08-Slides/NN-titre.pptx
```

## 3. Mapping vers le modèle JoinHashCode

| Source HEF | Modèle / écran actuel | Action |
|---|---|---|
| `00-Program` + 4 blocs | `Program` (`hef`) + `ProgramPhase` | Déjà en base, enrichir `description` / `finality` |
| `HEF-NNN` module | `Pillar` (17 existants) + `Course` (1 par module) | **Lier** chaque `Pillar.courseId` à son cours |
| `01-Course/chapters/NN-*.md` | `Course` → `Section` « Missions » → `Content` type `DOCUMENT` | Importer le Markdown dans `Content.body` |
| `03-Labs/lab-01.md` | `Section` « Atelier » → `Content`, ou `Mission` type LAB | Décision : contenu consultable + mission validable |
| `04-Assessment/final-assessment.md` | `CourseQuiz` + `CourseQuestion` + `CourseOption` | Parser le QCM ; le reste en `Content` |
| `04-Assessment/rubrics/*.md` | `Content` (critères) + `Mission`/`Evidence` | Réutiliser les rubriques du module |
| `05-Project/README.md` | `Mission` type PROJECT + `MissionSubmission` | Rattacher au `Pillar.project` |
| `06-Resources/*` | `Resource` (glossaire, fiche) | 1 ressource par module |
| `07-Evidence/*` | `Content` + futur `Evidence` | Voir décision §7.3 |
| `08-Slides/*.pptx` | `public/hef/slides-pdf/` + `Content.url` (PDF) | Convertir avec `scripts/hef/slides-to-pdf.sh` |
| `playground/` | Route `/academy/playground` (statique, iframe) | Copier `playground/` dans `public/` |
| `tools/check_repo.py` | Job CI « content gate » | Exécuter à chaque sync |

## 4. Écart actuel (à corriger)

1. Le seed Academy actuel ne contient que **3 cours de démonstration**, avec des URLs fictives (`https://cdn.hashcode.com/...`) et aucun contenu réel.
2. Les **17 piliers** existent mais **aucun n'est relié à un cours** (`pillar.courseId = NULL`).
3. Aucun rendu Markdown n'est branché sur `Content.body`.
4. Aucun modèle `Evidence` : le portfolio s'appuie aujourd'hui sur les soumissions de missions.
5. Les 169 PPTX et 190 Mo de vidéos n'ont pas de stratégie de stockage dans l'app.
6. Le format HEF contient de l'XP et des badges **internes aux modules** : à concilier avec D-015 (gel de la gamification générique).

## 5. Architecture d'intégration retenue

```text
Repo HEF (tag de version, ex. v1.0)
        │
        ▼
scripts/hef/parse.ts           ← Markdown → JSON normalisé
        │
        ▼
content/hef/<version>/          ← artefact versionné (léger, sans vidéos)
  program.json
  modules/HEF-000.json … HEF-160.json
  assets.manifest.json
        │
        ▼
prisma/seed-hef.ts             ← upserts idempotents (Program, Phase, Pillar, Course, Section, Content, Quiz, Resource)
        │
        ▼
PostgreSQL  →  /academy/*  +  /dashboard  +  /missions  +  /dossier
```

Principes :

- **La source de vérité reste le repo HEF.** L'app ne réécrit pas le contenu à la main.
- **Import déterministe** : même version ⇒ même JSON ⇒ même base (upserts par `slug`/`code`).
- **Assets séparés** : SVG dans `public/hef/` (0,4 Mo), PPTX convertis en PDF et poussés vers un stockage objet (S3/R2) ou `uploads_data`. Les vidéos ne sont jamais copiées dans le repo app.
- **Rendu Markdown sécurisé** (`react-markdown` + sanitize), TOC, blocs de code, images relatives résolues via le manifest.
- **CI** : `check_repo.py` sur le repo HEF + `pnpm hef:validate` + import à blanc sur PostgreSQL éphémère + tests de mapping.
- **Slides** : `scripts/hef/slides-to-pdf.sh <source>` convertit les PPTX en PDF (LibreOffice requis) avant le parsing.

## 6. Plan par phases

| Phase | Contenu | Livrable | Durée |
|---|---|---|---|
| **P0 — Cadrage** | Figer la version HEF, trancher §7, inventorier les écarts | Décisions + tag source | 1 j |
| **P1 — Pilote** | Parser + importer **HEF-000** complet (9 missions, atelier, évaluation, projet, ressources) | 1 module consultable dans `/academy/courses/hef-000-...` | 3–4 j |
| **P2 — 17 modules** | Import des 169 missions, liaison `Pillar.courseId`, SVGs, navigation | 17 cours, 169 contenus publiés | 4–6 j |
| **P3 — Évaluations** | Parser les QCM, créer `CourseQuiz`/questions/options, brancher la progression | Évaluations jouables, score minimum | 3–4 j |
| **P4 — Pratique & preuves** | Labs → missions, projets, rubriques, parcours portfolio | Labs validables + preuves dans `/dossier` | 3–5 j |
| **P5 — Médias** | PPTX → PDF, stockage, lecteur ; playground Python | Slides consultables + `/academy/playground` | 2–3 j |
| **P6 — Qualité** | Gate CI contenu, SEO, accessibilité, perf, i18n FR | CI verte + audit | 2–3 j |

**Total estimé : 3 à 4 semaines** (hors production éditoriale supplémentaire).

### Détail P1 (prochaine étape recommandée)

1. `scripts/hef/parse.ts` : lire `01-Foundations/HEF-000-Engineering-Mindset`.
2. Produire `content/hef/v1/modules/HEF-000.json`.
3. `prisma/seed-hef.ts` : upsert `Course` + `Section` + `Content` (Markdown brut).
4. Page `/academy/courses/[slug]` : rendre `Content.body` en Markdown.
5. Tests : parsing, idempotence du seed, rendu d'une mission.
6. Preuve : capture desktop/mobile + CI verte.

## 7. Décisions à trancher avant P1

1. **Propriété / licence.** Le repo est privé et appartient à `letriplenesty-ai`. Confirmer par écrit le droit d'usage, de modification et de publication du contenu dans JoinHashCode.
2. **D-015 vs XP/badges HEF.** HEF attribue 100 XP et un badge par mission. Proposition : conserver ces récompenses **au niveau du module** (pédagogie), sans réactiver streaks, cohésion squad ni leaderboard globaux (gels D-015).
3. **Evidence.** Créer un modèle `Evidence` (D-017) ou continuer à utiliser `MissionSubmission` comme preuve ? Recommandation : `Evidence` léger (compétence, livrable, validation, date) relié à `MissionSubmission`.
4. **Stockage des médias.** S3/R2 (recommandé pour 190 Mo de vidéos) vs volume VPS `uploads_data`. Ne jamais committer les vidéos/PPTX dans l'app.
5. **Format des slides.** Conversion PPTX → PDF (visionneuse simple) ; pas de rendu PPTX natif.
6. **Langue.** Contenu FR uniquement au lancement ; prévoir une colonne `language` déjà présente sur `Course`.

## 8. Risques

| Risque | Impact | Mitigation |
|---|---|---|
| Volume médias (196 Mo) | Coût / lenteur | Stockage objet + CDN, pas dans Git |
| Parsing Markdown hétérogène | Contenu incomplet | Parser tolérant + rapport d'erreurs + pilote avant généralisation |
| QCM non structurés | Évaluations impossibles | Extraction progressive, fallback « contenu lisible » |
| Licence incertaine | Blocage juridique | Décision §7.1 avant tout import |
| Duplication seed démo / HEF | Incohérence | Remplacer le seed démo par `seed-hef` pour les 17 modules |
| Dérive pedagogique | Contenu non maintenu | Sync versionnée + gate CI |

## 9. Indicateurs de réussite

- 17 modules et 169 missions accessibles depuis `/academy`.
- 0 lien cassé (gate CI).
- 100 % des modules reliés à un `Pillar.courseId`.
- Première mission HEF-000 terminable de bout en bout (lecture → exercice → quiz → preuve).
- Temps de chargement d'une mission < 2 s (hors vidéo).
- Aucune fausse promesse (URLs CDN fictives supprimées).

## 10. Prochaine action

Valider les décisions §7.1–§7.3, puis lancer **P1 (pilote HEF-000)** sur une branche dédiée avec PR ciblée et CI verte.
