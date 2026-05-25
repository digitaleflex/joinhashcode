import { prisma } from "./prisma"

// Known actions — extend freely but keep them SCREAMING_SNAKE_CASE
export type ActivityAction =
  // Auth lifecycle
  | "USER_SIGNIN"
  | "USER_SIGNUP"
  // Onboarding funnel
  | "ONBOARDING_COMPLETED"
  | "QUIZ_COMPLETED"
  | "POST_QUIZ_COMPLETED"
  // Squad
  | "SQUAD_CREATED"
  | "SQUAD_JOINED"
  | "SQUAD_UPDATED"
  | "SQUAD_INVITE_SENT"
  // Missions
  | "MISSION_VIEWED"
  | "MISSION_CLAIMED"
  | "MISSION_SUBMITTED"
  | "MISSION_APPROVED"
  | "MISSION_REJECTED"
  | "MISSION_REVISION_REQUESTED"
  // Profile / settings
  | "PROFILE_UPDATED"
  | "CHECKIN_COMPLETED"
  | "ACCOUNT_DELETED"
  // Admin
  | "ADMIN_SUBMISSION_REVIEWED"
  | "ADMIN_USER_BANNED"
  | "ADMIN_USER_UNBANNED"

interface LogOptions {
  userId?: string | null
  action: ActivityAction | string
  entity?: string
  entityId?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata?: Record<string, any>
  request?: Request
}

function getClientIp(request: Request): string | null {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    null
  )
}

/**
 * Fire-and-forget activity logger. Never throws — failures are silent
 * so a logging error never breaks the actual request.
 */
export async function logActivity(opts: LogOptions): Promise<void> {
  const { userId, action, entity, entityId, metadata, request } = opts
  try {
    if (!prisma) {
      console.error("[ACTIVITY_LOG_ERROR] Prisma client is undefined");
      return;
    }
    
    // @ts-ignore - inspecting internal models
    if (!prisma.activityLog) {
      console.error("[ACTIVITY_LOG_ERROR] prisma.activityLog is undefined. Available models:", Object.keys(prisma).filter(k => !k.startsWith("$") && !k.startsWith("_")));
    }

    await prisma.activityLog.create({
      data: {
        userId: userId ?? null,
        action,
        entity: entity ?? null,
        entityId: entityId ?? null,
        metadata: metadata ?? undefined,
        ip: request ? getClientIp(request) : null,
        userAgent: request?.headers.get("user-agent") ?? null,
      },
    })
  } catch (err) {
    console.error("[ACTIVITY_LOG_ERROR]", action, err)
  }
}
