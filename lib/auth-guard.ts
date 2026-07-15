import { auth } from "./auth";
import { prisma } from "./prisma";
import { headers } from "next/headers";

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function requireSession() {
  let session;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    throw new AuthError("Non autorisé", 401);
  }
  if (!session) throw new AuthError("Non autorisé", 401);

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      deactivatedAt: true,
      security: { select: { banned: true } },
    },
  });

  if (user?.deactivatedAt && new Date(user.deactivatedAt) <= new Date()) {
    throw new AuthError("Compte désactivé", 403);
  }

  if (user?.security?.banned) {
    throw new AuthError("Compte banni", 403);
  }

  return session;
}

export function checkCsrfOrigin(req: Request): void {
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") return;

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin) return;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    throw new AuthError("Origine invalide", 403);
  }

  if (originHost === host) return;

  const trusted = [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean).map((url) => {
    try { return new URL(url!).host; } catch { return null; }
  }).filter(Boolean) as string[];

  if (trusted.includes(originHost)) return;

  throw new AuthError("Origine non autorisée", 403);
}
