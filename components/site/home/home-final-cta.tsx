import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HomeFinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-3xl bg-primary px-7 py-14 text-center sm:px-12 sm:py-20">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary-foreground/10 blur-[80px]" />
          <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-primary-foreground/10 blur-[80px]" />
        </div>
        <div className="relative">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/75">Le prochain pas t'appartient</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-syne text-3xl font-bold text-primary-foreground sm:text-5xl">Tes prochaines compétences commencent ici.</h2>
          <p className="mx-auto mt-5 max-w-xl leading-relaxed text-primary-foreground/90">Choisis un domaine, découvre les activités disponibles et commence à construire des réalisations dont tu peux être fier.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signin" className="inline-flex items-center gap-2 rounded-xl bg-primary-foreground px-7 py-3.5 text-sm font-bold text-primary transition-transform hover:-translate-y-0.5">
              Rejoindre HashCode <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-xl border border-primary-foreground/35 px-7 py-3.5 text-sm font-bold text-primary-foreground hover:bg-primary-foreground/10">
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
