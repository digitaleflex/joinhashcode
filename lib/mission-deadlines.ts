import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

export function getDaysUntilDeadline(mission: {
  deadline: Date | null;
}): number | null {
  if (!mission.deadline) return null;
  const now = new Date();
  const diff = mission.deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export async function autoCloseOverdue(
  tx: Prisma.TransactionClient = prisma
) {
  const now = new Date();
  const result = await tx.mission.updateMany({
    where: {
      status: "PUBLISHED",
      deadline: { not: null, lt: now },
    },
    data: {
      status: "CLOSED",
      closedAt: now,
    },
  });
  return result.count;
}
