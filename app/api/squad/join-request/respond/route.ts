import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { updateSquadCohesion } from "@/lib/squad-logic";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { requestId, action } = await req.json();
    if (!requestId || !action) return new NextResponse("Missing data", { status: 400 });

    const joinRequest = await prisma.joinRequest.findUnique({
      where: { id: requestId },
      include: { organization: true },
    });

    if (!joinRequest) return new NextResponse("Request not found", { status: 404 });

    // Verify user is owner or admin of the organization
    const membership = await prisma.member.findFirst({
      where: {
        organizationId: joinRequest.organizationId,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!membership) return new NextResponse("Forbidden", { status: 403 });

    if (action === "accept") {
      // Check if squad is full (max 5)
      const memberCount = await prisma.member.count({
        where: { organizationId: joinRequest.organizationId },
      });

      if (memberCount >= 5) {
        return NextResponse.json({ message: "Escouade déjà complète (max 5)." }, { status: 400 });
      }

      // Add as member
      await prisma.$transaction([
        prisma.member.create({
          data: {
            id: `${joinRequest.organizationId}-${joinRequest.userId}`, // Simple ID for member
            organizationId: joinRequest.organizationId,
            userId: joinRequest.userId,
            role: "member",
            createdAt: new Date(),
          },
        }),
        prisma.joinRequest.update({
          where: { id: requestId },
          data: { status: "ACCEPTED" },
        }),
      ]);

      // Boost cohesion on new member arrival
      await updateSquadCohesion(joinRequest.organizationId, 0.1, joinRequest.userId);

    } else {
      await prisma.joinRequest.update({
        where: { id: requestId },
        data: { status: "REJECTED" },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SQUAD_JOIN_REQUEST_RESPOND]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
