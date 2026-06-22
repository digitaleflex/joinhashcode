import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { emailService } from "@/lib/email";
import { NextResponse } from "next/server";
import { safeAfter } from "@/lib/after";

// Limiteur de concurrence simple pour réguler les appels réseau d'envoi d'e-mails
async function runWithConcurrencyLimit<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<any>
) {
  const results = [];
  const executing = new Set<Promise<any>>();
  for (const item of items) {
    const p = Promise.resolve().then(() => fn(item));
    results.push(p);
    executing.add(p);
    const clean = () => executing.delete(p);
    p.then(clean, clean);
    if (executing.size >= limit) {
      await Promise.race(executing);
    }
  }
  return Promise.all(results);
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
    }

    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const BATCH_SIZE = 100;
    let notifiedCount = 0;
    let lastId: string | undefined = undefined;
    const allUsersToEmail: Array<{ email: string; name: string }> = [];

    // 1. Phase synchrone : Mise à jour en base de données (In-app notifications)
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
        allUsersToEmail.push(...inactiveUsers.map(u => ({ email: u.email, name: u.name })));
      } catch (dbErr) {
        console.error("[CRON_CHECK_ACTIVITY] Failed to bulk create notifications:", dbErr);
      }

      lastId = inactiveUsers[inactiveUsers.length - 1].id;
      if (notifiedCount > 10000) break;
    }

    // 2. Phase asynchrone : Découplage de l'envoi d'e-mails via safeAfter
    safeAfter(async () => {
      // Limitation à 10 envois d'e-mails simultanés pour préserver les sockets et le rate limit
      await runWithConcurrencyLimit(allUsersToEmail, 10, (user) => 
        emailService.sendDailyReminder({
          email: user.email,
          name: user.name,
        }).catch(err => console.error(`[CRON_CHECK_ACTIVITY] Failed to send email to ${user.email}:`, err))
      );

      // Audit de l'activité après la fin
      logActivity({
        action: "CRON_CHECK_ACTIVITY",
        entity: "System",
        metadata: { usersNotified: notifiedCount },
      });
    });

    return NextResponse.json({
      success: true,
      message: `${notifiedCount} utilisateurs notifiés et planification des e-mails en cours.`,
    });
  } catch (error: unknown) {
    console.error("[CRON_CHECK_ACTIVITY_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de la vérification d'activité." }, { status: 500 });
  }
}
