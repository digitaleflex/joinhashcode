import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";

const ALLOWED_ADMIN_ACTIONS = [
  "ADMIN_ROLE_UPDATED",
  "ADMIN_USER_BANNED",
  "ADMIN_USER_UNBANNED",
  "ADMIN_USER_IMPERSONATED",
];

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, id: true },
  });

  if (!admin || !["ADMIN", "MODERATOR"].includes(admin.role)) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  try {
    const { action, entityId, metadata } = await req.json();

    if (!ALLOWED_ADMIN_ACTIONS.includes(action)) {
      return NextResponse.json({ message: "Action non autorisée via ce terminal." }, { status: 400 });
    }

    await logActivity({
      userId: admin.id,
      action,
      entityId,
      metadata,
      request: req
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_LOG_API_ERROR]", error);
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}
