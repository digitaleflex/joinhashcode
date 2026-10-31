import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"
import { ACTIVE_PROGRAMS, DEVELOPING_PROGRAMS, COMING_SOON_PROGRAMS } from "@/lib/site-programs"

export function HomePrograms() {
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading
          kicker="Programs"
          title="Explore your field. Build your expertise."
          description="Technology offers many paths. HASHCODE helps you explore them, develop your foundations and discover where your abilities can take you."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {ACTIVE_PROGRAMS.map((d, i) => (
            <article
              key={d.title}
              className={`rounded-2xl border border-border bg-background p-7 ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-syne text-2xl font-bold text-foreground">{d.title}</h3>
                <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-[11px] font-bold uppercase text-primary">
                  Active
                </span>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{d.text}</p>
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{d.topics[0]}</span>
                {d.topics.length > 1 && <span> · {d.topics.slice(1).join(" · ")}</span>}
              </p>
            </article>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {DEVELOPING_PROGRAMS.map((d) => (
            <span key={d} className="rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium text-muted-foreground">
              {d}
            </span>
          ))}
          {COMING_SOON_PROGRAMS.map((d) => (
            <span key={d} className="rounded-full border border-dashed border-border px-4 py-1.5 text-sm font-medium text-muted-foreground/70">
              {d} · soon
            </span>
          ))}
        </div>
        <Link href="/programs" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-transform hover:scale-[1.02]">
          Explore all programs <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
