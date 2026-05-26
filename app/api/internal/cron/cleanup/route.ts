export const dynamic = "force-dynamic";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logError, logInfo } from "@/lib/logger";
import { subDays } from "date-fns";

/**
 * Maintenance Cron: Cleanup expired data.
 * Should be run once a week.
 */
export async function POST(req: Request) {
  try {
    const secret = req.headers.get("x-internal-secret");
    if (!secret || secret !== (process.env.INTERNAL_API_SECRET || "")) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = subDays(now, 30);
    const ninetyDaysAgo = subDays(now, 90);

    // 1. Cleanup Expired Invitations (Better Auth table)
    const deletedInvitations = await prisma.invitation.deleteMany({
      where: {
        expiresAt: { lt: now },
      },
    });

    // 2. Cleanup Rejected JoinRequests (> 30 days)
    const deletedRequests = await prisma.joinRequest.deleteMany({
      where: {
        status: "REJECTED",
        createdAt: { lt: thirtyDaysAgo },
      },
    });

    // 3. Cleanup Old Activity Logs (> 90 days)
    const deletedLogs = await prisma.activityLog.deleteMany({
        where: {
            createdAt: { lt: ninetyDaysAgo }
        }
    });

    await logInfo("Cron Cleanup", `Successfully cleaned up expired data.`, {
        deletedInvitations: deletedInvitations.count,
        deletedRequests: deletedRequests.count,
        deletedLogs: deletedLogs.count
    });

    return NextResponse.json({
      success: true,
      deletedInvitations: deletedInvitations.count,
      deletedRequests: deletedRequests.count,
      deletedLogs: deletedLogs.count
    });
  } catch (error) {
    await logError("Cron Cleanup", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
