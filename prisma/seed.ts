import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import * as dotenv from "dotenv";

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const useSSL = process.env.DATABASE_URL?.includes("sslmode=require");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
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

  // ─── MISSIONS ACTIVATION (communautaires, disponibles au lancement) ─────────

  {
    id: "profil-complet",
    slug: "profil-complet",
    title: "Dossier Opérationnel",
    shortDesc: "Complète ton profil pour activer ta présence sur le réseau.",
    description:
      "Ton dossier est ton identité sur HASHCODE. Remplis ta bio, ajoute tes liens et précise tes objectifs pour être visible des autres membres.",
    category: "community",
    difficulty: 1,
    xp: 50,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "15min",
    requirements: [
      "Remplir ta bio dans les paramètres.",
      "Ajouter au moins un lien externe (GitHub, LinkedIn ou portfolio).",
    ],
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Capture d'écran de ton profil complété"],
    fullBriefing: `
# Mission : Dossier Opérationnel

Ton profil HASHCODE est ta carte d'identité dans la communauté. Sans lui, tu es invisible. C'est la première mission que chaque agent doit accomplir.

### Instructions
1. Va dans **Paramètres → Identité** et remplis ta bio (minimum 2 lignes).
2. Ajoute au moins **un lien externe** : GitHub, LinkedIn, portfolio ou tout autre lien professionnel.
3. Vérifie que ton pseudo est unique et mémorisable.

### Critères de validation
- Bio remplie et cohérente avec ton profil.
- Au moins un lien externe valide.
    `,
  },
  {
    id: "squad-genesis",
    slug: "squad-genesis",
    title: "Genèse du Squad",
    shortDesc: "Rejoins ou crée ton premier squad pour ne pas avancer seul.",
    description:
      "Sur HASHCODE, on ne build pas en solo. Crée ton squad ou rejoins celui d'un membre via son lien d'invitation. Ensemble, votre cohésion monte plus vite.",
    category: "community",
    difficulty: 1,
    xp: 100,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "10min",
    requirements: [
      "Créer un squad via la page Squad, ou rejoindre un squad existant via un lien d'invitation.",
    ],
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Nom de ton squad ou lien d'invitation utilisé"],
    fullBriefing: `
# Mission : Genèse du Squad

Sur HASHCODE, personne ne build seul. Un squad, c'est ton unité de combat : 5 agents synchronisés qui progressent ensemble, partagent leurs ressources et décuplent leur impact.

### Instructions
**Option A — Créer ton squad :**
1. Va sur la page **Squad** dans le menu de navigation.
2. Clique sur **"Initialiser le protocole"**.
3. Personnalise le nom et le lien d'invitation de ton squad (si tu es Leader).

**Option B — Rejoindre un squad :**
1. Obtiens un lien d'invitation d'un membre de la communauté.
2. Clique sur le lien et accepte l'invitation.

### Critères de validation
- Être membre actif d'un squad (créé ou rejoint).
    `,
  },
  {
    id: "invite-pioneer",
    slug: "invite-pioneer",
    title: "Recrutement Pioneer",
    shortDesc: "Invite le premier membre de ton réseau dans la communauté.",
    description:
      "Les meilleures communautés grandissent par cooptation. Partage ton lien d'invite personnel et accueille un premier bâtisseur dans HASHCODE.",
    category: "community",
    difficulty: 1,
    xp: 75,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "5min",
    requirements: [
      "Partager ton lien d'invite (disponible sur la page Squad).",
      "Un nouveau membre rejoint HASHCODE via ton lien.",
    ],
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "TEXT_RESPONSE",
    deliverables: ["Pseudo du membre que tu as invité"],
    fullBriefing: `
# Mission : Recrutement Pioneer

Chaque grand réseau a commencé par une première invitation. Tu es l'un des pionniers de HASHCODE — c'est à toi de faire grandir la tribu.

### Instructions
1. Va sur la page **Squad** et copie ton lien d'invitation personnel.
2. Envoie-le à quelqu'un de ton réseau qui mérite de rejoindre HASHCODE (développeur, designer, entrepreneur, marketer, etc.).
3. Attends qu'il crée son compte via ton lien.

### Critères de validation
- Un membre rejoint HASHCODE via ton lien d'invitation unique.
- Note le pseudo de ce nouveau membre pour valider ta mission.
    `,
  },

  // ─── MISSIONS UNIVERSELLES (MVP PHASE) ───────────────────────────────────


  {
    id: "uni-01-portfolio-launch",
    slug: "uni-01-portfolio-launch",
    title: "Mise en Orbite : Le Portfolio Actif",
    shortDesc: "Prouve ta valeur en publiant ton espace personnel en ligne.",
    description: "Le monde doit savoir qui tu es. Déploie un site web personnel (portfolio, blog, ou landing page) et prouve ton expertise selon les standards de ta Guilde.",
    category: "core",
    difficulty: 2,
    xp: 250,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "INIT",
    duration: "4h",
    requirements: ["URL publique et fonctionnelle.", "Validation de l'objectif spécifique à ta Guilde."],
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "LIVE_URL",
    deliverables: ["URL du projet", "Explication de ton choix de guilde (2 lignes)"],
    fullBriefing: `
# Mission Universelle 01 : Mise en Orbite

Un profil Hashcode n'est rien sans preuve de travail. Ta première mission est de déployer un espace personnel en ligne (Portfolio ou Landing Page).
Cependant, l'évaluation dépendra de la Guilde que tu as rejointe.

### Objectifs par Guilde (Choisis celui de ton profil) :
* 🛠️ **Guilde des Builders :** Le design n'a pas d'importance. Prouve-nous que ton code est propre. Déploie via Vercel/Railway, mets en place ton repo GitHub proprement, et obtiens un score Lighthouse de 90+ en performance.
* 🎨 **Guilde des Creators :** La technique passe au second plan. On veut voir une identité visuelle marquante. Un Dark Mode soigné, une typographie parfaite, et au moins une micro-animation (Framer Motion ou CSS pur).
* 🧠 **Guilde des Strategists :** On veut voir de l'impact. Ton site doit être optimisé pour le SEO (balises meta parfaites) et intégrer un outil d'Analytics (Google Analytics, Plausible) pour traquer tes visiteurs.
* 🗣️ **Guilde des Catalysts :** Le site n'est qu'un prétexte. Ta mission est de déployer la page, puis d'écrire un post LinkedIn ou Twitter pour annoncer son lancement et d'attirer au moins 20 visiteurs uniques le premier jour.

### Critères de validation (Généraux)
- L'URL doit être publique.
- Le projet ne doit pas crasher.
    `,
  },
  {
    id: "uni-02-audit-teardown",
    slug: "uni-02-audit-teardown",
    title: "Le Scalpel : Audit de l'Existant",
    shortDesc: "Détruis pour mieux reconstruire.",
    description: "Prends un projet open-source, le site d'une entreprise locale, ou un de tes anciens projets, et audite-le sous le prisme de ta Guilde.",
    category: "core",
    difficulty: 3,
    xp: 300,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "CORE",
    duration: "3h",
    requirements: ["Le lien vers le projet audité.", "Un rapport contenant 3 problèmes identifiés et 3 solutions proposées."],
    weightBuilder: 0.25,
    weightCreator: 0.25,
    weightStrategist: 0.25,
    weightCatalyst: 0.25,
    submissionMethod: "DOCUMENT_LINK",
    deliverables: ["Lien du rapport d'audit (Notion, PDF ou GitHub Gist)"],
    fullBriefing: `
# Mission Universelle 02 : Le Scalpel

Les meilleurs professionnels savent lire l'existant avant de créer du nouveau. Choisis un projet numérique existant (site web, app, repo open-source) et réalise un audit complet.

### L'angle d'attaque de ta Guilde :
* 🛠️ **Builders :** Fais un audit de la dette technique ou de la sécurité. Pointe les vulnérabilités (XSS, Auth faible) ou les requêtes lentes, et propose une refonte architecturale.
* 🎨 **Creators :** Fais un audit UX/UI. Quels sont les points de friction ? L'accessibilité est-elle respectée ? Propose un wireframe ou un nouveau design system pour réparer ça.
* 🧠 **Strategists :** Fais un audit du Business Model et du Funnel de conversion. Où perdent-ils des clients ? Propose une stratégie Go-To-Market ou de rétention plus agressive.
* 🗣️ **Catalysts :** Fais un audit du positionnement communautaire et de la marque. Leur communication est-elle plate ? Propose une stratégie de création de contenu et de distribution virale.

### Critères de validation
- Le rapport doit être lisible, clair, et aller droit au but (pas de blabla).
- Les solutions proposées doivent être réalistes et actionnables.
    `,
  },
  {
    id: "uni-03-cross-pollination",
    slug: "uni-03-cross-pollination",
    title: "Pollinisation Croisée",
    shortDesc: "Sors de ta zone de confort avec un pair.",
    description: "Trouve un membre d'une autre Guilde sur Hashcode. Aidez-vous mutuellement sur une problématique spécifique à votre expertise.",
    category: "community",
    difficulty: 4,
    xp: 400,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    missionLevel: "PRO",
    duration: "1 semaine",
    requirements: ["Le pseudo du membre avec qui tu as collaboré.", "La preuve de l'échange (Screenshot de PR, document collaboratif, etc.)."],
    weightBuilder: 0.20,
    weightCreator: 0.20,
    weightStrategist: 0.20,
    weightCatalyst: 0.40,
    submissionMethod: "ANY_LINK",
    deliverables: ["Preuve de la collaboration", "Bilan de ce que tu as appris de l'autre guilde"],
    fullBriefing: `
# Mission Universelle 03 : Pollinisation Croisée

L'élite technologique n'est jamais isolée. Ta force réside dans ta capacité à parler le langage des autres disciplines. 

### Instructions
1. Identifie un membre actif qui appartient à une Guilde DIFFÉRENTE de la tienne.
2. Propose-lui un échange de compétences (Ex: "Je suis Builder, je te règle ton problème de base de données si tu m'aides à améliorer le design de ma page d'accueil (Creator)").
3. Réalisez cet échange de manière asynchrone ou lors d'un call.

### Critères de validation
- La preuve du travail accompli ensemble (Lien vers une Pull Request, un Figma commenté, etc.).
- Les deux membres de la collaboration obtiendront les points d'XP pour cette mission !
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
