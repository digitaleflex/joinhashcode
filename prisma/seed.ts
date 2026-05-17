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
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Bio du profil", "Objectif principal à 3 mois"],
    fullBriefing: `
# Mission : Ancrage Initial

Bienvenue dans la communauté HASHCODE. Avant toute chose, présente-toi. Qui es-tu, qu'est-ce que tu construis, et où veux-tu aller dans les 3 prochains mois ?

### Instructions
1. Décris ce que tu construis en une phrase percutante.
2. Partage ton objectif principal pour les 3 prochains mois.
3. Rédige une courte bio (2-3 lignes) qui sera affichée sur ton profil.

### Critères de validation
- Réponse claire et structurée.
- Objectif SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporel).
    `,
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
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Pseudos Telegram/Discord", "Capture d'écran (optionnel)"],
    fullBriefing: `
# Mission : Protocole de Connexion Globale

La force de HASHCODE réside dans son intelligence collective. Pour ne rien manquer et commencer à collaborer, tu dois intégrer nos canaux de communication.

### Instructions
1. Rejoins le canal Telegram **@innovcode** pour les annonces officielles.
2. Intègre le serveur **Discord officiel** pour les échanges techniques et créatifs.
3. Rejoins le **groupe WhatsApp** de ta cohorte ou communauté locale.

### Critères de validation
- Confirmation de ton identifiant sur ces plateformes.
    `,
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
    submissionMethod: "GITHUB_LINK",
    deliverables: ["Lien du dépôt GitHub", "Fichier README.md documenté"],
    fullBriefing: `
# Mission : Premier Commit

L'objectif de cette mission est d'initier ton parcours technique sur HASHCODE en livrant ton premier dépôt officiel.

### Instructions
1. Crée un nouveau dépôt sur GitHub.
2. Initialise-le avec un fichier README.md décrivant ton projet (Le "Pourquoi", le "Comment", le "Quoi").
3. Fais ton premier commit et push sur la branche principale.

### Critères de validation
- Le code doit être accessible publiquement sur GitHub.
- Le README doit expliquer clairement l'utilité du projet.
    `,
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
    submissionMethod: "GITHUB_PR",
    deliverables: ["Lien de la PR ou du Commit spécifique", "Documentation de la feature"],
    fullBriefing: `
# Mission : Fonctionnalité Fonctionnelle

Passe de l'idée à la réalisation. Tu dois livrer une brique fonctionnelle de ton application.

### Instructions
1. Identifie une fonctionnalité atomique (ex: système de login, création de profil, appel API).
2. Implémente le code nécessaire.
3. Teste ton implémentation.
4. Documente comment utiliser ou tester cette feature dans ton README.

### Critères de validation
- Code propre et fonctionnel.
- Documentation succincte mais efficace.
    `,
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
    submissionMethod: "LIVE_URL",
    deliverables: ["URL publique du projet", "Courte description de la stack de déploiement"],
    fullBriefing: `
# Mission : En Ligne

"If it's not live, it doesn't exist." Ton projet doit maintenant sortir de ta machine locale pour être accessible au monde entier.

### Instructions
1. Choisis une plateforme de déploiement (Vercel, Railway, Netlify, Render, etc.).
2. Configure ton déploiement (variables d'environnement, build commands).
3. Déploie ton projet et vérifie que tout fonctionne en production.

### Critères de validation
- L'URL doit être accessible publiquement.
- Pas d'erreurs critiques au chargement de la page.
    `,
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
    submissionMethod: "DEMO_VIDEO_OR_LINK",
    deliverables: ["Lien vers le code de l'intégration", "Vidéo démo ou URL d'une page test"],
    fullBriefing: `
# Mission : Intégration API Externe

Ouvre ton application sur le monde extérieur. Utilise des services tiers pour enrichir l'expérience utilisateur.

### Instructions
1. Sélectionne une API (OpenAI, Stripe, Google Maps, Twilio, etc.).
2. Gère l'authentification et les appels API de manière sécurisée (côté serveur de préférence).
3. Affiche les données ou exécute l'action dans ton interface.

### Critères de validation
- Utilisation sécurisée des clés d'API (pas de clés en clair dans le frontend public).
- Cas d'usage fonctionnel.
    `,
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
    submissionMethod: "GITHUB_PR",
    deliverables: ["Lien de la PR avec commentaires", "Résumé des corrections effectuées"],
    fullBriefing: `
# Mission : Code Review

La qualité technique ne se négocie pas. Apprends à donner et recevoir du feedback constructif.

### Instructions
1. Ouvre une Pull Request sur ton dépôt.
2. Demande à un autre membre du profil **Builder** de relire ton code.
3. Prends en compte les remarques et effectue au moins 3 corrections ou optimisations.

### Critères de validation
- Présence de commentaires constructifs.
- Améliorations visibles dans l'historique des commits.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Lien vers la documentation (README, Wiki, ou Notion)", "Schéma d'architecture"],
    fullBriefing: `
