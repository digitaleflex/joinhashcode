import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { UserTopBar } from "@/components/dashboard/user-topbar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { ReviewerQueue } from "@/components/missions/reviewer-queue"

export default async function ReviewerPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/signin")

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  if (!dbUser) redirect("/signin")

  return (
    <SidebarProvider>
      <AppSidebar user={dbUser} />
      <BottomNav />
      <SidebarInset className="bg-background">
        <UserTopBar user={dbUser} />
        <main className="flex-1 p-4 md:p-8 pb-(--bottom-nav-height) md:pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-lg font-bold tracking-tight text-white">Espace Reviewer</h1>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                Soumissions éligibles pour ta revue — même profil, niveau supérieur.
              </p>
            </div>
            <ReviewerQueue reviewerId={dbUser.id} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
