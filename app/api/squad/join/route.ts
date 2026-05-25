import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { slug } = await req.json();
    if (!slug) return new NextResponse("Slug missing", { status: 400 });

    const userId = session.user.id;

    // Find the squad
    const squad = await prisma.guild.findUnique({
      where: { slug },
      include: { members: true }
    });

    if (!squad) return new NextResponse("Escouade introuvable", { status: 404 });

    // Check if full
    if (squad.members.length >= 5) {
      return NextResponse.json({ error: "Cette escouade est déjà complète (max 5)." }, { status: 400 });
    }

    // Check if already in a squad
    const existingMember = await prisma.guildMember.findFirst({
      where: { userId }
    });

    if (existingMember) {
      return NextResponse.json({ error: "Tu es déjà membre d'une escouade." }, { status: 400 });
    }

    // Join
    await prisma.guildMember.create({
      data: {
        userId,
        guildId: squad.id,
        role: "MEMBER"
      }
    });

    logActivity({
      userId,
      action: "SQUAD_JOINED",
      entity: "squad",
      entityId: squad.id,
      metadata: { slug: squad.slug, memberCount: squad.members.length + 1 },
      request: req,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SQUAD_JOIN]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
