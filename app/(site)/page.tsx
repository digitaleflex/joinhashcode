import type { Metadata } from "next"
import { HomeHero } from "@/components/site/home/home-hero"
import { HomeProof } from "@/components/site/home/home-proof"
import { HomeFaq } from "@/components/site/home/home-faq"
import { HomeFinalCta } from "@/components/site/home/home-final-cta"

export const metadata: Metadata = {
  title: "Prouve que tu peux devenir analyste SOC junior",
  description: "Fais des labs de cybersécurité, fais relire ton travail et construis un profil public où chaque preuve est vérifiée.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "HashCode — Prouve que tu peux devenir analyste SOC junior",
    description: "Labs de cybersécurité relus par des pairs, et un profil public où chaque preuve est vérifiée.",
    url: "/",
    type: "website",
  },
}

export const revalidate = 3600

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <HomeHero />
      <HomeProof />
      <HomeFaq />
      <HomeFinalCta />
    </main>
  )
}
