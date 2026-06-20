import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";

/**
 * Onboarding Drip Campaign Cron
 * 
 * Sends automated guide emails at Day 1, Day 3, and Day 7 after registration.
 * Should run once per day (e.g., at 09:00 UTC).
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé." }, { status: 401 });
    }

    const now = new Date();
    
    // Define windows for D1, D3, D7
    const getWindow = (days: number) => {
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    };

    const d1 = getWindow(1);
    const d3 = getWindow(3);
    const d7 = getWindow(7);

    const steps = [
      { day: 1, window: d1, action: "ONBOARDING_EMAIL_D1" },
      { day: 3, window: d3, action: "ONBOARDING_EMAIL_D3" },
      { day: 7, window: d7, action: "ONBOARDING_EMAIL_D7" },
    ] as const;

    let totalSent = 0;

    for (const step of steps) {
      // Find users registered in this window
      const users = await prisma.user.findMany({
        where: {
          createdAt: { gte: step.window.start, lte: step.window.end },
          security: { banned: { not: true } },
          // Optimization: check if we already logged this activity for this user
          activityLogs: {
            none: { action: step.action }
          }
        },
        select: { id: true, email: true, name: true, class: true }
      });

      for (const user of users) {
        try {
          const basePayload = { email: user.email, name: user.name };

          if (step.day === 1) {
            await emailService.sendMissionProtocolEmail({
              ...basePayload,
              userClass: user.class || "Bâtisseur",
            });
          } else if (step.day === 3) {
            await emailService.sendSquadPowerEmail(basePayload);
          } else if (step.day === 7) {
            await emailService.sendDigitalIdentityEmail(basePayload);
          }

          // Log to prevent double-send and track performance
          await logActivity({
            userId: user.id,
            action: step.action,
            entity: "Email",
            metadata: { day: step.day, email: user.email }
          });

          totalSent++;
        } catch (error: unknown) {
          console.error(`[CRON_ONBOARDING_DRIP] Failed to send Day ${step.day} to ${user.id}:`, error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Campagne Drip : ${totalSent} e-mails envoyés.`,
      details: { d1: d1.start, d3: d3.start, d7: d7.start }
    });

  } catch (error: unknown) {
    console.error("[CRON_ONBOARDING_DRIP_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors du traitement du drip." }, { status: 500 });
  }
}
