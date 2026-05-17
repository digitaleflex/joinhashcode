import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import * as dotenv from "dotenv";

dotenv.config();

// Match lib/prisma.ts TLS bypass for Supabase self-signed cert
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// Mission IDs must match lib/missions.ts exactly — MissionSubmission has a FK to Mission.id
const MISSIONS = [
  {
    id: "introduction-ancrage",
    slug: "introduction-ancrage",
    title: "Ancrage Initial",
    description:
      "Avant toute chose, présente-toi. Qui es-tu, qu'est-ce que tu construis, et où veux-tu aller dans les 3 prochains mois ? Ton introduction devient ta première trace dans HASHCODE.",
    category: "community",
    difficulty: 1,
    xp: 25,
    weightBuilder: 0.1,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.7,
  },
  {
    id: "social-connection-protocol",
    slug: "social-connection-protocol",
    title: "Protocole de Connexion Globale",
    description:
      "La force de HASHCODE réside dans sa communauté. Pour valider ce protocole, tu dois rejoindre nos canaux officiels : le canal Telegram, le serveur Discord et le groupe WhatsApp. C'est ici que se partagent les opportunités exclusives.",
    category: "community",
    difficulty: 1,
    xp: 150,
    weightBuilder: 0.0,
    weightCreator: 0.1,
    weightStrategist: 0.1,
    weightCatalyst: 0.8,
  },
  {
    id: "init-to-core-1",
    slug: "init-to-core-1",
    title: "Le Premier Commit",
    description:
      "Ton premier test est fondamental : montre-nous ce que tu sais faire. Déploie une page web, partage un repo GitHub, ou envoie le lien d'un prototype Figma fonctionnel. L'important n'est pas la perfection, mais le passage à l'action.",
    category: "tech",
    difficulty: 1,
    xp: 100,
    weightBuilder: 0.5,
    weightCreator: 0.3,
    weightStrategist: 0.1,
    weightCatalyst: 0.1,
  },
  {
    id: "core-to-pro-1",
    slug: "core-to-pro-1",
    title: "Architecture & Scalabilité",
    description:
      "Pour atteindre le niveau PRO, tu dois démontrer une capacité à créer un projet structuré. Crée une application Full-Stack simple avec authentification et base de données, ou un Design System complet.",
    category: "tech",
    difficulty: 2,
    xp: 300,
    weightBuilder: 0.6,
    weightCreator: 0.2,
    weightStrategist: 0.15,
    weightCatalyst: 0.05,
  },
  {
    id: "pro-to-elite-1",
    slug: "pro-to-elite-1",
    title: "Le Masterpiece",
    description:
      "Le niveau ELITE est réservé à ceux qui génèrent de l'impact. Partage un projet open-source majeur, une startup générant du MRR, ou une architecture cloud complexe que tu as designée et déployée.",
    category: "tech",
    difficulty: 3,
    xp: 1000,
    weightBuilder: 0.4,
    weightCreator: 0.2,
    weightStrategist: 0.3,
    weightCatalyst: 0.1,
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

  // Missions
  console.log("📋 Upserting missions...");
  for (const mission of MISSIONS) {
    await prisma.mission.upsert({
      where: { id: mission.id },
      update: {
        title: mission.title,
        description: mission.description,
        slug: mission.slug,
        category: mission.category,
        difficulty: mission.difficulty,
        xp: mission.xp,
        weightBuilder: mission.weightBuilder,
        weightCreator: mission.weightCreator,
        weightStrategist: mission.weightStrategist,
        weightCatalyst: mission.weightCatalyst,
      },
      create: mission,
    });
    console.log(`  ✓ ${mission.title} (${mission.id})`);
  }

  // Guilds
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
