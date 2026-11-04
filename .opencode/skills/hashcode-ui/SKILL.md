---
name: HashCode UI
description: Auditer et maintenir l'UI JoinHashCode (responsive, navigation, contraste, cohérence)
---

# UI JoinHashCode

## Design
- Identité : graphite + lime (`bg-background`, `text-foreground`, `text-primary`).
- Contenu pédagogique : corps minimum 14–15 px ; labels 11–12 px max.
- Statuts : vert = validé, ambre = en attente, orange = à corriger, rouge = refusé.
- Un seul CTA principal par écran.

## Breakpoints à tester
- **390 px** (mobile)
- **768 px** (tablette)
- **1440 px** (desktop)

## Vérifications
```bash
npx playwright screenshot --viewport-size=390,844 <url> /tmp/mobile.png
npx playwright screenshot --viewport-size=1440,900 <url> /tmp/desktop.png
```
Contrôler :
1. navbar fixe, logo, état actif, menu mobile ;
2. `document.documentElement.scrollWidth === window.innerWidth` ;
3. titres non coupés, cartes sans chevauchement ;
4. contraste et taille de texte ;
5. états vides, chargements, erreurs.

## Layout leçon
- Desktop : `lg:grid-cols-[minmax(0,1fr)_320px]`, rail sticky.
- Mobile : workspace en premier, sommaire masqué.

## Livrable
Tableau : page, viewport, problème, sévérité, correctif.
