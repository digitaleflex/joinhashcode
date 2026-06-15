"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Mail, Loader2 } from "lucide-react";

export function PendingInvitations() {
  const router = useRouter();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInvitations = async () => {
    try {
      const { data, error } = await authClient.organization.listInvitations();
      if (error) {
        console.error(error);
      } else {
        setInvitations(data || []);
      }
    } catch (error: unknown) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  const handleAction = async (invitationId: string, action: "accept" | "reject") => {
    try {
      let error;
      if (action === "accept") {
        const res = await authClient.organization.acceptInvitation({ invitationId });
        error = res.error;
      } else {
        const res = await authClient.organization.rejectInvitation({ invitationId });
        error = res.error;
      }

      if (error) {
        toast.error(error.message || "Une erreur est survenue");
      } else {
        toast.success(action === "accept" ? "Invitation acceptée !" : "Invitation refusée");
        fetchInvitations();
        if (action === "accept") router.refresh();
      }
    } catch {
      toast.error("Erreur technique lors de l'action");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (invitations.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-mono font-bold text-primary uppercase tracking-widest flex items-center gap-2">
        <Mail className="size-4" />
        Invitations en attente ({invitations.length})
      </h3>
      
      <div className="grid gap-3">
        {invitations.map((invite) => (
          <Card key={invite.id} className="bg-zinc-900/50 border-white/5 overflow-hidden">
            <CardContent className="p-4 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-sm font-bold text-white uppercase italic">
                  Escouade {invite.organizationName}
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  Rôle proposé : {invite.role === "admin" ? "Administrateur" : "Membre"}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-8 w-8 p-0 border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-400"
                  onClick={() => handleAction(invite.id, "reject")}
                >
                  <X className="size-4" />
                </Button>
                <Button 
                  size="sm" 
                  className="h-8 gap-2 bg-primary text-black hover:bg-primary/90 font-bold text-[10px] uppercase"
                  onClick={() => handleAction(invite.id, "accept")}
                >
                  <Check className="size-4" />
                  Accepter
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
