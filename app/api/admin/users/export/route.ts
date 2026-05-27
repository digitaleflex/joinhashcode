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

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        pseudo: true,
        role: true,
        class: true,
        level: true,
        experience: true,
        builderScore: true,
        creatorScore: true,
        strategistScore: true,
        catalystScore: true,
        confidenceScore: true,
        profileDrift: true,
        missionsCompletedCount: true,
        currentStreak: true,
        createdAt: true,
        city: true,
        country: true,
        technicalLevel: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Simple CSV conversion
    const headers = Object.keys(users[0] || {}).join(",");
    const rows = users.map(user => 
      Object.values(user)
        .map(val => {
            if (val === null || val === undefined) return "";
            if (typeof val === 'string') return `"${val.replace(/"/g, '""')}"`;
            if (val instanceof Date) return val.toISOString();
            return val;
        })
        .join(",")
    );
    
    const csv = [headers, ...rows].join("\n");

    await logActivity({
      userId: admin.id,
      action: "ADMIN_USER_EXPORTED",
      metadata: { count: users.length, format: "csv" },
      request: req
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=hashcode-users-export-${new Date().toISOString().split('T')[0]}.csv`,
      },
    });
  } catch (error) {
    console.error("[ADMIN_USERS_EXPORT_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
