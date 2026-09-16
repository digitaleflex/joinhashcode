import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { triggerNotification } from "@/lib/qstash";
import { logActivity } from "@/lib/activity-log";

const SLA_HOURS = 48;

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
    }

    const cutoff = new Date(Date.now() - SLA_HOURS * 60 * 60 * 1000);

    const staleSubmissions = await prisma.missionSubmission.findMany({
      where: {
        status: "IN_REVIEW",
        updatedAt: { lt: cutoff },
      },
      include: {
        mission: { select: { title: true } },
        reviewer: { select: { id: true, name: true, email: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      take: 100,
    });

    if (staleSubmissions.length === 0) {
      return NextResponse.json({ checked: 0, notified: 0 });
    }

    let notified = 0;

    for (const sub of staleSubmissions) {
      if (sub.reviewer) {
        try {
          await triggerNotification({
            userId: sub.reviewer.id,
            type: "SYSTEM",
            title: `⚠️ SLA Review : ${sub.mission.title}`,
            message: `La soumission de ${sub.user.name} attend ta revue depuis plus de ${SLA_HOURS}h.`,
            link: `/reviewer/submissions/${sub.id}`,
          });
          notified++;
        } catch (error: unknown) {
          console.error("[REVIEW_SLA] Notification failed for reviewer", sub.reviewer.id, error);
        }
      }

      const admins = await prisma.user.findMany({
        where: { role: { in: ["ADMIN", "MODERATOR"] } },
        select: { id: true },
      });

      for (const admin of admins) {
        try {
          await triggerNotification({
            userId: admin.id,
            type: "SYSTEM",
            title: `🚨 SLA Breach : ${sub.mission.title}`,
            message: `Soumission de ${sub.user.name} en revue depuis >${SLA_HOURS}h sans décision.`,
            link: `/admin/submissions/${sub.id}`,
          });
          notified++;
        } catch (error: unknown) {
          console.error("[REVIEW_SLA] Notification failed for admin", admin.id, error);
        }
      }

      logActivity({
        action: "REVIEW_SLA_BREACH",
        entity: "mission_submission",
        entityId: sub.id,
        metadata: { missionTitle: sub.mission.title, submitterId: sub.userId, reviewerId: sub.reviewerId },
      });
    }

    return NextResponse.json({ checked: staleSubmissions.length, notified });
  } catch (error: unknown) {
    console.error("[CRON_REVIEW_SLA_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne lors de la vérification SLA." }, { status: 500 });
  }
}