import type { Metadata } from "next"
import { HomeHero } from "@/components/site/home/home-hero"
import { HomeWhatWeDo } from "@/components/site/home/home-what-we-do"
import { HomePrograms } from "@/components/site/home/home-programs"
import { HomeLabs } from "@/components/site/home/home-labs"
import { HomeProof } from "@/components/site/home/home-proof"
import { HomeCommunity } from "@/components/site/home/home-community"
import { HomeFaq } from "@/components/site/home/home-faq"
import { HomeFinalCta } from "@/components/site/home/home-final-cta"

export const metadata: Metadata = {
  title: "Apprendre. Construire. Évoluer.",
  description: "Rejoins HashCode : un écosystème communautaire pour apprendre, pratiquer et démontrer tes compétences en développement web, cybersécurité et IA appliquée.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HashCode — Apprendre. Construire. Évoluer.",
    description: "Développe tes compétences numériques, construis des projets et rends tes réalisations visibles.",
    url: "/",
    type: "website",
  },
}

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
      <HomeFaq />
      <HomeFinalCta />
    </main>
  )
}
