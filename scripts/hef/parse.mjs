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
      body: `![${title}](/hef/parcours/${code.toLowerCase().replace("-", "")}-m${String(index + 1).padStart(2, "0")}.svg)\n\n${stripTitle(body)}`,
    });
  }
  return missions;
}

async function parseLabs(dir) {
  const labsDir = path.join(dir, "03-Labs");
  const entries = (await readdir(labsDir))
    .filter((name) => name.endsWith(".md") && !name.startsWith("README"))
    .sort();
  const labs = [];
  for (const [index, name] of entries.entries()) {
    const body = await readFile(path.join(labsDir, name), "utf8");
    labs.push({
      slug: slugify(name.replace(/\.md$/, "")),
      title: titleOf(body),
      order: index + 1,
      body: stripTitle(body),
    });
  }
  return labs;
}

async function parseSingle(dir, relativePath, fallbackTitle) {
  const body = await readIfExists(path.join(dir, relativePath));
  if (!body) return null;
  return { title: titleOf(body) || fallbackTitle, body: stripTitle(body) };
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
      body: stripTitle(body),
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
    assessment: await parseSingle(dir, "04-Assessment/final-assessment.md", "Évaluation finale"),
    project: await parseSingle(dir, "05-Project/README.md", "Projet du module"),
    resources: await parseResources(dir),
  };

  const payload = {
    version: "v1",
    generatedAt: new Date().toISOString(),
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
