import Link from "next/link"
import { ArrowRight, Award, FileCheck2, UserCheck } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

const FORMS = [
  {
    icon: FileCheck2,
    title: "Approved submissions",
    text: "Work reviewed and approved — a submission that passed assessment, clearly distinguished from a finished exercise.",
  },
  {
    icon: UserCheck,
    title: "Public member profiles",
    text: "Members who opt in make their validated work visible — declared skills kept separate from proven ones.",
  },
  {
    icon: Award,
    title: "Published certificates",
    text: "Academy certifications officially issued — never self-declared, always verifiable.",
  },
]

export function HomeProof() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          align="center"
          kicker="Proof of skills"
          title="Don't just say what you know. Show what you can do."
          description="Skills become meaningful when they are demonstrated. HASHCODE encourages members to build a visible record of their work through practical challenges, reviewed submissions and documented achievements."
        />
        <div className="mx-auto mt-10 grid max-w-4xl gap-4 md:grid-cols-3">
          {FORMS.map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-background p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <h3 className="mt-4 font-syne text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/talents" className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
            Discover our talent community <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
