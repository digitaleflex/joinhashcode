# Audit — Soumission des labos HEF

> Date : 2026-11-05
> Périmètre : les 17 labos HEF (`content/hef/v1/modules/*.json`), le flux de soumission actuel
> (`MissionSubmission`), l'écran membre, la review admin et le seed HEF.
> Documents liés : `DOCS/specs/HEF_LEARNING_WORKSPACE.md`,
> `DOCS/AUDIT_REMAINING_ISSUES.md`, `DOCS/WORKLOG_2026-11-05.md`.

## 1. Verdict

Le problème n'est pas un détail d'UI : **le modèle de données suppose qu'un labo = un seul
livrable = un seul lien**. Or la source HEF décrit chaque labo comme un **contrat
multi-preuves** : 3 à 5 artefacts de natures différentes (code, tableau de mesures, rapport,
journal, ADR, sortie de tests, réflexion écrite…).

Aujourd'hui, `prisma/seed-hef.ts` force **tous** les labos en `GITHUB_LINK` :

```ts
// prisma/seed-hef.ts:224
submissionMethod: isLab ? "GITHUB_LINK" : "DOCUMENT_LINK",
```

C'est faux pour les 17 labos. Un lien de dépôt peut être **un** artefact, jamais **le**
formulaire de soumission complet.

Chiffres de la source :

| Élément | Volume |
|---|---:|
| Labos HEF | 17 |
| Lignes de livrables dans `## Preuves à rendre` | 62 |
| Tâches numérotées dans `## Tâches` | 146 |
| Questions de réflexion dans `## Réflexion` | 34 (2 par labo) |

## 2. Ce que demandent réellement les labos

Les labos se répartissent en quatre profils de soumission.

| Profil | Labos | Ce qu'il faut réellement rendre |
|---|---|---|
| **A — Code + mesures + texte** | HEF-000, 010, 020, 030, 040, 050, 060 | Un dépôt/archive de code, un tableau de mesures, un verdict ou une réflexion courte |
| **B — Code + artefacts d'ingénierie** | HEF-070, 080, 090, 100, 110 | Code + tests + rapport d'audit + ADR + journal de refactoring + rapport JUnit |
| **C — Livraison / exploitation** | HEF-120, 130, 140 | Dépôt + Dockerfile + schéma de pipeline + logs/SLI + données brutes + table DORA |
| **D — Produit / IA** | HEF-150, 160 | Cadrage, synthèse d'entretiens, mémo de décision, journal d'outils, rapports d'évaluation |

Quelques exemples qui rendent l'impasse du lien unique évidente :

- **HEF-050** : `incidents.py` + **quatre rapports d'incident générés** + une réflexion de
  5 lignes + 2 questions de réflexion.
- **HEF-110** : matrice de comportements + suite de tests + scores de couverture/mutation +
  **rapport JUnit de la régression contrôlée**.
- **HEF-120** : dépôt Git + Dockerfile audité + **schéma du pipeline** + journaux/SLI/
  décisions canary + **indicateurs DORA calculés**.
- **HEF-150** : cadrage + arbre de métriques + synthèse d'entretiens + plan d'expérience +
  critères d'acceptation exécutés + **mémo de décision avec prévisions chiffrées**.
- **HEF-160** : journal d'outils chaîné + trace d'agent + rapport d'évaluation + rapport du
  vérificateur + tableau du banc d'attaques + fiches de provenance.

Même pour un labo « code » comme HEF-000, le dépôt ne contient pas nécessairement le tableau
de mesures, le journal de débogage et le runbook. Le reviewer ne peut pas vérifier ce qui
n'est pas demandé.

## 3. Ce que fait le code aujourd'hui

### 3.1 Modèle

| Fichier | Constat |
|---|---|
| `prisma/schema.prisma:462` | `Mission.submissionMethod String @default("ANY_LINK")` : une seule méthode par mission |
| `prisma/schema.prisma:510-535` | `MissionSubmission.content String?` : **un seul** contenu libre |
| `prisma/schema.prisma:549-565` | `MissionReview.criteria Json` : des booléens génériques, pas un statut par livrable |

### 3.2 Seed HEF

