# Plan de modifications (v4)

> 1 document foundation + 9 fichiers de code + 10 fichiers email.
> 0 nouvelle dépendance, 0 refonte d'infrastructure.

---

## Phase A — Product Blueprint (2 jours, zéro code)

### A.1 — Créer `PRODUCT_VISION.md`

Document unique qui définit :
- Mission + transformation promise
- Les **6 piliers** : Découverte → Orientation → Apprentissage → Pratique → **Validation** → Opportunités
- Parcours utilisateur complet
- **Boucle de progression** (l'utilisateur la répète sur plusieurs mois)
- **Objectif 90 jours structuré** : objectif → pourquoi → ce que tu sauras faire → comment
- **Concept d'Evidence** : preuve de compétence validée par un mentor
- Règles, anti-patterns, vocabulaire, ton
- **Ton des emails** : coach/guide, pas cyberpunk hacker

→ Fait. Voir `PRODUCT_VISION.md`.

### A.3 — Créer la spécification technique de CORE

Document séparé de la vision produit. Décrit uniquement :
- Entrées, règles de décision, algorithmes de recommandation
- Critères de progression et niveaux de maturité
- Détection de blocage et remédiation
- Structure des données et contrats d'interface API

→ Fait. Voir `docs/CORE_SPECIFICATION.md`.

Cette séparation garantit que :
- `PRODUCT_VISION.md` reste la **constitution** (ne change pas)
- `CORE_SPECIFICATION.md` est la **spécification technique** (évolue avec les retours terrain)
- `plan-modifications.md` est la **roadmap d'implémentation**

### A.2 — Valider la promesse

> HASHCODE révèle ton potentiel, construit ton parcours et valide tes compétences jusqu'à l'opportunité.

---

## Phase B — Implémentation

### Sprint 1 — Landing

**Fichier : `components/landing/hero.tsx`**

#### B.1.1 — Reformuler le Hero (lignes 68-82)

```
AVANT :

Ne sois plus un spectateur.
Deviens un Builder

---

APRÈS :

Découvre ton potentiel.
Développe tes compétences.
Construis ton avenir.
```

#### B.1.2 — Changer le CTA principal (lignes 100-103)

```
AVANT :

Révéler mon potentiel

---

APRÈS :

Découvrir ma voie
```

#### B.1.3 — Reformuler le subtitle (lignes 85-89)

```
AVANT :

Rejoins une communauté d'élite où tes compétences sont tes seules limites.

---

APRÈS :

HASHCODE identifie tes forces, t'oriente vers la spécialisation qui te correspond
et t'accompagne avec des ateliers, du mentorat et des projets concrets.
```

#### B.1.4 — Supprimer l'aperçu du résultat quiz (lignes 172-236)

Retirer entièrement la carte de résultat exemple. L'effet de surprise est essentiel.

#### B.1.5 — Nouvelle section « Comment ça fonctionne ? » en 5 cartes

Dans `components/landing/how-it-works.tsx`.

```
1. Découvre ton potentiel  →  Quiz psychométrique
2. Choisis une voie        →  Spécialisation recommandée
3. Apprends avec ateliers  →  Étapes de ton parcours
4. Travaille sur projets   →  Missions et cas réels
5. Valide tes compétences  →  Preuves vérifiées par des mentors
```

---

### Sprint 2 — Emails (aligner le ton avec la nouvelle promesse)

**Philosophie :** Les emails actuels sont trop « cyberpunk hacker » (« NEURAL CHECK-IN », « Vibrance », « Protocole de Calibration », « Agent validé », « Symbiose Cognitive »). Ils doivent devenir **clairs, chaleureux et orientés transformation** — comme un coach, pas comme un film de SF.

#### B.2.1 — Réécrire `welcome.ts`

```
AVANT (sujet) :

[HASHCODE] Initialisation terminée — Bienvenue, {name} 👋

AVANT (corps) :

"Ton signal est actif."
"Action Prioritaire : NEURAL CHECK-IN"
"Effectuer mon Check-in →"

---

APRÈS (sujet) :

Bienvenue dans ton parcours HASHCODE, {name} 🚀

APRÈS (corps) :

"Bienvenue, {name}. Ton parcours commence ici."
"Prochaine étape : ton diagnostic de profil."
"Découvrir mon profil →"
```

#### B.2.2 — Réécrire `quiz-results.ts`

```
AVANT (sujet) :

{name}, tu es un·e BUILDER — voici ce que ça signifie

AVANT (corps) :

"Ton espace de travail est prêt."
"Missions, guilde, tableau de bord"
"Accéder à mon tableau de bord →"

---

APRÈS (sujet) :

{name}, ton profil est prêt — voici la suite 👉
ou
Ton plan d'action HASHCODE est prêt, {name}

APRÈS (corps) :

"Tu es un·e {profile}. Voici ce que ça signifie pour la suite."
"Spécialisation recommandée : {specialization}."
"Objectif 90 jours : {goal}."
"Première étape : {atelier} (45 min)"
"Commencer mon parcours →"
```

**Nouveau paramètre nécessaire :** le template doit recevoir `specialization`, `goal90days`, `firstAtelier` en plus de `name` et `profileType`.

#### B.2.3 — Réécrire `onboarding-completed.ts`

```
AVANT (sujet) :

Onboarding validé — Découvre ta classe de bâtisseur 🎯

AVANT (corps) :

"Passer mon test de profilage →"

---

APRÈS (sujet) :

Ton profil est créé — prêt à découvrir qui tu es ?

APRÈS (corps) :

"Génial, {name}. Tes infos sont enregistrées."
"Maintenant, place à la découverte : un quiz de 3 minutes pour révéler ton profil."
"Ce n'est pas un test, c'est un miroir."
"Découvrir mon profil →"
```

#### B.2.4 — Réécrire `beta-key-verified.ts`

```
AVANT (sujet) :

Accès HASHCODE activé — Prochaine étape 🚀

AVANT (corps) :

"phase de build Alpha"
"ACCÈS ALPHA"
"Lancer mon Onboarding →"

---

APRÈS (sujet) :

Bienvenue dans HASHCODE, {name} 🎉

APRÈS (corps) :

"Ton accès est activé. Bienvenue."
"Première étape : crée ton profil en 5 minutes."
"Ce que tu y gagnes : un parcours personnalisé adapté à tes objectifs."
"Créer mon profil →"
```

#### B.2.5 — Réécrire `mission-protocol.ts` (Day 1 drip)

```
AVANT (sujet) :

[PROTOCOLE] Ta première mission HASHCODE — Prêt(e) ? 🎯

AVANT (corps) :

"Preuve de maîtrise"
"montre au réseau ce que tu sais faire"

---

APRÈS (sujet) :

{name}, ta première étape t'attend

APRÈS (corps) :

"Tu as découvert ton profil. Maintenant, passons à l'action."
"Voici la première étape recommandée pour ton parcours :"
"Atelier : {atelierTitle} ({duration})"
"Pourquoi cet atelier ? Parce qu'il est le point de départ de ta spécialisation."
"Commencer l'atelier →"
```

#### B.2.6 — Réécrire `squad-power.ts` (Day 3 drip)

```
AVANT (sujet) :

[SYNERGIE] Ne build pas seul(e) — Active ta Squad 🤝

AVANT (corps) :

"Symbiose Cognitive"
"Squad complète (5 membres) progresse 3x plus vite"

---

APRÈS (sujet) :

{name}, qui pourrait t'aider à progresser plus vite ?

APRÈS (corps) :

"Tu avances bien sur ton parcours. Une équipe peut t'aider à aller plus loin."
"Dans HASHCODE, tu peux rejoindre ou créer une Squad de 5 personnes max."
"Ensemble, vous travaillez sur des projets, vous échangez et vous validez mutuellement vos compétences."
"Découvrir les Squads →"
```

#### B.2.7 — Réécrire `digital-identity.ts` (Day 7 drip)

```
AVANT (sujet) :

[RÉPUTATION] Ta carte de membre est prête à être déployée 🚀

AVANT (corps) :

"AGENT VALIDÉ"
"Carte de Membre holographique"

---

APRÈS (sujet) :

{name}, ton portfolio commence à prendre forme

APRÈS (corps) :

"Après une semaine, tu commences à avoir des réalisations concrètes."
"Chaque projet validé devient une preuve de compétence (Evidence)."
"Ton portfolio se construit automatiquement."
"Bientôt, tu pourras le partager avec des recruteurs et partenaires."
"Voir mon portfolio →"
```

#### B.2.8 — Réécrire `daily-reminder.ts`

```
AVANT (sujet) :

{name}, ton check-in quotidien t'attend

AVANT (corps) :

"On ne veut pas te brusquer — mais ton tableau de bord te réclame"
"Un check-in quotidien suffit"

---

APRÈS (sujet) :

{name}, une petite étape aujourd'hui ?

APRÈS (corps) :

"Tu as un objectif : {goal90days}"
"Chaque jour compte. Même 15 minutes sur ton atelier te rapprochent du but."
"Reprendre mon parcours →"
```

#### B.2.9 — Créer un nouveau template : `orientation.ts`

**NOUVEAU FICHIER** : `lib/email-templates/orientation.ts`

Envoyé après que l'utilisateur a terminé le quiz ET choisi sa spécialisation.

```
Sujet :

{name}, ton plan d'action pour les 90 prochains jours

Corps :

"Félicitations, {name}. Ton profil est clair, ta direction est choisie."

"Spécialisation : {specialization}"
"Objectif 90 jours : {goal90days}"

"Ce que tu sauras faire dans 90 jours :"
"- {outcome1}"
"- {outcome2}"
"- {outcome3}"

"Première étape :"
"🎓 {atelierTitle} ({duration})"
"{atelierDescription}"

"On y va ?"
"Commencer l'atelier →"
```

#### B.2.10 — Ajouter la méthode `sendOrientationEmail` dans `lib/email.ts`

```ts
async sendOrientationEmail({
  email, name, specialization, goal90days, outcomes, atelierTitle, atelierDuration, atelierDescription
}: {
  email: string; name: string; specialization: string;
  goal90days: string; outcomes: string[];
  atelierTitle: string; atelierDuration: string; atelierDescription: string;
}) {
  if (!resend) return { success: true, mocked: true };
  const { subject, html, text } = getOrientationEmailContent({
    name, specialization, goal90days, outcomes, atelierTitle, atelierDuration, atelierDescription
  });
  return this._send({ to: email, subject, html, text });
}
```

#### B.2.11 — Nettoyer les emails morts

- `sendSquadInvitationEmail` : défini mais jamais appelé → **supprimer** du code ou **implémenter** l'appel
- `sendSquadCohesionAlert` : défini mais jamais appelé → **supprimer** ou **implémenter**
- `sendWelcomeProfileEmail` et `sendWelcomePendingQuiz` : tombent tous les deux dans `sendWelcomeEmail` → **fusionner** en une seule méthode

#### B.2.12 — Mettre à jour le template base (`base.ts`)

Vérifier que le design HTML (fond noir #080808, accent vert #C5F441) reste cohérent avec le nouveau ton. Ce design est bon — le garder. Juste changer les textes.

---

### Sprint 3 — Révélation → Choix → Orientation

**L'atelier recommandé apparaît immédiatement après l'orientation.**

**Fichier : `lib/analysis.ts`**

#### B.3.1 — Enrichir `AnalysisResult`

```ts
interface AnalysisResult {
  primary: string
  secondary: string
  scores: Record<string, number>
  percentages: Record<string, number>
  level: number
  consistency: number
  isHybrid: boolean

  // Spécialisation (multiples propositions)
  recommendedSpecializations: Array<{
    id: string
    label: string
    reason: string
    whyText: string
    whatYouWillKnow: string[]
    steps: Array<{
      weekRange: string
      title: string
      type: "atelier" | "projet" | "validation"
    }>
  }>

  // Objectif 90 jours (dépend du choix de l'utilisateur)
  goal90days: string
  goal90daysWhy: string
  goal90daysOutcomes: string[]
  goal90daysSteps: Array<{
    weekRange: string
    title: string
    type: "atelier" | "projet" | "validation"
  }>

  // Première action concrète
  firstAction: {
    type: "atelier" | "projet" | "mentor"
    title: string
    slug: string
    duration: string
    pourquoi: string
  }

  nextActions: {
    atelier: { title: string; slug: string } | null
    mentor: { name: string; id: string } | null
    mission: { title: string; slug: string } | null
  }
}
```

#### B.3.2 — Logique de recommandation

Combiner scores psychométriques + `mainObjective` + `technicalLevel`.

```
mainObjective = CYBERSECURITY + builder élevé
  → 1. Cybersécurité offensive (recommandé)
  → 2. Architecture Cloud
  → 3. Développement sécurisé

Pour la #1 :
  goal90days = "Réaliser ton premier audit de sécurité"
  firstAction = { type: "atelier", title: "Linux pour la cybersécurité", duration: "45 min" }
```

---

**Fichier : `components/quiz/result-page.tsx`**

#### B.3.3 — Écran de choix de spécialisation

Entre la révélation et l'orientation.

```
Nous pensons que la cybersécurité est faite pour toi.

Tes réponses montrent un fort intérêt pour les systèmes complexes
et la protection des infrastructures.

Souhaites-tu explorer cette voie ?

[ Oui, c'est pour moi ]   [ Je préfère le Cloud ]   [ Je veux comparer ]
```

Si l'utilisateur choisit une alternative, le `goal90days` et les `nextActions` sont recalculés.

#### B.3.4 — Écran d'orientation détaillée

Après le choix, afficher :

```
Objectif 90 jours
Réaliser ton premier audit de sécurité.

Pourquoi ?
Parce que cette compétence est la base de tous les métiers de la cybersécurité.

Dans 90 jours, tu seras capable de :
✓ Analyser une cible et cartographier ses surfaces d'attaque
✓ Identifier des vulnérabilités courantes (OWASP Top 10)
✓ Rédiger un rapport d'audit professionnel

Ton plan d'action :
Semaine 1 : Atelier Linux pour la cybersécurité          ← premier, tout de suite
Semaine 2-3 : Atelier OWASP Top 10
Semaine 4-6 : Audit d'une application simple (projet)
Semaine 7-8 : Rédaction du rapport + validation mentor
Semaine 9-12 : Audit d'une application réelle en équipe

Première étape :
🎓 Atelier « Linux pour la cybersécurité » — 45 min
Pourquoi lui ? Parce que tous les outils de cybersécurité tournent sur Linux.
[ Commencer l'atelier → ]
```

Pas de bouton « Voir le dashboard ». Le seul CTA est **l'atelier**.

**Fichier : `lib/profile-content.ts`**

#### B.3.5 — Contenu d'orientation par profil

```ts
{
  name: "Builder",
  possibleSpecializations: [
    {
      id: "cybersecurite",
      label: "Cybersécurité",
      why: "Parce que cette compétence est la base des métiers de la cybersécurité",
      whatYouWillKnow: [
        "Analyser une cible",
        "Identifier des vulnérabilités",
        "Rédiger un rapport d'audit",
      ],
      steps: [
        { weekRange: "Semaine 1", title: "Linux pour la cybersécurité", type: "atelier" },
        { weekRange: "Semaine 2-3", title: "OWASP Top 10", type: "atelier" },
        { weekRange: "Semaine 4-6", title: "Audit d'une application simple", type: "projet" },
      ],
      condition: (user) => user.mainObjective === "CYBERSECURITY",
    },
    // ...
  ],
}
```

**Fichier : `components/quiz/result-revelation.tsx`**

#### B.3.6 — Section recommandation après révélation

Ajouter la spécialisation + objectif 90 jours après l'animation de révélation.

---

### Sprint 4 — Mon Parcours (ex-Dashboard)

**Fichier : `components/dashboard/dashboard-shell.tsx`**

#### B.4.1 — Objectif en haut avec la boucle de progression visible

```tsx
<div className="space-y-6">

  {/* 1. Objectif actuel */}
  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20">
    <p className="text-[9px] font-mono text-primary uppercase font-bold">
      Objectif 90 jours
    </p>
    <p className="text-lg font-bold text-white">
      Réaliser ton premier audit de sécurité
    </p>
    <p className="text-sm text-zinc-400 mt-1">
      Pourquoi ? Parce que cette compétence est la base de la cybersécurité.
    </p>
  </div>

  {/* 2. Boucle de progression visuelle */}
  <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
    <span className="text-primary font-bold">Apprendre</span>
    <span>→</span>
    <span>Pratiquer</span>
    <span>→</span>
    <span>Valider</span>
  </div>

  {/* 3. Prochaine étape (toujours une seule action prioritaire) */}
  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
    <p className="text-[9px] font-mono text-zinc-500 uppercase">Prochaine étape</p>
    <p className="text-base font-bold text-white">Atelier Linux pour la cybersécurité</p>
    <p className="text-xs text-zinc-400">45 min · Première étape de ton parcours Pentester</p>
    <Button className="mt-3 btn-primary-glow">Commencer</Button>
  </div>

</div>
```

#### B.4.2 — Masquer le bruit pour les nouveaux membres

```tsx
{!isNewUser && <ActivityFeed />}
{!isNewUser && <ReferralCard />}
{!isNewUser && <AmbassadorGoal />}
{!isNewUser && <ConnectiviteSection />}
```

#### B.4.3 — Welcome header orienté objectif

```
AVANT :

Bienvenue, [prénom]. Message générique selon la classe.

---

APRÈS :

Bienvenue sur ton Parcours, [prénom].

Objectif : Réaliser ton premier audit de sécurité.
Prochaine étape : Atelier Linux (45 min)
```

---

### Sprint 5 — Welcome Modal

**Fichier : `components/dashboard/welcome-modal.tsx`**

#### B.5.1 — Phase 2 devient la feuille de route

```
AVANT (phase "guide") :

Comment ça marche ?
3 concepts : Missions, Squad, XP & Grades

---

APRÈS :

Voici ta feuille de route

Objectif 90 jours : Réaliser ton premier audit de sécurité
Cette semaine     : Atelier Linux (45 min)
Aujourd'hui       : Première mission d'ancrage

Bouton unique : "Commencer maintenant →"
```

---

### Sprint 6 — Ateliers (préparation)

**Fichier : `lib/ateliers.ts`** (NOUVEAU)

```ts
interface Atelier {
  id: string
  title: string
  description: string
  specializationId: string
  parcoursStep: number
  duration: number
  format: "video" | "live" | "interactif"
  xpReward: number
  prerequisites: string[]
  produces: string            // ce que l'atelier produit (ex: "Compte-rendu d'audit")
}
```

**Principe :** on ne vend pas des ateliers. On vend des **étapes de parcours**.

```
✗ « Atelier Linux » → cours isolé
✓ « Étape 1 de ton parcours Pentester » → progression
```

---

### Sprint 7 — Projets et Validation

**Aucun changement de code immédiat.** Cadrer le concept :

- Chaque compétence visée doit produire une **Evidence**
- Chemin : atelier → projet → validation mentor → Evidence
- Le portfolio = collection d'evidences

---

## Résumé des fichiers

### Nouveaux fichiers

| # | Fichier | Raison |
|---|---|---|
| — | `PRODUCT_VISION.md` | Document fondateur |
| 1 | `lib/email-templates/orientation.ts` | Nouvel email post-orientation |
| 2 | `lib/ateliers.ts` | Structure ateliers liés aux parcours |

### Fichiers à modifier

| # | Fichier | Changement |
|---|---|---|
| 3 | `components/landing/hero.tsx` | Promesse + CTA + retirer exemple résultat |
| 4 | `components/landing/how-it-works.tsx` | Ajouter section 5 cartes |
| 5 | `lib/analysis.ts` | Enrichir `AnalysisResult` |
| 6 | `lib/profile-content.ts` | Ajouter spécialisations + contenu orientation |
| 7 | `components/quiz/result-page.tsx` | Ajouter étape Choix + Orientation |
| 8 | `components/quiz/result-revelation.tsx` | Ajouter section recommandation |
| 9 | `components/dashboard/dashboard-shell.tsx` | Objectif + boucle + next step + masquer bruit |
| 10 | `components/dashboard/welcome-modal.tsx` | Phase 2 → feuille de route |
| 11 | `lib/email.ts` | Ajouter `sendOrientationEmail` + nettoyer morts |

### Fichiers email à réécrire

| # | Fichier | Changement |
|---|---|---|
| 12 | `lib/email-templates/welcome.ts` | Ton coach, pas cyberpunk |
| 13 | `lib/email-templates/quiz-results.ts` | Ajouter orientation + plan d'action |
| 14 | `lib/email-templates/onboarding-completed.ts` | Alléger, recentrer sur découverte |
| 15 | `lib/email-templates/beta-key-verified.ts` | Accueil chaleureux, pas « phase Alpha » |
| 16 | `lib/email-templates/mission-protocol.ts` | Devenir « première étape du parcours » |
| 17 | `lib/email-templates/squad-power.ts` | Ton équipe, pas « symbiose cognitive » |
| 18 | `lib/email-templates/digital-identity.ts` | Portfolio, pas « carte holographique » |
| 19 | `lib/email-templates/daily-reminder.ts` | Objectif, pas check-in |

**Total : 3 nouveaux fichiers, 16 fichiers modifiés. Zéro refonte d'infrastructure.**
