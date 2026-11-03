/**
 * HEF importer — reads the normalized JSON artifacts produced by
 * scripts/hef/parse.mjs and upserts them into the Academy schema.
 *
 * Idempotent: safe to run on every deploy/seed.
 *
 *   pnpm hef:seed
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import dotenv from "dotenv";

dotenv.config();

const CONTENT_DIR = path.join(process.cwd(), "content", "hef", "v1", "modules");

interface HefContent {
  slug: string;
  title: string;
  order?: number;
  body: string;
}

interface HefModule {
  code: string;
  slug: string;
  title: string;
  description: string;
  phase: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  pillarSlug: string;
  durationMinutes: number | null;
  missions: HefContent[];
  labs: HefContent[];
  assessment: { title: string; body: string } | null;
  project: { title: string; body: string } | null;
  resources: HefContent[];
}

interface HefPayload {
  version: string;
  module: HefModule;
}

export interface HefCounts {
  modules: number;
  courses: number;
  sections: number;
  contents: number;
  linkedPillars: number;
  skipped: string[];
}

type Db = PrismaClient;

async function resolveInstructor(db: Db): Promise<string> {
  for (const email of ["eflexcloud@gmail.com", "digitaleflex@gmail.com"]) {
    const user = await db.user.findUnique({ where: { email }, select: { id: true } });
    if (user) return user.id;
  }
  const system = await db.user.upsert({
    where: { email: "academy@hashcode.com" },
    update: { name: "HashCode Academy", role: "ADMIN" },
    create: {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
      name: "HashCode Academy",
      email: "academy@hashcode.com",
      emailVerified: true,
      emailStatus: "VALID",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    select: { id: true },
  });
  return system.id;
}

async function upsertSection(
  db: Db,
  courseId: string,
  title: string,
  order: number,
): Promise<{ id: string }> {
  const existing = await db.section.findFirst({
    where: { courseId, title },
    select: { id: true },
  });
  if (existing) {
    return db.section.update({
      where: { id: existing.id },
      data: { order },
      select: { id: true },
    });
  }
  return db.section.create({
    data: { courseId, title, order },
    select: { id: true },
  });
}

async function upsertContent(
  db: Db,
  sectionId: string,
  item: { title: string; body: string },
  order: number,
): Promise<void> {
  await db.content.upsert({
    where: { sectionId_order: { sectionId, order } },
    update: { title: item.title, body: item.body, type: "DOCUMENT" },
    create: {
      sectionId,
      order,
      title: item.title,
      body: item.body,
      type: "DOCUMENT",
    },
  });
}

export async function seedHef(db: Db): Promise<HefCounts> {
  const counts: HefCounts = {
    modules: 0,
    courses: 0,
    sections: 0,
    contents: 0,
    linkedPillars: 0,
    skipped: [],
  };

  const files = (await readdir(CONTENT_DIR))
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (files.length === 0) return counts;

  const instructorId = await resolveInstructor(db);
  const category = await db.category.findUnique({
    where: { slug: "fondamentaux" },
    select: { id: true },
  });

  for (const file of files) {
    const payload = JSON.parse(
      await readFile(path.join(CONTENT_DIR, file), "utf8"),
    ) as HefPayload;
    const module = payload.module;
    counts.modules += 1;

    const pillar = await db.pillar.findUnique({
      where: { slug: module.pillarSlug },
      select: { id: true },
    });
    if (!pillar) {
      counts.skipped.push(`${module.code}: pilier ${module.pillarSlug} introuvable`);
      continue;
    }

    const course = await db.course.upsert({
      where: { slug: module.slug },
      update: {
        title: module.title,
        description: module.description,
        level: module.level,
        isPublished: true,
        language: "FR",
        categoryId: category?.id ?? null,
        seoTitle: `${module.code} — ${module.title}`,
        seoDescription: module.description,
      },
      create: {
        slug: module.slug,
        title: module.title,
        description: module.description,
        level: module.level,
        isPublished: true,
        language: "FR",
        instructorId,
        categoryId: category?.id ?? null,
        seoTitle: `${module.code} — ${module.title}`,
        seoDescription: module.description,
      },
      select: { id: true },
    });
    counts.courses += 1;

    await db.pillar.update({
      where: { id: pillar.id },
      data: { courseId: course.id },
    });
    counts.linkedPillars += 1;

    // Missions
    const missionsSection = await upsertSection(db, course.id, "Missions", 1);
    counts.sections += 1;
    for (const [index, mission] of module.missions.entries()) {
      await upsertContent(db, missionsSection.id, mission, index + 1);
      counts.contents += 1;
    }

    if (module.labs.length > 0) {
      const labsSection = await upsertSection(db, course.id, "Atelier", 2);
      counts.sections += 1;
      for (const [index, lab] of module.labs.entries()) {
        await upsertContent(db, labsSection.id, lab, index + 1);
        counts.contents += 1;
      }
    }

    if (module.assessment) {
      const assessmentSection = await upsertSection(db, course.id, "Évaluation", 3);
      counts.sections += 1;
      await upsertContent(db, assessmentSection.id, module.assessment, 1);
      counts.contents += 1;
    }

    if (module.project) {
      const projectSection = await upsertSection(db, course.id, "Projet", 4);
      counts.sections += 1;
      await upsertContent(db, projectSection.id, module.project, 1);
      counts.contents += 1;
    }

    if (module.resources.length > 0) {
      const resourcesSection = await upsertSection(db, course.id, "Ressources", 5);
      counts.sections += 1;
      for (const [index, resource] of module.resources.entries()) {
        await upsertContent(db, resourcesSection.id, resource, index + 1);
        counts.contents += 1;
      }
    }

    console.log(`  ✓ ${module.code} — ${module.title} (${module.missions.length} missions)`);
  }

  return counts;
}

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required");
  }
  const useSSL = connectionString.includes("sslmode=require");
  const pool = new Pool({
    connectionString,
    ssl: useSSL ? { rejectUnauthorized: false } : false,
  });
  const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

  try {
    console.log("🎓 HEF import…");
    const counts = await seedHef(prisma);
    console.log("\n✅ HEF import terminé.");
    console.log(`   Modules:        ${counts.modules}`);
    console.log(`   Courses:        ${counts.courses}`);
    console.log(`   Sections:       ${counts.sections}`);
    console.log(`   Contents:       ${counts.contents}`);
    console.log(`   Piliers liés:   ${counts.linkedPillars}`);
    if (counts.skipped.length > 0) {
      console.log(`   Ignorés:        ${counts.skipped.join("; ")}`);
    }
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

if (
  import.meta.url === `file://${process.argv[1]}` ||
  process.argv[1]?.endsWith("seed-hef.ts")
) {
  main().catch((error) => {
    console.error("❌ HEF import failed:", error);
    process.exit(1);
  });
}
