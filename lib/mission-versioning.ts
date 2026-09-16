import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";

const SNAPSHOT_FIELDS = {
  id: true,
  title: true,
  description: true,
  slug: true,
  category: true,
  difficulty: true,
  xp: true,
  weightBuilder: true,
  weightCreator: true,
  weightStrategist: true,
  weightCatalyst: true,
  duration: true,
  missionLevel: true,
  requirements: true,
  shortDesc: true,
  targetProfiles: true,
  deliverables: true,
  fullBriefing: true,
  submissionMethod: true,
  acceptanceCriteria: true,
  evaluatorNotes: true,
  qualityIndicators: true,
  isWeeklyChallenge: true,
  weeklySlot: true,
  isOnboarding: true,
  isAutoApproved: true,
  status: true,
  publishAt: true,
  deadline: true,
  closedAt: true,
} satisfies Prisma.MissionSelect;

export async function createSnapshot(missionId: string, label?: string | null) {
  const mission = await prisma.mission.findUnique({
    where: { id: missionId },
    select: SNAPSHOT_FIELDS,
  });

  if (!mission) {
    throw new Error("Mission introuvable");
  }

  return prisma.missionSnapshot.create({
    data: {
      missionId,
      label: label ?? null,
      data: mission as unknown as Prisma.InputJsonValue,
    },
  });
}

export async function getSnapshots(missionId: string) {
  return prisma.missionSnapshot.findMany({
    where: { missionId },
    orderBy: { createdAt: "desc" },
  });
}

export async function restoreSnapshot(snapshotId: string) {
  const snapshot = await prisma.missionSnapshot.findUnique({
    where: { id: snapshotId },
  });

  if (!snapshot) {
    throw new Error("Snapshot introuvable");
  }

  const data = snapshot.data as unknown as Prisma.MissionUpdateInput;

  return prisma.mission.update({
    where: { id: snapshot.missionId },
    data: {
      title: data.title,
      description: data.description,
      slug: data.slug,
      category: data.category,
      difficulty: data.difficulty,
      xp: data.xp,
      weightBuilder: data.weightBuilder,
      weightCreator: data.weightCreator,
      weightStrategist: data.weightStrategist,
      weightCatalyst: data.weightCatalyst,
      duration: data.duration,
      missionLevel: data.missionLevel,
      requirements: data.requirements,
      shortDesc: data.shortDesc,
      targetProfiles: data.targetProfiles,
      deliverables: data.deliverables,
      fullBriefing: data.fullBriefing,
      submissionMethod: data.submissionMethod,
      acceptanceCriteria: data.acceptanceCriteria,
      evaluatorNotes: data.evaluatorNotes,
      qualityIndicators: data.qualityIndicators,
      isWeeklyChallenge: data.isWeeklyChallenge,
      weeklySlot: data.weeklySlot,
      isOnboarding: data.isOnboarding,
      isAutoApproved: data.isAutoApproved,
      status: data.status,
      publishAt: data.publishAt,
      deadline: data.deadline,
      closedAt: data.closedAt,
    },
  });
}
