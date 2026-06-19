# IMPLEMENTATION ROADMAP — JOINHASHCODE

### Plan d'action · Priorité Impact/Effort · Juin 2026

---

## VUE D'ENSEMBLE

```
SEMAINE 1  →  Activation & Signaux viraux       (5 tâches · ~11h)
SEMAINE 2  →  FTUE complet & Rétention early    (3 tâches · ~2.5j)
SEMAINE 3  →  Gamification & FOMO               (3 tâches · ~3j)
SEMAINE 4  →  Croissance & Mobile               (3 tâches · ~4j)
MOIS 2     →  Communauté & Preuve de valeur     (3 tâches · ~7j)
```

---

## SEMAINE 1 — Activation & Signaux viraux

### #1 · Barre de progression XP visible en permanence

**Fichiers :** `components/dashboard/app-sidebar.tsx` · `lib/evolution-engine.ts`
**Effort :** ~2h

**Pourquoi :** l'utilisateur ne sait jamais combien d'XP il lui manque. Pas de jalon visible = pas de motivation.

**Étapes :**

1. Ouvrir `lib/evolution-engine.ts` — localiser les seuils de niveaux (L1:0, L2:100, L3:400, L4:1400)
2. Exporter une fonction `getLevelProgress(xp: number): { level, current, next, percent }`
3. Dans `components/dashboard/app-sidebar.tsx`, récupérer `session.user.experience`
4. Appeler `getLevelProgress(experience)` et afficher :
   - Badge niveau actuel (ex: "Niveau 2")
   - Barre de progression remplie à `percent`%
   - Texte : "{current} / {next} XP · Niveau {level+1}"
5. Placer sous l'avatar utilisateur dans le footer de la sidebar

**Résultat attendu :** chaque utilisateur voit instantanément son prochain palier.

---

### #2 · Email de bienvenue personnalisé par profil

**Fichiers :** `lib/auth.ts` · `lib/email.ts`
**Effort :** ~3h

**Pourquoi :** aujourd'hui l'email de bienvenue est générique. Un Builder doit recevoir un message différent d'un Catalyseur.

**Étapes :**

1. Dans `lib/email.ts`, créer 4 templates `welcomeBuilder()`, `welcomeCreator()`, `welcomeStrategist()`, `welcomeCatalyst()` avec :
   - Nom du profil + couleur
   - 1 phrase sur ce que ça signifie
   - Lien direct vers la première mission recommandée par profil
   - CTA : "Complète ta première mission →"
2. L'email de bienvenue actuel est déclenché dans `lib/auth.ts` au hook `user.created`
3. Modifier ce hook pour lire `user.class` et dispatcher vers le bon template
4. Si `user.class` est null au moment du signup (avant le quiz), envoyer un email de "quiz pending" + un second email déclenché à la fin du quiz dans `app/actions/quiz.ts`
5. Tester avec les 4 profils

**Résultat attendu :** chaque nouveau membre reçoit un email qui parle de lui, pas de la plateforme.

---

### #3 · Boutons de partage natifs post-résultat quiz

**Fichiers :** `components/quiz/result-scores.tsx`
**Effort :** ~2h

**Pourquoi :** WhatsApp existe déjà. LinkedIn et Twitter/X manquent. C'est 30 lignes.

**Étapes :**

1. Ouvrir `components/quiz/result-scores.tsx`
2. Construire les URLs de partage :

   ```typescript
   const profileUrl = `${process.env.NEXT_PUBLIC_APP_URL}/u/${user.pseudo}`;
   const text = `Je viens de découvrir mon profil HASHCODE : ${profileType} (${topScore}%). Découvre le tien :`;

   const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
   const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(profileUrl)}`;
   const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + " " + profileUrl)}`;
   ```

3. Afficher 3 boutons icônes (LinkedIn bleu, X noir, WhatsApp vert) + "Copier le lien"
4. "Copier le lien" → `navigator.clipboard.writeText(profileUrl)` + toast "Lien copié !"
5. Ouvrir les liens dans `target="_blank"`

**Résultat attendu :** chaque résultat de quiz devient un point d'entrée viral.

---

### #4 · Feed d'activité landing branché sur données réelles

**Fichiers :** `components/landing/activity-feed.tsx` · `app/api/feed/route.ts`
**Effort :** ~2h

**Pourquoi :** le feed simulé érode la confiance si un utilisateur le regarde 2 fois.

**Étapes :**