| Fichier | Constat |
|---|---|
| `prisma/seed-hef.ts:224` | Tous les labos sont seedés en `GITHUB_LINK` |
| `prisma/seed-hef.ts:210` | Tous les labos sont seedés en catégorie `CODE`, y compris HEF-150 (produit) et HEF-160 (IA) |
| `prisma/seed-hef.ts:214-218` | `deliverables` reste un `string[]` : aucune information de type, de format ou de validation |
| `prisma/seed-hef.ts:220-222` | `labTests` n'existe que pour HEF-010 |

### 3.3 API

| Fichier | Constat |
|---|---|
| `app/api/missions/route.ts:46-57` | Deux branches seulement : `TEXT_RESPONSE` (texte non vide) ou méthode URL (`content` doit commencer par `http`) |
| `app/api/missions/route.ts:12-20` | Le payload accepte `missionId` + `content` + champs de rétrospection, pas une liste d'artefacts |
| `app/api/missions/route.ts:76-98` | Un seul `content` est upserté |

### 3.4 Écran membre

| Fichier | Constat |
|---|---|
| `app/missions/[id]/mission-submission-form.tsx:210-241` | Un seul champ : `Textarea` si `TEXT_RESPONSE`, sinon `Input` URL |
| `app/missions/[id]/mission-submission-form.tsx:186` | `isTextResponse` ne connaît que `TEXT_RESPONSE` et `introduction-ancrage` |
| `app/missions/[id]/mission-submission-form.tsx:269-321` | La « rétrospection » est générique (brief, difficulté, note, avis), pas les questions du labo |
| `app/missions/[id]/page.tsx:372-380` | Les livrables sont affichés… mais jamais collectés individuellement |
| `app/missions/[id]/page.tsx:386-395` | La note « invite joinhashcode sur GitHub » s'affiche pour **tous** les labos, même produit/IA |
| `components/missions/submission-guide.tsx:26-35` | Le guide dit explicitement « entre le lien GitHub, l'URL de ton projet, ou ta réponse » : un seul champ |

### 3.5 Review

| Fichier | Constat |
|---|---|
| `components/admin/submissions/review-panel.tsx:108-117` | Un seul bloc « Livrable principal » |
| `components/admin/submissions/review-panel.tsx:132` | La checklist vient de `getCriteriaForMission(category)`, pas des `acceptanceCriteria` du labo |
| `lib/acceptance-criteria.ts:23-71` | Les critères sont génériques par catégorie (`CODE`, `DESIGN`, `BUSINESS`…) |
| `prisma/seed-hef.ts:210` | Comme tous les labos sont `CODE`, même HEF-150 est évalué avec « minimum 3 commits réels » |

### 3.6 Parser HEF

| Fichier | Constat |
|---|---|
| `scripts/hef/parse.mjs:161-190` | Le parser extrait `requirements`, `deliverables`, `acceptanceCriteria`… mais **pas** `## Réflexion` |
| `scripts/hef/parse.mjs:183` | `deliverables` est une simple liste de chaînes |

### 3.7 Auto-évaluation

`LAB_TESTS` ne couvre que HEF-010 (`prisma/seed-hef.ts:169-179`). Le `PythonRunner` de
l'Academy exécute ces tests dans le navigateur et marque la **progression Academy**
(`components/academy/python-runner.tsx:226-238`), pas la soumission de mission. Aucun résultat
de test n'est stocké comme preuve.

## 4. Pourquoi un lien unique ne peut pas marcher

1. **Le lien ne dit pas quel livrable il contient.** Un dépôt HEF-050 peut contenir
   `incidents.py`, les quatre rapports et la réflexion… ou seulement le code.
2. **Tous les livrables ne sont pas des URL.** Une réflexion de 5 lignes, un verdict, une
   recommandation, un runbook ou une matrice sont des textes structurés.
3. **Certains livrables sont des sorties d'exécution.** JUnit, logs de diagnostic, profils
   `cProfile`, plans SQL, données brutes de benchmark, trace d'agent : ce sont des fichiers
   ou des blocs de texte, pas des pages web.
4. **Le reviewer ne peut pas valider les critères du labo.** Il voit un lien et une checklist
   générique. Il ne peut pas dire « le tableau de mesures est absent » ou « la réflexion ne
   répond pas aux deux questions ».
