import { auth } from "@/lib/auth";
import { getSessionSafe } from "@/lib/get-session-safe";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import SquadPageClient from "./squad-page-client";

export const dynamic = "force-dynamic";

export default async function SquadPage() {
  const session = await getSessionSafe();
  if (!session) redirect("/signin");

  const headers_ = await headers();
  const userId = session.user.id;

  let squad: any = null;
  let dbUser: any = null;
  let incomingInvitations: any[] = [];

  try {
    const results = await Promise.allSettled([
      auth.api.getFullOrganization({ headers: headers_ }).catch(() => null),
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true, name: true, email: true, image: true,
          pseudo: true, class: true, badges: true, role: true,
          progress: { select: { level: true, experience: true } },
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
    dbUser = results[1].status === "fulfilled" ? results[1].value : null;
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
                      class: true, progress: { select: { level: true } },
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
          members: member.organization.members.map((m: any) => ({
            ...m,
            user: { ...m.user, pseudo: m.user.pseudo || m.user.name },
          })),
        };
      }
    } else {
      squad = {
        ...org,
        members: org.members.map((m: any) => ({
          ...m,
          user: { ...m.user, pseudo: m.user.name },
        })),
      };
    }

    incomingInvitations = invitations.map((inv: any) => ({
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
      user={dbUser ?? session.user}
      squad={squad}
      incomingInvitations={incomingInvitations}
    />
  );
}
