"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { BottomNav } from "@/components/dashboard/bottom-nav"
function NavActions() {
  const [isMounted, setIsMounted] = useState(false)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return <div className="h-8 w-20" />

  return (
    <div className="flex items-center gap-1.5 sm:gap-3">
      {session ? (
        <>
          <Link
            href="/dashboard"
            className="hidden sm:flex text-xs font-mono font-bold tracking-tight text-muted-foreground hover:text-primary transition-colors items-center gap-2"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Tableau de bord
          </Link>
          <Link
            href="/dashboard"
            className="sm:hidden flex h-8 w-8 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 hover:bg-primary/20 transition-colors"
            aria-label="Dashboard"
          >
            <LayoutDashboard className="h-4 w-4 text-primary" />
          </Link>
          <div className="h-8 w-8 rounded-lg border border-primary/20 bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/5">
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name}
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-xs font-mono text-primary font-bold">
                {session?.user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </span>
            )}
          </div>
        </>
      ) : (
        <>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 px-3 text-xs font-bold text-muted-foreground hover:text-white"
          >
            <Link href="/signin">Connexion</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="hidden sm:inline-flex h-8 rounded-lg bg-primary/10 border border-primary/20 px-3 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
          >
            <Link href="/team">Rejoindre la Team</Link>
          </Button>
          <Button
            asChild
            size="sm"
            className="h-8 rounded-lg bg-primary px-3 sm:px-4 text-3xs sm:text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/10 transition-all hover:scale-105 active:scale-95 uppercase"
          >
            <Link href="/quiz" className="flex items-center gap-1.5">
              <span className="hidden sm:inline">Se profiler</span>
              <span className="sm:hidden">Quiz</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </>
      )}
    </div>
  )
}

export function Nav() {
  const [isMounted, setIsMounted] = useState(false)
  const { data: session } = authClient.useSession()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[var(--z-sticky)] w-full bg-background/80 backdrop-blur-xl border-b border-border/60 py-3">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-1.5 group">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/hashcodejoin.png"
              alt="HASHCODE"
              width={160}
              height={40}
              className="h-8 w-auto object-contain relative z-[var(--z-content)]"
              priority
            />
          </Link>

          {/* Right actions */}
          <NavActions />
        </div>
      </header>
      {isMounted && session && <BottomNav />}
    </>
  )
}
