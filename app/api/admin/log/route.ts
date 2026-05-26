import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return new NextResponse("Unauthorized", { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, id: true },
  });

  if (!admin || !["ADMIN", "MODERATOR"].includes(admin.role)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  try {
    const { action, entityId, metadata } = await req.json();

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
    return new NextResponse("Error", { status: 500 });
  }
}
