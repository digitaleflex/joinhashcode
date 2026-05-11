"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Database, Mail as MailIcon, LayoutDashboard } from "lucide-react"

export function Nav() {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const [status, setStatus] = useState<{ database: string; email: string }>({ database: 'loading', email: 'loading' })

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setStatus(data))
      .catch(() => setStatus({ database: 'error', email: 'error' }))
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-1.5 group">
            <Image
              src="/hashcodejoin.png"
              alt="HASHCODE"
              width={180}
              height={48}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>
          
          <div className="hidden sm:flex items-center gap-3 px-3 py-1 rounded-full bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-1.5">
              <Database className={`h-3 w-3 ${status.database === 'online' ? 'text-emerald-500' : 'text-orange-500 animate-pulse'}`} />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">DB</span>
            </div>
            <div className="w-px h-3 bg-primary/10" />
            <div className="flex items-center gap-1.5">
              <MailIcon className={`h-3 w-3 ${status.email === 'online' ? 'text-emerald-500' : 'text-orange-500'}`} />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-tighter">MAIL</span>
            </div>
          </div>
        </div>

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

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                Dashboard
              </Link>
              <div className="w-px h-3 bg-primary/10" />
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await authClient.signOut()
                  router.refresh()
                }}
                className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
              >
                Déconnexion
              </Button>
              <div className="h-8 w-8 rounded-full border border-primary/20 bg-primary/10 flex items-center justify-center overflow-hidden">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-[10px] font-mono text-primary">
                    {session.user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ) : (
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
          )}
        </div>
      </div>
    </header>
  )
}
