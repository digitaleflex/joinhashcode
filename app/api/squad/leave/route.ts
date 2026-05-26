export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const membership = await prisma.guildMember.findFirst({
      where: { userId: session.user.id },
    });

    if (!membership) {
      return new NextResponse("Tu n'es membre d'aucune escouade.", { status: 404 });
    }

    if (membership.role === "LEADER") {
      const count = await prisma.guildMember.count({ where: { guildId: membership.guildId } });
      if (count > 1) {
        return new NextResponse(
          "Transfère le rôle de Leader avant de quitter l'escouade.",
          { status: 400 }
        );
      }
      // Last member + leader: delete the whole guild
      await prisma.guild.delete({ where: { id: membership.guildId } });
    } else {
      await prisma.guildMember.delete({ where: { id: membership.id } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SQUAD_LEAVE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
