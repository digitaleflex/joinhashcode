import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function Nav() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-1.5 group">
          <span className="font-mono text-sm text-primary">#</span>
          <span className="font-mono text-sm font-medium tracking-tight text-foreground">HASHCODE</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#vision"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Vision
          </Link>
          <Link
            href="#how"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Fonctionnement
          </Link>
          <Link
            href="#why"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Pourquoi
          </Link>
        </nav>

        <Button
          asChild
          size="sm"
          className="h-8 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/quiz">
            Commencer
            <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>
    </header>
  )
}
