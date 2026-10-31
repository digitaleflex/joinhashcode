import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HomeFinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-14 text-center sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-[80px]" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-primary-foreground/10 blur-[80px]" />
        </div>
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-syne text-3xl font-bold text-primary-foreground sm:text-5xl">
            Your next step starts here.
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-primary-foreground/90">
            Explore new possibilities, develop your skills and start building
            something meaningful with HASHCODE.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/signin"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-7 py-3.5 text-sm font-bold text-primary transition-transform hover:scale-[1.02]"
            >
              Join HASHCODE <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/30 px-7 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10"
            >
              Explore our ecosystem
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
