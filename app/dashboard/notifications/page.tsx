import { getSessionSafe } from "@/lib/get-session-safe";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NotificationsShell } from "@/components/dashboard/notifications-shell";
import { UserProfile } from "@/lib/types";
import type { SquadData, SquadMemberData } from "@/components/dashboard/squad-journey";

interface RawMember {
  userId: string
  role: string
  organization: {
    id: string
    name: string
    slug?: string | null
    description?: string | null
    announcement?: string | null
    isPrivate?: boolean
    requiredLevel?: number | null
    discordInviteUrl?: string | null
    cohesionScore?: number | null
    streakCount?: number | null
    members: { id: string; userId: string; role: string; user?: { id: string; name: string; pseudo?: string | null; image: string | null } }[]
  }
}

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
  let member: RawMember | null = null;

  try {
    const userData = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
      profile: { select: { bio: true } },
      lastCheckinAt: true,
      currentStreak: true,
      level: true,
      experience: true,
      missionsCompletedCount: true,
      referralCode: true,
      referralCount: true,
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
      bio: userData.profile?.bio,
      currentSituation: userData.currentSituation,
      technicalLevel: userData.technicalLevel,
      mainObjective: userData.mainObjective,
      country: userData.country,
      city: userData.city,
      lastCheckin: userData.lastCheckinAt ?? null,
      currentStreak: userData.currentStreak ?? 0,
    } as UserProfile;

    member = (userData.members[0] as RawMember) ?? null;
  } catch (error: unknown) {
    console.error("[NOTIFICATIONS_PAGE] DB fetch failed:", error);
    throw error;
  }

  const squad: SquadData | null = member?.organization ? {
    ...member.organization,
    members: member.organization.members.map((m) => ({
      id: m.id,
      userId: m.userId,
      role: m.role,
      user: m.user ? { id: m.user.id, name: m.user.name, email: "", image: m.user.image } : undefined,
    })) as SquadMemberData[]
  } : null;

  return (
    <NotificationsShell
      user={dbUser}
      squad={squad}
      memberRole={member?.role ?? undefined}
    />
  );
}
