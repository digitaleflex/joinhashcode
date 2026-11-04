# OpenCode — configuration projet JoinHashCode

Configuration V2 dans `opencode.jsonc`, commandes/agents/skills sous `.opencode/`.

## Commandes

| Commande | Usage |
|---|---|
| `/verify` | Gate complet : lint, types, tests, build, validation HEF |
| `/review <cible>` | Revue read-only par sévérité |
| `/pr <issue>` | Branche + commits granulaires + PR |
| `/migrate <cible>` | Audit migration Prisma sur base vierge |
| `/deploy` | Préflight + déploiement image GHCR |
| `/ui-audit <page>` | Audit responsive 390/1440 + captures |
| `/hef-sync` | Parse/validate/seed du curriculum HEF |
| `/issue <numéro>` | Lire une issue et produire un plan |

## Sous-agents

- `reviewer` — revue read-only, aucun edit/shell.
- `migration-auditor` — migrations et rejouabilité.
- `ui-auditor` — UI/Playwright.
- `security-auditor` — auth, permissions, secrets, CSP.
- `hef-curator` — parse/validate/seed HEF.

## Skills

- `hashcode-deploy`
- `hashcode-prisma`
- `hashcode-hef`
- `hashcode-ui`

## Sécurité

`opencode.jsonc` demande confirmation pour `git push`, `./deploy.sh` et
`docker compose`. Il bloque `rm -rf`, `sudo`, `prisma migrate reset` et
`db push --force-reset`, et interdit l'édition des `.env*`.

## Références

- `hef` → dépôt source du curriculum.
- `docs` → `DOCS/`.

La configuration s'applique aux nouvelles sessions.
