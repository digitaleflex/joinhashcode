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
import { PrismaClient, Prisma } from "../generated/prisma/client";
import dotenv from "dotenv";

dotenv.config();

const CONTENT_DIR = path.join(process.cwd(), "content", "hef", "v1", "modules");
const CONTRACTS_FILE = path.join(
  process.cwd(),
  "content",
  "hef",
  "v1",
  "lab-submission-contracts.json",
);

interface HefContent {
  slug: string;
  title: string;
  shortDesc?: string;
  order?: number;
  body: string;
  requirements?: string[];
  deliverables?: string[];
  acceptanceCriteria?: string[];
  sourcePath?: string;
  slidesUrl?: string;
}

interface HefRubricCriterion {
  label: string;
  description: string;
  weight: number;
}

interface HefProject {
  title: string;
  shortDesc?: string;
  body: string;
  requirements?: string[];
  deliverables?: string[];
  criteria?: HefRubricCriterion[];
  validationCriteria?: string;
  sourcePath?: string;
}

interface HefModule {
  code: string;
  slug: string;
  title: string;
  description: string;
  phase: number;
  level: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  pillarSlug: string;
  thumbnail: string | null;
  durationMinutes: number | null;
  missions: HefContent[];
  labs: HefContent[];
  assessment:
    | {
        title: string;
        body: string;
        quiz?: {
          passScore: number;
          questions: Array<{
            order: number;
            text: string;
            options: Array<{ text: string; isCorrect: boolean }>;
          }>;
        } | null;
      }
    | null;
  project: HefProject | null;
  resources: HefContent[];
}

interface HefPayload {
  version: string;
  module: HefModule;
}

interface HefArtifactContract {
  key: string;
  label: string;
  type: string;
  required?: boolean;
  accepts?: string[];
  minItems?: number;
  minLength?: number;
  maxLength?: number;
  autoCheck?: string;
}

interface HefLabContract {
  category: string;
  artifacts: HefArtifactContract[];
}

interface HefContractPayload {
  version: string;
  contracts: Record<string, HefLabContract>;
}

export interface HefCounts {
  modules: number;
  courses: number;
  sections: number;
  contents: number;
  linkedPillars: number;
  quizzes: number;
  questions: number;
  missions: number;
  deprecated: number;
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
  item: { title: string; body: string; url?: string | null },
  order: number,
): Promise<{ id: string }> {
  return db.content.upsert({
    where: { sectionId_order: { sectionId, order } },
    update: { title: item.title, body: item.body, url: item.url ?? null, type: "DOCUMENT" },
    create: {
      sectionId,
      order,
      title: item.title,
      body: item.body,
      url: item.url ?? null,
      type: "DOCUMENT",
    },
    select: { id: true },
  });
}

// Automated checks for the code labs whose contract is deterministic.
// Labs without a test list keep the human review path only.
const LAB_TESTS: Record<string, Array<[string, string]>> = {
  "HEF-010": [
    ["liste vide", "assert membres_actifs_consecutifs([]) == 0"],
    ["un seul jour", "assert membres_actifs_consecutifs([5]) == 1"],
    ["série simple", "assert membres_actifs_consecutifs([1, 2, 3, 7, 8]) == 3"],
    ["désordre", "assert membres_actifs_consecutifs([9, 1, 2, 3, 4]) == 4"],
    ["doublons", "assert membres_actifs_consecutifs([1, 1, 2, 2, 3]) == 3"],
    ["aucune suite", "assert membres_actifs_consecutifs([10, 20, 30]) == 1"],
    ["grande série", "assert membres_actifs_consecutifs(list(range(1000))) == 1000"],
  ],
};

const MISSION_LEVEL_BY_PHASE: Record<number, string> = {
  1: "INIT",
  2: "CORE",
  3: "CORE",
  4: "PRO",
};

async function upsertHefMission(
  db: Db,
  module: HefModule,
  courseId: string,
  contentId: string,
  kind: "LAB" | "PROJECT",
  item: HefContent | HefProject,
  contract?: HefLabContract,
): Promise<void> {
  const isLab = kind === "LAB";
  if (isLab && !contract) {
    throw new Error(`Contrat de soumission manquant pour ${module.code}`);
  }
  const slug = isLab
    ? `${module.code.toLowerCase()}-${(item as HefContent).slug}`
    : `${module.code.toLowerCase()}-project`;
  const criteria = isLab ? [] : (item as HefProject).criteria ?? [];
  const data = {
    title: item.title,
    shortDesc: item.shortDesc ?? null,
    description:
      item.shortDesc ??
      (isLab
        ? `Atelier pratique du module ${module.code} — ${module.title}.`
        : `Projet intégrateur du module ${module.code} — ${module.title}.`),
    fullBriefing: item.body,
    category: isLab ? contract!.category : "GENERAL",
    difficulty: module.phase,
    missionLevel: MISSION_LEVEL_BY_PHASE[module.phase] ?? "INIT",
    xp: isLab ? 100 : 300,
    requirements: item.requirements ?? [],
    deliverables: item.deliverables ?? [],
    acceptanceCriteria: isLab
      ? (item as HefContent).acceptanceCriteria ?? []
      : criteria.map((criterion) => `${criterion.label} — ${criterion.description}`),
    evaluationRubric: criteria as unknown as Prisma.InputJsonValue,
    labTests: isLab && LAB_TESTS[module.code]
      ? (LAB_TESTS[module.code] as unknown as Prisma.InputJsonValue)
      : undefined,
    validationCriteria: (item as HefProject).validationCriteria ?? null,
    submissionMethod: isLab ? "MULTI_ARTIFACT" : "DOCUMENT_LINK",
    submissionSchema: isLab
      ? (contract!.artifacts as unknown as Prisma.InputJsonValue)
      : undefined,
    targetProfiles: ["builder", "creator", "strategist", "catalyst"],
    tags: ["HEF", module.code, kind],
    resources: {
      courseSlug: module.slug,
      sourcePath: item.sourcePath ?? null,
    },
    courseId,
    contentId,
    status: "PUBLISHED",
    isOnboarding: false,
    isAutoApproved: false,
  };

  await db.mission.upsert({
    where: { slug },
    update: data,
    create: { ...data, slug },
    select: { id: true },
  });
}

