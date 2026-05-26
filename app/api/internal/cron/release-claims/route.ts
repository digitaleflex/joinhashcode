export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { triggerNotification } from "@/lib/qstash";
import { NextResponse } from "next/server";
import { Receiver } from "@upstash/qstash";
import { subHours } from "date-fns";
import { logError } from "@/lib/logger";

const receiver = new Receiver({
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY || "test_key",
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY || "test_key",
});

export async function POST(req: Request) {
  try {
    const hasQStashKeys =
      process.env.QSTASH_CURRENT_SIGNING_KEY &&
      process.env.QSTASH_CURRENT_SIGNING_KEY !== "test_key";

    if (hasQStashKeys) {
      const signature = req.headers.get("upstash-signature");
      const body = await req.text();
      const isValid = await receiver.verify({ signature: signature!, body });
      if (!isValid) return new NextResponse("Unauthorized", { status: 401 });
    } else {
      const secret = req.headers.get("x-internal-secret");
      const configuredSecret = process.env.INTERNAL_API_SECRET;
      
      if (!configuredSecret || configuredSecret.length < 16) {
        await logError("Cron Release Claims Security", new Error("INTERNAL_API_SECRET is missing or too weak."));
        return new NextResponse("Security Configuration Error", { status: 500 });
      }

      if (!secret || secret !== configuredSecret) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    const fortyEightHoursAgo = subHours(new Date(), 48);

    // 1. Find stale submissions
    const staleSubmissions = await prisma.missionSubmission.findMany({
      where: {
        status: "IN_REVIEW",
        updatedAt: { lt: fortyEightHoursAgo },
      },
      select: {
        id: true,
        userId: true,
        missionId: true,
        reviewerId: true,
      },
    });

    if (staleSubmissions.length === 0) {
      return NextResponse.json({ success: true, released: 0 });
    }

    // 2. Perform bulk update
    await prisma.missionSubmission.updateMany({
      where: {
        id: { in: staleSubmissions.map((s) => s.id) },
      },
      data: {
        status: "PENDING",
        reviewerId: null,
      },
    });

    // 3. Trigger notifications and log activity
    const notificationPromises = staleSubmissions.map((s) =>
      triggerNotification({
        userId: s.userId,
        type: "MISSION_REVIEW_RELEASED",
        title: "Soumission remise en jeu",
        message: "Ta soumission est de nouveau disponible pour review — un nouveau reviewer va bientôt la prendre en charge.",
        link: `/missions/${s.missionId}`,
      })
    );

    const logPromises = staleSubmissions.map((s) =>
      prisma.activityLog.create({
        data: {
          userId: s.userId,
          action: "CLAIM_RELEASED_AUTO",
          entity: "MissionSubmission",
          entityId: s.id,
          metadata: { 
            oldReviewerId: s.reviewerId,
            autoReleased: true 
          },
        },
      })
    );

    await Promise.all([...notificationPromises, ...logPromises]);

    console.log(`[CRON_RELEASE_CLAIMS] Released ${staleSubmissions.length} submissions.`);

    return NextResponse.json({
      success: true,
      released: staleSubmissions.length,
      ids: staleSubmissions.map(s => s.id)
    });
  } catch (error) {
    await logError("Cron Release Claims", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
