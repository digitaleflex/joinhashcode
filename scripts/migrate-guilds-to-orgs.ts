import { PrismaClient } from "../generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
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

const DEFAULT_CREATOR_ID = "pdd5ViZYZqsOLCQul9YWzCavRUCFu3f7"; // E-FLEX

async function main() {
  console.log("🚀 Starting Squads to Organizations migration...");

  const guilds = await prisma.guild.findMany({
    include: {
      members: true,
    },
  });

  console.log(`Found ${guilds.length} guilds to migrate.`);

  for (const guild of guilds) {
    console.log(`Migrating Guild: ${guild.name} (${guild.slug})...`);

    // Determine owner/creator
    const leader = guild.members.find((m) => m.role === "LEADER");
    const creatorId = leader ? leader.userId : DEFAULT_CREATOR_ID;

    // Create Organization
    await prisma.organization.upsert({
      where: { id: guild.id },
      update: {
        name: guild.name,
        slug: guild.slug,
        cohesionScore: guild.cohesionScore,
        streakCount: guild.streakCount,
        lastStreakAt: guild.lastStreakAt,
        requiredLevel: guild.requiredLevel,
        isPrivate: guild.isPrivate,
      },
      create: {
        id: guild.id,
        name: guild.name,
        slug: guild.slug,
        createdAt: guild.createdAt,
        cohesionScore: guild.cohesionScore,
        streakCount: guild.streakCount,
        lastStreakAt: guild.lastStreakAt,
        requiredLevel: guild.requiredLevel,
        isPrivate: guild.isPrivate,
      },
    });

    // Create Members
    for (const member of guild.members) {
      await prisma.member.upsert({
        where: { id: member.id },
        update: {
          role: member.role === "LEADER" ? "owner" : "member",
        },
        create: {
          id: member.id,
          organizationId: guild.id,
          userId: member.userId,
          role: member.role === "LEADER" ? "owner" : "member",
          createdAt: member.joinedAt,
        },
      });
    }
  }

  console.log("✅ Migration completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Migration failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
