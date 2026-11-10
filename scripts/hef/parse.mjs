#!/usr/bin/env node
/**
 * HEF parser — transforms the HashCode Engineering Foundations Markdown
 * curriculum into a normalized JSON artifact consumed by prisma/seed-hef.ts.
 *
 * Usage:
 *   node scripts/hef/parse.mjs --source /path/to/hef --module HEF-000 \
 *     --out content/hef/v1/modules/HEF-000.json
 *
 * The HEF repository stays the source of truth; the generated JSON is a
 * versioned, reviewable artifact (no videos, no binaries).
 */
import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { parseFlashQuiz, parseReflection } from "./mission-sections.mjs";

const PHASE_BY_BLOCK = {
  "01-Foundations": 1,
  "02-Systems": 2,
  "03-Engineering": 3,
  "04-Advanced": 4,
};

const PILLAR_BY_CODE = {
  "HEF-000": "mentalite-ingenieur",
  "HEF-010": "algorithmique",
  "HEF-020": "structures-de-donnees",
  "HEF-030": "analyse-de-complexite",
  "HEF-040": "architecture-des-ordinateurs",
  "HEF-050": "systemes-d-exploitation",
  "HEF-060": "reseaux",
  "HEF-070": "bases-de-donnees",
  "HEF-080": "genie-logiciel",
  "HEF-090": "compilation-langages",
  "HEF-100": "securite-informatique",
  "HEF-110": "tests-logiciels",
  "HEF-120": "devops",
  "HEF-130": "performance",
  "HEF-140": "systemes-distribues",
  "HEF-150": "product-engineering",
  "HEF-160": "ia-human-augmentation",
};

const LEVEL_BY_PHASE = {
  1: "BEGINNER",
  2: "INTERMEDIATE",
  3: "INTERMEDIATE",
  4: "ADVANCED",
};

function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function titleOf(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : "";
}

function stripTitle(markdown) {
  return markdown.replace(/^\s*#\s+.+\r?\n/, "").replace(/^\s+/, "");
}

function rewriteAssets(markdown) {
  return markdown
    // ../..../10-Assets/<dir>/file → /hef/<dir>/file
    .replace(/(?:\.\.\/)+10-Assets\//g, "/hef/")
    // The mission cover is already rendered from the normalized `image` above.
    .replace(/!\[Parcours HEF-[^\]]*\]\([^)]*\)\r?\n?/g, "");
}

function quoteOf(markdown) {
  const match = markdown.match(/^>\s*\*?\*?(.+?)\*?\*?\s*$/m);
  return match ? match[1].trim() : "";
}

function missionMeta(markdown) {
  const duration = markdown.match(/Durée\s*:\s*environ\s*(\d+)\s*minutes/i);
  const badge = markdown.match(/Badge\s*:\s*\*\*([^*]+)\*\*/i);
  return {
    durationMinutes: duration ? Number(duration[1]) : null,
    badge: badge ? badge[1].trim() : null,
  };
}

async function readIfExists(file) {
  try {
    return await readFile(file, "utf8");
  } catch {
    return null;
  }
}

async function findModuleDir(source, code) {
  for (const block of Object.keys(PHASE_BY_BLOCK)) {
    const blockDir = path.join(source, block);
    let entries = [];
    try {
      entries = await readdir(blockDir);
    } catch {
      continue;
    }
    const match = entries.find((name) => name.startsWith(`${code}-`));
    if (match) return { dir: path.join(blockDir, match), block };
  }
  throw new Error(`Module ${code} introuvable dans ${source}`);
}

async function parseChapters(dir, code) {
  const chaptersDir = path.join(dir, "01-Course", "chapters");
  const entries = (await readdir(chaptersDir))
    .filter((name) => /^\d+.*\.md$/.test(name) && !name.startsWith("README"))
    .sort();

  const missions = [];
  for (const [index, name] of entries.entries()) {
    const body = await readFile(path.join(chaptersDir, name), "utf8");
    const title = titleOf(body).replace(/^Mission\s+\d+\s*[—-]\s*/i, "").trim();
    const meta = missionMeta(body);
    missions.push({
      slug: slugify(name.replace(/\.md$/, "")),
      title,
      order: index + 1,
      durationMinutes: meta.durationMinutes,
      badge: meta.badge,
      slidesUrl: `/hef/slides-pdf/${code}/${name.replace(/\.md$/, "")}.pdf`,
      flashQuiz: parseFlashQuiz(body),
      reflection: parseReflection(body),
      body: `![${title}](/hef/parcours/${code.toLowerCase().replace("-", "")}-m${String(index + 1).padStart(2, "0")}.svg)\n\n${rewriteAssets(stripTitle(body))}`,
    });
  }
  return missions;
}

