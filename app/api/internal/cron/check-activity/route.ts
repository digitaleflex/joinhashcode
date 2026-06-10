import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";

/**
 * Daily Activity Check Cron
 *
 * Finds users inactive for more than 24h and sends a DAILY_REMINDER notification.
 * Should run once per day via QStash.
 */
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return new NextResponse("Accès non autorisé. Token de cron invalide.", { status: 401 });
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const inactiveUsers = await prisma.user.findMany({
      where: {
        class: { not: null },
        OR: [
          { lastCheckinAt: null },
          { lastCheckinAt: { lt: cutoff } },
        ],
      },
      select: { id: true },
    });

    let notifiedCount = 0;

    for (const user of inactiveUsers) {
      await triggerNotification({
        userId: user.id,
        type: "DAILY_REMINDER",
        title: "Check-in quotidien",
        message: "Tu n'as pas encore fait ton check-in aujourd'hui. Maintiens ton streak !",
        link: "/dashboard",
      });
      notifiedCount++;
    }

    logActivity({
      action: "CRON_CHECK_ACTIVITY",
      entity: "System",
      metadata: { usersNotified: notifiedCount },
    });

    return NextResponse.json({
      success: true,
      message: `${notifiedCount} utilisateurs notifiés.`,
    });
  } catch (error) {
    console.error("[CRON_CHECK_ACTIVITY_ERROR]", error);
    return new NextResponse("Erreur interne lors de la vérification d'activité.", { status: 500 });
  }
}
