import { isStaffRole } from "@/lib/review-access"

/**
 * Un lab cyber importé par le seed naît en DRAFT. Tant qu'il n'est pas publié,
 * il n'est ni consultable ni soumissible par un membre (l'équipe peut le relire).
 * Les missions historiques n'ont pas de tag CYBER et ne sont pas concernées.
 */
export function isUnpublishedCyberLab(mission: { status: string; tags: string[] }): boolean {
  return mission.tags.includes("CYBER") && mission.status !== "PUBLISHED"
}

export function canViewMission(
  mission: { status: string; tags: string[] },
  role: string | null | undefined,
): boolean {
  return !isUnpublishedCyberLab(mission) || isStaffRole(role)
}
