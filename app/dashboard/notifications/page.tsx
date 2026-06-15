import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NotificationsShell } from "@/components/dashboard/notifications-shell";
import { UserProfile } from "@/lib/types";

export const metadata = {
  title: "Notifications | HASHCODE",
  description: "Centre de réception de tes notifications et signaux de réseau HASHCODE.",
};

export default async function NotificationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  let dbUser: UserProfile | null = null;
  let member: any = null;

  try {
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        stats: {
          select: { lastCheckinAt: true, currentStreak: true },
        },
        members: {
          take: 1,
          include: {
            organization: {
              include: {
                members: {
                  take: 5,
                  include: {
                    user: { select: { id: true, name: true, pseudo: true, image: true, class: true } },
                  },
                },
              },
            },
          },
        },
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
      level: userData.level,
      experience: userData.experience,
      class: userData.class,
      missionsCompletedCount: userData.missionsCompletedCount,
      behavioralVibrancy: userData.behavioralVibrancy,
      pseudo: userData.pseudo,
      referralCode: userData.referralCode,
      referralCount: userData.referralCount,
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
      lastCheckin: userData.stats?.lastCheckinAt ?? null,
      currentStreak: userData.stats?.currentStreak ?? 0,
    } as UserProfile;

    member = userData.members[0] ?? null;
  } catch (error: unknown) {
    console.error("[NOTIFICATIONS_PAGE] DB fetch failed:", error);
    throw error;
  }

  const squad = member?.organization ? {
    ...member.organization,
    members: member.organization.members.map((m: any) => ({
      ...m,
      user: {
        ...m.user,
        pseudo: m.user.pseudo || m.user.name,
      }
    }))
  } : null;

  return (
    <NotificationsShell
      user={dbUser}
      squad={squad}
      memberRole={member?.role ?? undefined}
    />
  );
}
