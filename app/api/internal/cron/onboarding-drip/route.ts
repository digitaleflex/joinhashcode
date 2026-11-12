import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";
import { safeAfter } from "@/lib/after";

async function runWithConcurrencyLimit<T>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<unknown>
) {
  const results = [];
  const executing = new Set<Promise<unknown>>();
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
      return NextResponse.json({ message: "Accès non autorisé." }, { status: 401 });
    }

    const now = new Date();
    
    const getWindow = (days: number) => {
      const start = new Date(now);
      start.setDate(start.getDate() - days);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      return { start, end };
    };

    const d1 = getWindow(1);
    const d7 = getWindow(7);

    const steps = [
      { day: 1, window: d1, action: "ONBOARDING_EMAIL_D1" },
      { day: 7, window: d7, action: "ONBOARDING_EMAIL_D7" },
    ] as const;

    const emailTasks: Array<{
      userId: string;
      email: string;
      name: string;
      day: number;
      action: string;
      class: string | null;
    }> = [];

    // 1. Recherche rapide des utilisateurs qualifiés en base de données
    for (const step of steps) {
      const users = await prisma.user.findMany({
        where: {
          createdAt: { gte: step.window.start, lte: step.window.end },
          banned: { not: true },
          activityLogs: {
            none: { action: step.action }
          }
        },
        select: { id: true, email: true, name: true, class: true }
      });

      for (const user of users) {
        emailTasks.push({
          userId: user.id,
          email: user.email,
          name: user.name,
          day: step.day,
          action: step.action,
          class: user.class
        });
      }
    }

    if (emailTasks.length === 0) {
      return NextResponse.json({ success: true, message: "Aucun e-mail à envoyer." });
    }

    // 2. Découplage de l'envoi réseau et de la création de logs d'activité via safeAfter
    safeAfter(async () => {
      await runWithConcurrencyLimit(emailTasks, 5, async (task) => {
        try {
          const basePayload = { email: task.email, name: task.name };

          if (task.day === 1) {
            await emailService.sendMissionProtocolEmail({
              ...basePayload,
              userClass: task.class,
            });
          } else if (task.day === 7) {
            await emailService.sendDigitalIdentityEmail(basePayload);
          }

          // Écriture du log d'activité en tâche de fond (sans await bloquant pour le reste du script)
          logActivity({
            userId: task.userId,
            action: task.action,
            entity: "Email",
            metadata: { day: task.day, email: task.email }
          });
        } catch (error: unknown) {
          console.error(`[CRON_ONBOARDING_DRIP] Failed to send Day ${task.day} to ${task.userId}:`, error);
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: `Campagne Drip : ${emailTasks.length} e-mails planifiés pour envoi en arrière-plan.`,
    });

  } catch (error: unknown) {
    console.error("[CRON_ONBOARDING_DRIP_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors du traitement du drip." }, { status: 500 });
  }
}
