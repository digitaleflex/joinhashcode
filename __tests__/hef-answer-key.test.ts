import { describe, it, expect } from "vitest";
import { parseAnswerKey } from "@/scripts/hef/answer-key.mjs";

describe("parseAnswerKey (corrigé HEF)", () => {
  it("lit le format minimal actuel sans explication", () => {
    const answers = parseAnswerKey("\n1. **A**\n2. **C**\n");
    expect(answers[1]).toEqual({
      letter: "A",
      explanation: null,
      feedback: {},
      conceptMission: null,
    });
    expect(answers[2].letter).toBe("C");
  });

  it("lit l'explication, le feedback par option et la notion", () => {
    const block = [
      "",
      "1. **B** — Le cas de base arrête la récursion.",
      "   - A : la vitesse n'est pas son rôle.",
      "   - C — trier n'a rien à voir.",
      "   - Notion : Mission 3",
      "",
      "2. **A**",
      "",
    ].join("\n");
    const answers = parseAnswerKey(block);
    expect(answers[1]).toEqual({
      letter: "B",
      explanation: "Le cas de base arrête la récursion.",
      feedback: { A: "la vitesse n'est pas son rôle.", C: "trier n'a rien à voir." },
      conceptMission: 3,
    });
    expect(answers[2]).toEqual({
      letter: "A",
      explanation: null,
      feedback: {},
      conceptMission: null,
    });
  });
});
