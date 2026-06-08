import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SquadJourney } from "@/components/dashboard/squad-journey";

export default async function SquadPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  // Fetch full organization using Better Auth API
  const org = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  // Fallback to database lookup if BA active organization cookie is missing
  let dbSquad = null;
  if (!org) {
    const member = await prisma.member.findFirst({
      where: { userId: session.user.id },
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
                    level: true,
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

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      pseudo: true,
      class: true,
      level: true,
      experience: true,
      badges: true,
      role: true,
    },
  });

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

  return (
    <div id="tour-squad-journey" className="h-full w-full">
      <SquadJourney
        user={dbUser || (session.user as any)}
        squad={squad}
      />
    </div>
  );
}
