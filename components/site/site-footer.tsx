import Link from "next/link"
import { Logo } from "@/components/brand/logo"

const FOOTER_LINKS = {
  "Découvrir": [
    { href: "/programs", label: "Domaines" },
    { href: "/labs", label: "Labs" },
    { href: "/community", label: "Communauté" },
    { href: "/talents", label: "Talents" },
  ],
  "Ressources": [
    { href: "/about", label: "À propos" },
    { href: "/academy", label: "Academy" },
    { href: "/contact", label: "Contact" },
    { href: "/signin", label: "Connexion" },
  ],
  "Informations": [
    { href: "/privacy", label: "Confidentialité" },
    { href: "/terms", label: "Conditions d'utilisation" },
    { href: "/legal", label: "Mentions légales" },
    { href: "/cookies", label: "Cookies" },
  ],
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_2fr]">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2" aria-label="Accueil HashCode">
              <Logo variant="full" size="sm" />
            </Link>
            <p className="max-w-sm text-sm font-semibold leading-relaxed text-foreground">Apprendre. Construire. Évoluer.</p>
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Un écosystème pour développer ses compétences numériques, pratiquer et rendre ses réalisations visibles.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {Object.entries(FOOTER_LINKS).map(([title, links]) => (
              <div key={title} className="space-y-3">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">{title}</h2>
                <ul className="space-y-2.5">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary">{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 sm:flex-row">
          <p className="text-[11px] text-muted-foreground">© {new Date().getFullYear()} HashCode. Tous droits réservés.</p>
          <p className="text-[11px] text-muted-foreground">Une communauté qui apprend, construit et partage.</p>
        </div>
      </div>
    </footer>
  )
}
