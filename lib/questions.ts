export type Question = {
  id: number;
  text: string;
  options: {
    text: string;
    value: string; // profile key
  }[];
};

export const questions: Question[] = [
  {
    id: 1,
    text: "Face à un nouveau projet, quelle est ta première réaction ?",
    options: [
      { text: "Je commence à coder ou à construire un prototype", value: "builder" },
      { text: "Je dessine l'interface ou je pense à l'expérience utilisateur", value: "creator" },
      { text: "J'analyse le marché et la viabilité économique", value: "strategist" },
      { text: "Je cherche qui pourrait m'aider ou à qui le vendre", value: "catalyst" },
    ],
  },
  {
    id: 2,
    text: "Quel outil préfères-tu utiliser ?",
    options: [
      { text: "Un terminal VS Code ou un IDE puissant", value: "builder" },
      { text: "Figma, Canva ou un logiciel de montage", value: "creator" },
      { text: "Notion, Excel ou un outil de gestion de projet", value: "strategist" },
      { text: "LinkedIn, Discord ou un CRM", value: "catalyst" },
    ],
  },
  {
    id: 3,
    text: "Qu'est-ce qui te passionne le plus ?",
    options: [
      { text: "Résoudre des problèmes complexes d'algorithmique", value: "builder" },
      { text: "Créer quelque chose de visuellement époustouflant", value: "creator" },
      { text: "Optimiser des processus et faire croître une idée", value: "strategist" },
      { text: "Fédérer des gens autour d'une vision commune", value: "catalyst" },
    ],
  },
  // Adding more questions to reach 20 as advertised
  {
    id: 4,
    text: "Comment décrirais-tu ton espace de travail idéal ?",
    options: [
      { text: "Plusieurs écrans, un clavier mécanique, beaucoup de code", value: "builder" },
      { text: "Un espace esthétique, inspirant, avec des outils créatifs", value: "creator" },
      { text: "Un bureau organisé, avec des tableaux de bord et des objectifs clairs", value: "strategist" },
      { text: "Un lieu vivant, propice aux échanges et aux rencontres", value: "catalyst" },
    ],
  },
  {
    id: 5,
    text: "En équipe, tu es celui/celle qui...",
    options: [
      { text: "Produit le travail technique le plus solide", value: "builder" },
      { text: "Apporte la touche créative et l'originalité", value: "creator" },
      { text: "Définit la direction et s'assure de l'efficacité", value: "strategist" },
      { text: "Maintient la cohésion et gère les relations externes", value: "catalyst" },
    ],
  },
  {
    id: 6,
    text: "Quel type de contenu consommes-tu le plus ?",
    options: [
      { text: "Documentation technique, tutoriels avancés", value: "builder" },
      { text: "Portfolios, études de cas design, tendances visuelles", value: "creator" },
      { text: "Analyses business, podcasts sur l'entrepreneuriat", value: "strategist" },
      { text: "Networking, actualités communautaires, psychologie sociale", value: "catalyst" },
    ],
  },
  {
    id: 7,
    text: "Quelle est ta plus grande force ?",
    options: [
      { text: "Ma capacité d'exécution technique", value: "builder" },
      { text: "Mon intuition créative et esthétique", value: "creator" },
      { text: "Ma vision analytique et stratégique", value: "strategist" },
      { text: "Mon aisance relationnelle et mon réseau", value: "catalyst" },
    ],
  },
  {
    id: 8,
    text: "Comment gères-tu l'échec ?",
    options: [
      { text: "Je debug, je cherche l'erreur logique et je recommence", value: "builder" },
      { text: "Je pivote visuellement ou je cherche une nouvelle inspiration", value: "creator" },
      { text: "J'analyse les données pour comprendre ce qui a foiré", value: "strategist" },
      { text: "Je demande du feedback à mes pairs pour m'améliorer", value: "catalyst" },
    ],
  },
  {
    id: 9,
    text: "Quel est ton objectif ultime ?",
    options: [
      { text: "Bâtir un système robuste et scalable", value: "builder" },
      { text: "Laisser une trace visuelle ou culturelle marquante", value: "creator" },
      { text: "Construire un empire ou une entreprise pérenne", value: "strategist" },
      { text: "Impacter positivement le plus grand nombre de personnes", value: "catalyst" },
    ],
  },
  {
    id: 10,
    text: "Si tu devais choisir une seule compétence à maîtriser parfaitement :",
    options: [
      { text: "L'architecture logicielle", value: "builder" },
      { text: "Le storytelling visuel", value: "creator" },
      { text: "La finance et l'optimisation", value: "strategist" },
      { text: "La négociation et l'influence", value: "catalyst" },
    ],
  },
  {
    id: 11,
    text: "Quel genre de projet te motive le plus ?",
    options: [
      { text: "Un défi technique jamais relevé auparavant", value: "builder" },
      { text: "Un projet qui permet une totale liberté d'expression", value: "creator" },
      { text: "Un projet avec un fort potentiel de croissance", value: "strategist" },
      { text: "Un projet qui rassemble une communauté passionnée", value: "catalyst" },
    ],
  },
  {
    id: 12,
    text: "Face à une deadline serrée, tu...",
    options: [
      { text: "Je m'enferme et je produis jusqu'à ce que ce soit fini", value: "builder" },
      { text: "Je me concentre sur l'essentiel pour garder l'impact visuel", value: "creator" },
      { text: "Je délègue ou je priorise les tâches à haute valeur", value: "strategist" },
      { text: "Je mobilise l'équipe pour qu'on y arrive ensemble", value: "catalyst" },
    ],
  },
  {
    id: 13,
    text: "Quelle est ta relation avec l'intelligence artificielle ?",
    options: [
      { text: "Je l'utilise pour automatiser mon code et mes tests", value: "builder" },
      { text: "Je l'utilise comme muse pour générer des concepts", value: "creator" },
      { text: "Je l'utilise pour analyser des volumes de données", value: "strategist" },
      { text: "Je l'utilise pour personnaliser mes communications", value: "catalyst" },
    ],
  },
  {
    id: 14,
    text: "Quel mot te définit le mieux ?",
    options: [
      { text: "Précision", value: "builder" },
      { text: "Émotion", value: "creator" },
      { text: "Efficacité", value: "strategist" },
      { text: "Connexion", value: "catalyst" },
    ],
  },
  {
    id: 15,
    text: "Quand tu navigues sur le web, qu'est-ce qui t'agace le plus ?",
    options: [
      { text: "Un site lent ou plein de bugs", value: "builder" },
      { text: "Un design daté ou peu ergonomique", value: "creator" },
      { text: "Un parcours utilisateur confus ou inutilement long", value: "strategist" },
      { text: "L'absence de moyens de contacter un humain", value: "catalyst" },
    ],
  },
  {
    id: 16,
    text: "Comment préfères-tu apprendre ?",
    options: [
      { text: "En pratiquant et en cassant des choses", value: "builder" },
      { text: "En observant des exemples inspirants", value: "creator" },
      { text: "En étudiant des structures et des modèles", value: "strategist" },
      { text: "En échangeant avec des mentors et des experts", value: "catalyst" },
    ],
  },
  {
    id: 17,
    text: "Quelle est ta vision du succès ?",
    options: [
      { text: "Avoir créé un outil indispensable", value: "builder" },
      { text: "Avoir été reconnu pour son style unique", value: "creator" },
      { text: "Avoir atteint l'indépendance financière totale", value: "strategist" },
      { text: "Avoir aidé des milliers de gens à se connecter", value: "catalyst" },
    ],
  },
  {
    id: 18,
    text: "Dans un jeu vidéo, tu choisis souvent :",
    options: [
      { text: "L'ingénieur ou celui qui fabrique des objets", value: "builder" },
      { text: "Le personnage avec les plus beaux effets visuels", value: "creator" },
      { text: "Le chef de guilde ou le tacticien", value: "strategist" },
      { text: "Le diplomate ou le soigneur d'équipe", value: "catalyst" },
    ],
  },
  {
    id: 19,
    text: "Ta plus grande peur professionnelle ?",
    options: [
      { text: "L'obsolescence technique", value: "builder" },
      { text: "Le manque d'inspiration", value: "creator" },
      { text: "La stagnation économique", value: "strategist" },
      { text: "L'isolement social", value: "catalyst" },
    ],
  },
  {
    id: 20,
    text: "Enfin, si HASHCODE était une porte, elle mènerait vers :",
    options: [
      { text: "Un laboratoire d'innovation", value: "builder" },
      { text: "Une galerie d'art futuriste", value: "creator" },
      { text: "Une salle de commandement mondiale", value: "strategist" },
      { text: "Un forum vibrant d'échanges", value: "catalyst" },
    ],
  },
];
