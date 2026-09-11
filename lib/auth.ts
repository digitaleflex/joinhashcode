// @ts-ignore
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, emailOTP, admin, createAccessControl, organization, multiSession } from "better-auth/plugins";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { emailService } from "./email";
import { randomInt } from "crypto";
import { redis } from "./ratelimit";
import { invalidateUserCache } from "./user-cache";
import { logError } from "./logger";

const buildTrustedOrigins = () => {
  const origins = new Set<string>();

  // Always trust localhost variants in non-production
  if (process.env.NODE_ENV !== "production") {
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }

  // Trust the explicit auth URL (whatever env it comes from)
  const authUrl = process.env.BETTER_AUTH_URL;
  if (authUrl) {
    try {
      origins.add(new URL(authUrl).origin);
    } catch {}
  }

  // Trust the public app URL + its www/non-www variant
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) {
    try {
      const origin = new URL(appUrl).origin;
      origins.add(origin);
      if (origin.includes("://www.")) origins.add(origin.replace("://www.", "://"));
      else origins.add(origin.replace("://", "://www."));
    } catch {}
  }

  // Trust the reboot funnel subdomain (acquisition) — cross-domain sessions
  const rebootUrl = process.env.NEXT_PUBLIC_REBOOT_URL;
  if (rebootUrl) {
    try {
      origins.add(new URL(rebootUrl).origin);
    } catch {}
  }

  return Array.from(origins);
};

const generateSecureOTP = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[randomInt(0, chars.length)];
  }
  return result;
};

// Define Access Control with all required permissions for the admin plugin
const ac = createAccessControl({
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "impersonate-admins",
    "delete",
    "set-password",
    "get",
    "update",
  ],
  session: ["list", "revoke", "delete"],
});

// Create roles based on the Access Control
const adminRole = ac.newRole({
  user: [
    "create",
    "list",
    "set-role",
    "ban",
    "impersonate",
    "delete",
    "set-password",
    "get",
    "update",
  ],
  session: ["list", "revoke", "delete"],
});

const moderatorRole = ac.newRole({
  user: [
    "list",
    "ban",
    "get",
    "update",
  ],
  session: ["list", "revoke"],
});

const memberRole = ac.newRole({
  user: [],
  session: [],
});

// Access control for Better Auth organization plugin (squads)
const orgAc = createAccessControl({
  organization: ["update", "delete", "list"],
  member: ["create", "delete", "update", "list"],
  invitation: ["create", "delete", "update", "list"],
});

const orgOwnerRole = orgAc.newRole({
  organization: ["update", "delete", "list"],
  member: ["create", "delete", "update"],
  invitation: ["create", "delete", "update"],
});

const orgAdminRole = orgAc.newRole({
  organization: ["update"],
  member: ["create", "delete"],
  invitation: ["create", "delete"],
});

