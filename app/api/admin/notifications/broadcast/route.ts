import { auth } from "@/lib/auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN", "MODERATOR"].includes(user.role)) return null;

  return session.user;
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { title, message, type = "SYSTEM", link = null } = await req.json();

    if (!title || !message) {
      return NextResponse.json({ message: "Missing title or message" }, { status: 400 });
    }

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

    await logActivity({
      userId: admin.id,
      action: "ADMIN_BROADCAST_SENT",
      metadata: { title, type, count: users.length },
      request: req
    });

    return NextResponse.json({ count: users.length });
  } catch (error) {
    console.error("[ADMIN_NOTIFICATIONS_BROADCAST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
