import Link from "next/link"
import { Logo } from "@/components/brand/logo"

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="HASHCODE home">
              <Logo variant="mark" size="sm" />
              <Logo variant="full" size="sm" />
            </Link>
            <p className="text-sm font-medium leading-relaxed text-muted-foreground">
              Build skills. Prove expertise. Create opportunities.
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              A place to learn, experiment, build and demonstrate what you can do.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ecosystem</h4>
              <ul className="space-y-2">
                <li><Link href="/programs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Programs</Link></li>
                <li><Link href="/labs" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Labs</Link></li>
                <li><Link href="/community" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Community</Link></li>
                <li><Link href="/talents" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Talents</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Resources</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">About</Link></li>
                <li><Link href="/contact" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Contact</Link></li>
                <li><Link href="/academy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Academy</Link></li>
                <li><Link href="/signin" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Sign in</Link></li>
              </ul>
            </div>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Privacy</Link></li>
              <li><Link href="/terms" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Terms</Link></li>
              <li><Link href="/legal" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Legal notice</Link></li>
              <li><Link href="/cookies" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Cookies</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">© 2026 HASHCODE</p>
          <p className="text-xs text-muted-foreground">Build skills. Prove expertise. Create opportunities.</p>
        </div>
      </div>
    </footer>
  )
}
