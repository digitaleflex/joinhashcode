#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
# Gate de vérification déterministe — HashCode
#
# Ce script ne peut PAS mentir. Il exécute, il affiche, il sort en erreur.
# Aucun « ça devrait marcher ». Aucun test sauté silencieusement.
#
# Usage :
#   npm run verify                 # gate complet
#   npm run verify -- --fast       # types + lint + prisma (pas de réseau)
#   VERIFY_BASE_URL=http://host:3000 npm run verify
#
# Codes retour : 0 = tout vert, 1 = au moins un échec
# ─────────────────────────────────────────────────────────────
set -uo pipefail

BASE_URL="${VERIFY_BASE_URL:-http://127.0.0.1:3000}"
FAST=0
[[ "${1:-}" == "--fast" || "${2:-}" == "--fast" ]] && FAST=1

FAILED=0
SKIPPED=0

step() { printf '\n\033[1m▶ %s\033[0m\n' "$1"; }
ok()   { printf '  \033[32m✅ %s\033[0m\n' "$1"; }
ko()   { printf '  \033[31m❌ %s\033[0m\n' "$1"; FAILED=1; }
skip() { printf '  \033[33m⚠️  SAUTÉ : %s\033[0m\n' "$1"; SKIPPED=1; }

# ── Sanity : purge des types générés corrompus (dette D3) ──
# Une interruption de `next dev` peut tronquer .next/dev/types/*.d.ts et
# faire échouer tsc sur du code sain. On les retire AVANT de conclure.
if grep -rlq "Unterminated string literal\|onse | void" .next/dev/types 2>/dev/null; then
  printf '\033[33m⚠️  Types générés corrompus détectés → purge de .next/dev/types\033[0m\n'
  rm -rf .next/dev/types 2>/dev/null || true
fi

# ── 1. Types ──
step "1/5 — Types (tsc --noEmit)"
npx tsc --noEmit > /tmp/hc-tsc.log 2>&1
if [[ $? -eq 0 ]]; then
  ok "aucune erreur de type"
else
  tail -n 20 /tmp/hc-tsc.log
  ko "$(grep -cE 'error TS' /tmp/hc-tsc.log) erreur(s) de type"
fi

# ── 2. Lint ──
step "2/5 — Lint (eslint)"
npx eslint . > /tmp/hc-eslint.log 2>&1
if [[ $? -eq 0 ]]; then
  ok "aucune erreur de lint ($(grep -oE '[0-9]+ warning' /tmp/hc-eslint.log | tail -n1 || echo '0 warning'))"
else
  tail -n 20 /tmp/hc-eslint.log
  ko "erreur(s) de lint"
fi

# ── 3. Schema Prisma ──
step "3/5 — Schema Prisma"
npx prisma validate > /tmp/hc-prisma.log 2>&1
if [[ $? -eq 0 ]]; then
  ok "schema Prisma valide"
else
  tail -n 15 /tmp/hc-prisma.log
  ko "schema Prisma invalide"
fi

if [[ $FAST -eq 1 ]]; then
  printf '\n\033[33mMode --fast : sondes réseau et E2E sautés.\033[0m\n'
  printf '\n═══ BILAN (fast) : %s ═══\n' "$([[ $FAILED -eq 0 ]] && echo 'VERT' || echo 'ROUGE')"
  exit $FAILED
fi

# ── 4. Sondes HTTP live ──
# Encode les leçons des sessions : une route privée DOIT rediriger (307),
# jamais renvoyer 200 (dette D7). Un 500 est toujours un échec.
step "4/5 — Sondes HTTP live ($BASE_URL)"

if ! curl -s --noproxy '*' -o /dev/null --max-time 8 "$BASE_URL/" 2>/dev/null; then
  skip "serveur absent sur $BASE_URL → sondes NON exécutées (lancer: npm run dev)"
else
  # "route attendu [jeton de contenu]"
  #   200 = publique, 307 = privée (doit rediriger)
  #   Le jeton optionnel vérifie que la page rend VRAIMENT son contenu :
  #   un 200 peut être une page d'erreur (incident réellement vécu — la DB était
  #   injoignable et /academy renvoyait 200 avec « Anomalie Système »).
  PROBES=(
    "/ 200 HASHCODE"
    "/signin 200"
    "/academy 200 Apprends"
    "/academy/courses 200"
    "/academy/programme 200"
    "/academy/paths 200"
    "/academy/diplomas 200"
    "/acquisition 200"
    "/acquisition/profiling 200"
    "/acquisition/invite 200"
    "/dashboard 307"
    "/admin 307"
    "/academy/my-courses 307"
    "/academy/my-courses/new 307"
    "/academy/certificates 307"
  )
  for p in "${PROBES[@]}"; do
    route="${p%% *}"; rest="${p#* }"; want="${rest%% *}"
    token="${rest#* }"; [[ "$token" == "$want" ]] && token=""

    body_file=$(mktemp)
    got=$(curl -s --noproxy '*' -o "$body_file" -w '%{http_code}' --max-time 90 "$BASE_URL$route" 2>/dev/null || echo "000")
    html=$(cat "$body_file" 2>/dev/null); rm -f "$body_file"

    if [[ "$got" != "$want" ]]; then
      if [[ "$got" == "000" ]]; then
        ko "$route → timeout/refus (attendu $want)"
      elif [[ "$want" == "307" && "$got" == "200" ]]; then
        ko "$route → 200 mais route PRIVÉE (faille D7 : non protégée dans proxy.ts)"
      else
        ko "$route → $got (attendu $want)"
      fi
      continue
    fi

    # Angle mort : un 200 peut être une page d'erreur
    # NB: matching natif bash, PAS de `grep -q` — avec `set -o pipefail`, grep -q
    # sortant au 1er match envoie SIGPIPE à printf et ferait échouer la pipeline
    # (faux négatif constaté sur `/`).
    if [[ "$html" == *"Anomalie Système"* ]]; then
      ko "$route → $got mais rend la PAGE D'ERREUR (« Anomalie Système ») — DB ou runtime en panne"
      continue
    fi

    if [[ -n "$token" && "$html" != *"$token"* ]]; then
      ko "$route → $got mais le contenu attendu « $token » est ABSENT"
      continue
    fi

    ok "$route → $got${token:+ (contient « $token »)}"
  done
fi

# ── 5. E2E ──
step "5/5 — E2E Playwright"
if [[ ! -f playwright.config.ts ]]; then
  skip "playwright.config.ts absent"
else
  npx playwright test --reporter=line --workers=1 > /tmp/hc-e2e.log 2>&1
  if [[ $? -eq 0 ]]; then
    ok "$(grep -oE '[0-9]+ passed' /tmp/hc-e2e.log | tail -n1)"
  else
    tail -n 20 /tmp/hc-e2e.log
    ko "$(grep -oE '[0-9]+ failed' /tmp/hc-e2e.log | tail -n1 || echo 'E2E en échec')"
  fi
fi

# ── Bilan ──
printf '\n═══════════════════════════════════════════\n'
if [[ $FAILED -eq 0 && $SKIPPED -eq 0 ]]; then
  printf '\033[32m  GATE VERT — tout est vérifié\033[0m\n'
elif [[ $FAILED -eq 0 ]]; then
  printf '\033[33m  GATE VERT AVEC RÉSERVES — des étapes ont été SAUTÉES\033[0m\n'
else
  printf '\033[31m  GATE ROUGE — échec(s) à corriger avant commit\033[0m\n'
fi
printf '═══════════════════════════════════════════\n'
exit $FAILED
