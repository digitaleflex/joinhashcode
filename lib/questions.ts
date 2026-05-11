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
    text: "Quel outil préfères-tu utiliser au quotidien ?",
    options: [
      { text: "Un terminal VS Code ou un IDE puissant", value: "builder" },
      { text: "Figma, Canva ou un logiciel créatif", value: "creator" },
      { text: "Notion, Excel ou un outil de gestion", value: "strategist" },
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
  {
    id: 4,
    text: "En équipe, tu es celui/celle qui...",
    options: [
      { text: "Produit le travail technique le plus solide", value: "builder" },
      { text: "Apporte la touche créative et l'originalité", value: "creator" },
      { text: "Définit la direction et s'assure de l'efficacité", value: "strategist" },
      { text: "Maintient la cohésion et gère les relations", value: "catalyst" },
    ],
  },
  {
    id: 5,
    text: "Quel type de contenu consommes-tu le plus ?",
    options: [
      { text: "Documentation technique, tutoriels avancés", value: "builder" },
      { text: "Portfolios, tendances design, études de cas", value: "creator" },
      { text: "Analyses business, podcasts entrepreneuriat", value: "strategist" },
      { text: "Networking, actualités communautaires", value: "catalyst" },
    ],
  },
  {
    id: 6,
    text: "Quelle est ta plus grande force innée ?",
    options: [
      { text: "Ma capacité d'exécution technique", value: "builder" },
      { text: "Mon intuition créative et esthétique", value: "creator" },
      { text: "Ma vision analytique et stratégique", value: "strategist" },
      { text: "Mon aisance relationnelle et mon réseau", value: "catalyst" },
    ],
  },
  {
    id: 7,
    text: "Comment gères-tu un échec ou un blocage ?",
    options: [
      { text: "Je debug, je cherche l'erreur logique", value: "builder" },
      { text: "Je pivote visuellement, je cherche une inspiration", value: "creator" },
      { text: "J'analyse les données pour comprendre l'échec", value: "strategist" },
      { text: "Je demande du feedback à mes pairs", value: "catalyst" },
    ],
  },
  {
    id: 8,
    text: "Quel est ton objectif professionnel ultime ?",
    options: [
      { text: "Bâtir un système robuste et scalable", value: "builder" },
      { text: "Laisser une trace visuelle ou culturelle", value: "creator" },
      { text: "Construire une entreprise pérenne et rentable", value: "strategist" },
      { text: "Impacter positivement une large communauté", value: "catalyst" },
    ],
  },
  {
    id: 9,
    text: "Si tu devais choisir une seule super-compétence :",
    options: [
      { text: "L'architecture logicielle parfaite", value: "builder" },
      { text: "Le storytelling visuel hypnotique", value: "creator" },
      { text: "La finance et l'optimisation de croissance", value: "strategist" },
      { text: "La négociation et l'influence sociale", value: "catalyst" },
    ],
  },
  {
    id: 10,
    text: "Quel genre de projet te fait vibrer ?",
    options: [
      { text: "Un défi technique complexe et inédit", value: "builder" },
      { text: "Un projet avec une totale liberté créative", value: "creator" },
      { text: "Un projet à fort potentiel de scaling", value: "strategist" },
      { text: "Un projet qui unit une communauté vibrante", value: "catalyst" },
    ],
  },
  {
    id: 11,
    text: "Quand tu navigues sur le web, qu'est-ce qui t'agace ?",
    options: [
      { text: "Un site lent ou plein de bugs", value: "builder" },
      { text: "Un design daté ou peu ergonomique", value: "creator" },
      { text: "Un parcours utilisateur confus ou long", value: "strategist" },
      { text: "L'impossibilité de contacter un humain", value: "catalyst" },
    ],
  },
  {
    id: 12,
    text: "Si HASHCODE était une porte, elle mènerait vers :",
    options: [
      { text: "Un laboratoire d'innovation brute", value: "builder" },
      { text: "Une galerie d'art numérique futuriste", value: "creator" },
      { text: "Une salle de commandement stratégique", value: "strategist" },
      { text: "Un forum vibrant de connexions", value: "catalyst" },
    ],
  },
];
