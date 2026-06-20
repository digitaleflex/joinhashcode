import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isFeatureEnabled } from "@/lib/features";
import SquadPageClient from "./squad-page-client";

export default async function SquadPage() {
  if (!isFeatureEnabled("squads")) redirect("/dashboard");
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const headers_ = await headers();
  const userId = session.user.id;

  const [org, dbUser, incomingInvitations] = await Promise.all([
    auth.api.getFullOrganization({ headers: headers_ }),
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        pseudo: true,
        class: true,
        badges: true,
        role: true,
        progress: { select: { level: true, experience: true } },
      },
    }),
    prisma.invitation.findMany({
      where: {
        email: session.user.email,
        status: "pending"
      },
      include: {
        organization: {
          select: {
            name: true,
            slug: true,
            description: true
          }
        },
        user: {
          select: {
            name: true
          }
        }
      }
    })
  ]);

  // Fallback to database lookup if BA active organization cookie is missing
  let dbSquad = null;
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
                    id: true,
                    name: true,
                    pseudo: true,
                    image: true,
                    class: true,
                    progress: { select: { level: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (member?.organization) {
      dbSquad = {
        ...member.organization,
        members: member.organization.members.map((m: any) => ({
          ...m,
          user: {
            ...m.user,
            pseudo: m.user.pseudo || m.user.name,
          },
        })),
      };
    }
  }

  // Map Organization to the expected "squad" format for SquadJourney
  // This ensures backward compatibility with the UI while using the new system
  const squad = org ? {
    ...org,
    members: org.members.map((m: any) => ({
      ...m,
      user: {
        ...m.user,
        pseudo: m.user.name, // Fallback if pseudo is missing in BA user
      },
    })),
  } : dbSquad;

  // Load received invitations in case they don't have a squad
  // (already fetched in parallel)

  return (
    <SquadPageClient 
      user={dbUser ?? session.user} 
      squad={squad} 
      incomingInvitations={incomingInvitations.map((inv: any) => ({
        id: inv.id,
        organizationId: inv.organizationId,
        organizationName: inv.organization.name,
        organizationDescription: inv.organization.description,
        inviterName: inv.user.name,
        role: inv.role,
        status: inv.status
      }))}
    />
  );
}