# Mission : Documentation Technique

Un projet sans documentation est un projet mort. Transmets la connaissance nécessaire pour maintenir ton code.

### Instructions
1. Rédige un guide d'installation complet (Setup local).
2. Explique l'architecture globale (Frontend, Backend, Database).
3. Documente les principaux endpoints ou composants.
4. Ajoute un schéma d'architecture (utilise Mermaid.js ou un outil visuel).

### Critères de validation
- Documentation claire et sans fautes.
- Un développeur externe doit pouvoir lancer le projet en moins de 10 minutes.
    `,
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
    submissionMethod: "GITHUB_PR",
    deliverables: ["Lien vers la Pull Request externe", "Rapport de contribution (Pourquoi/Comment)"],
    fullBriefing: `
# Mission : Contribution Open Source

Donne en retour à la communauté globale. La maîtrise technique s'exprime aussi par la collaboration sur des outils partagés.

### Instructions
1. Trouve un projet open source qui t'intéresse.
2. Identifie une "Good First Issue" ou propose une amélioration.
3. Soumets ta Pull Request en respectant les conventions du projet.

### Critères de validation
- La PR doit être sérieuse et documentée.
- Même si elle n'est pas encore fusionnée, elle doit montrer un effort réel de résolution de problème.
    `,
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
    submissionMethod: "SOCIAL_LINK",
    deliverables: ["Lien vers la publication publique"],
    fullBriefing: `
# Mission : Première Publication

En tant que Créateur, ta valeur réside dans ta capacité à synthétiser et partager des idées.

### Instructions
1. Choisis un sujet qui te passionne (design, tech, productivité).
2. Rédige un post structuré ou crée une vidéo courte.
3. Publie-le sur LinkedIn, Twitter (X), ou ton blog personnel.

### Critères de validation
- Contenu original.
- Engagement minimal ou structure claire.
    `,
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
    submissionMethod: "PORTFOLIO_LINK",
    deliverables: ["Lien vers le Case Study"],
    fullBriefing: `
# Mission : Case Study Design

Le résultat final est important, mais c'est ton processus de réflexion qui prouve ton expertise.

### Instructions
1. Sélectionne un projet récent.
2. Documente les étapes : Problématique, Recherche utilisateur, Wireframes, Design visuel, et Tests.
3. Publie-le sur Behance, Notion ou ton portfolio.

### Critères de validation
- Analyse critique présente.
- Visuels de haute qualité.
    `,
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
    submissionMethod: "FIGMA_LINK",
    deliverables: ["Lien du fichier Figma public"],
    fullBriefing: `
# Mission : Système de Design Personnel

L'efficacité d'un créateur passe par ses outils. Crée ton propre langage visuel.

### Instructions
1. Définis une palette chromatique et une échelle typographique.
2. Crée les composants atomiques (boutons, formulaires, cartes).
3. Organise ton fichier Figma pour qu'il soit réutilisable par un développeur.

### Critères de validation
- Utilisation des styles et composants Figma.
- Cohérence visuelle globale.
    `,
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
    submissionMethod: "ANY_LINK",
    deliverables: ["Liste des 5 liens de publication"],
    fullBriefing: `