export async function seedHef(db: Db): Promise<HefCounts> {
  const counts: HefCounts = {
    modules: 0,
    courses: 0,
    sections: 0,
    contents: 0,
    linkedPillars: 0,
    quizzes: 0,
    questions: 0,
    missions: 0,
    deprecated: 0,
    skipped: [],
  };

  const files = (await readdir(CONTENT_DIR))
    .filter((name) => name.endsWith(".json"))
    .sort();
  if (files.length === 0) return counts;

  const contractPayload = JSON.parse(
    await readFile(CONTRACTS_FILE, "utf8"),
  ) as HefContractPayload;
  const labContracts = contractPayload.contracts;

  const instructorId = await resolveInstructor(db);

  const CATEGORY_BY_PHASE: Record<number, { slug: string; name: string }> = {
    1: { slug: "fondamentaux", name: "Fondamentaux" },
    2: { slug: "systemes", name: "Systèmes" },
    3: { slug: "ingenierie", name: "Ingénierie" },
    4: { slug: "avance", name: "Avancé" },
  };
  const categories: Record<number, { id: string }> = {};
  for (const [phase, category] of Object.entries(CATEGORY_BY_PHASE)) {
    categories[Number(phase)] = await db.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: { slug: category.slug, name: category.name },
      select: { id: true },
    });
  }

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
        thumbnail: module.thumbnail,
        categoryId: categories[module.phase]?.id ?? null,
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
        thumbnail: module.thumbnail,
        categoryId: categories[module.phase]?.id ?? null,
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
      await upsertContent(db, missionsSection.id, { ...mission, url: mission.slidesUrl }, index + 1);
      counts.contents += 1;
    }

    if (module.labs.length > 0) {
      const labsSection = await upsertSection(db, course.id, "Atelier", 2);
      counts.sections += 1;
      for (const [index, lab] of module.labs.entries()) {
        const labContent = await upsertContent(db, labsSection.id, lab, index + 1);
        counts.contents += 1;
        await upsertHefMission(
          db,
          module,
          course.id,
          labContent.id,
          "LAB",
          lab,
          labContracts[module.code],
        );
        counts.missions += 1;
      }
    }

    if (module.assessment) {
      const assessmentSection = await upsertSection(db, course.id, "Évaluation", 3);
      counts.sections += 1;
      await upsertContent(db, assessmentSection.id, module.assessment, 1);
      counts.contents += 1;

      if (module.assessment.quiz && module.assessment.quiz.questions.length > 0) {
        const quizContent = await db.content.upsert({
          where: { sectionId_order: { sectionId: assessmentSection.id, order: 2 } },
          update: { title: `Quiz — ${module.title}`, type: "QUIZ" },
          create: {
            sectionId: assessmentSection.id,
            order: 2,
            title: `Quiz — ${module.title}`,
            type: "QUIZ",
          },
          select: { id: true },
        });
        counts.contents += 1;

        const quiz = await db.courseQuiz.upsert({
          where: { contentId: quizContent.id },
          update: {
            difficulty: module.level,
            passScore: module.assessment.quiz.passScore,
          },
          create: {
            contentId: quizContent.id,
            difficulty: module.level,
            passScore: module.assessment.quiz.passScore,
          },
          select: { id: true },
        });

        // Questions/options are derived from the Markdown source: rebuild them
        // on each import. Attempts live in course_quiz_attempt and are preserved.
        await db.courseQuestion.deleteMany({ where: { quizId: quiz.id } });
        for (const question of module.assessment.quiz.questions) {
          await db.courseQuestion.create({
            data: {
              quizId: quiz.id,
              text: question.text,
              order: question.order,
              options: {
                create: question.options.map((option) => ({
                  text: option.text,
                  isCorrect: option.isCorrect,
                })),
              },
            },
          });
          counts.questions += 1;
        }
        counts.quizzes += 1;
      }
    }

    if (module.project) {
      const projectSection = await upsertSection(db, course.id, "Projet", 4);
      counts.sections += 1;
      const projectContent = await upsertContent(db, projectSection.id, module.project, 1);
      counts.contents += 1;
      await upsertHefMission(db, module, course.id, projectContent.id, "PROJECT", module.project);
      counts.missions += 1;
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

  // The historical demo courses used fictitious CDN URLs. They are kept for
  // history but unpublished so the catalogue only shows real HEF content.
  const demo = await db.course.updateMany({
    where: {
      slug: { in: ["hef-algorithmique", "hef-bases-donnees", "hef-devops"] },
      isPublished: true,
    },
    data: { isPublished: false },
  });
  counts.deprecated = demo.count;

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
    console.log(`   Missions HEF:   ${counts.missions}`);
    console.log(`   Quiz:           ${counts.quizzes} (${counts.questions} questions)`);
    console.log(`   Cours démo dépubliés: ${counts.deprecated}`);
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
