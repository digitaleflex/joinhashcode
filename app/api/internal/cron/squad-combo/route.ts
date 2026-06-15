export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { triggerNotification } from "@/lib/qstash";
import { NextResponse } from "next/server";

/**
 * Squad Combo Check Cron
 * 
 * Rules:
 * 1. Checks every squad (Organization).
 * 2. If 100% of members performed a DailyCheckin in the last 24h:
 *    - Update lastComboAt to now.
 *    - Increment streakCount (optional but recommended).
 *    - Send a notification to members.
 * 
 * This cron should run once a day, ideally at 00:01.
 */
export async function POST(req: Request) {
  try {
    // 1. Bearer Token Authentication
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé." }, { status: 401 });
    }

    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // 2. Fetch all squads with their members
    const squads = await prisma.organization.findMany({
      include: {
        members: {
          select: {
            userId: true,
          }
        }
      }
    });

    let combosActivated = 0;

    for (const squad of squads) {
      if (squad.members.length === 0) continue;

      const memberIds = squad.members.map(m => m.userId);

      // 3. Count unique members who did a checkin in the last 24h
      const checkinCount = await prisma.dailyCheckin.count({
        where: {
          userId: { in: memberIds },
          createdAt: { gte: twentyFourHoursAgo }
        }
      });

      // 4. If all members did it: COMBO!
      // (Using >= because someone might have done 2 checkins if they are near the 20h limit, 
      // but unique checkins per user is safer)
      const uniqueCheckins = await prisma.dailyCheckin.groupBy({
        by: ['userId'],
        where: {
          userId: { in: memberIds },
          createdAt: { gte: twentyFourHoursAgo }
        }
      });

      if (uniqueCheckins.length === squad.members.length) {
        // Activate Combo
        await prisma.organization.update({
          where: { id: squad.id },
          data: { 
            lastComboAt: new Date(),
            streakCount: { increment: 1 }
          }
        });

        // Notify members
        for (const memberId of memberIds) {
          await triggerNotification({
            userId: memberId,
            type: "SQUAD_STREAK_7", // Reusing a high-tier icon
            title: "🔥 Combo d'Escouade Réussi !",
            message: `100% de l'escouade "${squad.name}" a fait son check-in. Profitez d'un boost d'XP de 15% pour les prochaines 24h !`,
            link: "/squad"
          }).catch(console.error);
        }

        combosActivated++;

        logActivity({
          action: "SQUAD_STREAK_3",
          entity: "Organization",
          entityId: squad.id,
          metadata: { comboSuccess: true, membersCount: squad.members.length }
        });
      }
    }

    return NextResponse.json({
      success: true,
      combosActivated,
      totalSquads: squads.length
    });
  } catch (error: unknown) {
    console.error("[CRON_SQUAD_COMBO_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
