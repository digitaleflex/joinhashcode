"use client";

import { Download, Share2, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
  const memberNum = memberNumber ? String(memberNumber).padStart(4, "0") : "----";
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
    <div className={cn("max-w-md mx-auto w-full space-y-6", className)}>
      {/* Card visual - Vertical Format */}
      <div
        className="relative w-full overflow-hidden rounded-[2.5rem] border-2 shadow-2xl transition-all duration-500 hover:shadow-[0_0_50px_rgba(var(--primary),0.1)] group"
        style={{
          background: "#050505",
          borderColor: `${accent}40`,
          aspectRatio: "3 / 4.2",
        }}
      >
        {/* GUILD SPECIFIC PATTERNS */}
        <div className="absolute inset-0 opacity-20">
          {userClass === "builder" && (
            <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(${accent}20 1px, transparent 1px)`, backgroundSize: '20px 20px' }} />
          )}
          {userClass === "creator" && (
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(45deg, ${accent}10 25%, transparent 25%, transparent 50%, ${accent}10 50%, ${accent}10 75%, transparent 75%, transparent)`, backgroundSize: '40px 40px' }} />
          )}
          {userClass === "strategist" && (
            <div className="absolute inset-0" style={{ backgroundImage: `linear-gradient(${accent}05 1px, transparent 1px), linear-gradient(90deg, ${accent}05 1px, transparent 1px)`, backgroundSize: '10px 10px' }} />
          )}
          {userClass === "catalyst" && (
            <div className="absolute inset-0 rounded-full" style={{ background: `radial-gradient(circle at 50% 50%, ${accent}15 0%, transparent 70%)` }} />
          )}
        </div>

        {/* Top Header - Grade */}
        <div className="relative p-8 flex justify-between items-center border-b border-white/5 bg-white/[0.02] backdrop-blur-md">
          <div className="space-y-0.5">
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-500">Hashcode_System</span>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              <span className="text-[11px] font-mono font-bold text-white uppercase tracking-widest">Active_Protocol</span>
            </div>
          </div>
          <div className="text-right">
             <div className="text-[10px] font-mono text-zinc-500 uppercase">Passport_No</div>
             <div className="text-sm font-black font-mono italic" style={{ color: accent }}>#{memberNum}</div>
          </div>
        </div>

        <div className="relative h-full flex flex-col p-8 pb-12">
          {/* Identity Section */}
          <div className="flex flex-col items-center text-center mt-4 mb-8">
            <div className="relative mb-6">
              <div className="size-32 rounded-3xl bg-zinc-900 border-2 overflow-hidden rotate-3 group-hover:rotate-0 transition-transform duration-700" style={{ borderColor: `${accent}60` }}>
                 <div className="w-full h-full flex items-center justify-center text-5xl font-black text-white/10 bg-linear-to-br from-white/5 to-transparent">
                   {pseudo.charAt(0).toUpperCase()}
                 </div>
              </div>
              <div className="absolute -bottom-2 -right-2 px-3 py-1 bg-white text-black text-[9px] font-black uppercase tracking-tighter -rotate-3">
                Verified
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-white uppercase tracking-tighter italic mb-1">
              {pseudo}
            </h3>
            <div className="inline-flex px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-400 uppercase tracking-widest">
              {classLabel} // LEVEL_{level}
            </div>
          </div>

          {/* Stats Area */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Impact_</span>
              <div className="flex items-end gap-1">
                <span className="text-xl font-black text-white">{missionsCompleted}</span>
                <span className="text-[9px] font-bold text-zinc-500 mb-1">MISSIONS</span>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest block">Reliability_</span>
              <div className="flex items-end gap-1">
                <span className="text-xl font-black" style={{ color: accent }}>{Math.round(confidenceScore * 100)}%</span>
                <span className="text-[9px] font-bold text-zinc-500 mb-1">TRUST</span>
              </div>
            </div>
          </div>

          {/* XP & Skills */}
          <div className="space-y-6 flex-1">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Progression_Radar</span>
                <span className="text-[10px] font-bold text-white font-mono">{experience}XP</span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden p-[1px]">
                <div 
                  className="h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                  style={{ width: `${xpPct}%`, background: accent }}
                />
              </div>
            </div>

            <div className="space-y-2">
               <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-widest">Top_Arsenal</span>
               <div className="flex flex-wrap gap-1.5">
                  {tools.length > 0 ? tools.slice(0, 3).map(tool => (
                    <span key={tool} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[9px] font-bold text-zinc-300">
                      {tool.toUpperCase()}
                    </span>
                  )) : (
                    <span className="text-[9px] font-mono text-zinc-700 italic">No tools deployed...</span>
                  )}
               </div>
            </div>
          </div>

          {/* Footer - Date & QR */}
          <div className="mt-auto pt-8 flex justify-between items-end border-t border-white/5">
             <div className="space-y-1">
               <div className="text-[8px] font-mono text-zinc-600 uppercase tracking-widest">Issued_Date</div>
               <div className="text-xs font-bold text-zinc-400 font-mono">{joinDate.toUpperCase()}</div>
             </div>
             <div className="p-1.5 bg-white rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&color=000000&bgcolor=FFFFFF&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_APP_URL || "https://joinhashcode.com"}/dossier`)}`}
                  width={50}
                  height={50}
                  alt="QR Validation"
                  className="opacity-90"
                />
             </div>
          </div>
        </div>

        {/* Magnetic Stripe / Tech Bar at the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button
          asChild
          variant="outline"
          className="rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 text-xs font-bold uppercase tracking-widest h-12"
        >
          <a href={cardUrl} download={`hashcode-passport-${pseudo}.png`}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </a>
        </Button>
        <Button
          variant="outline"
          onClick={handleCopy}
          className="rounded-2xl border-white/5 bg-white/[0.02] hover:bg-white/5 hover:border-white/10 text-xs font-bold uppercase tracking-widest h-12"
        >
          {copied ? <Check className="mr-2 h-4 w-4 text-emerald-500" /> : <Share2 className="mr-2 h-4 w-4" />}
          {copied ? "Synchronisé" : "Partager"}
        </Button>
      </div>
    </div>
  );
}
