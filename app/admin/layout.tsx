import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/admin-sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/signin")

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
    redirect("/dashboard")
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-950 text-white selection:bg-primary/30">
        <AdminSidebar user={dbUser} />
        <SidebarInset className="bg-zinc-950">
          <main className="flex-1 p-6 md:p-8">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
