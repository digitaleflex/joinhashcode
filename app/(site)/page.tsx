import { HomeHero } from "@/components/site/home/home-hero"
import { HomeWhatWeDo } from "@/components/site/home/home-what-we-do"
import { HomePrograms } from "@/components/site/home/home-programs"
import { HomeLabs } from "@/components/site/home/home-labs"
import { HomeProof } from "@/components/site/home/home-proof"
import { HomeCommunity } from "@/components/site/home/home-community"
import { HomeFinalCta } from "@/components/site/home/home-final-cta"

export const revalidate = 3600

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HomeHero />
      <HomeWhatWeDo />
      <HomePrograms />
      <HomeLabs />
      <HomeProof />
      <HomeCommunity />
      {/* Section 7 — Opportunities: intentionally masked, no real data (T0). */}
      <HomeFinalCta />
    </main>
  )
}