# Mission : Série de Contenu

La régularité est la clé de la croissance. Prouve ta discipline sur 14 jours.

### Instructions
1. Définis un angle d'attaque (ex: "10 jours pour apprendre Rust").
2. Publie un contenu tous les 2-3 jours.
3. Assure-toi que chaque post apporte une valeur unique tout en restant dans le thème.

### Critères de validation
- 5 publications effectives.
- Unité thématique respectée.
    `,
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
    submissionMethod: "VIDEO_LINK",
    deliverables: ["Lien vers la vidéo (YouTube, Loom, etc.)"],
    fullBriefing: `
# Mission : Tutoriel Vidéo

Transmets ton savoir. La pédagogie est une compétence clé de tout expert.

### Instructions
1. Prépare un plan de cours structuré.
2. Enregistre ton écran ou toi-même en expliquant le concept.
3. Fais un montage simple mais efficace.
4. Publie la vidéo.

### Critères de validation
- Qualité audio et vidéo décente.
- Explication claire et progressive.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Brand Book / Charte Graphique (PDF ou URL)"],
    fullBriefing: `
# Mission : Identité Visuelle Complète

Donne une âme à un projet. Une identité forte est la fondation de toute marque réussie.

### Instructions
1. Recherche l'univers et les valeurs du projet.
2. Crée un logo (déclinaisons comprises).
3. Définis la charte graphique complète.
4. Applique l'identité sur au moins 2 supports (ex: réseaux sociaux, site web).

### Critères de validation
- Cohérence stratégique et visuelle.
- Livrable professionnel.
    `,
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
    submissionMethod: "ANY_LINK",
    deliverables: ["Rapport de Direction Créative", "Livrables du projet"],
    fullBriefing: `
# Mission : Direction Créative

Passe de l'exécution à la vision. Dirige une équipe pour atteindre un objectif esthétique et fonctionnel.

### Instructions
1. Établis un moodboard et une direction artistique claire pour le projet.
2. Briefe les autres créateurs ou développeurs.
3. Supervise la production et assure la cohérence finale.

### Critères de validation
- Vision claire et respectée par l'équipe.
- Qualité supérieure du résultat final.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Analyse de marché (1 page)"],
    fullBriefing: `
# Mission : Analyser un Marché en 1 Page

La stratégie commence par l'observation. Apprends à voir les opportunités là où les autres voient des problèmes.

### Instructions
1. Choisis un secteur (ex: SaaS B2B, EdTech en Afrique).
2. Identifie les 3 plus gros problèmes actuels.
3. Analyse la concurrence.
4. Propose une opportunité de différenciation.

### Critères de validation
- Analyse concrète et chiffrée.
- Raisonnement logique.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Business Model Canvas complété"],
    fullBriefing: `
# Mission : Business Model Canvas

Comment ton projet va-t-il créer, livrer et capturer de la valeur ?

### Instructions
1. Remplis les 9 blocs du BMC.
2. Sois précis sur tes segments clients et tes flux de revenus.
3. Identifie les hypothèses critiques à tester en priorité.

### Critères de validation
- Cohérence entre les blocs.
- Réalisme économique.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Plan Go-to-Market"],
    fullBriefing: `
# Mission : Stratégie Go-to-Market

Avoir un bon produit ne suffit pas. Il faut savoir le mettre entre les mains des bons utilisateurs.

### Instructions
1. Définis ton "Ideal Customer Profile" (ICP).
2. Choisis tes 2 canaux d'acquisition prioritaires.
3. Rédige ton message de vente (Value Proposition).
4. Établis tes OKRs pour le premier trimestre.

