#!/bin/bash

echo "Assignation des milestones en cours..."

# M0 - Urgences sécurité & quick wins (Milestone 14)
# Issues d'audit technique / sécurité / perf
for issue in 118 117 116 115 114 113 112 111 110 109 108 107 106; do
  gh issue edit $issue -m "M0 - Urgences sécurité & quick wins"
  echo "Issue #$issue assignée à M0"
done

# M1 - Frontend & UX (Milestone 15)
# Refonte Onboarding / UX globale
for issue in 124 123 122 91 94 100 87 85 84 83 82 81 80 79; do
  gh issue edit $issue -m "M1 - Frontend & UX"
  echo "Issue #$issue assignée à M1"
done

# S2 — FTUE & Rétention early (Milestone 10)
# Activation / Rétention court terme
for issue in 92 93 88; do
  gh issue edit $issue -m "S2 — FTUE & Rétention early"
  echo "Issue #$issue assignée à S2"
done

# M2 — Communauté & Preuve de valeur (Milestone 13)
# Squads, recruteurs, messagerie
for issue in 103 102 101 96; do
  gh issue edit $issue -m "M2 — Communauté & Preuve de valeur"
  echo "Issue #$issue assignée à M2"
done

# S1 — Activation & Signaux viraux (Milestone 9)
# Partage, feed
for issue in 90 89; do
  gh issue edit $issue -m "S1 — Activation & Signaux viraux"
  echo "Issue #$issue assignée à S1"
done

# S3 — Gamification & FOMO (Milestone 11)
# Badges, Weekly challenge
for issue in 97 95; do
  gh issue edit $issue -m "S3 — Gamification & FOMO"
  echo "Issue #$issue assignée à S3"
done

# S4 — Croissance & Mobile (Milestone 12)
# PWA, Referral
for issue in 99 98; do
  gh issue edit $issue -m "S4 — Croissance & Mobile"
  echo "Issue #$issue assignée à S4"
done

echo "Toutes les issues orphelines ont été triées et assignées à leurs milestones respectives !"
