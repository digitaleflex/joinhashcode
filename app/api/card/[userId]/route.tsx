import { ImageResponse } from "next/og";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CLASS_COLORS, LEVEL_NAMES, XP_MAX, type ProfileType } from "@/lib/member-card-constants";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return new NextResponse("Non autorisé", { status: 401 });

  const { userId } = await params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      memberNumber: true,
      pseudo: true,
      name: true,
      class: true,
      createdAt: true,
      progress: { select: { level: true, experience: true } },
    },
  });

  if (!user) {
    return new Response("Non trouvé", { status: 404 });
  }

  const accent = CLASS_COLORS[(user.class ?? "builder") as ProfileType] ?? "#B8FF3B";
  const userLevel = user.progress?.level ?? 1;
  const userXp = user.progress?.experience ?? 0;
  const levelName = LEVEL_NAMES[userLevel] ?? "INIT";
  const xpMax = XP_MAX[userLevel] ?? 100;
  const xpPct = Math.min(100, Math.round((userXp / xpMax) * 100));
  const pseudo = user.pseudo ?? user.name ?? "MEMBRE";
  const memberNum = user.memberNumber
    ? String(user.memberNumber).padStart(4, "0")
    : "----";
  const joinDate = new Date(user.createdAt).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  const classLabel = (user.class ?? "BUILDER").toUpperCase();
  const dossierUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://joinhashcode.com"}/dossier`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=80x80&color=${accent.replace("#", "")}&bgcolor=09090B&data=${encodeURIComponent(dossierUrl)}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#09090B",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 72px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `linear-gradient(${accent}08 1px, transparent 1px), linear-gradient(90deg, ${accent}08 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        {/* Accent glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
          }}
        />

        {/* Top row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              HASHCODE
            </span>
            <span style={{ color: "#3f3f46", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase" }}>
              Carte de Membre
            </span>
          </div>
          <span style={{ color: accent, fontSize: 22, fontWeight: 700, fontFamily: "monospace", letterSpacing: "0.05em" }}>
            #{memberNum}
          </span>
        </div>

        {/* Center — identity */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            {/* Class badge */}
            <div
              style={{
                background: `${accent}18`,
                border: `1.5px solid ${accent}40`,
                borderRadius: 10,
                padding: "8px 20px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ color: accent, fontSize: 13, fontWeight: 700, letterSpacing: "0.25em" }}>
                {classLabel}
              </span>
            </div>
            <span style={{ color: "#52525b", fontSize: 13, letterSpacing: "0.15em" }}>·</span>
            <span style={{ color: "#71717a", fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              NIV. {userLevel} — {levelName}
            </span>
          </div>

          <span style={{ color: "#ffffff", fontSize: 64, fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1 }}>
            {pseudo}
          </span>

          {/* XP bar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "#52525b", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                Expérience
              </span>
              <span style={{ color: "#71717a", fontSize: 11, fontFamily: "monospace" }}>
                {userXp} / {xpMax} XP
              </span>
            </div>
            <div style={{ width: "100%", height: 6, background: "#27272a", borderRadius: 999, display: "flex" }}>
              <div
                style={{
                  width: `${xpPct}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${accent}cc, ${accent})`,
                  borderRadius: 999,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ color: "#3f3f46", fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              Membre depuis
            </span>
            <span style={{ color: "#71717a", fontSize: 14, fontWeight: 500 }}>
              {joinDate}
            </span>
          </div>

          {/* QR code */}
          <div
            style={{
              background: "#09090B",
              border: `1px solid ${accent}30`,
              borderRadius: 12,
              padding: 10,
              display: "flex",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} width={72} height={72} alt="QR" />
          </div>
        </div>

        {/* Bottom accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
