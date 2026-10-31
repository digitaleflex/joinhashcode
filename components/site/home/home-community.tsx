import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

export function HomeCommunity() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card">
        <div className="grid lg:grid-cols-2">
          <div className="p-8 sm:p-12">
            <SectionHeading
              kicker="Community"
              title="Grow together. Share knowledge. Build together."
              description="Technology grows through collaboration. HASHCODE brings together curious minds, developers, creators and technology enthusiasts who learn, experiment and share knowledge."
            />
            <Link href="/community" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-background px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/50">
              Discover our community <ArrowRight className="h-4 w-4 text-primary" aria-hidden />
            </Link>
          </div>
          <ul className="grid content-center gap-px bg-border sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {[
              ["Learn together", "Sessions and events published to members."],
              ["Review each other", "Peer feedback on labs and submissions."],
              ["Build in public", "Opt-in profiles that show proven work."],
              ["Welcome newcomers", "Every expert started with a first step."],
            ].map(([t, d]) => (
              <li key={t} className="bg-card p-6 sm:p-8">
                <p className="font-syne text-base font-bold text-foreground">{t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{d}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
