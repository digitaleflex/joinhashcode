"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Trash2, LogOut, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MemberListProps {
  members: any[];
  currentUserId: string;
}

export function MemberList({ members, currentUserId }: MemberListProps) {
  const currentUserMember = members.find((m) => m.userId === currentUserId);
  const isLeader = currentUserMember?.role === "owner";

  const handleRemove = async (guildMemberId: string, name: string) => {
    if (!confirm(`Es-tu sûr de vouloir retirer ${name} de l'escouade ?`)) return;
    try {
      const res = await fetch("/api/squad/join-request/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId: guildMemberId, action: "remove" }),
      });
      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Erreur lors de la suppression");
      } else {
        toast.success(`${name} a été retiré de l'escouade`);
        window.location.reload();
      }
    } catch {
      toast.error("Une erreur inattendue est survenue");
    }
  };

  const handleLeave = async () => {
    if (!confirm("Es-tu sûr de vouloir quitter cette escouade ?")) return;
    try {
      const res = await fetch("/api/squad/leave", { method: "DELETE" });
      if (!res.ok) {
        const text = await res.text();
        toast.error(text || "Erreur lors du départ");
      } else {
        toast.success("Tu as quitté l'escouade");
        window.location.href = "/squad";
      }
    } catch {
      toast.error("Une erreur inattendue est survenue");
    }
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membre</TableHead>
            <TableHead>Rôle</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.user?.image} />
                  <AvatarFallback>{member.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-xs">{member.user?.name}</div>
                  <div className="text-[10px] text-muted-foreground">{member.user?.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={member.role === "owner" ? "default" : "secondary"}
                  className="text-[9px] uppercase font-mono"
                >
                  {member.role === "owner" ? "Chef" : "Membre"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {member.userId === currentUserId ? (
                  member.role !== "owner" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-[10px] text-destructive hover:text-destructive hover:bg-destructive/10 gap-2 font-bold uppercase"
                      onClick={handleLeave}
                    >
                      <LogOut className="h-3 w-3" />
                      Quitter
                    </Button>
                  )
                ) : (
                  isLeader && member.role !== "owner" && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10">
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive focus:bg-destructive/10"
                          onClick={() => handleRemove(member.id, member.user?.name)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Retirer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
