import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { Activity } from "lucide-react"
import { AdminNav } from "@/components/admin/AdminNav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/signin")

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_10px_rgba(var(--primary),0.2)]">
              <Activity className="h-3 w-3 text-primary" />
            </div>
            <span className="font-mono text-sm font-bold text-white tracking-tighter">
              HASHCODE <span className="text-muted-foreground mx-1">·</span> ADMIN
            </span>
          </div>
          <a
            href="/dashboard"
            className="text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest flex items-center gap-2 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Dashboard
          </a>
        </div>
      </header>

      {/* Navigation */}
      <AdminNav />

      {/* Main Content */}
      <main className="relative">{children}</main>
    </div>
  )
}
