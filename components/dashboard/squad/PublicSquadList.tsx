"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Zap, UserPlus, Loader2 } from "lucide-react";

interface PublicSquadListProps {
  squads: any[];
  currentUserId?: string;
}

export function PublicSquadList({ squads, currentUserId }: PublicSquadListProps) {
  const [pendingIds, setPendingIds] = useState<string[]>([]);

  const handleJoinRequest = async (squadId: string) => {
    setPendingIds(prev => [...prev, squadId]);
    
    try {
      const response = await fetch("/api/squad/join-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId: squadId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Erreur lors de la demande");
      }

      toast.success("Demande envoyée au Chef d\"escouade !");
    } catch (err: any) {
      toast.error(err.message);
      setPendingIds(prev => prev.filter(id => id !== squadId));
    }
  };

  if (squads.length === 0) return (
    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
        <p className="text-zinc-500 font-mono text-xs uppercase">Aucune escouade publique disponible</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {squads.map((squad) => (
        <Card key={squad.id} className="bg-zinc-900/40 border-white/5 hover:border-primary/30 transition-all duration-500 group overflow-hidden">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="size-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden">
                    {squad.logo ? (
                        <img src={squad.logo} alt={squad.name} className="size-full object-cover" />
                    ) : (
                        <Users className="size-6 text-zinc-600" />
                    )}
                </div>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 font-mono text-[9px] uppercase">
                    {squad.members.length}/5 Agents
                </Badge>
            </div>

            <div className="space-y-1">
                <h3 className="text-lg font-bold text-white uppercase italic truncate">
                    {squad.name}
                </h3>
                <div className="flex items-center gap-2">
                    <div className="h-1 w-24 bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-primary shadow-[0_0_10px_#C5F441]"
                            style={{ width: `${Math.round((squad.cohesionScore || 0.1) * 100)}%` }}
                        />
                    </div>
                    <span className="text-[10px] font-bold text-primary/60 font-mono">{Math.round((squad.cohesionScore || 0.1) * 100)}% SYNC</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2">
                {squad.members.slice(0, 3).map((m: any) => (
                    <Avatar key={m.id} className="size-6 border border-zinc-900">
                        <AvatarImage src={m.user.image} />
                        <AvatarFallback className="text-[8px]">{m.user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
                {squad.members.length > 3 && (
                    <div className="size-6 rounded-full bg-zinc-800 border border-zinc-900 flex items-center justify-center text-[8px] text-zinc-500">
                        +{squad.members.length - 3}
                    </div>
                )}
            </div>

            <Button 
                onClick={() => handleJoinRequest(squad.id)}
                disabled={pendingIds.includes(squad.id) || squad.members.length >= 5}
                className={cn(
                    "w-full h-11 uppercase font-bold text-[10px] tracking-widest transition-all duration-500",
                    pendingIds.includes(squad.id) ? "bg-zinc-800" : "bg-white text-black hover:bg-primary hover:text-black"
                )}
            >
                {pendingIds.includes(squad.id) ? (
                    <><Loader2 className="size-3 mr-2 animate-spin" /> En attente</>
                ) : squad.members.length >= 5 ? (
                    "Complet"
                ) : (
                    <><UserPlus className="size-3 mr-2" /> Postuler</>
                )}
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
