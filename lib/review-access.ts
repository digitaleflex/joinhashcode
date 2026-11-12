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
 * Politique actuelle : la modération uniquement (« mode concierge »). Elle ne relit
 * jamais sa propre soumission, ni une soumission qui n'est plus en attente, ni un lab
 * PRO (validé depuis l'admin).
 */
export function getClaimDecision({ reviewer, submission }: ClaimInput): ClaimDecision {
  // 1. L'autorisation d'abord : un membre non autorisé n'apprend rien sur l'état de la soumission.
  if (!isStaffRole(reviewer.role)) {
    return { ok: false, status: 403, message: "Le claim de mission est réservé à la modération." }
  }
  // 2. Puis l'état de la soumission.
  if (submission.userId === reviewer.id) {
    return { ok: false, status: 403, message: "Tu ne peux pas relire ta propre soumission." }
  }
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
