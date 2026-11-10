#!/usr/bin/env node
/**
 * Validates the HEF artifacts imported into JoinHashCode.
 * Fails fast (exit 1) with a readable report; runs in CI.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MODULES_DIR = path.join(ROOT, "content/hef/v1/modules");
const PUBLIC = path.join(ROOT, "public");

const EXPECTED_CODES = [
  "HEF-000",
  "HEF-010",
  "HEF-020",
  "HEF-030",
  "HEF-040",
  "HEF-050",
  "HEF-060",
  "HEF-070",
  "HEF-080",
  "HEF-090",
  "HEF-100",
  "HEF-110",
  "HEF-120",
  "HEF-130",
  "HEF-140",
  "HEF-150",
  "HEF-160",
];

const errors = [];
const files = readdirSync(MODULES_DIR).filter((file) => file.endsWith(".json"));
const modules = files.map((file) => ({
  file,
  data: JSON.parse(readFileSync(path.join(MODULES_DIR, file), "utf8")).module,
}));

if (modules.length !== EXPECTED_CODES.length) {
  errors.push(`Attendu ${EXPECTED_CODES.length} modules, trouvé ${modules.length}`);
}

const codes = modules.map(({ data }) => data.code).sort();
if (JSON.stringify(codes) !== JSON.stringify(EXPECTED_CODES)) {
  errors.push(`Codes inattendus : ${codes.join(", ")}`);
}

let totalMissions = 0;
let totalFlashQuestions = 0;
let totalReflectionQuestions = 0;
const pillars = new Set();

for (const { file, data } of modules) {
  const prefix = `${file}:`;
  pillars.add(data.pillarSlug);

  if (!data.pillarSlug) errors.push(`${prefix} pillarSlug manquant`);
  if (!data.thumbnail) {
    errors.push(`${prefix} thumbnail manquant`);
  } else if (!existsSync(path.join(PUBLIC, data.thumbnail))) {
    errors.push(`${prefix} thumbnail introuvable (${data.thumbnail})`);
  }

  totalMissions += data.missions.length;
  if (data.missions.length < 9) {
    errors.push(`${prefix} seulement ${data.missions.length} missions`);
  }

  for (const mission of data.missions) {
    if (!mission.body || mission.body.length < 200) {
      errors.push(`${prefix} mission ${mission.slug} sans corps`);
    }
    if (!mission.body.includes("/hef/parcours/")) {
      errors.push(`${prefix} mission ${mission.slug} sans carte de parcours`);
    }
    if (!mission.slidesUrl) {
      errors.push(`${prefix} mission ${mission.slug} sans slidesUrl`);
    } else if (!existsSync(path.join(PUBLIC, mission.slidesUrl))) {
      errors.push(`${prefix} slides introuvables (${mission.slidesUrl})`);
    }
    if (mission.body.includes("10-Assets/")) {
      errors.push(`${prefix} mission ${mission.slug} contient un chemin 10-Assets`);
    }

    const flash = mission.flashQuiz?.questions ?? [];
    totalFlashQuestions += flash.length;
    if (flash.length !== 5) {
      errors.push(`${prefix} mission ${mission.slug} : ${flash.length} questions de quiz éclair (attendu 5)`);
    }
    for (const question of flash) {
      const correct = question.options.filter((option) => option.isCorrect).length;
      if (correct !== 1) {
        errors.push(
          `${prefix} mission ${mission.slug} quiz éclair Q${question.order} a ${correct} bonne(s) réponse(s) (attendu 1)`,
        );
      }
    }

    const reflection = mission.reflection?.questions ?? [];
    totalReflectionQuestions += reflection.length;
    if (reflection.length !== 2) {
      errors.push(`${prefix} mission ${mission.slug} : ${reflection.length} questions de réflexion (attendu 2)`);
    }
  }

  if (!data.labs || data.labs.length === 0) {
    errors.push(`${prefix} aucun lab`);
  } else {
    for (const lab of data.labs) {
      if (!lab.deliverables || lab.deliverables.length === 0) {
        errors.push(`${prefix} lab ${lab.slug} sans livrables`);
      }
      if ((lab.reflection?.questions ?? []).length !== 2) {
        errors.push(`${prefix} lab ${lab.slug} sans ses 2 questions de réflexion`);
      }
    }
  }

  if (!data.project) {
    errors.push(`${prefix} projet manquant`);
  } else {
    if (!data.project.deliverables || data.project.deliverables.length === 0) {
      errors.push(`${prefix} projet sans livrables`);
    }
    const weight = (data.project.criteria ?? []).reduce(
      (sum, criterion) => sum + (criterion.weight ?? 0),
      0,
    );
    if (weight !== 100) {
      errors.push(`${prefix} rubrique projet = ${weight}% (attendu 100%)`);
    }
  }

  if (!data.assessment?.quiz) {
    errors.push(`${prefix} quiz manquant`);
  } else {
    const questions = data.assessment.quiz.questions;
    if (questions.length !== 8) {
      errors.push(`${prefix} ${questions.length} questions (attendu 8)`);
    }
    for (const question of questions) {
      const correct = question.options.filter((option) => option.isCorrect).length;
      if (correct !== 1) {
        errors.push(
          `${prefix} question ${question.order} a ${correct} bonne(s) réponse(s) (attendu 1)`,
        );
      }
    }
  }
}

if (pillars.size !== EXPECTED_CODES.length) {
  errors.push(`Piliers dupliqués ou manquants : ${pillars.size}`);
}
if (totalMissions !== 169) {
  errors.push(`${totalMissions} missions au total (attendu 169)`);
}
if (totalFlashQuestions !== 845) {
  errors.push(`${totalFlashQuestions} questions de quiz éclair au total (attendu 845)`);
}
if (totalReflectionQuestions !== 338) {
  errors.push(`${totalReflectionQuestions} questions de réflexion au total (attendu 338)`);
}

if (errors.length > 0) {
  console.error(`❌ HEF validation: ${errors.length} erreur(s)`);
  for (const error of errors.slice(0, 40)) console.error(` - ${error}`);
  if (errors.length > 40) console.error(` ... et ${errors.length - 40} autres`);
  process.exit(1);
}

console.log(
  `✅ HEF validation: ${modules.length} modules, ${totalMissions} missions, 169 slides, 17 quiz, ` +
    `${totalFlashQuestions} questions de quiz éclair, ${totalReflectionQuestions} questions de réflexion.`,
);
