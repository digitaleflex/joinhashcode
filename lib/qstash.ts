import { prisma } from "./prisma";
import { emailService } from "./email";

export interface NotificationPayload {
  userId: string;
  type: "MISSION_APPROVED" | "DAILY_REMINDER" | "LEVEL_UP" | "SYSTEM" | "MISSION_REVIEW_RELEASED" | "ACHIEVEMENT" | "SQUAD_STREAK_3" | "SQUAD_STREAK_7";
  title: string;
  message: string;
  link?: string;
  xp?: number;
  newLevel?: number;
}

/**
 * Direct and synchronous in-app notification trigger.
 * Writes notifications directly to the database and dispatches emails asynchronously,
 * completely bypassing external cloud services (QStash) and HTTP loopbacks.
 */
export async function triggerNotification(payload: NotificationPayload) {
  const { userId, type, title, message, link, xp, newLevel } = payload;

  try {
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
        xp: xp ?? 0,
      }).catch(err => console.error("🔴 [Email Service Error] sendMissionApproval:", err));
    } else if (type === "DAILY_REMINDER") {
      emailService.sendDailyReminder({
        email: notification.user.email,
        name: notification.user.name,
      }).catch(err => console.error("🔴 [Email Service Error] sendDailyReminder:", err));
    } else if (type === "LEVEL_UP" && newLevel) {
      emailService.sendLevelUp({
        email: notification.user.email,
        name: notification.user.name,
        newLevel,
      }).catch(err => console.error("🔴 [Email Service Error] sendLevelUp:", err));
    }

    return { success: true, notificationId: notification.id };
  } catch (dbErr) {
    console.error("🔴 [Notification Pipeline Error] Failed to write notification to DB:", dbErr);
    // Silent failure on notifications so it never breaks the parent transaction
    return { success: false, error: String(dbErr) };
  }
}
