import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import * as dotenv from "dotenv";

dotenv.config();

// Bypass TLS for Windows/Supabase
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const missions = [
    {
      title: "Optimisation de l'Engine HASH",
      slug: "optimize-engine",
      description: "Refactorisation de la logique de calcul des scores pour gagner en performance. Focus sur l'algorithmique.",
      category: "tech",
      difficulty: 3,
      xp: 500,
      weightBuilder: 0.9,
      weightStrategist: 0.1,
      weightCreator: 0,
      weightCatalyst: 0,
    },
    {
      title: "Identité Visuelle - Guilde des Créateurs",
      slug: "guild-branding",
      description: "Conception de la charte graphique et des assets pour la nouvelle guilde. Design pur et expérience.",
      category: "design",
      difficulty: 2,
      xp: 300,
      weightCreator: 0.8,
      weightBuilder: 0.2,
      weightStrategist: 0,
      weightCatalyst: 0,
    },
    {
      title: "Business Roadmap 2026",
      slug: "business-roadmap",
      description: "Analyse des opportunités du marché Web3 et définition des paliers de croissance de la plateforme.",
      category: "business",
      difficulty: 4,
      xp: 600,
      weightStrategist: 0.9,
      weightCatalyst: 0.1,
      weightBuilder: 0,
      weightCreator: 0,
    },
    {
      title: "Modération & Engagement Hub",
      slug: "community-lead",
      description: "Mise en place des règles de gouvernance et animation des premières cohortes d'utilisateurs.",
      category: "community",
      difficulty: 2,
      xp: 400,
      weightCatalyst: 0.8,
      weightCreator: 0.2,
      weightBuilder: 0,
      weightStrategist: 0,
    }
  ];

  console.log("Seed des missions de validation...");

  for (const m of missions) {
    await prisma.mission.upsert({
      where: { slug: m.slug },
      update: m,
      create: m,
    });
  }

  console.log("Missions seedées avec succès !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
