"use client";

import * as React from "react";
import Link from "next/link";
import { BookOpen, CheckCircle2, Lightbulb, Loader2, RotateCcw, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuestionReview } from "@/lib/quiz-review";

interface QuizOption {
  id: string;
  text: string;
}

interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

interface QuizResult {
  score: number;
  passed: boolean;
  passScore: number;
  correct: number;
  total: number;
  corrections: Array<{
    questionId: string;
    selectedOptionId: string | null;
    correctOptionId: string | null;
    isCorrect: boolean;
  }>;
  /** Explications et feedback, reçus seulement après validation (mode examen). */
  review?: QuestionReview[];
}

export function QuizPlayer({
  quizId,
  questions,
  initialPassScore = 60,
  contentId,
}: {
  quizId: string;
  questions: QuizQuestion[];
  initialPassScore?: number;
  contentId?: string;
}) {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [result, setResult] = React.useState<QuizResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const answered = Object.keys(answers).length;
  const complete = answered === questions.length;

  const submit = async () => {
    if (!complete) return;
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/academy/quizzes/${quizId}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      });
      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Impossible de valider le quiz.");
      }
      const payload = (await response.json()) as QuizResult;
      setResult(payload);
      if (payload.passed && contentId) {
        fetch("/api/academy/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contentId, isCompleted: true }),
        }).catch(() => undefined);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible de valider le quiz.");
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
    setError(null);
  };

  const correctionFor = (questionId: string) =>
    result?.corrections.find((correction) => correction.questionId === questionId);
  const reviewFor = (questionId: string) =>
    result?.review?.find((review) => review.questionId === questionId);

  return (
    <div className="space-y-6">
      {result && (
        <div
          className={cn(
            "rounded-2xl border p-5",
            result.passed
              ? "border-emerald-400/25 bg-emerald-400/[0.06]"
              : "border-orange-400/25 bg-orange-400/[0.06]",
          )}
        >
          <p className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Résultat
          </p>
          <p className="mt-2 text-2xl font-black text-white">
            {result.score}%{" "}
            <span className="text-sm font-semibold text-muted-foreground">
              ({result.correct}/{result.total} bonnes réponses)
            </span>
          </p>
          <p className={cn("mt-1 text-sm font-semibold", result.passed ? "text-emerald-300" : "text-orange-300")}>
            {result.passed
              ? `Module validé (seuil ${result.passScore}%).`
              : `Seuil de réussite : ${result.passScore}%. Tu peux réviser puis réessayer.`}
          </p>
        </div>
      )}

      <ol className="space-y-6">
        {questions.map((question, index) => {
          const correction = correctionFor(question.id);
          const review = reviewFor(question.id);
          return (
            <li key={question.id} className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-bold leading-relaxed text-foreground">
                <span className="mr-2 font-mono text-xs text-primary">{index + 1}.</span>
                {question.text}
              </p>
              <div className="mt-4 space-y-2">
                {question.options.map((option) => {
                  const selected = answers[question.id] === option.id;
                  const isCorrectOption = result?.corrections.find((c) => c.questionId === question.id)?.correctOptionId === option.id;
                  const wrongSelection = Boolean(result && selected && !correction?.isCorrect);
                  const optionFeedback = review?.optionFeedback.find(
                    (item) => item.optionId === option.id,
                  )?.feedback;

                  return (
                    <div key={option.id}>
                      <button
                        type="button"
                        disabled={Boolean(result) || submitting}
                        onClick={() =>
                          setAnswers((current) => ({ ...current, [question.id]: option.id }))
                        }
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                          "disabled:cursor-default",
                          result && isCorrectOption
                            ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-100"
                            : wrongSelection
                              ? "border-red-400/40 bg-red-400/10 text-red-100"
                              : selected
                                ? "border-primary/50 bg-primary/10 text-foreground"
                                : "border-border bg-background/40 text-muted-foreground hover:border-primary/30 hover:text-foreground",
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                            selected || (result && isCorrectOption)
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          {String.fromCharCode(65 + question.options.indexOf(option))}
                        </span>
                        <span className="flex-1">{option.text}</span>
                        {result && isCorrectOption && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                        )}
                        {wrongSelection && (
                          <XCircle className="h-4 w-4 shrink-0 text-red-400" aria-hidden />
                        )}
                      </button>
                      {optionFeedback && (
                        <p
                          className={cn(
                            "mt-1 pl-12 pr-4 text-xs leading-relaxed",
                            isCorrectOption ? "text-emerald-300/90" : "text-muted-foreground",
                          )}
                        >
                          {optionFeedback}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
              {review && (
                <div
                  className={cn(
                    "mt-4 space-y-2 rounded-xl border px-4 py-3 text-sm",
                    correction?.isCorrect
                      ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                      : "border-orange-400/20 bg-orange-400/[0.04]",
                  )}
                >
                  <p className="font-semibold text-foreground">{review.comment}</p>
                  {review.explanation && (
                    <p className="flex gap-2 leading-relaxed text-muted-foreground">
                      <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                      <span>{review.explanation}</span>
                    </p>
                  )}
                  {review.concept && (
                    <Link
                      href={review.concept.href}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <BookOpen className="h-3.5 w-3.5" aria-hidden />
                      Revoir la notion : {review.concept.title}
                    </Link>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {error && <p className="text-sm font-medium text-red-400">{error}</p>}

      <div className="flex flex-wrap items-center gap-3">
        {result ? (
          <Button onClick={reset} className="h-11 rounded-xl px-5">
            <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
            Recommencer
          </Button>
        ) : (
          <Button
            onClick={submit}
            disabled={!complete || submitting}
            className="btn-primary-glow h-11 rounded-xl px-5"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              `Valider mes réponses (${answered}/${questions.length})`
            )}
          </Button>
        )}
        <p className="text-xs text-muted-foreground">
          Seuil de réussite : {result?.passScore ?? initialPassScore}%.
        </p>
      </div>
    </div>
  );
}
