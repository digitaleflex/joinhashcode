import dynamic from "next/dynamic"
import { getSessionSafe } from "@/lib/get-session-safe"
import { getCachedUser } from "@/lib/user-cache"
import { redirect } from "next/navigation"

const SettingsView = dynamic(() => import("./settings-view").then((mod) => mod.SettingsView), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-pulse space-y-6 w-full max-w-2xl px-4">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="h-64 bg-muted rounded" />
        <div className="h-32 bg-muted rounded" />
      </div>
    </div>
  ),
})

export default async function SettingsPage() {
  const session = await getSessionSafe()
  if (!session) redirect("/signin")

  const user = await getCachedUser(session.user.id)
  if (!user) redirect("/signin")

  const initialData = {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    level: user.progress?.level ?? 1,
    experience: user.progress?.experience ?? 0,
    class: user.class,
    role: user.role,
    pseudo: user.pseudo,
    bio: user.profile?.bio,
    country: user.country,
    city: user.city,
    language: user.language,
    githubUrl: user.socials?.githubUrl ?? null,
    linkedinUrl: user.socials?.linkedinUrl ?? null,
    twitterUrl: user.socials?.twitterUrl ?? null,
    portfolioUrl: user.socials?.portfolioUrl ?? null,
    currentSituation: user.currentSituation,
    dreamStatement: user.profile?.dreamStatement,
    mainObjective: user.mainObjective,
    currentFocus: user.profile?.currentFocus ?? [],
    mainBlocker: user.profile?.mainBlocker,
    builderScore: user.builderScore ?? 0,
    creatorScore: user.creatorScore ?? 0,
    strategistScore: user.strategistScore ?? 0,
    catalystScore: user.catalystScore ?? 0,
    tools: user.tools,
    domains: user.domains,
    badges: user.badges,
    missionsCompletedCount: user.progress?.missionsCompletedCount ?? 0,
    currentStreak: user.stats?.currentStreak ?? 0,
    longestStreak: user.stats?.longestStreak ?? 0,
    lastCheckinAt: user.stats?.lastCheckinAt ?? null,
    behavioralVibrancy: user.behavioralVibrancy,
    confidenceScore: user.confidenceScore ?? 0.25,
    betaKeyId: user.beta?.betaKeyId ?? null,
    memberNumber: user.memberNumber,
    cardSignature: user.cardSignature,
    cardIssuedAt: user.cardIssuedAt,
    cardTier: user.cardTier,
    twoFactorEnabled: user.security?.twoFactorEnabled ?? false,
  }

  return <SettingsView initialData={initialData} />
}