const orgMemberRole = orgAc.newRole({
  organization: ["list"],
  member: ["list"],
  invitation: ["list"],
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: buildTrustedOrigins(),
  trustedProxyHeaders: true,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60,
    freshAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 2,
      strategy: "jwe",
    },
  },
  account: {
    storeStateStrategy: "database",
    accountLinking: {
      enabled: true,
    }
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      class: { type: "string", required: false },
      role: { type: "string", required: true, defaultValue: "MEMBER" },
      pseudo: { type: "string", required: false },
      country: { type: "string", required: false },
      city: { type: "string", required: false },
      language: { type: "string", required: true, defaultValue: "fr" },
      currentSituation: { type: "string", required: false },
      technicalLevel: { type: "string", required: false },
      mainObjective: { type: "string", required: false },
      betaKeyId: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user: Record<string, unknown>) => {
          const userClass = user.class as string | undefined;
          const userPseudo = user.pseudo as string | undefined;
          const userName = user.name as string;
          const userEmail = user.email as string;
          const userId = user.id as string;

          if (userClass) {
            emailService.sendWelcomeProfileEmail({
              email: userEmail,
              name: userName,
              profileType: userClass,
            }).catch((err) => logError("Welcome Email", err));
           } else {
            emailService.sendWelcomePendingQuiz({
               email: userEmail,
               name: userName,
             }).catch((err) => logError("Welcome Email", err));
          }

          const referralCode = userPseudo?.toLowerCase() ||
            `${userName.split(' ')[0].toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`;

          await prisma.user.update({
            where: { id: userId },
            data: {
          referralCode: referralCode,

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
            },
          });

           await invalidateUserCache(userId).catch((err) =>
             logError("Auth Hooks Cache Invalidation", `Échec pour ${userId} lors de la création : ${err}`)
           );
        },
      },
      update: {
        after: async (user: Record<string, unknown>) => {
          const userId = user.id as string;
           await invalidateUserCache(userId).catch((err) =>
             logError("Auth Hooks Cache Invalidation", `Échec pour ${userId} lors de la modification : ${err}`)
           );
        },
      },
    },
  },
  // Fix SEC-011: share rate-limit counters across replicas via Redis
  ...(redis ? (() => {
    const r = redis;
    return {
      secondaryStorage: {
        get: async (key: string) => {
           try {
             const val = await r.get(key);
             return val ?? null;
           } catch (err) {
             logError("Auth Redis Get", err);
             return null;
           }
        },
        set: async (key: string, value: string, ttl?: number) => {
           try {
             if (ttl) await r.set(key, value, { ex: ttl });
             else await r.set(key, value);
           } catch (err) {
             logError("Auth Redis Set", err);
           }
        },
        delete: async (key: string) => {
           try {
             await r.del(key);
           } catch (err) {
             logError("Auth Redis Del", err);
           }
        },
      },
    };
  })() : {}),
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true, // Prevents JS access to session cookies (XSS mitigation)
    },
    // Cross-domain sessions: reboot.joinhashcode.com → joinhashcode.com
    ...(process.env.NODE_ENV === "production"
      ? { parentDomain: ".joinhashcode.com" }
      : {}),
  },
  rateLimit: {
    enabled: true,
    window: 60, // Standard window to 60s for easier reasoning
    max: 50,    // Global limit: 50 requests per minute
    customRules: {
      "/api/auth/email-otp/send-verification-otp": {
        window: 60,
        max: 2, // Only 2 OTP sends per minute (more restrictive)
      },
      "/api/auth/sign-in/email-otp": {
        window: 60,
        max: 3, // Only 3 sign-in attempts per minute (hardens against brute-force)
      },
    },
  },
  plugins: [
    multiSession(),
    magicLink({
      sendMagicLink: async ({ email, url }: { email: string; url: string }) => {
        await emailService.sendMagicLink({ email, url });
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const result = await emailService.sendOtpEmail({ email, otp, type });
        if (!result.success && "error" in result) {
          const err = result.error;
          const errorMessage = err instanceof Error ? err.message : String(err);
           logError("Auth OTP", errorMessage);
        }
      },
      otpLength: 8,
      expiresIn: 300,
      generateOTP: generateSecureOTP,
    }),
    admin({
      adminRoles: ["ADMIN", "MODERATOR"],
      defaultRole: "MEMBER",
      roles: {
        ADMIN: adminRole,
        MODERATOR: moderatorRole,
        MEMBER: memberRole,
      },
      accessControl: ac,
    }),
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 1,
      membershipLimit: 5,
      creatorRole: "owner",
      ac: orgAc,
      roles: {
        owner: orgOwnerRole,
        admin: orgAdminRole,
        member: orgMemberRole,
      },
      schema: {
        organization: {
          additionalFields: {
            description: { type: "string", required: false },
            announcement: { type: "string", required: false },
            cohesionScore: { type: "number", defaultValue: 0.1 },
            streakCount: { type: "number", defaultValue: 0 },
            lastStreakAt: { type: "date", required: false },
            requiredLevel: { type: "number", defaultValue: 1 },
            isPrivate: { type: "boolean", defaultValue: false },
          },
        },
      },
    }),
    nextCookies(),
  ],

});
