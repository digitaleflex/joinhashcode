import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma";
import { MISSIONS, WEEKLY_CHALLENGES } from "../lib/missions";
import * as dotenv from "dotenv";

dotenv.config();

// Bypass TLS cert validation for certain environments
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const useSSL = process.env.DATABASE_URL?.includes("sslmode=require");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const GUILDS = [
  {
    slug: "builders",
    name: "Guild des Builders",
    description: "Les architectes du code. Développeurs, ingénieurs et bâtisseurs de produits techniques.",
    requiredLevel: 1,
  },
  {
    slug: "creators",
    name: "Guild des Créateurs",
    description: "Les artisans du visuel et du récit. Designers, vidéastes et créateurs de contenu.",
    requiredLevel: 1,
  },
  {
    slug: "strategists",
    name: "Guild des Stratèges",
    description: "Les architectes de la croissance. Business developers, product managers et growth hackers.",
    requiredLevel: 1,
  },
  {
    slug: "catalysts",
    name: "Guild des Catalyseurs",
    description: "Les connecteurs humains. Community managers, mentors et ambassadeurs du réseau.",
    requiredLevel: 1,
  },
];

// List of administrator emails to synchronize during deployment
const ADMIN_EMAILS = [
  "eflexcloud@gmail.com",
  "digitaleflex@gmail.com",
];

async function main() {
  console.log("🌱 Starting seeding process...\n");

  console.log("📋 Upserting missions from lib/missions.ts...");
  for (const mission of MISSIONS) {
    await prisma.mission.upsert({
      where: { slug: mission.id },
      update: {
        title: mission.title,
        shortDesc: mission.shortDesc,
        description: mission.description,
        category: mission.type,
        difficulty: mission.requiredLevel,
        xp: mission.xpReward,
        missionLevel: mission.missionLevel,
        targetProfiles: mission.targetProfiles,
        requirements: mission.requirements,
        duration: mission.duration || null,
        weightBuilder: mission.weightBuilder ?? 0,
        weightCreator: mission.weightCreator ?? 0,
        weightStrategist: mission.weightStrategist ?? 0,
        weightCatalyst: mission.weightCatalyst ?? 0,
        deliverables: mission.deliverables || [],
        fullBriefing: mission.fullBriefing || "",
        submissionMethod: mission.submissionMethod || "ANY_LINK",
      },
      create: {
        slug: mission.id,
        title: mission.title,
        shortDesc: mission.shortDesc,
        description: mission.description,
        category: mission.type,
        difficulty: mission.requiredLevel,
        xp: mission.xpReward,
        missionLevel: mission.missionLevel,
        targetProfiles: mission.targetProfiles,
        requirements: mission.requirements,
        duration: mission.duration || null,
        weightBuilder: mission.weightBuilder ?? 0,
        weightCreator: mission.weightCreator ?? 0,
        weightStrategist: mission.weightStrategist ?? 0,
        weightCatalyst: mission.weightCatalyst ?? 0,
        deliverables: mission.deliverables || [],
        fullBriefing: mission.fullBriefing || "",
        submissionMethod: mission.submissionMethod || "ANY_LINK",
      },
    });
    console.log(`  ✓ [${mission.missionLevel}] ${mission.title} (slug: ${mission.id})`);
  }

  console.log("\n📅 Upserting weekly challenges...");
  for (const challenge of WEEKLY_CHALLENGES) {
    await prisma.mission.upsert({
      where: { slug: challenge.id },
      update: {
        title: challenge.title,
        shortDesc: challenge.shortDesc,
        description: challenge.shortDesc,
        xp: challenge.xp,
        category: challenge.type,
        isWeeklyChallenge: true,
        targetProfiles: challenge.targetProfiles,
        submissionMethod: challenge.submissionMethod || "ANY_LINK",
        missionLevel: "INIT",
        difficulty: 1,
      },
      create: {
        slug: challenge.id,
        title: challenge.title,
        shortDesc: challenge.shortDesc,
        description: challenge.shortDesc,
        xp: challenge.xp,
        category: challenge.type,
        isWeeklyChallenge: true,
        targetProfiles: challenge.targetProfiles,
        submissionMethod: challenge.submissionMethod || "ANY_LINK",
        missionLevel: "INIT",
        difficulty: 1,
      },
    });
    console.log(`  ✓ [WEEKLY] ${challenge.title} (slug: ${challenge.id})`);
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
      create: {
        slug: guild.slug,
        name: guild.name,
        description: guild.description,
        requiredLevel: guild.requiredLevel,
      },
    });
    console.log(`  ✓ ${guild.name}`);
  }

  console.log("\n🛡️ Synchronizing administrators...");
  for (const email of ADMIN_EMAILS) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      await prisma.user.update({
        where: { email },
        data: { role: "ADMIN" }
      });
      console.log(`  ✓ role:ADMIN for ${email}`);
    } else {
      console.log(`  ○ User ${email} not found (will be updated after their first sign-in)`);
    }
  }

  console.log("\n✅ Seeding complete.");
  console.log(`   ${MISSIONS.length} missions processed`);
  console.log(`   ${WEEKLY_CHALLENGES.length} weekly challenges processed`);
  console.log(`   ${GUILDS.length} guilds processed`);
  console.log(`   ${ADMIN_EMAILS.length} admin accounts checked`);
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