### Critères de validation
- Stratégie actionnable immédiatement.
- Alignement message/canal.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Tableau d'analyse concurrentielle"],
    fullBriefing: `
# Mission : Analyse Concurrentielle

Ne réinvente pas la roue, mais fais-la mieux tourner. Étudie tes adversaires pour trouver leurs failles.

### Instructions
1. Liste au moins 5 concurrents.
2. Compare : Features, Prix, Positionnement, Public cible.
3. Conclus sur l'"Unfair Advantage" que tu peux développer.

### Critères de validation
- Profondeur de l'analyse.
- Clarté des conclusions.
    `,
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
    submissionMethod: "ANY_LINK",
    deliverables: ["Roadmap visuelle (URL ou Image)"],
    fullBriefing: `
# Mission : Roadmap Produit

Gère les attentes et le temps de développement. Une roadmap est un outil de communication autant que de planification.

### Instructions
1. Identifie les "Must-Have" vs "Nice-to-Have".
2. Utilise une méthode de priorisation (RICE ou MoSCoW).
3. Planifie par phases (Now, Next, Later).

### Critères de validation
- Faisabilité technique apparente.
- Impact business clair pour chaque étape.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Modèle financier (Spreadsheet)"],
    fullBriefing: `
# Mission : Modèle Financier Simplifié

La passion ne paie pas les serveurs. Chiffre ton ambition.

### Instructions
1. Estime tes coûts fixes et variables.
2. Modélise tes scénarios de revenus (Pessimiste, Réaliste, Optimiste).
3. Calcule ton "Burn Rate" et ton point mort.

### Critères de validation
- Formules correctes.
- Hypothèses de croissance justifiées.
    `,
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
    submissionMethod: "PRESENTATION_LINK",
    deliverables: ["Pitch Deck (Lien public)", "Résumé des feedbacks"],
    fullBriefing: `
# Mission : Pitch Deck

Savoir raconter une histoire qui donne envie d'investir du temps ou de l'argent.

### Instructions
1. Suis la structure standard (Problem, Solution, Market, etc.).
2. Sois visuel, évite les blocs de texte.
3. Entraîne-toi au "Storytelling".
4. Présente-le et récolte des avis critiques.

### Critères de validation
- Qualité narrative et visuelle.
- Clarté de l'"Ask" final.
    `,
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
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Preuve de la connexion (Screenshot ou noms)"],
    fullBriefing: `
# Mission : Introduire 2 Personnes

En tant que Catalyseur, ton pouvoir est de réduire la distance entre les talents.

### Instructions
1. Identifie deux membres ayant des besoins et compétences complémentaires.
2. Crée un groupe de discussion ou envoie un email d'introduction.
3. Explique clairement pourquoi ils devraient se parler.

### Critères de validation
- Introduction pertinente.
- Réponse positive des deux parties.
    `,
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
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers l'enregistrement ou Screenshots", "Rapport de participation"],
    fullBriefing: `
# Mission : Organiser un Événement en Ligne

Anime la communauté et crée des moments d'échange mémorables.

### Instructions
1. Choisis un thème porteur.
2. Planifie la date et l'outil (Discord, Google Meet, Zoom).
3. Fais la promotion de l'événement.
4. Anime la session et encourage la participation.

### Critères de validation
- Minimum 10 personnes présentes.
- Qualité de l'animation.
    `,
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
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Résumé de la session de mentorat"],
    fullBriefing: `
# Mission : Session de Mentorat

"To teach is to learn twice." Aide un pair à franchir une étape dans son parcours.

### Instructions
1. Identifie un membre ayant besoin d'aide sur un sujet que tu maîtrises.
2. Planifie une heure de discussion.
3. Écoute activement et propose des solutions concrètes.

### Critères de validation
- Feedback positif du mentoré.
- Plan d'action clair à la fin.
    `,
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
    submissionMethod: "ANY_LINK",
    deliverables: ["Annonce du challenge", "Liste des finalistes"],
    fullBriefing: `
# Mission : Lancer un Challenge Communautaire

Crée une dynamique de groupe autour de la progression collective.

### Instructions
1. Définis un défi simple mais stimulant (ex: "7 jours de code").
2. Crée un hashtag ou un canal dédié.
3. Motive les troupes quotidiennement.
4. Célèbre les résultats.

