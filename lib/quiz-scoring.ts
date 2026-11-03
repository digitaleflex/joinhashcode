export interface ScoringQuestion {
  id: string;
  options: Array<{ id: string; isCorrect: boolean }>;
}

export interface QuizCorrection {
  questionId: string;
  selectedOptionId: string | null;
  correctOptionId: string | null;
  isCorrect: boolean;
}

export interface QuizScore {
  correct: number;
  total: number;
  score: number;
  corrections: QuizCorrection[];
}

/** Pure scoring used by the API and covered by unit tests. */
export function scoreQuiz(
  questions: ScoringQuestion[],
  answers: Record<string, string>,
): QuizScore {
  let correct = 0;
  const corrections = questions.map((question) => {
    const selectedOptionId = answers[question.id] ?? null;
    const correctOption = question.options.find((option) => option.isCorrect) ?? null;
    const isCorrect = Boolean(
      selectedOptionId && correctOption && selectedOptionId === correctOption.id,
    );
    if (isCorrect) correct += 1;
    return {
      questionId: question.id,
      selectedOptionId,
      correctOptionId: correctOption?.id ?? null,
      isCorrect,
    };
  });

  const total = questions.length;
  return {
    correct,
    total,
    score: total > 0 ? Math.round((correct / total) * 100) : 0,
    corrections,
  };
}
