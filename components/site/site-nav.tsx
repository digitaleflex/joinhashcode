"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, LayoutDashboard, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"

const PUBLIC_LINKS = [
  { href: "/programs", label: "Domaines" },
  { href: "/labs", label: "Labs" },
  { href: "/community", label: "Communauté" },
  { href: "/talents", label: "Talents" },
  { href: "/about", label: "À propos" },
]

/**
 * Keep the public navigation independent from Better Auth session fetching.
 * Protected destinations perform their own server-side authentication checks.
 */
function SiteNavActions() {
  return (
    <div className="hidden items-center gap-3 lg:flex">
      <Link
        href="/academy"
        className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        <BookOpen className="h-3.5 w-3.5" />
        Academy
      </Link>
      <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold">
        <Link href="/dashboard" className="flex items-center gap-1.5">
          <LayoutDashboard className="h-3.5 w-3.5" />
          Mon espace
        </Link>
      </Button>
      <Button asChild size="sm" className="h-8 rounded-lg px-4 text-xs font-bold">
        <Link href="/signin" className="flex items-center gap-1.5">
          Rejoindre HashCode
          <ArrowRight className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  )
}

export function SiteNav() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-sticky)] w-full border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2"
          aria-label="Accueil HashCode"
          onClick={() => setOpen(false)}
        >
          <Logo variant="mark" size="sm" />
          <Logo variant="full" size="sm" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Navigation principale">
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center">
          <SiteNavActions />
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background lg:hidden"
            aria-expanded={open}
            aria-controls="hashcode-mobile-navigation"
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="hashcode-mobile-navigation"
          className="border-t border-border bg-background px-4 pb-4 pt-2 lg:hidden"
          aria-label="Navigation mobile"
        >
          {PUBLIC_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-2 py-3 text-sm font-medium text-foreground hover:bg-muted"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/academy"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-2 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Academy
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="block rounded-lg px-2 py-3 text-sm font-medium text-muted-foreground hover:bg-muted"
          >
            Contact
          </Link>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border pt-3">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard" onClick={() => setOpen(false)}>
                Mon espace
              </Link>
            </Button>
            <Button asChild size="sm" className="w-full">
              <Link href="/signin" onClick={() => setOpen(false)}>
                Rejoindre
                <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  )
}
