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
    level: user.level ?? 1,
    experience: user.experience ?? 0,
    class: user.class,
    role: user.role,
    pseudo: user.pseudo,
    bio: user.profile?.bio,
    country: user.country,
    city: user.city,
    language: user.language,
    githubUrl: user.githubUrl ?? null,
    linkedinUrl: user.linkedinUrl ?? null,
    twitterUrl: user.twitterUrl ?? null,
    portfolioUrl: user.portfolioUrl ?? null,
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
    missionsCompletedCount: user.missionsCompletedCount ?? 0,
    currentStreak: user.currentStreak ?? 0,
    longestStreak: user.longestStreak ?? 0,
    lastCheckinAt: user.lastCheckinAt ?? null,
    behavioralVibrancy: user.behavioralVibrancy,
    betaKeyId: user.beta?.betaKeyId ?? null,
    memberNumber: user.memberNumber,
    cardSignature: user.cardSignature,
    cardIssuedAt: user.cardIssuedAt,
    cardTier: user.cardTier,
    twoFactorEnabled: user.twoFactorEnabled ?? false,
  }

  return <SettingsView initialData={initialData} />
}
