import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { organizationId } = await req.json();
    if (!organizationId) return new NextResponse("Organization ID missing", { status: 400 });

    // Check if already a member of ANY organization (one squad limit for now)
    const existingMembership = await prisma.member.findFirst({
      where: { userId: session.user.id },
    });

    if (existingMembership) {
      return NextResponse.json({ message: "Tu es déjà membre d\"une escouade." }, { status: 400 });
    }

    // Check if a request already exists
    const existingRequest = await prisma.joinRequest.findUnique({
      where: {
        userId_organizationId: {
          userId: session.user.id,
          organizationId,
        },
      },
    });

    if (existingRequest) {
      return NextResponse.json({ message: "Candidature déjà envoyée." }, { status: 400 });
    }

    const request = await prisma.joinRequest.create({
      data: {
        userId: session.user.id,
        organizationId,
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    console.error("[SQUAD_JOIN_REQUEST_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) return new NextResponse("Organization ID missing", { status: 400 });

    // Verify user is owner or admin of the organization
    const membership = await prisma.member.findFirst({
      where: {
        organizationId,
        userId: session.user.id,
        role: { in: ["owner", "admin"] },
      },
    });

    if (!membership) return new NextResponse("Forbidden", { status: 403 });

    const requests = await prisma.joinRequest.findMany({
      where: {
        organizationId,
        status: "PENDING",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            level: true,
            class: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("[SQUAD_JOIN_REQUEST_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
