import { auth } from "./auth";
import { prisma } from "./prisma";
import { headers } from "next/headers";

export class AuthError extends Error {
  constructor(message: string, public status: number) {
    super(message);
  }
}

export async function requireSession(req?: Request) {
  const session = await auth.api.getSession({ headers: await headers() });
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
