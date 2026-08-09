import { checkAdmin } from "@/lib/admin-auth";
import { logActivity } from "@/lib/activity-log";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { formatYYYYMMDD } from "@/lib/dates";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function GET(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id);
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const usersData = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        pseudo: true,
        role: true,
        class: true,
        createdAt: true,
        city: true,
        country: true,
        technicalLevel: true,
      builderScore: true,
      creatorScore: true,
      strategistScore: true,
      catalystScore: true,
      currentStreak: true,
      level: true,
      experience: true,
      missionsCompletedCount: true,
      banned: true,
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
      level: u.level ?? 1,
      experience: u.experience ?? 0,
      builderScore: u.builderScore ?? 0,
      creatorScore: u.creatorScore ?? 0,
      strategistScore: u.strategistScore ?? 0,
      catalystScore: u.catalystScore ?? 0,
      missionsCompletedCount: u.missionsCompletedCount ?? 0,
      currentStreak: u.currentStreak ?? 0,
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

    logActivity({
      userId: admin.id,
      action: "ADMIN_USER_EXPORTED",
      metadata: { count: users.length, format: "csv" },
      request: req
    });

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename=hashcode-users-export-${formatYYYYMMDD()}.csv`,
      },
    });
  } catch (error) {
    console.error("[ADMIN_USERS_EXPORT_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
