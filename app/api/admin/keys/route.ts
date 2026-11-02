import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { logActivity } from "@/lib/activity-log";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";
import { adminKeyGenSchema } from "@/lib/validation";

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const keys = await prisma.betaKey.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(keys);
  } catch (error) {
    console.error("[ADMIN_KEYS_GET]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const body = await req.json();
    const parsed = adminKeyGenSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ message: "Paramètres invalides." }, { status: 400 });
    }
    const { count, prefix } = parsed.data;

    const keysToCreate = Array.from({ length: count }).map(() => ({
      key: `${prefix}${randomBytes(16).toString('hex').toUpperCase()}`,
    }));

    const createdKeys = await Promise.all(
      keysToCreate.map(data => prisma.betaKey.create({ data }))
    );

    logActivity({
      userId: admin.id,
      action: "ADMIN_BETA_KEY_GENERATED",
      metadata: { count, prefix },
      request: req
    });

    return NextResponse.json(createdKeys);
  } catch (error) {
    console.error("[ADMIN_KEYS_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
