import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";

/**
 * Data Purge Cron
 * Enforces GDPR data minimization by removing old logs and messages.
 */
export async function POST(req: Request) {
  // Simple cron token auth (same as other crons)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const now = new Date();
    
    // Retention periods
    const retentionLogs = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 12 months
    const retentionNotifications = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); // 6 months
    const retentionMessages = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000); // 24 months

    // 1. Purge Activity Logs
    const purgedLogs = await prisma.activityLog.deleteMany({
      where: { createdAt: { lt: retentionLogs } },
    });

    // 2. Purge Read Notifications
    const purgedNotifications = await prisma.notification.deleteMany({
      where: { 
        createdAt: { lt: retentionNotifications },
        isRead: true,
      },
    });

    // 3. Purge old Contact Messages
    const purgedMessages = await prisma.contactMessage.deleteMany({
      where: { createdAt: { lt: retentionMessages } },
    });

    logActivity({
      action: "CRON_PURGE_DATA",
      entity: "System",
      metadata: { 
        purgedLogs: purgedLogs.count,
        purgedNotifications: purgedNotifications.count,
        purgedMessages: purgedMessages.count
      },
    });

    return NextResponse.json({ 
      success: true, 
      purged: {
        logs: purgedLogs.count,
        notifications: purgedNotifications.count,
        messages: purgedMessages.count
      }
    });
  } catch (error: unknown) {
    console.error("[CRON_PURGE_DATA_ERROR]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
