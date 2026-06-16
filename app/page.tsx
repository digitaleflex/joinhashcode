import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Nav } from "@/components/landing/nav"
import { HeroSection } from "@/components/landing/hero-section"

export const revalidate = 3600 // Re-calculer les stats toutes les heures

const Vision = dynamic(() => import("@/components/landing/vision").then(m => ({ default: m.Vision })), {
  loading: () => <div className="h-96 w-full" />,
})
const HowItWorks = dynamic(() => import("@/components/landing/how-it-works").then(m => ({ default: m.HowItWorks })), {
  loading: () => <div className="h-96 w-full" />,
})
const MissionsPreview = dynamic(() => import("@/components/landing/missions-preview").then(m => ({ default: m.MissionsPreview })), {
  loading: () => <div className="h-96 w-full" />,
})
const SquadDiscoverySection = dynamic(() => import("@/components/landing/squad-discovery-section").then(m => ({ default: m.SquadDiscoverySection })), {
  loading: () => <div className="h-96 w-full" />,
})
const Faq = dynamic(() => import("@/components/landing/faq").then(m => ({ default: m.Faq })), {
  loading: () => <div className="h-96 w-full" />,
})
const FinalCta = dynamic(() => import("@/components/landing/final-cta").then(m => ({ default: m.FinalCta })))
const Footer = dynamic(() => import("@/components/landing/footer").then(m => ({ default: m.Footer })))

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
        <MissionsPreview />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <SquadDiscoverySection />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <Vision />
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