5. **Le portfolio/evidence hérite d'un seul lien.** L'evidence ne peut pas exposer les
   artefacts qui prouvent réellement la compétence.

## 5. Modèle cible

### 5.1 Principe

**L'unité de soumission est le livrable, pas le labo.** Un labo possède un *contrat de
soumission* : une liste ordonnée d'artefacts, chacun avec un type, un caractère obligatoire,
un format accepté et éventuellement une validation automatique.

Ne pas créer un enum `HEF_050_SUBMISSION`, `HEF_110_SUBMISSION`, etc. : cela ne règle pas le
problème du champ unique et ne passe pas à l'échelle.

### 5.2 Schéma proposé

```prisma
model Mission {
  // ...
  submissionSchema Json? // null = ancien mode mono-lien
}

model MissionSubmission {
  // ...
  artifacts MissionSubmissionArtifact[]
}

model MissionSubmissionArtifact {
  id           String   @id @default(cuid())
  submissionId String
  key          String   // "code", "mesures", "journal", "reflexion-1"...
  type         String   // REPO | CODE | TEXT | TABLE | DOC | LOG | DATA | DIAGRAM
  label        String
  value        String?  // URL ou texte
  fileUrl      String?  // upload
  fileName     String?
  mimeType     String?
  size         Int?
  metadata     Json?    // lignes de tableau, commit SHA, résultat de test...
  status       String   @default("SUBMITTED") // SUBMITTED | ACCEPTED | REJECTED
  reviewerNote String?
  submission   MissionSubmission @relation(fields: [submissionId], references: [id], onDelete: Cascade)

  @@unique([submissionId, key])
  @@index([submissionId])
  @@map("mission_submission_artifact")
}
```

