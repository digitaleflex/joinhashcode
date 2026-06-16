export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { logActivity } from "@/lib/activity-log";
import { trackEvent, EVENTS } from "@/lib/analytics";
import { emailService } from "@/lib/email";
import { invalidateUserCache } from "@/lib/user-cache";
import { handleApiError } from "@/lib/api-error-handler";
import { awardXp } from "@/lib/experience";
import { cookies } from "next/headers";

const pseudoRegex = /^[a-zA-Z0-9_]{3,20}$/;

const onboardingSchema = z.object({
  pseudo: z.string().regex(pseudoRegex, "Pseudo invalide (3-20 caractères, lettres, chiffres, _)").optional(),
  technicalLevel: z.enum(["Débutant", "Intermédiaire", "Avancé"]).optional(),
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
        pseudo: true,
        technicalLevel: true,
        country: true,
        currentSituation: true,
        mainObjective: true,
        secondaryObjectives: true,
        language: true,
        updatedAt: true,
      }
    }).catch((err: any) => {
      if (err?.code === "P2002" && err?.meta?.target?.includes("pseudo")) {
        throw Object.assign(new Error("PSEUDO_TAKEN"), { status: 409 });
      }
      throw err;
    });

    const isComplete = !!parsed.data.mainObjective

    logActivity({
      userId: session.user.id,
      action: isComplete ? "ONBOARDING_COMPLETED" : "ONBOARDING_PARTIAL_SAVE",
      entity: "user",
      entityId: session.user.id,
      metadata: { 
        ...parsed.data,
        isComplete 
      },
      request: req,
    });

    const cookieStore = await cookies();
    cookieStore.delete("hc_mw");

    await trackEvent(session.user.id, EVENTS.ONBOARDING_STARTED, {
      fields: Object.keys(parsed.data),
    });

    if (isComplete) {
      await trackEvent(session.user.id, EVENTS.ONBOARDING_COMPLETED, {
        country: parsed.data.country,
        situation: parsed.data.currentSituation
      });

      emailService.sendOnboardingCompletedEmail({
        email: updatedUser.email,
        name: updatedUser.name,
      }).catch(err => console.error("[EMAIL_ERROR] sendOnboardingCompletedEmail", err));

      // Referral attribution — only on first completion (referrerId not yet set)
      const refCode = cookieStore.get("hashcode_ref")?.value;
      if (refCode) {
        try {
          const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { referrerId: true } });
          if (!currentUser?.referrerId) {
            const referrer = await prisma.user.findUnique({ where: { referralCode: refCode }, select: { id: true, name: true } });
            if (referrer && referrer.id !== session.user.id) {
              await prisma.user.update({ where: { id: session.user.id }, data: { referrerId: referrer.id } });
              await prisma.user.update({ where: { id: referrer.id }, data: { referralCount: { increment: 1 } } });
              awardXp(referrer.id, 50, "REFERRAL_COMPLETED", session.user.id).catch(err => console.error("[XP_ERROR]", err));

              // Notify referrer via notification (non-blocking)
              prisma.notification.create({
                data: {
                  userId: referrer.id,
                  type: "REFERRAL_SUCCESS",
                  title: "Récompense de parrainage ! 💎",
                  message: `Ton ami ${session.user.name || "Un nouvel agent"} a rejoint HASHCODE. Tu as reçu +50 XP.`,
                  link: "/dashboard",
                }
              }).catch(err => console.error("[NOTIFICATION_ERROR]", err));
            }
          }
          cookieStore.delete("hashcode_ref");
        } catch (refErr) {
          console.error("[REFERRAL_ERROR]", refErr);
        }
      }
    }

    await invalidateUserCache(session.user.id);

    return NextResponse.json(updatedUser);
  } catch (error: any) {
    if (error?.message === "PSEUDO_TAKEN") {
      return NextResponse.json({ message: "Ce pseudo est déjà pris, choisis-en un autre." }, { status: 409 });
    }
    return handleApiError(error, "ONBOARDING_PATCH");
  }
}
