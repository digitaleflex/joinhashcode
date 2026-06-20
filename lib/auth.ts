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

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: buildTrustedOrigins(),
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    freshAge: 60 * 60,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
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
    // github: {
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // },
  },
  user: {
    changeEmail: {
      enabled: true,
    },
    additionalFields: {
      level: { type: "number", required: true, defaultValue: 1 },
      experience: { type: "number", required: true, defaultValue: 0 },
      class: { type: "string", required: false },
      role: { type: "string", required: true, defaultValue: "MEMBER" },
      pseudo: { type: "string", required: false },
      country: { type: "string", required: false },
      city: { type: "string", required: false },
      language: { type: "string", required: true, defaultValue: "fr" },
      currentSituation: { type: "string", required: false },
      technicalLevel: { type: "string", required: false },
      mainObjective: { type: "string", required: false },
      missionsCompletedCount: { type: "number", required: true, defaultValue: 0 },
      dreamStatement: { type: "string", required: false },
      currentFocus: { type: "string[]", required: false },
      mainBlocker: { type: "string", required: false },
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
            await emailService.sendWelcomeProfileEmail({
              email: userEmail,
              name: userName,
              profileType: userClass,
            });
          } else {
            await emailService.sendWelcomePendingQuiz({
              email: userEmail,
              name: userName,
            });
          }

          const referralCode = userPseudo?.toLowerCase() ||
            `${userName.split(' ')[0].toLowerCase()}-${Math.random().toString(36).substring(2, 7)}`;

          await prisma.user.update({
            where: { id: userId },
            data: {
              referral: {
                upsert: {
                  create: { referralCode },
                  update: { referralCode },
                }
              },
              psychometrics: {
                create: {
                  builderScore: 0,
                  creatorScore: 0,
                  strategistScore: 0,
                  catalystScore: 0,
                  confidenceScore: 0.25,
                }
              },
              socials: {
                create: {
                  githubUrl: null,
                  portfolioUrl: null,
                  linkedinUrl: null,
                  twitterUrl: null,
                }
              },
              stats: {
                create: {
                  currentStreak: 0,
                  longestStreak: 0,
                  lastCheckinAt: null,
                  lastStreakDate: null,
                }
              }
            },
          });

          await invalidateUserCache(userId).catch((err) =>
            console.error(`🟢 [Auth Hooks] Échec de l'invalidation du cache de ${userId} lors de la création :`, err)
          );
        },
      },
      update: {
        after: async (user: Record<string, unknown>) => {
          const userId = user.id as string;
          await invalidateUserCache(userId).catch((err) =>
            console.error(`🟢 [Auth Hooks] Échec de l'invalidation du cache de ${userId} lors de la modification :`, err)
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
          const val = await r.get<string>(key);
          return val ?? null;
        },
        set: async (key: string, value: string, ttl?: number) => {
          if (ttl) await r.set(key, value, { ex: ttl });
          else await r.set(key, value);
        },
        delete: async (key: string) => {
          await r.del(key);
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
    // Fix SEC-004: Trust proxy headers in production (Docker proxy) to avoid 403 CSRF errors
    trustedProxyHeaders: process.env.NODE_ENV === "production" || !!process.env.TRUSTED_PROXIES,
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
        try {
          const result = await emailService.sendOtpEmail({ email, otp, type });
          if (!result.success) {
            const error = (result as { error?: any }).error;
            throw new Error(
              error?.message
                ? String(error.message)
                : typeof error === "string"
                  ? error
                  : "Failed to send OTP email"
            );
          }
        } catch (err: any) {
          console.error("[AUTH][emailOTP] Failed to send OTP:", err);
          throw err;
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
      roles: {
        owner: {
          organization: ["update", "delete", "list"],
          member: ["create", "delete", "update"],
          invitation: ["create", "delete", "update"],
        },
        admin: {
          organization: ["update"],
          member: ["create", "delete"],
          invitation: ["create", "delete"],
        },
        member: {
          organization: ["list"],
          member: ["list"],
          invitation: ["list"],
        },
      } as any,
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
