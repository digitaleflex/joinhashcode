import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { logActivity } from "@/lib/activity-log";
import { adminOpsLimiter, checkRateLimit } from "@/lib/ratelimit";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const { limited } = await checkRateLimit(adminOpsLimiter, admin.id, { failClosed: true });
  if (limited) return NextResponse.json({ message: "Trop d'opérations. Réessaie dans une heure." }, { status: 429 });

  try {
    const { id } = await params;
    const betaKey = await prisma.betaKey.findUnique({
      where: { id },
      select: { key: true }
    });

    await prisma.betaKey.delete({
      where: { id },
    });

    if (betaKey) {
      logActivity({
        userId: admin.id,
        action: "ADMIN_BETA_KEY_DELETED",
        metadata: { key: betaKey.key },
        request: req
      });
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[ADMIN_KEYS_DELETE]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
