---
name: HashCode HEF
description: Synchroniser et valider le curriculum HEF (parse, artefacts, seeds, assets, slides)
---

# Curriculum HEF

Source de vérité : dépôt `letriplenesty-ai/hashcode-engineering-foundations`
(référence OpenCode `hef`).

## Structure
- 17 modules (`HEF-000` → `HEF-160`), 169 missions.
- 17 labs + 17 projets = 34 missions HEF.
- 17 quiz, 136 questions.
- 169 slides PDF.

## Parse
```bash
node scripts/hef/parse.mjs --source <ref> --module HEF-XXX \
  --out content/hef/v1/modules/HEF-XXX.json
```

## Valider
```bash
pnpm hef:validate
```
Vérifie : 17 modules, 169 missions, 169 slides, 17 quiz, livrables, rubriques à
100 %, assets présents, absence de chemins `10-Assets`.

## Seed
```bash
pnpm hef:seed        # import idempotent des 17 modules
pnpm db:seed         # seed global (inclut HEF)
```

## Slides
```bash
scripts/hef/slides-to-pdf.sh <source>   # LibreOffice requis
```

## Règles
- Ne jamais committer les vidéos ni les PPTX sources dans l'app.
- Les assets vont dans `public/hef/{modules,parcours,personnages,logo,...}`.
- Signaler les écarts avant tout seed de production.
