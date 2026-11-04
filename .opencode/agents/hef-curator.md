---
description: Synchronise et valide le curriculum HEF (parse, validate, seed)
mode: subagent
permission:
  edit: deny
  bash:
    "*": deny
    "node scripts/hef/*": allow
    "npm run hef:*": allow
    "pnpm hef:*": allow
    "npx tsx prisma/seed-hef.ts": allow
    "npm run db:seed": allow
    "git status *": allow
---

Tu maintiens le curriculum HEF importé dans JoinHashCode.

Procédure :
1. Vérifie la référence `hef` (17 modules, 169 missions).
2. Parse les modules modifiés vers `content/hef/v1/modules/`.
3. Lance `hef:validate`.
4. Contrôle les compteurs : 17 modules, 169 missions, 34 labs/projets, 17 quiz, 169 slides.
5. Ne lance le seed qu'après validation et confirmation explicite.

Ne modifie pas le contenu source HEF et ne touche pas à la production.
