import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { UserTopBar } from "@/components/dashboard/user-topbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Activity, 
  UserSearch, 
  Mail, 
  Settings, 
  Inbox,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { MemberList } from "@/components/dashboard/squad/MemberList";
import { SquadActivityFeed } from "@/components/dashboard/squad/SquadActivityFeed";
import { JoinRequestsManager } from "@/components/dashboard/squad/JoinRequestsManager";
import { InviteMemberForm } from "@/components/dashboard/squad/InviteMemberForm";
import { OrgSettingsForm } from "@/components/dashboard/squad/OrgSettingsForm";
import { PendingInvitations } from "@/components/dashboard/squad/PendingInvitations";

export default async function SquadManagePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  // Fetch full organization using Better Auth API
  const org = await auth.api.getFullOrganization({
    headers: await headers(),
  });

  // Fallback to database lookup if BA active organization cookie is missing
  let dbSquad = null;
  let memberRole = "";

  if (!org) {
    const member = await prisma.member.findFirst({
      where: { userId: session.user.id },
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
                    role: true,
                    progress: { select: { level: true, missionsCompletedCount: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (member?.organization) {
      dbSquad = {
        ...member.organization,
        members: member.organization.members.map((m: any) => ({
          ...m,
          user: {
            ...m.user,
            pseudo: m.user.pseudo || m.user.name,
          },
        })),
      };
      memberRole = member.role;
    }
  } else {
    memberRole = org.members.find((m: any) => m.userId === session.user.id)?.role || "";
  }

  const squad = org ? {
    ...org,
    members: org.members.map((m: any) => ({
      ...m,
      user: {
        ...m.user,
        pseudo: m.user.name, // Fallback
      },
    })),
  } : dbSquad;

  // Allow owners and admins to manage
  const canManage = squad && (memberRole === "owner" || memberRole === "admin");
  if (!canManage) {
    redirect("/squad");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      pseudo: true,
      class: true,
      badges: true,
      role: true,
      progress: { select: { level: true, experience: true, missionsCompletedCount: true } },
    },
  });

  return (
    <SidebarProvider>
      <AppSidebar user={dbUser ?? session.user} hasSquad={!!squad} />
      <SidebarInset className="bg-background relative bg-gradient-mesh overflow-hidden">
        <div className="scanline" />
        <UserTopBar user={dbUser ?? session.user} squad={squad} memberRole={memberRole} />

        <main className="flex-1 p-4 md:p-10 pb-32 md:pb-12 overflow-y-auto scrollbar-none relative z-10">
          <div className="max-w-6xl mx-auto space-y-10">
            
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-zinc-500 uppercase">
                <ShieldCheck className="size-3 text-primary" />
                terminal_gestion_escouade
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white uppercase leading-[0.9]">
                Gestion de l&apos; <span className="text-primary italic">Escouade</span>
              </h1>
              <p className="text-zinc-500 text-sm font-medium max-w-xl">
                Contrôle total sur l&apos;unité {squad.name}. Gère tes membres, tes invitations et synchronise ton équipe.
              </p>
            </div>

            {/* Immersive Tabs Layout */}
            <div className="glass-card rounded-[1.5rem] md:rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl flex flex-col h-full md:min-h-[700px]">
              <Tabs defaultValue="members" className="flex flex-col md:flex-row h-full w-full">
                {/* Vertical / Horizontal Tabs List */}
                <TabsList className="flex flex-row md:flex-col h-auto md:w-72 bg-zinc-950/80 border-b md:border-b-0 md:border-r border-white/5 p-3 md:p-6 gap-2 md:gap-3 justify-start overflow-x-auto scrollbar-none backdrop-blur-xl w-full">
                  
                  <div className="hidden md:block mb-6 px-2">
                    <h3 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
                      Menu de Contrôle
                    </h3>
                  </div>

                  <TabsTrigger 
                    value="members" 
                    className="shrink-0 w-auto md:w-full justify-center md:justify-start gap-2 md:gap-4 py-2.5 px-4 md:py-3.5 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl md:rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-zinc-400 hover:text-zinc-200 transition-all border border-transparent data-[state=active]:border-primary/20 data-[state=active]:shadow-[0_0_15px_rgba(197,244,65,0.1)]"
                  >
                    <Users className="size-3.5 md:size-4" />
                    <span>Membres</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="journal" 
                    className="shrink-0 w-auto md:w-full justify-center md:justify-start gap-2 md:gap-4 py-2.5 px-4 md:py-3.5 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl md:rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-zinc-400 hover:text-zinc-200 transition-all border border-transparent data-[state=active]:border-primary/20 data-[state=active]:shadow-[0_0_15px_rgba(197,244,65,0.1)]"
                  >
                    <Activity className="size-3.5 md:size-4" />
                    <span>Journal</span>
                  </TabsTrigger>
                  
                  <div className="hidden md:block my-4 px-2">
                    <h3 className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                      Recrutement
                    </h3>
                  </div>

                  <TabsTrigger 
                    value="requests" 
                    className="shrink-0 w-auto md:w-full justify-center md:justify-start gap-2 md:gap-4 py-2.5 px-4 md:py-3.5 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl md:rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-zinc-400 hover:text-zinc-200 transition-all border border-transparent data-[state=active]:border-primary/20 data-[state=active]:shadow-[0_0_15px_rgba(197,244,65,0.1)]"
                  >
                    <UserSearch className="size-3.5 md:size-4" />
                    <span>Candidats</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="invitations" 
                    className="shrink-0 w-auto md:w-full justify-center md:justify-start gap-2 md:gap-4 py-2.5 px-4 md:py-3.5 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl md:rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-zinc-400 hover:text-zinc-200 transition-all border border-transparent data-[state=active]:border-primary/20 data-[state=active]:shadow-[0_0_15px_rgba(197,244,65,0.1)]"
                  >
                    <Inbox className="size-3.5 md:size-4" />
                    <span>Invitations</span>
                  </TabsTrigger>
                  
                  <TabsTrigger 
                    value="invite" 
                    className="shrink-0 w-auto md:w-full justify-center md:justify-start gap-2 md:gap-4 py-2.5 px-4 md:py-3.5 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl md:rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-zinc-400 hover:text-zinc-200 transition-all border border-transparent data-[state=active]:border-primary/20 data-[state=active]:shadow-[0_0_15px_rgba(197,244,65,0.1)]"
                  >
                    <Mail className="size-3.5 md:size-4" />
                    <span>Inviter</span>
                  </TabsTrigger>
                  
                  <div className="hidden md:block my-4 px-2">
                    <h3 className="text-[10px] font-mono font-bold text-zinc-600 uppercase tracking-widest">
                      Système
                    </h3>
                  </div>

                  <TabsTrigger 
                    value="settings" 
                    className="shrink-0 w-auto md:w-full justify-center md:justify-start gap-2 md:gap-4 py-2.5 px-4 md:py-3.5 md:px-5 text-[10px] md:text-xs font-bold uppercase tracking-wider rounded-xl md:rounded-2xl data-[state=active]:bg-primary/10 data-[state=active]:text-primary text-zinc-400 hover:text-zinc-200 transition-all border border-transparent data-[state=active]:border-primary/20 data-[state=active]:shadow-[0_0_15px_rgba(197,244,65,0.1)]"
                  >
                    <Settings className="size-3.5 md:size-4" />
                    <span>Réglages</span>
                  </TabsTrigger>
                </TabsList>

                {/* Content Area */}
                <div className="flex-1 p-4 md:p-12 bg-zinc-900/40 relative">
                  <TabsContent value="members" className="mt-0 focus-visible:outline-none">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold uppercase italic tracking-tight text-white">Roster de l&apos;Unité</h2>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase">{squad.members?.length}/5 Agents</span>
                      </div>
                      <MemberList members={squad.members || []} currentUserId={session.user.id} />
                    </div>
                  </TabsContent>

                  <TabsContent value="journal" className="mt-0 focus-visible:outline-none">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <h2 className="text-xl font-bold uppercase italic tracking-tight text-white">Flux d&apos;activité</h2>
                      <SquadActivityFeed organizationId={squad.id} />
                    </div>
                  </TabsContent>

                  <TabsContent value="requests" className="mt-0 focus-visible:outline-none">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <h2 className="text-xl font-bold uppercase italic tracking-tight text-white">Candidatures en attente</h2>
                      <JoinRequestsManager organizationId={squad.id} />
                    </div>
                  </TabsContent>

                  <TabsContent value="invitations" className="mt-0 focus-visible:outline-none">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                      <h2 className="text-xl font-bold uppercase italic tracking-tight text-white">Invitations envoyées</h2>
                      <PendingInvitations />
                    </div>
                  </TabsContent>

                  <TabsContent value="invite" className="mt-0 focus-visible:outline-none">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-xl">
                      <h2 className="text-xl font-bold uppercase italic tracking-tight text-white">Recrutement d&apos;Agents</h2>
                      <p className="text-sm text-zinc-400">Invite de nouveaux membres à rejoindre ton escouade en utilisant leur adresse email.</p>
                      <InviteMemberForm />
                    </div>
                  </TabsContent>

                  <TabsContent value="settings" className="mt-0 focus-visible:outline-none">
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl">
                      <h2 className="text-xl font-bold uppercase italic tracking-tight text-white">Configuration Système</h2>
                      <OrgSettingsForm organization={squad} />
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

            {/* Back to Journey path */}
            <div className="flex justify-center">
              <a 
                href="/squad" 
                className="group flex items-center gap-2 text-zinc-600 hover:text-white transition-all text-xs font-mono uppercase tracking-widest"
              >
                Retour au chemin d&apos;ascension
                <ChevronRight className="size-3 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
