import Link from "next/link"
import { Logo } from "@/components/brand/logo"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border mt-20">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
          
          {/* Logo & Vision */}
          <div className="space-y-6">
            <Link href="/" className="inline-block group">
              <div className="relative">
                <Logo variant="full" size="sm" className="object-contain brightness-75 group-hover:brightness-100 transition-all" />
              </div>
            </Link>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-xs">
              Le premier écosystème d'évolution neuronale dédié aux bâtisseurs de la nouvelle ère technologique.
            </p>
            <div className="flex items-center gap-3">
              <div className="size-2 rounded-full bg-emerald-500/50 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-tighter">en ligne</span>
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2">
                <li><Link href="/quiz" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Lancer le quiz</Link></li>
                <li><Link href="/signin" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Accès membre</Link></li>
                <li><Link href="/missions" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Catalogue missions</Link></li>
                <li><Link href="/talent" className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors">Talents</Link></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider">Protocoles</h4>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Confidentialité</Link></li>
                <li><Link href="/terms" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Conditions</Link></li>
                <li><Link href="/legal" className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors">Mentions légales</Link></li>
              </ul>
            </div>
          </div>

          {/* Technical Info / CTA */}
          <div className="bg-muted border border-border rounded-2xl p-6 space-y-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-primary font-black uppercase">HASHCODE</span>
              <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">Afrique & Diaspora Connectée</p>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between items-center">
              <span className="text-xs font-mono text-muted-foreground font-bold">2026</span>
              <span className="text-xs font-mono text-muted-foreground font-bold">v1.1</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-mono font-bold text-muted-foreground tracking-tight">
            © 2026 HASHCODE // LE PROGRAMME DE LA NOUVELLE ÈRE
          </p>
          <div className="flex items-center gap-4 opacity-50 grayscale hover:opacity-100 hover:grayscale-0 transition-all">
             {/* Social placeholders could go here */}
          </div>
        </div>
      </div>
    </footer>
  )
}
