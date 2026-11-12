import type { QuizCorrection } from "@/lib/quiz-scoring";

/**
 * Correction détaillée d'un quiz Academy (#428, HEF-WS-04) : explication de la
 * bonne réponse, feedback de chaque option, commentaire selon la réponse
 * choisie et lien vers la leçon qui explique la notion.
 *
 * Mode examen : ces données ne quittent le serveur qu'après la validation du
 * quiz (réponse de POST /api/academy/quizzes/[quizId]/attempt). Avant, le
 * client ne reçoit que `toPlayerQuestions()`.
 */

export interface ReviewSourceQuestion {
  id: string;
  text: string;
  explanation: string | null;
  options: Array<{ id: string; text: string; isCorrect: boolean; feedback: string | null }>;
  concept: { href: string; title: string } | null;
}

export interface QuestionReview {
  questionId: string;
  explanation: string | null;
  comment: string;
  optionFeedback: Array<{ optionId: string; feedback: string }>;
  concept: { href: string; title: string } | null;
}

function clean(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

/** Commentaire personnalisé selon l'option choisie. */
export function reviewComment(
  question: ReviewSourceQuestion,
  selectedOptionId: string | null,
): string {
  const correct = question.options.find((option) => option.isCorrect) ?? null;
  const selected = question.options.find((option) => option.id === selectedOptionId) ?? null;
  const correctPart = correct ? ` La bonne réponse est « ${correct.text} ».` : "";

  if (!selected) {
    return `Tu n'as pas répondu.${correctPart}`;
  }

  const feedback = clean(selected.feedback);
  if (selected.isCorrect) {
    return feedback
      ? `Bonne réponse : « ${selected.text} ». ${feedback}`
      : `Bonne réponse : « ${selected.text} ».`;
  }

  return feedback
    ? `Tu as choisi « ${selected.text} ». ${feedback}${correctPart}`
    : `Tu as choisi « ${selected.text} », ce n'est pas la bonne réponse.${correctPart}`;
}

export function buildQuizReview(
  questions: ReviewSourceQuestion[],
  corrections: QuizCorrection[],
): QuestionReview[] {
  return questions.map((question) => {
    const correction = corrections.find((item) => item.questionId === question.id);
    return {
      questionId: question.id,
      explanation: clean(question.explanation),
      comment: reviewComment(question, correction?.selectedOptionId ?? null),
      optionFeedback: question.options.flatMap((option) => {
        const feedback = clean(option.feedback);
        return feedback ? [{ optionId: option.id, feedback }] : [];
      }),
      concept: question.concept,
    };
  });
}

/**
 * Questions envoyées au navigateur avant validation : texte et options
 * uniquement. Ni bonne réponse, ni explication, ni feedback (mode examen).
 */
export function toPlayerQuestions(
  questions: Array<{ id: string; text: string; options: Array<{ id: string; text: string }> }>,
): Array<{ id: string; text: string; options: Array<{ id: string; text: string }> }> {
  return questions.map((question) => ({
    id: question.id,
    text: question.text,
    options: question.options.map((option) => ({ id: option.id, text: option.text })),
  }));
}

/** URL de la leçon qui explique une notion. */
export function lessonHref(courseSlug: string, contentId: string): string {
  return `/academy/courses/${courseSlug}/lessons/${contentId}`;
}
