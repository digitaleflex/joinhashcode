import { prisma } from "@/lib/prisma";

export function canPublish(mission: {
  status: string;
  title: string;
  description: string;
  slug: string;
  category: string;
}): boolean {
  if (mission.status !== "DRAFT") return false;
  return Boolean(mission.title && mission.description && mission.slug && mission.category);
}

export function canClose(mission: { status: string }): boolean {
  return mission.status === "PUBLISHED";
}

export async function publishMission(missionId: string) {
  return prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "PUBLISHED",
      publishAt: new Date(),
      deletedAt: null,
    },
  });
}

export async function closeMission(missionId: string) {
  return prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "CLOSED",
      closedAt: new Date(),
    },
  });
}

export async function archiveMission(missionId: string) {
  const activeAttempts = await prisma.missionAttempt.count({
    where: {
      missionId,
      status: { in: ["DRAFT", "IN_PROGRESS", "SUBMITTED"] },
    },
  });

  if (activeAttempts > 0) {
    throw new Error("Cannot archive mission with active attempts");
  }

  return prisma.mission.update({
    where: { id: missionId },
    data: {
      status: "ARCHIVED",
      deletedAt: new Date(),
    },
  });
}
