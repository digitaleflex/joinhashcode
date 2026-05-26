import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { key } = await req.json();

    if (!key) {
      return new NextResponse("Key is required", { status: 400 });
    }

    const betaKey = await prisma.betaKey.findUnique({
      where: { key: key.toUpperCase() },
    });

    if (!betaKey) {
      return new NextResponse("Clé d'habilitation invalide", { status: 404 });
    }

    if (betaKey.isUsed) {
      return new NextResponse("Cette clé a déjà été activée par un autre agent", { status: 400 });
    }

    if (betaKey.expiresAt && new Date() > betaKey.expiresAt) {
      return new NextResponse("Cette clé a expiré", { status: 400 });
    }

    // Link key to user and mark as used
    await prisma.$transaction([
      prisma.betaKey.update({
        where: { id: betaKey.id },
        data: {
          isUsed: true,
          usedBy: session.user.id,
        },
      }),
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          betaKeyId: betaKey.id,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[BETA_VERIFY_POST]", error);
    return new NextResponse("Erreur interne", { status: 500 });
  }
}
