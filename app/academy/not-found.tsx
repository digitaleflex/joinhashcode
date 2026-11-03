import Link from "next/link"
import { GraduationCap, ArrowLeft, BookOpen } from "lucide-react"

export default function AcademyNotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary">
        <GraduationCap className="h-7 w-7" aria-hidden />
      </div>
      <p className="mt-6 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
        Academy
      </p>
      <h1 className="mt-3 text-3xl font-black tracking-tight text-foreground sm:text-5xl">
        Page introuvable
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        Cette page Academy n&apos;existe pas ou a été déplacée. Retrouve le
        catalogue et les parcours depuis l&apos;accueil Academy.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/academy"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Retour à l&apos;Academy
        </Link>
        <Link
          href="/academy/courses"
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-primary/40"
        >
          <BookOpen className="h-4 w-4" aria-hidden />
          Voir les cours
        </Link>
      </div>
    </div>
  )
}
