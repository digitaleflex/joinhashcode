#!/usr/bin/env bash
# reorganize-github.sh
#
# Réorganise les issues & milestones GitHub de HASHCODE selon les
# principes agile : livraisons incrémentales, ordre de valeur, pas de mélange.
#
# Principes appliqués :
#   1. Chaque milestone = une livraison cohérente avec un objectif mesurable
#   2. Les issues déjà implémentées sont fermées (ne pas polluer le backlog)
#   3. Les issues orphelines sont rattachées au bon milestone selon leur nature
#   4. La granularité décroît avec l'horizon : sprints concrets maintenant,
#      epics larges pour l'avenir lointain
#
# Usage : bash scripts/reorganize-github.sh
#
# Prérequis : gh CLI authentifié (gh auth login)

set -euo pipefail

REPO=$(gh repo view --json nameWithOwner -q .nameWithOwner)

echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  HASHCODE — Réorganisation Agile GitHub                          ║"
echo "║  Repo : $REPO"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""

# ──────────────────────────────────────────────────────────────────────────────
# ÉTAPE 1 : Mise à jour des milestones (titres + descriptions + due dates)
#
# Logique de découpage :
#   v2.0  → Ce qui doit tourner avant le premier utilisateur (cette semaine)
#   v2.1  → Profil enrichi post-lancement (3 semaines)
#   v2.2  → Fonctionnalités communautaires (6 semaines)
#   v2.3  → Rétention avancée & sécurité (10 semaines)
#   v3.0  → Backlog produit (après product-market fit)
#   v4–v6 → Roadmap long terme (inchangés)
# ──────────────────────────────────────────────────────────────────────────────
echo "── Étape 1 : Mise à jour des milestones ─────────────────────────────"

gh api "repos/$REPO/milestones/1" -X PATCH \
  -f title="v2.0 — Lancement Public" \
  -f description="Tout ce qui doit être opérationnel avant les premiers utilisateurs : cron cohésion squad (infra critique), logs audit admin, sécurité formulaire contact, historique missions dashboard." \
  -f due_on="2026-06-07T23:59:59Z" > /dev/null
echo "  ✓ M1 → v2.0 — Lancement Public  (échéance : 7 juin)"

gh api "repos/$REPO/milestones/2" -X PATCH \
  -f title="v2.1 — Profil & Découverte" \
  -f description="Enrichissement du profil post-lancement basé sur les premiers retours : dossier public partageable (URL /u/[pseudo]), outils par classe, Google One Tap, synchronisation GitHub." \
  -f due_on="2026-06-28T23:59:59Z" > /dev/null
echo "  ✓ M2 → v2.1 — Profil & Découverte  (échéance : 28 juin)"

gh api "repos/$REPO/milestones/3" -X PATCH \
  -f title="v2.2 — Communauté Active" \
  -f description="Dynamiques sociales pour que la communauté vive : membres de guilde visibles, flux d'échanges, leaderboard, annuaire des talents, soumissions collectives squad." \
  -f due_on="2026-07-19T23:59:59Z" > /dev/null
echo "  ✓ M3 → v2.2 — Communauté Active  (échéance : 19 juillet)"

gh api "repos/$REPO/milestones/4" -X PATCH \
  -f title="v2.3 — Rétention & Sécurité" \
  -f description="Mécanismes de rétention avancés et durcissement sécurité : défis inter-squads, synergie cognitive cross-profiling, recommandations IA missions, Cloudflare Turnstile." \
  -f due_on="2026-08-16T23:59:59Z" > /dev/null
echo "  ✓ M4 → v2.3 — Rétention & Sécurité  (échéance : 16 août)"

gh api "repos/$REPO/milestones/5" -X PATCH \
  -f title="v3.0 — Backlog Produit" \
  -f description="Fonctionnalités à planifier après validation du product-market fit : PWA & notifications push, passkey WebAuthn, tableau d'opportunités. Contenu révisable selon retours utilisateurs." > /dev/null
echo "  ✓ M5 → v3.0 — Backlog Produit  (pas d'échéance — horizon ouvert)"

echo "  — M6 v4 Academy / M7 v5 Labs / M8 v6 Community Intelligence : inchangés"

