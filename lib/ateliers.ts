export type AtelierFormat = "video" | "live" | "interactif"

export interface Atelier {
  id: string
  title: string
  description: string
  specializationId: string
  parcoursStep: number
  duration: number
  format: AtelierFormat
  xpReward: number
  prerequisites: string[]
  produces: string
}

export const ATELIER_CATALOGUE: Atelier[] = [
  {
    id: "html-css-responsive",
    title: "HTML/CSS — Construire ta première page responsive",
    description: "Apprends les bases du HTML sémantique et du CSS moderne pour créer une page web responsive.",
    specializationId: "fullstack",
    parcoursStep: 1,
    duration: 45,
    format: "video",
    xpReward: 30,
    prerequisites: [],
    produces: "Page HTML/CSS responsive déployée",
  },
  {
    id: "linux-cloud-basics",
    title: "Linux pour le cloud — premiers pas sur un serveur",
    description: "Maîtrise les commandes essentielles pour naviguer et configurer un serveur Linux.",
    specializationId: "cloud-devops",
    parcoursStep: 1,
    duration: 45,
    format: "interactif",
    xpReward: 30,
    prerequisites: [],
    produces: "Serveur Linux configuré avec accès SSH",
  },
  {
    id: "architecture-solid",
    title: "Principes d'architecture — SOLID et au-delà",
    description: "Découvre les 5 principes SOLID et comment ils rendent ton code maintenable et évolutif.",
    specializationId: "architecture",
    parcoursStep: 1,
    duration: 45,
    format: "video",
    xpReward: 30,
    prerequisites: ["Connaissances de base en POO"],
    produces: "Diagramme d'architecture appliquant les principes SOLID",
  },
  {
    id: "figma-basics",
    title: "Figma — les bases du design d'interface",
    description: "Prends en main Figma pour créer tes premières maquettes d'interface utilisateur.",
    specializationId: "ux-design",
    parcoursStep: 1,
    duration: 45,
    format: "video",
    xpReward: 30,
    prerequisites: [],
    produces: "Maquette d'écran mobile sur Figma",
  },
  {
    id: "graphic-design-basics",
    title: "Fondamentaux du design graphique",
    description: "Les principes de composition, typographie, couleur et hiérarchie visuelle.",
    specializationId: "digital-design",
    parcoursStep: 1,
    duration: 45,
    format: "video",
    xpReward: 30,
    prerequisites: [],
    produces: "Affiche ou visuel respectant les principes fondamentaux",
  },
  {
    id: "content-strategy",
    title: "Stratégie de contenu — définir ton angle",
    description: "Apprends à définir une ligne éditoriale et un calendrier de contenu qui captive ton audience.",
    specializationId: "content-creation",
    parcoursStep: 1,
    duration: 30,
    format: "video",
    xpReward: 20,
    prerequisites: [],
    produces: "Calendrier éditorial sur 30 jours",
  },
  {
    id: "product-management-basics",
    title: "Fondamentaux du Product Management",
    description: "Découvre le rôle de Product Manager et les frameworks de priorisation.",
    specializationId: "product-strategy",
    parcoursStep: 1,
    duration: 45,
    format: "video",
    xpReward: 30,
    prerequisites: [],
    produces: "Vision produit + user stories priorisées",
  },
  {
    id: "data-analysis-intro",
    title: "Introduction à l'analyse de données",
    description: "Les bases de la collecte, du nettoyage et de l'analyse exploratoire de données.",
    specializationId: "business-analytics",
    parcoursStep: 1,
    duration: 45,
    format: "interactif",
    xpReward: 30,
    prerequisites: [],
    produces: "Rapport d'analyse exploratoire sur un jeu de données",
  },
  {
    id: "design-thinking",
    title: "Design Thinking — cadrer un problème",
    description: "Apprends la méthode Design Thinking pour problématiser et ideation efficacement.",
    specializationId: "consulting",
    parcoursStep: 1,
    duration: 45,
    format: "interactif",
    xpReward: 30,
    prerequisites: [],
    produces: "Problème cadré + personas + solution conceptuelle",
  },
  {
    id: "community-management-basics",
    title: "Fondamentaux de la gestion de communauté",
    description: "Les bases pour lancer, animer et faire croître une communauté engagée.",
    specializationId: "community-management",
    parcoursStep: 1,
    duration: 45,
    format: "video",
    xpReward: 30,
    prerequisites: [],
    produces: "Stratégie d'engagement communautaire",
  },
  {
    id: "project-management-intro",
    title: "Introduction au management de projet",
    description: "Découvre les méthodologies de gestion de projet et les outils pour piloter une équipe.",
    specializationId: "project-management",
    parcoursStep: 1,
    duration: 45,
    format: "video",
    xpReward: 30,
    prerequisites: [],
    produces: "Plan de projet avec jalons et livrables",
  },
  {
    id: "partner-identification",
    title: "Identifier les bons partenaires",
    description: "Méthode pour rechercher, qualifier et approcher des partenaires stratégiques.",
    specializationId: "partnerships",
    parcoursStep: 1,
    duration: 30,
    format: "video",
    xpReward: 20,
    prerequisites: [],
    produces: "Liste de 10 partenaires qualifiés + script d'approche",
  },
]

export function getAtelierById(id: string): Atelier | undefined {
  return ATELIER_CATALOGUE.find(a => a.id === id)
}

export function getAteliersBySpecialization(specializationId: string): Atelier[] {
  return ATELIER_CATALOGUE.filter(a => a.specializationId === specializationId).sort((a, b) => a.parcoursStep - b.parcoursStep)
}