1. Vérifier que `GET /api/feed` est public (pas de guard de session)
2. Si non public, créer `GET /api/public/feed` qui retourne les 20 derniers events `ActivityLog` avec `action IN ['MISSION_APPROVED', 'SQUAD_CREATED', 'USER_SIGNUP', 'LEVEL_UP']`
3. Joindre `User.city` + `User.class` pour chaque event
4. Retourner : `{ action, city, country, class, timestamp }` — sans nom ni email
5. Dans `components/landing/activity-feed.tsx` :
   - Fetcher l'API au mount avec `useEffect` + `setInterval(30000)`
   - Fallback sur les données simulées si l'API échoue ou si < 5 events réels
   - Formatter : "[BUILDER] Mission validée — Dakar · il y a 3 min"
6. Pas d'authentification requise sur cet endpoint

**Résultat attendu :** le feed montre de vraie activité → preuve sociale crédible.

---

### #5 · État vide du dashboard avec guidance

**Fichiers :** `app/dashboard/page.tsx` · nouveau `components/dashboard/empty-state-guide.tsx`
**Effort :** ~3h

**Pourquoi :** dashboard vide = anxiété = abandon. C'est le kill #1 au J+0.

**Étapes :**

1. Dans `app/dashboard/page.tsx`, calculer 3 conditions :
   ```typescript
   const hasCompletedProfile = !!user.pseudo && !!user.country;
   const hasSquad = !!squadMember;
   const hasSubmission = submissions.length > 0;
   const isNewUser = !hasCompletedProfile && !hasSquad && !hasSubmission;
   ```
2. Créer `components/dashboard/empty-state-guide.tsx` avec 3 cards :
   - **Card 1** : "Complète ton profil" — pseudo, photo, GitHub → lien `/settings`
   - **Card 2** : "Rejoins une escouade" → lien `/squad`
   - **Card 3** : "Lance ta première mission" → lien `/missions`
   - Chaque card : icône + titre + 1 ligne de description + CTA bouton
   - Card complétée = fond vert + checkmark (état calculé dynamiquement)
3. Afficher `<EmptyStateGuide />` en haut du dashboard si `isNewUser`
4. Masquer automatiquement quand les 3 conditions sont remplies
5. Style : cards horizontales sur desktop, stack vertical sur mobile

**Résultat attendu :** plus aucun utilisateur n'est perdu après le quiz.

---

## SEMAINE 2 — FTUE complet & Rétention early

### #6 · Checklist d'activation persistante

**Fichiers :** `prisma/schema.prisma` · `app/api/user/me/route.ts` · nouveau `components/dashboard/activation-checklist.tsx`
**Effort :** ~1j

**Pourquoi :** l'état vide (#5) est le fix d'urgence. La checklist est le système durable.

**Étapes :**

1. Ajouter champ Prisma sur `User` :
   ```prisma
   onboardingStep Int @default(0) // 0=quiz, 1=profile, 2=squad, 3=mission, 4=done
   ```
2. Migrer : `npx prisma migrate dev --name add-onboarding-step`
3. Créer `components/dashboard/activation-checklist.tsx` :
   ```
   Étape 1 ✅  Ton profil découvert     (quiz complété → toujours true)
   Étape 2 ☐   Compléter tes infos      (pseudo + country + au moins 1 objectif)
   Étape 3 ☐   Rejoindre une escouade   (member record existe)
   Étape 4 ☐   Compléter une mission    (1 submission APPROVED)
   ```
4. Chaque étape : progress indicator + CTA direct + XP reward affiché ("Complète → +25 XP")
5. Masquer la checklist quand `onboardingStep >= 4`
6. Mettre à jour `onboardingStep` dans les routes existantes :
   - `/api/user/update` → step 2
   - `/api/squad/join` et `/api/squad/create` → step 3
   - `/api/admin/submissions/[id]` à l'approval → step 4
7. Afficher en haut du dashboard, rétractable mais pas supprimable

**Résultat attendu :** parcours d'activation guidé et mesuré.

---

### #7 · Emails de rétention automatiques via QStash

**Fichiers :** `lib/qstash.ts` · `lib/email.ts` · `app/api/internal/cron/check-activity/route.ts`
**Effort :** ~1j

**Pourquoi :** sans rappel, l'utilisateur oublie. QStash est déjà configuré.

**Étapes :**

