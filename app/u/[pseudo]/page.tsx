import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DossierView } from "@/components/dossier/dossier-view";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { Metadata } from "next";
import { APP_URL } from "@/lib/config";
import { UserProfile, DetailedMissionSubmission } from "@/lib/types";

interface PageProps {
  params: Promise<{ pseudo: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pseudo } = await params;
  const user = await prisma.user.findUnique({ 
    where: { pseudo }, 
    select: { name: true, class: true } 
  });

  if (!user) return { title: 'Agent Introuvable' };

  const profile = (user.class || 'Bâtisseur').toUpperCase();
  const ogUrl = new URL('/api/og', APP_URL);
  ogUrl.searchParams.set('pseudo', pseudo);

  return {
    title: `Dossier Agent: ${user.name} | HASHCODE`,
    description: `Découvre le profil de ${user.name}, un ${profile} sur HASHCODE. Rejoins la nouvelle ère tech.`,
    openGraph: {
      images: [{ url: ogUrl.toString(), width: 1200, height: 630, alt: user.name }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [ogUrl.toString()],
    },
  };
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { pseudo } = await params;

  const dbUser = await prisma.user.findUnique({
    where: { pseudo },
    select: {
      id: true, name: true, pseudo: true, email: true, image: true, bio: true,
      role: true, language: true,
      city: true, country: true,
      class: true,
      behavioralVibrancy: true, technicalLevel: true,
      mainObjective: true, domains: true, tools: true, badges: true,
      memberNumber: true, createdAt: true,
      psychometrics: {
        select: {
          builderScore: true,
          creatorScore: true,
          strategistScore: true,
          catalystScore: true,
          confidenceScore: true,
        }
      },
      socials: {
        select: {
          githubUrl: true,
          linkedinUrl: true,
          twitterUrl: true,
          portfolioUrl: true,
        }
      },
      stats: {
        select: {
          currentStreak: true,
          lastCheckinAt: true,
        }
      },
      quizResults: {
        select: { id: true, profileType: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      missionSubmissions: {
        where: { status: "APPROVED" },
        select: { id: true, status: true, createdAt: true, mission: { select: { title: true, category: true } } },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
      activityLogs: {
        select: { id: true, action: true, createdAt: true },
        orderBy: { createdAt: 'desc' },
        take: 20,
      },
      members: {
        select: {
          organization: {
            select: {
              name: true, cohesionScore: true, streakCount: true,
              members: {
                select: {
                  role: true,
                  user: { select: { id: true, name: true, pseudo: true, image: true, class: true }, include: { progress: { select: { level: true } } } },
                },
              },
            },
          },
        },
      },
    },
    include: {
      progress: { select: { level: true, experience: true, missionsCompletedCount: true } },
      security: { select: { banned: true } },
      referral: { select: { referralCount: true } },
    },
  });

  if (!dbUser || dbUser.security?.banned) {
    notFound();
  }

  // Aplatir l'objet user pour la compatibilité avec DossierView
  const user: UserProfile & { missionSubmissions: DetailedMissionSubmission[], activityLogs: Array<{ id: string; action: string; createdAt: Date }> } = {
    ...dbUser,
    level: dbUser.progress?.level ?? 1,
    experience: dbUser.progress?.experience ?? 0,
    missionsCompletedCount: dbUser.progress?.missionsCompletedCount ?? 0,
    referralCount: dbUser.referral?.referralCount ?? 0,
    email: dbUser.email,
    githubUrl: dbUser.socials?.githubUrl ?? null,
    linkedinUrl: dbUser.socials?.linkedinUrl ?? null,
    twitterUrl: dbUser.socials?.twitterUrl ?? null,
    portfolioUrl: dbUser.socials?.portfolioUrl ?? null,
    currentStreak: dbUser.stats?.currentStreak ?? 0,
    builderScore: dbUser.psychometrics?.builderScore ?? 0,
    creatorScore: dbUser.psychometrics?.creatorScore ?? 0,
    strategistScore: dbUser.psychometrics?.strategistScore ?? 0,
    catalystScore: dbUser.psychometrics?.catalystScore ?? 0,
    confidenceScore: dbUser.psychometrics?.confidenceScore ?? 0.25,
    lastCheckin: dbUser.stats?.lastCheckinAt ?? null,
    missionSubmissions: dbUser.missionSubmissions as DetailedMissionSubmission[],
    activityLogs: dbUser.activityLogs,
  };

  const activeOrg = dbUser.members[0]?.organization ?? null;
  const quizResult = dbUser.quizResults?.[0];

  // Fetch squad activity logs for the public view (limited)
  let squadMembersLogs: Array<{ id: string; action: string; createdAt: Date; user: { name: string; image: string | null; pseudo: string | null } | null }> = [];
  if (activeOrg) {
    const squadMemberIds = activeOrg.members.map((m) => m.user.id);
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
          isPublic={true}
        />
      </main>

      <Footer />
    </div>
  );
}

