export const dynamic = 'force-dynamic'
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { requireSession, AuthError } from "@/lib/auth-guard";

export async function GET(req: NextRequest) {
  try {
    const session = await requireSession();

    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";
    const tab = searchParams.get("tab") || "inbox"; // inbox, saved, done
    const unreadOnly = searchParams.get("unread") === "true";
    const typeFilter = searchParams.get("type");
    const search = searchParams.get("search");

    // Construction des filtres de recherche Prisma
    const whereClause: any = {
      userId: session.user.id,
    };

    // Filtrage par onglet (Inbox, Saved, Done)
    if (tab === "saved") {
      whereClause.isSaved = true;
      whereClause.isArchived = false;
    } else if (tab === "done") {
      whereClause.isArchived = true;
    } else {
      // inbox par défaut
      whereClause.isArchived = false;
    }

    // Filtrage par non lu uniquement
    if (unreadOnly) {
      whereClause.isRead = false;
    }

    // Filtrage par type
    if (typeFilter) {
      whereClause.type = typeFilter;
    }

    // Filtrage par recherche textuelle (titre ou message)
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { message: { contains: search, mode: "insensitive" } },
      ];
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: all ? 100 : 10, // Charge plus de notifications pour la vue complète
    });

    // Calcul du nombre de notifications non lues globales (toujours dans l'inbox)
    const unreadCount = await prisma.notification.count({
      where: { 
        userId: session.user.id, 
        isRead: false,
        isArchived: false
      },
    });

    return NextResponse.json({ notifications, unreadCount }, { headers: { "Cache-Control": "private, no-cache" } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("[USER_NOTIFICATIONS]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireSession();
    const body = await req.json().catch(() => ({}));
    const { ids, isRead, isSaved, isArchived, readAll, archiveAll } = body;

    // Actions globales de masse
    if (readAll) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (archiveAll) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, isArchived: false },
        data: { isArchived: true },
      });
      return NextResponse.json({ success: true });
    }

    // Mise à jour de notifications spécifiques
    if (Array.isArray(ids) && ids.length > 0) {
      const updateData: any = {};
      if (typeof isRead === "boolean") updateData.isRead = isRead;
      if (typeof isSaved === "boolean") updateData.isSaved = isSaved;
      if (typeof isArchived === "boolean") updateData.isArchived = isArchived;

      await prisma.notification.updateMany({
        where: {
          userId: session.user.id,
          id: { in: ids },
        },
        data: updateData,
      });

      return NextResponse.json({ success: true });
    }

    // Comportement par défaut historique : marquer tout comme lu
    await prisma.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
