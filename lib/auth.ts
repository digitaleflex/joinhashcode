import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink, emailOTP, admin, createAccessControl } from "better-auth/plugins";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { emailService } from "./email";
import { randomBytes } from "crypto";

const buildTrustedOrigins = () => {
  const origins = new Set(["http://localhost:3000"]);
  if (process.env.BETTER_AUTH_URL) origins.add(process.env.BETTER_AUTH_URL);
  if (process.env.NEXT_PUBLIC_APP_URL) {
    const url = process.env.NEXT_PUBLIC_APP_URL;
    origins.add(url);
    if (url.includes("://www.")) origins.add(url.replace("://www.", "://"));
    else origins.add(url.replace("://", "://www."));
  }
  return Array.from(origins);
};

const generateSecureOTP = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const randomBuffer = randomBytes(8);
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars[randomBuffer[i] % chars.length];
  }
  return result;
};

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
    }),
    nextCookies(),
  ],
});
