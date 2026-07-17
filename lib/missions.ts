import { getWeekNumber } from "./dates"

export type MissionLevel = 1 | 2 | 3 | 4;
export type MissionType = "CODE" | "DESIGN" | "BUSINESS" | "NETWORK" | "GENERAL" | "INTRO";
export type UserProfile = "builder" | "creator" | "strategist" | "catalyst";
export type ProgressionLevel = "INIT" | "CORE" | "PRO";

export interface Mission {
  id: string;
  slug?: string;
  title: string;
  description: string;
  shortDesc: string;
  xpReward: number;
  requiredLevel: MissionLevel;
  targetLevel: MissionLevel;
  requirements: string[];
  type: MissionType;
  // Profil Vivant fields
  targetProfiles: UserProfile[];
  missionLevel: ProgressionLevel;
  duration?: string;
  weightBuilder?: number;
  weightCreator?: number;
  weightStrategist?: number;
  weightCatalyst?: number;
  comingSoon?: boolean;
  // Extra DB fields
  deliverables?: string[];
  fullBriefing?: string;
  submissionMethod?: "ANY_LINK" | "TEXT_RESPONSE" | "LIVE_URL" | "DOCUMENT_LINK" | "GITHUB_LINK";
}

export const MISSIONS: Mission[] = [
  {
    id: "introduction-ancrage",
    title: "Ancrage Initial",
    shortDesc: "Pose ton identité dans la communauté.",
    description: "Avant toute chose, présente-toi. Qui es-tu, qu'est-ce que tu construis, et où veux-tu aller dans les 3 prochains mois ?",
    xpReward: 25,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Décris ce que tu construis en une phrase.",
      "Partage ton objectif principal pour les 3 prochains mois."
    ],
    type: "INTRO",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "30min",
    weightBuilder: 0.1,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.7,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Bio du profil", "Objectif principal à 3 mois"],
    fullBriefing: `
# Mission : Ancrage Initial

Bienvenue dans la communauté HASHCODE. Avant toute chose, présente-toi. Qui es-tu, qu'est-ce que tu construis, et où veux-tu aller dans les 3 prochains mois ?

### Instructions
1. Décris ce que tu construis en une phrase percutante.
2. Partage ton objectif principal pour les 3 prochains mois.
3. Rédige une courte bio (2-3 lignes) qui sera affichée sur ton profil.

### Critères de validation
- Réponse claire et structurée.
- Objectif SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporel).
    `
  },
  {
    id: "premiere-preuve-maitrise",
    title: "Première Preuve de Maîtrise",
    shortDesc: "Ton premier livrable concret, adapté à ton profil.",
    description: "HASHCODE n'est pas un réseau de déclarations d'intention. C'est un réseau de preuves. Produis ton premier livrable concret selon les standards de ta guilde.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: [
      "Un livrable public correspondant à ton profil (lien requis).",
      "2-3 lignes expliquant ce que tu as voulu prouver.",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "3h",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers ton livrable", "Explication de ce que tu as voulu prouver (2-3 lignes)"],
    fullBriefing: `## Contexte
HASHCODE n'est pas un réseau de déclarations d'intention. C'est un réseau de preuves. Chaque profil a ses standards — cette mission te demande de respecter les tiens.

## Objectif
Produire un premier livrable concret, public et personnel, selon les critères de ta guilde.

## Étapes suggérées par guilde

🛠️ **Builders** — Partage un projet personnel avec un repo GitHub public :
1. Crée ou prépare un repo avec un README qui explique ce que fait le projet et comment le lancer
2. Assure-toi d'avoir minimum 5 commits réels (pas un seul "initial commit")
3. Le code doit être fonctionnel sur la branche main

🎨 **Creators** — Publie un contenu original lié à ton domaine :
1. Rédige un article, crée une vidéo, un design ou une série de posts
2. Publie-le sur une plateforme publique (blog, Medium, LinkedIn, Behance, YouTube…)
3. Le contenu doit être ta propre création (pas un repost ni de la curation)

🧠 **Strategists** — Rédige une analyse d'une page sur un marché ou une opportunité :
1. Identifie le problème, les acteurs en présence et ton angle d'attaque
2. Inclus au moins une donnée chiffrée avec sa source
3. Termine par une conclusion actionnable (pas juste descriptive)

🗣️ **Catalysts** — Documente une mise en relation ou une connexion que tu as créée :
1. Présente le contexte : qui, pourquoi, comment tu les as connectés
2. Décris le résultat concret de cette connexion
3. Obtiens un témoignage ou une confirmation d'au moins une des parties

## Critères d'acceptation
- Le livrable correspond au profil déclaré
- Le travail est clairement personnel (non généré, non copié)
- L'objectif spécifique à la guilde est atteint selon les critères ci-dessus`
  },
  {
    id: "core-transmission-savoir",
    title: "Transmission de Savoir",
    shortDesc: "Enseigne ce que tu sais. Solidifie ce que tu maîtrises.",
    description: "Rédige un tutoriel, un guide ou un article qui enseigne quelque chose de concret dans ton domaine. Publie-le publiquement et partage-le dans la communauté.",
    xpReward: 200,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: [
      "Un contenu pédagogique publié publiquement (article, guide, vidéo, thread).",
      "Le contenu doit enseigner une compétence ou un concept précis.",
      "Lien vers la publication.",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "2-3h",
    weightBuilder: 0.25,
    weightCreator: 0.30,
    weightStrategist: 0.25,
    weightCatalyst: 0.20,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers le contenu publié", "En une phrase : ce que le lecteur/spectateur apprend"],
    fullBriefing: `## Contexte
Enseigner est la meilleure façon de valider une maîtrise. Si tu ne peux pas l'expliquer simplement, tu ne le comprends pas vraiment. Cette mission te demande de produire un contenu pédagogique réel — pas un résumé générique, mais quelque chose d'utile pour quelqu'un qui apprend.

## Objectif
Publier un contenu qui enseigne une compétence ou un concept précis dans ton domaine, adapté à ton profil.

## Le contenu doit être
- **Ciblé** : une seule compétence ou un seul concept, pas un survol général
- **Actionnable** : le lecteur peut appliquer ce qu'il apprend immédiatement
- **Original** : ta perspective, ton expérience, pas un copier-coller de documentation

## Formats acceptés par Guilde

🛠️ **Builders** — Tutoriel technique :
1. Choisis une librairie, un pattern ou un concept que tu maîtrises
2. Écris un tutoriel étape par étape avec exemples de code réels (GitHub Gist, article, README)
3. Teste le tutoriel sur un projet vierge pour confirmer qu'il fonctionne

🎨 **Creators** — Guide visuel ou template :
1. Crée un guide visuel (Figma, Canva, PDF) ou un template réutilisable
2. Inclus une explication de tes choix (pourquoi ce layout, cette palette, cette typo)
3. Publie sur Behance, Notion, ou un lien public

🧠 **Strategists** — Framework ou playbook :
1. Formalise un process ou un cadre de décision que tu utilises
2. Structure-le en étapes claires avec des exemples concrets
3. Publie sur Notion, LinkedIn ou Medium

🗣️ **Catalysts** — Case study communautaire :
1. Documente comment tu as lancé, développé ou animé une communauté ou un groupe
2. Partage les tactiques qui ont fonctionné et celles qui ont échoué
3. Publie sous forme d'article ou de thread LinkedIn/X

## Critères d'acceptation
- Le contenu est publié et accessible via un lien
- Il enseigne quelque chose de précis (pas un survol)
- Il est clairement le tien (ton expérience, ton angle)`
  },
  {
    id: "uni-02-audit-teardown",
    title: "Le Diagnostic : Audit de l'Existant",
    shortDesc: "Analyser pour mieux reconstruire.",
    description: "Prends un projet open-source, le site d'une entreprise locale, ou un de tes anciens projets, et audite-le sous le prisme de ta Guilde.",
    xpReward: 300,
    requiredLevel: 3,
    targetLevel: 3,
    requirements: ["Le lien vers le projet audité.", "Un rapport contenant 3 problèmes identifiés et 3 solutions proposées."],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "3h",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Lien du rapport d'audit (Notion, PDF ou GitHub Gist)"],
    fullBriefing: `
# Mission Universelle 02 : Le Diagnostic

Les meilleurs professionnels savent lire l'existant avant de créer du nouveau. Choisis un projet numérique existant (site web, app, repo open-source) et réalise un audit complet.

### L'angle d'attaque de ta Guilde :
* 🛠️ **Builders :** Fais un audit de la dette technique ou de la sécurité. Pointe les vulnérabilités (XSS, Auth faible) ou les requêtes lentes, et propose une refonte architecturale.
* 🎨 **Creators :** Fais un audit UX/UI. Quels sont les points de friction ? L'accessibilité est-elle respectée ? Propose un wireframe ou un nouveau design system pour réparer ça.
* 🧠 **Strategists :** Fais un audit du Business Model et du Funnel de conversion. Où perdent-ils des clients ? Propose une stratégie Go-To-Market ou de rétention ambitieuse et orientée impact.
* 🗣️ **Catalysts :** Fais un audit du positionnement communautaire et de la marque. Leur communication est-elle plate ? Propose une stratégie de création de contenu et de distribution virale.

### Critères de validation
- Le rapport doit être lisible, clair, et aller droit au but (pas de blabla).
- Les solutions proposées doivent être réalistes et actionnables.
    `
  },
  {
    id: "h1-solve-real-problem",
    title: "Résoudre un problème réel",
    shortDesc: "Passe de l'idée à la solution concrète.",
    description: "Identifie un problème concret dans ton environnement et apporte une solution adaptée à ton profil.",
    xpReward: 200,
    requiredLevel: 2,
    targetLevel: 3,
    requirements: [
      "Description du problème réel observé (contexte précis).",
      "Preuve de ta solution : lien, document ou description détaillée.",
      "Résultat obtenu ou attendu avec indicateur mesurable.",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "1 semaine",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "ANY_LINK",
    deliverables: ["Description du problème", "Lien ou document de ta solution", "Résultat / impact mesuré"],
    fullBriefing: `## Contexte
Les meilleurs acteurs tech ne résolvent pas des exercices — ils résolvent de vrais problèmes. Cette mission valide ta capacité à identifier une friction réelle et à passer à l'action.

## Objectif
Trouver un problème concret dans ton environnement, produire une solution adaptée à ton profil, et documenter l'impact.

## Le problème doit être réel
- Quelque chose que tu as observé ou vécu (pas un cas fictif ou générique)
- Une vraie friction : process manuel, manque d'information, frustration récurrente
- Contexte précis : ta ville, ton école, ton secteur, ta communauté, ton équipe

## Étapes suggérées par guilde

🛠️ **Builders** — Développe un outil ou un script qui automatise ou résout le problème. Même petit, même basique — mais fonctionnel, avec le code partagé et le problème expliqué dans le README.

🎨 **Creators** — Crée un contenu (guide visuel, vidéo explicative, template) qui résout un problème de communication ou d'accès à l'information. Mesure l'engagement ou le feedback reçu.

🧠 **Strategists** — Rédige un plan d'action structuré avec des étapes concrètes, des ressources nécessaires et un indicateur de succès. Le plan doit être assez précis pour être exécutable par quelqu'un d'autre.

🗣️ **Catalysts** — Mobilise les bonnes personnes autour du problème et documente les premières étapes d'une initiative collective : qui tu as contacté, comment, et quelle réponse tu as obtenu.

## Critères d'acceptation
- Le problème est réel et le contexte est précis (pas générique)
- La solution est concrète et adaptée au profil déclaré
- L'impact est décrit, même modeste — un chiffre, un témoignage, un avant/après`
  }
];

export interface WeeklyChallenge {
  id: string;
  title: string;
  shortDesc: string;
  xp: number;
  type: MissionType;
  submissionMethod: Mission["submissionMethod"];
  targetProfiles: UserProfile[];
  weeklySlot: number | null;
}

export const WEEKLY_CHALLENGES: WeeklyChallenge[] = [
  {
    id: "weekly-share-resource",
    title: "Partage une ressource",
    shortDesc: "Un article, une vidéo, un outil qui t'a été utile cette semaine.",
    xp: 30,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: null,
  },
  {
    id: "weekly-tech-problem",
    title: "Un problème, une idée",
    shortDesc: "Décris un problème tech que tu observes dans ton environnement.",
    xp: 25,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "strategist"],
    weeklySlot: null,
  },
  {
    id: "weekly-share-project",
    title: "Montre ton travail",
    shortDesc: "Partage le lien d'un projet ou commit récent. Peu importe la taille.",
    xp: 35,
    type: "CODE",
    submissionMethod: "GITHUB_LINK",
    targetProfiles: ["builder", "creator"],
    weeklySlot: null,
  },
  {
    id: "weekly-squad-checkin",
    title: "Check-in squad",
    shortDesc: "Fais un check-in quotidien avec ton squad pour maintenir la cohésion.",
    xp: 20,
    type: "GENERAL",
    submissionMethod: "TEXT_RESPONSE",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    weeklySlot: null,
  },
];

export function getCurrentWeeklyChallenge(): WeeklyChallenge {
  const weekNumber = getWeekNumber(new Date());
  return WEEKLY_CHALLENGES[weekNumber % WEEKLY_CHALLENGES.length];
}

export function getCurrentCycleKey(mission?: { isWeeklyChallenge: boolean }): string {
  if (!mission || !mission.isWeeklyChallenge) return "PERMANENT";
  const now = new Date();
  const year = now.getFullYear();
  const week = getWeekNumber(now);
  return `${year}-W${week.toString().padStart(2, '0')}`;
}
