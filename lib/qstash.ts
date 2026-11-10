import { emailService } from "./email";

export interface NotificationPayload {
  userId: string;
  type: "MISSION_APPROVED" | "DAILY_REMINDER" | "SYSTEM" | "MISSION_REVIEW_RELEASED" | "ACHIEVEMENT";
  title: string;
  message: string;
  link?: string;
}

/**
 * Direct and synchronous in-app notification trigger.
 * Writes notifications directly to the database and dispatches emails asynchronously,
 * completely bypassing external cloud services (QStash) and HTTP loopbacks.
 */
export async function triggerNotification(payload: NotificationPayload) {
  const { userId, type, title, message, link } = payload;

  try {
    const { prisma } = await import("./prisma");
    // Write notification directly to PostgreSQL
    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        link: link ?? null,
      },
      include: { user: true },
    });

    // Fire-and-forget email dispatch
    if (type === "MISSION_APPROVED") {
      emailService.sendMissionApproval({
        email: notification.user.email,
        name: notification.user.name,
        missionTitle: title.replace("Mission validée : ", ""),
      }).catch(err => console.error("🔴 [Email Service Error] sendMissionApproval:", err));
    } else if (type === "DAILY_REMINDER") {
      emailService.sendDailyReminder({
        email: notification.user.email,
        name: notification.user.name,
      }).catch(err => console.error("🔴 [Email Service Error] sendDailyReminder:", err));
    }

    return { success: true, notificationId: notification.id };
  } catch (dbErr) {
    console.error("🔴 [Notification Pipeline Error] Failed to write notification to DB:", dbErr);
    // Silent failure on notifications so it never breaks the parent transaction
    return { success: false, error: String(dbErr) };
  }
}
