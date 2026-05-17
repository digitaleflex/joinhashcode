"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { BottomNav } from "@/components/dashboard/bottom-nav"

export function Nav() {
  const { data: session } = authClient.useSession()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${
          scrolled
            ? "bg-background/80 backdrop-blur-xl border-border/60 py-2"
            : "bg-transparent border-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="relative flex items-center gap-1.5 group">
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Image
              src="/hashcodejoin.png"
              alt="HASHCODE"
              width={160}
              height={40}
              className="h-8 w-auto object-contain relative z-10"
              priority
            />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:flex text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors items-center gap-2"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <div className="h-8 w-8 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/5">
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] font-mono text-primary font-bold">
                      {session.user.name.charAt(0).toUpperCase()}
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
                  className="hidden sm:flex text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Link href="/signin">Connexion</Link>
                </Button>
                <Button
                  asChild
                  size="sm"
                  className="h-9 rounded-full bg-primary px-4 sm:px-5 text-[10px] sm:text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
                >
                  <Link href="/quiz" className="flex items-center gap-1.5">
                    Se profiler
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      {session && <BottomNav />}
    </>
  )
}
