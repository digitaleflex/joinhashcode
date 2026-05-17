import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import * as dotenv from "dotenv";

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const MISSIONS = [
  // ─── ONBOARDING (ALL PROFILES) ───────────────────────────────────────────

  {
    id: "introduction-ancrage",
    slug: "introduction-ancrage",
    title: "Ancrage Initial",
    shortDesc: "Pose ton identité dans la communauté.",
    description:
      "Avant toute chose, présente-toi. Qui es-tu, qu'est-ce que tu construis, et où veux-tu aller dans les 3 prochains mois ?",
    category: "community",
    difficulty: 1,
    xp: 25,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "30min",
    requirements: [
      "Décris ce que tu construis en une phrase.",
      "Partage ton objectif principal pour les 3 prochains mois.",
    ],
    weightBuilder: 0.1,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.7,
  },
  {
    id: "social-connection-protocol",
    slug: "social-connection-protocol",
    title: "Protocole de Connexion Globale",
    shortDesc: "Rejoins le réseau neuronal de HASHCODE.",
    description:
      "La force de HASHCODE réside dans sa communauté. Rejoins nos canaux officiels : Telegram, Discord et WhatsApp.",
    category: "community",
    difficulty: 1,
    xp: 50,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "15min",
    requirements: [
      "Rejoindre le canal Telegram @innovcode.",
      "Rejoindre le serveur Discord officiel.",
      "Rejoindre le groupe WhatsApp de ta communauté.",
    ],
    weightBuilder: 0.0,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.8,
  },

  // ─── BUILDER (B1 → B7) ───────────────────────────────────────────────────

  {
    id: "b1-first-commit",
    slug: "b1-first-commit",
    title: "Premier Commit",
    shortDesc: "Prouve ton engagement en partageant ton code.",
    description:
      "Ton premier test : montre-nous ce que tu construis techniquement. Crée ou partage un dépôt GitHub avec un README clair décrivant le projet.",
    category: "tech",
    difficulty: 1,
    xp: 100,
    targetProfiles: ["builder"],
    missionLevel: "INIT",
    duration: "2h",
    requirements: [
      "Lien GitHub avec README comprenant la description du projet.",
      "Au moins 1 commit visible.",
    ],
    weightBuilder: 0.8,
    weightCreator: 0.0,
    weightStrategist: 0.1,
    weightCatalyst: 0.1,
  },
  {
    id: "b2-working-feature",
    slug: "b2-working-feature",
    title: "Fonctionnalité Fonctionnelle",
    shortDesc: "Livre une feature complète, de A à Z.",
    description:
      "Choisis une fonctionnalité de ton projet (auth, CRUD, API, dashboard). Implémente-la, teste-la manuellement, et documente-la dans ton README.",
    category: "tech",
    difficulty: 2,
    xp: 200,
    targetProfiles: ["builder"],
    missionLevel: "INIT",
    duration: "4h",
    requirements: [
      "Lien vers le commit ou la PR qui ajoute la feature.",
      "README mis à jour avec instructions d'utilisation.",
    ],
    weightBuilder: 0.85,
    weightCreator: 0.05,
    weightStrategist: 0.05,
    weightCatalyst: 0.05,
  },
  {
    id: "b3-deploy-live",
    slug: "b3-deploy-live",
    title: "En Ligne",
    shortDesc: "Déploie ton projet sur internet.",
    description:
      "Un projet qui n'est pas en ligne n'existe pas. Déploie ton application sur Vercel, Railway, Render ou toute plateforme cloud et partage l'URL publique.",
    category: "tech",
    difficulty: 2,
    xp: 250,
    targetProfiles: ["builder"],
    missionLevel: "CORE",
    duration: "3h",
    requirements: [
      "URL publique du projet déployé et fonctionnel.",
      "Expliquer la stack de déploiement utilisée (1-2 phrases).",
    ],
    weightBuilder: 0.8,
    weightCreator: 0.05,
    weightStrategist: 0.1,
    weightCatalyst: 0.05,
  },
  {
    id: "b4-api-integration",
    slug: "b4-api-integration",
    title: "Intégration API Externe",
    shortDesc: "Connecte ton projet au monde réel.",
    description:
      "Intègre une API externe dans ton projet (paiement, carte, IA, météo, SMS...). Démontre un cas d'usage concret qui ajoute de la valeur réelle.",
    category: "tech",
    difficulty: 3,
    xp: 300,
    targetProfiles: ["builder"],
    missionLevel: "CORE",
    duration: "6h",
    requirements: [
      "Nom et documentation de l'API intégrée.",
      "Démonstration du flux fonctionnel (screen ou vidéo).",
    ],
    weightBuilder: 0.8,
    weightCreator: 0.0,
    weightStrategist: 0.1,
    weightCatalyst: 0.1,
  },
  {
    id: "b5-code-review",
    slug: "b5-code-review",
    title: "Code Review",
    shortDesc: "Améliore ton code avec un pair.",
    description:
      "Soumets ton code à un autre membre Builder pour une revue. Corrige au minimum 3 points identifiés. La qualité se construit ensemble.",
    category: "tech",
    difficulty: 3,
    xp: 350,
    targetProfiles: ["builder"],
    missionLevel: "CORE",
    duration: "4h",
    requirements: [
      "Lien vers la PR ou le thread de revue.",
      "Liste des 3 améliorations appliquées suite à la revue.",
    ],
    weightBuilder: 0.7,
    weightCreator: 0.0,
    weightStrategist: 0.1,
    weightCatalyst: 0.2,
  },
  {
    id: "b6-technical-doc",
    slug: "b6-technical-doc",
    title: "Documentation Technique",
    shortDesc: "Un bon code se lit, un grand code se comprend.",
    description:
      "Rédige la documentation technique de ton projet : architecture, choix techniques, guide d'installation, API reference. Rends-le utilisable par un inconnu.",
    category: "tech",
    difficulty: 4,
    xp: 400,
    targetProfiles: ["builder"],
    missionLevel: "PRO",
    duration: "5h",
    requirements: [
      "README ou Wiki couvrant architecture, setup et utilisation.",
      "Schéma d'architecture (diagramme ou texte structuré).",
    ],
    weightBuilder: 0.65,
    weightCreator: 0.15,
    weightStrategist: 0.15,
    weightCatalyst: 0.05,
  },
  {
    id: "b7-open-source",
    slug: "b7-open-source",
    title: "Contribution Open Source",
    shortDesc: "Participe à un projet qui compte pour tous.",
    description:
      "Fais une contribution significative à un projet open source : bug fix, feature, documentation ou test. Montre que tu codes pour l'écosystème, pas seulement pour toi.",
    category: "tech",
    difficulty: 5,
    xp: 500,
    targetProfiles: ["builder"],
    missionLevel: "PRO",
    duration: "8h",
    requirements: [
      "Lien vers la Pull Request fusionnée ou en revue.",
      "Contexte : quel problème résout ta contribution ?",
    ],
    weightBuilder: 0.8,
    weightCreator: 0.05,
    weightStrategist: 0.05,
    weightCatalyst: 0.1,
  },

  // ─── CREATOR (C1 → C7) ───────────────────────────────────────────────────

  {
    id: "c1-first-publication",
    slug: "c1-first-publication",
    title: "Première Publication",
    shortDesc: "Partage ton univers avec le monde.",
    description:
      "Publie un contenu original lié à ton expertise : article, post LinkedIn, thread Twitter, ou vidéo courte. Ta voix compte.",
    category: "design",
    difficulty: 1,
    xp: 100,
    targetProfiles: ["creator"],
    missionLevel: "INIT",
    duration: "2h",
    requirements: [
      "Lien vers le contenu publié (article, post, vidéo).",
      "Thème lié à la tech, au design ou à l'entrepreneuriat.",
    ],
    weightBuilder: 0.0,
    weightCreator: 0.8,
    weightStrategist: 0.1,
    weightCatalyst: 0.1,
  },
  {
    id: "c2-design-case-study",
    slug: "c2-design-case-study",
    title: "Case Study Design",
    shortDesc: "Documente ton processus de création.",
    description:
      "Présente un projet de design (UI, brand, motion) avec ton processus complet : problème, recherche, itérations, résultat final.",
    category: "design",
    difficulty: 2,
    xp: 200,
    targetProfiles: ["creator"],
    missionLevel: "INIT",
    duration: "4h",
    requirements: [
      "Lien vers le case study (Behance, Notion, PDF, ou site).",
      "Minimum 3 étapes du processus documentées.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.85,
    weightStrategist: 0.05,
    weightCatalyst: 0.05,
  },
  {
    id: "c3-ui-kit",
    slug: "c3-ui-kit",
    title: "Système de Design Personnel",
    shortDesc: "Crée les fondations visuelles d'un produit.",
    description:
      "Construis un design system minimal : couleurs, typographie, composants de base (boutons, inputs, cartes). Exportable et réutilisable.",
    category: "design",
    difficulty: 3,
    xp: 300,
    targetProfiles: ["creator"],
    missionLevel: "CORE",
    duration: "6h",
    requirements: [
      "Lien Figma ou autre outil avec le design system.",
      "Comprend : palette couleurs, typographie, 5+ composants.",
    ],
    weightBuilder: 0.1,
    weightCreator: 0.8,
    weightStrategist: 0.05,
    weightCatalyst: 0.05,
  },
  {
    id: "c4-content-series",
    slug: "c4-content-series",
    title: "Série de Contenu",
    shortDesc: "Construis une audience avec de la régularité.",
    description:
      "Publie une série cohérente de 5 contenus sur un même sujet en 2 semaines. La consistance bat la perfection.",
    category: "design",
    difficulty: 3,
    xp: 350,
    targetProfiles: ["creator"],
    missionLevel: "CORE",
    duration: "2 semaines",
    requirements: [
      "Liens vers les 5 publications.",
      "Thème unique et fil conducteur visible.",
    ],
    weightBuilder: 0.0,
    weightCreator: 0.75,
    weightStrategist: 0.1,
    weightCatalyst: 0.15,
  },
  {
    id: "c5-video-tutorial",
    slug: "c5-video-tutorial",
    title: "Tutoriel Vidéo",
    shortDesc: "Enseigne ce que tu sais faire.",
    description:
      "Crée un tutoriel vidéo (5-15 min) sur un outil, une technique ou un concept que tu maîtrises. Le meilleur moyen d'apprendre est d'enseigner.",
    category: "design",
    difficulty: 3,
    xp: 350,
    targetProfiles: ["creator"],
    missionLevel: "CORE",
    duration: "8h",
    requirements: [
      "Lien vers la vidéo publiée (YouTube, Loom, etc.).",
      "Description du concept enseigné.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.75,
    weightStrategist: 0.05,
    weightCatalyst: 0.15,
  },
  {
    id: "c6-brand-identity",
    slug: "c6-brand-identity",
    title: "Identité Visuelle Complète",
    shortDesc: "Crée une identité visuelle pour un projet réel.",
    description:
      "Développe l'identité visuelle complète d'un projet (personnel, communautaire ou client) : logo, palette, typographie, charte graphique.",
    category: "design",
    difficulty: 4,
    xp: 400,
    targetProfiles: ["creator"],
    missionLevel: "PRO",
    duration: "10h",
    requirements: [
      "Livrable : charte graphique ou brand book.",
      "Inclut logo, couleurs, typographie et usage.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.8,
    weightStrategist: 0.1,
    weightCatalyst: 0.05,
  },
  {
    id: "c7-creative-direction",
    slug: "c7-creative-direction",
    title: "Direction Créative",
    shortDesc: "Dirige la vision créative d'un projet collectif.",
    description:
      "Prends en charge la direction créative d'un projet d'équipe : définis la vision, coordonne les contributions visuelles, valide les livrables.",
    category: "design",
    difficulty: 5,
    xp: 500,
    targetProfiles: ["creator"],
    missionLevel: "PRO",
    duration: "2 semaines",
    requirements: [
      "Description du projet et de ton rôle de directeur créatif.",
      "Livrables finaux validés par l'équipe.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.7,
    weightStrategist: 0.1,
    weightCatalyst: 0.15,
  },

  // ─── STRATEGIST (S1 → S7) ─────────────────────────────────────────────────

  {
    id: "s1-market-analysis",
    slug: "s1-market-analysis",
    title: "Analyser un Marché en 1 Page",
    shortDesc: "Identifie les opportunités business.",
    description:
      "Rédige une analyse concise d'un marché qui t'intéresse : problème existant, acteurs en présence, opportunité identifiée.",
    category: "business",
    difficulty: 1,
    xp: 100,
    targetProfiles: ["strategist"],
    missionLevel: "INIT",
    duration: "3h",
    requirements: [
      "Document structuré : problème, acteurs, opportunité.",
      "Marché réel, pas hypothétique.",
    ],
    weightBuilder: 0.1,
    weightCreator: 0.0,
    weightStrategist: 0.8,
    weightCatalyst: 0.1,
  },
  {
    id: "s2-business-model",
    slug: "s2-business-model",
    title: "Business Model Canvas",
    shortDesc: "Structure la logique économique d'un projet.",
    description:
      "Complète un Business Model Canvas pour un projet réel (le tien ou un projet fictif solide). Chaque bloc doit être justifié, pas juste rempli.",
    category: "business",
    difficulty: 2,
    xp: 200,
    targetProfiles: ["strategist"],
    missionLevel: "INIT",
    duration: "4h",
    requirements: [
      "BMC rempli (9 blocs) en format image, PDF ou Notion.",
      "Annotation de tes 3 hypothèses les plus risquées.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.05,
    weightStrategist: 0.8,
    weightCatalyst: 0.1,
  },
  {
    id: "s3-gtm-strategy",
    slug: "s3-gtm-strategy",
    title: "Stratégie Go-to-Market",
    shortDesc: "Planifie le lancement d'un produit.",
    description:
      "Définis la stratégie de lancement d'un produit : segment cible, canal d'acquisition, message clé, métriques de succès pour les 90 premiers jours.",
    category: "business",
    difficulty: 3,
    xp: 300,
    targetProfiles: ["strategist"],
    missionLevel: "CORE",
    duration: "5h",
    requirements: [
      "Document GTM couvrant : cible, canal, message, métriques.",
      "Justification du canal d'acquisition choisi.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.05,
    weightStrategist: 0.8,
    weightCatalyst: 0.1,
  },
  {
    id: "s4-competitive-analysis",
    slug: "s4-competitive-analysis",
    title: "Analyse Concurrentielle",
    shortDesc: "Comprends le terrain avant d'avancer.",
    description:
      "Cartographie les concurrents d'un marché : leurs forces, faiblesses, positionnement, et l'espace laissé libre pour se différencier.",
    category: "business",
    difficulty: 3,
    xp: 300,
    targetProfiles: ["strategist"],
    missionLevel: "CORE",
    duration: "5h",
    requirements: [
      "Analyse d'au moins 5 concurrents directs ou indirects.",
      "Tableau comparatif + opportunité de différenciation identifiée.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.05,
    weightStrategist: 0.8,
    weightCatalyst: 0.1,
  },
  {
    id: "s5-product-roadmap",
    slug: "s5-product-roadmap",
    title: "Roadmap Produit",
    shortDesc: "Planifie l'évolution d'un produit sur 6 mois.",
    description:
      "Crée une roadmap produit réaliste pour 6 mois : priorise les fonctionnalités selon l'impact et la faisabilité, organise les sprints ou phases.",
    category: "business",
    difficulty: 4,
    xp: 400,
    targetProfiles: ["strategist"],
    missionLevel: "CORE",
    duration: "6h",
    requirements: [
      "Roadmap visuelle (Notion, Figma, ou tableau).",
      "Justification de la priorisation (impact vs effort).",
    ],
    weightBuilder: 0.1,
    weightCreator: 0.05,
    weightStrategist: 0.75,
    weightCatalyst: 0.1,
  },
  {
    id: "s6-financial-model",
    slug: "s6-financial-model",
    title: "Modèle Financier Simplifié",
    shortDesc: "Mets des chiffres sur ta vision.",
    description:
      "Construis un modèle financier pour un projet : revenus projetés, coûts opérationnels, point d'équilibre, et besoins de financement pour 12 mois.",
    category: "business",
    difficulty: 4,
    xp: 400,
    targetProfiles: ["strategist"],
    missionLevel: "PRO",
    duration: "8h",
    requirements: [
      "Tableau ou spreadsheet avec projections sur 12 mois.",
      "Hypothèses clairement documentées.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.0,
    weightStrategist: 0.85,
    weightCatalyst: 0.1,
  },
  {
    id: "s7-pitch-deck",
    slug: "s7-pitch-deck",
    title: "Pitch Deck",
    shortDesc: "Convaincs en 10 slides.",
    description:
      "Crée un pitch deck de 10-12 slides pour un projet : problème, solution, marché, business model, traction, équipe, et ask. Teste-le devant au moins 2 personnes.",
    category: "business",
    difficulty: 5,
    xp: 500,
    targetProfiles: ["strategist"],
    missionLevel: "PRO",
    duration: "12h",
    requirements: [
      "Lien vers le pitch deck (Google Slides, Canva, etc.).",
      "Retour de 2 personnes ayant assisté à la présentation.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.1,
    weightStrategist: 0.75,
    weightCatalyst: 0.1,
  },

  // ─── CATALYST (K1 → K7) ───────────────────────────────────────────────────

  {
    id: "k1-introduction",
    slug: "k1-introduction",
    title: "Introduire 2 Personnes",
    shortDesc: "Crée de la valeur par la mise en relation.",
    description:
      "Connecte deux membres de la communauté qui peuvent s'apporter mutuellement. Présente-les avec contexte et raison.",
    category: "community",
    difficulty: 1,
    xp: 100,
    targetProfiles: ["catalyst"],
    missionLevel: "INIT",
    duration: "1h",
    requirements: [
      "Témoignage ou confirmation des 2 personnes connectées.",
      "Contexte de la mise en relation (pourquoi ces 2 personnes).",
    ],
    weightBuilder: 0.1,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.7,
  },
  {
    id: "k2-online-event",
    slug: "k2-online-event",
    title: "Organiser un Événement en Ligne",
    shortDesc: "Rassemble la communauté autour d'un sujet.",
    description:
      "Organise et anime un événement en ligne (AMA, workshop, débat, session Q&A) avec minimum 10 participants actifs.",
    category: "community",
    difficulty: 2,
    xp: 200,
    targetProfiles: ["catalyst"],
    missionLevel: "INIT",
    duration: "1 semaine",
    requirements: [
      "Preuve de l'événement (recording, screenshots, rapport).",
      "Nombre de participants et résumé du sujet traité.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.75,
  },
  {
    id: "k3-mentoring-session",
    slug: "k3-mentoring-session",
    title: "Session de Mentorat",
    shortDesc: "Transmets ce que tu sais à quelqu'un qui débute.",
    description:
      "Donne une session de mentorat de 45-60 minutes à un membre moins avancé. Prépare un agenda, guide la conversation, partage des ressources.",
    category: "community",
    difficulty: 2,
    xp: 250,
    targetProfiles: ["catalyst"],
    missionLevel: "CORE",
    duration: "2h",
    requirements: [
      "Confirmation du mentoré et résumé de la session.",
      "Ressources ou plan d'action partagé avec le mentoré.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.05,
    weightStrategist: 0.15,
    weightCatalyst: 0.75,
  },
  {
    id: "k4-community-challenge",
    slug: "k4-community-challenge",
    title: "Lancer un Challenge Communautaire",
    shortDesc: "Inspire les autres à passer à l'action.",
    description:
      "Crée et lance un challenge de 7 jours pour la communauté. Définis les règles, anime la progression, et fête les participants qui terminent.",
    category: "community",
    difficulty: 3,
    xp: 350,
    targetProfiles: ["catalyst"],
    missionLevel: "CORE",
    duration: "10 jours",
    requirements: [
      "Description du challenge et règles publiées.",
      "Minimum 5 participants qui ont complété le challenge.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.75,
  },
  {
    id: "k5-partnership",
    slug: "k5-partnership",
    title: "Créer un Partenariat",
    shortDesc: "Construis un pont entre deux entités.",
    description:
      "Identifie et concrétise un partenariat entre HASHCODE ou un projet membre et une organisation externe (école, entreprise, communauté).",
    category: "community",
    difficulty: 4,
    xp: 400,
    targetProfiles: ["catalyst"],
    missionLevel: "PRO",
    duration: "2 semaines",
    requirements: [
      "Description du partenariat et des parties impliquées.",
      "Résultat concret : accord, échange, collaboration documentée.",
    ],
    weightBuilder: 0.05,
    weightCreator: 0.05,
    weightStrategist: 0.2,
    weightCatalyst: 0.7,
  },
  {
    id: "k6-ambassador-program",
    slug: "k6-ambassador-program",
    title: "Programme d'Ambassadeurs",
    shortDesc: "Étends le réseau en recrutant des représentants.",
    description:
      "Recrute et onboarde 3 nouveaux membres via ton réseau personnel. Accompagne-les dans leurs 2 premières semaines.",
    category: "community",
    difficulty: 4,
    xp: 450,
    targetProfiles: ["catalyst"],
    missionLevel: "PRO",
    duration: "3 semaines",
    requirements: [
      "Usernames des 3 nouveaux membres recrutés.",
      "Confirmation qu'ils ont complété l'onboarding.",
    ],
    weightBuilder: 0.0,
    weightCreator: 0.05,
    weightStrategist: 0.1,
    weightCatalyst: 0.85,
  },
  {
    id: "k7-impact-report",
    slug: "k7-impact-report",
    title: "Rapport d'Impact Communautaire",
    shortDesc: "Mesure et raconte ce que tu as construit.",
    description:
      "Rédige un rapport documentant ton impact sur la communauté : connexions créées, événements organisés, membres aidés, valeur générée.",
    category: "community",
    difficulty: 5,
    xp: 500,
    targetProfiles: ["catalyst"],
    missionLevel: "PRO",
    duration: "5h",
    requirements: [
      "Rapport structuré avec données chiffrées.",
      "Témoignages de membres impactés.",
    ],
    weightBuilder: 0.0,
    weightCreator: 0.15,
    weightStrategist: 0.1,
    weightCatalyst: 0.75,
  },

  // ─── HYBRID CHALLENGES (H1 → H3) ─────────────────────────────────────────

  {
    id: "h1-hackathon-48h",
    slug: "h1-hackathon-48h",
    title: "Hackathon 48h",
    shortDesc: "Construis, crée, stratégie — ensemble.",
    description:
      "Forme une équipe de 2-4 profils différents et construis un prototype fonctionnel en 48h. Pitch le résultat à la communauté.",
    category: "community",
    difficulty: 4,
    xp: 600,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "48h",
    requirements: [
      "Composition de l'équipe (minimum 2 profils différents).",
      "Lien vers le prototype ou la démo.",
      "Lien vers le pitch (slides ou vidéo).",
    ],
    weightBuilder: 0.3,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.2,
  },
  {
    id: "h2-cross-profile-collab",
    slug: "h2-cross-profile-collab",
    title: "Collaboration Cross-Profil",
    shortDesc: "Travaille avec quelqu'un de complètement différent.",
    description:
      "Collabore avec un membre d'un profil opposé au tien sur un projet commun pendant 2 semaines. Documente ce que tu as appris de cette collaboration.",
    category: "community",
    difficulty: 3,
    xp: 400,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "2 semaines",
    requirements: [
      "Profil du collaborateur et nature du projet.",
      "Livrable commun + retour d'expérience sur la collaboration.",
    ],
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
  },
  {
    id: "h3-community-project",
    slug: "h3-community-project",
    title: "Projet Communautaire",
    shortDesc: "Crée quelque chose pour la communauté HASHCODE.",
    description:
      "Initie ou co-construis un projet qui bénéficie directement à la communauté : ressource, outil, guide, événement ou initiative à impact collectif.",
    category: "community",
    difficulty: 4,
    xp: 500,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "PRO",
    duration: "3 semaines",
    requirements: [
      "Description du projet et de son impact communautaire.",
      "Livrable accessible à tous les membres.",
    ],
    weightBuilder: 0.2,
    weightCreator: 0.25,
    weightStrategist: 0.2,
    weightCatalyst: 0.35,
  },
];

const GUILDS = [
  {
    slug: "builders",
    name: "Guild des Builders",
    description:
      "Les architectes du code. Développeurs, ingénieurs et bâtisseurs de produits techniques.",
    requiredLevel: 1,
  },
  {
    slug: "creators",
    name: "Guild des Créateurs",
    description:
      "Les artisans du visuel et du récit. Designers, vidéastes et créateurs de contenu.",
    requiredLevel: 1,
  },
  {
    slug: "strategists",
    name: "Guild des Stratèges",
    description:
      "Les architectes de la croissance. Business developers, product managers et growth hackers.",
    requiredLevel: 1,
  },
  {
    slug: "catalysts",
    name: "Guild des Catalyseurs",
    description:
      "Les connecteurs humains. Community managers, mentors et ambassadeurs du réseau.",
    requiredLevel: 1,
  },
];

async function main() {
  console.log("🌱 Seeding database...\n");

  console.log("📋 Upserting missions...");
  for (const mission of MISSIONS) {
    await prisma.mission.upsert({
      where: { id: mission.id },
      update: {
        title: mission.title,
        shortDesc: mission.shortDesc,
        description: mission.description,
        slug: mission.slug,
        category: mission.category,
        difficulty: mission.difficulty,
        xp: mission.xp,
        targetProfiles: mission.targetProfiles,
        missionLevel: mission.missionLevel,
        requirements: mission.requirements,
        duration: mission.duration ?? null,
        weightBuilder: mission.weightBuilder,
        weightCreator: mission.weightCreator,
        weightStrategist: mission.weightStrategist,
        weightCatalyst: mission.weightCatalyst,
      },
      create: mission,
    });
    console.log(`  ✓ [${mission.missionLevel}] ${mission.title} (${mission.id})`);
  }

  console.log("\n🏰 Upserting guilds...");
  for (const guild of GUILDS) {
    await prisma.guild.upsert({
      where: { slug: guild.slug },
      update: {
        name: guild.name,
        description: guild.description,
        requiredLevel: guild.requiredLevel,
      },
      create: guild,
    });
    console.log(`  ✓ ${guild.name}`);
  }

  console.log("\n✅ Seed complete.");
  console.log(`   ${MISSIONS.length} missions seeded`);
  console.log(`   ${GUILDS.length} guilds seeded`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