function sectionText(markdown, heading) {
  const parts = markdown.split(/^##\s+/m);
  const part = parts.find(
    (chunk) => chunk.split("\n")[0].trim().toLowerCase() === heading.toLowerCase(),
  );
  return part ? part.split("\n").slice(1).join("\n").trim() : "";
}

function listItems(text) {
  return [...text.matchAll(/^\s*-\s*(?:\[[ xX]\]\s*)?(.+)$/gm)].map((m) => m[1].trim());
}

function criteriaTable(text) {
  const rows = [...text.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gm)]
    .map((m) => ({ label: m[1].trim(), description: m[2].trim(), weight: m[3].trim() }))
    .filter((row) => !/^-+$/.test(row.weight) && row.label.toLowerCase() !== "critère");
  return rows.map((row) => ({
    label: row.label,
    description: row.description,
    weight: Number.parseInt(row.weight, 10) || 0,
  }));
}

async function parseLabs(dir) {
  const labsDir = path.join(dir, "03-Labs");
  const entries = (await readdir(labsDir))
    .filter((name) => name.endsWith(".md") && !name.startsWith("README"))
    .sort();
  const labs = [];
  for (const [index, name] of entries.entries()) {
    const body = await readFile(path.join(labsDir, name), "utf8");
    const requirementItems = [
      ...listItems(sectionText(body, "Environnement")),
      ...listItems(sectionText(body, "État de départ")),
    ];
    labs.push({
      slug: slugify(name.replace(/\.md$/, "")),
      title: titleOf(body),
      shortDesc: quoteOf(body),
      order: index + 1,
      durationMinutes: null,
      requirements:
        requirementItems.length > 0
          ? requirementItems
          : [sectionText(body, "Environnement"), sectionText(body, "État de départ")].filter(Boolean),
      deliverables: listItems(sectionText(body, "Preuves à rendre")),
      acceptanceCriteria: [
        ...listItems(sectionText(body, "Observations attendues")),
        ...listItems(sectionText(body, "Validation")),
      ],
      reflection: parseReflection(body),
      sourcePath: `03-Labs/${name}`,
      body: rewriteAssets(stripTitle(body)),
    });
  }
  return labs;
}

async function parseSingle(dir, relativePath, fallbackTitle) {
  const body = await readIfExists(path.join(dir, relativePath));
  if (!body) return null;
  return { title: titleOf(body) || fallbackTitle, body: rewriteAssets(stripTitle(body)) };
}

