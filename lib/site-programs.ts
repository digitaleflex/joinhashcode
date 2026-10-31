/**
 * Source éditoriale des trois domaines actifs de HashCode.
 * Les descriptions présentent le périmètre, pas un inventaire garanti de cours.
 */
export const ACTIVE_PROGRAMS = [
  {
    slug: "web-development",
    title: "Développement web",
    text: "Conçois et développe des expériences numériques, des premières interfaces aux applications web complètes.",
    topics: [
      "Fondamentaux du web et programmation",
      "Interfaces, applications et API",
      "Données, qualité et mise en production",
    ],
  },
  {
    slug: "cybersecurity",
    title: "Cybersécurité",
    text: "Comprends les systèmes, identifie les risques et adopte une démarche de sécurité responsable et documentée.",
    topics: [
      "Systèmes, réseaux et hygiène numérique",
      "Sécurité applicative et analyse des risques",
      "Investigation et OSINT dans un cadre légal",
    ],
  },
  {
    slug: "applied-ai",
    title: "Intelligence artificielle appliquée",
    text: "Découvre comment utiliser, évaluer et intégrer les technologies d'intelligence artificielle pour résoudre des problèmes concrets.",
    topics: [
      "Fondamentaux de l'IA et des données",
      "Utilisation et évaluation des modèles",
      "Conception de solutions intégrant l'IA",
    ],
  },
] as const
