import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { generatePassportId } from "@/lib/utils";

export async function POST() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const userId = session.user.id;

    // Check if user already has a squad
    const existingMember = await prisma.guildMember.findFirst({
      where: { userId }
    });

    if (existingMember) {
      return NextResponse.json({ error: "Déjà membre d'une escouade" }, { status: 400 });
    }

    // Create a new Squad (Guild)
    const squadName = `Squad-${generatePassportId().slice(0, 6)}`;
    const squadSlug = squadName.toLowerCase();

    const squad = await prisma.guild.create({
      data: {
        name: squadName,
        slug: squadSlug,
        members: {
          create: {
            userId,
            role: "LEADER"
          }
        }
      }
    });

    return NextResponse.json(squad);
  } catch (error) {
    console.error("[SQUAD_CREATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
