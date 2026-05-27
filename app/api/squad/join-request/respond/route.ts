export const dynamic = "force-dynamic";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Remove a member from the organization (owner action)
export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { memberId, action } = await req.json();
    if (!memberId || !action) return new NextResponse("Missing data", { status: 400 });

    const target = await prisma.member.findUnique({ where: { id: memberId } });
    if (!target) return new NextResponse("Member not found", { status: 404 });

    const leadership = await prisma.member.findFirst({
      where: { organizationId: target.organizationId, userId: session.user.id, role: "owner" },
    });
    if (!leadership) return new NextResponse("Forbidden", { status: 403 });

    if (action === "remove") {
      await prisma.member.delete({ where: { id: memberId } });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SQUAD_JOIN_REQUEST_RESPOND]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
