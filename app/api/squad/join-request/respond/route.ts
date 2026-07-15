import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { updateSquadCohesion } from "@/lib/squad-logic";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const body = await req.json();
    const { requestId, action } = body;
    if (!requestId || !action) return NextResponse.json({ error: "requestId et action requis" }, { status: 400 });
    if (action !== "accept" && action !== "reject") return NextResponse.json({ error: "action doit être accept ou reject" }, { status: 400 });

    const request = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { organization: { include: { _count: { select: { members: true } } } } },
    });
    if (!request || request.status !== "PENDING") return NextResponse.json({ error: "Demande introuvable ou déjà traitée" }, { status: 404 });

    // Vérifier que l'utilisateur est leader de cette org
    const member = await prisma.member.findFirst({
      where: { userId: session.user.id, organizationId: request.organizationId, role: "LEADER" },
    });
    if (!member) return NextResponse.json({ error: "Seul le leader peut répondre aux demandes" }, { status: 403 });

    if (action === "accept") {
      if (request.organization._count.members >= 5) {
        await prisma.joinRequest.update({ where: { id: requestId }, data: { status: "REJECTED" } });
        return NextResponse.json({ error: "Escouade complète (5/5)" }, { status: 400 });
      }

      // Vérifier que l'utilisateur n'est pas déjà dans une autre escouade (userId est @unique)
      const existingAnywhere = await prisma.member.findFirst({
        where: { userId: request.userId },
      });
      if (existingAnywhere) {
        await prisma.joinRequest.update({ where: { id: requestId }, data: { status: "REJECTED" } });
        return NextResponse.json({ error: "Cet utilisateur est déjà dans une escouade" }, { status: 400 });
      }

      await prisma.$transaction([
        prisma.joinRequest.update({ where: { id: requestId }, data: { status: "ACCEPTED" } }),
        prisma.member.create({
          data: {
            id: crypto.randomUUID(),
            userId: request.userId,
            organizationId: request.organizationId,
            role: "member",
            createdAt: new Date(),
          },
        }),
      ]);

      await updateSquadCohesion(request.organizationId, 0.05);
    } else {
      await prisma.joinRequest.update({ where: { id: requestId }, data: { status: "REJECTED" } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[JOIN_REQUEST_RESPOND]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
