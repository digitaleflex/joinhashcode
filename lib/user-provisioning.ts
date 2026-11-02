import { randomBytes } from "crypto";

/**
 * Minimal shape needed from the Prisma client. Keeping it structural makes the
 * provisioning logic testable without importing the generated client.
 */
interface UserWriter {
  user: {
    updateMany: (args: {
      where: Record<string, unknown>;
      data: Record<string, unknown>;
    }) => Promise<{ count: number }>;
  };
}

export interface NewUser {
  id: string;
  name?: string | null;
  pseudo?: string | null;
  class?: string | null;
}

const MAX_REFERRAL_CODE_LENGTH = 24;

function sanitize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_REFERRAL_CODE_LENGTH);
}

/**
 * Build a referral code from the pseudo (preferred) or the first word of the
 * name, with a short random suffix when needed. Always non-empty and safe for
 * URLs.
 */
export function buildReferralCode(
  pseudo: string | null | undefined,
  name: string | null | undefined,
  suffix?: string,
): string {
  const base =
    sanitize(pseudo ?? "") ||
    sanitize((name ?? "").split(" ")[0] ?? "") ||
    "member";
  const tail = suffix ?? randomBytes(3).toString("hex");
  return `${base}-${tail}`.slice(0, MAX_REFERRAL_CODE_LENGTH + 8);
}

/**
 * Initialise the profile of a freshly created Better Auth user.
 *
 * - Idempotent: does nothing if a referral code already exists.
 * - Collision-safe: retries with a new suffix when `referralCode` is unique.
 * - Never throws: account creation must not be rolled back by profile setup.
 *
 * @returns `true` when the profile is initialised, `false` otherwise.
 */
export async function provisionNewUser(
  db: UserWriter,
  user: NewUser,
  attempts = 3,
): Promise<boolean> {
  const baseData = {
    githubUrl: null,
    portfolioUrl: null,
    linkedinUrl: null,
    twitterUrl: null,
    currentStreak: 0,
    longestStreak: 0,
    lastCheckinAt: null,
    lastStreakDate: null,
    level: 1,
    experience: 0,
    missionsCompletedCount: 0,
  };

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      await db.user.updateMany({
        // Only touch rows that still need initialisation → idempotent.
        where: { id: user.id, referralCode: null },
        data: {
          ...baseData,
          referralCode: buildReferralCode(user.pseudo, user.name),
        },
      });

      // No row updated means the profile was already provisioned: success.
      return true;
    } catch (error) {
      const code = (error as { code?: string }).code;
      const target = (error as { meta?: { target?: string[] } }).meta?.target;
      const isReferralCollision =
        code === "P2002" &&
        (!target || target.includes("referralCode"));

      if (!isReferralCollision || attempt === attempts - 1) {
        return false;
      }
      // Another user owns this code — retry with a fresh suffix.
    }
  }

  return false;
}
