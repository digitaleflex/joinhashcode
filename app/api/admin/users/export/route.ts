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
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const usersData = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        pseudo: true,
        role: true,
        class: true,
        level: true,
        experience: true,
        missionsCompletedCount: true,
        createdAt: true,
        city: true,
        country: true,
        technicalLevel: true,
        psychometrics: {
          select: {
            builderScore: true,
            creatorScore: true,
            strategistScore: true,
            catalystScore: true,
            confidenceScore: true,
          }
        },
        stats: {
          select: {
            currentStreak: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const users = usersData.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      pseudo: u.pseudo,
      role: u.role,
      class: u.class,
      level: u.level,
      experience: u.experience,
      builderScore: u.psychometrics?.builderScore ?? 0,
      creatorScore: u.psychometrics?.creatorScore ?? 0,
      strategistScore: u.psychometrics?.strategistScore ?? 0,
      catalystScore: u.psychometrics?.catalystScore ?? 0,
      confidenceScore: u.psychometrics?.confidenceScore ?? 0.25,
      missionsCompletedCount: u.missionsCompletedCount,
      currentStreak: u.stats?.currentStreak ?? 0,
      createdAt: u.createdAt,
      city: u.city,
      country: u.country,
      technicalLevel: u.technicalLevel,
    }));

    // Simple CSV conversion with Fix SEC-009: Formula Injection Protection
    const headers = Object.keys(users[0] || {}).join(",");
    const rows = users.map(user => 
      Object.values(user)
        .map(val => {
            if (val === null || val === undefined) return "";
            if (val instanceof Date) return val.toISOString();
            if (typeof val !== "string") return String(val);
            
            // Neutralize formula injection: prefix with single quote if starts with sensitive chars
            const safeVal = /^[=+\-@\t\r]/.test(val) ? `'${val}` : val;
            return `"${safeVal.replace(/"/g, '""')}"`;
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
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
