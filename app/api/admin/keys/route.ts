import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { logActivity } from "@/lib/activity-log";

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

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const keys = await prisma.betaKey.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(keys);
  } catch (_) {
    console.error("[ADMIN_KEYS_GET]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const { count = 1, prefix = "H26-" } = await req.json();
    
    const keysToCreate = Array.from({ length: count }).map(() => ({
      key: `${prefix}${randomBytes(16).toString('hex').toUpperCase()}`,
    }));

    const createdKeys = await Promise.all(
      keysToCreate.map(data => prisma.betaKey.create({ data }))
    );

    await logActivity({
      userId: admin.id,
      action: "ADMIN_BETA_KEY_GENERATED",
      metadata: { count, prefix },
      request: req
    });

    return NextResponse.json(createdKeys);
  } catch (_) {
    console.error("[ADMIN_KEYS_POST]", error);
    return NextResponse.json({ message: "Internal Error" }, { status: 500 });
  }
}
