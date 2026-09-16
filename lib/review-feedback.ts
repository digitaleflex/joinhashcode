import { prisma } from "./prisma";

export interface ReviewFeedbackStats {
  missionId: string;
  missionTitle: string;
  totalReviews: number;
  avgRating: number;
  avgDifficulty: number;
  ratingDistribution: { rating: number; count: number }[];
  difficultyDistribution: { difficulty: number; count: number }[];
  recentFeedbacks: { rating: number; difficulty: number; comment: string; createdAt: Date }[];
}

export async function getMissionFeedbackStats(missionId: string): Promise<ReviewFeedbackStats | null> {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    select: { title: true },
  });

  if (!mission) return null;

  const submissions = await prisma.missionSubmission.findMany({
    where: {
      missionId,
      status: "APPROVED",
      userRating: { not: null },
      userDifficulty: { not: null },
    },
    select: {
      userRating: true,
      userDifficulty: true,
      userFeedback: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: "desc" },
    take: 100,
  });

  if (submissions.length === 0) {
    return {
      missionId,
      missionTitle: mission.title,
      totalReviews: 0,
      avgRating: 0,
      avgDifficulty: 0,
      ratingDistribution: [1, 2, 3, 4, 5].map((r) => ({ rating: r, count: 0 })),
      difficultyDistribution: [1, 2, 3, 4, 5].map((d) => ({ difficulty: d, count: 0 })),
      recentFeedbacks: [],
    };
  }

  const ratings = submissions.map((s) => s.userRating!).filter((r): r is number => r !== null);
  const difficulties = submissions.map((s) => s.userDifficulty!).filter((d): d is number => d !== null);

  const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
  const avgDifficulty = difficulties.reduce((a, b) => a + b, 0) / difficulties.length;

  const ratingDistribution = [1, 2, 3, 4, 5].map((r) => ({
    rating: r,
    count: ratings.filter((x) => x === r).length,
  }));

  const difficultyDistribution = [1, 2, 3, 4, 5].map((d) => ({
    difficulty: d,
    count: difficulties.filter((x) => x === d).length,
  }));

  const recentFeedbacks = submissions
    .filter((s) => s.userFeedback && s.userFeedback.trim().length > 0)
    .slice(0, 10)
    .map((s) => ({
      rating: s.userRating!,
      difficulty: s.userDifficulty!,
      comment: s.userFeedback!,
      createdAt: s.updatedAt,
    }));

  return {
    missionId,
    missionTitle: mission.title,
    totalReviews: submissions.length,
    avgRating: Math.round(avgRating * 10) / 10,
    avgDifficulty: Math.round(avgDifficulty * 10) / 10,
    ratingDistribution,
    difficultyDistribution,
    recentFeedbacks,
  };
}

export async function getAllMissionsFeedbackStats(): Promise<ReviewFeedbackStats[]> {
  const missions = await prisma.mission.findMany({
    where: { deletedAt: null },
    select: { id: true, title: true },
  });

  const stats = await Promise.all(
    missions.map((m) => getMissionFeedbackStats(m.id))
  );

  return stats.filter((s): s is ReviewFeedbackStats => s !== null);
}

export async function submitReviewFeedback(opts: {
  submissionId: string;
  userId: string;
  rating: number;
  difficulty: number;
  comment?: string;
}): Promise<{ success: boolean }> {
  if (opts.rating < 1 || opts.rating > 5 || opts.difficulty < 1 || opts.difficulty > 5) {
    throw new Error("Rating and difficulty must be between 1 and 5");
  }

  const submission = await prisma.missionSubmission.findUnique({
    where: { id: opts.submissionId },
    select: { userId: true, status: true },
  });

  if (!submission || submission.userId !== opts.userId) {
    throw new Error("Soumission introuvable ou non autorisée");
  }

  if (submission.status !== "APPROVED") {
    throw new Error("La mission doit être validée pour laisser un avis");
  }

  await prisma.missionSubmission.update({
    where: { id: opts.submissionId },
    data: {
      userRating: opts.rating,
      userDifficulty: opts.difficulty,
      userFeedback: opts.comment ?? null,
    },
  });

  return { success: true };
}