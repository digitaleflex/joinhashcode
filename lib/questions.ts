export type Question = {
  id: number;
  text: string;
  type: string;
  weight: number;
  options: {
    text: string;
    value: string;
    score: number;
  }[];
};

export const questions: Question[] = [
  {
    id: 1,
    type: "identity",
    weight: 5,
    text: "Le projet le plus important de ton équipe risque d’échouer demain matin. Tu as une seule priorité. Que fais-tu ?",
    options: [
      { text: "Réparer immédiatement ce qui bloque", value: "builder", score: 5 },
      { text: "Revoir la stratégie globale pour sauver l’essentiel", value: "strategist", score: 5 },
      { text: "Trouver une solution inattendue ou alternative", value: "creator", score: 5 },
      { text: "Unir l’équipe pour éviter l’effondrement collectif", value: "catalyst", score: 5 }
    ]
  },
  {
    id: 2,
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
    id: 3,
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
    type: "identity",
    weight: 3,
    text: "Parmi ces phrases, laquelle te ressemble le plus ?",
    options: [
      { text: "J’aime transformer les idées en réalité.", value: "builder", score: 3 },
      { text: "J’aime comprendre ce que les autres ne voient pas.", value: "strategist", score: 3 },
      { text: "J’aime imaginer ce qui n’existe pas encore.", value: "creator", score: 3 },
      { text: "J’aime faire évoluer les gens autour de moi.", value: "catalyst", score: 3 }
    ]
  }
];
