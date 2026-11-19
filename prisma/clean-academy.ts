import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: false,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Cleaning academy data...");
  await prisma.courseQuizAttempt.deleteMany();
  await prisma.courseQuiz.deleteMany();
  await prisma.content.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.forumTopic.deleteMany();
  await prisma.forumPost.deleteMany();
  await prisma.forum.deleteMany();
  await prisma.progress.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.category.deleteMany();
  await prisma.pillar.deleteMany();
  await prisma.programPhase.deleteMany();
  await prisma.program.deleteMany();
  await prisma.course.deleteMany();
  console.log("✅ Cleaned.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); process.exit(0); });
