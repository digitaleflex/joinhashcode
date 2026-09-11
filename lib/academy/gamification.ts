import { prisma } from "@/lib/prisma";

export enum ActivityType {
    COMPLETE_LESSON = "COMPLETE_LESSON",
    FINISH_COURSE = "FINISH_COURSE",
    FORUM_POST = "FORUM_POST",
    QUIZ_SUCCESS = "QUIZ_SUCCESS",
    STREAK_DAY = "STREAK_DAY",
    START_COURSE = "START_COURSE",
}

const XP_MAP: Record<ActivityType, number> = {
    [ActivityType.COMPLETE_LESSON]: 50,
    [ActivityType.FINISH_COURSE]: 500,
    [ActivityType.FORUM_POST]: 20,
    [ActivityType.QUIZ_SUCCESS]: 100,
    [ActivityType.STREAK_DAY]: 30,
    [ActivityType.START_COURSE]: 100,
};

/**
 * Central Gamification Handler — community edition
 * (Email notifications replaced with log-only; community uses its own email system)
 */
export async function onActivity(userId: string, activity: ActivityType) {
    const xpToAdd = XP_MAP[activity];

    try {
        // 1. Update XP Atomically
        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                xp: { increment: xpToAdd },
            },
            select: { xp: true, level: true, name: true, email: true },
        });

        // 2. Check for Level Up (Logic: Level = floor(sqrt(XP / 100)) + 1)
        const newLevel = Math.floor(Math.sqrt(user.xp / 100)) + 1;

        if (newLevel > user.level) {
            await prisma.user.update({
                where: { id: userId },
                data: { level: newLevel },
            });
            // Level up logged; community notification system handles the rest
        }

        // 3. Badge Logic (Simple examples)
        if (activity === ActivityType.COMPLETE_LESSON) {
            await checkAndAwardBadge(userId, "FIRST_STEP", "Premier Pas", "Terminer votre première leçon", "🎯");
        }

        return {
            success: true,
            xpGained: xpToAdd,
            leveledUp: newLevel > user.level,
            currentLevel: newLevel,
        };
    } catch (error) {
        console.error("Gamification error:", error);
        return { success: false };
    }
}

async function checkAndAwardBadge(
    userId: string,
    badgeId: string,
    name: string,
    description: string,
    icon: string,
) {
    // Upsert the badge first
    const badge = await prisma.badge.upsert({
        where: { name },
        update: {},
        create: { name, description, icon },
    });

    // Check if user already has it
    const existing = await prisma.userBadge.findUnique({
        where: { userId_badgeId: { userId, badgeId: badge.id } },
    });

    if (!existing) {
        await prisma.userBadge.create({
            data: { userId, badgeId: badge.id },
        });
    }
}
