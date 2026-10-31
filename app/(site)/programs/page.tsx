import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, FlaskConical, GraduationCap } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { ACTIVE_PROGRAMS, DEVELOPING_PROGRAMS, COMING_SOON_PROGRAMS } from "@/lib/site-programs"

export const metadata: Metadata = {
  title: "Programs",
  description: "Explore technology fields with HASHCODE — from active learning paths to developing areas and future explorations.",
}

const ACTIVE_LINKS: Record<string, { label: string; href: string }[]> = {
  "Cloud & DevOps": [
    { label: "Practice in Labs", href: "/labs" },
    { label: "Study in Academy", href: "/academy" },
  ],
  "AI & Data": [
    { label: "Practice in Labs", href: "/labs" },
    { label: "Study in Academy", href: "/academy" },
  ],
  "Product & Strategy": [{ label: "Practice in Labs", href: "/labs" }],
  "Engineering Foundations": [{ label: "Study in Academy", href: "/academy" }],
}

const DEVELOPING_TEXT: Record<string, string> = {
  "Web & Fullstack": "Building for the web, from first responsive page to full applications.",
  "Mobile Development": "Mobile-first thinking and native-quality experiences.",
  "UX/UI & Graphic Design": "Interfaces and identities people understand and remember.",
  "Content & Creative Strategy": "Ideas, angles and narratives that carry a project.",
  "Community & Partnerships": "Gathering people, growing networks, building together.",
  "Software Architecture": "Structures that let systems — and teams — scale.",
}

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
          {ACTIVE_PROGRAMS.map((d, i) => (
            <article
              key={d.title}
              className={`rounded-3xl border border-border bg-card p-8 ${i === 0 ? "lg:col-span-2 lg:grid lg:grid-cols-2 lg:gap-8" : ""}`}
            >
              <div>
                <p className="font-mono text-xs font-bold text-primary">0{i + 1}</p>
                <h3 className="mt-2 font-syne text-2xl font-bold text-foreground sm:text-3xl">{d.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{d.text}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {(ACTIVE_LINKS[d.title] ?? []).map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/50"
                    >
                      {l.href === "/labs" ? (
                        <FlaskConical className="h-4 w-4 text-primary" aria-hidden />
                      ) : (
                        <GraduationCap className="h-4 w-4 text-primary" aria-hidden />
                      )}
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
          {DEVELOPING_PROGRAMS.map((title) => (
            <article key={title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-syne text-lg font-bold text-foreground">{title}</h3>
                <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-primary">
                  Developing
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{DEVELOPING_TEXT[title]}</p>
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
            {COMING_SOON_PROGRAMS.map((d) => (
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
