import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getFirstAction } from "@/lib/first-action";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { checkRateLimit, mutationLimiter } from "@/lib/ratelimit";

export const dynamic = "force-dynamic";

async function loadUser(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, primaryDomain: true },
  });
  if (!user) return null;

  return { id: user.id, action: getFirstAction(user.primaryDomain) };
}

/** Returns the first actionable step for the signed-in member. */
export async function GET(req: Request) {
  const user = await loadUser(req);
  if (!user) {
    return NextResponse.json({ message: "Session expirée." }, { status: 401 });
  }
  return NextResponse.json({ action: user.action });
}

/** Records that the member started their first action (activation funnel). */
export async function POST(req: Request) {
  const user = await loadUser(req);
  if (!user) {
    return NextResponse.json({ message: "Session expirée." }, { status: 401 });
  }

  const { limited } = await checkRateLimit(mutationLimiter, user.id);
  if (limited) {
    return NextResponse.json({ message: "Trop de requêtes." }, { status: 429 });
  }

  await trackEvent(user.id, EVENTS.FIRST_ACTION_STARTED, {
    domain: user.action.domain,
    source: user.action.source ?? null,
    href: user.action.href ?? null,
  });

  return NextResponse.json({ ok: true, action: user.action });
}