1. Dans `lib/email.ts`, créer 3 templates :
   - `emailCheckinReminder(user)` : "Ta squad a besoin de toi — check-in manqué depuis 48h"
   - `emailFirstMissionReminder(user)` : "Ta première mission t'attend" (si 0 submission après 3 jours)
   - `emailSquadDecayAlert(user, cohesionScore)` : "Votre cohésion décroît — agissez maintenant"
2. Dans `app/api/internal/cron/check-activity/route.ts` (cron déjà existant) :
   - Requête : users avec `lastCheckinAt < now - 48h` → envoyer `emailCheckinReminder`
   - Requête : users avec `createdAt < now - 3j` ET `missionsCompletedCount = 0` → envoyer `emailFirstMissionReminder`
3. Créer `app/api/internal/cron/squad-alerts/route.ts` :
   - Requête : squads avec `cohesionScore < 0.3` → envoyer `emailSquadDecayAlert` aux membres
   - Protéger avec `CRON_SECRET`
4. Configurer le cron dans QStash Dashboard ou `vercel.json` : daily 9h00 UTC
5. Ajouter unsubscribe link dans chaque email (champ `emailOptOut Boolean @default(false)` sur User)

**Résultat attendu :** utilisateurs rappelés automatiquement aux moments critiques de désengagement.

---

### #8 · Délai moyen de review affiché sur les missions

**Fichiers :** `app/api/missions/[id]/route.ts` · `app/missions/[id]/page.tsx`
**Effort :** ~2h

**Pourquoi :** attendre sans savoir combien de temps = frustration → abandon.

**Étapes :**

1. Dans `app/api/missions/[id]/route.ts`, ajouter une query :
   ```typescript
   const avgReviewMs = await prisma.missionReview.aggregate({
     where: { submission: { missionId: id } },
     _avg: { createdAt: false }, // calculer via raw
   });
   // Query SQL brute plus simple :
   // SELECT AVG(EXTRACT(EPOCH FROM (r.created_at - s.created_at))/3600)
   // FROM mission_review r JOIN mission_submission s ON s.id = r.submission_id
   // WHERE s.mission_id = $1
   ```
2. Retourner `avgReviewHours: number | null` dans la réponse
3. Dans `app/missions/[id]/page.tsx`, afficher sous le formulaire de soumission :
   - Si `avgReviewHours` existe : "Délai moyen de review : ~{Math.round(avgReviewHours)}h"
   - Si null (pas encore de review) : "Première mission — délai inconnu"
4. Afficher uniquement si le statut est PENDING ou si l'utilisateur s'apprête à soumettre

**Résultat attendu :** l'utilisateur sait quand s'attendre à un retour → patience augmentée.

---

## SEMAINE 3 — Gamification & FOMO

### #9 · Passer de 5 à 30+ badges

**Fichiers :** `lib/badge-engine.ts` · `lib/activity-log.ts`
**Effort :** ~2j

**Pourquoi :** 5 badges = plafond atteint en 2 semaines. Pas de collectionnisme possible.

**Étapes :**

1. Dans `lib/badge-engine.ts`, étendre les définitions avec 6 catégories :

   **Progression (5 badges) :**

   ```typescript
   LEVEL_3: { condition: user.level >= 3, xp: 0, label: "Opérateur" }
   LEVEL_4: { condition: user.level >= 4, xp: 0, label: "Architecte" }
   STREAK_7: { condition: user.streakCount >= 7, xp: 100, label: "Semaine Parfaite" }
   STREAK_30: { condition: user.streakCount >= 30, xp: 500, label: "Mois de Feu" }
   XP_1000: { condition: user.experience >= 1000, xp: 0, label: "Millionnaire XP" }
   ```

   **Par profil (4 badges) :**

   ```typescript
   BUILDER_MASTER: { condition: missions INIT complétées >= 5 ET class=BUILDER }
   CREATOR_MASTER: { ... }
   STRATEGIST_MASTER: { ... }
   CATALYST_MASTER: { ... }
   ```

   **Missions (5 badges) :**

   ```typescript
   INIT_COMPLETE: { condition: toutes missions INIT approuvées }
   CORE_PIONEER: { condition: 1ère mission CORE approuvée }
   FIRST_BLOOD: { condition: 1ère mission approuvée tout court }
   SPEED_RUN: { condition: mission approuvée en < 24h après soumission }
   PERFECTIONIST: { condition: qualityLevel = "EXEMPLARY" sur une mission }
   ```

   **Squad (5 badges) :**

   ```typescript
   SQUAD_FOUNDER: { condition: a créé une squad }
   FULL_SQUAD: { condition: squad atteint 5 membres }
   COHESION_MAX: { condition: cohesionScore = 1.0 }
   HYPER_LINK: { condition: squad streakCount >= 7 }
   SQUAD_VETERAN: { condition: membre d'une squad depuis >= 30 jours }
   ```

   **Social (4 badges) :**

   ```typescript
   RECRUITER: { condition: a amené >= 1 membre via referral }
   AMBASSADOR: { condition: a amené >= 5 membres }
   REVIEWER_BADGE: { condition: a complété >= 3 peer reviews }
   MENTOR: { condition: peer review notée "utile" >= 5 fois }
   ```

   **Spéciaux (3 badges) :**

   ```typescript
   EARLY_ADOPTER: { condition: existant — beta key }
   NIGHT_OWL: { condition: check-in entre 23h et 5h }
   COMEBACK: { condition: check-in après >= 7 jours d'absence }
   ```

