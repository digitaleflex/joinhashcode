# Roadmap HashCode — Vue Maître

> **Document de référence principal.** Toute avancée est tracée ici.
> **Références :** `RAPPORT_STRATEGIQUE.md` (analyse marché), `VISION_UNIFIEE.md` (vision), `ADMIN_VISION.md` (admin), `DOCS/COMMAND_CENTER_VISION.md` (centre de commande)
> **Dernière mise à jour :** 11 septembre 2026

---

## Résumé du projet

**Projet :** HashCode — plateforme de talents tech vérifiés d'Afrique francophone
**Base :** `hashcode-community` (joinhashcode.com) — monolithe modulaire
**À absorber :** `hashcode_reboot` (funnel) + `hashskills` (academy) + `hashcode-community-portal` (admin/pôles)
**Vision :** Débutant → Academy → Communauté → Evidences → Certification → Talent Pool → Entreprises
**Monétisation :** B2B — jamais de paiement membre (pouvoir d'achat faible en Afrique francophone)

---

## État de l'avancement

| Phase | Statut | Dates | Détail |
|---|---|---|---|
| **0 — Unification** | 🟡 En cours | Semaines 1-4 | Un codebase, 1 schema, 1 auth |
| 1 — Communauté | ⬜ À faire | Semaines 5-10 | Discord, parcours guidé, 500 membres |
| 2 — Certification | ⬜ À faire | Semaines 11-18 | 10 certifiés, 1er contrat agence |
| 3 — Scale | ⬜ À faire | Semaines 19-26 | 1000 membres, 25 certifiés |

---

## Phase 0 — Unification (EN COURS)

### ✅ Terminé

| # | Action | Fait le | Preuve |
|---|---|---|---|
| 0.1 | Audit responsive UI/UX (L1+L2) | 11/09 | 11 commits sur hashcode_reboot |
| 0.2 | Micro-polish UI (empty states, typo, spacing) | 11/09 | Commit `5ddb7c4` |
| 0.3 | Bottom navbar mobile | 11/09 | Commit `f6b5cb5` |
| 0.4 | Refactor labels/Card/OptionCard | 11/09 | Commit `0e73716` |
| 0.5 | Analyse concurrentielle complète | 11/09 | `RAPPORT_STRATEGIQUE.md` |
| 0.6 | Vision unifiée documentée | 11/09 | `VISION_UNIFIEE.md` |
| 0.7 | Nettoyage code community (console.log→logger, types any) | 11/09 | Commit `2172861` |
| 0.8 | Middleware.ts (auth guard /dashboard /admin) | 11/09 | Commit `2172861` |
| 0.9 | Routes shell /acquisition + /academy | 11/09 | Commit `2172861` |
| 0.10 | Audit code community complet | 11/09 | Score 5.2/10, 10/18 admin OK |
| **0.11** | **Unifier schema Prisma** | 11/09 | Commit `3e85688` — 24→61 models, `prisma validate` ✅, `tsc` ✅ |
| **0.12** | **Migration Prisma + seed** | 11/09 | DB `hashcode_dev` opérationnelle, `prisma db push` ✅, seed ✅, `tsc` ✅ |
| **0.13** | **Vérification better-auth** | 11/09 | Config OK, client généré, middleware OK, dev server OK, `tsc` ✅ |

### 🟡 En cours (NOW)

| # | Action | Priorité | Risque | Détail |
|---|---|---|---|---|
| 0.14 | Config better-auth cross-domain | 🟠 MOYENNE | 🟠 | `cookies.parentDomain: joinhashcode.com` |

### ⬜ À faire dans la Phase 0

| # | Action | Priorité | Risque |
|---|---|---|---|
| 0.15 | Migrer funnel reboot → /acquisition/* | 🟠 MOYENNE | 🟠 |
| 0.16 | Migrer academy hashskills → /academy/* | 🟠 MOYENNE | 🟠 |
| 0.17 | Absorber pôles/portal → admin | 🟡 BASSE | 🟢 |
| 0.18 | Feature flags | 🟡 BASSE | 🟢 |
| 0.19 | Redirects reboot.joinhashcode.com → 301 | 🟡 BASSE | 🟢 |
| 0.20 | Tests E2E parcours critique | 🟠 MOYENNE | 🟢 |

---

## 0.11 — Unification Schema Prisma (DÉTAIL)

### Les 3 schemas existants

#### hashcode-community (BASE — 24 models, 517 lignes)
```
User, UserProfile, UserBeta, Organization, SquadMessage, Member,
Invitation, ActivityLog, DailyCheckin, Mission, Session, Account,
Verification, QuizResult, QuizFeedback, UXPollResponse,
MissionSubmission, MissionReview, ContactMessage, Notification,
BetaFeedback, JoinRequest, BetaKey, XpTransaction
```

#### hashcode_reboot (À ABSORBER — 12 models, 383 lignes)
```
Member, AdminKey, AuditLog, AnalyticsEvent, EmailEvent,
MemberEmailLog, ProfilingDraft, MemberSession, MemberBlacklist,
Event, EventRsvp, EmailProviderMetric
```

#### hashskills (À ABSORBER — 31 models, 598 lignes)
```
User, Session, Account, Verification, Course, Category, Tag,
Program, ProgramPhase, Pillar, Section, Content, Enrollment,
Progress, Quiz, Question, Option, QuizAttempt, Resource,
Forum, ForumTopic, ForumPost, ForumLike,
AIConversation, AIMessage, Certificate, Notification,
Badge, UserBadge, AuditLog, BlogPost
```

### Conflits identifiés (MÊME NOM, modèles différents)

| Model | Community | Reboot | Hashskills | Décision |
|---|---|---|---|---|
| **User** | ✅ 50+ champs | ❌ (appelle ça Member) | ✅ 10 champs | Garder Community (source de vérité), absorber les champs utiles de hashskills |
| **Member** | ✅ (org ↔ user) | ✅ (membre complet: profil, archétype) | ❌ | Garder Community Member + ajouter les champs profil de reboot Member |
| **Session/Account/Verification** | ✅ better-auth | ❌ (MemberSession custom) | ✅ better-auth | Garder Community (identique à hashskills), supprimer MemberSession reboot |
| **AuditLog** | ❌ | ✅ (action, adminKey) | ✅ (action, userId) | Fusionner les 2 en 1 AuditLog unifié |
| **Notification** | ✅ | ❌ | ✅ | Garder Community, enrichir si besoin |

### Models À AJOUTER (de reboot → community)

| Model reboot | Champ utile pour community | Action |
|---|---|---|
| **AdminKey** | Clés API admin | → Ajouter comme model |
| **AuditLog** | Logs d'audit | → Fusionner avec ActivityLog ou garder séparé |
| **AnalyticsEvent** | Événements analytics | → Ajouter |
| **EmailEvent** | Tracking emails | → Ajouter |
| **MemberEmailLog** | Logs email membres | → Ajouter |
| **ProfilingDraft** | Brouillon profiling 6 étapes | → Ajouter (pour funnel /acquisition) |
| **MemberBlacklist** | Blacklist membres | → Ajouter |
| **Event** | Événements communautaires | → Ajouter |
| **EventRsvp** | RSVP événements | → Ajouter |
| **EmailProviderMetric** | Métriques Resend/Brevo | → Ajouter |

### Models À AJOUTER (de hashskills → community)

| Model hashskills | Champ utile pour community | Action |
|---|---|---|
| **Course** | Cours academy | → Ajouter |
| **Category** | Catégories cours | → Ajouter |
| **Tag** | Tags cours | → Ajouter |
| **Program** | Programme HEF | → Ajouter |
| **ProgramPhase** | Phases programme | → Ajouter |
| **Pillar** | Piliers programme | → Ajouter |
| **Section** | Sections cours | → Ajouter |
| **Content** | Contenus cours | → Ajouter |
| **Enrollment** | Inscriptions cours | → Ajouter |
| **Progress** | Progression apprenant | → Ajouter |
| **Quiz** | Quiz cours (différent de QuizResult community) | → Renommer → CourseQuiz |
| **Question** | Questions quiz cours | → Ajouter |
| **Option** | Options quiz cours | → Ajouter |
| **QuizAttempt** | Tentatives quiz cours | → Ajouter |
| **Resource** | Ressources cours | → Ajouter |
| **Forum** | Forum contextuel | → Ajouter |
| **ForumTopic** | Topics forum | → Ajouter |
| **ForumPost** | Posts forum | → Ajouter |
| **ForumLike** | Likes forum | → Ajouter |
| **AIConversation** | Conversations IA tutor | → Ajouter |
| **AIMessage** | Messages IA tutor | → Ajouter |
| **Certificate** | Certificats | → Ajouter |
| **Badge** | Badges gamification | → Ajouter (⚠️ peut merger avec XpTransaction) |
| **UserBadge** | Badges utilisateur | → Ajouter |
| **BlogPost** | Articles blog | → Ajouter |

### Ordre d'implémentation

1. **Lire les 3 schemas** (FAIT — on a les listings)
2. **Écrire le schema unifié** dans `schema.prisma` (Community = base + ajouts)
3. **Ajouter les enums** manquants
4. **Vérifier** : `npx prisma validate`
5. **Adapter better-auth** si les models Session/Account changent
6. **Tester** : `npx prisma db push` (dev) + vérifier que le site tourne

### Risques critiques
- ⚠️ better-auth dépend de Session, Account, Verification — ne PAS changer ces noms
- ⚠️ Les relations Many-to-Many peuvent changer si les models s'ajoutent
- ⚠️ Le seed existant peut casser si les champs changent
- ⚠️ Les API routes existantes lisent des models — vérifier les imports

---

## Phase 1 — Communauté (Semaines 5-10)

| # | Action | Priorité | KPI |
|---|---|---|---|
| 1.1 | Réactivation Discord (squads/projets) | HAUTE | Membres Discord actifs |
| 1.2 | Pont WhatsApp → plateforme | HAUTE | % actions sync |
| 1.3 | Parcours guidé (roadmap perso par domaine) | HAUTE | +40% complétion |
| 1.4 | Dashboard membre (XP, skills, prochaine étape) | HAUTE | DAU/WAU |
| 1.5 | Première contribution (micro-challenge) | MOYENNE | % conversion observateurs |
| 1.6 | Modules admin squelettes (analytics, parcours, mentorat) | MOYENNE | 12→18 modules OK |

---

## Phase 2 — Certification (Semaines 11-18)

| # | Action | Priorité | KPI |
|---|---|---|---|
| 2.1 | Workflow certification (mentors valident evidences) | HAUTE | Profils certifiés |
| 2.2 | Espace recruteur (filtrer profils certifiés) | HAUTE | 10 entreprises test |
| 2.3 | Premier contrat agence (1 client, 3-4 membres) | HAUTE | Revenu |
| 2.4 | Talent pool v1 (liste publique) | MOYENNE | Visites / nombre |
| 2.5 | Feedback entreprises → adapter parcours | MOYENNE | NPS |

---

## Phase 3 — Scale (Semaines 19-26)

| # | Action | Priorité | KPI |
|---|---|---|---|
| 3.1 | Matching IA (CORE/Kalman étendu) | HAUTE | Taux matching |
| 3.2 | Webinars/events live | MOYENNE | Participants |
| 3.3 | Boucle feedback → ajustement | MOYENNE | Délai ajustement |
| 3.4 | Analyse rétention J30/J60/J90 | HAUTE | Rétention |
| 3.5 | Expansion géographique | BASSE | Pays actifs |

---

## KPIs à suivre chaque semaine

| KPI | Cible 6 mois |
|---|---|
| Membres actifs (7 jours) | 500 |
| Complétion profiling | +30% |
| Missions complétées | +40% |
| Profils certifiés | 25 |
| Contrats agence | 3 |
| Entreprises en contact | 10 |
| Rétention J30 | >40% |

---

## Documents de référence

| Document | Contenu | Emplacement |
|---|---|---|
| Vision unifiée | Architecture, features, roadmap | `VISION_UNIFIEE.md` |
| Rapport stratégique | Analyse concurrentielle, moat, stratégie 6 mois | `RAPPORT_STRATEGIQUE.md` |
| Vision admin | Talent Operations Center, 14 modules | `ADMIN_VISION.md` |
| Vision Command Center | Centre de pilotage, 10 modules | `DOCS/COMMAND_CENTER_VISION.md` |
| Audit code | Score santé, top 15 problèmes | En cours de mise à jour |
| Specs techniques | ATELIER, EVIDENCE, MENTOR, etc. | `DOCS/specs/*.md` |

---

## Règles de contribution

1. **1 codebase** — pas de second projet
2. **1 schema Prisma** — pas de duplication
3. **1 auth** — better-auth unique
4. **1 branche main** — feature flags
5. Chaque avancée → mettre à jour CE DOCUMENT
6. Chaque commit → message Conventional Commits

---

*Roadmap vivante — mise à jour à chaque phase. Prochaine revue : fin Phase 0.*
