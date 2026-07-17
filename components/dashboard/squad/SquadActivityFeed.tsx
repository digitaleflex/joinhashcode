"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/dates";
import { Zap, Target, UserPlus, TrendingUp, Award, Loader2 } from "lucide-react";

interface SquadActivityLog {
  id: string
  action: string
  createdAt: string | Date
  user?: { id: string; name?: string | null; pseudo?: string | null; image?: string | null }
}

export function SquadActivityFeed({ organizationId }: { organizationId: string }) {
  const [logs, setLogs] = useState<SquadActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch(`/api/squad/activity?organizationId=${organizationId}`);
        if (!response.ok) throw new Error("Échec");
        const data = await response.json() as SquadActivityLog[];
        setLogs(data);
      } catch (error: unknown) {
        console.error(error);

      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, [organizationId]);

  const getIcon = (action: string) => {
    switch (action) {
      case "MISSION_APPROVED": return <Award className="size-3 text-emerald-500" />;
      case "MISSION_SUBMITTED": return <Target className="size-3 text-amber-500" />;
      case "SQUAD_JOINED": return <UserPlus className="size-3 text-primary" />;
      case "SQUAD_UPDATED": return <TrendingUp className="size-3 text-purple-500" />;
      case "CHECKIN_COMPLETED": return <Zap className="size-3 text-blue-500" />;
      default: return <Zap className="size-3 text-zinc-500" />;
    }
  };

  const getLabel = (log: SquadActivityLog) => {
    const name = log.user?.pseudo || log.user?.name;
    switch (log.action) {
      case "MISSION_APPROVED": return <span><strong className="text-white">@{name}</strong> a validé une mission.</span>;
      case "MISSION_SUBMITTED": return <span><strong className="text-white">@{name}</strong> a transmis un livrable.</span>;
      case "SQUAD_JOINED": return <span><strong className="text-white">@{name}</strong> a rejoint l"unité.</span>;
      case "SQUAD_UPDATED": return <span><strong className="text-white">@{name}</strong> a mis à jour l'escouade.</span>;
      case "CHECKIN_COMPLETED": return <span><strong className="text-white">@{name}</strong> a fait son check-in.</span>;
      default: return <span>Activité de <strong className="text-white">@{name}</strong>.</span>;
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-zinc-800" /></div>;
  if (logs.length === 0) return <div className="text-center py-8 text-[10px] font-mono text-zinc-600 uppercase">Aucune activité récente</div>;

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex gap-4 group">
          <div className="flex flex-col items-center">
            <div className="size-8 rounded-full border border-white/5 bg-zinc-900 flex items-center justify-center overflow-hidden shrink-0">
               <Avatar className="size-full">
                   <AvatarImage src={log.user?.image ?? ""} />
                   <AvatarFallback className="text-[10px]">{log.user?.name?.charAt(0) ?? "?"}</AvatarFallback>
               </Avatar>
            </div>
            <div className="w-px flex-1 bg-white/5 my-1 group-last:hidden" />
          </div>
          
          <div className="pb-4 space-y-1">
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                {getIcon(log.action)}
                <div className="flex-1">{getLabel(log)}</div>
            </div>
            <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-tighter">
                {formatRelativeTime(log.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
