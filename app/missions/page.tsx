import { Zap, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { MissionsList } from "@/components/missions/missions-list"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { BottomNav } from "@/components/dashboard/bottom-nav"
import { UserTopBar } from "@/components/dashboard/user-topbar"

export default async function MissionsPage() {
  const [session, dbUser] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    null // Placeholder to allow parallel setup with session check
  ]);

  if (!session) {
    redirect("/signin");
  }

  const finalDbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      level: true,
      experience: true,
      class: true,
      role: true,
      missionSubmissions: {
        select: {
          missionId: true,
          status: true,
        }
      }
    }
  });

  if (!finalDbUser) {
    redirect("/signin");
  }

  // Convert array to Record<missionId, status>
  const submissionsMap: Record<string, string> = {};
  finalDbUser.missionSubmissions.forEach(sub => {
    submissionsMap[sub.missionId] = sub.status;
  });

  return (
    <SidebarProvider>
      <AppSidebar user={finalDbUser} />
      <BottomNav />
      
      <SidebarInset className="bg-background">
        <UserTopBar user={finalDbUser} />
        
        <main className="flex-1 p-4 md:p-8 pb-(--bottom-nav-height) md:pb-8 overflow-y-auto scrollbar-none">
          <div className="max-w-6xl mx-auto">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-xs font-mono text-muted-foreground hover:text-primary transition-colors mb-8 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            RETOUR AU DASHBOARD
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <Zap className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold tracking-tight">Missions & Évolution</h1>
          </div>
          
          <div className="mb-12 p-6 rounded-2xl border border-border/50 bg-card">
            <div className="flex justify-between items-end mb-2">
               <div className="text-sm font-mono text-muted-foreground uppercase">Expérience Globale</div>
               <div className="text-xl font-bold text-primary">{finalDbUser.experience} XP</div>
            </div>
            <div className="text-xs text-muted-foreground mt-2">
               Accomplis des missions pour gagner de l'XP et augmenter ton niveau d'habilitation dans le système.
            </div>
          </div>

          <MissionsList 
            userLevel={finalDbUser.level} 
            userXp={finalDbUser.experience} 
            submissions={submissionsMap} 
            userClass={finalDbUser.class}
          />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
