import type { Metadata } from "next"
import Link from "next/link"
import { Compass, FlaskConical, BadgeCheck, Users, TrendingUp, ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

export const metadata: Metadata = {
  title: "About HASHCODE",
  description: "HASHCODE is a technology ecosystem built around learning, experimentation, collaboration and demonstrated expertise.",
}

const PRINCIPLES = [
  { title: "Curiosity", text: "Every meaningful journey starts with a question." },
  { title: "Practice", text: "Understanding something is different from being able to do it." },
  { title: "Evidence", text: "What you build matters more than what you claim." },
  { title: "Collaboration", text: "Knowledge grows when it is shared." },
  { title: "Progress", text: "Expertise develops through continuous learning and experimentation." },
]

const APPROACH = [
  { step: "Discover", text: "Explore technologies and identify where your curiosity leads." },
  { step: "Learn", text: "Build strong foundations through structured learning paths." },
  { step: "Practice", text: "Turn knowledge into ability with labs, challenges and projects." },
  { step: "Demonstrate", text: "Prove what you can do through reviewed work and documented achievements." },
  { step: "Grow", text: "Connect with the community and open new possibilities." },
]

const ECOSYSTEM = [
  { icon: Compass, title: "Learning", text: "Structured paths and Academy courses to build foundations.", href: "/academy", available: true },
  { icon: FlaskConical, title: "Labs", text: "Guided missions, challenges and weekly activities to practice.", href: "/labs", available: true },
  { icon: Users, title: "Community", text: "People who learn, experiment and share knowledge together.", href: "/community", available: true },
  { icon: BadgeCheck, title: "Talent development", text: "Public profiles that make proven work visible.", href: "/talents", available: true },
  { icon: TrendingUp, title: "Opportunities", text: "A growing vision: connecting demonstrated expertise with real possibilities.", href: null, available: false },
]

export default function AboutPage() {
  return (
    <main className="bg-background">
      {/* Intro */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">About HASHCODE</p>
        <h1 className="mt-4 max-w-3xl font-syne text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Technology moves forward. So do we.
        </h1>
        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          <p className="text-lg leading-relaxed text-muted-foreground">
            HASHCODE is a technology ecosystem built around learning, experimentation,
            collaboration and demonstrated expertise.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            We believe that developing skills requires more than consuming information.
            It requires curiosity, consistency, practice and the ability to turn
            knowledge into meaningful work.
          </p>
        </div>
      </section>

      {/* Mission / Vision */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading kicker="Why we exist" title="Our mission" />
            <p className="mt-4 leading-relaxed text-muted-foreground">
              To make technology learning more practical, accessible and meaningful by
              helping individuals develop their abilities, demonstrate their expertise
              and connect with new possibilities.
            </p>
          </div>
          <div>
            <SectionHeading kicker="Where we are going" title="Our vision" />
            <p className="mt-4 leading-relaxed text-muted-foreground">
              A world where people can continuously develop their technological
              abilities, demonstrate what they can do and access opportunities based
              on their actual skills and contributions.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          kicker="How we think"
          title="Our philosophy"
          description="Five principles guide everything we build."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => (
            <div key={p.title} className={`rounded-2xl border border-border bg-card p-6 ${i === 4 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
              <p className="font-mono text-xs font-bold text-primary">0{i + 1}</p>
              <h3 className="mt-2 font-syne text-xl font-bold text-foreground">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            </div>
          ))}
          <div className="flex flex-col justify-center rounded-2xl bg-primary p-6">
            <p className="font-syne text-xl font-bold text-primary-foreground">Skills over claims. Evidence over promises.</p>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/90">
              The standard we hold for ourselves before asking it of anyone else.
            </p>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="border-y border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeading
            kicker="How it works"
            title="Our approach"
            description="A continuous cycle that turns curiosity into demonstrated expertise."
          />
          <ol className="mt-10 grid gap-0 lg:grid-cols-5">
            {APPROACH.map((a, i) => (
              <li key={a.step} className="relative border-t-2 border-primary/30 pt-5 pr-6 pb-8 lg:pb-0">
                <span className="absolute -top-[9px] left-0 h-4 w-4 rounded-full border-2 border-primary bg-background" aria-hidden />
                <p className="font-mono text-xs font-bold uppercase tracking-wider text-primary">Step {i + 1}</p>
                <h3 className="mt-1 font-syne text-lg font-bold text-foreground">{a.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{a.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          kicker="One ecosystem"
          title="Our ecosystem"
          description="Different dimensions of the same experience. Only what genuinely exists is presented as operational."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ECOSYSTEM.map((e) => (
            <div key={e.title} className="rounded-2xl border border-border bg-card p-6">
              <e.icon className="h-6 w-6 text-primary" aria-hidden />
              <div className="mt-3 flex items-center gap-2">
                <h3 className="font-syne text-lg font-bold text-foreground">{e.title}</h3>
                {!e.available && (
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-muted-foreground">
                    Growing
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{e.text}</p>
              {e.href && e.available && (
                <Link href={e.href} className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                  Explore <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              )}
            </div>
          ))}
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-border p-6">
            <h3 className="font-syne text-lg font-bold text-foreground">Join the ecosystem</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Start with a diagnostic, follow a path, prove your skills.
            </p>
            <Link href="/signin" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
              Get started <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
