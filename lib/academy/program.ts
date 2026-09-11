export const PROGRESSION_STEPS = [
    { step: "Learn", label: "Comprendre les concepts", validation: "Quiz" },
    { step: "Practice", label: "Réaliser des exercices", validation: "Exercices corrigés" },
    { step: "Build", label: "Construire un projet", validation: "Projet" },
    { step: "Review", label: "Recevoir du feedback", validation: "Code Review" },
    { step: "Improve", label: "Corriger et optimiser", validation: "Audit" },
    { step: "Validate", label: "Démontrer la maîtrise", validation: "Soutenance" },
    { step: "Share", label: "Transmettre aux autres", validation: "Présentation ou mentorat" },
] as const;

export const MASTERY_LEVELS = [
    { level: "Explorer", description: "Découvre les concepts" },
    { level: "Practitioner", description: "Les applique correctement" },
    { level: "Builder", description: "Réalise des projets autonomes" },
    { level: "Engineer", description: "Conçoit des systèmes robustes" },
    { level: "Architect", description: "Définit des architectures complètes" },
    { level: "Mentor", description: "Forme et accompagne les autres" },
] as const;

export const WORKSHOP_FORMAT = [
    { part: "Introduction", duration: 15, description: "Objectifs et contexte" },
    { part: "Théorie", duration: 45, description: "Concepts essentiels" },
    { part: "Démonstration", duration: 30, description: "Exemple guidé" },
    { part: "Atelier", duration: 90, description: "Mise en pratique" },
    { part: "Pause", duration: 15, description: "—" },
    { part: "Lab", duration: 120, description: "Résolution de cas réel" },
    { part: "Présentation", duration: 30, description: "Débrief collectif" },
    { part: "Défis", duration: 30, description: "Exercices bonus" },
] as const;

export const EVALUATION_WEIGHTS = [
    { criterion: "Compréhension théorique", weight: 15 },
    { criterion: "Qualité du code", weight: 25 },
    { criterion: "Architecture", weight: 20 },
    { criterion: "Sécurité", weight: 10 },
    { criterion: "Tests", weight: 10 },
    { criterion: "Documentation", weight: 10 },
    { criterion: "Présentation", weight: 10 },
] as const;

export const PILLAR_STRUCTURE = [
    "Vision",
    "Objectifs pédagogiques",
    "Prérequis",
    "Théorie",
    "Démonstrations",
    "Ateliers",
    "Labs",
    "Quiz",
    "Projet",
    "Revue de code",
    "Soutenance",
    "Badge",
    "Ressources",
    "Checklist",
] as const;
