"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Trash2, LogOut, Crown, Zap, ShieldAlert, UserPlus } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/lib/dates";
import { cn } from "@/lib/utils";

interface MemberListMember {
  id: string
  userId: string
  role: string
  user?: { id: string; name?: string | null; pseudo?: string | null; image?: string | null }
}

interface MemberListProps {
  members: MemberListMember[];
  currentUserId: string;
}

function ActivityDot({ lastCheckinAt }: { lastCheckinAt?: string | null }) {
  if (!lastCheckinAt) return <span className="size-2 rounded-full bg-zinc-700 inline-block" title="Jamais connecté" />;
  const days = (Date.now() - new Date(lastCheckinAt).getTime()) / 86_400_000;
  if (days < 1) return <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981] inline-block animate-pulse" title="Actif aujourd'hui" />;
  if (days < 3) return <span className="size-2 rounded-full bg-amber-500 inline-block" title="Actif récemment" />;
  return <span className="size-2 rounded-full bg-zinc-600 inline-block" title="Inactif" />;
}

export function MemberList({ members, currentUserId }: MemberListProps) {
  const router = useRouter();
  const currentUserMember = members.find((m) => m.userId === currentUserId);
  const isLeader = currentUserMember?.role === "owner";
  const isAdmin = currentUserMember?.role === "admin";
  const [memberActivity, setMemberActivity] = useState<Record<string, string | null>>({});

  useEffect(() => {
    fetch("/api/squad/members")
      .then(r => r.ok ? r.json() : [])
      .then((data: { userId: string; user?: { lastCheckinAt?: string | null } }[]) => {
        const map: Record<string, string | null> = {};
        data.forEach(m => { map[m.userId] = m.user?.lastCheckinAt ?? null; });
        setMemberActivity(map);
      })
      .catch(() => {});
  }, []);

  const handleUpdateRole = async (memberId: string, newRole: string, name?: string | null) => {
    try {
      const res = await fetch("/api/squad/member/update-role", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, role: newRole }),
      });
      if (!res.ok) { 
        const d = await res.json().catch(() => ({}));
        toast.error(d.error || "Erreur lors du changement de rôle"); 
      }
      else { 
        toast.success(`Rôle de ${name} mis à jour : ${newRole === 'admin' ? 'Officier' : 'Membre'}`); 
        router.refresh(); 
      }
    } catch { toast.error("Une erreur inattendue est survenue"); }
  };

  const handleRemove = async (guildMemberId: string, name?: string | null) => {
    if (!confirm(`Es-tu sûr de vouloir retirer ${name} de l'escouade ?`)) return;
    try {
      const res = await fetch("/api/squad/join-request/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: guildMemberId, action: "remove" }),
      });
      if (!res.ok) { toast.error(await res.text() || "Erreur lors de la suppression"); }
      else { toast.success(`${name} a été retiré de l'escouade`); router.refresh(); }
    } catch { toast.error("Une erreur inattendue est survenue"); }
  };

  const handleTransfer = async (memberId: string, name?: string | null) => {
    if (!confirm(`Es-tu sûr de vouloir transférer le leadership à ${name} ?`)) return;
    try {
      const res = await fetch("/api/squad/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetMemberId: memberId }),
      });
      if (!res.ok) { const d = await res.json().catch(() => ({})); toast.error(d.error || "Erreur lors du transfert"); }
      else { toast.success(`Leadership transféré à ${name}`); router.refresh(); }
    } catch { toast.error("Une erreur inattendue est survenue"); }
  };

  const handleLeave = async () => {
    if (!confirm("Es-tu sûr de vouloir quitter cette escouade ?")) return;
    try {
      const res = await fetch("/api/squad/leave", { method: "DELETE" });
      if (!res.ok) { toast.error(await res.text() || "Erreur lors du départ"); }
      else { toast.success("Tu as quitté l'escouade"); window.location.href = "/squad"; }
    } catch { toast.error("Une erreur inattendue est survenue"); }
  };

  return (
    <div className="rounded-xl border border-white/5 bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-white/5 hover:bg-transparent">
            <TableHead className="text-3xs font-mono uppercase text-zinc-600">Membre</TableHead>
            <TableHead className="text-3xs font-mono uppercase text-zinc-600">Rôle</TableHead>
            <TableHead className="text-3xs font-mono uppercase text-zinc-600">
              <span className="flex items-center gap-1"><Zap className="size-3" /> Activité</span>
            </TableHead>
            <TableHead className="text-right text-3xs font-mono uppercase text-zinc-600">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const lastCheckin = memberActivity[member.userId];
            const lastCheckinDate = lastCheckin ? new Date(lastCheckin) : null;
            return (
              <TableRow key={member.id} className="border-white/5">
                <TableCell className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user?.image ?? undefined} />
                      <AvatarFallback>{member.user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5">
                      <ActivityDot lastCheckinAt={lastCheckin} />
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-xs">{member.user?.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">@{member.user?.pseudo || "—"}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={member.role === "owner" ? "default" : member.role === "admin" ? "outline" : "secondary"} 
                    className={cn(
                        "text-3xs uppercase font-mono",
                        member.role === "admin" && "border-primary/50 text-primary bg-primary/5"
                    )}
                  >
                    {member.role === "owner" ? "Chef" : member.role === "admin" ? "Officier" : "Membre"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className={cn("text-3xs font-mono", lastCheckinDate ? "text-zinc-400" : "text-zinc-600")}>
                    {lastCheckinDate ? formatRelativeTime(lastCheckinDate) : "Jamais"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  {member.userId === currentUserId ? (
                    member.role !== "owner" && (
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 font-bold uppercase" onClick={handleLeave}>
                        <LogOut className="h-3 w-3" /> Quitter
                      </Button>
                    )
                  ) : (
                    (isLeader || (isAdmin && member.role === "member")) && member.role !== "owner" && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10">
                          {isLeader && (
                            <>
                              <DropdownMenuItem className="text-white focus:text-white focus:bg-white/10" onClick={() => handleTransfer(member.id, member.user?.name)}>
                                <Crown className="mr-2 h-4 w-4 text-primary" /> Transférer Leadership
                              </DropdownMenuItem>
                              
                              {member.role === "member" ? (
                                <DropdownMenuItem className="text-primary focus:text-primary focus:bg-primary/10" onClick={() => handleUpdateRole(member.id, "admin", member.user?.name)}>
                                  <ShieldAlert className="mr-2 h-4 w-4" /> Promouvoir Officier
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-zinc-400 focus:text-white focus:bg-white/10" onClick={() => handleUpdateRole(member.id, "member", member.user?.name)}>
                                  <UserPlus className="mr-2 h-4 w-4" /> Rétrograder Membre
                                </DropdownMenuItem>
                              )}
                            </>
                          )}
                          
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => handleRemove(member.id, member.user?.name)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Retirer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