### Critères de validation
- Engagement visible de la communauté.
- Au moins 5 personnes au bout du défi.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Accord de partenariat / Rapport"],
    fullBriefing: `
# Mission : Créer un Partenariat

Développe l'écosystème HASHCODE en ouvrant des portes vers l'extérieur.

### Instructions
1. Identifie un partenaire potentiel (incubateur, école, fournisseur d'outils).
2. Prépare une proposition de valeur mutuelle.
3. Négocie les termes.
4. Lance l'initiative commune.

### Critères de validation
- Impact réel sur la communauté (ex: accès gratuit à un outil, événement commun).
    `,
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
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Usernames des 3 recrues"],
    fullBriefing: `
# Mission : Programme d'Ambassadeurs

Sois le visage de HASHCODE et fais grandir notre élite.

### Instructions
1. Identifie des talents dans ton entourage.
2. Explique-leur la valeur de HASHCODE.
3. Aide-les à passer l'onboarding et à comprendre le fonctionnement des missions.

### Critères de validation
- Inscription effective et passage du quiz par les 3 personnes.
    `,
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
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Rapport d'Impact complet"],
    fullBriefing: `
# Mission : Rapport d'Impact Communautaire

Clôture ton cycle de Catalyseur par une analyse objective de ton action.

### Instructions
1. Recueille les chiffres (participants, intros, recrues).
2. Collecte 3 témoignages.
3. Rédige ton bilan personnel et tes recommandations pour la communauté.

### Critères de validation
- Rapport exhaustif et inspirant.
    `,
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
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien du projet", "Pitch Slides/Vidéo", "Liste des membres de l'équipe"],
    fullBriefing: `
# Mission : Hackathon 48h

L'épreuve de feu. Travaille sous pression pour sortir un produit minimum viable.

### Instructions
1. Trouve des partenaires avec des profils complémentaires (ex: 1 Builder, 1 Creator, 1 Strategist).
2. Définissez un problème à résoudre.
3. Construisez le prototype en 48 heures chronos.
4. Présentez-le lors de la session de pitch communautaire.

### Critères de validation
- Prototype fonctionnel.
- Collaboration interdisciplinaire visible.
    `,
  },
  {
    id: "h2-cross-profile-collab",
    slug: "h2-cross-profile-collab",
    title: "Collaboration Cross-Profil",
    shortDesc: "Travaille avec quelqu'un de complètement différent.",
    description:
      "Collabore avec un membre d'un profil opposé au thine sur un projet commun pendant 2 semaines. Documente ce que tu as appris de cette collaboration.",
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
    submissionMethod: "ANY_LINK",
    deliverables: ["Rapport de collaboration", "Livrable du projet commun"],
    fullBriefing: `
# Mission : Collaboration Cross-Profil

Sortez de votre zone de confort. Un Builder doit comprendre un Strategist, un Creator doit s'aligner avec un Catalyst.

### Instructions
1. Identifie un binôme d'un profil différent.
2. Définissez un micro-projet (ex: une landing page, une campagne marketing).
3. Travaillez ensemble sur 14 jours.
4. Racontez comment vous avez géré vos différences d'approche.

### Critères de validation
- Livrable de qualité.
- Analyse profonde de l'apprentissage inter-profils.
    `,
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
    submissionMethod: "ANY_LINK",
    deliverables: ["Lien vers la ressource / outil communautaire"],
    fullBriefing: `
# Mission : Projet Communautaire

Laisse une trace durable dans l'histoire de HASHCODE.

### Instructions
1. Identifie un manque dans la communauté (ex: pas d'annuaire des outils, besoin d'un guide de survie freelance).
2. Forme une équipe si nécessaire.
3. Produis et livre la ressource.
4. Assure son adoption par les membres.

### Critères de validation
- Utilité publique démontrée.
- Qualité de finition.
    `,
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
        fullBriefing: (mission as any).fullBriefing,
        submissionMethod: (mission as any).submissionMethod || "ANY_LINK",
        deliverables: (mission as any).deliverables || [],
      },
      create: mission as any,
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
