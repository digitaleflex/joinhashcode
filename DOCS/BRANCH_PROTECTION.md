# Protection de la branche `main`

> Issue : #416 — `[Ops] Activer la protection de branche main quand le plan GitHub le permet`
> Statut : **bloqué par le plan GitHub actuel** (403 sur les règles de protection).
> Dernière mise à jour : 2026-11-16

## Pourquoi cette protection

La branche `main` est la source de vérité déployée (image GHCR + VPS). Sans protection,
un force-push ou une suppression accidentelle peut casser la production et l'historique.
Les contrôles de qualité (CI) doivent être verts avant toute fusion.

## Règles à activer (cible)

À configurer dans **Settings → Branches → Branch protection rules** pour `main` :

1. **Require a pull request before merging**
   - Require approvals : 1 minimum.
   - Dismiss stale pull request approvals when new commits are pushed.
   - Require review from Code Owners (si `CODEOWNERS` présent).
2. **Require status checks to pass before merging**
   - `Quality gates (PostgreSQL, tests, build, E2E)` (job `quality`).
   - `Compose validation` (job `compose`).
   - Require branches to be up to date before merging.
3. **Require conversation resolution before merging**.
4. **Do not allow bypassing the above settings** (y compris pour les admins).
5. **Restrict who can push to matching branches** : personne en direct (PR obligatoire).
6. **Do not allow force pushes**.
7. **Do not allow deletions**.
8. (Optionnel, plan supérieur) **Require signed commits**.
9. (Optionnel) **Require linear history**.

## État actuel

- Le plan GitHub du dépôt ne permet pas d'activer ces règles (HTTP 403).
- En attendant, la protection est **compensée** par :
  - la CI verte sur `main` (`ci.yml`, `deploy.yml`) ;
  - la discipline de travail par pull request / branches de feature ;
  - la règle « jamais de push direct sur `main` » dans `AGENTS.md` ;
  - la revue humaine avant merge.

## Procédure de déblocage

1. Vérifier le plan GitHub actif (`gh api /repos/digitaleflex/joinhashcode` → `plan.name`).
2. Si le plan est passé en supérieur (Team/Enterprise) ou si le dépôt est rendu public,
   relancer la configuration via l'UI ou :
   ```bash
   gh api -X PUT repos/digitaleflex/joinhashcode/branches/main/protection \
     -f required_status_checks[strict]=true \
     -f 'required_status_checks[contexts][]=Quality gates (PostgreSQL, tests, build, E2E)' \
     -f enforce_admins=true \
     -f required_pull_request_reviews[required_approving_review_count]=1 \
     -f restrictions=null \
     -F allow_force_pushes=false \
     -F allow_deletions=false
   ```
3. Vérifier avec `gh api repos/digitaleflex/joinhashcode/branches/main/protection`.
4. Cocher l'issue #416 et mettre à jour ce document.

## Risques acceptés tant que la protection est inactive

- Force-push / suppression de `main` non bloqués techniquement.
- Un push direct sur `main` peut contourner la CI (compensé par la discipline).
- Aucune approbation obligatoire avant merge.

Ces risques sont documentés comme acceptés jusqu'au déblocage du plan GitHub.
