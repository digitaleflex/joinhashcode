import { describe, it, expect } from "vitest";
import { loadCyberLabs } from "../prisma/seed-labs";
import { parseSubmissionSchema } from "../lib/validation/artifacts";
import { getReviewCriteria } from "../lib/acceptance-criteria";

describe("labs cyber versionnés (content/labs/cyber)", () => {
  const labs = loadCyberLabs();

  it("charge les 5 labs avec des slugs uniques", () => {
    expect(labs).toHaveLength(5);
    expect(new Set(labs.map((l) => l.slug)).size).toBe(5);
  });

  it("porte ses propres critères de relecture (pas la grille générique)", () => {
    for (const lab of labs) {
      const criteria = getReviewCriteria({ category: lab.category, acceptanceCriteria: lab.acceptanceCriteria });
      expect(criteria).toHaveLength(lab.acceptanceCriteria.length);
      expect(criteria.length).toBeGreaterThanOrEqual(4);
    }
  });

  it("garde le corrigé hors du brief du membre", () => {
    for (const lab of labs) {
      expect(lab.fullBriefing).not.toContain(lab.evaluatorNotes);
      expect(lab.fullBriefing.toLowerCase()).not.toContain("evaluatornotes");
    }
  });

  it("a un contrat de soumission lisible par le moteur", () => {
    for (const lab of labs) {
      expect(parseSubmissionSchema(lab.submissionSchema)).toHaveLength(lab.submissionSchema.length);
    }
  });

  it("a un brief non vide pour chaque lab", () => {
    for (const lab of labs) expect(lab.fullBriefing.length).toBeGreaterThan(500);
  });
});
