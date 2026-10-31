import { Suspense } from "react"
import { HeroSection } from "@/components/landing/hero-section"
import { MissionsPreview } from "@/components/landing/missions-preview"
import { Testimonials } from "@/components/landing/testimonials"
import { Faq } from "@/components/landing/faq"
import { FinalCta } from "@/components/landing/final-cta"

export const revalidate = 3600

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Suspense fallback={<div className="min-h-screen w-full" />}>
        <HeroSection />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <MissionsPreview />
      </Suspense>
      <Suspense fallback={<div className="h-96 w-full" />}>
        <Faq />
      </Suspense>
      <Suspense fallback={<div className="h-48 w-full" />}>
        <Testimonials />
      </Suspense>
      <Suspense fallback={<div className="h-48 w-full" />}>
        <FinalCta />
      </Suspense>
    </main>
  )
}
