import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import dotenv from "dotenv";

dotenv.config();

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const useSSL = process.env.DATABASE_URL?.includes("sslmode=require");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: useSSL ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function uid(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// ─── Resolve or create system instructor ──────────────────────────────────

async function resolveInstructor(): Promise<string> {
  const adminEmails = ["eflexcloud@gmail.com", "digitaleflex@gmail.com"];
  for (const email of adminEmails) {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (user) {
      console.log(`  🧑‍🏫 Instructor trouvé: ${email} (${user.id})`);
      return user.id;
    }
  }
  const system = await prisma.user.upsert({
    where: { email: "academy@hashcode.com" },
    update: { name: "HashCode Academy", role: "ADMIN" },
    create: {
      id: uid(),
      name: "HashCode Academy",
      email: "academy@hashcode.com",
      emailVerified: true,
      emailStatus: "VALID",
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    select: { id: true, email: true },
  });
  console.log(`  🧑‍🏫 Instructor système: ${system.email} (${system.id})`);
  return system.id;
}

// ─── HEF Program Data (from hashskills) ───────────────────────────────────

export const PROGRAM_SEED = {
  name: "HashCode Engineering Foundations",
  slug: "hef",
  tagline: "Le tronc commun des ingénieurs HashCode",
  description:
    "Un programme organisé par compétences fondamentales — et non par technologies — pour former des ingénieurs capables de s'adapter pendant les 20 prochaines années.",
  vision:
    "HashCode ne forme pas à des technologies qui évoluent et meurent, mais aux fondamentaux de l'ingénierie logicielle qui persistent. Chaque pilier possède un objectif, des prérequis, des ateliers, des projets, des critères de validation et des livrables. Toutes les spécialisations s'appuient sur ce tronc commun avant de se spécialiser.",
  icon: "GraduationCap",
  durationMonths: 24,
};

export const PHASES_SEED = [
  {
    number: 1,
    title: "Foundations",
    description: "La base universelle : penser comme un ingénieur et comprendre la machine.",
    finality: "Penser comme un ingénieur et comprendre la machine",
    pillars: [
      { level: 0, title: "Mentalité d'ingénieur", slug: "mentalite-ingenieur", objective: "Apprendre à résoudre des problèmes", concepts: ["Décomposition", "Logique", "Abstraction", "Debugging", "Documentation"], workshop: "Résolution de problèmes", project: "Mini projet logique", deliverable: "Portfolio" },
      { level: 1, title: "Algorithmique", slug: "algorithmique", objective: "Concevoir des solutions efficaces", concepts: ["Variables", "Conditions", "Boucles", "Récursivité", "Recherche", "Tri"], workshop: "Implémentation d'algorithmes", project: "Bibliothèque d'algorithmes", deliverable: "Repo Git" },
      { level: 2, title: "Structures de données", slug: "structures-de-donnees", objective: "Choisir la bonne structure", concepts: ["Array", "List", "Stack", "Queue", "HashMap", "Tree", "Graph", "Heap"], workshop: "Implémentation complète", project: "Bibliothèque DS", deliverable: "Repo Git" },
      { level: 3, title: "Analyse de complexité", slug: "analyse-de-complexite", objective: "Comprendre les performances", concepts: ["Big O", "Mémoire", "Temps", "Optimisation"], workshop: "Benchmark", project: "Comparaison d'algorithmes", deliverable: "Rapport" },
      { level: 4, title: "Architecture des ordinateurs", slug: "architecture-des-ordinateurs", objective: "Comprendre la machine", concepts: ["CPU", "RAM", "Cache", "Disque", "Bus", "Processus"], workshop: "Exploration système", project: "Analyse matérielle", deliverable: "Rapport" },
    ],
  },
  {
    number: 2,
    title: "Systems",
    description: "Les systèmes sous-jacents de tout logiciel moderne.",
    finality: "Construire des logiciels robustes",
    pillars: [
      { level: 5, title: "Systèmes d'exploitation", slug: "systemes-d-exploitation", objective: "Comprendre Linux/Windows", concepts: ["Processus", "Threads", "Mémoire", "File System", "Permissions"], workshop: "Administration Linux", project: "Mini OS Lab", deliverable: "Rapport" },
      { level: 6, title: "Réseaux", slug: "reseaux", objective: "Comprendre Internet", concepts: ["TCP/IP", "DNS", "HTTP", "HTTPS", "TLS", "Routage"], workshop: "Analyse Wireshark", project: "Infrastructure réseau", deliverable: "Diagramme" },
      { level: 7, title: "Bases de données", slug: "bases-de-donnees", objective: "Concevoir les données", concepts: ["SQL", "Transactions", "Index", "ACID", "Isolation"], workshop: "PostgreSQL Lab", project: "Conception complète", deliverable: "Schéma" },
      { level: 8, title: "Génie logiciel", slug: "genie-logiciel", objective: "Produire du code professionnel", concepts: ["SOLID", "Clean Code", "Design Patterns", "Architecture"], workshop: "Refactoring", project: "API propre", deliverable: "Audit qualité" },
      { level: 9, title: "Compilation & Langages", slug: "compilation-langages", objective: "Comprendre le fonctionnement d'un langage", concepts: ["Lexer", "Parser", "AST", "Bytecode", "VM"], workshop: "Mini interpréteur", project: "Langage simple", deliverable: "Démo" },
    ],
  },
  {
    number: 3,
    title: "Professional Engineering",
    description: "Produire des applications fiables, sécurisées et performantes en production.",
    finality: "Produire des applications fiables, sécurisées et performantes",
    pillars: [
      { level: 10, title: "Sécurité informatique", slug: "securite-informatique", objective: "Construire sécurisé", concepts: ["Auth", "Crypto", "OWASP", "IAM", "Menaces"], workshop: "Audit sécurité", project: "Pentest d'une app", deliverable: "Rapport" },
      { level: 11, title: "Tests logiciels", slug: "tests-logiciels", objective: "Garantir la qualité", concepts: ["Unit", "Integration", "E2E", "TDD"], workshop: "Couverture de tests", project: "Projet testé", deliverable: "Badge qualité" },
      { level: 12, title: "DevOps", slug: "devops", objective: "Industrialiser", concepts: ["Git", "Docker", "CI/CD", "Monitoring"], workshop: "Pipeline CI", project: "Déploiement", deliverable: "Pipeline" },
      { level: 13, title: "Performance", slug: "performance", objective: "Optimiser", concepts: ["Cache", "Profiling", "CDN", "Compression"], workshop: "Optimisation", project: "Audit performances", deliverable: "Rapport" },
    ],
  },
  {
    number: 4,
    title: "Large Scale Engineering",
    description: "Concevoir des produits distribués à grande échelle, intégrant l'IA.",
    finality: "Concevoir des produits distribués intégrant l'IA",
    pillars: [
      { level: 14, title: "Systèmes distribués", slug: "systemes-distribues", objective: "Construire à grande échelle", concepts: ["CAP", "Consistency", "Replication", "Queue"], workshop: "Architecture distribuée", project: "Mini SaaS", deliverable: "Diagrammes" },
      { level: 15, title: "Product Engineering", slug: "product-engineering", objective: "Construire un vrai produit", concepts: ["UX", "Produit", "Roadmap", "Analytics"], workshop: "MVP", project: "SaaS complet", deliverable: "Démo" },
      { level: 16, title: "IA & Human Augmentation", slug: "ia-human-augmentation", objective: "Exploiter l'IA intelligemment", concepts: ["Prompt Engineering", "Agents", "MCP", "RAG", "Évaluation", "Vérification"], workshop: "Construction d'agents IA", project: "Assistant IA complet", deliverable: "Démo" },
    ],
  },
];

// ─── Categories, Tags ──────────────────────────────────────────────────────

const CATEGORIES = [
  { name: "Fondamentaux", slug: "fondamentaux", description: "Bases fondamentales de l'ingénierie logicielle" },
  { name: "Web", slug: "web", description: "Développement web et applications" },
  { name: "Data", slug: "data", description: "Bases de données, analyse et traitement de données" },
  { name: "DevOps", slug: "devops", description: "CI/CD, infrastructure et déploiement" },
  { name: "Sécurité", slug: "securite", description: "Sécurité informatique et bonnes pratiques" },
];

const TAGS = [
  { name: "TypeScript", slug: "typescript" },
  { name: "React", slug: "react" },
  { name: "Node.js", slug: "nodejs" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Docker", slug: "docker" },
  { name: "Git", slug: "git" },
  { name: "IA", slug: "ia" },
  { name: "Test", slug: "test" },
];

// ─── Courses ────────────────────────────────────────────────────────────────

const COURSES = [
  {
    title: "Fondamentaux de l'algorithmique",
    slug: "hef-algorithmique",
    description: "Maîtrisez les algorithmes essentiels : tri, recherche, récursivité et structures de données de base.",
    level: "BEGINNER" as const,
    category: "Fondamentaux",
    tags: ["TypeScript", "Git", "Test"],
    sections: [
      {
        title: "Introduction",
        contents: [
          { title: "Document de cours — Introduction", type: "DOCUMENT" as const, body: "Introduction à l'algorithmique : concepts fondamentaux, notation algorithmique et premiers exemples." },
          { title: "Vidéo tutoriel — Introduction", type: "VIDEO" as const, url: "https://cdn.hashcode.com/courses/hef-algorithmique/module-1.mp4" },
          { title: "Quiz d'évaluation — Introduction", type: "QUIZ" as const, body: "QCM de validation des acquis du module 1." },
        ],
      },
      {
        title: "Structures de base",
        contents: [
          { title: "Document de cours — Structures de base", type: "DOCUMENT" as const, body: "Les structures de base en algorithmique : variables, conditions, boucles et récursivité." },
          { title: "Vidéo tutoriel — Structures de base", type: "VIDEO" as const, url: "https://cdn.hashcode.com/courses/hef-algorithmique/module-2.mp4" },
          { title: "Quiz d'évaluation — Structures de base", type: "QUIZ" as const, body: "QCM de validation des acquis du module 2." },
        ],
      },
    ],
  },
  {
    title: "Bases de données relationnelles",
    slug: "hef-bases-donnees",
    description: "Concevez, modélisez et optimisez des bases de données PostgreSQL avec SQL avancé.",
    level: "INTERMEDIATE" as const,
    category: "Data",
    tags: ["PostgreSQL", "Docker", "Git"],
    sections: [
      {
        title: "Modélisation",
        contents: [
          { title: "Document de cours — Modélisation", type: "DOCUMENT" as const, body: "Conception de schémas relationnels : normalisation, clés primaires/étrangères, contraintes." },
          { title: "Vidéo tutoriel — Modélisation", type: "VIDEO" as const, url: "https://cdn.hashcode.com/courses/hef-bases-donnees/module-1.mp4" },
          { title: "Quiz d'évaluation — Modélisation", type: "QUIZ" as const, body: "QCM de validation des acquis du module 1." },
        ],
      },
      {
        title: "SQL avancé",
        contents: [
          { title: "Document de cours — SQL avancé", type: "DOCUMENT" as const, body: "Jointures, sous-requêtes, vues, index et optimisation de requêtes." },
          { title: "Vidéo tutoriel — SQL avancé", type: "VIDEO" as const, url: "https://cdn.hashcode.com/courses/hef-bases-donnees/module-2.mp4" },
          { title: "Quiz d'évaluation — SQL avancé", type: "QUIZ" as const, body: "QCM de validation des acquis du module 2." },
        ],
      },
    ],
  },
  {
    title: "Introduction au DevOps",
    slug: "hef-devops",
    description: "CI/CD, Docker, Git et monitoring : industrialisez vos projets dès le départ.",
    level: "BEGINNER" as const,
    category: "DevOps",
    tags: ["Docker", "Git", "Node.js"],
    sections: [
      {
        title: "Git et CI/CD",
        contents: [
          { title: "Document de cours — Git et CI/CD", type: "DOCUMENT" as const, body: "Workflow Git, branches, pull requests et pipelines d'intégration continue." },
          { title: "Vidéo tutoriel — Git et CI/CD", type: "VIDEO" as const, url: "https://cdn.hashcode.com/courses/hef-devops/module-1.mp4" },
          { title: "Quiz d'évaluation — Git et CI/CD", type: "QUIZ" as const, body: "QCM de validation des acquis du module 1." },
        ],
      },
      {
        title: "Docker et déploiement",
        contents: [
          { title: "Document de cours — Docker et déploiement", type: "DOCUMENT" as const, body: "Conteneurisation, Docker Compose, orchestration de base et déploiement." },
          { title: "Vidéo tutoriel — Docker et déploiement", type: "VIDEO" as const, url: "https://cdn.hashcode.com/courses/hef-devops/module-2.mp4" },
          { title: "Quiz d'évaluation — Docker et déploiement", type: "QUIZ" as const, body: "QCM de validation des acquis du module 2." },
        ],
      },
    ],
  },
];

// ─── Badges ────────────────────────────────────────────────────────────────

const BADGES = [
  { name: "Premier Pas", description: "Complétez votre premier cours HashCode Academy", icon: "Boot" },
  { name: "Certifié HEF", description: "Validez les 4 phases du programme HEF", icon: "Shield" },
  { name: "Mentor", description: "Aidez 5 apprenants à compléter un cours", icon: "Account" },
  { name: "Architecte", description: "Complétez tous les piliers du programme HEF", icon: "Blueprint" },
];

// ─── Questions par cours ────────────────────────────────────────────────────

const QUESTIONS_BY_COURSE: Record<string, { text: string; explanation: string; options: { text: string; isCorrect: boolean }[] }[]> = {
  "hef-algorithmique": [
    { text: "Quelle structure de données suit le principe FIFO ?", explanation: "FIFO = First In First Out. Les files (Queue) respectent ce principe.", options: [{ text: "Stack", isCorrect: false }, { text: "Queue", isCorrect: true }, { text: "Tree", isCorrect: false }, { text: "Graph", isCorrect: false }] },
    { text: "Quelle est la complexité temporelle d'une recherche dans un HashMap ?", explanation: "En moyenne, la recherche dans un HashMap est O(1).", options: [{ text: "O(n)", isCorrect: false }, { text: "O(log n)", isCorrect: false }, { text: "O(1)", isCorrect: true }, { text: "O(n²)", isCorrect: false }] },
    { text: "Quelle commande Git permet d'annuler le dernier commit ?", explanation: "git reset HEAD~1 annule le dernier commit tout en gardant les modifications.", options: [{ text: "git undo", isCorrect: false }, { text: "git reset HEAD~1", isCorrect: true }, { text: "git revert", isCorrect: false }, { text: "git rollback", isCorrect: false }] },
  ],
  "hef-bases-donnees": [
    { text: "Quelle est la forme normale qui élimine les dépendances transitives ?", explanation: "La 3e forme normale (3NF) élimine les dépendances transitives.", options: [{ text: "1NF", isCorrect: false }, { text: "2NF", isCorrect: false }, { text: "3NF", isCorrect: true }, { text: "BCNF", isCorrect: false }] },
    { text: "Quelle commande SQL supprime une table ?", explanation: "DROP TABLE supprime la table et ses données.", options: [{ text: "DELETE TABLE", isCorrect: false }, { text: "REMOVE TABLE", isCorrect: false }, { text: "DROP TABLE", isCorrect: true }, { text: "CLEAR TABLE", isCorrect: false }] },
    { text: "Quel index accélère les recherches sur un intervalle de valeurs ?", explanation: "L'index B-Tree est optimal pour les requêtes sur intervalles.", options: [{ text: "Hash index", isCorrect: false }, { text: "B-Tree index", isCorrect: true }, { text: "GIN index", isCorrect: false }, { text: "BRIN index", isCorrect: false }] },
  ],
  "hef-devops": [
    { text: "Quel fichier définit les services Docker ?", explanation: "docker-compose.yml décrit les services, réseaux et volumes.", options: [{ text: "Dockerfile", isCorrect: false }, { text: "docker-compose.yml", isCorrect: true }, { text: "docker.config", isCorrect: false }, { text: "services.yaml", isCorrect: false }] },
    { text: "Quel outil CI/CD est natif à GitHub ?", explanation: "GitHub Actions est le service CI/CD intégré à GitHub.", options: [{ text: "Jenkins", isCorrect: false }, { text: "Travis CI", isCorrect: false }, { text: "GitHub Actions", isCorrect: true }, { text: "CircleCI", isCorrect: false }] },
    { text: "Que signifie CI dans CI/CD ?", explanation: "CI = Continuous Integration, l'intégration continue des modifications de code.", options: [{ text: "Continuous Integration", isCorrect: true }, { text: "Constant Integration", isCorrect: false }, { text: "Complete Integration", isCorrect: false }, { text: "Centralized Integration", isCorrect: false }] },
  ],
};

// ─── Main seed ──────────────────────────────────────────────────────────────

export async function seedAcademy(): Promise<{
  program: number; phases: number; pillars: number; categories: number; tags: number;
  courses: number; sections: number; contents: number; quizzes: number;
  questions: number; options: number; badges: number;
}> {
  const counts = { program: 0, phases: 0, pillars: 0, categories: 0, tags: 0, courses: 0, sections: 0, contents: 0, quizzes: 0, questions: 0, options: 0, badges: 0 };

  const instructorId = await resolveInstructor();

  // ── Program ──
  const program = await prisma.program.upsert({
    where: { slug: PROGRAM_SEED.slug },
    update: PROGRAM_SEED,
    create: PROGRAM_SEED,
  });
  counts.program = 1;
  console.log(`  ✓ Program "${program.name}" (${program.id})`);

  // ── Phases + Pillars ──
  for (const phaseSeed of PHASES_SEED) {
    const phase = await prisma.programPhase.upsert({
      where: { programId_number: { programId: program.id, number: phaseSeed.number } },
      update: { title: phaseSeed.title, description: phaseSeed.description, finality: phaseSeed.finality },
      create: { programId: program.id, number: phaseSeed.number, title: phaseSeed.title, description: phaseSeed.description, finality: phaseSeed.finality },
    });
    counts.phases += 1;
    console.log(`  ✓ Phase ${phase.number} — ${phase.title}`);

    for (const p of phaseSeed.pillars) {
      await prisma.pillar.upsert({
        where: { slug: p.slug },
        update: { programId: program.id, phaseId: phase.id, level: p.level, title: p.title, objective: p.objective, concepts: p.concepts, workshop: p.workshop, project: p.project, deliverable: p.deliverable, order: p.level, isPublished: true },
        create: { programId: program.id, phaseId: phase.id, level: p.level, title: p.title, slug: p.slug, objective: p.objective, concepts: p.concepts, workshop: p.workshop, project: p.project, deliverable: p.deliverable, order: p.level, isPublished: true },
      });
      counts.pillars += 1;
      console.log(`    ✓ Pilier ${p.level} — ${p.title}`);
    }
  }

  // ── Categories ──
  const categoryMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: { name: cat.name, slug: cat.slug, description: cat.description },
    });
    categoryMap.set(cat.name, created.id);
    counts.categories += 1;
    console.log(`  ✓ Category: ${cat.name}`);
  }

  // ── Tags ──
  const tagMap = new Map<string, string>();
  for (const tag of TAGS) {
    const created = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name },
      create: { name: tag.name, slug: tag.slug },
    });
    tagMap.set(tag.name, created.id);
    counts.tags += 1;
    console.log(`  ✓ Tag: ${tag.name}`);
  }

  // ── Courses ──
  for (const c of COURSES) {
    const categoryId = categoryMap.get(c.category);
    const tagIds = c.tags.map((t) => tagMap.get(t)).filter(Boolean);

    const course = await prisma.course.upsert({
      where: { slug: c.slug },
      update: { title: c.title, description: c.description, level: c.level, categoryId, isPublished: true, tags: { connect: tagIds.map((id) => ({ id })) } },
      create: { title: c.title, description: c.description, slug: c.slug, level: c.level, instructorId, language: "FR", isPublished: true, averageRating: 4.5, totalLearners: 0, categoryId, tags: { connect: tagIds.map((id) => ({ id })) } },
    });
    counts.courses += 1;
    console.log(`  ✓ Course: ${c.title} (id: ${course.id})`);

    // ── Sections + Contents ──
    for (const sec of c.sections) {
      const section = await prisma.section.upsert({
        where: { id: sec.title + course.id },
        update: { title: sec.title },
        create: { id: sec.title + course.id, title: sec.title, order: c.sections.indexOf(sec) + 1, courseId: course.id },
      });
      counts.sections += 1;
      console.log(`    ✓ Section: ${sec.title}`);

      for (const item of sec.contents) {
        const contentType = item.type;
        const orderNum = contentType === "QUIZ" ? 3 : contentType === "VIDEO" ? 2 : 1;
        const content = await prisma.content.upsert({
          where: { id: item.title + section.id },
          update: { title: item.title, type: contentType, order: orderNum, url: item.url ?? null, body: item.body ?? null },
          create: { id: item.title + section.id, title: item.title, type: contentType, order: orderNum, url: item.url ?? null, body: item.body ?? null, sectionId: section.id },
        });
        counts.contents += 1;
        console.log(`      ✓ Content: ${item.title} (${contentType})`);
      }
    }

    // ── CourseQuiz + Questions + Options ──
    // Create exactly 1 quiz per course, attached to the first section's QUIZ content
    const firstSection = await prisma.section.findFirst({
      where: { courseId: course.id },
      orderBy: { order: "asc" as const },
    });
    if (firstSection) {
      const quizContent = await prisma.content.findFirst({
        where: { sectionId: firstSection.id, type: "QUIZ" },
      });
      if (quizContent) {
        const quiz = await prisma.courseQuiz.upsert({
          where: { contentId: quizContent.id },
          update: { difficulty: c.level, isAIGenerated: false },
          create: { contentId: quizContent.id, difficulty: c.level, isAIGenerated: false },
        });
        counts.quizzes += 1;
        console.log(`    ✓ Quiz attached to content ${quizContent.id}`);

        // Clean up old questions for this quiz (idempotent)
        const existingQuestions = await prisma.courseQuestion.findMany({ where: { quizId: quiz.id }, select: { id: true } });
        for (const q of existingQuestions) {
          await prisma.courseOption.deleteMany({ where: { questionId: q.id } });
          await prisma.courseQuestion.delete({ where: { id: q.id } });
        }

        const questionsData = QUESTIONS_BY_COURSE[c.slug] ?? [];
        for (const qd of questionsData) {
          const question = await prisma.courseQuestion.create({
            data: {
              quizId: quiz.id,
              text: qd.text,
              explanation: qd.explanation,
              order: qd.options.findIndex((o) => o.isCorrect) + 1,
              options: { create: qd.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })) },
            },
          });
          counts.questions += 1;
          counts.options += qd.options.length;
          console.log(`      ✓ Question: "${qd.text.slice(0, 50)}..."`);
        }
      }
    }
  }

  // ── Badges ──
  for (const b of BADGES) {
    await prisma.badge.upsert({
      where: { name: b.name },
      update: { description: b.description, icon: b.icon },
      create: { name: b.name, description: b.description, icon: b.icon },
    });
    counts.badges += 1;
    console.log(`  ✓ Badge: ${b.name}`);
  }

  return counts;
}

async function main() {
  console.log("🌱 Starting academy seeding...\n");
  const counts = await seedAcademy();
  console.log("\n✅ Academy seeding complete.");
  console.log(`   Programs:      ${counts.program}`);
  console.log(`   Phases:        ${counts.phases}`);
  console.log(`   Pillars:       ${counts.pillars}`);
  console.log(`   Categories:    ${counts.categories}`);
  console.log(`   Tags:          ${counts.tags}`);
  console.log(`   Courses:       ${counts.courses}`);
  console.log(`   Sections:      ${counts.sections}`);
  console.log(`   Contents:      ${counts.contents}`);
  console.log(`   Quizzes:       ${counts.quizzes}`);
  console.log(`   Questions:     ${counts.questions}`);
  console.log(`   Options:       ${counts.options}`);
  console.log(`   Badges:        ${counts.badges}`);
}

// Only run main when executed directly (not when imported)
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("seed-academy.ts")) {
  main()
    .catch((e) => {
      console.error("❌ Academy seed failed:", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
      await pool.end();
      process.exit(0);
    });
}
