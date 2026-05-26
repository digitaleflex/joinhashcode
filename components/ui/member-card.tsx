"use client";

import { Download, Share2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn, generatePassportId } from "@/lib/utils";
import { CLASS_COLORS, LEVEL_NAMES, XP_MAX } from "@/lib/member-card-constants";

interface MemberCardProps {
  userId: string;
  pseudo: string;
  memberNumber: number | null;
  userClass: string | null;
  level: number;
  experience: number;
  createdAt: Date | string;
  className?: string;
  // New V2 Stats
  confidenceScore?: number;
  missionsCompleted?: number;
  tools?: string[];
}

export function MemberCard({
  userId,
  pseudo,
  memberNumber,
  userClass,
  level,
  experience,
  createdAt,
  className,
  confidenceScore = 0.25,
  missionsCompleted = 0,
  tools = [],
}: MemberCardProps) {
  const [copied, setCopied] = useState(false);

  const accent = CLASS_COLORS[userClass ?? "builder"] ?? "#B8FF3B";
  const levelName = LEVEL_NAMES[level] ?? "INIT";
  const xpMax = XP_MAX[level] ?? 100;
  const xpPct = Math.min(100, Math.round((experience / xpMax) * 100));
  const passportId = generatePassportId(memberNumber);
  const classLabel = (userClass ?? "BUILDER").toUpperCase();
  const joinDate = new Date(createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });

  const cardUrl = `/api/card/${userId}`;

  const handleCopy = async () => {
    const url = `${window.location.origin}/dossier`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto space-y-4", className)}>
      {/* Card visual - Horizontal Format */}
      <div
        className="relative w-full overflow-hidden rounded-[1.5rem] border-2 shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(var(--primary),0.1)] group flex flex-col"
        style={{
          background: "#050505",
          borderColor: `${accent}40`,
        }}
      >
        <div className="absolute inset-0 aspect-[1.7/1] sm:aspect-auto opacity-20">
        {/* GUILD SPECIFIC PATTERNS */}
        <div className="absolute inset-0 opacity-20">
          {userClass === "builder" && (
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${accent}20 1px, transparent 1px)`, backgroundSize: '30px 30px' }} />
          )}
          {userClass === "creator" && (
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(45deg, ${accent}08 25%, transparent 25%, transparent 50%, ${accent}08 50%, ${accent}08 75%, transparent 75%, transparent)`, backgroundSize: '60px 60px' }} />
          )}
          {userClass === "strategist" && (
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${accent}05 1px, transparent 1px), linear-gradient(90deg, ${accent}05 1px, transparent 1px)`, backgroundSize: '15px 15px' }} />
          )}
          {userClass === "catalyst" && (
            <div className="absolute inset-0" style={{ background: `radial-gradient(circle at 70% 30%, ${accent}15 0%, transparent 70%)` }} />
          )}
        </div>

        <div className="relative h-full flex flex-col p-4 sm:p-6">
          {/* Top Header */}
          <div className="flex justify-between items-start mb-2">
            <div className="space-y-0.5">
              <span className="text-[8px] font-black uppercase text-zinc-500">Hashcode_Passport_v2</span>
              <div className="flex items-center gap-1.5">
                <div className="size-1 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[8px] font-mono text-white/60 uppercase tracking-wider">Authorized_Access</span>
              </div>
            </div>
            <div className="text-right">
               <div className="text-[8px] font-mono text-zinc-600 uppercase">ID_Ref</div>
               <div className="text-[10px] font-black font-mono" style={{ color: accent }}>{passportId}</div>
            </div>
          </div>

          {/* Main Body */}
          <div className="flex flex-1 gap-4 sm:gap-6 items-center">
            {/* Avatar Cluster */}
            <div className="relative shrink-0">
              <div className="size-20 sm:size-24 rounded-2xl bg-zinc-900 border-2 overflow-hidden rotate-2 group-hover:rotate-0 transition-transform duration-700" style={{ borderColor: `${accent}60` }}>
                 <div className="w-full h-full flex items-center justify-center text-3xl sm:text-4xl font-black text-white/10 bg-linear-to-br from-white/5 to-transparent uppercase">
                   {pseudo.charAt(0)}
                 </div>
              </div>
              <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 bg-white text-black text-[7px] font-black uppercase tracking-tighter -rotate-2">
                Verified
              </div>
            </div>

            {/* Info Grid */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="space-y-0.5">
                <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tighter italic truncate">
                  {pseudo}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-bold text-zinc-400 uppercase tracking-wider">
                    {classLabel}
                  </span>
                  <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-wider">Grade__{levelName}</span>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4 sm:gap-6 border-t border-white/5 pt-3">
                <div className="space-y-0.5">
                  <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-wide block">Impact_</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black text-white">{missionsCompleted}</span>
                    <span className="text-[7px] font-bold text-zinc-500 uppercase">Ops</span>
                  </div>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-wide block">Trust_</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base font-black" style={{ color: accent }}>{Math.round(confidenceScore * 100)}%</span>
                  </div>
                </div>
                <div className="hidden sm:block space-y-0.5 flex-1">
                  <span className="text-[7px] font-mono text-zinc-600 uppercase tracking-wide block">Top_Arsenal_</span>
                  <div className="flex gap-1.5 mt-1 truncate">
                    {tools.slice(0, 2).map(t => (
                      <span key={t} className="text-[7px] font-bold text-zinc-400 border border-white/10 px-1.5 py-0.5 rounded uppercase">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bar */}
          <div className="mt-2 pt-2 flex justify-between items-end border-t border-white/5">
             <div className="space-y-0.5">
               <div className="text-[6px] font-mono text-zinc-700 uppercase">Issued_Date</div>
               <div className="text-[8px] font-bold text-zinc-500 font-mono italic uppercase">{joinDate}</div>
             </div>
             <div className="flex items-center gap-3">
               <div className="text-right hidden sm:block">
                 <div className="text-[6px] font-mono text-zinc-700 uppercase">Verification_Protocol</div>
                 <div className="text-[8px] font-bold text-zinc-500 font-mono">STATUS_SYNCHRONIZED</div>
               </div>
               <div className="p-1 bg-white rounded-md">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=50x50&color=000000&bgcolor=FFFFFF&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || "https://joinhashcode.com"}/dossier`)}`}
                    width={24}
                    height={24}
                    alt="QR"
                    className="opacity-90"
                  />
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
        <Button
          asChild
          variant="outline"
          className="rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 text-[10px] font-bold uppercase tracking-wider h-14"
        >
          <a href={cardUrl} download={`hashcode-passport-${pseudo}.png`}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          className="rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 text-[10px] font-bold uppercase tracking-wider h-14"
        >
          {copied ? <Check className="mr-2 h-4 w-4 text-emerald-500" /> : <Share2 className="mr-2 h-4 w-4" />}
          {copied ? "Copié !" : "Partager"}
        </Button>
      </div>
    </div>
  );
}
