import { getSessionSafe } from "@/lib/get-session-safe";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NotificationsShell } from "@/components/dashboard/notifications-shell";
import { UserProfile } from "@/lib/types";

export const metadata = {
  title: "Notifications | HASHCODE",
  description: "Centre de réception de tes notifications et signaux de réseau HASHCODE.",
};

export default async function NotificationsPage() {
  const session = await getSessionSafe();

  if (!session) {
    redirect("/signin");
  }

  let dbUser: UserProfile | null = null;

  try {
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        level: true,
        experience: true,
        missionsCompletedCount: true,
        referralCode: true,
        referralCount: true,
        class: true,
        behavioralVibrancy: true,
        pseudo: true,
        role: true,
        language: true,
        lastCheckinAt: true,
        currentStreak: true,
        memberNumber: true,
        createdAt: true,
        domains: true,
        tools: true,
        badges: true,
        currentSituation: true,
        technicalLevel: true,
        mainObjective: true,
        country: true,
        city: true,
        bio: true,
      },
    });

    if (!userData) {
      redirect("/signin");
    }

    dbUser = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      image: userData.image,
      level: userData.level ?? 1,
      experience: userData.experience ?? 0,
      class: userData.class,
      missionsCompletedCount: userData.missionsCompletedCount ?? 0,
      behavioralVibrancy: userData.behavioralVibrancy,
      pseudo: userData.pseudo,
      referralCode: userData.referralCode ?? null,
      referralCount: userData.referralCount ?? 0,
      role: userData.role,
      language: userData.language,
      memberNumber: userData.memberNumber,
      createdAt: userData.createdAt,
      domains: userData.domains || [],
      tools: userData.tools || [],
      badges: userData.badges || [],
      bio: userData.bio,
      currentSituation: userData.currentSituation,
      technicalLevel: userData.technicalLevel,
      mainObjective: userData.mainObjective,
      country: userData.country,
      city: userData.city,
      lastCheckin: userData.lastCheckinAt ?? null,
      currentStreak: userData.currentStreak ?? 0,
    } as UserProfile;

  } catch (error: unknown) {
    console.error("[NOTIFICATIONS_PAGE] DB fetch failed:", error);
    throw error;
  }

  return (
    <NotificationsShell
      user={dbUser}
    />
  );
}
