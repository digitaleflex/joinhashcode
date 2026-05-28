import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { InviteClient } from "./invite-client";

export default async function InvitePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  // Fetch squad details
  const squad = await prisma.organization.findUnique({
    where: { slug },
    include: {
      members: {
        include: {
          user: {
            select: {
              name: true,
              pseudo: true,
              image: true,
            }
          }
        }
      }
    }
  });

  if (!squad) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Escouade Introuvable</h1>
        <p className="text-zinc-500 mt-2">Le lien d&apos;invitation est peut-être expiré ou erroné.</p>
      </div>
    );
  }

  const leader = squad.members.find(m => m.role === "owner" || m.role === "LEADER")?.user || squad.members[0].user;

  return (
    <InviteClient 
        squad={squad} 
        leader={leader} 
        isLoggedIn={!!session} 
        userId={session?.user?.id}
    />
  );
}
