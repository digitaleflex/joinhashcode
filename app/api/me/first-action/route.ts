import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFirstAction } from "@/lib/first-action";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { checkRateLimit, mutationLimiter } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

type FirstActionStatus = "not_started" | "started" | "completed";

function statusOf(startedAt: Date | null, completedAt: Date | null): FirstActionStatus {
  if (completedAt) return "completed";
  if (startedAt) return "started";
  return "not_started";
}

async function loadUser(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      primaryDomain: true,
      firstActionStartedAt: true,
      firstActionCompletedAt: true,
    },
  });
  if (!user) return null;

  return {
    id: user.id,
    action: getFirstAction(user.primaryDomain),
    status: statusOf(user.firstActionStartedAt, user.firstActionCompletedAt),
    startedAt: user.firstActionStartedAt,
    completedAt: user.firstActionCompletedAt,
  };
}

/** Returns the first actionable step and its activation status. */
export async function GET(req: Request) {
  const user = await loadUser(req);
  if (!user) {
    return NextResponse.json({ message: "Session expirée." }, { status: 401 });
  }
  return NextResponse.json({
    action: user.action,
    status: user.status,
    startedAt: user.startedAt,
    completedAt: user.completedAt,
  });
}

/** Records a first-action activation event: `started` (default) or `completed`. */
export async function POST(req: Request) {
  const user = await loadUser(req);
  if (!user) {
    return NextResponse.json({ message: "Session expirée." }, { status: 401 });
  }

  const { limited } = await checkRateLimit(mutationLimiter, user.id);
  if (limited) {
    return NextResponse.json({ message: "Trop de requêtes." }, { status: 429 });
  }

  let event: "started" | "completed" = "started";
  try {
    const body = await req.json();
    if (body?.event === "completed") event = "completed";
  } catch {
    // Empty body → default to "started" (keeps the dashboard CTA simple).
  }

  const now = new Date();
  const domain = user.action.domain;

  if (event === "completed") {
    await prisma.user.updateMany({
      where: { id: user.id, firstActionCompletedAt: null },
      data: {
        firstActionDomain: domain,
        firstActionStartedAt: user.startedAt ?? now,
        firstActionCompletedAt: now,
      },
    });
    await trackEvent(user.id, EVENTS.FIRST_ACTION_COMPLETED, {
      domain,
      source: user.action.source ?? null,
      href: user.action.href ?? null,
    });
  } else {
    await prisma.user.updateMany({
      where: { id: user.id, firstActionStartedAt: null },
      data: { firstActionDomain: domain, firstActionStartedAt: now },
    });
    await trackEvent(user.id, EVENTS.FIRST_ACTION_STARTED, {
      domain,
      source: user.action.source ?? null,
      href: user.action.href ?? null,
    });
  }

  const refreshed = await loadUser(req);
  return NextResponse.json({
    ok: true,
    event,
    action: refreshed?.action ?? user.action,
    status: refreshed?.status ?? user.status,
  });
}
