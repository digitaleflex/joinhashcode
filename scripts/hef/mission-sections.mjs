/**
 * Extraction des sections pédagogiques d'une mission ou d'un labo HEF :
 * le quiz éclair (`## ⚡ Quiz éclair`) et les questions de réflexion
 * (`## 🪞 Je réfléchis` dans les missions, `## Réflexion` dans les labos).
 *
 * Fonctions pures (Markdown → objets), importées par parse.mjs et testées
 * dans __tests__/hef-mission-sections.test.ts.
 */

/** Corps d'une section `## …` (sans le titre), jusqu'au `## ` suivant. */
export function findSection(markdown, matcher) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  let start = -1;
  for (const [index, line] of lines.entries()) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (!heading) continue;
    if (start >= 0) {
      return { heading: lines[start].replace(/^##\s+/, "").trim(), body: lines.slice(start + 1, index).join("\n") };
    }
    if (matcher.test(heading[1])) start = index;
  }
  if (start < 0) return null;
  return { heading: lines[start].replace(/^##\s+/, "").trim(), body: lines.slice(start + 1).join("\n") };
}

function xpOf(heading) {
  const match = heading.match(/(\d+)\s*XP/i);
  return match ? Number(match[1]) : null;
}

function cleanExplanation(text) {
  const cleaned = text
    .replace(/^[\s,.;:—–-]+/, "")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}

/**
 * Clé de réponses `1. **A**, explication. 2. **B**.` : sur une ou plusieurs
 * lignes, dans le bloc `<details>` replié de la section.
 */
export function parseAnswerKey(text) {
  const answers = {};
  const marker = /(?:^|\s)(\d+)\.\s*\*\*([A-Z])\*\*/g;
  const hits = [...text.matchAll(marker)];
  for (const [index, hit] of hits.entries()) {
    const end = index + 1 < hits.length ? hits[index + 1].index : text.length;
    const rest = text.slice(hit.index + hit[0].length, end);
    answers[Number(hit[1])] = { letter: hit[2], explanation: cleanExplanation(rest) };
  }
  return answers;
}

/**
 * Les questions de révision espacée sont préfixées
 * `🔁 *Révision mission 03* :`, `🔁 *Révision de la mission 01* :` ou
 * `🔁 *Révision HEF-010, mission 08* :`. Le texte reste intact (le préfixe
 * reste un repère visible une fois importé) ; on expose en plus
 * `{ module, mission }` (module null = module courant), ou null.
 */
export function revisionOf(text) {
  const match = text.match(
    /^🔁\s*\*R[ée]vision\s+(?:(HEF-\d{3}),\s*)?(?:de\s+la\s+)?mission\s+(\d+)\*/i,
  );
  return match ? { module: match[1] ?? null, mission: Number(match[2]) } : null;
}

/**
 * `## ⚡ Quiz éclair (15 XP si 4/5 ou plus)` → { xp, passScore, questions }.
 * passScore est un pourcentage (4/5 → 80) pour rester homogène avec CourseQuiz.
 * Retourne null si la section est absente ou sans question exploitable.
 */
export function parseFlashQuiz(markdown) {
  const section = findSection(markdown, /quiz\s+[ée]clair/i);
  if (!section) return null;

  // Les réponses vivent dans le bloc replié <details> ; on ne lit que son contenu.
  const details = section.body.match(/<details>([\s\S]*?)<\/details>/i);
  const questionsPart = details ? section.body.slice(0, details.index) : section.body;
  const answers = parseAnswerKey(details ? details[1].replace(/<summary>[\s\S]*?<\/summary>/i, "") : "");

  const questions = [];
  const questionRegex = /^\*\*(\d+)\.\*\*\s*(.+)\n((?:[ \t]*-\s*[A-Z]\.[^\n]*\n?)+)/gm;
  for (const match of questionsPart.matchAll(questionRegex)) {
    const order = Number(match[1]);
    const answer = answers[order];
    const options = [...match[3].matchAll(/^[ \t]*-\s*([A-Z])\.\s*(.+)$/gm)].map((opt) => ({
      text: opt[2].trim(),
      isCorrect: answer?.letter === opt[1],
    }));
    if (options.length < 2) continue;
    const text = match[2].trim();
    questions.push({
      order,
      text,
      revisionOf: revisionOf(text),
      explanation: answer?.explanation ?? null,
      options,
    });
  }
  if (questions.length === 0) return null;

  const threshold = section.heading.match(/(\d+)\s*\/\s*(\d+)/);
  return {
    xp: xpOf(section.heading),
    passScore: threshold
      ? Math.round((Number(threshold[1]) / Number(threshold[2])) * 100)
      : 60,
    questions,
  };
}

/**
 * `## 🪞 Je réfléchis (10 XP)` (missions) ou `## Réflexion` (labos)
 * → { xp, intro, questions: [{ order, text }] }. null si absente.
 */
export function parseReflection(markdown) {
  const section = findSection(markdown, /r[ée]fl[ée]chis|r[ée]flexion/i);
  if (!section) return null;

  const body = section.body.replace(/^\s*---\s*$/gm, "").trim();
  const items = [...body.matchAll(/^\s*(?:\d+[.)]|[-*])\s+(.+)$/gm)];
  const questions = items.map((item, index) => ({ order: index + 1, text: item[1].trim() }));
  if (questions.length === 0) return null;

  const intro = body.slice(0, items[0].index).trim();
  return {
    xp: xpOf(section.heading),
    intro: intro.length > 0 ? intro : null,
    questions,
  };
}
