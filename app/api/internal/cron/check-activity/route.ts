import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
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
      return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Fix SEC-007: Process in batches to avoid DoS/Timeout
    const BATCH_SIZE = 50;
    let notifiedCount = 0;
    let lastId: string | undefined = undefined;

    while (true) {
      const inactiveUsers: Array<{ id: string; email: string; name: string }> = await prisma.user.findMany({
        where: {
          class: { not: null },
          stats: {
            OR: [
              { lastCheckinAt: null },
              { lastCheckinAt: { lt: cutoff } },
            ],
          },
          id: lastId ? { gt: lastId } : undefined,
        },
        select: { id: true, email: true, name: true },
        take: BATCH_SIZE,
        orderBy: { id: 'asc' },
      });

      if (inactiveUsers.length === 0) break;

      // Bulk create in-app notifications
      try {
        await prisma.notification.createMany({
          data: inactiveUsers.map(user => ({
            userId: user.id,
            type: "DAILY_REMINDER",
            title: "Check-in quotidien",
            message: "Tu n'as pas encore fait ton check-in aujourd'hui. Maintiens ton streak !",
            link: "/dashboard",
          }))
        });
        notifiedCount += inactiveUsers.length;
      } catch (dbErr) {
        console.error("[CRON_CHECK_ACTIVITY] Failed to bulk create notifications:", dbErr);
      }

      // Fire-and-forget email dispatch
      for (const user of inactiveUsers) {
        emailService.sendDailyReminder({
          email: user.email,
          name: user.name,
        }).catch(err => console.error(`[CRON_CHECK_ACTIVITY] Failed to send email to ${user.id}:`, err));
      }

      lastId = inactiveUsers[inactiveUsers.length - 1].id;
      
      // Safety break to prevent infinite loop if somehow data doesn't change
      if (notifiedCount > 10000) {
        console.warn("[CRON_CHECK_ACTIVITY] Reached safety limit of 10k notifications.");
        break;
      }
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
  } catch (error: unknown) {
    console.error("[CRON_CHECK_ACTIVITY_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de la vérification d'activité." }, { status: 500 });
  }
}
