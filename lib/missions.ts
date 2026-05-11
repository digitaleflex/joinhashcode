export type MissionLevel = 1 | 2 | 3 | 4;

export interface Mission {
  id: string;
  title: string;
  description: string;
  shortDesc: string;
  xpReward: number;
  requiredLevel: MissionLevel;
  targetLevel: MissionLevel;
  requirements: string[];
  type: "CODE" | "DESIGN" | "BUSINESS" | "NETWORK" | "GENERAL";
}

export const MISSIONS: Mission[] = [
  {
    id: "init-to-core-1",
    title: "Le Premier Commit",
    shortDesc: "Prouve ton engagement initial en déployant ton premier code ou maquette.",
    description: "Ton premier test est fondamental : montre-nous ce que tu sais faire. Déploie une page web, partage un repo GitHub, ou envoie le lien d'un prototype Figma fonctionnel. L'important n'est pas la perfection, mais le passage à l'action.",
    xpReward: 100,
    requiredLevel: 1, // INIT
    targetLevel: 2,   // CORE
    requirements: [
      "Lien vers un projet GitHub public OU un prototype Figma OU un site déployé.",
      "Le projet doit avoir été mis à jour récemment."
    ],
    type: "GENERAL"
  },
  {
    id: "core-to-pro-1",
    title: "Architecture & Scalabilité",
    shortDesc: "Prouve que tu peux construire du solide.",
    description: "Pour atteindre le niveau PRO, tu dois démontrer une capacité à créer un projet structuré. Crée une application Full-Stack simple avec authentification et base de données, ou un Design System complet.",
    xpReward: 300,
    requiredLevel: 2, // CORE
    targetLevel: 3,   // PRO
    requirements: [
      "Projet Full-Stack déployé avec BDD opérationnelle.",
      "Lien GitHub vers le code source structuré."
    ],
    type: "CODE"
  },
  {
    id: "pro-to-elite-1",
    title: "Le Masterpiece",
    shortDesc: "L'épreuve finale pour devenir ELITE.",
    description: "Le niveau ELITE est réservé à ceux qui génèrent de l'impact. Partage un projet open-source majeur que tu as créé, ou une startup générant du MRR, ou une architecture cloud complexe que tu as designée et déployée.",
    xpReward: 1000,
    requiredLevel: 3, // PRO
    targetLevel: 4,   // ELITE
    requirements: [
      "Projet en production avec des vrais utilisateurs.",
      "Documentation d'architecture ou Business Plan accessible."
    ],
    type: "GENERAL"
  }
];

export const XP_THRESHOLDS = {
  1: 0,
  2: 100,
  3: 400,
  4: 1400
};
