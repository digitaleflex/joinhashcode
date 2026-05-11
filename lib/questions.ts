export type Question = {
  id: number;
  text: string;
  type: string;
  weight: number;
  options: {
    text: string;
    value: string; // profile key (builder, creator, etc.)
    score: number;
  }[];
};

export const questions: Question[] = [
  {
    id: 1,
    type: "behavioral",
    weight: 2,
    text: "Quand tu découvres une nouvelle technologie, ton premier réflexe est :",
    options: [
      { text: "Construire rapidement quelque chose avec", value: "builder", score: 2 },
      { text: "Comprendre comment le système fonctionne", value: "strategist", score: 2 },
      { text: "Imaginer ce qu’on pourrait créer avec", value: "creator", score: 2 },
      { text: "Voir comment cela peut aider une équipe ou communauté", value: "catalyst", score: 2 }
    ]
  },
  {
    id: 2,
    type: "behavioral",
    weight: 3,
    text: "Dans un projet tech, quel rôle prends-tu naturellement ?",
    options: [
      { text: "Développer et tester", value: "builder", score: 3 },
      { text: "Concevoir la vision globale", value: "strategist", score: 3 },
      { text: "Penser l’expérience utilisateur", value: "creator", score: 3 },
      { text: "Coordonner les personnes", value: "catalyst", score: 3 }
    ]
  },
  {
    id: 3,
    type: "problem-solving",
    weight: 3,
    text: "Face à un problème difficile, tu as tendance à :",
    options: [
      { text: "Expérimenter rapidement plusieurs solutions", value: "builder", score: 3 },
      { text: "Analyser profondément avant d’agir", value: "strategist", score: 3 },
      { text: "Chercher une approche originale", value: "creator", score: 3 },
      { text: "Demander des avis pour créer une dynamique collective", value: "catalyst", score: 3 }
    ]
  },
  {
    id: 4,
    type: "motivation",
    weight: 3,
    text: "Ce qui te motive le plus dans la tech :",
    options: [
      { text: "Construire des outils utiles", value: "builder", score: 3 },
      { text: "Comprendre et maîtriser des systèmes complexes", value: "strategist", score: 3 },
      { text: "Créer des expériences nouvelles", value: "creator", score: 3 },
      { text: "Avoir un impact sur les gens", value: "catalyst", score: 3 }
    ]
  },
  {
    id: 5,
    type: "environment",
    weight: 2,
    text: "Tu es le plus à l’aise dans un environnement :",
    options: [
      { text: "Orienté action et expérimentation", value: "builder", score: 2 },
      { text: "Structuré et stratégique", value: "strategist", score: 2 },
      { text: "Créatif et flexible", value: "creator", score: 2 },
      { text: "Collaboratif et dynamique", value: "catalyst", score: 2 }
    ]
  },
  {
    id: 6,
    type: "behavioral",
    weight: 2,
    text: "Tu ressens le plus de satisfaction lorsque :",
    options: [
      { text: "Un projet fonctionne réellement", value: "builder", score: 2 },
      { text: "Une stratégie porte ses résultats", value: "strategist", score: 2 },
      { text: "Une idée devient une expérience marquante", value: "creator", score: 2 },
      { text: "Une équipe progresse grâce à toi", value: "catalyst", score: 2 }
    ]
  },
  {
    id: 7,
    type: "scenario",
    weight: 4,
    text: "Votre équipe doit lancer un produit dans 48h et tout n’est pas prêt. Tu fais quoi instinctivement ?",
    options: [
      { text: "Corriger les problèmes critiques immédiatement", value: "builder", score: 4 },
      { text: "Redéfinir les priorités pour sauver le lancement", value: "strategist", score: 4 },
      { text: "Simplifier l’expérience pour garder l’essentiel", value: "creator", score: 4 },
      { text: "Remotiver et réorganiser l’équipe", value: "catalyst", score: 4 }
    ]
  },
  {
    id: 8,
    type: "scenario",
    weight: 3,
    text: "Deux membres de l’équipe sont bloqués sur une décision importante. Ton réflexe :",
    options: [
      { text: "Tester rapidement les deux solutions", value: "builder", score: 3 },
      { text: "Analyser objectivement les impacts", value: "strategist", score: 3 },
      { text: "Chercher une troisième approche innovante", value: "creator", score: 3 },
      { text: "Faciliter la discussion pour créer un consensus", value: "catalyst", score: 3 }
    ]
  },
  {
    id: 9,
    type: "vision",
    weight: 2,
    text: "Dans 5 ans, tu aimerais surtout :",
    options: [
      { text: "Construire des produits importants", value: "builder", score: 2 },
      { text: "Concevoir des systèmes ou infrastructures majeures", value: "strategist", score: 2 },
      { text: "Créer des expériences ou marques reconnues", value: "creator", score: 2 },
      { text: "Diriger ou fédérer des équipes ambitieuses", value: "catalyst", score: 2 }
    ]
  },
  {
    id: 10,
    type: "workstyle",
    weight: 2,
    text: "Quand tu travailles sur une idée :",
    options: [
      { text: "Tu passes rapidement à l’action", value: "builder", score: 2 },
      { text: "Tu structures avant d’exécuter", value: "strategist", score: 2 },
      { text: "Tu explores plusieurs possibilités créatives", value: "creator", score: 2 },
      { text: "Tu cherches à impliquer les autres", value: "catalyst", score: 2 }
    ]
  },
  {
    id: 11,
    type: "technology",
    weight: 2,
    text: "L’IA t’intéresse surtout parce qu’elle permet :",
    options: [
      { text: "De construire plus vite", value: "builder", score: 2 },
      { text: "D’automatiser et optimiser des systèmes", value: "strategist", score: 2 },
      { text: "De créer de nouvelles expériences", value: "creator", score: 2 },
      { text: "D’amplifier les capacités humaines", value: "catalyst", score: 2 }
    ]
  },
  {
    id: 12,
    type: "identity",
    weight: 3,
    text: "Parmi ces phrases, laquelle te ressemble le plus ?",
    options: [
      { text: "J’aime transformer les idées en réalité.", value: "builder", score: 3 },
      { text: "J’aime comprendre ce que les autres ne voient pas.", value: "strategist", score: 3 },
      { text: "J’aime imaginer ce qui n’existe pas encore.", value: "creator", score: 3 },
      { text: "J’aime faire évoluer les gens autour de moi.", value: "catalyst", score: 3 }
    ]
  },
  {
    id: 13,
    type: "crisis",
    weight: 5,
    text: "Le projet le plus important de ton équipe risque d’échouer demain matin. Tu as une seule priorité. Que fais-tu ?",
    options: [
      { text: "Réparer immédiatement ce qui bloque", value: "builder", score: 5 },
      { text: "Revoir la stratégie globale pour sauver l’essentiel", value: "strategist", score: 5 },
      { text: "Trouver une solution inattendue ou alternative", value: "creator", score: 5 },
      { text: "Unir l’équipe pour éviter l’effondrement collectif", value: "catalyst", score: 5 }
    ]
  }
];