2. Appeler `checkAndAwardBadges(userId)` dans les routes concernées :
   - Après `PATCH /api/user/checkin` → STREAK\_\*, NIGHT_OWL, COMEBACK
   - Après approval mission dans `PATCH /api/admin/submissions/[id]` → FIRST_BLOOD, INIT_COMPLETE, SPEED_RUN, PERFECTIONIST, \*\_MASTER
   - Après `POST /api/squad/create` → SQUAD_FOUNDER
   - Après squad atteint 5 membres → FULL_SQUAD
3. Afficher les badges dans `components/dossier/dossier-view.tsx` avec icônes distinctes par catégorie
4. Notification in-app à chaque badge débloqué

**Résultat attendu :** collectionnisme activé — toujours un badge à portée.

---

### #10 · Leaderboard squads public

**Fichiers :** nouveau `app/leaderboard/page.tsx` · `app/api/squad/leaderboard/route.ts`
**Effort :** ~1j

**Pourquoi :** FOMO pur. Les non-membres voient ce qu'ils ratent. Les membres veulent grimper.

**Étapes :**

1. `GET /api/squad/leaderboard` existe déjà — vérifier qu'il retourne : name, cohesionScore, streakCount, memberCount, phase, topProfile
2. Si endpoint incomplet, enrichir la query :
   ```typescript
   const squads = await prisma.organization.findMany({
     where: { cohesionScore: { gt: 0 } },
     orderBy: { cohesionScore: "desc" },
     take: 20,
     include: { members: { include: { user: { select: { class: true } } } } },
   });
   ```
3. Créer `app/leaderboard/page.tsx` — page publique (pas de session requise) :
   - Header : "Top Escouades · Semaine du {date}"
   - Table ou cards : rang · nom squad · cohésion (%) · streak · phase · profils dominants
   - Top 3 avec podium visuel (or/argent/bronze)
   - Badge "Ta squad" si utilisateur connecté et sa squad est dans le top 20
   - CTA pour non-membres : "Crée ton escouade"
4. Ajouter le lien dans le footer de la landing page et dans `app-sidebar.tsx`
5. Mettre en cache la réponse API 5 minutes (headers `Cache-Control`)

**Résultat attendu :** page partageable, indexable sur Google, moteur de FOMO.

---

### #11 · Weekly challenge countdown visible

**Fichiers :** `lib/missions.ts` · `components/dashboard/` — nouveau widget
**Effort :** ~3h

**Pourquoi :** les weekly challenges existent mais sont invisibles depuis le dashboard.

**Étapes :**

1. Dans `lib/missions.ts`, les weekly challenges sont déjà définis (4 missions rotatives par modulo 7)
2. Créer une fonction `getCurrentWeeklyChallenge(): { mission, expiresAt: Date }` :
   ```typescript
   const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
   const index = weekNumber % WEEKLY_MISSIONS.length;
   const nextMonday = getNextMonday(); // date-fns
   return { mission: WEEKLY_MISSIONS[index], expiresAt: nextMonday };
   ```
3. Créer `components/dashboard/weekly-challenge-widget.tsx` :
   - Titre : "DÉFI DE LA SEMAINE"
   - Nom de la mission + XP reward (mis en évidence)
   - Countdown : "Expire dans 2j 14h 33min" (rafraîchi chaque minute)
   - Statut : bouton "Relever le défi →" ou badge "✅ Complété" si déjà soumis
