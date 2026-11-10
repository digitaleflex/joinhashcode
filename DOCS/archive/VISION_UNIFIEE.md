# Vision Évolutive Unifiée — HashCode

> **VP:** HashCode transforme les débutants tech francophones en talents employables et vérifiés — et donne aux entreprises un accès direct à ce vivier.
>
> **Référence stratégique complète :** voir `RAPPORT_STRATEGIQUE.md` (analyse concurrentielle, moat, feuille de route 6 mois).

---

## 1. Vision unifiée

**Une seule plateforme, trois audiences, un flux:**

```
Débutants  →  Communauté + Mentorat + Certification  →  Talents vérifiés
                                                          ↓
Entreprises  ←  Talent Pool + Matching + Missions  ←  Vivier qualifié
```

### 1.1 Positionnement concurrentiel (2026)

**Créneau vide identifié :** le talent pool B2B communautaire francophone.

| Concurrent | Leur modèle | Notre différence |
|---|---|---|
| Andela / Gebeya | B2B anglophone global | **Francophone + communautaire** |
| GoMyCode / Kadea | B2C (membres paient) | **B2B inversé (membres gratuits)** |
| Dev Benin / CodingHQ | Communauté sans modèle | **Boucle complète + monétisation** |

### 1.2 Les 4 piliers du moat

1. **Communauté WhatsApp-first** — le réseau social ne se copie pas
2. **Vérification humaine** — les mentors valident, la confiance est du capital social
3. **Données de progression (CORE/Kalman)** — actif accumulé unique
4. **Boucle complète** — academy → evidences → certification → talent pool → emploi

### 1.3 Modèle économique inversé

```
Écoles (OC/GoMyCode/Kadea) :  MEMBRES paient (B2C) — plafonne en Afrique francophone
HashCode :                    ENTREPRISES paient (B2B) — membres 100% gratuits
```

### 3 piliers

| Pilier | Engagement | Revenue eventuel |
|---|---|---|
| **Communauté** | Quiz, squads, ateliers, evidences, leaderboard | Don / agence distribuée |
| **TalentOps** | Mentorat, missions, progression, certification | Commission placement B2B |
| **Recruteur** | Espace entreprises, matching, accès vivier | Abonnement / certification payante |

---

## 2. Architecture cible

**1 codebase** (`hashcode-community`), **2 domaines** séparés par routes/roles. Monolithe modulaire — PAS de microservices (1 DB, 1 auth, 1 déploiement).

### Actifs existants à capitaliser

| Actif | Stratégie |
|---|---|
| Communauté WhatsApp | Canal d'acquisition n°1 (86% via réseaux sociaux) — la plateforme structure l'existant |
| Discord (inactif) | Réactiver en canal squads/projets (WhatsApp = annonces, Discord = travail) |
| Utilisateurs reboot.hashcode.com | Migrer vers la plateforme unifiée (données profiling déjà collectées) |
| 4 projets de code | Unifier en 1 codebase — capitaliser, pas réécrire |

### Domaines & routes

| Domaine | Routes | Rôle |
|---|---|---|
| **Community** (base) | `/app/*`, `/quiz`, `/squads`, `/ateliers`, `/evidences`, `/mentorat`, `/leaderboard`, `/decision-center` | Cœur membres |
| **Acquisition** (importé de reboot) | `/`, `/join`, `/profile/*`, `/invite`, `/otp` | Funnel sans friction |

### Redirects

- `reboot.joinhashcode.com/*` → `joinhashcode.com/acquisition/*` (301 permanent)
- Landing reboot → iframe ou micro-front si besoin transitoire
- Auth partagée: `better-auth` unique, sessions cross-domain via cookie parent `joinhashcode.com`

---

## 3. Carte des features

### Ce qui vient de Community (base — déjà livré)

- better-auth, 24 models Prisma
- Talent Operations Center (14 modules admin)
- Missions, quiz, squads, ateliers, evidences, mentorat
- CORE Decision Center (Kalman), leaderboard

### Ce qui vient de Reboot (funnel — à importer)

- Landing moderne + profiling 6 étapes + draft saving
- Invitation WhatsApp + email relance
- OTP login simplifié

### Ce qui est nouveau (à construire)

- **Progression**: parcours guidé débutant → intermédiaire → vérifié, badges, evidences structurées
- **Certification**: examen final + portfolio évalué (monétisation B2B)
- **Espace Recruteur**: tableau de matching, accès filtrés au vivier, offres ciblées

---

## 4. Feuille de route évolutive

### Phase 0 — Consolidation (0–3 mois)
- Unifier codebase, 1 schema Prisma, 1 auth
- Importer funnel reboot → `/acquisition/*` + academy hashskills → `/academy/*`
- Réactiver Discord (squads/projets), pont WhatsApp → plateforme
- Metrics cible: **+30% complétion profiling**, **+50% retour visite**, **500 membres actifs**

### Phase 1 — Progression (3–6 mois)
- Parcours guidé + badges + evidences structurées
- Dashboard membre simplifié
- Metrics cible: **+40% missions complétées**, **25% membres actifs/semaine**

### Phase 2 — Monétisation B2B (6–12 mois)
- Lancement Talent Pool: entreprises consultent vivier filtré
- Certification payante (niveau 1)
- Metrics cible: **10 entreprises actives**, **50 certifiés**, **RMV > 0**

### Phase 3 — Scale (12–24 mois)
- Matching IA (Kalman étendu), parcours personnalisés
- Abonnement recruteur, certification niveau 2
- Expansion CI/Bénin/CM/SN → toute Afrique francophone
- Metrics cible: **500 talents vérifiés**, **200 entreprises**, **unité économique positive**

---

## 5. Modèle économique

| Phase | Revenus | Coût structure |
|---|---|---|
| 0–3 | 0 (construction) | Hébergement + temps |
| 3–6 | Agence distribuée (micro-commissions) | Minimal |
| 6–12 | Commission placement B2B + certification N1 | 1 staff + infra |
| 12–24 | Abonnement recruteur + certification N2 + partenariats | Équipe dédiée |

**Règle:** jamais de paiement membre (pouvoir d'achat faible). Revenue via entreprises et agences.

---

## 6. Principes anti-dispersion

1. **1 codebase** — pas de second projet Next.js
2. **1 schema Prisma** — pas de duplication models
3. **1 auth** — better-auth unique, sessions cross-domain
4. **1 branche `main`** — feature flags pour experiments
5. **Règles de contribution:**
   - Nouvelle feature → PR sur `main` avec test + doc
   - Import reboot → dossier `/acquisition/`, pas de racine
   - Admin → `/app/admin/*`, séparé du public
   - Décisions architecturales → `ARCHITECTURE_AUDIT.md`

---

## 7. Risques et garde-fous

| Risque | Gravité | Garde-fou |
|---|---|---|
| Dispersion codebase | Élevé | Rule #1: 1 repo, feature flags |
| Auth cassée cross-domain | Élevé | Cookies parent + tests intégration |
| Sur-monétisation prématurée | Moyen | Phase 0–1 gratuite stricte |
| Baisse engagement communauté | Moyen | Leaderboard + missions + squads maintenus |
| Dépendance WhatsApp | Faible | Canal email + OTP backup |
| Données sensibles recruteur | Élevé | RLS Prisma + audit logs |

---

*Document vivant — mis à jour à chaque phase. Prochaine revue: fin Phase 0.*
