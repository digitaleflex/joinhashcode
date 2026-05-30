import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DossierView } from "@/components/dossier/dossier-view";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";

interface PageProps {
  params: Promise<{ pseudo: string }>
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { pseudo } = await params;

  const user = await prisma.user.findUnique({
    where: { pseudo },
    include: {
      quizResults: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      missionSubmissions: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          mission: true
        }
      },
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 20
      },
      members: {
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
  });

  if (!user || user.banned) {
    notFound();
  }

  const activeOrg = user.members[0]?.organization ?? null;
  const quizResult = user.quizResults?.[0];

  // Fetch squad activity logs for the public view (limited)
  let squadMembersLogs: any[] = [];
  if (activeOrg) {
    const squadMemberIds = (activeOrg as any).members.map((m: any) => m.userId);
    squadMembersLogs = await prisma.activityLog.findMany({
      where: {
        userId: { in: squadMemberIds },
        action: {
          in: ["MISSION_APPROVED", "SQUAD_CREATED", "LEVEL_UP"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            pseudo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Effects matching the landing/dashboard */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <div className="scanline opacity-20" />
      
      <Nav />
      
      <main className="flex-1 p-4 md:p-10 pt-24 md:pt-32 relative z-10">
        <DossierView 
          user={user}
          activeOrg={activeOrg}
          quizResult={quizResult}
          squadMembersLogs={squadMembersLogs}
          isPublic={true}
        />
      </main>

      <Footer />
    </div>
  );
}
