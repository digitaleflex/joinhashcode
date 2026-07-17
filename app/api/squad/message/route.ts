export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit";
import { logActivity } from "@/lib/activity-log";
import { squadMessageSchema } from "@/lib/validation";

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId requis" }, { status: 400 });
    }

    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id, organizationId },
    });
    if (!membership) {
      return NextResponse.json({ error: "Tu n'es pas membre de cette escouade" }, { status: 403 });
    }

    const messages = await prisma.squadMessage.findMany({
      where: { organizationId },
      include: {
        user: { select: { id: true, name: true, image: true, pseudo: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ messages: messages.reverse() });
  } catch (error: unknown) {
    console.error("[SQUAD_MESSAGE_GET]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const { limited } = await checkRateLimit(mutationLimiter, `msg:${session.user.id}`);
    if (limited) return NextResponse.json({ message: "Trop de requêtes" }, { status: 429 });

    const body = await req.json();
    const parsed = squadMessageSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "content et organizationId requis" }, { status: 400 });
    }
    const { content, organizationId } = parsed.data;

    const membership = await prisma.member.findFirst({
      where: { userId: session.user.id, organizationId },
    });
    if (!membership) {
      return NextResponse.json({ error: "Tu n'es pas membre de cette escouade" }, { status: 403 });
    }

    const message = await prisma.squadMessage.create({
      data: {
        content: content.trim(),
        userId: session.user.id,
        organizationId,
      },
      include: {
        user: { select: { id: true, name: true, image: true, pseudo: true } },
      },
    });

    logActivity({
      userId: session.user.id,
      action: "SQUAD_MESSAGE_SENT",
      entity: "squad_message",
      entityId: message.id,
      metadata: { organizationId },
      request: req,
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error: unknown) {
    console.error("[SQUAD_MESSAGE_POST]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

    const message = await prisma.squadMessage.findUnique({ where: { id } });
    if (!message) return NextResponse.json({ error: "Message introuvable" }, { status: 404 });

    const isAuthor = message.userId === session.user.id;
    const isAdmin = ["ADMIN", "MODERATOR"].includes(session.user.role);
    const isOrgLeader = await prisma.member.findFirst({
      where: { userId: session.user.id, organizationId: message.organizationId, role: "owner" },
    });

    if (!isAuthor && !isAdmin && !isOrgLeader) {
      return NextResponse.json({ error: "Non autorisé à supprimer ce message" }, { status: 403 });
    }

    await prisma.squadMessage.delete({ where: { id } });

    logActivity({
      userId: session.user.id,
      action: "SQUAD_MESSAGE_DELETED",
      entity: "squad_message",
      entityId: id,
      metadata: { organizationId: message.organizationId },
      request: req,
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("[SQUAD_MESSAGE_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne du serveur" }, { status: 500 });
  }
}
