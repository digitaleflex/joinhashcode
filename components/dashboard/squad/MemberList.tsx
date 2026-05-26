"use client";

import { authClient } from "@/lib/auth-client";
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
import { MoreHorizontal, Trash2, LogOut } from "lucide-react";
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
  const handleRemove = async (memberId: string, name: string) => {
    if (!confirm(`Es-tu sûr de vouloir retirer ${name} de l"escouade ?`)) return;

    try {
      const { error } = await authClient.organization.removeMember({
        memberIdOrEmail: memberId,
      });

      if (error) {
        toast.error(error.message || "Erreur lors de la suppression");
      } else {
        toast.success(`${name} a été retiré de l"escouade`);
        window.location.reload();
      }
    } catch (err) {
      toast.error("Une erreur inattendue est survenue");
    }
  };

  const handleLeave = async () => {
    if (!confirm("Es-tu sûr de vouloir quitter cette escouade ?")) return;

    try {
      const { error } = await authClient.organization.leave();

      if (error) {
        toast.error(error.message || "Erreur lors du départ");
      } else {
        toast.success("Tu as quitté l"escouade");
        window.location.reload();
      }
    } catch (err) {
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
                  <AvatarImage src={member.user.image} />
                  <AvatarFallback>{member.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{member.user.name}</div>
                  <div className="text-xs text-muted-foreground">{member.user.email}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={member.role === "owner" ? "default" : "secondary"}>
                  {member.role === "owner" ? "Chef" : member.role === "admin" ? "Admin" : "Membre"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {member.userId === currentUserId ? (
                  member.role !== "owner" && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
                      onClick={handleLeave}
                    >
                      <LogOut className="h-4 w-4" />
                      Quitter
                    </Button>
                  )
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => handleRemove(member.id, member.user.name)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Retirer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
