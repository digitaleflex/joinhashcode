import type { Metadata } from "next"
import Link from "next/link"
import { verifyUnsubscribeSignature } from "@/lib/email-consent"
import { UnsubscribeForm } from "@/components/email/unsubscribe-form"
import { Logo } from "@/components/brand/logo"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Désabonnement — HASHCODE",
  robots: { index: false, follow: false },
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ u?: string; t?: string; s?: string }>
}) {
  const { u = "", t = "", s = "" } = await searchParams
  const valid = Boolean(u && t && s) && verifyUnsubscribeSignature(u, s)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-4">
      <Link href="/" className="transition-transform hover:scale-105">
        <Logo variant="full" size="md" />
      </Link>

      <div className="w-full max-w-md rounded-2xl border border-white/8 bg-white/[0.02] p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-xl font-black uppercase italic tracking-tight text-white">
          Communications
        </h1>
        <UnsubscribeForm u={u} t={t} s={s} valid={valid} />
      </div>

      <p className="text-3xs font-mono uppercase tracking-wider text-zinc-600">
        HASHCODE — préférences de communication
      </p>
    </div>
  )
}
