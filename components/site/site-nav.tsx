"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight, BookOpen, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/brand/logo"
import { authClient } from "@/lib/auth-client"

const PUBLIC_LINKS = [
  { href: "/programs", label: "Programs" },
  { href: "/labs", label: "Labs" },
  { href: "/community", label: "Community" },
  { href: "/talents", label: "Talents" },
  { href: "/about", label: "About" },
]

function SiteNavActions() {
  const [isMounted, setIsMounted] = useState(false)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className="h-8 w-20" />

  if (session) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-3">
        <Link
          href="/academy"
          className="hidden items-center gap-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary sm:flex"
        >
          <BookOpen className="h-3.5 w-3.5" />
          Academy
        </Link>
        <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold">
          <Link href="/dashboard" className="flex items-center gap-1.5">
            <LayoutDashboard className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      <Link
        href="/academy"
        className="hidden items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary sm:inline-flex"
      >
        <BookOpen className="h-3.5 w-3.5" />
        Academy
      </Link>
      <Button asChild variant="ghost" size="sm" className="h-8 px-3 text-xs font-semibold">
        <Link href="/signin">Sign in</Link>
      </Button>
      <Button asChild size="sm" className="h-8 rounded-lg px-3 text-xs font-bold sm:px-4">
        <Link href="/signin" className="flex items-center gap-1.5">
          <span className="hidden sm:inline">Join the community</span>
          <span className="sm:hidden">Join</span>
          <ArrowRight className="h-3 w-3" />
        </Link>
      </Button>
    </div>
  )
}

export function SiteNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-sticky)] w-full border-b border-border bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2" aria-label="HASHCODE home">
          <Logo variant="mark" size="sm" />
          <Logo variant="full" size="sm" />
        </Link>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Primary">
          {PUBLIC_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <SiteNavActions />
      </div>
    </header>
  )
}
