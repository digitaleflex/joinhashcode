export type MissionStatus =
  | "PENDING"
  | "IN_REVIEW"
  | "APPROVED"
  | "NEEDS_REVISION"
  | "REJECTED";

export interface MissionStatusMeta {
  key: "not_started" | "in_progress" | "action_required" | "completed" | "rejected";
  label: string;
  className: string;
}

const META: Record<MissionStatus, MissionStatusMeta> = {
  APPROVED: {
    key: "completed",
    label: "Validé",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  NEEDS_REVISION: {
    key: "action_required",
    label: "À corriger",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  IN_REVIEW: {
    key: "in_progress",
    label: "En relecture",
    className: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  },
  PENDING: {
    key: "in_progress",
    label: "En attente",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  REJECTED: {
    key: "rejected",
    label: "Refusé",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

export const NOT_STARTED_META: MissionStatusMeta = {
  key: "not_started",
  label: "À commencer",
  className: "bg-primary/10 text-primary border-primary/20",
};

/** Map a raw submission status to a clear, user-facing badge. */
export function getMissionStatusMeta(status?: string | null): MissionStatusMeta {
  if (status && status in META) return META[status as MissionStatus];
  return NOT_STARTED_META;
}