# ──────────────────────────────────────────────────────────────────────────────
# ÉTAPE 2 : Assignation des issues orphelines (#42, #43, #44)
#
# Raisonnement :
#   #42 Cohesion Decay Cron   → v2.0 : infra critique, doit tourner dès le J1
#   #44 Soumission Collective → v2.2 : feature sociale, après que la commu existe
#   #43 Synergie Cognitive    → v2.3 : feature avancée d'engagement, post-feedback
# ──────────────────────────────────────────────────────────────────────────────
echo ""
echo "── Étape 2 : Assignation des issues orphelines ──────────────────────"

gh issue edit 42 --milestone "v2.0 — Lancement Public" > /dev/null
echo "  ✓ #42 [SQUAD] Cohesion Decay Cron → v2.0 Lancement Public"
echo "       (infra critique : sans ce cron, la cohésion ne décroît jamais)"

gh issue edit 44 --milestone "v2.2 — Communauté Active" > /dev/null
echo "  ✓ #44 [MISSIONS] Soumission Collective Squad → v2.2 Communauté Active"
echo "       (feature sociale : dépend de l'existence d'une communauté active)"

gh issue edit 43 --milestone "v2.3 — Rétention & Sécurité" > /dev/null
echo "  ✓ #43 [SQUAD] Synergie Cognitive Cross-Profiling → v2.3 Rétention"
echo "       (feature avancée : nécessite des données de comportement réelles)"

# ──────────────────────────────────────────────────────────────────────────────
# ÉTAPE 3 : Clôture des issues déjà implémentées
#
# Seule l'issue #6 est confirmée implémentée par l'audit du code :
#   - /app/admin/submissions/ existe avec UI complète approve/revision/reject
#   - API PATCH /api/admin/submissions/[id] opérationnelle
#
# #5 (dossier public) reste ouverte : le /dossier actuel est privé (auth requis),
#    il n'existe pas de route publique /u/[pseudo] → feature légitime à faire.
# ──────────────────────────────────────────────────────────────────────────────
echo ""
echo "── Étape 3 : Clôture des issues déjà implémentées ──────────────────"
echo ""
echo "  Issue à fermer :"
echo "  #6 — feat(admin): interface de review manuelle des soumissions"
echo "       → /app/admin/submissions/ opérationnel + API PATCH fonctionnelle"
echo ""
read -r -p "  Fermer l'issue #6 ? (o/N) : " CONFIRM_CLOSE_6

if [[ "${CONFIRM_CLOSE_6,,}" == "o" ]]; then
  gh issue close 6 \
    --comment "✅ **Implémenté** — L'interface de review admin des soumissions est opérationnelle :
- Page \`/admin/submissions\` avec liste complète et filtres
- Actions : **Approve** / **Request Revision** / **Reject** avec commentaire
- API \`PATCH /api/admin/submissions/[id]\` avec garde ADMIN/MODERATOR
- Activité loggée via \`logActivity(ADMIN_SUBMISSION_REVIEWED)\`

Fermée suite à l'audit code du 2026-05-30." > /dev/null
  echo "  ✓ #6 fermée"
else
  echo "  — #6 conservée ouverte (à ta décision)"
fi

# ──────────────────────────────────────────────────────────────────────────────
# RÉSUMÉ FINAL
# ──────────────────────────────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════════════╗"
echo "║  Réorganisation terminée                                          ║"
echo "╠══════════════════════════════════════════════════════════════════╣"
echo "║                                                                   ║"
echo "║  Milestones actifs (ordre d'exécution) :                         ║"
echo "║    1. v2.0 — Lancement Public       ← MAINTENANT (7 juin)        ║"
echo "║       #6(fermée) #7 #8 #9 #42                                    ║"
echo "║    2. v2.1 — Profil & Découverte    ← 3 semaines (28 juin)       ║"
echo "║       #4 #5 #14 #18                                              ║"
echo "║    3. v2.2 — Communauté Active      ← 6 semaines (19 juillet)    ║"
echo "║       #2 #3 #16 #21 #44                                          ║"
echo "║    4. v2.3 — Rétention & Sécurité   ← 10 semaines (16 août)      ║"
echo "║       #15 #17 #19 #43                                            ║"
echo "║    5. v3.0 — Backlog Produit        ← horizon ouvert              ║"
echo "║       #13 #20 #22                                                ║"
echo "║    6. v4 Academy / v5 Labs / v6 CI  ← roadmap long terme         ║"
echo "║                                                                   ║"
echo "╚══════════════════════════════════════════════════════════════════╝"
echo ""
