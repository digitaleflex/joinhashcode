export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Direct join by guildId (public squads — no approval flow, subject to 5-member cap)
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { organizationId: guildId } = await req.json();
    if (!guildId) return new NextResponse("Guild ID missing", { status: 400 });

    const existing = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
    });
    if (existing) {
      return NextResponse.json({ message: "Tu es déjà membre d'une escouade." }, { status: 400 });
    }

    const memberCount = await prisma.guildMember.count({ where: { guildId } });
    if (memberCount >= 5) {
      return NextResponse.json({ message: "Escouade déjà complète (max 5)." }, { status: 400 });
    }

    const guild = await prisma.guild.findUnique({ where: { id: guildId } });
    if (!guild) return new NextResponse("Squad not found", { status: 404 });

    const member = await prisma.guildMember.create({
      data: { userId: session.user.id, guildId, role: "MEMBER" },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error("[SQUAD_JOIN_REQUEST_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Returns pending members for this guild (LEADER only)
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const guildId = searchParams.get("organizationId");
    if (!guildId) return new NextResponse("Guild ID missing", { status: 400 });

    const leadership = await prisma.guildMember.findFirst({
      where: { guildId, userId: session.user.id, role: "LEADER" },
    });
    if (!leadership) return new NextResponse("Forbidden", { status: 403 });

    const members = await prisma.guildMember.findMany({
      where: { guildId },
      include: {
        user: { select: { id: true, name: true, image: true, level: true, class: true } },
      },
      orderBy: { joinedAt: "desc" },
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error("[SQUAD_JOIN_REQUEST_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
