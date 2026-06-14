"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Check, X, Loader2 } from "lucide-react";

export function JoinRequestsManager({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`/api/squad/join-request?organizationId=${organizationId}`);
      if (!response.ok) throw new Error("Échec du chargement");
      const data = await response.json();
      setRequests(data);
    } catch (error: unknown) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [organizationId]);

  const handleAction = async (requestId: string, action: "accept" | "reject") => {
    try {
      const response = await fetch("/api/squad/join-request/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      if (!response.ok) throw new Error("Erreur lors de la réponse");
      
      toast.success(action === "accept" ? "Agent recruté !" : "Candidature refusée");
      fetchRequests();
      if (action === "accept") router.refresh();
    } catch {
      toast.error("Erreur technique");
    }
  };

  if (isLoading) return <Loader2 className="h-6 w-6 animate-spin mx-auto" />;
  if (requests.length === 0) return (
    <div className="text-center py-8 opacity-50 font-mono text-[10px] uppercase">
        Aucune candidature en attente
    </div>
  );

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <Card key={request.id} className="bg-zinc-900/50 border-white/5">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={request.user.image} />
                    <AvatarFallback>{request.user.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="text-sm font-bold text-white">{request.user.name}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">Niveau {request.user.level} // {request.user.class || "Agent_Core"}</div>
                </div>
            </div>
            
            <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="text-red-400 hover:bg-red-500/10" onClick={() => handleAction(request.id, "reject")}>
                    <X className="size-4" />
                </Button>
                <Button size="sm" className="bg-primary text-black hover:bg-primary/90 font-bold text-[10px]" onClick={() => handleAction(request.id, "accept")}>
                    <Check className="size-4 mr-1" /> RECRUTER
                </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
