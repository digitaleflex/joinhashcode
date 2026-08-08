import { getLandingStats } from "@/lib/actions/landing-stats"
import { Hero } from "./hero"
import { ActivityFeed } from "./activity-feed"

export async function HeroSection() {
  const stats = await getLandingStats()
  const serializedActivities = stats.recentActivities.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString()
  }))

  return (
    <>
      <Hero
        totalMembers={stats.totalMembers}
        classCounts={stats.classCounts}
      />
      <ActivityFeed initialActivities={serializedActivities} />
    </>
  )
}