async function parseAssessment(dir) {
  const body = await readIfExists(path.join(dir, "04-Assessment/final-assessment.md"));
  if (!body) return null;

  const passMatch = body.match(/Réussite\s*à\s*(\d+)\s*%/i);
  const passScore = passMatch ? Number(passMatch[1]) : 60;

  // Questions live in "Partie 1" and stop at the next "## Partie".
  const part1 = body.split(/^##\s+Partie\s+2/m)[0] ?? body;
  const questionRegex = /\*\*(\d+)\.\*\*\s*([^\n]+)\n((?:\s*-\s*[A-Z]\.[^\n]*\n?)+)/g;
  const questions = [];
  let match;
  while ((match = questionRegex.exec(part1)) !== null) {
    const order = Number(match[1]);
    const text = match[2].trim();
    const options = [...match[3].matchAll(/^\s*-\s*([A-Z])\.\s*(.+)$/gm)].map((opt) => ({
      letter: opt[1],
      text: opt[2].trim(),
      isCorrect: false,
    }));
    if (options.length >= 2) {
      questions.push({ order, text, options });
    }
  }

  // Answer key: `1. **A**` inside the "Réponses" details block.
  const answers = {};
  const answersBlock = body.match(/<summary>[^<]*Réponses[^<]*<\/summary>([\s\S]*?)<\/details>/i);
  if (answersBlock) {
    for (const line of answersBlock[1].matchAll(/^\s*(\d+)\.\s*\*\*([A-Z])\*\*/gm)) {
      answers[Number(line[1])] = line[2];
    }
  }

  for (const question of questions) {
    const correct = answers[question.order];
    if (correct) {
      const option = question.options.find((o) => o.letter === correct);
      if (option) option.isCorrect = true;
    }
  }

  return {
    title: titleOf(body),
    body: rewriteAssets(stripTitle(body)),
    quiz:
      questions.length > 0
        ? {
            passScore,
            questions: questions.map((q) => ({
              order: q.order,
              text: q.text,
              options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
            })),
          }
        : null,
  };
}

async function parseProject(dir) {
  const body = await readIfExists(path.join(dir, "05-Project/README.md"));
  if (!body) return null;
  const criteriaSection = sectionText(body, "Critères d'évaluation");
  const validationMatch = body.match(/Le projet est validé à \*\*(\d+)\s*%\*\*/i);
  return {
    title: titleOf(body),
    shortDesc: quoteOf(body),
    body: rewriteAssets(stripTitle(body)),
    durationMinutes: null,
    requirements: [],
    deliverables: listItems(sectionText(body, "Livrables")),
    criteria: criteriaTable(criteriaSection),
    validationCriteria: validationMatch
      ? `Projet validé à ${validationMatch[1]} % ou plus.`
      : "Chaque critère se démontre par une preuve visible.",
    sourcePath: "05-Project/README.md",
  };
}

async function parseResources(dir) {
  const resourcesDir = path.join(dir, "06-Resources");
  const entries = (await readdir(resourcesDir))
    .filter((name) => name.endsWith(".md"))
    .sort();
  const resources = [];
  for (const name of entries) {
    const body = await readFile(path.join(resourcesDir, name), "utf8");
    resources.push({
      slug: slugify(name.replace(/\.md$/, "")),
      title: titleOf(body),
      body: rewriteAssets(stripTitle(body)),
    });
  }
  return resources;
}

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name, fallback) => {
    const index = args.indexOf(`--${name}`);
    return index >= 0 ? args[index + 1] : fallback;
  };

  const source = getArg("source", process.env.HEF_SOURCE ?? "/tmp/hef");
  const code = getArg("module", "HEF-000");
  const out = getArg("out", `content/hef/v1/modules/${code}.json`);

  const { dir, block } = await findModuleDir(source, code);
  const readme = await readFile(path.join(dir, "README.md"), "utf8");
  const phase = PHASE_BY_BLOCK[block];
  const moduleSlug = slugify(`${code}-${titleOf(readme).replace(/^HEF-\d+\s*[—-]\s*/i, "")}`);
  const missions = await parseChapters(dir, code);

  const moduleData = {
    code,
    slug: moduleSlug,
    title: titleOf(readme).replace(/^HEF-\d+\s*[—-]\s*/i, "").trim(),
    description: quoteOf(readme) || `Module ${code}`,
    phase,
    level: LEVEL_BY_PHASE[phase],
    pillarSlug: PILLAR_BY_CODE[code],
    thumbnail: `/hef/modules/${code.toLowerCase().replace("-", "")}.svg`,
    durationMinutes: missions.reduce((total, m) => total + (m.durationMinutes ?? 0), 0) || null,
    missions,
    labs: await parseLabs(dir),
    assessment: await parseAssessment(dir),
    project: await parseProject(dir),
    resources: await parseResources(dir),
  };

  // Idempotence : si le contenu n'a pas changé, on garde l'horodatage précédent
  // pour qu'une régénération à source identique ne produise aucun diff.
  const previous = await readIfExists(out);
  const previousPayload = previous ? JSON.parse(previous) : null;
  const unchanged =
    previousPayload && JSON.stringify(previousPayload.module) === JSON.stringify(moduleData);

  const payload = {
    version: "v1",
    generatedAt: unchanged ? previousPayload.generatedAt : new Date().toISOString(),
    source: {
      repository: "letriplenesty-ai/hashcode-engineering-foundations",
      module: code,
    },
    module: moduleData,
  };

  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

  console.log(
    `HEF ${code} → ${out} (${missions.length} missions, ${moduleData.labs.length} lab(s), ${moduleData.resources.length} ressource(s))`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
