import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Brain,
  User as UserIcon,
  Globe,
  Target,
  ShieldCheck,
  Zap,
  Medal,
  ChevronRight,
  Fingerprint,
  Activity,
  Cpu,
  Flame,
  TrendingUp,
  History,
  Users,
  Share2,
  Download,
  Lightbulb
} from "lucide-react";
import { Github, Linkedin } from "@/components/ui/brand-icons";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { BottomNav } from "@/components/dashboard/bottom-nav";
import { Button } from "@/components/ui/button";
import { UserTopBar } from "@/components/dashboard/user-topbar";
import { MemberCard } from "@/components/ui/member-card";
import { EvolutionRadar } from "@/components/dashboard/evolution-radar";
import { XPGrowthChart } from "@/components/dashboard/xp-growth-chart";
import { ShareCardDialog } from "@/components/dashboard/share-card-dialog";
import { DossierView } from "@/components/dossier/dossier-view";

interface PageProps {
  searchParams: Promise<{ userId?: string }>
}

export default async function DossierPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/signin");
  }

  // Fetch session user first to verify role
  const sessionUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, role: true }
  });

  // Admin / Moderator bypass for public/private portfolio inspection
  let targetUserId = session.user.id;
  let isInspecting = false;

  if (params.userId && params.userId !== session.user.id) {
    if (sessionUser && ["ADMIN", "MODERATOR"].includes(sessionUser.role)) {
      targetUserId = params.userId;
      isInspecting = true;
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    include: {
      quizResults: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      missionSubmissions: {
        orderBy: { createdAt: 'desc' },
        take: 3,
        include: {
          mission: true
        }
      },
      activityLogs: {
        orderBy: { createdAt: 'desc' },
        take: 50
      },
      members: {
        include: {
          organization: {
            include: {
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      pseudo: true,
                      image: true,
                      class: true,
                      level: true,
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
  });

  if (!user) return null;

  const activeOrg = user.members[0]?.organization ?? null;
  const quizResult = user.quizResults?.[0];
  const answers = quizResult?.answers as any || {};

  // Fetch squad activity logs if in a squad
  let squadMembersLogs: any[] = [];
  if (activeOrg) {
    const squadMemberIds = (activeOrg as any).members.map((m: any) => m.userId);
    squadMembersLogs = await prisma.activityLog.findMany({
      where: {
        userId: { in: squadMemberIds },
        action: {
          in: ["MISSION_SUBMITTED", "MISSION_APPROVED", "SQUAD_CREATED", "SQUAD_JOINED", "LEVEL_UP", "CHECKIN_COMPLETED"],
        },
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
            pseudo: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });
  }

  // Neural Loop Logic: Engagement tips based on stats (MOVED TO DossierView)

  return (
    <SidebarProvider>
      <AppSidebar user={user} hasSquad={!!activeOrg} />
      <BottomNav />
      
      <SidebarInset className="bg-background relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
        <div className="scanline opacity-20" />

        <UserTopBar user={user} />
        
        <main className="flex-1 p-3 sm:p-6 md:p-10 pb-40 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <DossierView 
            user={user}
            activeOrg={activeOrg}
            quizResult={quizResult}
            squadMembersLogs={squadMembersLogs}
            isInspecting={isInspecting}
          />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
