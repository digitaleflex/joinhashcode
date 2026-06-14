export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { NextResponse } from "next/server";

// Time cutoff for review claims (48 hours)
const CLAIM_TIMEOUT_HOURS = 48;

export async function POST(req: Request) {
  try {
    // 1. Authenticate using static Bearer Token (CRON_SECRET)
    const authHeader = req.headers.get("authorization");
    const expectedSecret = process.env.CRON_SECRET;

    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return NextResponse.json({ message: "Accès non autorisé. Token de cron invalide." }, { status: 401 });
    }

    const cutoff = new Date();
    cutoff.setHours(cutoff.getHours() - CLAIM_TIMEOUT_HOURS);

    // 2. Query all submissions in IN_REVIEW status that exceeded the timeout
    const staleSubmissions = await prisma.missionSubmission.findMany({
      where: {
        status: "IN_REVIEW",
        updatedAt: { lt: cutoff },
      },
      select: {
        id: true,
        missionId: true,
        userId: true,
        reviewerId: true,
        mission: {
          select: {
            title: true,
          },
        },
      },
    });

    if (staleSubmissions.length === 0) {
      return NextResponse.json({ released: 0, message: "Aucune soumission expirée à libérer." });
    }

    const staleIds = staleSubmissions.map((s) => s.id);

    // 3. Atomically reset status to PENDING and notify owners
    const result = await prisma.$transaction(async (tx) => {
      // Release claims in database
      const updateResult = await tx.missionSubmission.updateMany({
        where: { id: { in: staleIds } },
        data: {
          status: "PENDING",
          reviewerId: null,
        },
      });

      // Write audit log entry for the release activity
      await tx.activityLog.createMany({
        data: staleSubmissions.map((s) => ({
          userId: s.reviewerId, // The reviewer who lost the claim
          action: "CLAIM_RELEASED_AUTO",
          entity: "MissionSubmission",
          entityId: s.id,
          metadata: {
            submissionId: s.id,
            missionId: s.missionId,
            userId: s.userId,
            oldReviewerId: s.reviewerId,
          },
        })),
      });

      // In-app notifications to authors
      for (const s of staleSubmissions) {
        await triggerNotification({
          userId: s.userId,
          type: "MISSION_REVIEW_RELEASED",
          title: "Soumission remise en file d'attente",
          message: `Ta soumission pour la mission "${s.mission.title}" a été remise dans la file d'attente générale suite à l'inactivité du reviewer assigné. Un autre membre va la prendre en charge sous peu !`,
          link: "/missions",
        });
      }

      return updateResult;
    });

    console.log(`[cron/release-claims] Libération de ${result.count} soumissions.`);

    return NextResponse.json({
      released: result.count,
      ids: staleIds,
    });
  } catch (error: unknown) {
    console.error("[CRON_RELEASE_CLAIMS_ERROR]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
