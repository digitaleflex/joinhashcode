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
    <div className={cn("space-y-4", className)}>
      {/* Card visual */}
      <div
        className="relative w-full overflow-hidden rounded-2xl border"
        style={{
          background: "#09090B",
          borderColor: `${accent}30`,
          aspectRatio: "1200/630",
        }}
      >
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />

        {/* Glow */}
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full"
          style={{ background: `radial-gradient(circle, ${accent}15 0%, transparent 70%)` }}
        />

        <div className="relative h-full flex flex-col justify-between p-6 sm:p-8">
          {/* Top */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase" style={{ color: accent }}>
                HASHCODE
              </span>
              <span className="text-[9px] text-zinc-600 tracking-widest uppercase">Carte de Membre</span>
            </div>
            <span className="font-mono text-sm sm:text-lg font-bold" style={{ color: accent }}>
              #{memberNum}
            </span>
          </div>

          {/* Center */}
          <div className="flex flex-col gap-2 sm:gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[9px] sm:text-[11px] font-bold tracking-[0.2em] px-2 sm:px-3 py-1 rounded-md"
                style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}40` }}
              >
                {classLabel}
              </span>
              <span className="text-zinc-600 text-xs">·</span>
              <span className="text-zinc-500 text-[9px] sm:text-[11px] tracking-widest uppercase">
                Niv. {level} — {levelName}
              </span>
            </div>

            <span className="text-white font-bold tracking-tight leading-none text-2xl sm:text-4xl md:text-5xl">
              {pseudo}
            </span>

            {/* XP bar */}
            <div className="flex flex-col gap-1.5 mt-1">
              <div className="flex justify-between">
                <span className="text-[9px] text-zinc-600 tracking-widest uppercase">Expérience</span>
                <span className="text-[9px] text-zinc-500 font-mono">{experience} / {xpMax} XP</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${xpPct}%`, background: `linear-gradient(90deg, ${accent}99, ${accent})` }}
                />
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex justify-between items-end">
            <div className="flex flex-col gap-0.5">
              <span className="text-[8px] text-zinc-700 tracking-widest uppercase">Membre depuis</span>
              <span className="text-zinc-500 text-xs sm:text-sm font-medium">{joinDate}</span>
            </div>
            {/* QR placeholder on small screens, real QR on larger */}
            <div
              className="rounded-xl p-1.5 hidden sm:flex items-center justify-center"
              style={{ border: `1px solid ${accent}25`, background: "#09090B" }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=60x60&color=${accent.replace("#", "")}&bgcolor=09090B&data=${encodeURIComponent(typeof window !== "undefined" ? `${window.location.origin}/dossier` : "https://joinhashcode.com/dossier")}`}
                width={52}
                height={52}
                alt="QR dossier"
                className="rounded"
              />
            </div>
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="flex-1 gap-2 border-zinc-800 hover:border-zinc-600"
        >
          <a href={cardUrl} download={`hashcode-carte-${pseudo}.png`}>
            <Download className="h-3.5 w-3.5" />
            Télécharger
          </a>
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex-1 gap-2 border-zinc-800 hover:border-zinc-600"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Share2 className="h-3.5 w-3.5" />}
          {copied ? "Copié !" : "Partager"}
        </Button>
      </div>
    </div>
  );
}