4. Intégrer dans `app/dashboard/page.tsx` en position haute (avant le neural feed)
5. Si l'utilisateur a déjà soumis ce défi : afficher le prochain défi en preview ("La semaine prochaine : …")

**Résultat attendu :** urgence visible, engagement hebdomadaire structuré.

---

## SEMAINE 4 — Croissance & Mobile

### #12 · Referral programme avec tracking et récompenses

**Fichiers :** `prisma/schema.prisma` · `lib/auth.ts` · `app/api/user/me/route.ts` · nouveau `app/api/referral/route.ts`
**Effort :** ~2j

**Pourquoi :** `referralCode` existe sur `User` mais n'est pas utilisé pour récompenser.

**Étapes :**

1. Ajouter champ Prisma :
   ```prisma
   model User {
     referredBy    String?        // userId du parrain
     referralCount Int    @default(0)
   }
   ```
2. Migrer : `npx prisma migrate dev --name add-referral-tracking`
3. Dans `lib/auth.ts` au hook `user.created` :
   - Lire le cookie `ref` (déjà stocké dans `signin-form.tsx` via `?ref=CODE`)
   - Trouver le `User` avec ce `referralCode`
   - Setter `referredBy = parrain.id` sur le nouvel utilisateur
4. Créer `app/api/internal/referral-reward/route.ts` :
   - Déclenché quand un filleul complète le quiz (dans `app/actions/quiz.ts`)
   - `+50 XP` au parrain + notification "Un membre a rejoint grâce à toi !"
   - Incrémenter `referralCount` du parrain
   - À 1 filleul → badge RECRUITER ; à 5 → badge AMBASSADOR
5. Dans les settings, afficher :
   - "Ton code de parrainage : HASHCODE-{CODE}"
   - Bouton "Copier mon lien de parrainage"
   - "Tu as parrainé {n} membre(s)"
   - Si n >= 1 : lien vers les profils des filleuls
6. Lien de parrainage format : `{APP_URL}/signin?ref={CODE}`

**Résultat attendu :** chaque membre actif devient un vecteur d'acquisition mesuré.

---

### #13 · PWA basique — installable sur mobile

**Fichiers :** `public/manifest.json` (nouveau) · `app/layout.tsx` · `public/sw.js` (nouveau)
**Effort :** ~1j

**Pourquoi :** sans PWA, pas de push notifications, pas d'installation mobile, pas de rétention passive.

**Étapes :**

1. Créer `public/manifest.json` :
   ```json
   {
     "name": "HASHCODE",
     "short_name": "HASHCODE",
     "description": "Identifie, développe et valorise ton profil tech",
     "start_url": "/dashboard",
     "display": "standalone",
     "background_color": "#09090b",
     "theme_color": "#B8FF3B",
     "icons": [
       { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
     ]
   }
   ```
2. Générer les icônes 192px et 512px (logo HASHCODE existant)
3. Dans `app/layout.tsx` ajouter dans `<head>` :
   ```tsx
   <link rel="manifest" href="/manifest.json" />
   <meta name="theme-color" content="#B8FF3B" />
   <meta name="apple-mobile-web-app-capable" content="yes" />
   ```
4. Créer `public/sw.js` — service worker minimal (cache-first pour assets statiques) :
   ```javascript
   self.addEventListener("install", (e) =>
     e.waitUntil(
       caches.open("hashcode-v1").then((c) => c.addAll(["/offline.html"])),
     ),
   );
   self.addEventListener("fetch", (e) => {
     if (!navigator.onLine) e.respondWith(caches.match("/offline.html"));
   });
   ```
5. Enregistrer le service worker dans `app/layout.tsx` via `useEffect` dans un client component
6. Créer `app/offline.html` : page minimaliste "Pas de connexion — reviens dès que possible"
7. Tester sur Chrome mobile : menu → "Ajouter à l'écran d'accueil" doit fonctionner

**Résultat attendu :** installable sur Android/iOS, base pour push notifications futures.

---

### #14 · Light mode

**Fichiers :** `app/globals.css`
**Effort :** ~1j

**Pourquoi :** dark-only = illisible en extérieur. Critique pour l'usage en Afrique subsaharienne.

**Étapes :**

