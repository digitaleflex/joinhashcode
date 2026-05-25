# Checklist de relance — Beta privée HASHCODE

**Date :** 20 mai 2026
**Objet :** Vérifier chaque parcours utilisateur avant d'inviter les premiers beta-testeurs.
**Mode visé :** beta privée, 10 personnes choisies à la main, review en concierge.

> Légende : `✅` code lu + type-check OK (clic réel à faire) · `⚠️` fonctionne avec réserve · `🔴` à traiter avant beta · `🧪` non vérifié en profondeur, à tester soi-même.

---

## ⛔ Bloquants avant d'inviter quiconque

- [ ] **`npx prisma db push`** sur une base **dev séparée** de la prod → crée `activity_log` (logging + dashboards) et les colonnes carte. Sans ça, tu lances aveugle.
- [ ] **Review en mode concierge** : tu valides les soumissions via `/admin/submissions`. Le peer-review entre users (US-08) ne marche pas à <10 actifs → sinon les soumissions restent bloquées « IN_REVIEW ».
- [ ] **Creds OAuth** (Google/GitHub) configurés en env de prod.
- [ ] **Consentement RGPD** ✅ *(fait — checkbox explicite sur le signin)*.
- [ ] Séparer prod/dev Supabase (risque d'intégrité des données).

## Métrique unique de la beta

- [ ] Regarder le ratio **inscription → 1re mission soumise** dans `/admin` (funnel). Cible ≥ 40 %. En dessous : la boucle cœur est cassée, rien d'autre ne compte.

---

## EPIC 1 — Entrée & onboarding
- [ ] US-01 — Connexion (Google / GitHub / OTP) — ⚠️ vérifier creds OAuth
- [ ] US-02 — Onboarding étape 1 (situation, pays, objectif) — ✅
- [ ] US-03 — Quiz psychométrique → profil — ✅
- [ ] US-04 — Post-quiz (rêve, focus, blocage) + redirection invite — ✅

## EPIC 2 — Boucle cœur (missions)
- [ ] US-05 — Voir mes missions adaptées — ✅
- [ ] US-06 — Détail d'une mission — ✅
- [ ] US-07 — Soumettre une mission — ⚠️ pas de rate limit (ok à 10 users)
- [ ] US-08 — Peer review → XP/niveau — 🔴 **bascule en review admin concierge**
- [ ] US-09 — Valider/refuser via l'admin — ✅ (chemin réel en beta)

## EPIC 3 — Social & escouades
- [ ] US-10 — Créer une escouade — ✅
- [ ] US-11 — Rejoindre via lien d'invite — ✅
- [ ] US-12 — Personnaliser nom/lien (leader) — ✅
- [ ] US-13 — Parcours gamifié d'escouade — ⚠️ besoin de coéquipiers réels

## EPIC 4 — Engagement & rétention
- [ ] US-14 — Check-in quotidien — ✅ (garde-fou 1×/20h déjà en place)
- [ ] US-15 — Feed d'activité — ⚠️ quasi vide à faible volume
- [ ] US-16 — Notifications — 🧪 dépend de la config QStash

## EPIC 5 — Profil & compte
- [ ] US-17 — Consulter mon dossier — ✅
- [ ] US-18 — Modifier mon profil — ✅
- [ ] US-19 — Changer mon avatar — 🧪 à tester
- [ ] US-20 — Carte membre — ⚠️ marche après `prisma db push`
- [ ] US-21 — Supprimer mon compte — 🧪 vérifier la cascade
- [ ] US-22 — Feedback bêta — ✅

## EPIC 6 — Périphérie & public
- [ ] US-23 — Espace Reviewer — ⚠️ vide sans soumissions (lié à US-08)
- [ ] US-24 — Page communauté/guilde — 🧪 à tester
- [ ] US-25 — Outils (`/tools`) — ✅ déjà absent du nav (route orpheline, non atteignable)
- [ ] US-26 — Contact (public) — ✅
- [ ] US-27 — Pages légales (CGU/confidentialité) — ✅ consentement renforcé au signin

---

## Reporté après la traction (NE PAS faire pour la beta)
- Rate limiting artificiel sur checkin/missions → garde-fous naturels déjà présents (1×/20h, machine à états). Inutile à 10 users de confiance.
- Toute nouvelle feature de moteur, outillage admin, ou IA user-facing.
- Finir le peer-review automatique entre users (utile seulement avec du volume).

*Réf. : `DOCS/audit_strategique/00_META_SYNTHESE_ET_CONTRE_AUDIT.md`*
