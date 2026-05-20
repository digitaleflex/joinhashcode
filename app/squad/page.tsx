import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SquadJourney } from "@/components/dashboard/squad-journey";

export default async function SquadPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const [dbUser, guildMember] = await Promise.all([
    prisma.user.findUnique({
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
    }),
    prisma.guildMember.findFirst({
      where: { userId: session.user.id },
      include: {
        guild: {
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
                    experience: true,
                    level: true,
                  },
                },
              },
            },
          },
        },
      },
    }),
  ]);

  return (
    <SquadJourney
      user={dbUser || (session.user as any)}
      squad={guildMember?.guild || null}
    />
  );
}
