/**
 * Lecture du corrigé d'un quiz final HEF (bloc <details> « Réponses »).
 *
 * Format minimal (actuel) :
 *   1. **A**
 *
 * Format enrichi (#428), tout est optionnel :
 *   1. **A** — Pourquoi A est la bonne réponse.
 *      - B : pourquoi B est faux.
 *      - C : pourquoi C est faux.
 *      - Notion : Mission 3
 *
 * Renvoie, par numéro de question : la lettre correcte, l'explication, le
 * feedback par lettre et le numéro de la mission qui explique la notion.
 */
export function parseAnswerKey(block) {
  /** @type {Record<number, { letter: string, explanation: string | null, feedback: Record<string, string>, conceptMission: number | null }>} */
  const answers = {};
  let current = null;

  for (const line of block.split(/\r?\n/)) {
    const head = line.match(/^\s*(\d+)\.\s*\*\*([A-Z])\*\*\s*(?:[—–:-]\s*)?(.*)$/);
    if (head) {
      current = {
        letter: head[2],
        explanation: head[3].trim() || null,
        feedback: {},
        conceptMission: null,
      };
      answers[Number(head[1])] = current;
      continue;
    }
    if (!current) continue;

    const concept = line.match(/^\s+-\s*Notion\s*:\s*Mission\s+(\d+)\s*$/i);
    if (concept) {
      current.conceptMission = Number(concept[1]);
      continue;
    }
    const option = line.match(/^\s+-\s*([A-Z])\s*[:—–-]\s*(.+)$/);
    if (option) {
      current.feedback[option[1]] = option[2].trim();
    }
  }

  return answers;
}
