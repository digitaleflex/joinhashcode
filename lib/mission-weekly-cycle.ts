import { prisma } from "./prisma";

export function getCurrentWeekKey(): string {
  const now = new Date();
  const year = now.getFullYear();
  const week = getISOWeek(now);
  return `${year}-W${week.toString().padStart(2, "0")}`;
}

export function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

export function getWeekKeyForDate(date: Date): string {
  const year = date.getFullYear();
  const week = getISOWeek(date);
  return `${year}-W${week.toString().padStart(2, "0")}`;
}

export function getWeeklySlot(missionId: string, weekKey: string): number {
  let hash = 0;
  const str = missionId + weekKey;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % 4;
}

export async function resetWeeklyAttempts(): Promise<{ reset: number }> {
  const currentWeek = getCurrentWeekKey();
  const lastWeek = getPreviousWeekKey(currentWeek);

  const submissions = await prisma.missionSubmission.findMany({
    where: {
      cycleKey: lastWeek,
      status: { in: ["DRAFT", "PENDING", "IN_REVIEW"] },
    },
    select: { id: true, missionId: true, userId: true },
  });

  if (submissions.length === 0) {
    return { reset: 0 };
  }

  const ids = submissions.map((s) => s.id);

  await prisma.missionSubmission.updateMany({
    where: { id: { in: ids } },
    data: { status: "EXPIRED" },
  });

  for (const sub of submissions) {
    await prisma.missionSubmission.create({
      data: {
        userId: sub.userId,
        missionId: sub.missionId,
        cycleKey: currentWeek,
        status: "DRAFT",
      },
    }).catch(() => undefined);
  }

  return { reset: submissions.length };
}

export function getPreviousWeekKey(weekKey: string): string {
  const [yearStr, weekStr] = weekKey.split("-W");
  let year = parseInt(yearStr, 10);
  let week = parseInt(weekStr, 10);

  week -= 1;
  if (week === 0) {
    year -= 1;
    week = getISOWeeksInYear(year);
  }

  return `${year}-W${week.toString().padStart(2, "0")}`;
}

function getISOWeeksInYear(year: number): number {
  const dec31 = new Date(Date.UTC(year, 11, 31));
  return getISOWeek(dec31);
}

export async function getUserWeeklyAttempt(userId: string, missionId: string, weekKey?: string): Promise<{
  submission: { id: string; status: string } | null;
  weekKey: string;
}> {
  const key = weekKey ?? getCurrentWeekKey();
  const submission = await prisma.missionSubmission.findUnique({
    where: {
      userId_missionId_cycleKey: {
        userId,
        missionId,
        cycleKey: key,
      },
    },
    select: { id: true, status: true },
  });

  return { submission, weekKey: key };
}

export async function hasAttemptThisWeek(userId: string, missionId: string): Promise<boolean> {
  const { submission } = await getUserWeeklyAttempt(userId, missionId);
  return submission !== null && submission.status !== "DRAFT";
}