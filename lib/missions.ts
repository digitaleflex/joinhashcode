export type MissionLevel = 1 | 2 | 3 | 4;
export type MissionType = "CODE" | "DESIGN" | "BUSINESS" | "NETWORK" | "GENERAL" | "INTRO";
export type UserProfile = "builder" | "creator" | "strategist" | "catalyst";
export type ProgressionLevel = "INIT" | "CORE" | "PRO";

export interface Mission {
  id: string;
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
  submissionMethod?: "ANY_LINK" | "TEXT_RESPONSE" | "LIVE_URL" | "DOCUMENT_LINK" | "GITHUB_REPO";
}

export const MISSIONS: Mission[] = [
  // --- MISSIONS GÉNÉRIQUES / INTRO ---
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
    id: "social-connection-protocol",
    title: "Protocole de Connexion Globale",
    shortDesc: "Rejoins le réseau neuronal de HASHCODE.",
    description: "La force de HASHCODE réside dans sa communauté. Rejoins nos canaux officiels : Telegram, Discord et WhatsApp.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Rejoindre le canal Telegram et renseigner ton pseudo (@mon_pseudo).",
      "Rejoindre le serveur Discord et renseigner ton pseudo.",
      "Rejoindre le groupe WhatsApp et renseigner ton numéro de téléphone."
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "15min",
    weightBuilder: 0.0,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.8,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Pseudo Telegram", "Pseudo Discord", "Numéro WhatsApp"],
    fullBriefing: `
# Mission : Protocole de Connexion Globale

La force de HASHCODE réside dans son intelligence collective. Pour ne rien manquer et commencer à collaborer, tu dois intégrer nos canaux de communication.

### Instructions
1. Rejoins le canal Telegram **@innovcode** pour les annonces officielles.
2. Intègre le serveur **Discord officiel** pour les échanges techniques et créatifs.
3. Rejoins le **groupe WhatsApp** de ta cohorte ou communauté locale.

### Critères de validation
- Confirmation de ton identifiant sur ces plateformes.
    `
  },

  // --- MISSIONS ACTIVATION (communautaires, disponibles au lancement) ---
  {
    id: "profil-complet",
    title: "Dossier Opérationnel",
    shortDesc: "Complète ton profil pour activer ta présence sur le réseau.",
    description: "Ton dossier est ton identité sur HASHCODE. Remplis ta bio, ajoute tes liens et précise tes objectifs pour être visible des autres membres.",
    xpReward: 50,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Remplir ta bio dans les paramètres.",
      "Ajouter au moins un lien externe (GitHub, LinkedIn ou portfolio).",
    ],
    type: "INTRO",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "15min",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Capture d'écran de ton profil complété"],
    fullBriefing: `
# Mission : Dossier Opérationnel

Ton profil HASHCODE est ta carte d'identité dans la communauté. Sans lui, tu es invisible. C'est la première mission que chaque agent doit accomplir.

### Instructions
1. Va dans **Paramètres → Identité** et remplis ta bio (minimum 2 lignes).
2. Ajoute au moins **un lien externe** : GitHub, LinkedIn, portfolio ou tout autre lien professionnel.
3. Vérifie que ton pseudo est unique et mémorisable.

### Critères de validation
- Bio remplie et cohérente avec ton profil.
- Au moins un lien externe valide.
    `
  },
  {
    id: "squad-genesis",
    title: "Genèse du Squad",
    shortDesc: "Rejoins ou crée ton premier squad pour ne pas avancer seul.",
    description: "Sur HASHCODE, on ne build pas en solo. Crée ton squad ou rejoins celui d'un membre via son lien d'invitation. Ensemble, votre cohésion monte plus vite.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Créer un squad via la page Squad, ou rejoindre un squad existant via un lien d'invitation.",
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "10min",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Nom de ton squad ou lien d'invitation utilisé"],
    fullBriefing: `
# Mission : Genèse du Squad

Sur HASHCODE, personne ne build seul. Un squad, c'est ton unité de combat : 5 agents synchronisés qui progressent ensemble, partagent leurs ressources et décuplent leur impact.

### Instructions
**Option A — Créer ton squad :**
1. Va sur la page **Squad** dans le menu de navigation.
2. Clique sur **"Initialiser le protocole"**.
3. Personnalise le nom et le lien d'invitation de ton squad (si tu es Leader).

**Option B — Rejoindre un squad :**
1. Obtiens un lien d'invitation d'un membre de la communauté.
2. Clique sur le lien et accepte l'invitation.

### Critères de validation
- Être membre actif d'un squad (créé ou rejoint).
    `
  },
  {
    id: "invite-pioneer",
    title: "Recrutement Pioneer",
    shortDesc: "Invite le premier membre de ton réseau dans la communauté.",
    description: "Les meilleures communautés grandissent par cooptation. Partage ton lien d'invite personnel et accueille un premier bâtisseur dans HASHCODE.",
    xpReward: 75,
    requiredLevel: 1,
    targetLevel: 1,
    requirements: [
      "Partager ton lien d'invite (disponible sur la page Squad).",
      "Un nouveau membre rejoint HASHCODE via ton lien.",
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "5min",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Pseudo du membre que tu as invité"],
    fullBriefing: `
# Mission : Recrutement Pioneer

Chaque grand réseau a commencé par une première invitation. Tu es l'un des pionniers de HASHCODE — c'est à toi de faire grandir la tribu.

### Instructions
1. Va sur la page **Squad** et copie ton lien d'invitation personnel.
2. Envoie-le à quelqu'un de ton réseau qui mérite de rejoindre HASHCODE (développeur, designer, entrepreneur, marketer, etc.).
3. Attends qu'il crée son compte via ton lien.

### Critères de validation
- Un membre rejoint HASHCODE via ton lien d'invitation unique.
- Note le pseudo de ce nouveau membre pour valider ta mission.
    `
  },

  // --- BUILDER MISSIONS ---
  {
    id: "b1-first-commit",
    title: "Premier Commit",
    shortDesc: "Prouve ton engagement en partageant ton code.",
    description: "Ton premier test : montre-nous ce que tu construis techniquement.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Lien GitHub avec README + description du projet"],
    type: "CODE",
    targetProfiles: ["builder"],
    missionLevel: "INIT",
    duration: "2h",
    weightBuilder: 1.0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 0,
    comingSoon: true
  },
  {
    id: "b2-deploy-prod",
    title: "Deploy en production",
    shortDesc: "Rends ton projet accessible au monde.",
    description: "Un code qui n'est pas en ligne n'existe pas. Déploie ton application.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["URL live fonctionnelle + screenshot"],
    type: "CODE",
    targetProfiles: ["builder"],
    missionLevel: "INIT",
    duration: "3h",
    weightBuilder: 1.0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 0,
    comingSoon: true
  },
  {
    id: "b3-solve-bug",
    title: "Résoudre un vrai bug",
    shortDesc: "Démontre tes capacités de diagnostic.",
    description: "Identifie et corrige un bug complexe dans un de tes projets ou un projet open source.",
    xpReward: 200,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["Lien PR + explication du diagnostic"],
    type: "CODE",
    targetProfiles: ["builder"],
    missionLevel: "CORE",
    duration: "4h",
    weightBuilder: 1.0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 0,
    comingSoon: true
  },

  // --- CRÉATEUR MISSIONS ---
  {
    id: "c1-first-publication",
    title: "Première publication",
    shortDesc: "Partage ton univers avec le monde.",
    description: "Publie un contenu original (article, post, vidéo) lié à ton expertise.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Lien vers l'article/post/vidéo publiée"],
    type: "DESIGN",
    targetProfiles: ["creator"],
    missionLevel: "INIT",
    duration: "2h",
    weightBuilder: 0,
    weightCreator: 1.0,
    weightStrategist: 0,
    weightCatalyst: 0,
    comingSoon: true
  },
  {
    id: "c2-visual-identity",
    title: "Identité visuelle d'un projet",
    shortDesc: "Donne une âme graphique à une idée.",
    description: "Crée le logo, la palette de couleurs et la typographie pour un nouveau projet.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Fichier Figma ou PDF avec logo, couleurs, typo"],
    type: "DESIGN",
    targetProfiles: ["creator"],
    missionLevel: "INIT",
    duration: "4h",
    weightBuilder: 0,
    weightCreator: 1.0,
    weightStrategist: 0,
    weightCatalyst: 0,
    comingSoon: true
  },

  // --- STRATÈGE MISSIONS ---
  {
    id: "s1-market-analysis",
    title: "Analyser un marché en 1 page",
    shortDesc: "Identifie les opportunités business.",
    description: "Rédige une analyse concise d'un marché : problème, acteurs, opportunité.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Document structuré (problème, acteurs, opportunité)"],
    type: "BUSINESS",
    targetProfiles: ["strategist"],
    missionLevel: "INIT",
    duration: "3h",
    weightBuilder: 0,
    weightCreator: 0,
    weightStrategist: 1.0,
    weightCatalyst: 0,
    comingSoon: true
  },
  {
    id: "s2-mvp-definition",
    title: "Définir le MVP d'une idée",
    shortDesc: "Sépare l'essentiel du superflu.",
    description: "Crée la fiche produit de ton idée : problème, cible, 3 features max.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Fiche produit complète"],
    type: "BUSINESS",
    targetProfiles: ["strategist"],
    missionLevel: "INIT",
    duration: "2h",
    weightBuilder: 0,
    weightCreator: 0,
    weightStrategist: 1.0,
    weightCatalyst: 0,
    comingSoon: true
  },

  // --- CATALYSEUR MISSIONS ---
  {
    id: "k1-introduction",
    title: "Introduire 2 personnes",
    shortDesc: "Crée de la valeur par la mise en relation.",
    description: "Connecte deux membres de la communauté qui peuvent s'apporter mutuellement.",
    xpReward: 100,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Témoignage des 2 personnes + contexte"],
    type: "NETWORK",
    targetProfiles: ["catalyst"],
    missionLevel: "INIT",
    weightBuilder: 0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 1.0,
    comingSoon: true
  },
  {
    id: "k2-organize-event",
    title: "Organiser un événement",
    shortDesc: "Rassemble la communauté.",
    description: "Organise un petit événement (meetup, call, atelier) pour HASHCODE.",
    xpReward: 150,
    requiredLevel: 1,
    targetLevel: 2,
    requirements: ["Recap avec photos + liste participants"],
    type: "NETWORK",
    targetProfiles: ["catalyst"],
    missionLevel: "INIT",
    duration: "4h",
    weightBuilder: 0,
    weightCreator: 0,
    weightStrategist: 0,
    weightCatalyst: 1.0,
    comingSoon: true
  },

  // --- MISSIONS UNIVERSELLES ---
  {
    id: "uni-01-portfolio-launch",
    title: "Mise en Orbite : Le Portfolio Actif",
    shortDesc: "Prouve ta valeur en publiant ton espace personnel en ligne.",
    description: "Le monde doit savoir qui tu es. Déploie un site web personnel (portfolio, blog, ou landing page) et prouve ton expertise selon les standards de ta Guilde.",
    xpReward: 250,
    requiredLevel: 2,
    targetLevel: 2,
    requirements: ["URL publique et fonctionnelle.", "Validation de l'objectif spécifique à ta Guilde."],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "4h",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "LIVE_URL",
    deliverables: ["URL du projet", "Explication de ton choix de guilde (2 lignes)"],
    fullBriefing: `
# Mission Universelle 01 : Mise en Orbite

Un profil Hashcode n'est rien sans preuve de travail. Ta première mission est de déployer un espace personnel en ligne (Portfolio ou Landing Page).
Cependant, l'évaluation dépendra de la Guilde que tu as rejointe.

### Objectifs par Guilde (Choisis celui de ton profil) :
* 🛠️ **Guilde des Builders :** Le design n'a pas d'importance. Prouve-nous que ton code est propre. Déploie via Vercel/Railway, mets en place ton repo GitHub proprement, et obtiens un score Lighthouse de 90+ en performance.
* 🎨 **Guilde des Creators :** La technique passe au second plan. On veut voir une identité visuelle marquante. Un Dark Mode soigné, une typographie parfaite, et au moins une micro-animation (Framer Motion ou CSS pur).
* 🧠 **Guilde des Strategists :** On veut voir de l'impact. Ton site doit être optimisé pour le SEO (balises meta parfaites) et intégrer un outil d'Analytics (Google Analytics, Plausible) pour traquer tes visiteurs.
* 🗣️ **Guilde des Catalysts :** Le site n'est qu'un prétexte. Ta mission est de déployer la page, puis d'écrire un post LinkedIn ou Twitter pour annoncer son lancement et d'attirer au moins 20 visiteurs uniques le premier jour.

### Critères de validation (Généraux)
- L'URL doit être publique.
- Le projet ne doit pas crasher.
    `
  },
  {
    id: "uni-02-audit-teardown",
    title: "Le Scalpel : Audit de l'Existant",
    shortDesc: "Détruis pour mieux reconstruire.",
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
# Mission Universelle 02 : Le Scalpel

Les meilleurs professionnels savent lire l'existant avant de créer du nouveau. Choisis un projet numérique existant (site web, app, repo open-source) et réalise un audit complet.

### L'angle d'attaque de ta Guilde :
* 🛠️ **Builders :** Fais un audit de la dette technique ou de la sécurité. Pointe les vulnérabilités (XSS, Auth faible) ou les requêtes lentes, et propose une refonte architecturale.
* 🎨 **Creators :** Fais un audit UX/UI. Quels sont les points de friction ? L'accessibilité est-elle respectée ? Propose un wireframe ou un nouveau design system pour réparer ça.
* 🧠 **Strategists :** Fais un audit du Business Model et du Funnel de conversion. Où perdent-ils des clients ? Propose une stratégie Go-To-Market ou de rétention plus agressive.
* 🗣️ **Catalysts :** Fais un audit du positionnement communautaire et de la marque. Leur communication est-elle plate ? Propose une stratégie de création de contenu et de distribution virale.

### Critères de validation
- Le rapport doit être lisible, clair, et aller droit au but (pas de blabla).
- Les solutions proposées doivent être réalistes et actionnables.
    `
  },
  {
    id: "uni-03-cross-pollination",
    title: "Pollinisation Croisée",
    shortDesc: "Sors de ta zone de confort avec un pair.",
    description: "Trouve un membre d'une autre Guilde sur Hashcode. Aidez-vous mutuellement sur une problématique spécifique à votre expertise.",
    xpReward: 400,
    requiredLevel: 4,
    targetLevel: 4,
    requirements: ["Le pseudo du membre avec qui tu as collaboré.", "La preuve de l'échange (Screenshot de PR, document collaboratif, etc.)."],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "PRO",
    duration: "1 semaine",
    weightBuilder: 0.20,
    weightCreator: 0.20,
    weightStrategist: 0.20,
    weightCatalyst: 0.40,
    submissionMethod: "ANY_LINK",
    deliverables: ["Preuve de la collaboration", "Bilan de ce que tu as appris de l'autre guilde"],
    fullBriefing: `
# Mission Universelle 03 : Pollinisation Croisée

L'élite technologique n'est jamais isolée. Ta force réside dans ta capacité à parler le langage des autres disciplines. 

### Instructions
1. Identifie un membre actif qui appartient à une Guilde DIFFÉRENTE de la tienne.
2. Propose-lui un échange de compétences (Ex: "Je suis Builder, je te règle ton problème de base de données si tu m'aides à améliorer le design de ma page d'accueil (Creator)").
3. Réalisez cet échange de manière asynchrone ou lors d'un call.

### Critères de validation
- La preuve du travail accompli ensemble (Lien vers une Pull Request, un Figma commenté, etc.).
- Les deux membres de la collaboration obtiendront les points d'XP pour cette mission !
    `
  },

  // --- HYBRID CHALLENGES ---
  {
    id: "h1-hackathon-48h",
    title: "Hackathon 48h",
    shortDesc: "Construis, crée, stratégie — ensemble.",
    description: "Forme une équipe de 2-4 profils différents et construis un prototype fonctionnel en 48h. Pitch le résultat à la communauté.",
    xpReward: 600,
    requiredLevel: 4,
    targetLevel: 4,
    requirements: [
      "Composition de l'équipe (minimum 2 profils différents).",
      "Lien vers le prototype ou la démo.",
      "Lien vers le pitch (slides ou vidéo).",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "48h",
    weightBuilder: 0.3,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.2,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien du projet", "Pitch Slides/Vidéo", "Liste des membres de l'équipe"],
    fullBriefing: `
# Mission : Hackathon 48h

L'épreuve de feu. Travaille sous pression pour sortir un produit minimum viable.

### Instructions
1. Trouve des partenaires avec des profils complémentaires (ex: 1 Builder, 1 Creator, 1 Strategist).
2. Définissez un problème à résoudre.
3. Construisez le prototype en 48 heures chronos.
4. Présentez-le lors de la session de pitch communautaire.

### Critères de validation
- Prototype fonctionnel.
- Collaboration interdisciplinaire visible.
    `
  },
  {
    id: "h2-cross-profile-collab",
    title: "Collaboration Cross-Profil",
    shortDesc: "Travaille avec quelqu'un de complètement différent.",
    description: "Collabore avec un membre d'un profil opposé au thine sur un projet commun pendant 2 semaines. Documente ce que tu as appris de cette collaboration.",
    xpReward: 400,
    requiredLevel: 3,
    targetLevel: 3,
    requirements: [
      "Profil du collaborateur et nature du projet.",
      "Livrable commun + retour d'expérience sur la collaboration.",
    ],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "2 semaines",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "ANY_LINK",
    deliverables: ["Rapport de collaboration", "Livrable du projet commun"],
    fullBriefing: `
# Mission : Collaboration Cross-Profil

Sortez de votre zone de confort. Un Builder doit comprendre un Strategist, un Creator doit s'aligner avec un Catalyst.

### Instructions
1. Identifie un binôme d'un profil différent.
2. Définissez un micro-projet (ex: une landing page, une campagne marketing).
3. Travaillez ensemble sur 14 jours.
4. Racontez comment vous avez géré vos différences d'approche.

### Critères de validation
- Livrable de qualité.
- Analyse profonde de l'apprentissage inter-profils.
    `
  },
  {
    id: "h3-community-project",
    title: "Projet Communautaire",
    shortDesc: "Crée quelque chose pour la communauté HASHCODE.",
    description: "Initie ou co-construis un projet qui bénéficie directement à la communauté : ressource, outil, guide, événement ou initiative à impact collectif.",
    xpReward: 500,
    requiredLevel: 4,
    targetLevel: 4,
    requirements: [
      "Description du projet et de son impact communautaire.",
      "Livrable accessible à tous les membres.",
    ],
    type: "NETWORK",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "PRO",
    duration: "3 semaines",
    weightBuilder: 0.2,
    weightCreator: 0.25,
    weightStrategist: 0.2,
    weightCatalyst: 0.35,
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers la ressource / outil communautaire"],
    fullBriefing: `
# Mission : Projet Communautaire

Laisse une trace durable dans l'histoire de HASHCODE.

### Instructions
1. Identifie un manque dans la communauté (ex: pas d'annuaire des outils, besoin d'un guide de survie freelance).
2. Forme une équipe si nécessaire.
3. Produis et livre la ressource.
4. Assure son adoption par les membres.

### Critères de validation
- Utilité publique démontrée.
- Qualité de finition.
    `
  },
  {
    id: "h1-solve-real-problem",
    title: "Résoudre un problème réel",
    shortDesc: "Passe de l'idée à la solution concrète.",
    description: "Identifie un problème dans ton environnement et apporte une solution adaptée à ton profil.",
    xpReward: 200,
    requiredLevel: 2,
    targetLevel: 3,
    requirements: ["Preuve de la solution (code, contenu, plan ou mise en relation)"],
    type: "GENERAL",
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    comingSoon: true
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
    submissionMethod: "GITHUB_REPO",
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

export function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

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

export const XP_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 400,
  4: 1400
};
