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
  const masterMissions = [
    {
      title: "Master: The Real-time AI Engine",
      slug: "master-ai-builder",
      description: "Construire un moteur SaaS collaboratif complet. Stack: Next.js 15, Better-Auth, Supabase RLS, et intégration d'agents IA pour l'assistance en temps réel. Focus: Sécurité et Performance.",
      category: "ai_builder",
      difficulty: 5,
      xp: 2500,
      weightBuilder: 0.8,
      weightCreator: 0.1,
      weightStrategist: 0.1,
      weightCatalyst: 0,
    },
    {
      title: "Master: Product Systems Architect",
      slug: "master-product-system",
      description: "Conception d'un système complexe de gestion de données distribuées. Vous devez définir le schéma Prisma, la logique de cache Edge et les workflows d'orchestration pour une scalabilité infinie.",
      category: "product_system",
      difficulty: 5,
      xp: 2500,
      weightStrategist: 0.7,
      weightBuilder: 0.2,
      weightCreator: 0.1,
      weightCatalyst: 0,
    },
    {
      title: "Master: The Edge Fortress",
      slug: "master-cloud-foundation",
      description: "Mise en place d'une infrastructure Zero-Trust sur Vercel/Cloudflare. Configuration de CI/CD avancée, monitoring de latence globale et déploiement serverless optimisé.",
      category: "cloud_foundation",
      difficulty: 5,
      xp: 2500,
      weightBuilder: 0.6,
      weightStrategist: 0.4,
      weightCreator: 0,
      weightCatalyst: 0,
    },
    {
      title: "Master: Agentic Orchestrator",
      slug: "master-automation-ai",
      description: "Développer une flotte d'agents IA autonomes capables de résoudre des tâches métiers complexes (ex: de la prospection à la génération de contrat). Focus: Fiabilité et Logique d'Agents.",
      category: "automation_ai",
      difficulty: 5,
      xp: 2500,
      weightStrategist: 0.5,
      weightBuilder: 0.4,
      weightCatalyst: 0.1,
      weightCreator: 0,
    }
  ];

  console.log("Seed des missions MASTER HASHCODE...");

  for (const m of masterMissions) {
    await prisma.mission.upsert({
      where: { slug: m.slug },
      update: m,
      create: m,
    });
  }

  console.log("Missions MASTER injectées avec succès !");
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