Alternative : réutiliser `MissionStep` + `MissionStepResponse`, qui savent déjà stocker des
champs typés et des réponses. C'est plus élégant à long terme, mais cela demande de
généraliser `getStepMissionDef()` (aujourd'hui limité à 3 missions codées en dur) et de
brancher `/missions/[id]`, la review et le portfolio sur `MissionAttempt`. Pour un premier
correctif, la table `MissionSubmissionArtifact` est moins risquée et préserve tout le flux
`MissionSubmission` existant (statuts, XP, review, notifications).

### 5.3 Exemple de contrat — HEF-050

```json
{
  "mode": "MULTI_ARTIFACT",
  "artifacts": [
    {
      "key": "code",
      "label": "incidents.py avec tests",
      "type": "REPO",
      "required": true,
      "accepts": ["github", "zip"]
    },
    {
      "key": "reports",
      "label": "Quatre rapports d'incident générés",
      "type": "DOC",
      "required": true,
      "accepts": ["file", "url"],
      "minItems": 4
    },
    {
      "key": "reflection",
      "label": "Réflexion de 5 lignes",
      "type": "TEXT",
      "required": true,
      "maxLength": 1200
    },
    {
      "key": "questions",
      "label": "Réponses aux 2 questions de réflexion",
      "type": "TEXT",
      "required": true,
      "minLength": 80
    }
  ]
}
```

### 5.4 Exemple de contrat — HEF-010

```json
{
  "mode": "MULTI_ARTIFACT",
  "artifacts": [
    {
      "key": "code",
      "label": "lab.py avec contrat, solutions et tests",
      "type": "REPO",
      "required": true,
      "autoCheck": "LAB_TESTS"
    },
    {
      "key": "timings",
      "label": "Tableau des temps mesurés",
      "type": "TABLE",
      "required": true
    },
    {
      "key": "verdict",
      "label": "Verdict argumenté (5 lignes)",
      "type": "TEXT",
      "required": true,
      "maxLength": 1200
    },
    {
      "key": "questions",
      "label": "Réponses aux 2 questions de réflexion",
      "type": "TEXT",
      "required": true,
      "minLength": 80
    }
  ]
}
```

## 6. Contrat de soumission par labo

Types : `REPO` = dépôt/archive, `CODE` = fichier(s) de code, `TEXT` = réponse écrite,
`TABLE` = tableau structuré, `DOC` = rapport/journal/ADR/runbook/mémo, `LOG` = sortie
d'exécution ou rapport de test, `DATA` = données brutes, `DIAGRAM` = schéma.

| Labo | Contrat proposé | Auto-check |
|---|---|---|
| **HEF-000** | `code` (REPO) · `mesures` (TABLE) · `journal` (DOC/TEXT) · `runbook` (TEXT) · `questions` (TEXT ×2) | Non |
| **HEF-010** | `code` (REPO) · `timings` (TABLE) · `verdict` (TEXT) · `questions` (TEXT ×2) | **Oui** (`LAB_TESTS`) |
| **HEF-020** | `code` (REPO) · `tests` (LOG/REPO) · `bench` (TABLE) · `recommandation` (TEXT) · `questions` (TEXT ×2) | Non |
| **HEF-030** | `code` (CODE/REPO) · `table` (TABLE) · `rapport` (DOC) · `questions` (TEXT ×2) | Non |
| **HEF-040** | `code` (REPO) · `trace` (TEXT/LOG) · `cycles` (TABLE + analyse) · `questions` (TEXT ×2) | Non |
| **HEF-050** | `code` (REPO) · `reports` (DOC ×4) · `reflection` (TEXT) · `questions` (TEXT ×2) | Non |
| **HEF-060** | `code` (REPO) · `diagnostics` (LOG) · `rapport` (DOC/TEXT) · `questions` (TEXT ×2) | Non |
| **HEF-070** | `code` (REPO : `schema.sql`, `donnees.py`, `requetes.py`, `tests.py`) · `plans` (TABLE) · `rapport` (DOC) · `questions` (TEXT ×2) | Non |
| **HEF-080** | `code` (REPO avant/après) · `journal` (DOC) · `tests` (LOG/REPO) · `audit` (DOC) · `adr-dette` (DOC) · `questions` (TEXT ×2) | Non |
| **HEF-090** | `code` (REPO) · `grammaire` (TEXT/DOC) · `journal-diff` (DOC) · `adr` (DOC) · `questions` (TEXT ×2) | Non |
| **HEF-100** | `code` (REPO : fragile + corrigée) · `attaques` (CODE) · `analyseur` (LOG) · `rapport` (DOC) · `questions` (TEXT ×2) | Non |
| **HEF-110** | `matrice` (TABLE/DOC) · `tests` (REPO/LOG) · `couverture` (TABLE) · `junit` (FILE/LOG) · `questions` (TEXT ×2) | Non |
| **HEF-120** | `repo` (REPO) · `docker` (CODE/LOG) · `pipeline` (DIAGRAM) · `logs` (LOG/DATA) · `dora` (TABLE) · `questions` (TEXT ×2) | Non |
| **HEF-130** | `code` (REPO) · `raw` (DATA) · `profils` (LOG/DATA) · `table` (TABLE) · `garde-fous` (CODE/LOG) · `rapport` (DOC) · `questions` (TEXT ×2) | Non |
| **HEF-140** | `code` (REPO) · `bench` (LOG) · `faulty` (LOG) · `table-adr` (DOC/TABLE) · `questions` (TEXT ×2) | Non |
| **HEF-150** | `code` (REPO : `lab/*.py`) · `cadrage` (DOC/TABLE) · `decouverte` (DOC) · `acceptance` (LOG/CODE) · `memo` (DOC) · `questions` (TEXT ×2) | Non |
| **HEF-160** | `code` (REPO : `lab/*.py`) · `journal` (LOG) · `evaluation` (DOC) · `verificateur` (DOC) · `attaques` (TABLE/DOC) · `questions` (TEXT ×2) | Non |

> Note : les contrats ci-dessus sont une proposition de normalisation. La source de vérité
> doit rester le repo HEF ; idéalement, le contrat est ajouté dans le Markdown source
> (bloc `## Soumission`) ou dans un fichier `content/hef/v1/submission-contracts.json`
> versionné, puis importé par `parse.mjs`/`seed-hef.ts`.

## 7. Ce qu'il faut changer

### 7.1 Schéma et migration

1. Ajouter `Mission.submissionSchema Json?`.
2. Ajouter `MissionSubmissionArtifact`.
3. Backfill : pour chaque `MissionSubmission` existante, créer un artefact
   `key = "legacy"`, `type = "LINK"`, `value = content`, afin de ne rien perdre.
4. Ne pas supprimer `MissionSubmission.content` tout de suite : il reste le fallback des
   anciennes missions mono-lien.

### 7.2 Contrats et seed

1. Définir les 17 contrats (tableau §6) dans une source versionnée.
2. `seed-hef.ts` :
   - ne plus forcer `GITHUB_LINK` ;
   - écrire `submissionSchema` ;
   - corriger la catégorie : `CODE` uniquement pour les labos de code, `PRODUCT` pour
     HEF-150, `BUSINESS`/`GENERAL` pour HEF-080/120, etc. ;
   - conserver `submissionMethod = "MULTI_ARTIFACT"` (ou `null`) pour indiquer le nouveau
     mode.
3. Mettre à jour `parse.mjs` pour extraire `## Réflexion` et, si possible, les tâches.

### 7.3 API

1. Nouveau schéma Zod :

```ts
const artifactSchema = z.object({
  key: z.string(),
  type: z.enum(["REPO", "CODE", "TEXT", "TABLE", "DOC", "LOG", "DATA", "DIAGRAM"]),
  value: z.string().optional(),
  fileUrl: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
});
```

2. `POST /api/missions` (ou une route dédiée `.../submit`) accepte
   `artifacts: artifactSchema[]`.
3. Validation serveur **contre `mission.submissionSchema`** :
   - tous les `required` sont présents ;
   - `REPO`/URL : URL `http(s)` valide ;
   - `FILE` : MIME et taille autorisés ;
   - `TEXT` : `minLength`/`maxLength` ;
   - `TABLE` : `minItems` / colonnes attendues.
4. Upsert transactionnel : `MissionSubmission` + remplacement des artefacts.
5. Conserver la compatibilité : si `submissionSchema == null`, appliquer l'ancienne logique
   `TEXT_RESPONSE`/URL.

### 7.4 Upload de fichiers

`lib/mission-media.ts` existe mais n'est branché nulle part. Il faut :

- une route `POST /api/missions/[id]/upload` (auth + rate limit + taille max + MIME) ;
- un composant `FileArtifactField` ;
- un stockage durable (le volume `uploads_data` existe déjà en prod) ;
- idéalement un antivirus/scan et une limite par utilisateur.

### 7.5 Écran membre

Remplacer le champ unique par un rendu dynamique du contrat :

- `REPO` : input URL + aide « public ou joinhashcode collaborateur » ;
- `FILE` : upload + nom/taille + suppression ;
- `TEXT` : textarea + compteur ;
- `TABLE` : tableau dynamique ou textarea Markdown avec modèle ;
- `DIAGRAM` : textarea Mermaid + aperçu ;
- `LOG`/`DATA` : upload ou collage de texte ;
- `questions` : une textarea par question de réflexion du labo.

Ajouter :

- une progression « 3/5 preuves fournies » ;
- un bouton submit désactivé tant que les `required` ne sont pas remplis ;
- un autosave (le moteur d'étapes le fait déjà, pas le formulaire actuel) ;
- un message d'erreur par artefact, pas un toast global.

### 7.6 Review

1. Afficher chaque artefact dans une carte séparée (ouvrir/télécharger).
2. Utiliser `mission.acceptanceCriteria` (JSON du labo) comme checklist, et non
   `getCriteriaForMission(category)`.
3. Stocker dans `MissionReview.criteria` :

```json
{
  "artifacts": {
    "code": { "accepted": true, "note": "" },
    "reports": { "accepted": false, "note": "Il manque le rapport #3" }
  },
  "criteria": {
    "scenario-identifie": true,
    "sain-sans-alerte": true
  }
}
```

4. En cas de révision, pointer l'artefact concerné dans `revisionNotes`.
5. Ne pas approuver si un artefact `required` est `REJECTED`.

### 7.7 Auto-évaluation

- **HEF-010** : exécuter `LAB_TESTS` côté serveur (sandbox Python), stocker le résultat comme
  artefact `LOG`/`TEST_REPORT`. Le résultat auto ne doit valider que l'artefact `code` ;
  `timings`, `verdict` et `questions` restent en review humaine.
- **HEF-040, 070, 100, 110, 130, 140** : pourraient avoir des tests déterministes plus tard.
  Ne pas automatiser les rapports/ADR/mémos.
- Le `PythonRunner` navigateur peut rester un feedback instantané, mais ne doit pas être la
  source de vérité XP.

### 7.8 Portfolio / Evidence

Quand une soumission est approuvée, créer l'evidence avec :

- la compétence du module ;
- la liste des artefacts (type + URL/fichier) ;
- les critères validés ;
- le reviewer et la date.

Le portfolio doit afficher « code + rapport + réflexion », pas un seul lien.

## 8. Plan de livraison

| Phase | Contenu | Effort indicatif |
|---|---|---:|
| **P0 — Cadrage** | Valider la taxonomie, les 17 contrats, le sort des questions de réflexion | 1–2 j |
| **P1 — Schéma + seed** | `submissionSchema`, `MissionSubmissionArtifact`, backfill, contrats seedés | 1–2 j |
| **P2 — API + upload** | Validation multi-artefacts, route upload, compatibilité mono-lien | 2–3 j |
| **P3 — Écran membre** | Formulaire dynamique, progression, autosave, réflexion | 3–4 j |
| **P4 — Review** | Artefacts par carte, critères du labo, refus par artefact | 2–3 j |
| **P5 — Auto-check HEF-010** | Sandbox + résultat stocké | 2–3 j |
| **P6 — Tests + rollout** | Unitaires, API, UI, seed, régression mono-lien | 2 j |

Total réaliste : **8–12 jours** pour un flux complet, hors refonte du portfolio.

## 9. Critères d'acceptation

- [ ] Aucun labo HEF n'est seedé en `GITHUB_LINK` par défaut.
- [ ] Les 17 labos ont un `submissionSchema` avec au moins 3 artefacts.
- [ ] Les 62 livrables de `## Preuves à rendre` sont couverts par un artefact.
- [ ] Les 34 questions de `## Réflexion` sont posées dans le formulaire.
- [ ] Un membre peut soumettre un dépôt **et** un tableau **et** un texte dans le même labo.
- [ ] L'API refuse une soumission s'il manque un artefact `required`.
- [ ] Le reviewer voit chaque artefact séparément et peut en refuser un seul.
- [ ] La checklist de review utilise les `acceptanceCriteria` du labo.
- [ ] HEF-010 peut être auto-testé sans auto-approuver le labo entier.
- [ ] Les anciennes soumissions mono-lien restent lisibles (artefact `legacy`).
- [ ] Les missions non-HEF (mono-lien) continuent de fonctionner.

## 10. Décisions à prendre

1. **Les réponses aux questions de réflexion sont-elles obligatoires ?**
   Recommandation : oui, mais avec un poids faible dans la qualité.
2. **Code : dépôt Git, archive ZIP, ou les deux ?**
   Recommandation : dépôt ou ZIP pour les labos multi-fichiers ; fichier unique pour HEF-010/
   HEF-030.
3. **Upload de fichiers ou liens uniquement ?**
   Recommandation : les deux. Les liens suffisent pour le code, mais les rapports/JUnit/logs
   sont plus simples en upload.
4. **Auto-check : HEF-010 seulement au départ ?**
   Recommandation : oui. Ne pas bloquer le lancement sur un sandbox généralisé.
5. **Applique-t-on le même modèle aux 17 projets de module ?**
   Recommandation : oui, mais dans un second temps. Les projets ont 8 à 11 livrables et
   subissent aujourd'hui le même problème (`DOCUMENT_LINK`).

## 11. À ne pas faire

- Ne pas ajouter un valeur d'enum par labo (`HEF_050`, `HEF_110`…) : le champ reste unique.
- Ne pas forcer un dépôt GitHub pour un labo produit/IA.
- Ne pas considérer un lien comme une preuve suffisante.
- Ne pas auto-approuver un labo parce que le lien répond 200.
- Ne pas stocker des tableaux/artefacts structurés dans `content` (string 5000 caractères).
- Ne pas brancher la review sur la catégorie générique : elle doit lire le contrat du labo.
