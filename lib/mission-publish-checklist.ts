import { prisma } from "@/lib/prisma";

interface ChecklistItem {
  label: string;
  ok: boolean;
}

interface MissionInput {
  title: string | null;
  description: string | null;
  slug: string | null;
  xp: number | null;
  deletedAt: Date | null;
}

export async function getPublishChecklist(mission: MissionInput): Promise<ChecklistItem[]> {
  const slugUnique = mission.slug
    ? (await prisma.mission.count({ where: { slug: mission.slug } })) === 1
    : false;

  const stepsCount = mission.slug
    ? await prisma.missionStep.count({ where: { mission: { slug: mission.slug } } })
    : 0;

  return [
    { label: "Titre renseigné", ok: Boolean(mission.title) },
    { label: "Description renseignée", ok: Boolean(mission.description) },
    { label: "Slug unique", ok: slugUnique },
    { label: "XP configuré", ok: (mission.xp ?? 0) > 0 },
    { label: "Au moins une étape", ok: stepsCount > 0 },
    { label: "Pas de suppression en cours", ok: mission.deletedAt === null },
  ];
}

export async function canPublishMission(mission: MissionInput): Promise<boolean> {
  const checks = await getPublishChecklist(mission);
  return checks.every((c) => c.ok);
}
