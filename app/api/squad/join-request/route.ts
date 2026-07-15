import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    if (!organizationId) return NextResponse.json({ error: "organizationId requis" }, { status: 400 });

    // Vérifier que l'utilisateur est leader de cette org
    const member = await prisma.member.findFirst({
      where: { userId: session.user.id, organizationId, role: "LEADER" },
    });
    if (!member) return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

    const requests = await prisma.joinRequest.findMany({
      where: { organizationId, status: "PENDING" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            pseudo: true,
            image: true,
            class: true,
            progress: { select: { level: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("[JOIN_REQUEST_GET]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const { organizationId } = body;
    if (!organizationId) return NextResponse.json({ error: "organizationId requis" }, { status: 400 });

    // Vérifier que l'org existe
    const org = await prisma.organization.findUnique({
      where: { id: organizationId },
      include: { _count: { select: { members: true } } },
    });
    if (!org) return NextResponse.json({ error: "Escouade introuvable" }, { status: 404 });

    // Vérifier que l'utilisateur n'est pas déjà membre
    const existingMember = await prisma.member.findFirst({
      where: { userId: session.user.id, organizationId },
    });
    if (existingMember) return NextResponse.json({ error: "Tu es déjà membre de cette escouade" }, { status: 409 });

    // Vérifier que l'escouade n'est pas complète
    if (org._count.members >= 5) return NextResponse.json({ error: "Escouade complète (5/5)" }, { status: 400 });

    // Vérifier qu'il n'y a pas déjà une demande en attente
    const existingRequest = await prisma.joinRequest.findUnique({
      where: { userId_organizationId: { userId: session.user.id, organizationId } },
    });
    if (existingRequest?.status === "PENDING") return NextResponse.json({ error: "Demande déjà envoyée" }, { status: 409 });

    // Upsert: si rejetée avant, on réactive
    const request = await prisma.joinRequest.upsert({
      where: { userId_organizationId: { userId: session.user.id, organizationId } },
      update: { status: "PENDING", ipAddress: req.headers.get("x-forwarded-for") ?? undefined, userAgent: req.headers.get("user-agent") ?? undefined },
      create: {
        organizationId,
        userId: session.user.id,
        ipAddress: req.headers.get("x-forwarded-for") ?? undefined,
        userAgent: req.headers.get("user-agent") ?? undefined,
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    console.error("[JOIN_REQUEST_POST]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
