#!/usr/bin/env bash
# setup-github-project.sh
#
# Crée le Project board HASHCODE Roadmap sur GitHub Projects v2
# et y ajoute toutes les issues ouvertes organisées par milestone.
#
# Prérequis : gh CLI avec scope project
#   gh auth refresh -h github.com -s project,read:project
#
# Usage : bash scripts/setup-github-project.sh

set -euo pipefail

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)
OWNER=$(echo "$REPO" | cut -d'/' -f1)

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  HASHCODE — Création du Project Board                        ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# ──────────────────────────────────────────────────────────────────────
# ÉTAPE 1 : Créer le project
# ──────────────────────────────────────────────────────────────────────
echo "── Étape 1 : Création du project ────────────────────────────────"

PROJECT_ID=$(gh project create \
  --owner "$OWNER" \
  --title "HASHCODE Roadmap" \
  --format json | python3 -c "import sys,json; print(json.load(sys.stdin)['number'])")

echo "  ✓ Project créé — numéro : $PROJECT_ID"

# ──────────────────────────────────────────────────────────────────────
# ÉTAPE 2 : Ajouter un champ "Sprint" (single select) pour filtrer
# par milestone depuis le board
# ──────────────────────────────────────────────────────────────────────
echo ""
echo "── Étape 2 : Ajout du champ Sprint ──────────────────────────────"

gh project field-create "$PROJECT_ID" \
  --owner "$OWNER" \
  --name "Sprint" \
  --data-type "SINGLE_SELECT" \
  --single-select-options "v2.0 Lancement,v2.1 Profil,v2.2 Communauté,v2.3 Rétention,v3.0 Backlog,v4+ Long terme" \
  > /dev/null && echo "  ✓ Champ Sprint ajouté"

# ──────────────────────────────────────────────────────────────────────
# ÉTAPE 3 : Ajouter toutes les issues ouvertes au project
# ──────────────────────────────────────────────────────────────────────
echo ""
echo "── Étape 3 : Ajout des issues au project ────────────────────────"

ISSUE_NUMBERS=$(gh issue list --state open --limit 100 --json number -q '.[].number')

COUNT=0
for NUM in $ISSUE_NUMBERS; do
  ISSUE_URL=$(gh issue view "$NUM" --json url -q '.url')
  gh project item-add "$PROJECT_ID" --owner "$OWNER" --url "$ISSUE_URL" > /dev/null
  COUNT=$((COUNT + 1))
  echo "  + #$NUM ajoutée"
done

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  Project board créé avec $COUNT issues                       ║"
echo "║                                                              ║"
echo "║  Ouvrir : https://github.com/orgs/$OWNER/projects/$PROJECT_ID  ║"
echo "║  ou     : https://github.com/$REPO/projects                  ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "  Prochaine étape : dans GitHub, passer la vue en 'Board'"
echo "  et grouper par champ 'Sprint' pour voir les colonnes."
echo ""
