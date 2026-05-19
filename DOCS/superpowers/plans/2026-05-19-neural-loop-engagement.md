# Neural Loop Engagement
**Date:** 2026-05-19  
**Statut:** Brouillon / À valider  
**Auteur:** Eflex

---

## 1. Problème

Les utilisateurs complètent l'onboarding et le quiz, reçoivent leur profil — puis disparaissent.  
L'engagement post-classification est le point de mort de HASHCODE.  
Il n'y a pas de raison suffisamment forte de revenir demain.

---

## 2. Concept : La Neural Loop

Inspiré du modèle Hooked (Nir Eyal) adapté à un contexte communautaire :

```
TRIGGER → ACTION → RÉCOMPENSE VARIABLE → INVESTISSEMENT → TRIGGER suivant
```

Pour HASHCODE spécifiquement :

| Étape | Ce qu'on fait |
|---|---|
| **Trigger externe** | Notification push / email (squad pulse, alerte drift) |
| **Trigger interne** | Curiosité sur son score, peur de perdre sa place dans le squad |
| **Action** | Check-in, mission, review, activité squad |
| **Récompense variable** | XP imprévisible, badge surprise, cohesion boost visible |
| **Investissement** | Profil enrichi, squad plus fort, streak maintenu → valeur perçue qui augmente |

---

## 3. Mécaniques à implémenter

### 3.1 Neural Momentum (Streak System)
**Problème résolu :** Il n'y a aucune pénalité/récompense à l'irrégularité des check-ins.

- Streak counter visible sur le dashboard (jours consécutifs de check-in)
- Multiplicateur XP : ×1.0 → ×1.5 → ×2.0 (à 7j, 14j, 30j)
- "Grace period" de 24h pour ne pas punir une journée sans connexion
- Si streak cassé : notification de relance ("Ton Momentum Neural est en pause")

**Schema requis :**
```prisma
// Sur User
currentStreak    Int  @default(0)
longestStreak    Int  @default(0)
lastStreakDate   DateTime?
```

---

### 3.2 Squad Pulse Notifications
**Problème résolu :** Le decay de cohésion tourne en cron mais personne ne le sait.

Actuellement `applySquadCohesionDecay()` a même un commentaire TODO pour ça :
> `// Note: On pourrait envoyer une notification ici aux membres de l'escouade`

- Quand cohesionScore passe sous 0.4 → notif à tous les membres : "Votre squad perd de la synchronisation"
- Quand un membre fait un check-in → notif légère aux autres : "X vient de booster la cohésion (+5%)"
- Quand cohesionScore atteint 1.0 → notif de célébration collective

**Ce qui existe déjà :** model `Notification` prêt, `updateSquadCohesion()` en place.  
**Ce qui manque :** appel à `createNotification()` dans `squad-logic.ts`.

---

### 3.3 Profile Drift Alert
**Problème résolu :** `profileDrift` existe dans le schema mais n'est jamais visible pour l'user.

- Si `profileDrift > 0.3` → alerte sur le dashboard : "Ton profil évolue — qui es-tu en train de devenir ?"
- CTA vers le quiz rapide (5 questions) pour recalibrer
- Récompense : badge "En Mutation" + XP de re-calibration

**Ce qui existe :** champ `profileDrift Float` sur `User`.  
**Ce qui manque :** lecture de cette valeur côté UI + route de quiz partiel.

---

### 3.4 Variable XP Rewards ("Surge XP")
**Problème résolu :** Les récompenses sont prévisibles → moins dopaminergiques.

- 10% des check-ins donnent un "Surge" : ×3 XP, annoncé avec animation
- Le Surge est déclenché par algo côté serveur (non devinable par l'user)
- Critères possibles : premier check-in après 48h d'absence, check-in en énergie=5, domaine rare

---

### 3.5 Mission Chain (Arcs Narratifs)
**Problème résolu :** Les missions sont atomiques, sans continuité narrative.

- Grouper 3-5 missions en un "Arc" thématique (ex: "Arc Fondateur", "Arc Builder")
- Compléter un arc = récompense spéciale (badge + XP bonus + profil enrichi)
- Progression visible : "Arc 2/5 complété"

**Schema requis :**
```prisma
model MissionArc {
  id          String    @id @default(cuid())
  title       String
  description String
  missions    Mission[] @relation("ArcMissions")
  profileType String    // Builder, Creator, Strategist, Catalyst
  rewardXP    Int
  rewardBadge String
}
```

---

## 4. Priorisation

| Mécanique | Effort | Impact Rétention | Priorité |
|---|---|---|---|
| Squad Pulse Notifications | Faible (TODO déjà noté) | Élevé | **P0** |
| Neural Momentum (Streak) | Moyen (schema + UI) | Élevé | **P0** |
| Profile Drift Alert | Faible (data existe) | Moyen | **P1** |
| Surge XP | Faible (logique serveur) | Moyen | **P1** |
| Mission Chain / Arcs | Élevé (schema + contenu) | Élevé | **P2** |

---

## 5. Ce qui existe déjà (points d'appui)

- `DailyCheckin` model complet avec `lastCheckinAt` sur User ✓
- `cohesionScore` + `updateSquadCohesion()` + cron decay ✓
- `Notification` model prêt et relié à User ✓
- `profileDrift`, `behavioralVibrancy`, `experience`, `level` sur User ✓
- Evolution engine (`lib/evolution-engine.ts`) ✓

---

## 6. Risques

1. **Over-gamification** : Si les mécaniques semblent artificielles, les dev africains tech-savvy s'en méfient. Les récompenses doivent rester liées à la valeur réelle (réseau, missions, profil).
2. **Notification fatigue** : Maximum 1 notification/jour par user. Regrouper.
3. **Schema migrations en prod** : Streak nécessite une migration — prévoir downtime ou migration non-destructive.
4. **Streak anxiety** : Les streaks peuvent devenir stressants. Grace period obligatoire.

---

## 7. KPIs cibles (D+30)

- DAU/MAU ratio : de ~5% à >20%
- Taux de check-in J+3 après onboarding : >40%
- cohesionScore moyen des squads actifs : >0.5
- % users avec streak ≥7j : >15%
