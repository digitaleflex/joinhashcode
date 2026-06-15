import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
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

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

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
      await logActivity({
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
