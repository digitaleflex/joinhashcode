import { auth } from "@/lib/auth";
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const admin = await checkAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const betaKey = await prisma.betaKey.findUnique({
      where: { id: params.id },
      select: { key: true }
    });

    await prisma.betaKey.delete({
      where: { id: params.id },
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
    return new NextResponse("Internal Error", { status: 500 });
  }
}
