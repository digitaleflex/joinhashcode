"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function FinalCta() {
  return (
    <section className="relative overflow-hidden border-b border-border/60">
      {/* Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-dot-grid mask-radial-fade opacity-50"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-3xl px-4 py-28 text-center sm:px-6 sm:py-36 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-muted-foreground">
              Prêt ?
            </span>
          </div>

          <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Prêt à savoir
            <br />
            <span className="text-primary">qui tu es ?</span>
          </h2>

          <p className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            3 minutes. 13 questions. Un profil précis — et une communauté qui correspond.
          </p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25, ease: "easeOut" }}
          >
            <Button
              asChild
              size="lg"
              className="group h-12 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-[0_0_0_1px_rgba(197,244,65,0.2),0_8px_40px_-8px_rgba(197,244,65,0.5)] hover:bg-primary/90 transition-all hover:scale-105 active:scale-95"
            >
              <Link href="/quiz">
                Découvrir mon profil
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>

          <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground/60">
            Gratuit · Sans engagement · 3 minutes
          </p>
        </motion.div>
      </div>
    </section>
  )
}
