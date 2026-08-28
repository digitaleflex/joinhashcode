export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { invalidateUserCache } from "@/lib/user-cache";
import { handleApiError } from "@/lib/api-error-handler";
import { profileUpdateLimiter, checkRateLimit } from "@/lib/ratelimit";

const postQuizSchema = z.object({
  dreamStatement: z.string().min(1).max(500).optional(),
  mainBlocker: z.string().min(1).max(500).optional(),
  currentFocus: z.array(z.string().max(200)).max(5).optional(),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      return NextResponse.json({ message: "Session expirée. Déconnecte-toi et reconnecte-toi." }, { status: 401 });
    }

    const { limited } = await checkRateLimit(profileUpdateLimiter, session.user.id);
    if (limited) return NextResponse.json({ message: "Trop de modifications. Réessaie dans une heure." }, { status: 429 });

    const body = await req.json();
    const parsed = postQuizSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Données invalides", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }

    const data = parsed.data;

    if (data.dreamStatement || data.mainBlocker || data.currentFocus) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          ...(data.dreamStatement !== undefined && { dreamStatement: data.dreamStatement }),
          ...(data.mainBlocker !== undefined && { mainBlocker: data.mainBlocker }),
          ...(data.currentFocus !== undefined && { currentFocus: data.currentFocus }),
        },
      });
    }

    logActivity({
      userId: session.user.id,
      action: "POST_QUIZ_COMPLETED",
      entity: "user_profile",
      entityId: session.user.id,
      metadata: { ...parsed.data },
      request: req,
    });

    await trackEvent(session.user.id, EVENTS.ONBOARDING_COMPLETED, {
      step: "post-quiz",
      fields: Object.keys(parsed.data),
    });

    await invalidateUserCache(session.user.id);

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error, "POST_QUIZ_PATCH");
  }
}
