import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DossierView } from "@/components/dossier/dossier-view";
import { Nav } from "@/components/landing/nav";
import { Footer } from "@/components/landing/footer";
import { Metadata } from "next";
import { APP_URL } from "@/lib/config";
import { UserProfile, DetailedMissionSubmission } from "@/lib/types";
import { getPublicEvidence } from "@/lib/evidence";

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
      id: true, name: true, pseudo: true, image: true,
      bio: true,
      role: true, language: true,
      city: true, country: true,
      class: true,
      talentVisible: true,
      technicalLevel: true,
      mainObjective: true, domains: true, tools: true, badges: true,
      memberNumber: true, createdAt: true,
      githubUrl: true,
      linkedinUrl: true,
      twitterUrl: true,
      portfolioUrl: true,
      level: true,
      experience: true,
      missionsCompletedCount: true,
      banned: true,
    },
  });

  if (!dbUser || dbUser.banned) {
    notFound();
  }

  const isPrivate = !dbUser.talentVisible;

  // Récupérer les preuves publiques (soumissions APPROVED) — #455/#456
  const evidence = await getPublicEvidence(dbUser.id);

  // Mapper les preuves vers le format DetailedMissionSubmission attendu par DossierView
  const missionSubmissions: DetailedMissionSubmission[] = evidence.map((e) => ({
    id: e.id,
    missionId: e.missionId,
    userId: dbUser.id,
    status: "APPROVED" as const,
    content: "",
    createdAt: e.validatedAt,
    updatedAt: e.validatedAt,
    qualityLevel: e.qualityLevel,
    mission: {
      title: e.mission.title,
      category: e.mission.category,
      slug: e.mission.slug,
      missionLevel: e.mission.missionLevel ?? null,
    },
  }));

  // Aplatir l'objet user pour la compatibilité avec DossierView
  const user: UserProfile & { missionSubmissions: DetailedMissionSubmission[], activityLogs: Array<{ id: string; action: string; createdAt: Date }> } = {
    id: dbUser.id,
    name: dbUser.name,
    pseudo: dbUser.pseudo,
    image: dbUser.image,
    bio: dbUser.bio,
    role: dbUser.role,
    language: dbUser.language,
    city: dbUser.city,
    country: dbUser.country,
    class: dbUser.class,
    technicalLevel: dbUser.technicalLevel,
    mainObjective: dbUser.mainObjective,
    domains: dbUser.domains ?? [],
    tools: dbUser.tools ?? [],
    badges: dbUser.badges ?? [],
    memberNumber: dbUser.memberNumber,
    createdAt: dbUser.createdAt,
    level: dbUser.level ?? 1,
    experience: dbUser.experience ?? 0,
    missionsCompletedCount: dbUser.missionsCompletedCount ?? 0,
    githubUrl: dbUser.githubUrl ?? null,
    linkedinUrl: dbUser.linkedinUrl ?? null,
    twitterUrl: dbUser.twitterUrl ?? null,
    portfolioUrl: dbUser.portfolioUrl ?? null,
    // Sécurité : champs sensibles jamais exposés publiquement
    email: "",
    builderScore: 0,
    creatorScore: 0,
    strategistScore: 0,
    catalystScore: 0,
    behavioralVibrancy: null,
    currentStreak: 0,
    lastCheckin: null,
    referralCount: 0,
    j7Activated: false,
    missionSubmissions,
    activityLogs: [],
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* Background Effects matching the landing/dashboard */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <div className="scanline opacity-20" />
      
      <Nav />
      
      <main className="flex-1 p-4 md:p-10 pt-24 md:pt-32 relative z-[var(--z-content)]">
        <DossierView 
          user={user}
          quizResult={null}
          isPublic={true}
          isPrivate={isPrivate}
        />
      </main>

      <Footer />
    </div>
  );
}

