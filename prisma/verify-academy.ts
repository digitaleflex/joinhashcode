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
  const counts = {
    program: await prisma.program.count(),
    phase: await prisma.programPhase.count(),
    pillar: await prisma.pillar.count(),
    category: await prisma.category.count(),
    tag: await prisma.tag.count(),
    course: await prisma.course.count(),
    section: await prisma.section.count(),
    content: await prisma.content.count(),
    quiz: await prisma.courseQuiz.count(),
    question: await prisma.courseQuestion.count(),
    option: await prisma.courseOption.count(),
    badge: await prisma.badge.count(),
  };
  console.log("📊 Vérification en base :");
  for (const [k, v] of Object.entries(counts)) {
    console.log(`   ${k}: ${v}`);
  }

  // Sample contents
  const contents = await prisma.content.findMany({ select: { title: true, type: true, order: true } });
  console.log("\n📝 Contents (aperçu):");
  for (const c of contents.slice(0, 10)) {
    console.log(`   - ${c.title} [${c.type}] order=${c.order}`);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });
