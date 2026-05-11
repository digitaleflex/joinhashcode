"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, LayoutDashboard, Menu, X } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"

export function Nav() {
  const { data: session } = authClient.useSession()
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Vision", href: "#vision" },
    { name: "Missions", href: "#missions" },
    { name: "Fonctionnement", href: "#how" },
    { name: "Écosystème", href: "#ecosystem" },
  ]

  return (
    <>
    <header 
      className={`sticky top-0 z-100 w-full transition-all duration-300 border-b ${
        scrolled ? "bg-background/80 backdrop-blur-xl border-border/60 py-2" : "bg-transparent border-transparent py-4"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
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
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-all hover:text-primary hover:tracking-wide"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {session ? (
            <div className="hidden md:flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-xs font-mono uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
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
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:flex text-xs font-medium"
              >
                <Link href="/login">Connexion</Link>
              </Button>
              <Button
                asChild
                size="sm"
                className="h-9 rounded-full bg-primary px-5 text-xs font-bold text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
              >
                <Link href="/quiz" className="flex items-center gap-2">
                  L'Expérience
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle (Non-session) */}
          {!session && (
            <button 
              className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border/50 overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-2xl font-bold tracking-tighter hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-border/50">
                <Button asChild className="w-full rounded-xl py-6 text-lg font-bold">
                  <Link href="/quiz">Commencer l'Aventure</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    {session && <BottomNav />}
    </>
  )
}
