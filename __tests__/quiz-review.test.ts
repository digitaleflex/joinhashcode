import { describe, it, expect } from "vitest";
import { scoreQuiz } from "@/lib/quiz-scoring";
import {
  buildQuizReview,
  lessonHref,
  reviewComment,
  toPlayerQuestions,
  type ReviewSourceQuestion,
} from "@/lib/quiz-review";

const question: ReviewSourceQuestion = {
  id: "q1",
  text: "Un cas de base sert à :",
  explanation: "  Sans cas de base, la récursion ne s'arrête jamais.  ",
  options: [
    { id: "a", text: "accélérer le code", isCorrect: false, feedback: "La vitesse n'est pas son rôle." },
    { id: "b", text: "arrêter la récursion", isCorrect: true, feedback: "C'est la condition d'arrêt." },
    { id: "c", text: "trier une liste", isCorrect: false, feedback: "   " },
  ],
  concept: { href: lessonHref("hef-010", "c1"), title: "Mission 3 — Récursion" },
};

describe("reviewComment", () => {
  it("explique pourquoi la réponse choisie est fausse", () => {
    expect(reviewComment(question, "a")).toBe(
      "Tu as choisi « accélérer le code ». La vitesse n'est pas son rôle. La bonne réponse est « arrêter la récursion ».",
    );
  });

  it("reste utile sans feedback sur l'option choisie", () => {
    expect(reviewComment(question, "c")).toBe(
      "Tu as choisi « trier une liste », ce n'est pas la bonne réponse. La bonne réponse est « arrêter la récursion ».",
    );
  });

  it("confirme une bonne réponse avec son feedback", () => {
    expect(reviewComment(question, "b")).toBe(
      "Bonne réponse : « arrêter la récursion ». C'est la condition d'arrêt.",
    );
  });

  it("signale une question sans réponse", () => {
    expect(reviewComment(question, null)).toBe(
      "Tu n'as pas répondu. La bonne réponse est « arrêter la récursion ».",
    );
  });
});

describe("buildQuizReview", () => {
  it("assemble explication, feedback par option, commentaire et notion", () => {
    const { corrections } = scoreQuiz([question], { q1: "a" });
    const [review] = buildQuizReview([question], corrections);

    expect(review.questionId).toBe("q1");
    expect(review.explanation).toBe("Sans cas de base, la récursion ne s'arrête jamais.");
    expect(review.comment).toContain("Tu as choisi « accélérer le code »");
    expect(review.optionFeedback).toEqual([
      { optionId: "a", feedback: "La vitesse n'est pas son rôle." },
      { optionId: "b", feedback: "C'est la condition d'arrêt." },
    ]);
    expect(review.concept).toEqual({
      href: "/academy/courses/hef-010/lessons/c1",
      title: "Mission 3 — Récursion",
    });
  });

  it("renvoie null quand l'explication manque", () => {
    const bare = { ...question, explanation: null, concept: null };
    const [review] = buildQuizReview([bare], scoreQuiz([bare], {}).corrections);
    expect(review.explanation).toBeNull();
    expect(review.concept).toBeNull();
    expect(review.comment).toContain("Tu n'as pas répondu");
  });
});

describe("toPlayerQuestions (mode examen)", () => {
  it("n'envoie ni bonne réponse, ni explication, ni feedback avant validation", () => {
    const [player] = toPlayerQuestions([question]);
    expect(player).toEqual({
      id: "q1",
      text: "Un cas de base sert à :",
      options: [
        { id: "a", text: "accélérer le code" },
        { id: "b", text: "arrêter la récursion" },
        { id: "c", text: "trier une liste" },
      ],
    });
    const serialized = JSON.stringify(player);
    expect(serialized).not.toContain("isCorrect");
    expect(serialized).not.toContain("feedback");
    expect(serialized).not.toContain("explanation");
  });
});
