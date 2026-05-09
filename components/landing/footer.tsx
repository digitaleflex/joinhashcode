import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-mono text-sm text-primary">#</span>
            <span className="font-mono text-sm font-medium tracking-tight text-foreground">
              HASHCODE
            </span>
          </Link>

          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            © 2025 — Le programme de la nouvelle ère
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Confidentialité
            </Link>
            <Link
              href="#"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
