"use client";

import { useSession } from "@/lib/auth-client";
import {
  canCreateMission,
  canPublishMission,
  canReviewMission,
  canAssignMission,
  canArchiveMission,
  canDeleteMission,
} from "@/lib/mission-roles";

export function useMissionPermissions() {
  const { data: session } = useSession();
  const role = session?.user?.role as string | undefined;

  return {
    canCreate: canCreateMission(role),
    canPublish: canPublishMission(role),
    canReview: canReviewMission(role),
    canAssign: canAssignMission(role),
    canArchive: canArchiveMission(role),
    canDelete: canDeleteMission(role),
    role,
  };
}
