export type ProfileType = 'builder' | 'creator' | 'strategist' | 'catalyst'

export interface Truth {
  icon: string
  bold: string
  rest: string
}

export interface ProfileMission {
  title: string
  xp: number
}

export interface SpecializationStep {
  weekRange: string
  title: string
  type: "atelier" | "projet" | "validation"
}

export interface Specialization {
  id: string
  label: string
  reason: string
  goal90days: string
  goal90daysWhy: string
  goal90daysOutcomes: string[]
  steps: SpecializationStep[]
  firstAction: {
    type: "atelier" | "projet" | "mentor"
    title: string
    slug: string
    duration: string
    pourquoi: string
  }
}

export interface ProfileContent {
  name: string
  pain: string
  painBold: string
  truths: [Truth, Truth, Truth]
  unlockedMissions: [ProfileMission, ProfileMission]
  lockedMissions: ProfileMission[]
  socialProof: string
  whatsappText: string
  ctaLabel: string
  possibleSpecializations: Specialization[]
}

import { APP_URL } from "./config";

export const PROFILE_COLORS: Record<ProfileType, string> = {
  builder: '#B8FF3B',
  creator: '#A855F7',
  strategist: '#22D3EE',
  catalyst: '#F97316',
}

export const PROFILE_CONTENT: Record<ProfileType, ProfileContent> = {
  builder: {
    name: 'Builder',
    pain: "Tu sais construire. Le problème, c'est que tu construis seul, dans le vide — sans savoir si ce que tu fais vaut quelque chose.",
    painBold: 'seul, dans le vide',
    truths: [
      {
        icon: '🔁',
        bold: 'Tu recommences souvent de zéro.',
        rest: " Pas parce que tu es instable — parce que personne ne t'a montré comment avancer étape par étape.",
      },
      {
        icon: '🔇',
        bold: 'Ton entourage ne comprend pas ce que tu fais.',
        rest: " Ni ta famille, ni tes amis. Tu construis quelque chose qu'ils ne voient pas encore.",
      },
      {
        icon: '🧱',
        bold: 'Tu accumules des projets non terminés.',
        rest: " Chacun t'a appris quelque chose — mais aucun ne te représente encore. Ça, ça change ici.",
      },
    ],
    unlockedMissions: [
      { title: 'Construire et livrer un projet en 48h', xp: 50 },
      { title: 'Documenter et publier ton code sur GitHub', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Collaborer avec un Stratège du Guild', xp: 60 },
      { title: 'Présenter ton travail à la communauté', xp: 40 },
      { title: 'Mentorer un Builder débutant', xp: 80 },
    ],
    socialProof:
      "Des Builders comme toi ont livré leurs premiers projets et décroché leurs premiers clients depuis ce Guild.",
    whatsappText:
      `Je viens de découvrir mon profil HASHCODE : Builder 🧱\nFais le quiz et découvre le tien → ${APP_URL}`,
    ctaLabel: 'Rejoindre le Guild Builder →',
    possibleSpecializations: [
      {
        id: "fullstack",
        label: "Développement Fullstack",
        reason: "Tes réponses montrent une forte capacité à construire des systèmes complets.",
        goal90days: "Construire et déployer ton première application web complète",
        goal90daysWhy: "Parce que rien ne valide mieux tes compétences qu'un projet live, utilisable par d'autres.",
        goal90daysOutcomes: [
          "Concevoir une architecture frontend + backend fonctionnelle",
          "Connecter une base de données à une API REST",
          "Déployer une application sur un serveur ou cloud",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "HTML/CSS → construire une page responsive", type: "atelier" },
          { weekRange: "Semaine 2-3", title: "JavaScript + premier framework", type: "atelier" },
          { weekRange: "Semaine 4-5", title: "Créer une API avec Node.js", type: "atelier" },
          { weekRange: "Semaine 6-8", title: "Projet fullstack complet", type: "projet" },
          { weekRange: "Semaine 9-12", title: "Déploiement + revue par un mentor", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "HTML/CSS — Construire ta première page responsive",
          slug: "html-css-responsive",
          duration: "45 min",
          pourquoi: "Parce que le frontend est la porte d'entrée visible de tout projet web.",
        },
      },
      {
        id: "cloud-devops",
        label: "Cloud & DevOps",
        reason: "Ton intérêt pour l'automatisation et l'infrastructure est clair.",
        goal90days: "Automatiser le déploiement d'une application sur le cloud",
        goal90daysWhy: "Parce que le déploiement continu est la compétence la plus recherchée en infrastructure.",
        goal90daysOutcomes: [
          "Configurer un serveur cloud (AWS/OVH)",
          "Écrire un Dockerfile et docker-composer",
          "Mettre en place un pipeline CI/CD",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Linux pour le cloud", type: "atelier" },
          { weekRange: "Semaine 2-3", title: "Docker — conteneuriser une app", type: "atelier" },
          { weekRange: "Semaine 4-5", title: "Déploiement sur un cloud", type: "atelier" },
          { weekRange: "Semaine 6-9", title: "Pipeline CI/CD complet", type: "projet" },
          { weekRange: "Semaine 10-12", title: "Validation par un mentor DevOps", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Linux pour le cloud — premiers pas sur un serveur",
          slug: "linux-cloud-basics",
          duration: "45 min",
          pourquoi: "Parce que tous les serveurs cloud tournent sur Linux.",
        },
      },
      {
        id: "architecture",
        label: "Architecture Logicielle",
        reason: "Ta façon de penser les systèmes mérite d'être structurée.",
        goal90days: "Concevoir et documenter l'architecture d'une application",
        goal90daysWhy: "Parce que savoir architecturer, c'est ce qui différencie un développeur d'un ingénieur.",
        goal90daysOutcomes: [
          "Modéliser une architecture avec des diagrammes",
          "Choisir les bonnes technologies selon le besoin",
          "Rédiger une documentation technique claire",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Principes d'architecture logicielle", type: "atelier" },
          { weekRange: "Semaine 2-4", title: "Design patterns essentiels", type: "atelier" },
          { weekRange: "Semaine 5-6", title: "Modélisation UML et C4", type: "atelier" },
          { weekRange: "Semaine 7-9", title: "Architecturer une app existante", type: "projet" },
          { weekRange: "Semaine 10-12", title: "Revue d'architecture par un mentor", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Principes d'architecture — SOLID et au-delà",
          slug: "architecture-solid",
          duration: "45 min",
          pourquoi: "Parce que les principes SOLID sont la base de toute architecture maintenable.",
        },
      },
    ],
  },

  creator: {
    name: 'Créateur',
    pain: "Tu as des idées que les autres n'ont pas encore. Mais tu passes plus de temps à tout imaginer tout seul qu'à créer vraiment.",
    painBold: 'tout imaginer tout seul',
    truths: [
      {
        icon: '🎨',
        bold: 'Tu crées, puis tu effaces.',
        rest: " Pas parce que c'est mauvais — parce que tu n'as personne à qui montrer avant que ce soit parfait.",
      },
      {
        icon: '🔦',
        bold: 'Tu te perds dans les détails.',
        rest: " Une idée en entraîne une autre, et tu n'arrives jamais à la ligne d'arrivée.",
      },
      {
        icon: '🪟',
        bold: "Tu manques d'une scène.",
        rest: " Pas de talent — tu n'as juste jamais eu le bon endroit pour montrer ce que tu fais vraiment.",
      },
    ],
    unlockedMissions: [
      { title: 'Publier un projet personnel en public', xp: 50 },
      { title: 'Créer et partager ton premier design system', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Co-créer avec un Builder du Guild', xp: 60 },
      { title: 'Pitcher ta vision à la communauté', xp: 40 },
      { title: 'Produire un projet de A à Z en 7 jours', xp: 80 },
    ],
    socialProof:
      "Des Créateurs du Guild ont publié leurs projets pour la première fois — et reçu des retours vrais, pas des likes vides.",
    whatsappText:
      `Je viens de découvrir mon profil HASHCODE : Créateur 🎨\nFais le quiz et découvre le tien → ${APP_URL}`,
    ctaLabel: 'Rejoindre le Guild Créateur →',
    possibleSpecializations: [
      {
        id: "ux-design",
        label: "Design UX/UI",
        reason: "Ta sensibilité à l'expérience utilisateur est ton superpouvoir.",
        goal90days: "Concevoir l'interface complète d'une application mobile",
        goal90daysWhy: "Parce que le design d'interface est la compétence qui rend les produits mémorables.",
        goal90daysOutcomes: [
          "Réaliser des wireframes et maquettes interactives",
          "Appliquer les principes d'accessibilité et d'ergonomie",
          "Présenter un dossier de design complet",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Figma : les bases du design d'interface", type: "atelier" },
          { weekRange: "Semaine 2-3", title: "Système de design et composants", type: "atelier" },
          { weekRange: "Semaine 4-5", title: "Design d'une app mobile complète", type: "projet" },
          { weekRange: "Semaine 6-8", title: "Tests utilisateurs et itérations", type: "atelier" },
          { weekRange: "Semaine 9-12", title: "Validation par un designer senior", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Figma — les bases du design d'interface",
          slug: "figma-basics",
          duration: "45 min",
          pourquoi: "Parce que Figma est l'outil standard de tous les designers aujourd'hui.",
        },
      },
      {
        id: "digital-design",
        label: "Design Graphique & Identité Visuelle",
        reason: "Ton œil pour l'esthétique peut devenir une marque.",
        goal90days: "Créer l'identité visuelle complète d'une marque",
        goal90daysWhy: "Parce que savoir créer une identité de marque, c'est ce qui te permet de travailler avec des vrais clients.",
        goal90daysOutcomes: [
          "Concevoir un logo et une charte graphique",
          "Créer des templates pour réseaux sociaux",
          "Produire un brand book complet",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Fondamentaux du design graphique", type: "atelier" },
          { weekRange: "Semaine 2-4", title: "Création d'une identité de marque", type: "atelier" },
          { weekRange: "Semaine 5-7", title: "Projet : identité visuelle complète", type: "projet" },
          { weekRange: "Semaine 8-10", title: "Préparation du brand book", type: "atelier" },
          { weekRange: "Semaine 11-12", title: "Revue par un designer graphique", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Fondamentaux du design graphique",
          slug: "graphic-design-basics",
          duration: "45 min",
          pourquoi: "Parce que les bases du design sont les mêmes, quel que soit le support.",
        },
      },
      {
        id: "content-creation",
        label: "Création de Contenu Digital",
        reason: "Tes idées méritent d'être vues et entendues.",
        goal90days: "Produire et publier une série de contenus engageants",
        goal90daysWhy: "Parce que la création de contenu est le meilleur moyen de construire une audience et une marque personnelle.",
        goal90daysOutcomes: [
          "Planifier une stratégie de contenu sur 30 jours",
          "Produire des visuels et vidéos courtes",
          "Analyser les performances et ajuster",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Stratégie de contenu pour les réseaux", type: "atelier" },
          { weekRange: "Semaine 2-4", title: "Production vidéo et montage rapide", type: "atelier" },
          { weekRange: "Semaine 5-7", title: "Lancement d'une série de contenus", type: "projet" },
          { weekRange: "Semaine 8-10", title: "Analyse des performances", type: "atelier" },
          { weekRange: "Semaine 11-12", title: "Bilan et ajustement stratégique", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Stratégie de contenu — définir ton angle",
          slug: "content-strategy",
          duration: "30 min",
          pourquoi: "Parce qu'une bonne stratégie avant de produire, c'est la clé.",
        },
      },
    ],
  },

  strategist: {
    name: 'Stratège',
    pain: "Tu vois tout plus loin que les autres. Le problème, c'est que pendant que tu analyses, les autres agissent — et toi tu regardes.",
    painBold: 'les autres agissent — et toi tu regardes',
    truths: [
      {
        icon: '🧠',
        bold: 'Tu penses beaucoup, tu livres peu.',
        rest: " Pas par paresse — tu veux que ce soit bien fait avant de commencer. Ça t'immobilise.",
      },
      {
        icon: '📐',
        bold: 'Personne ne te demande ton avis.',
        rest: " Pourtant tu vois des choses que les autres ratent. Il te manque un cadre où ta profondeur est valorisée.",
      },
      {
        icon: '🔗',
        bold: 'Tu travailles seul sur des idées qui méritent une équipe.',
        rest: " Ici tu trouves les personnes qui ont besoin exactement de ce que tu sais faire.",
      },
    ],
    unlockedMissions: [
      { title: 'Produire une analyse produit complète', xp: 50 },
      { title: 'Rédiger une roadmap pour un vrai projet', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Mentorer un Builder du Guild', xp: 60 },
      { title: 'Présenter ta stratégie à la communauté', xp: 40 },
      { title: 'Diriger un projet de Guild de A à Z', xp: 100 },
    ],
    socialProof:
      "Des Stratèges du Guild ont rejoint des équipes qui avaient besoin exactement de leur façon de penser.",
    whatsappText:
      `Je viens de découvrir mon profil HASHCODE : Stratège 🧠\nFais le quiz et découvre le tien → ${APP_URL}`,
    ctaLabel: 'Rejoindre le Guild Stratège →',
    possibleSpecializations: [
      {
        id: "product-strategy",
        label: "Stratégie Produit",
        reason: "Ta vision globale est exactement ce dont une équipe produit a besoin.",
        goal90days: "Définir la roadmap d'un produit de A à Z",
        goal90daysWhy: "Parce que savoir définir une vision produit et la traduire en roadmap, c'est la compétence clé du product manager.",
        goal90daysOutcomes: [
          "Rédiger une vision produit et une proposition de valeur",
          "Prioriser les fonctionnalités avec des frameworks (RICE, MoSCoW)",
          "Présenter une roadmap à une équipe technique",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Fondamentaux du Product Management", type: "atelier" },
          { weekRange: "Semaine 2-3", title: "Découverte client et user research", type: "atelier" },
          { weekRange: "Semaine 4-6", title: "Définir une roadmap produit", type: "projet" },
          { weekRange: "Semaine 7-9", title: "Pitch de ta roadmap", type: "atelier" },
          { weekRange: "Semaine 10-12", title: "Revue par un PM senior", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Fondamentaux du Product Management",
          slug: "product-management-basics",
          duration: "45 min",
          pourquoi: "Parce que le cadre produit est ce qui transforme une bonne idée en un produit viable.",
        },
      },
      {
        id: "business-analytics",
        label: "Analyse Commerciale & Data",
        reason: "Ta capacité à voir les tendances peut piloter des décisions business.",
        goal90days: "Produire une analyse stratégique complète avec des données",
        goal90daysWhy: "Parce que les décisions basées sur les données sont plus fortes que les intuitions.",
        goal90daysOutcomes: [
          "Collecter et nettoyer des données pertinentes",
          "Créer des visualisations percutantes",
          "Formuler des recommandations stratégiques",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Introduction à l'analyse de données", type: "atelier" },
          { weekRange: "Semaine 2-4", title: "SQL et extraction de données", type: "atelier" },
          { weekRange: "Semaine 5-6", title: "Visualisation avec Looker/Tableau", type: "atelier" },
          { weekRange: "Semaine 7-9", title: "Analyse complète d'un cas réel", type: "projet" },
          { weekRange: "Semaine 10-12", title: "Présentation des recommandations", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Introduction à l'analyse de données",
          slug: "data-analysis-intro",
          duration: "45 min",
          pourquoi: "Parce que les données sont le langage universel du business.",
        },
      },
      {
        id: "consulting",
        label: "Conseil & Innovation",
        reason: "Ta capacité à analyser des problèmes complexes est ton atout.",
        goal90days: "Mener une mission de conseil en innovation de bout en bout",
        goal90daysWhy: "Parce que le conseil est le métier qui valorise le mieux la pensée stratégique.",
        goal90daysOutcomes: [
          "Cadrer un problème client en méthodologie design thinking",
          "Animer des ateliers de co-création",
          "Produire un livrable de conseil professionnel",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Design Thinking et problématisation", type: "atelier" },
          { weekRange: "Semaine 2-4", title: "Ateliers de co-création", type: "atelier" },
          { weekRange: "Semaine 5-7", title: "Mission de conseil sur un cas réel", type: "projet" },
          { weekRange: "Semaine 8-10", title: "Rédaction du livrable", type: "atelier" },
          { weekRange: "Semaine 11-12", title: "Soutenance devant un consultant", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Design Thinking — cadrer un problème",
          slug: "design-thinking",
          duration: "45 min",
          pourquoi: "Parce que la qualité d'une solution dépend de la qualité de la problématisation.",
        },
      },
    ],
  },

  catalyst: {
    name: 'Catalyst',
    pain: "Tu motives tout le monde autour de toi. Mais à la fin de la journée, qui te motive, toi ?",
    painBold: 'qui te motive, toi ?',
    truths: [
      {
        icon: '🔥',
        bold: 'Tu donnes beaucoup, tu reçois peu.',
        rest: " Tu portent des groupes entiers sans structure pour toi-même. Tu t'épuises.",
      },
      {
        icon: '🌀',
        bold: "Ton énergie part dans tous les sens.",
        rest: " Pas par manque de sérieux — tu n'as pas encore trouvé le cadre qui concentre ce que tu apportes.",
      },
      {
        icon: '🤝',
        bold: 'Tu es fait pour bâtir des communautés.',
        rest: " Ici on t'en donne une vraie — avec des gens aussi engagés que toi.",
      },
    ],
    unlockedMissions: [
      { title: 'Animer ta première session communautaire', xp: 50 },
      { title: 'Recruter 3 membres actifs pour ton Guild', xp: 30 },
    ],
    lockedMissions: [
      { title: 'Co-organiser un événement avec un Stratège', xp: 60 },
      { title: "Lancer ton propre cercle d'apprentissage", xp: 40 },
      { title: "Fédérer une équipe autour d'un projet commun", xp: 100 },
    ],
    socialProof:
      "Des Catalysts du Guild ont lancé leurs propres cercles d'apprentissage dans leurs villes.",
    whatsappText:
      `Je viens de découvrir mon profil HASHCODE : Catalyst 🔥\nFais le quiz et découvre le tien → ${APP_URL}`,
    ctaLabel: 'Rejoindre le Guild Catalyst →',
    possibleSpecializations: [
      {
        id: "community-management",
        label: "Gestion de Communauté",
        reason: "Ton énergie naturelle est faite pour fédérer et engager.",
        goal90days: "Lancer et animer une communauté engagée autour d'un sujet",
        goal90daysWhy: "Parce que les communautés sont le moteur de l'engagement et de la fidélisation.",
        goal90daysOutcomes: [
          "Définir une stratégie d'engagement communautaire",
          "Animer des événements et des discussions",
          "Mesurer la croissance et la rétention",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Fondamentaux de la community management", type: "atelier" },
          { weekRange: "Semaine 2-3", title: "Stratégie d'engagement et contenu", type: "atelier" },
          { weekRange: "Semaine 4-6", title: "Lancement d'une communauté", type: "projet" },
          { weekRange: "Semaine 7-9", title: "Animation et modération", type: "atelier" },
          { weekRange: "Semaine 10-12", title: "Bilan d'engagement et ajustements", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Fondamentaux de la gestion de communauté",
          slug: "community-management-basics",
          duration: "45 min",
          pourquoi: "Parce qu'une communauté ne se décrète pas — elle se construit avec méthode.",
        },
      },
      {
        id: "project-management",
        label: "Management de Projet",
        reason: "Ta capacité à mobiliser les autres est une compétence de chef de projet.",
        goal90days: "Planifier et piloter un projet collaboratif de bout en bout",
        goal90daysWhy: "Parce que le management de projet est le cadre qui transforme l'énergie collective en résultats concrets.",
        goal90daysOutcomes: [
          "Décomposer un projet en tâches et jalons",
          "Animer des réunions et suivre l'avancement",
          "Utiliser des outils de gestion de projet (Notion, Jira)",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Introduction au management de projet", type: "atelier" },
          { weekRange: "Semaine 2-4", title: "Méthodologies agiles", type: "atelier" },
          { weekRange: "Semaine 5-7", title: "Pilotage d'un projet collaboratif", type: "projet" },
          { weekRange: "Semaine 8-10", title: "Communication et reporting", type: "atelier" },
          { weekRange: "Semaine 11-12", title: "Rétrospective et validation", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Introduction au management de projet",
          slug: "project-management-intro",
          duration: "45 min",
          pourquoi: "Parce que la méthode est ce qui libère l'énergie au lieu de la disperser.",
        },
      },
      {
        id: "partnerships",
        label: "Développement de Partenariats",
        reason: "Ton réseau et ta capacité à connecter les gens sont des trésors.",
        goal90days: "Conclure un premier partenariat stratégique",
        goal90daysWhy: "Parce que les bons partenariats multiplient l'impact bien plus vite que le travail seul.",
        goal90daysOutcomes: [
          "Identifier et qualifier des partenaires potentiels",
          "Préparer un dossier de partenariat",
          "Négocier et conclure un accord",
        ],
        steps: [
          { weekRange: "Semaine 1", title: "Identifier les bons partenaires", type: "atelier" },
          { weekRange: "Semaine 2-4", title: "Préparer un dossier de partenariat", type: "atelier" },
          { weekRange: "Semaine 5-8", title: "Démarchage et négociation", type: "projet" },
          { weekRange: "Semaine 9-11", title: "Suivi et optimisation", type: "atelier" },
          { weekRange: "Semaine 12", title: "Bilan et prochaines étapes", type: "validation" },
        ],
        firstAction: {
          type: "atelier",
          title: "Identifier les bons partenaires",
          slug: "partner-identification",
          duration: "30 min",
          pourquoi: "Parce qu'un bon partenariat commence par le bon choix de partenaire.",
        },
      },
    ],
  },
}

export function getProfileContent(profile: ProfileType): ProfileContent {
  return PROFILE_CONTENT[profile]
}

/** primary and secondary must be different ProfileType values */
export function getHybridContent(
  primary: ProfileType,
  secondary: ProfileType
): ProfileContent {
  const p = PROFILE_CONTENT[primary]
  const s = PROFILE_CONTENT[secondary]
  return {
    ...p,
    name: `${p.name} × ${s.name}`,
    truths: [p.truths[0], p.truths[1], s.truths[0]],
    ctaLabel: `Rejoindre le Guild ${p.name} →`,
  }
}
