import { prisma } from "./prisma"
import { sanitizeMetadata } from "./logger"
import { getClientIp } from "./utils"
import type { Prisma } from "@/generated/prisma/client"

// Known actions — extend freely but keep them SCREAMING_SNAKE_CASE
export type ActivityAction =
  // Auth lifecycle
  | "USER_SIGNIN"
  | "USER_SIGNUP"
  // Referral
  | "REFERRAL_REWARD_GRANTED"
  | "REFERRAL_COMPLETED"
  // Onboarding funnel
  | "ONBOARDING_COMPLETED"
  | "QUIZ_COMPLETED"
  | "POST_QUIZ_COMPLETED"
  // Squad
  | "SQUAD_CREATED"
  | "SQUAD_JOINED"
  | "SQUAD_UPDATED"
  | "SQUAD_INVITE_SENT"
  | "SQUAD_DISBANDED"
  | "SQUAD_OWNERSHIP_TRANSFERRED"
  // Ateliers
  | "ATELIER_STARTED"
  | "ATELIER_COMPLETED"
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
  | "ACCOUNT_DEACTIVATED"
  | "ACCOUNT_REACTIVATED"
  | "ACCOUNT_DELETED"
  // Admin
  | "ADMIN_SUBMISSION_REVIEWED"
  | "ADMIN_USER_BANNED"
  | "ADMIN_USER_UNBANNED"
  | "ADMIN_USER_EXPORTED"
  | "ADMIN_MISSION_CREATED"
  | "ADMIN_MISSION_UPDATED"
  | "ADMIN_MISSION_DELETED"
  | "ADMIN_BETA_KEY_GENERATED"
  | "ADMIN_BETA_KEY_DELETED"
  | "ADMIN_BROADCAST_SENT"
  | "ADMIN_USER_IMPERSONATED"
  | "ADMIN_ROLE_UPDATED"

interface LogOptions {
  userId?: string | null
  action: ActivityAction | string
  entity?: string
  entityId?: string
   
  metadata?: Record<string, unknown>
  request?: Request
}

/**
 * Fire-and-forget activity logger. Never throws — failures are silent
 * so a logging error never breaks the actual request.
 */
export async function logActivity(opts: LogOptions): Promise<void> {
  const { userId, action, entity, entityId, metadata, request } = opts
  try {
    await prisma.activityLog.create({
      data: {
        userId: userId ?? null,
        action,
        entity: entity ?? null,
        entityId: entityId ?? null,
        metadata: metadata ? (sanitizeMetadata(metadata) as Prisma.InputJsonValue) : undefined,
        ip: request ? getClientIp(request.headers) : null,
        userAgent: request?.headers.get("user-agent") ?? null,
      },
    })
  } catch (error: unknown) {
    console.error("[ACTIVITY_LOG_ERROR]", action, error)
  }
}
