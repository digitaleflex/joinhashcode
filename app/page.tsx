import { Suspense } from "react"
import { Nav } from "@/components/landing/nav"
import { HeroSection } from "@/components/landing/hero-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { MissionsPreview } from "@/components/landing/missions-preview"
import { SquadDiscoverySection } from "@/components/landing/squad-discovery-section"
import { Vision } from "@/components/landing/vision"
import { Faq } from "@/components/landing/faq"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export const revalidate = 3600 // Re-calculer les stats toutes les heures

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Suspense fallback={<div className="min-h-screen w-full" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <HowItWorks />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <Vision />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <MissionsPreview />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <SquadDiscoverySection />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <Faq />
      </Suspense>
      <Suspense fallback={<div className="h-48 w-full" />}>
        <FinalCta />
      </Suspense>
      <Suspense fallback={<div className="h-32 w-full" />}>
        <Footer />
      </Suspense>
    </main>
  )
}
