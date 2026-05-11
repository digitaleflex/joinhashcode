import Image from "next/image"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              src="/hashcodejoin.png"
              alt="HASHCODE"
              width={140}
              height={36}
              className="h-7 w-auto object-contain brightness-90 hover:brightness-100 transition-all"
            />
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
