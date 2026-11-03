import { describe, it, expect } from "vitest";
import { scoreQuiz } from "@/lib/quiz-scoring";

const questions = [
  {
    id: "q1",
    options: [
      { id: "q1a", isCorrect: true },
      { id: "q1b", isCorrect: false },
    ],
  },
  {
    id: "q2",
    options: [
      { id: "q2a", isCorrect: false },
      { id: "q2b", isCorrect: true },
    ],
  },
  {
    id: "q3",
    options: [
      { id: "q3a", isCorrect: false },
      { id: "q3b", isCorrect: true },
    ],
  },
];

describe("scoreQuiz", () => {
  it("calcule un score parfait", () => {
    const result = scoreQuiz(questions, { q1: "q1a", q2: "q2b", q3: "q3b" });
    expect(result.correct).toBe(3);
    expect(result.total).toBe(3);
    expect(result.score).toBe(100);
  });

  it("calcule un score partiel et les corrections", () => {
    const result = scoreQuiz(questions, { q1: "q1a", q2: "q2a", q3: "q3b" });
    expect(result.correct).toBe(2);
    expect(result.score).toBe(67);
    expect(result.corrections.find((c) => c.questionId === "q2")?.isCorrect).toBe(false);
    expect(result.corrections.find((c) => c.questionId === "q2")?.correctOptionId).toBe("q2b");
  });

  it("traite les questions sans réponse comme fausses", () => {
    const result = scoreQuiz(questions, { q1: "q1a" });
    expect(result.correct).toBe(1);
    expect(result.score).toBe(33);
    expect(result.corrections.filter((c) => c.selectedOptionId === null)).toHaveLength(2);
  });

  it("renvoie 0 pour un quiz vide", () => {
    expect(scoreQuiz([], {}).score).toBe(0);
  });
});
