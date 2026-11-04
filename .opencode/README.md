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
| `/issue <numéro>` | Lire une issue GitHub et produire un plan |
| `/gh <demande>` | Interroger issues, PR et CI en lecture seule |

## Sous-agents

- `reviewer` — revue read-only, git en lecture seule, aucun edit.
- `migration-auditor` — migrations et rejouabilité.
- `ui-auditor` — UI/Playwright MCP.
- `security-auditor` — auth, permissions, secrets, CSP.
- `hef-curator` — parse/validate/seed HEF.
- `github-ops` — issues, PR et CI GitHub en lecture seule.

## Skills

- `hashcode-deploy`
- `hashcode-prisma`
- `hashcode-hef`
- `hashcode-ui`

## MCP

Les outils MCP sont **désactivés globalement** pour préserver le contexte, puis
réactivés dans le sous-agent concerné :

| Serveur | Outils | Activé dans |
|---|---|---|
| `playwright` | `playwright_*` | `ui-auditor`, `/ui-audit` |
| `github` | `github_*` | `github-ops`, `/issue`, `/gh` |

### GitHub MCP (lecture seule)

- URL : `https://api.githubcopilot.com/mcp/`
- Toolsets : `context,issues,pull_requests,actions`
- En-tête `X-MCP-Readonly: true` : aucune écriture via MCP.
- Jeton lu depuis `~/.config/opencode/github-token` (jamais dans le dépôt).

Créer ou rafraîchir le jeton :

```bash
mkdir -p ~/.config/opencode
( umask 077; printf '%s' "$(gh auth token)" > ~/.config/opencode/github-token )
```

Les écritures GitHub passent par `gh` en CLI et demandent confirmation
(`gh issue create`, `gh issue close`, `gh pr create`). `gh pr merge` est bloqué.

### Playwright MCP

Lancé en headless, profil isolé, sorties dans `/tmp/opencode/playwright-mcp`.
Utilisé pour les audits UI et les captures 390/1440.

## Sécurité

`opencode.jsonc` utilise la syntaxe V2 `permission` (objet, dernière règle
gagnante). Il demande confirmation pour `git push`, `./deploy.sh`,
`docker compose`, `gh api` et les écritures GitHub. Il bloque `rm -rf`, `sudo`,
`prisma migrate reset`, `db push --force-reset`, `git reset --hard` et
`gh pr merge`, et interdit l'édition des `.env*`.

## Références

- `hef` → dépôt source du curriculum.
- `docs` → `DOCS/`.

La configuration s'applique aux nouvelles sessions.
