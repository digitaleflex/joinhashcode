export interface Atelier {
  slug: string
  title: string
  duration: string
  description: string
  profile: "builder" | "creator" | "strategist" | "catalyst"
  specializationId: string
  specializationLabel: string
  order: number
  xpReward: number
  missionSlugs: string[]
  pourquoi: string
}

const ateliersMap: Record<string, Atelier> = {
  "html-css-responsive": {
    slug: "html-css-responsive",
    title: "HTML/CSS — Construire ta première page responsive",
    duration: "45 min",
    description: "Apprends les bases du HTML sémantique et du CSS moderne pour créer une page web responsive qui s'adapte à tous les écrans.",
    profile: "builder",
    specializationId: "fullstack",
    specializationLabel: "Développement Fullstack",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que le frontend est la porte d'entrée visible de tout projet web.",
  },
  "linux-cloud-basics": {
    slug: "linux-cloud-basics",
    title: "Linux pour le cloud — premiers pas sur un serveur",
    duration: "45 min",
    description: "Découvre l'environnement Linux d'un serveur cloud : navigation, permissions, processus et déploiement basique.",
    profile: "builder",
    specializationId: "cloud-devops",
    specializationLabel: "Cloud & DevOps",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que tous les serveurs cloud tournent sur Linux.",
  },
  "architecture-solid": {
    slug: "architecture-solid",
    title: "Principes d'architecture — SOLID et au-delà",
    duration: "45 min",
    description: "Maîtrise les principes SOLID et les patterns fondamentaux pour concevoir une architecture logicielle maintenable et évolutive.",
    profile: "builder",
    specializationId: "architecture",
    specializationLabel: "Architecture Logicielle",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que les principes SOLID sont la base de toute architecture maintenable.",
  },
  "figma-basics": {
    slug: "figma-basics",
    title: "Figma — les bases du design d'interface",
    duration: "45 min",
    description: "Prends en main Figma pour créer tes premières maquettes d'interface : outils, composants, prototypes et collaboration.",
    profile: "creator",
    specializationId: "ux-design",
    specializationLabel: "Design UX/UI",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que Figma est l'outil standard de tous les designers aujourd'hui.",
  },
  "graphic-design-basics": {
    slug: "graphic-design-basics",
    title: "Fondamentaux du design graphique",
    duration: "45 min",
    description: "Explore les bases du design graphique : typographie, couleurs, composition, hiérarchie visuelle et principes de communication.",
    profile: "creator",
    specializationId: "digital-design",
    specializationLabel: "Design Graphique & Identité Visuelle",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que les bases du design sont les mêmes, quel que soit le support.",
  },
  "content-strategy": {
    slug: "content-strategy",
    title: "Stratégie de contenu — définir ton angle",
    duration: "30 min",
    description: "Apprends à définir une stratégie de contenu alignée sur ta marque personnelle : ligne éditoriale, calendrier et formats.",
    profile: "creator",
    specializationId: "content-creation",
    specializationLabel: "Création de Contenu Digital",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce qu'une bonne stratégie avant de produire, c'est la clé.",
  },
  "product-management-basics": {
    slug: "product-management-basics",
    title: "Fondamentaux du Product Management",
    duration: "45 min",
    description: "Découvre le rôle de Product Manager : vision produit, définition de valeur, priorisation et gestion des parties prenantes.",
    profile: "strategist",
    specializationId: "product-strategy",
    specializationLabel: "Stratégie Produit",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que le cadre produit est ce qui transforme une bonne idée en un produit viable.",
  },
  "data-analysis-intro": {
    slug: "data-analysis-intro",
    title: "Introduction à l'analyse de données",
    duration: "45 min",
    description: "Initie-toi à l'analyse de données : collecte, nettoyage, visualisation et interprétation pour prendre des décisions éclairées.",
    profile: "strategist",
    specializationId: "business-analytics",
    specializationLabel: "Analyse Commerciale & Data",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que les données sont le langage universel du business.",
  },
  "design-thinking": {
    slug: "design-thinking",
    title: "Design Thinking — cadrer un problème",
    duration: "45 min",
    description: "Maîtrise la méthodologie Design Thinking pour problématiser, idéer, prototyper et tester des solutions centrées utilisateur.",
    profile: "strategist",
    specializationId: "consulting",
    specializationLabel: "Conseil & Innovation",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que la qualité d'une solution dépend de la qualité de la problématisation.",
  },
  "community-management-basics": {
    slug: "community-management-basics",
    title: "Fondamentaux de la gestion de communauté",
    duration: "45 min",
    description: "Apprends à construire et animer une communauté engagée : stratégie d'engagement, modération, métriques et croissance.",
    profile: "catalyst",
    specializationId: "community-management",
    specializationLabel: "Gestion de Communauté",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce qu'une communauté ne se décrète pas — elle se construit avec méthode.",
  },
  "project-management-intro": {
    slug: "project-management-intro",
    title: "Introduction au management de projet",
    duration: "45 min",
    description: "Découvre les fondamentaux du management de projet : planification, suivi, outils collaboratifs et animation d'équipe.",
    profile: "catalyst",
    specializationId: "project-management",
    specializationLabel: "Management de Projet",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce que la méthode est ce qui libère l'énergie au lieu de la disperser.",
  },
  "partner-identification": {
    slug: "partner-identification",
    title: "Identifier les bons partenaires",
    duration: "30 min",
    description: "Apprends à identifier, qualifier et approcher les partenaires stratégiques pour développer ton réseau et ton impact.",
    profile: "catalyst",
    specializationId: "partnerships",
    specializationLabel: "Développement de Partenariats",
    order: 1,
    xpReward: 50,
    missionSlugs: ["premiere-preuve-maitrise"],
    pourquoi: "Parce qu'un bon partenariat commence par le bon choix de partenaire.",
  },
}

export function getAtelier(slug: string): Atelier | undefined {
  return ateliersMap[slug]
}

export function getAllAteliers(): Atelier[] {
  return Object.values(ateliersMap)
}

export function getAteliersForMission(missionSlug: string): Atelier[] {
  return Object.values(ateliersMap).filter((a) => a.missionSlugs.includes(missionSlug))
}
