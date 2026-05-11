import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { ActivityFeed } from "@/components/landing/activity-feed"
import { Vision } from "@/components/landing/vision"
import { MissionsPreview } from "@/components/landing/missions-preview"
import { BrandIdentity } from "@/components/landing/brand-identity"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Ecosystem } from "@/components/landing/ecosystem"
import { Testimonials } from "@/components/landing/testimonials"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <ActivityFeed />
      <Vision />
      <MissionsPreview />
      <BrandIdentity />
      <HowItWorks />
      <Ecosystem />
      <Testimonials />
      <FinalCta />
      <Footer />
    </main>
  )
}
