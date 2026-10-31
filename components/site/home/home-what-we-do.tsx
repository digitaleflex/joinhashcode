import Link from "next/link"
import { ArrowRight, BadgeCheck, BookOpen, FlaskConical, Users } from "lucide-react"
import { SectionHeading } from "@/components/site/section-heading"

const PILLARS = [
  {
    icon: BookOpen,
    title: "Learn",
    text: "Discover technologies, explore structured learning paths and build strong foundations.",
    href: "/programs",
  },
  {
    icon: FlaskConical,
    title: "Practice",
    text: "Move beyond theory through practical labs, challenges and real-world projects.",
    href: "/labs",
  },
  {
    icon: BadgeCheck,
    title: "Prove",
    text: "Demonstrate what you know through completed work, assessed submissions and documented achievements.",
    href: "/talents",
  },
  {
    icon: Users,
    title: "Connect",
    text: "Share knowledge, collaborate with others and discover new opportunities within a growing technology ecosystem.",
    href: "/community",
  },
]

export function HomeWhatWeDo() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        kicker="What we do"
        title="More than learning. A place to build."
        description="HASHCODE connects learning, experimentation, collaboration and demonstrated expertise through a continuous experience."
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PILLARS.map((p, i) => (
          <Link
            key={p.title}
            href={p.href}
            className={`group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-md ${i % 2 === 1 ? "sm:translate-y-4" : ""}`}
          >
            <p.icon className="h-7 w-7 text-primary" aria-hidden />
            <h3 className="mt-4 font-syne text-xl font-bold text-foreground">{p.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.text}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              Explore
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
