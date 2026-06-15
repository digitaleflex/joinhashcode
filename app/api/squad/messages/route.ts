export const dynamic = 'force-dynamic';
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string().min(1).max(500),
});

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Get user's squad
    const member = await prisma.member.findUnique({
      where: { userId },
      select: { organizationId: true }
    });

    if (!member) {
      return NextResponse.json({ error: "Tu n'es membre d'aucune escouade." }, { status: 403 });
    }

    // 2. Fetch last 50 messages
    const messages = await (prisma as any).squadMessage.findMany({
      where: { organizationId: member.organizationId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            pseudo: true,
            image: true,
            class: true
          }
        }
      }
    });

    // Reverse for UI (oldest to newest)
    return NextResponse.json({ messages: messages.reverse() });
  } catch (error: unknown) {
    console.error("[SQUAD_MESSAGES_GET]", error);
    return NextResponse.json({ error: "Erreur système." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json().catch(() => ({}));
    const validated = messageSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json({ error: "Message invalide (max 500 caractères)." }, { status: 400 });
    }

    // 1. Get user's squad
    const member = await prisma.member.findUnique({
      where: { userId },
      select: { organizationId: true }
    });

    if (!member) {
      return NextResponse.json({ error: "Tu dois être dans une escouade pour envoyer des messages." }, { status: 403 });
    }

    // 2. Create message
    const message = await (prisma as any).squadMessage.create({
      data: {
        content: validated.data.content,
        userId,
        organizationId: member.organizationId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            pseudo: true,
            image: true,
            class: true
          }
        }
      }
    });

    return NextResponse.json({ message });
  } catch (error: unknown) {
    console.error("[SQUAD_MESSAGES_POST]", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi." }, { status: 500 });
  }
}
