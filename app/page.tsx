import { Nav } from "@/components/landing/nav"
import { Hero } from "@/components/landing/hero"
import { Vision } from "@/components/landing/vision"
import { BrandIdentity } from "@/components/landing/brand-identity"
import { HowItWorks } from "@/components/landing/how-it-works"
import { WhyJoin } from "@/components/landing/why-join"
import { FinalCta } from "@/components/landing/final-cta"
import { Footer } from "@/components/landing/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Nav />
      <Hero />
      <Vision />
      <BrandIdentity />
      <HowItWorks />
      <WhyJoin />
      <FinalCta />
      <Footer />
    </main>
  )
}
