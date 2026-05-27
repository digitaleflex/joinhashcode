import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, emailOTP, admin, createAccessControl, organization, twoFactor } from "better-auth/plugins";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { emailService } from "./email";
import { randomInt } from "crypto";

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
  account: {
    storeStateStrategy: "database",
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "github"],
    },
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
      ageRange: { type: "string", required: false },
      currentSituation: { type: "string", required: false },
      technicalLevel: { type: "string", required: false },
      githubUrl: { type: "string", required: false },
      portfolioUrl: { type: "string", required: false },
      mainObjective: { type: "string", required: false },
      dominantMotivation: { type: "string", required: false },
      longTermObjective: { type: "string", required: false },
      preferredRhythm: { type: "string", required: false },
      builderScore: { type: "number", required: true, defaultValue: 0 },
      creatorScore: { type: "number", required: true, defaultValue: 0 },
      strategistScore: { type: "number", required: true, defaultValue: 0 },
      catalystScore: { type: "number", required: true, defaultValue: 0 },
      missionsCompletedCount: { type: "number", required: true, defaultValue: 0 },
      dreamStatement: { type: "string", required: false },
      currentFocus: { type: "string[]", required: false },
      mainBlocker: { type: "string", required: false },
      lastCheckinAt: { type: "date", required: false },
      betaKeyId: { type: "string", required: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await emailService.sendWelcomeEmail({
            email: user.email,
            name: user.name,
          });
        },
      },
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      scope: ["user:email"],
      mapProfileToUser: (profile: any) => {
        return {
          email: profile.email || `${profile.login}@users.noreply.github.com`,
          name: profile.name || profile.login,
          image: profile.avatar_url,
        };
      },
    },
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    defaultCookieAttributes: {
      sameSite: "lax",
      httpOnly: true, // Prevents JS access to session cookies (XSS mitigation)
    },
    trustedProxyHeaders: true,
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
    magicLink({
      sendMagicLink: async ({ email, url }: { email: string; url: string }) => {
        await emailService.sendMagicLink({ email, url });
      },
    }),
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        await emailService.sendOtpEmail({ email, otp, type });
      },
      otpLength: 8,
      expiresIn: 300,
      generateOTP: generateSecureOTP,
    }),
    admin({
      // Explicitly define admin roles and map them to their access control roles
      adminRoles: ["ADMIN", "MODERATOR"],
      defaultRole: "MEMBER",
      roles: {
        ADMIN: adminRole,
        MODERATOR: adminRole,
        MEMBER: memberRole,
      },
    }),
    organization({
      allowUserToCreateOrganization: true,
      organizationLimit: 5,
      membershipLimit: 100,
      creatorRole: "owner",
      sendInvitationEmail: async (data) => {
        const { email, organization, inviter, invitation } = data;
        await emailService.sendEmail({
          to: email,
          subject: `Rejoins l'escouade ${organization.name} sur HASHCODE`,
          html: `
            <p>${inviter.user.name} t'a invité à rejoindre l'escouade <strong>${organization.name}</strong>.</p>
            <p>HASHCODE est une communauté de bâtisseurs où nous évoluons ensemble.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/invite/accept?id=${invitation.id}" style="padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">
              Accepter l'invitation
            </a>
          `,
        });
      },
      schema: {
        organization: {
          additionalFields: {
            cohesionScore: { type: "number", defaultValue: 0.1 },
            streakCount: { type: "number", defaultValue: 0 },
            lastStreakAt: { type: "date", required: false },
            requiredLevel: { type: "number", defaultValue: 1 },
            isPrivate: { type: "boolean", defaultValue: false },
          },
        },
      },
    }),
    twoFactor({
      issuer: "HASHCODE",
      otpOptions: {
        sendOTP: async ({ user, otp }) => {
          await emailService.sendOtpEmail({
            email: user.email,
            otp,
            type: "sign-in"
          });
        },
      },
    }),
    nextCookies(),
  ],
});

