export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Remove a member from the guild (LEADER action)
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { memberId, action } = await req.json();
    if (!memberId || !action) return new NextResponse("Missing data", { status: 400 });

    const target = await prisma.guildMember.findUnique({ where: { id: memberId } });
    if (!target) return new NextResponse("Member not found", { status: 404 });

    const leadership = await prisma.guildMember.findFirst({
      where: { guildId: target.guildId, userId: session.user.id, role: "LEADER" },
    });
    if (!leadership) return new NextResponse("Forbidden", { status: 403 });

    if (action === "remove") {
      await prisma.guildMember.delete({ where: { id: memberId } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SQUAD_JOIN_REQUEST_RESPOND]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
