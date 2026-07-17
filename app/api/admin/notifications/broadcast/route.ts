import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";
import { adminBroadcastSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const body = await req.json();
    const parsed = adminBroadcastSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Missing or invalid title/message" }, { status: 400 });
    }
    const { title, message, type, link } = parsed.data;

    const users = await prisma.user.findMany({
      select: { id: true }
    });

    const notifications = users.map(user => ({
      userId: user.id,
      title,
      message,
      type,
      link
    }));

    await prisma.notification.createMany({
      data: notifications
    });

    logActivity({
      userId: admin.id,
      action: "ADMIN_BROADCAST_SENT",
      metadata: { title, type, count: users.length },
      request: req
    });

    return NextResponse.json({ count: users.length });
  } catch (error) {
    console.error("[ADMIN_NOTIFICATIONS_BROADCAST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
