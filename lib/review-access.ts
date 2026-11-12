import { isEligibleReviewer, MIN_VALIDATED_LABS_TO_REVIEW } from "@/lib/acceptance-criteria"

export type ClaimDecision =
  | { ok: true }
  | { ok: false; status: 400 | 403; message: string }

interface ClaimInput {
  reviewer: { id: string; role: string | null; missionsCompletedCount: number | null }
  submission: { userId: string; status: string; mission: { missionLevel: string | null } }
}

export function isStaffRole(role: string | null | undefined): boolean {
  return role === "ADMIN" || role === "MODERATOR"
}

/**
 * Qui peut prendre en charge une soumission ? Source unique pour la route de
 * prise en charge, la file `/reviewer` et la page de relecture, afin que les
 * trois ne divergent jamais.
 *
 * Politique (D-029, D-030) : la modération, et tout membre ayant validé au moins
 * 3 labs. Jamais sa propre soumission, ni une soumission qui n'est plus en attente,
 * ni un lab PRO (validé depuis l'admin). Les labs CORE relus par un pair restent à
 * confirmer par l'admin (route `review`).
 */
export function getClaimDecision({ reviewer, submission }: ClaimInput): ClaimDecision {
  // 1. L'autorisation d'abord : un membre non autorisé n'apprend rien sur l'état de la soumission.
  if (submission.userId === reviewer.id) {
    return { ok: false, status: 403, message: "Tu ne peux pas relire ta propre soumission." }
  }
  if (
    !isStaffRole(reviewer.role) &&
    !isEligibleReviewer({
      reviewerMissionsCompleted: reviewer.missionsCompletedCount ?? 0,
      reviewerId: reviewer.id,
      submissionUserId: submission.userId,
    })
  ) {
    return {
      ok: false,
      status: 403,
      message: `Il faut avoir validé au moins ${MIN_VALIDATED_LABS_TO_REVIEW} labs pour relire les soumissions des autres.`,
    }
  }
  // 2. Puis l'état de la soumission.
  if (submission.status !== "PENDING") {
    return { ok: false, status: 400, message: "Cette soumission n'est plus disponible pour révision." }
  }
  if (submission.mission.missionLevel === "PRO") {
    return {
      ok: false,
      status: 400,
      message: "Cette mission est réservée à la validation admin. Elle ne peut pas être réclamée par un pair.",
    }
  }
  return { ok: true }
}