1. Dans `app/globals.css`, les variables CSS sont actuellement définies uniquement dans `.dark`
2. Créer les équivalents dans `:root` (light mode par défaut) :
   ```css
   :root {
     --background: oklch(0.98 0 0);
     --foreground: oklch(0.09 0 0);
     --card: oklch(1 0 0);
     --card-foreground: oklch(0.09 0 0);
     --primary: oklch(0.75 0.18 120); /* vert HASHCODE adapté light */
     --muted: oklch(0.96 0 0);
     --muted-foreground: oklch(0.45 0 0);
     --border: oklch(0.9 0 0);
     /* ... toutes les variables */
   }
   ```
3. `next-themes` est déjà installé et configuré — le toggle dans les settings existe
4. Vérifier que `<ThemeProvider>` dans `app/layout.tsx` a `defaultTheme="dark"` (respecter la préférence actuelle)
5. Tester les composants critiques en light mode : sidebar, cards missions, radar chart, squad journey
6. Ajuster les couleurs cyberpunk qui disparaissent en light (glows, neons) : fallback sur des borders solides
7. Ajouter toggle rapide dans la sidebar (icône soleil/lune) en plus des settings

**Résultat attendu :** accessibilité doublée, usage outdoor possible.

---

## MOIS 2 — Communauté & Preuve de valeur

### #15 · Messagerie async dans les squads

**Fichiers :** `prisma/schema.prisma` · nouveau `app/api/squad/messages/route.ts` · `components/dashboard/squad-journey.tsx`
**Effort :** ~3j

**Pourquoi :** sans communication interne, la coordination se fait sur WhatsApp — l'engagement quitte la plateforme.

**Étapes :**

1. Ajouter modèle Prisma :
   ```prisma
   model SquadMessage {
     id             String       @id @default(cuid())
     organizationId String
     organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
     userId         String
     user           User         @relation(fields: [userId], references: [id])
     content        String       @db.Text
     createdAt      DateTime     @default(now())

     @@index([organizationId, createdAt])
   }
   ```
2. Migrer : `npx prisma migrate dev --name add-squad-messages`
3. Créer `app/api/squad/messages/route.ts` :
   - `GET` : 50 derniers messages de la squad de l'utilisateur (avec pagination cursor)
   - `POST` : envoyer un message (validation : 1-500 chars, rate-limit 10/min)
   - Auth guard : session + membership vérifié
4. Dans `components/dashboard/squad-journey.tsx`, ajouter un onglet "Messages" :
   - Fil de messages avec avatar + pseudo + timestamp
   - Input en bas + bouton envoyer
   - Polling toutes les 30 secondes (`useInterval`)
   - Scroll to bottom automatique sur nouveau message
5. Notifier les membres via `Notification` model quand un message est posté (max 1 notif/heure par squad pour éviter le spam)
6. Limiter la rétention des messages à 90 jours (cron de nettoyage)

**Résultat attendu :** la squad vit sur HASHCODE, pas sur WhatsApp.

---

### #16 · Page recruteur publique

**Fichiers :** nouveau `app/talent/page.tsx` · nouveau `app/api/public/talent/route.ts`
**Effort :** ~3j

**Pourquoi :** la boucle de valeur est incomplète sans débouché visible. "Le bon profil attire la bonne offre" doit être vrai.

**Étapes :**

1. Créer `GET /api/public/talent` — endpoint public (no session) :
   ```typescript
   // Retourne profils avec dossier public uniquement
   const users = await prisma.user.findMany({
     where: {
       class: { not: null },
       pseudo: { not: null },
       // Opt-in à la visibilité recruteur (champ à ajouter)
       talentVisible: true,
     },
     select: {
       pseudo, class, level, country, city,
       builderScore, creatorScore, strategistScore, catalystScore,
       missionsCompletedCount, githubUrl, portfolioUrl,
       // PAS email ni données personnelles
     },
     orderBy: { missionsCompletedCount: 'desc' },
     take: 50,
   })
   ```
2. Ajouter `talentVisible Boolean @default(true)` sur `User` + toggle dans les settings
3. Créer `app/talent/page.tsx` :
   - Header : "Talents HASHCODE · Profils validés par missions réelles"
   - Filtres : Profil (Builder/Creator/Strategist/Catalyst), Pays, Niveau minimum
   - Grille de cards : pseudo · profil · niveau · pays · missions complétées · lien dossier
   - Chaque card → `/u/[pseudo]` (dossier public existant)
   - CTA recruteur : "Tu recrutes ? Contacte-nous pour un accès premium"
   - Aucune inscription requise pour consulter
