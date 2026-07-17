export const dynamic = 'force-dynamic'
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { checkCsrfOrigin } from "@/lib/auth-guard";
import { accountLifecycleLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function PATCH(req: Request) {
  checkCsrfOrigin(req);
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(accountLifecycleLimiter, session.user.id);
  if (limited) return NextResponse.json({ message: "Trop de tentatives. Réessaie demain." }, { status: 429 });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { deactivatedAt: null },
  });

  logActivity({
    userId: session.user.id,
    action: "ACCOUNT_REACTIVATED",
    entity: "user",
    entityId: session.user.id,
    request: req,
  });

  return NextResponse.json({ success: true });
}
