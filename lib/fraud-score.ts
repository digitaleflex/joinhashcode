import { prisma } from "./prisma"

export interface FraudSignal {
  name: string
  points: number
  details?: string
}

export const FRAUD_WEIGHTS = {
  VPN_DETECTED: 20,
  PROXY_DETECTED: 20,
  TOR_DETECTED: 25,
  DATACENTER_IP: 15,
  FINGERPRINT_SHARED: 40,
  EMAIL_TEMPORARY: 30,
  MULTI_ACCOUNT_SAME_IP: 50,
  SUSPICIOUS_ACTIVITY: 35,
  IP_BLACKLISTED: 30,
  IP_HIGH_RISK: 25,
  BEHAVIOR_ANOMALY: 15,
} as const

export const FRAUD_THRESHOLDS = {
  NORMAL: { min: 0, max: 30 },
  SURVEILLANCE: { min: 31, max: 60 },
  MANUAL_REVIEW: { min: 61, max: 80 },
  BLOCKED: { min: 81, max: 100 },
} as const

export type FraudLevel = "NORMAL" | "SURVEILLANCE" | "MANUAL_REVIEW" | "BLOCKED"

export function getFraudLevel(score: number): FraudLevel {
  if (score <= 30) return "NORMAL"
  if (score <= 60) return "SURVEILLANCE"
  if (score <= 80) return "MANUAL_REVIEW"
  return "BLOCKED"
}

export async function addFraudSignal(
  userId: string,
  signal: FraudSignal,
  meta?: { ip?: string; visitorId?: string }
) {
  const { name, points, details } = signal

  await prisma.$transaction(async (tx) => {
    await tx.userSecurity.upsert({
      where: { userId },
      create: { userId, fraudRiskScore: points },
      update: { fraudRiskScore: { increment: points } },
    })

    await tx.fraudEvent.create({
      data: {
        userId,
        action: name,
        details: details ?? null,
        riskDelta: points,
        ip: meta?.ip ?? null,
        visitorId: meta?.visitorId ?? null,
      },
    })
  })
}

export async function checkFingerprintShared(
  visitorId: string,
  currentUserId: string
): Promise<boolean> {
  const usersWithSameFingerprint = await prisma.user.findMany({
    where: { visitorId, id: { not: currentUserId } },
    select: { id: true },
  })

  return usersWithSameFingerprint.length > 0
}
