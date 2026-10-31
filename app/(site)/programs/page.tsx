import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FlaskConical, GraduationCap } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore technology fields with HASHCODE — from active learning paths to developing areas and future explorations.",
}

const ACTIVE = [
  {
    title: "Cloud & DevOps",
    text: "Understand how modern software runs in production — from a first Linux server to automated delivery pipelines.",
    topics: ["Linux and cloud fundamentals", "CI/CD and automation concepts", "Infrastructure and engineering foundations"],
    links: [
      { label: "Practice in Labs", href: "/labs", icon: FlaskConical },
      { label: "Study in Academy", href: "/academy", icon: GraduationCap },
    ],
  },
  {
    title: "AI & Data",
    text: "From reading data to questioning models — build an intuition for data analysis and artificial intelligence.",
    topics: ["Data analysis foundations", "Introduction to machine learning", "Artificial intelligence exploration"],
    links: [
      { label: "Practice in Labs", href: "/labs", icon: FlaskConical },
      { label: "Study in Academy", href: "/academy", icon: GraduationCap },
    ],
  },
  {
    title: "Product & Strategy",
    text: "Learn to think in problems before solutions — product thinking, structured problem-solving and teamwork.",
    topics: ["Product thinking", "Problem-solving", "Design thinking", "Project fundamentals"],
    links: [{ label: "Practice in Labs", href: "/labs", icon: FlaskConical }],
  },
  {
    title: "Engineering Foundations",
    text: "The durable core of software engineering — algorithms, data and systems that outlive every framework.",
    topics: ["Algorithms", "Database fundamentals", "Software engineering foundations"],
    links: [{ label: "Study in Academy", href: "/academy", icon: GraduationCap }],
  },
]

const DEVELOPING = [
  { title: "Web & Fullstack", text: "Building for the web, from first responsive page to full applications." },
  { title: "Mobile Development", text: "Mobile-first thinking and native-quality experiences." },
  { title: "UX/UI & Graphic Design", text: "Interfaces and identities people understand and remember." },
  { title: "Content & Creative Strategy", text: "Ideas, angles and narratives that carry a project." },
  { title: "Community & Partnerships", text: "Gathering people, growing networks, building together." },
  { title: "Software Architecture", text: "Structures that let systems — and teams — scale." },
]

const COMING_SOON = ["Cybersecurity", "Automation", "Web3"]

export default function ProgramsPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24 lg:px-8">
        <SectionHeading
          kicker="Programs"
          title="Explore your next field of expertise."
          description="Discover different areas of technology, explore learning resources and identify the paths that match your interests."
        />
      </section>

      {/* Active */}
      <section className="mx-auto max-w-6xl px-4 pb-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-8 bg-primary" aria-hidden />
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Active paths</h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          {ACTIVE.map((d, i) => (
            <article
              key={d.title}
              className={`rounded-3xl border border-border bg-card p-8 ${i === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-8" : ""}`}
            >
              <div>
                <p className="font-mono text-xs font-bold text-primary">0{i + 1}</p>
                <h3 className="mt-2 font-syne text-2xl font-bold text-foreground sm:text-3xl">{d.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{d.text}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {d.links.map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                    >
                      <l.icon className="h-4 w-4 text-primary" aria-hidden />
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
              <ul className="mt-6 space-y-2.5 lg:mt-0 lg:self-center">
                {d.topics.map((t) => (
                  <li key={t} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
                    {t}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      {/* Developing */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-8 bg-primary" aria-hidden />
          <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-primary">Developing areas</h2>
        </div>
        <p className="mb-8 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          These areas are growing inside the ecosystem. They are not presented as
          complete paths — what exists today is real practice material, and more is on the way.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEVELOPING.map((d) => (
            <article key={d.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-syne text-lg font-bold text-foreground">{d.title}</h3>
                <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-primary">
                  Developing
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.text}</p>
              <Link href="/labs" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
                See related labs <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Coming soon */}
      <section className="border-t border-border bg-card">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center gap-3">
            <span className="h-px w-8 bg-muted-foreground/40" aria-hidden />
            <h2 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">Coming soon</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            {COMING_SOON.map((d) => (
              <span key={d} className="rounded-full border border-dashed border-border px-5 py-2.5 font-syne text-base font-bold text-muted-foreground">
                {d}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            These fields are on the roadmap. They are displayed as explorations to come —
            never as operational programs.{" "}
            <Link href="/signin" className="font-semibold text-primary hover:underline">
              Join the community
            </Link>{" "}
            to help shape them.
          </p>
        </div>
      </section>
    </main>
  )
}
