import { Suspense } from "react"
import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { ActivityFeed } from "@/components/landing/activity-feed"
import { MissionsPreview } from "@/components/landing/missions-preview"
import { Testimonials } from "@/components/landing/testimonials"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Suspense fallback={<div className="h-12 w-full" />}>
        <ActivityFeed />
      </Suspense>
      <MissionsPreview />
      <Suspense fallback={<div className="h-48 w-full" />}>
        <Testimonials />
      </Suspense>
      <FinalCta />
      <Footer />
    </main>
  )
}
