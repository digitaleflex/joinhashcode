import { execFileSync, execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface GitHubIssue {
  title: string;
  labels: string[];
  body: string;
}

const ISSUES: GitHubIssue[] = [
  // ─── SEMAINE 1 — Activation & Signaux viraux ───────────────────────────────

  {
    title: "[UX] Barre de progression XP visible en permanence dans la sidebar",
    labels: ["type: feature", "priority: high", "area: profile"],
    body: `## Contexte

L'utilisateur ne sait jamais combien d'XP il lui manque pour passer au niveau suivant. Pas de jalon visible = pas de motivation = churn précoce.

## Objectif

Afficher une barre de progression XP avec le niveau actuel et le prochain palier directement dans la sidebar, sous l'avatar utilisateur.

## Spécifications

**Fichiers à modifier :**
- \`components/dashboard/app-sidebar.tsx\`
- \`lib/evolution-engine.ts\`

**Étapes :**
1. Exporter une fonction \`getLevelProgress(xp: number)\` dans \`lib/evolution-engine.ts\` :
   \`\`\`typescript
   // Seuils : L1=0, L2=100, L3=400, L4=1400
   export function getLevelProgress(xp: number): {
     level: number;
     current: number;
     next: number | null;
     percent: number;
   }
   \`\`\`
2. Dans \`app-sidebar.tsx\`, récupérer \`session.user.experience\`
3. Appeler \`getLevelProgress(experience)\` et afficher :
   - Badge niveau actuel (ex: "Niveau 2")
   - Barre de progression remplie à \`percent\`%
   - Label : "{current} / {next} XP · Niveau {level+1}"
4. Placer sous l'avatar utilisateur dans le footer sidebar

## Critères d'acceptation
- [ ] La barre est visible sur toutes les pages protégées
- [ ] Elle se met à jour immédiatement après un check-in ou une mission approuvée
- [ ] Au niveau max (L4), afficher "Niveau Max · {xp} XP" sans barre
- [ ] Responsive mobile (compact)`,
  },

  {
    title: "[ACTIVATION] Email de bienvenue personnalisé par profil psychométrique",
    labels: ["type: feature", "priority: high", "area: profile"],
    body: `## Contexte

L'email de bienvenue actuel est générique. Un Builder doit recevoir un message différent d'un Catalyseur — avec sa première mission recommandée, pas un message générique.

## Objectif

Envoyer un email de bienvenue personnalisé selon le profil assigné après le quiz (Builder / Creator / Strategist / Catalyst).

## Spécifications

**Fichiers à modifier :**
- \`lib/email.ts\`
- \`lib/auth.ts\`
- \`app/actions/quiz.ts\`

**Étapes :**
1. Créer 4 templates dans \`lib/email.ts\` :
   - \`welcomeBuilder(user)\`
   - \`welcomeCreator(user)\`
   - \`welcomeStrategist(user)\`
   - \`welcomeCatalyst(user)\`

   Chaque template contient :
   - Nom du profil + couleur associée
   - 1 phrase sur ce que le profil signifie
   - Lien direct vers la première mission recommandée
   - CTA : "Complète ta première mission →"

2. Dans \`lib/auth.ts\` (hook \`user.created\`) :
   - Si \`user.class\` est défini → envoyer le template correspondant
   - Si \`user.class\` est null (avant quiz) → envoyer email générique "Quiz en attente"

3. Dans \`app/actions/quiz.ts\` (post-quiz) :
   - Déclencher l'email personnalisé une fois le profil assigné

## Critères d'acceptation
- [ ] Un Builder reçoit un email différent d'un Catalyst
- [ ] L'email contient un lien direct vers une mission INIT adaptée au profil
- [ ] Si le quiz n'est pas encore fait au signup, un email de relance est envoyé post-quiz
- [ ] Les 4 templates sont testés avec Resend en staging`,
  },

  {
    title: "[GROWTH] Boutons de partage natifs (LinkedIn, Twitter/X, WhatsApp) sur les résultats quiz",
    labels: ["type: feature", "priority: high", "area: profile"],
    body: `## Contexte

Le résultat du quiz est le moment de plus forte émotion dans le parcours utilisateur. Seul un lien WhatsApp est disponible. LinkedIn et Twitter/X manquent — c'est du trafic viral gratuit non capté.

## Objectif

Ajouter des boutons de partage natifs LinkedIn, Twitter/X et WhatsApp avec un lien "Copier" sur la page de résultats quiz.

## Spécifications

**Fichiers à modifier :**
- \`components/quiz/result-scores.tsx\`

**Implémentation :**
\`\`\`typescript
const profileUrl = \`\${process.env.NEXT_PUBLIC_APP_URL}/u/\${user.pseudo}\`
const text = \`Je viens de découvrir mon profil HASHCODE : \${profileType} (\${topScore}%). Découvre le tien :\`

const linkedinUrl = \`https://www.linkedin.com/sharing/share-offsite/?url=\${encodeURIComponent(profileUrl)}\`
const twitterUrl = \`https://twitter.com/intent/tweet?text=\${encodeURIComponent(text)}&url=\${encodeURIComponent(profileUrl)}\`
const whatsappUrl = \`https://wa.me/?text=\${encodeURIComponent(text + ' ' + profileUrl)}\`
\`\`\`

**UI :**
- 3 boutons icônes : LinkedIn (bleu), X (noir), WhatsApp (vert)
- Bouton "Copier le lien" → \`navigator.clipboard.writeText(profileUrl)\` + toast "Lien copié !"
- Ouvrir les liens dans \`target="_blank" rel="noopener noreferrer"\`
- Placer sous la section scores, avant le CTA dashboard

## Critères d'acceptation
- [ ] Les 3 boutons ouvrent le bon réseau avec le bon texte pré-rempli
- [ ] "Copier le lien" fonctionne et affiche un toast de confirmation
- [ ] L'URL partagée pointe vers \`/u/[pseudo]\` (profil public)
- [ ] Fonctionne si \`pseudo\` est null (fallback sur userId)`,
  },

  {
    title: "[COMMUNITY] Feed d'activité landing branché sur données réelles (ActivityLog)",
    labels: ["type: feature", "priority: medium", "area: community"],
    body: `## Contexte

Le feed d'activité sur la landing page utilise des données **simulées**. Un utilisateur qui visite deux fois la page peut s'en apercevoir — cela érode la crédibilité de la promesse "réseau actif".

## Objectif

Brancher le feed sur les vraies données \`ActivityLog\` en base, sans exposer d'informations personnelles.

## Spécifications

**Fichiers à modifier :**
- \`components/landing/activity-feed.tsx\`
- \`app/api/feed/route.ts\` (ou créer \`app/api/public/feed/route.ts\`)

**Étapes :**
1. Créer ou adapter un endpoint public \`GET /api/public/feed\` :
   \`\`\`typescript
   const events = await prisma.activityLog.findMany({
     where: {
       action: { in: ['MISSION_APPROVED', 'SQUAD_CREATED', 'USER_SIGNUP', 'LEVEL_UP'] }
     },
     orderBy: { createdAt: 'desc' },
     take: 20,
     include: { user: { select: { city: true, country: true, class: true } } }
   })
   // Retourner : { action, city, country, class, timestamp } — sans nom ni email
   \`\`\`

2. Dans \`activity-feed.tsx\` :
   - Fetch au mount avec \`useEffect\` + refresh \`setInterval(30000)\`
   - Fallback sur données simulées si API échoue ou retourne < 5 events
   - Formater : "[BUILDER] Mission validée — Dakar · il y a 3 min"

3. Mettre en cache la réponse : \`Cache-Control: public, s-maxage=60\`

## Critères d'acceptation
- [ ] Le feed affiche des événements réels issus de la DB
- [ ] Aucune donnée personnelle (nom, email) n'est exposée
- [ ] Fallback gracieux si la DB est vide ou indisponible
- [ ] Endpoint accessible sans authentification`,
  },

  {
    title: "[UX] État vide du dashboard avec guidance contextuelle (Empty State)",
    labels: ["type: feature", "priority: critical", "area: platform"],
    body: `## Contexte

Le dashboard est vide pour tout nouvel utilisateur sans squad ni mission. Un dashboard vide = anxiété = abandon immédiat. C'est le **principal point de churn au J+0**.

## Objectif

Afficher un composant de guidance contextuel sur le dashboard quand l'utilisateur n'a pas encore de squad, de profil complet, ou de mission soumise.

## Spécifications

**Fichiers à modifier :**
- \`app/dashboard/page.tsx\`

**Nouveau fichier :**
- \`components/dashboard/empty-state-guide.tsx\`

**Logique de détection :**
\`\`\`typescript
const hasCompletedProfile = !!user.pseudo && !!user.country
const hasSquad = !!squadMember
const hasSubmission = submissions.length > 0
const showGuide = !hasCompletedProfile || !hasSquad || !hasSubmission
\`\`\`

**UI — 3 cards d'action :**
1. "Complète ton profil" → pseudo, photo, GitHub → lien \`/settings\`
2. "Rejoins une escouade" → lien \`/squad\`
3. "Lance ta première mission" → lien \`/missions\`

Chaque card :
- Icône + titre + 1 ligne de description + bouton CTA
- Card complétée = fond vert + checkmark (état calculé dynamiquement)

**Placement :** en haut du dashboard, au-dessus du neural feed.

**Masquage :** automatique quand les 3 conditions sont remplies.

## Critères d'acceptation
- [ ] Visible au J+0 pour tout nouvel utilisateur
- [ ] Chaque card se marque "complétée" dynamiquement sans rechargement
- [ ] Disparaît automatiquement quand les 3 étapes sont faites
- [ ] Responsive — cards en colonne sur mobile
- [ ] Aucun test existant cassé`,
  },

  // ─── SEMAINE 2 — FTUE complet & Rétention early ────────────────────────────

  {
    title: "[ACTIVATION] Checklist d'activation persistante post-quiz (Onboarding Step Tracker)",
    labels: ["type: feature", "type: db-schema", "priority: high", "area: platform"],
    body: `## Contexte

Il n'existe aucun système guidant l'utilisateur étape par étape après le quiz. Le taux d'activation est estimé à ~30%. La checklist est le système durable au-delà de l'état vide (#5).

## Objectif

Afficher une checklist d'activation persistante dans le dashboard jusqu'à ce que l'utilisateur ait complété les 4 étapes fondamentales.

## Spécifications

**Migration Prisma :**
\`\`\`prisma
model User {
  // Ajouter :
  onboardingStep Int @default(0) // 0=quiz, 1=profile, 2=squad, 3=mission, 4=done
}
\`\`\`
Commande : \`npx prisma migrate dev --name add-onboarding-step\`

**Nouveau fichier :**
- \`components/dashboard/activation-checklist.tsx\`

**4 étapes :**
| Étape | Condition | XP affiché |
|-------|-----------|-----------|
| ✅ Profil découvert | Quiz complété (toujours true) | — |
| ☐ Infos complètes | pseudo + country définis | +25 XP |
| ☐ Rejoindre une escouade | member record existe | +50 XP |
| ☐ Première mission | 1 submission APPROVED | +100 XP |

**Mise à jour de \`onboardingStep\` dans les routes :**
- \`/api/user/update\` → step 2
- \`/api/squad/join\` et \`/api/squad/create\` → step 3
- \`/api/admin/submissions/[id]\` (approval) → step 4

**Comportement :**
- Rétractable mais non supprimable avant step 4
- Masqué définitivement quand \`onboardingStep >= 4\`
- Afficher les XP rewards attendus pour motiver

## Critères d'acceptation
- [ ] Migration Prisma créée et appliquée
- [ ] La checklist est visible pour tous les users avec \`onboardingStep < 4\`
- [ ] Chaque step se coche automatiquement sans rechargement de page
- [ ] \`onboardingStep\` est mis à jour dans toutes les routes concernées
- [ ] Tests mis à jour pour couvrir la progression de l'onboardingStep`,
  },

  {
    title: "[RETENTION] Emails de rétention automatiques via QStash (J+1, J+3, Squad decay)",
    labels: ["type: feature", "priority: high", "area: platform"],
    body: `## Contexte

Sans rappel automatique, les utilisateurs oublient la plateforme. QStash est déjà configuré dans \`lib/qstash.ts\`. Il faut l'exploiter pour les moments critiques de désengagement.

## Objectif

Envoyer des emails de rétention automatiques aux moments où le risque de churn est le plus élevé.

## Spécifications

**Fichiers à modifier :**
- \`lib/email.ts\`
- \`app/api/internal/cron/check-activity/route.ts\`

**Nouveau fichier :**
- \`app/api/internal/cron/squad-alerts/route.ts\`

**3 templates à créer dans \`lib/email.ts\` :**
1. \`emailCheckinReminder(user)\` — check-in manqué depuis 48h
   - Objet : "Ta squad a besoin de toi aujourd'hui"
   - Corps : streak actuel + cohésion squad + CTA check-in

2. \`emailFirstMissionReminder(user)\` — 0 mission après 3 jours
   - Objet : "Ta première mission t'attend, [Profil]"
   - Corps : mission INIT recommandée par profil + XP disponible

3. \`emailSquadDecayAlert(user, cohesionScore)\` — cohésion < 0.3
   - Objet : "⚠️ Votre escouade perd en cohésion"
   - Corps : score actuel + actions pour remonter

**Logique dans les crons :**
- \`check-activity\` (existant) : ajouter les requêtes pour les cas 1 et 2
- \`squad-alerts\` (nouveau) : requête squads avec \`cohesionScore < 0.3\` → email aux membres

**Respect de l'opt-out :**
- Ajouter \`emailOptOut Boolean @default(false)\` sur \`User\`
- Filtrer \`where: { emailOptOut: false }\` dans toutes les requêtes d'envoi
- Lien unsubscribe dans chaque email

## Critères d'acceptation
- [ ] Les 3 templates sont créés et testés avec Resend en staging
- [ ] Les crons respectent \`emailOptOut\`
- [ ] Chaque email contient un lien unsubscribe fonctionnel
- [ ] Route \`squad-alerts\` protégée par \`CRON_SECRET\`
- [ ] Pas d'envoi en double si plusieurs crons tournent`,
  },

  {
    title: "[UX] Afficher le délai moyen de peer review sur les pages mission",
    labels: ["type: feature", "priority: medium", "area: missions"],
    body: `## Contexte

Après soumission d'une mission, l'utilisateur attend sans savoir combien de temps. Cette incertitude est une source de frustration qui pousse à l'abandon.

## Objectif

Afficher le délai moyen de review (calculé sur les reviews passées) sur la page de chaque mission.

## Spécifications

**Fichiers à modifier :**
- \`app/api/missions/[id]/route.ts\`
- \`app/missions/[id]/page.tsx\`

**Calcul SQL via Prisma raw :**
\`\`\`typescript
const result = await prisma.$queryRaw<[{ avg_hours: number }]>\`
  SELECT AVG(
    EXTRACT(EPOCH FROM (r.created_at - s.created_at)) / 3600
  ) as avg_hours
  FROM mission_review r
  JOIN mission_submission s ON s.id = r.submission_id
  WHERE s.mission_id = \${missionId}
  AND r.created_at > NOW() - INTERVAL '30 days'
\`
const avgReviewHours = result[0]?.avg_hours ?? null
\`\`\`

**Affichage :**
- Si \`avgReviewHours\` disponible : "Délai moyen de review : ~{Math.round(avgReviewHours)}h"
- Si null (pas encore de review) : "Première soumission — délai estimé inconnu"
- Afficher uniquement si statut = PENDING ou avant soumission

## Critères d'acceptation
- [ ] Le délai s'affiche sur la page mission pour les missions avec ≥ 1 review passée
- [ ] La query est limitée aux 30 derniers jours (données fraîches)
- [ ] Pas d'affichage si aucune review n'existe encore
- [ ] Pas d'impact sur les performances (query cachée 1h)`,
  },

  // ─── SEMAINE 3 — Gamification & FOMO ───────────────────────────────────────

  {
    title: "[GAMIFICATION] Étendre le système de badges : passer de 5 à 30+ badges",
    labels: ["type: feature", "priority: high", "area: profile"],
    body: `## Contexte

Le système de badges actuel contient seulement 5 badges (INITIÉ, VÉTÉRAN, PRODUCTIF, SYNCHRO_GOLD, EARLY_ADOPTER). Un utilisateur actif touche le plafond en 2 semaines. Pas de collectionnisme = pas de motivation long terme.

## Objectif

Étendre \`lib/badge-engine.ts\` à 30+ badges organisés en 6 catégories.

## Spécifications

**Fichier à modifier :** \`lib/badge-engine.ts\`

### Catégorie Progression (5 badges)
\`\`\`typescript
LEVEL_3: { label: "Opérateur", condition: user.level >= 3 }
LEVEL_4: { label: "Architecte", condition: user.level >= 4, xp: 0 }
STREAK_7: { label: "Semaine Parfaite", condition: user.streakCount >= 7, xp: 100 }
STREAK_30: { label: "Mois de Feu", condition: user.streakCount >= 30, xp: 500 }
XP_1000: { label: "Millionnaire XP", condition: user.experience >= 1000 }
\`\`\`

### Catégorie Profil (4 badges — un par classe)
\`\`\`typescript
BUILDER_MASTER: missions INIT complétées >= 5 ET class = BUILDER
CREATOR_MASTER: missions INIT complétées >= 5 ET class = CREATOR
STRATEGIST_MASTER: missions INIT complétées >= 5 ET class = STRATEGIST
CATALYST_MASTER: missions INIT complétées >= 5 ET class = CATALYST
\`\`\`

### Catégorie Missions (5 badges)
\`\`\`typescript
FIRST_BLOOD: { label: "Première Mission", condition: 1ère mission approuvée }
INIT_COMPLETE: { label: "INIT Maîtrisé", condition: toutes missions INIT approuvées }
CORE_PIONEER: { label: "Core Pioneer", condition: 1ère mission CORE approuvée }
SPEED_RUN: { label: "Speed Runner", condition: mission approuvée < 24h après soumission }
PERFECTIONIST: { label: "Perfectionniste", condition: qualityLevel = EXEMPLARY }
\`\`\`

### Catégorie Squad (5 badges)
\`\`\`typescript
SQUAD_FOUNDER: { label: "Fondateur", condition: a créé une squad }
FULL_SQUAD: { label: "Squad Complète", condition: squad atteint 5 membres }
COHESION_MAX: { label: "Cohésion Max", condition: cohesionScore = 1.0 }
HYPER_LINK: { label: "HYPER_LINK", condition: squad streakCount >= 7 }
SQUAD_VETERAN: { label: "Vétéran", condition: membre squad depuis >= 30j }
\`\`\`

### Catégorie Social (4 badges)
\`\`\`typescript
RECRUITER: { label: "Recruteur", condition: a parrainé >= 1 membre }
AMBASSADOR: { label: "Ambassadeur", condition: a parrainé >= 5 membres }
REVIEWER_BADGE: { label: "Pair-Reviewer", condition: >= 3 peer reviews complétées }
MENTOR: { label: "Mentor", condition: peer review notée utile >= 5 fois }
\`\`\`

### Catégorie Spéciaux (3 badges)
\`\`\`typescript
NIGHT_OWL: { label: "Night Owl", condition: check-in entre 23h et 5h }
COMEBACK: { label: "Comeback", condition: check-in après >= 7j d'absence }
EARLY_ADOPTER: { label: "Early Adopter", condition: existant — beta key }
\`\`\`

**Déclenchement à ajouter dans les routes :**
- \`/api/user/checkin\` → STREAK_*, NIGHT_OWL, COMEBACK, XP_1000
- \`/api/admin/submissions/[id]\` (approval) → FIRST_BLOOD, *_COMPLETE, SPEED_RUN, PERFECTIONIST, *_MASTER
- \`/api/squad/create\` → SQUAD_FOUNDER
- Après 5ème membre squad → FULL_SQUAD

## Critères d'acceptation
- [ ] 30+ badges définis dans \`badge-engine.ts\`
- [ ] Chaque badge a un label, une description et des conditions vérifiables
- [ ] \`checkAndAwardBadges()\` appelé dans toutes les routes listées
- [ ] Notification in-app déclenchée à chaque badge débloqué
- [ ] Badges affichés avec icônes distinctes par catégorie dans le dossier`,
  },

  {
    title: "[COMMUNITY] Leaderboard squads public (sans connexion requise)",
    labels: ["type: feature", "priority: high", "area: community", "area: squad"],
    body: `## Contexte

Il n'existe aucun leaderboard public. Les non-membres ne peuvent pas voir ce qu'ils ratent. Les membres n'ont pas de compétition inter-squads. C'est un moteur de FOMO et de rétention non exploité.

## Objectif

Créer une page \`/leaderboard\` publique (sans inscription) affichant le top 20 des squads par cohésion.

## Spécifications

**Endpoint existant à enrichir :** \`app/api/squad/leaderboard/route.ts\`

**Query à compléter :**
\`\`\`typescript
const squads = await prisma.organization.findMany({
  where: { cohesionScore: { gt: 0 } },
  orderBy: { cohesionScore: 'desc' },
  take: 20,
  include: {
    members: {
      include: { user: { select: { class: true } } }
    }
  }
})
\`\`\`

**Nouveau fichier :** \`app/leaderboard/page.tsx\` (page publique, no session required)

**UI :**
- Header : "Top Escouades · Semaine du {date}"
- Top 3 : podium visuel or/argent/bronze
- Tableau : rang · nom squad · cohésion (%) · streak · phase · profils présents
- Badge "Ta squad" si l'utilisateur est connecté et sa squad est classée
- CTA pour non-membres : "Crée ton escouade"

**SEO & Performance :**
- Page statiquement générée, revalidée toutes les 5 minutes
- \`Cache-Control: public, s-maxage=300\`
- Meta tags : "Classement communautés tech africaines"

**Navigation :**
- Lien dans le footer landing
- Lien dans \`app-sidebar.tsx\`

## Critères d'acceptation
- [ ] Page accessible sans authentification
- [ ] Top 20 squads triées par cohésionScore
- [ ] Podium visuel pour les 3 premières
- [ ] La squad de l'utilisateur connecté est mise en évidence
- [ ] Page indexable par Google (pas de SSR authentifié)`,
  },

  {
    title: "[GAMIFICATION] Widget weekly challenge avec countdown visible sur le dashboard",
    labels: ["type: feature", "priority: medium", "area: missions"],
    body: `## Contexte

Les weekly challenges existent dans \`lib/missions.ts\` (4 missions rotatives par modulo semaine) mais sont **invisibles depuis le dashboard**. Sans urgence visible, ils ne génèrent aucun engagement.

## Objectif

Afficher un widget "Défi de la semaine" avec un countdown en temps réel sur le dashboard.

## Spécifications

**Fichiers à modifier :**
- \`lib/missions.ts\` — exporter \`getCurrentWeeklyChallenge()\`

**Nouveau fichier :** \`components/dashboard/weekly-challenge-widget.tsx\`

**Fonction utilitaire :**
\`\`\`typescript
import { nextMonday } from 'date-fns' // déjà installé

export function getCurrentWeeklyChallenge(): {
  mission: Mission;
  expiresAt: Date;
} {
  const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
  const index = weekNumber % WEEKLY_MISSIONS.length
  const expiresAt = nextMonday(new Date())
  return { mission: WEEKLY_MISSIONS[index], expiresAt }
}
\`\`\`

**Widget UI :**
- Titre : "DÉFI DE LA SEMAINE"
- Nom mission + XP reward en évidence
- Countdown : "Expire dans 2j 14h 33min" (rafraîchi chaque minute via \`useInterval\`)
- Statut : bouton "Relever le défi →" OU badge "✅ Complété" si déjà soumis
- Couleur d'urgence : vert si > 3j, orange si < 3j, rouge si < 24h

**Si déjà complété :** afficher le prochain défi en preview "La semaine prochaine : …"

**Placement :** en haut du dashboard, au-dessus du neural feed.

## Critères d'acceptation
- [ ] Le countdown se rafraîchit chaque minute sans rechargement
- [ ] Le bon challenge s'affiche selon la semaine courante
- [ ] Le statut "Complété" est correct si l'utilisateur a soumis ce challenge
- [ ] L'urgence visuelle change selon le temps restant
- [ ] Widget responsive (compact sur mobile)`,
  },

  // ─── SEMAINE 4 — Croissance & Mobile ───────────────────────────────────────

  {
    title: "[GROWTH] Referral programme avec tracking et récompenses XP",
    labels: ["type: feature", "type: db-schema", "priority: high", "area: community"],
    body: `## Contexte

Le champ \`referralCode\` existe sur \`User\` et est auto-généré au signup, mais il n'est **pas utilisé** pour tracker qui a amené qui ni pour récompenser le parrain. C'est de la croissance virale non activée.

## Objectif

Activer le referral programme complet : tracking de l'origine, récompense XP au parrain, badges ambassadeur.

## Spécifications

**Migration Prisma :**
\`\`\`prisma
model User {
  referredBy    String?   // userId du parrain
  referralCount Int       @default(0)
}
\`\`\`
Commande : \`npx prisma migrate dev --name add-referral-tracking\`

**Fichiers à modifier :**
- \`lib/auth.ts\` — hook \`user.created\`
- \`app/actions/quiz.ts\` — post-quiz trigger
- \`app/api/user/update/route.ts\` ou nouveau \`app/api/internal/referral-reward/route.ts\`
- \`components/settings/\` — afficher le code de parrainage

**Flux :**
1. \`signin-form.tsx\` lit déjà \`?ref=CODE\` et le stocke en cookie
2. Dans \`lib/auth.ts\` (hook \`user.created\`) : trouver le User avec ce referralCode → setter \`referredBy = parrain.id\`
3. Quand le filleul complète le quiz (dans \`app/actions/quiz.ts\`) :
   - \`+50 XP\` au parrain via \`prisma.user.update\`
   - Notification : "Un membre a rejoint grâce à toi !"
   - Incrémenter \`referralCount\` du parrain
   - À 1 filleul → badge RECRUITER ; à 5 → badge AMBASSADOR

**UI dans les settings (nouvel onglet ou section) :**
\`\`\`
Ton code de parrainage : HASHCODE-{CODE}
[Copier mon lien]  →  {APP_URL}/signin?ref={CODE}
Tu as parrainé {n} membre(s)
\`\`\`

## Critères d'acceptation
- [ ] Migration créée et appliquée
- [ ] \`referredBy\` est correctement setté au signup si un cookie \`ref\` existe
- [ ] Le parrain reçoit +50 XP quand son filleul complète le quiz
- [ ] Les badges RECRUITER et AMBASSADOR se débloquent automatiquement
- [ ] Le code de parrainage est visible et copiable dans les settings
- [ ] Pas de boucle infinie (un utilisateur ne peut pas se parrainer lui-même)`,
  },

  {
    title: "[MOBILE] PWA basique — manifest + service worker (installable sur mobile)",
    labels: ["type: feature", "priority: high", "area: platform"],
    body: `## Contexte

HASHCODE est web-only sans PWA. La cible principale est africaine, sur mobile, souvent sur réseau dégradé. Sans PWA : pas d'installation "Add to homescreen", pas d'offline, pas de push notifications futures.

## Objectif

Rendre HASHCODE installable sur Android et iOS via PWA basique.

## Spécifications

**Nouveau fichier :** \`public/manifest.json\`
\`\`\`json
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
\`\`\`

**Fichier à modifier :** \`app/layout.tsx\`
\`\`\`tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#B8FF3B" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
\`\`\`

**Nouveau fichier :** \`public/sw.js\` (service worker minimal)
\`\`\`javascript
const CACHE = 'hashcode-v1'
self.addEventListener('install', e => e.waitUntil(
  caches.open(CACHE).then(c => c.addAll(['/offline.html']))
))
self.addEventListener('fetch', e => {
  if (!navigator.onLine) e.respondWith(caches.match('/offline.html'))
})
\`\`\`

**Nouveau fichier :** \`app/offline.html\` — page minimaliste "Pas de connexion"

**Enregistrement SW :** dans un client component dans \`app/layout.tsx\`

**Icônes :** générer \`icon-192.png\` et \`icon-512.png\` depuis le logo HASHCODE existant

## Critères d'acceptation
- [ ] Chrome mobile affiche "Ajouter à l'écran d'accueil" sur Android
- [ ] L'app installée s'ouvre en mode standalone (sans barre URL)
- [ ] La page \`/offline.html\` s'affiche si l'utilisateur est hors ligne
- [ ] Lighthouse PWA score ≥ 80
- [ ] Les icônes sont nettes sur tous les écrans (192px et 512px)`,
  },

  {
    title: "[UX] Ajouter le light mode — accessibilité en extérieur",
    labels: ["type: feature", "priority: medium", "area: platform"],
    body: `## Contexte

HASHCODE est dark-only. En Afrique subsaharienne, l'usage mobile en extérieur est fréquent — le dark mode sur écran OLED en plein soleil est illisible. \`next-themes\` est déjà installé.

## Objectif

Définir les variables CSS light mode et activer le toggle dans les settings et la sidebar.

## Spécifications

**Fichier à modifier :** \`app/globals.css\`

Toutes les variables CSS sont actuellement définies uniquement dans \`.dark\`. Créer les équivalents dans \`:root\` :

\`\`\`css
:root {
  --background: oklch(0.98 0 0);
  --foreground: oklch(0.09 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.09 0 0);
  --primary: oklch(0.55 0.18 130); /* vert HASHCODE adapté light */
  --primary-foreground: oklch(0.09 0 0);
  --muted: oklch(0.96 0 0);
  --muted-foreground: oklch(0.45 0 0);
  --border: oklch(0.90 0 0);
  --input: oklch(0.90 0 0);
  --ring: oklch(0.55 0.18 130);
  /* ... toutes les variables */
}
\`\`\`

**Autres fichiers à modifier :**
- \`app/layout.tsx\` — vérifier \`<ThemeProvider defaultTheme="dark"\` (conserver le dark par défaut)
- \`components/dashboard/app-sidebar.tsx\` — ajouter toggle icône soleil/lune rapide
- \`components/settings/\` — toggle existant à vérifier/compléter

**Points d'attention :**
- Les glows et neons cyberpunk disparaissent en light → fallback sur borders solides
- Tester : sidebar, cards missions, evolution radar, squad journey, auth form

## Critères d'acceptation
- [ ] Le toggle dans les settings change le thème immédiatement
- [ ] Toggle rapide accessible depuis la sidebar sans aller dans les settings
- [ ] Tous les composants sont lisibles en light mode (pas de texte blanc sur fond blanc)
- [ ] \`localStorage\` retient la préférence utilisateur
- [ ] La préférence système (\`prefers-color-scheme\`) est respectée au premier chargement`,
  },

  // ─── MOIS 2 — Communauté & Preuve de valeur ────────────────────────────────

  {
    title: "[COMMUNITY] Messagerie async dans les squads (fil de discussion interne)",
    labels: ["type: feature", "type: db-schema", "priority: medium", "area: squad", "area: community"],
    body: `## Contexte

Sans communication interne, la coordination des squads se fait sur WhatsApp ou Discord — l'engagement quitte la plateforme. C'est une fuite de rétention majeure.

## Objectif

Ajouter un fil de discussion async simple au sein de chaque squad, accessible depuis \`squad-journey.tsx\`.

## Spécifications

**Migration Prisma :**
\`\`\`prisma
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
\`\`\`
Commande : \`npx prisma migrate dev --name add-squad-messages\`

**Nouveau fichier :** \`app/api/squad/messages/route.ts\`
- \`GET\` : 50 derniers messages (pagination cursor-based)
- \`POST\` : envoyer un message (1–500 chars, rate-limit 10/min via Upstash)
- Auth guard : session + vérification membership

**Modification :** \`components/dashboard/squad-journey.tsx\`
- Ajouter un onglet "Messages" dans le panneau squad
- Fil de messages : avatar + pseudo + contenu + timestamp
- Input fixe en bas + bouton envoyer
- Polling 30 secondes (\`useInterval\`)
- Scroll to bottom automatique sur nouveau message
- Skeleton loading pour le premier chargement

**Notifications :**
- Maximum 1 notification/heure par squad pour éviter le spam
- Utiliser le modèle \`Notification\` existant

**Rétention données :** cron de nettoyage des messages > 90 jours

## Critères d'acceptation
- [ ] Migration créée et appliquée
- [ ] Un membre peut envoyer et recevoir des messages dans sa squad
- [ ] Rate-limit : max 10 messages/min par utilisateur
- [ ] Seuls les membres de la squad voient les messages
- [ ] Messages supprimés après 90 jours (cron)
- [ ] Tests couvrant la route messages (auth, rate-limit, membership check)`,
  },

  {
    title: "[GROWTH] Page recruteur publique — dossiers filtrables sans inscription",
    labels: ["type: feature", "priority: medium", "area: profile", "area: community"],
    body: `## Contexte

La landing promet "le bon profil attire la bonne offre" mais il n'existe aucun endroit où les recruteurs peuvent trouver les profils HASHCODE. La boucle de valeur est incomplète.

## Objectif

Créer une page \`/talent\` publique (sans inscription) où les recruteurs peuvent filtrer les profils validés par missions réelles.

## Spécifications

**Migration Prisma :**
\`\`\`prisma
model User {
  talentVisible Boolean @default(true) // opt-out disponible dans les settings
}
\`\`\`

**Nouveau fichier :** \`app/api/public/talent/route.ts\`
\`\`\`typescript
// Aucune donnée personnelle exposée (pas d'email, pas de nom réel)
const users = await prisma.user.findMany({
  where: {
    class: { not: null },
    pseudo: { not: null },
    talentVisible: true,
    missionsCompletedCount: { gte: 1 }, // validé par au moins 1 mission
  },
  select: {
    pseudo: true, class: true, level: true,
    country: true, city: true,
    builderScore: true, creatorScore: true,
    strategistScore: true, catalystScore: true,
    missionsCompletedCount: true,
    githubUrl: true, portfolioUrl: true,
  },
  orderBy: { missionsCompletedCount: 'desc' },
  take: 50,
})
\`\`\`

**Nouveau fichier :** \`app/talent/page.tsx\`
- Header : "Talents HASHCODE · Profils validés par missions réelles"
- Filtres : Profil (Builder/Creator/Strategist/Catalyst), Pays, Niveau minimum
- Grille de cards : pseudo · profil · niveau · pays · missions complétées · → dossier
- Chaque card → \`/u/[pseudo]\` (dossier public existant)
- CTA recruteur : "Tu recrutes ? Contacte-nous →" (lien /contact)
- Aucune inscription requise

**Toggle opt-out :** dans les settings, section Profil : "Visible par les recruteurs" (coché par défaut)

**SEO :** meta tags "développeurs africains certifiés", "talent tech Afrique"

## Critères d'acceptation
- [ ] Page accessible sans authentification
- [ ] Filtres par profil, pays et niveau fonctionnent
- [ ] \`talentVisible = false\` retire le profil de la liste
- [ ] Aucun email ni nom réel exposé
- [ ] Page indexable par Google
- [ ] Lien dans le footer de la landing`,
  },

  {
    title: "[RETENTION] Recap hebdomadaire email automatique (chaque lundi via QStash)",
    labels: ["type: feature", "priority: medium", "area: platform"],
    body: `## Contexte

Sans récapitulatif, l'utilisateur oublie sa progression d'une semaine sur l'autre. Un email du lundi matin avec ses stats crée un rituel de retour sur la plateforme.

## Objectif

Envoyer chaque lundi un email "Ta semaine HASHCODE" personnalisé avec les stats de la semaine écoulée.

## Spécifications

**Fichiers à modifier :**
- \`lib/email.ts\`

**Nouveau fichier :** \`app/api/internal/cron/weekly-recap/route.ts\`

**Template \`emailWeeklyRecap(user, stats)\` dans \`lib/email.ts\` :**
\`\`\`typescript
interface WeeklyStats {
  xpGained: number
  missionsSubmitted: number
  missionsApproved: number
  squadRank: number | null
  squadRankDelta: number | null // +2 / -1 vs semaine passée
  currentStreak: number
  weeklyChallenge: { title: string; xp: number; completed: boolean }
}
\`\`\`

Contenu email :
- XP gagné cette semaine
- Missions soumises / approuvées
- Rang squad vs semaine précédente
- Streak actuel
- Weekly challenge en cours + XP disponible
- CTA : "Voir mon dossier →"

**Cron \`weekly-recap/route.ts\` :**
- Protéger avec \`CRON_SECRET\`
- Query : users avec \`lastCheckinAt > now() - 30j\` (actifs récemment)
- Calculer les stats via \`ActivityLog\` des 7 derniers jours
- Envoi en batch Resend (max 100 emails/sec, gérer le rate-limit)
- Respecter \`emailOptOut\`

**Déclenchement :** QStash, chaque lundi 9h00 UTC

**Unsubscribe :** lien JWT dans chaque email → \`GET /api/user/email-prefs?action=unsubscribe&token={jwt}\`

## Critères d'acceptation
- [ ] Email envoyé uniquement aux utilisateurs actifs (lastCheckinAt < 30j)
- [ ] Stats correctement calculées depuis \`ActivityLog\`
- [ ] Lien unsubscribe fonctionnel
- [ ] Route protégée par CRON_SECRET
- [ ] Pas de doublon si le cron est déclenché deux fois`,
  },
];

async function createLabelsIfMissing(): Promise<void> {
  const needed = [
    { name: "ux-product", color: "0ea5e9", description: "UX, Product, Activation, Rétention" },
  ];
  for (const label of needed) {
    try {
      execSync(
        `gh label create "${label.name}" --color "${label.color}" --description "${label.description}"`,
        { stdio: "ignore" }
      );
    } catch {
      // Label existe déjà — OK
    }
  }
}

async function main() {
  console.log("🚀 Publication des issues HASHCODE — Roadmap Produit & UX\n");

  try {
    execSync("gh --version", { stdio: "ignore" });
  } catch {
    console.error("❌ CLI GitHub 'gh' non installée. Installez-la : winget install GitHub.cli");
    process.exit(1);
  }

  try {
    execSync("gh auth status", { stdio: "ignore" });
  } catch {
    console.error("❌ CLI GitHub non authentifiée. Lancez : gh auth login");
    process.exit(1);
  }

  console.log("✓ CLI GitHub détectée et authentifiée.");

  await createLabelsIfMissing();

  console.log(`📋 ${ISSUES.length} issues prêtes...\n`);

  const tempDir = path.join(process.cwd(), ".temp_issues");
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const created: string[] = [];

  try {
    for (let i = 0; i < ISSUES.length; i++) {
      const issue = ISSUES[i];
      console.log(`⏳ [${i + 1}/${ISSUES.length}] "${issue.title}"`);

      const tempFile = path.join(tempDir, `issue_${i}.md`);
      fs.writeFileSync(tempFile, issue.body, "utf-8");

      const url = execFileSync(
        "gh",
        [
          "issue", "create",
          "--title", issue.title,
          "--body-file", tempFile,
          "--label", issue.labels.join(","),
        ],
        { encoding: "utf-8" }
      ).trim();
      created.push(url);
      console.log(`   ✓ ${url}\n`);

      // Pause légère pour éviter le rate-limit GitHub
      await new Promise((r) => setTimeout(r, 500));
    }

    console.log(`\n🎉 ${created.length} issues créées avec succès !`);
    console.log("\nRécapitulatif :");
    created.forEach((url, i) => console.log(`  ${i + 1}. ${url}`));
  } catch (error: any) {
    console.error("❌ Erreur lors de la création d'une issue :");
    console.error(error.message);
  } finally {
    if (fs.existsSync(tempDir)) {
      fs.readdirSync(tempDir).forEach((f) => fs.unlinkSync(path.join(tempDir, f)));
      fs.rmdirSync(tempDir);
    }
  }
}

main();
