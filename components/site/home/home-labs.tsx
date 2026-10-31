import Link from "next/link"
import { ArrowRight, CalendarClock, FlaskConical, ListChecks } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

const FORMATS = [
  {
    icon: ListChecks,
    title: "Guided missions",
    text: "Step-by-step challenges with submissions and reviews — from first discovery to complete projects.",
  },
  {
    icon: CalendarClock,
    title: "Weekly activities",
    text: "Short, recurring exercises to stay sharp: an API in a week, a screen design, a tool to explore.",
  },
  {
    icon: FlaskConical,
    title: "Project-based learning",
    text: "Turn ideas into tangible results — problem framing, building, documenting and presenting.",
  },
]

export function HomeLabs() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-5 lg:items-start">
        <div className="lg:col-span-2 lg:sticky lg:top-24">
          <SectionHeading
            kicker="Labs"
            title="Knowledge becomes valuable when you put it into practice."
            description="At HASHCODE, learning does not stop at understanding concepts. Members are encouraged to experiment, solve problems, complete challenges and turn ideas into tangible results."
          />
          <Link href="/labs" className="mt-6 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/50">
            Explore our Labs <ArrowRight className="h-4 w-4 text-primary" aria-hidden />
          </Link>
        </div>
        <div className="space-y-4 lg:col-span-3">
          {FORMATS.map((f) => (
            <div key={f.title} className="flex gap-5 rounded-2xl border border-border bg-card p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" aria-hidden />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </div>
          ))}
          <p className="px-1 text-xs leading-relaxed text-muted-foreground">
            Lab contents, availability and access conditions are published on the Labs page —
            only what genuinely exists is listed there.
          </p>
        </div>
      </div>
    </section>
  )
}