4. Ajouter lien "Talents" dans le footer de la landing page
5. SEO : meta tags "développeurs africains validés", "talent tech Afrique"

**Résultat attendu :** les recruteurs trouvent HASHCODE via Google → word-of-mouth → croissance organique.

---

### #17 · Recap hebdomadaire email

**Fichiers :** `lib/email.ts` · `app/api/internal/cron/` — nouveau fichier
**Effort :** ~1j

**Pourquoi :** sans récapitulatif, l'utilisateur oublie sa progression. Le recap crée un rituel de retour.

**Étapes :**

1. Dans `lib/email.ts`, créer `emailWeeklyRecap(user, data)` avec :
   - XP gagné cette semaine
   - Missions soumises / approuvées
   - Rang de la squad (vs semaine dernière)
   - Streak actuel
   - Weekly challenge actif + XP disponible
   - CTA : "Voir mon dossier →"
2. Créer `app/api/internal/cron/weekly-recap/route.ts` :
   - Protéger avec `CRON_SECRET`
   - Query : tous les users avec `lastCheckinAt > now - 30j` (actifs récemment)
   - Pour chaque user : calculer XP gagné sur les 7 derniers jours via `ActivityLog`
   - Envoyer l'email en batch (rate-limit Resend : max 100/sec)
3. Déclencher chaque lundi à 9h00 UTC via QStash
4. Respecter `emailOptOut` (ajouté au #7)
5. Lien unsubscribe dans chaque email : `GET /api/user/email-prefs?action=unsubscribe&token={JWT}`

**Résultat attendu :** rituel hebdomadaire de retour sur la plateforme.

---

## RÉCAPITULATIF — Effort total

| Semaine   | Tâches        | Effort estimé | Impact principal                          |
| --------- | ------------- | ------------- | ----------------------------------------- |
| Semaine 1 | #1 à #5       | ~11h          | Activation J+0, premier signal viral      |
| Semaine 2 | #6 à #8       | ~2.5j         | FTUE complet, rétention J+7               |
| Semaine 3 | #9 à #11      | ~3j           | Gamification, engagement J+30             |
| Semaine 4 | #12 à #14     | ~4j           | Croissance, mobile, accessibilité         |
| Mois 2    | #15 à #17     | ~7j           | Communauté, preuve de valeur, recruteurs  |
| **TOTAL** | **17 tâches** | **~21j**      | **Produit prêt pour 10 000 utilisateurs** |

---

## ORDRE D'EXÉCUTION RECOMMANDÉ

```
J1   → #5  État vide dashboard           (impact immédiat, 3h)
J1   → #4  Feed activité réel            (crédibilité, 2h)
J2   → #1  Barre XP progression          (motivation, 2h)
J2   → #3  Boutons partage quiz          (viral, 2h)
J3   → #2  Email bienvenue par profil    (activation, 3h)
J4   → #8  Délai review affiché          (confiance, 2h)
J5   → #11 Weekly challenge countdown    (urgence, 3h)
J6-7 → #6  Checklist activation          (FTUE complet, 1j)
J8-9 → #7  Emails rétention QStash       (rétention, 1j)
J10  → #10 Leaderboard squads public     (FOMO, 1j)
J11-12 → #9 30+ badges                  (collectionnisme, 2j)
J13-14 → #12 Referral programme         (acquisition, 2j)
J15  → #13 PWA basique                  (mobile, 1j)
J16  → #14 Light mode                   (accessibilité, 1j)
J17-19 → #15 Messagerie squads          (rétention, 3j)
J20-22 → #16 Page recruteur             (valeur, 3j)
J23  → #17 Recap hebdomadaire           (rétention, 1j)
```

---

## MÉTRIQUES DE SUCCÈS PAR PHASE

| Métrique                       | Avant         | Objectif S1 | Objectif M1 | Objectif M2 |
| ------------------------------ | ------------- | ----------- | ----------- | ----------- |
| Taux activation J+0            | ~30% (estimé) | 55%         | 70%         | 80%         |
| Rétention J+7                  | ~15% (estimé) | 30%         | 45%         | 60%         |
| Partages quiz / semaine        | ~5            | 30          | 100         | 300         |
| Nouveaux membres / semaine     | —             | +20%        | +50%        | +100%       |
| Check-in rate (membres actifs) | —             | 40%         | 60%         | 70%         |
| Squads avec ≥ 5 membres        | —             | +30%        | +60%        | +80%        |
