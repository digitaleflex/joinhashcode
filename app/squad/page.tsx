import { auth } from "@/lib/auth";
import { getSessionSafe } from "@/lib/get-session-safe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SquadPageClient from "./squad-page-client";
import type { SquadData, SquadMemberData, UserData, IncomingInvitation } from "@/components/dashboard/squad-journey";

export const dynamic = "force-dynamic";

interface RawMember {
  userId: string
  role: string
  user?: { id: string; name: string | null; pseudo?: string | null; image: string | null }
}

function mapMembers(members: RawMember[]): SquadMemberData[] {
  return members.map((m) => ({
    id: m.userId,
    userId: m.userId,
    role: m.role,
    user: m.user ? { id: m.user.id, name: m.user.name ?? "", email: "", image: m.user.image } : undefined,
  }));
}

export default async function SquadPage() {
  const session = await getSessionSafe();
  if (!session) redirect("/signin");

  const headers_ = await headers();
  const userId = session.user.id;

  let squad: SquadData | null = null;
  let dbUser: UserData | null = null;
  let incomingInvitations: IncomingInvitation[] = [];

  try {
    const results = await Promise.allSettled([
      auth.api.getFullOrganization({ headers: headers_ }).catch(() => null),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, name: true, email: true, image: true,
          pseudo: true, class: true, badges: true, role: true,
          level: true,
          experience: true,
        },
      }),
      prisma.invitation.findMany({
        where: { email: session.user.email, status: "pending" },
        include: {
          organization: { select: { name: true, slug: true, description: true } },
          user: { select: { name: true } },
        },
      }),
    ]);

    const org = results[0].status === "fulfilled" ? results[0].value : null;
    dbUser = results[1].status === "fulfilled" ? (results[1].value as UserData | null) : null;
    const invitations = results[2].status === "fulfilled" ? results[2].value : [];

    if (!org) {
      const member = await prisma.member.findFirst({
        where: { userId },
        include: {
          organization: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true, name: true, pseudo: true, image: true,
                      class: true, level: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (member?.organization) {
        squad = {
          ...member.organization,
          members: mapMembers(member.organization.members as RawMember[]),
        } as SquadData;
      }
    } else {
      squad = {
        ...org,
        members: mapMembers(org.members as unknown as RawMember[]),
      } as SquadData;
    }

    incomingInvitations = invitations.map((inv) => ({
      id: inv.id,
      organizationId: inv.organizationId,
      organizationName: inv.organization.name,
      organizationDescription: inv.organization.description,
      inviterName: inv.user.name,
      role: inv.role,
      status: inv.status,
    }));
  } catch (error) {
    console.error("[SQUAD_PAGE]", error);
  }

  return (
    <SquadPageClient
      user={dbUser ?? (session.user as unknown as UserData)}
      squad={squad}
      incomingInvitations={incomingInvitations}
    />
  );
}
