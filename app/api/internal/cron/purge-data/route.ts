import { prisma } from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { NextResponse } from "next/server";
import { purgeOldLocations } from "@/lib/location";

// Supprime les données par blocs pour éviter de bloquer la base de données
async function deleteInBatches(model: string, where: any, batchSize = 2000): Promise<number> {
  let totalDeleted = 0;
  const prismaModel = (prisma as any)[model];
  if (!prismaModel) return 0;

  while (true) {
    // Récupérer uniquement les IDs des enregistrements à supprimer
    const records = await prismaModel.findMany({
      where,
      select: { id: true },
      take: batchSize,
    });

    if (records.length === 0) break;

    const ids = records.map((r: any) => r.id);
    const deleted = await prismaModel.deleteMany({
      where: { id: { in: ids } },
    });

    totalDeleted += deleted.count;

    // Petite pause de 50ms pour libérer les ressources CPU/IO et les verrous de table
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  return totalDeleted;
}

export async function POST(req: Request) {
  // Simple cron token auth (same as other crons)
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const now = new Date();
    
    // Retention periods
    const retentionLogs = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // 12 months
    const retentionNotifications = new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000); // 6 months
    const retentionMessages = new Date(now.getTime() - 730 * 24 * 60 * 60 * 1000); // 24 months

    // 1. Purge Activity Logs
    const purgedLogsCount = await deleteInBatches("activityLog", { createdAt: { lt: retentionLogs } });

    // 2. Purge Read Notifications
    const purgedNotificationsCount = await deleteInBatches("notification", { 
      createdAt: { lt: retentionNotifications },
      isRead: true,
    });

    // 3. Purge old Contact Messages
    const purgedMessagesCount = await deleteInBatches("contactMessage", { createdAt: { lt: retentionMessages } });

    // 4. Purge old GPS location data (anonymize after 90 days)
    const purgedLocationsCount = await purgeOldLocations();

    logActivity({
      action: "CRON_PURGE_DATA",
      entity: "System",
      metadata: { 
        purgedLogs: purgedLogsCount,
        purgedNotifications: purgedNotificationsCount,
        purgedMessages: purgedMessagesCount,
        purgedLocations: purgedLocationsCount
      },
    });

    return NextResponse.json({ 
      success: true, 
      purged: {
        logs: purgedLogsCount,
        notifications: purgedNotificationsCount,
        messages: purgedMessagesCount,
        locations: purgedLocationsCount
      }
    });
  } catch (error: unknown) {
    console.error("[CRON_PURGE_DATA_ERROR]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
