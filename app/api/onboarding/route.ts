export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { emailService } from "@/lib/email";

const onboardingSchema = z.object({
  country: z.string().min(1).max(100).optional(),
  currentSituation: z.string().min(1).max(200).optional(),
  mainObjective: z.string().min(1).max(300).optional(),
  secondaryObjectives: z.array(z.string().max(200)).max(5).optional(),
  language: z.enum(["fr", "en"]).default("fr"),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      console.error("[ONBOARDING_PATCH] No session found for request");
      return NextResponse.json({ message: "Session expirée. Déconnecte-toi et reconnecte-toi." }, { status: 401 });
    }

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ message: "Données invalides" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...parsed.data,
        secondaryObjectives: parsed.data.secondaryObjectives || [],
      },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        currentSituation: true,
        mainObjective: true,
        secondaryObjectives: true,
        language: true,
        updatedAt: true,
      }
    });

    logActivity({
      userId: session.user.id,
      action: "ONBOARDING_PARTIAL_SAVE",
      entity: "user",
      entityId: session.user.id,
      metadata: { currentSituation: parsed.data.currentSituation, country: parsed.data.country, step: parsed.data.mainObjective ? "complete" : "step0" },
      request: req,
    });

    await trackEvent(session.user.id, EVENTS.ONBOARDING_STARTED, {
        country: parsed.data.country,
        situation: parsed.data.currentSituation
    });

    // Send guidance email if onboarding is "complete" (mainObjective provided)
    if (parsed.data.mainObjective) {
      emailService.sendOnboardingCompletedEmail({
        email: updatedUser.email,
        name: updatedUser.name,
      }).catch(err => console.error("[EMAIL_ERROR] sendOnboardingCompletedEmail", err));
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[ONBOARDING_PATCH]", error);
    return NextResponse.json({ message: "Erreur système. Réessaie dans un instant." }, { status: 500 });
  }
}
