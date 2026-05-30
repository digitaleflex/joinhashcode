#!/usr/bin/env bash
# populate-project.sh — Ajoute toutes les issues au Project board HASHCODE Roadmap
# Usage : GITHUB_TOKEN=<ton_token> bash scripts/populate-project.sh

set -euo pipefail

PROJECT_ID="PVT_kwHOCXQzxs4BZQuu"
SPRINT_FIELD="PVTSSF_lAHOCXQzxs4BZQuuzhUQpnk"
V20="6af35429"; V21="381ea8b0"; V22="d3898a70"
V23="6f2c58b4"; V30="0d274ecb"; V4P="d74bd4a6"

add_issue() {
  local NODE_ID=$1 SPRINT_OPT=$2 NUM=$3
  ITEM_ID=$(gh api graphql \
    -f query="mutation { addProjectV2ItemById(input: {projectId: \"$PROJECT_ID\", contentId: \"$NODE_ID\"}) { item { id } } }" \
    --jq '.data.addProjectV2ItemById.item.id' 2>/dev/null || echo "")
  if [ -n "$ITEM_ID" ]; then
    gh api graphql \
      -f query="mutation { updateProjectV2ItemFieldValue(input: {projectId: \"$PROJECT_ID\", itemId: \"$ITEM_ID\", fieldId: \"$SPRINT_FIELD\", value: {singleSelectOptionId: \"$SPRINT_OPT\"}}) { projectV2Item { id } } }" \
      > /dev/null 2>&1
    echo "  ✓ #$NUM"
  else
    echo "  ✗ #$NUM (déjà ajoutée ou erreur)"
  fi
}

echo "── v2.0 — Lancement Public ──────────────────"
add_issue "I_kwDOSYUtbM8AAAABChoEfw" $V20 7
add_issue "I_kwDOSYUtbM8AAAABChojJw" $V20 8
add_issue "I_kwDOSYUtbM8AAAABChokAA" $V20 9
add_issue "I_kwDOSYUtbM8AAAABD4zq_w" $V20 42

echo "── v2.1 — Profil & Découverte ───────────────"
add_issue "I_kwDOSYUtbM8AAAABChnpww" $V21 4
add_issue "I_kwDOSYUtbM8AAAABChns-g" $V21 5
add_issue "I_kwDOSYUtbM8AAAABDhRL-Q" $V21 14
add_issue "I_kwDOSYUtbM8AAAABDhS-aw" $V21 18

echo "── v2.2 — Communauté Active ─────────────────"
add_issue "I_kwDOSYUtbM8AAAABChnO6g" $V22 2
add_issue "I_kwDOSYUtbM8AAAABChnlUw" $V22 3
add_issue "I_kwDOSYUtbM8AAAABDhSwnw" $V22 16
add_issue "I_kwDOSYUtbM8AAAABDhTbig" $V22 21
add_issue "I_kwDOSYUtbM8AAAABD4zsew" $V22 44

echo "── v2.3 — Rétention & Sécurité ─────────────"
add_issue "I_kwDOSYUtbM8AAAABDhRTLA" $V23 15
add_issue "I_kwDOSYUtbM8AAAABDhS4GQ" $V23 17
add_issue "I_kwDOSYUtbM8AAAABDhTG3A" $V23 19
add_issue "I_kwDOSYUtbM8AAAABD4zruQ" $V23 43

echo "── v3.0 — Backlog Produit ───────────────────"
add_issue "I_kwDOSYUtbM8AAAABDhRCDA" $V30 13
add_issue "I_kwDOSYUtbM8AAAABDhTQcg" $V30 20
add_issue "I_kwDOSYUtbM8AAAABDhTmQg" $V30 22

echo "── v4+ — Long terme (Academy/Labs/CI) ───────"
add_issue "I_kwDOSYUtbM8AAAABDhVcvQ" $V4P 23
add_issue "I_kwDOSYUtbM8AAAABDhVndQ" $V4P 24
add_issue "I_kwDOSYUtbM8AAAABDhV0Lw" $V4P 25
add_issue "I_kwDOSYUtbM8AAAABDhWEDw" $V4P 26
add_issue "I_kwDOSYUtbM8AAAABDhWQGQ" $V4P 27
add_issue "I_kwDOSYUtbM8AAAABDhWb9A" $V4P 28
add_issue "I_kwDOSYUtbM8AAAABDhXgtg" $V4P 34
add_issue "I_kwDOSYUtbM8AAAABDhWukw" $V4P 29
add_issue "I_kwDOSYUtbM8AAAABDhW49g" $V4P 30
add_issue "I_kwDOSYUtbM8AAAABDhXEeA" $V4P 31
add_issue "I_kwDOSYUtbM8AAAABDhXPDw" $V4P 32
add_issue "I_kwDOSYUtbM8AAAABDhXYiw" $V4P 33
add_issue "I_kwDOSYUtbM8AAAABDhb9Jw" $V4P 35
add_issue "I_kwDOSYUtbM8AAAABDhcMfQ" $V4P 36
add_issue "I_kwDOSYUtbM8AAAABDhcWdA" $V4P 37
add_issue "I_kwDOSYUtbM8AAAABDhcirA" $V4P 38
add_issue "I_kwDOSYUtbM8AAAABDhdarw" $V4P 39
add_issue "I_kwDOSYUtbM8AAAABDhdrvg" $V4P 40
add_issue "I_kwDOSYUtbM8AAAABDhd4cQ" $V4P 41

echo ""
echo "✅ Done — ouvre le board ici :"
echo "   https://github.com/users/digitaleflex/projects/17"
