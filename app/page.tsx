import { Suspense } from "react"
import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { ActivityFeed } from "@/components/landing/activity-feed"
import { Vision } from "@/components/landing/vision"
import { MissionsPreview } from "@/components/landing/missions-preview"
import { BrandIdentity } from "@/components/landing/brand-identity"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Ecosystem } from "@/components/landing/ecosystem"
import { Testimonials } from "@/components/landing/testimonials"
import { Faq } from "@/components/landing/faq"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

function LoadingSection() {
  return <div className="h-48 w-full bg-black/5 animate-pulse" />
}

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Suspense fallback={<LoadingSection />}>
        <ActivityFeed />
      </Suspense>
      <Vision />
      <Suspense fallback={<LoadingSection />}>
        <MissionsPreview />
      </Suspense>
      <BrandIdentity />
      <HowItWorks />
      <Ecosystem />
      <Suspense fallback={<LoadingSection />}>
        <Testimonials />
      </Suspense>
      <Faq />
      <FinalCta />
      <Footer />
    </main>
  )
}
