import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"

const MissionsPreview = dynamic(() => import("@/components/landing/missions-preview").then(m => ({ default: m.MissionsPreview })), {
  loading: () => <div className="h-96 w-full" />,
})
const SquadDiscoverySection = dynamic(() => import("@/components/landing/squad-discovery-section").then(m => ({ default: m.SquadDiscoverySection })), {
  loading: () => <div className="h-96 w-full" />,
})
const FinalCta = dynamic(() => import("@/components/landing/final-cta").then(m => ({ default: m.FinalCta })))
const Footer = dynamic(() => import("@/components/landing/footer").then(m => ({ default: m.Footer })))

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Suspense fallback={<div className="h-96 w-full" />}>
        <MissionsPreview />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <SquadDiscoverySection />
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
