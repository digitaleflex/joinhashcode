export type MissionPermission =
  | "create"
  | "publish"
  | "review"
  | "assign"
  | "archive"
  | "delete";

const ADMIN_PERMISSIONS: MissionPermission[] = [
  "create",
  "publish",
  "review",
  "assign",
  "archive",
  "delete",
];

const MODERATOR_PERMISSIONS: MissionPermission[] = ["create", "review"];

const ROLE_PERMISSIONS: Record<string, MissionPermission[]> = {
  ADMIN: ADMIN_PERMISSIONS,
  MODERATOR: MODERATOR_PERMISSIONS,
};

function hasPermission(
  userRole: string | undefined,
  permission: MissionPermission,
): boolean {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}

export function canCreateMission(userRole: string | undefined): boolean {
  return hasPermission(userRole, "create");
}

export function canPublishMission(userRole: string | undefined): boolean {
  return hasPermission(userRole, "publish");
}

export function canReviewMission(userRole: string | undefined): boolean {
  return hasPermission(userRole, "review");
}

export function canAssignMission(userRole: string | undefined): boolean {
  return hasPermission(userRole, "assign");
}

export function canArchiveMission(userRole: string | undefined): boolean {
  return hasPermission(userRole, "archive");
}

export function canDeleteMission(userRole: string | undefined): boolean {
  return hasPermission(userRole, "delete");
}
