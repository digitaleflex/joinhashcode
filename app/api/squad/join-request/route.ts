import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { subMinutes } from "date-fns";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return new NextResponse("Unauthorized", { status: 401 });

    const { organizationId } = await req.json();
    if (!organizationId) return new NextResponse("Organization ID missing", { status: 400 });

    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0] || "unknown";
    const ua = h.get("user-agent") || "unknown";

    // 1. Rate Limit: Max 1 request per minute
    const lastRequest = await prisma.joinRequest.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (lastRequest && lastRequest.createdAt > subMinutes(new Date(), 1)) {
      return NextResponse.json({ 
        message: "Doucement, agent ! Laisse tes terminaux refroidir une minute avant de postuler à nouveau." 
      }, { status: 429 });
    }

    // 2. Limit Pending Requests: Max 3
    const pendingCount = await prisma.joinRequest.count({
      where: { 
        userId: session.user.id,
        status: "PENDING"
      },
    });

    if (pendingCount >= 3) {
      return NextResponse.json({ 
        message: "Tu as déjà 3 candidatures en attente. Attends des réponses avant d\"en envoyer d\"autres." 
      }, { status: 400 });
    }

    // 3. Check if already a member of ANY organization
    const existingMembership = await prisma.member.findFirst({
      where: { userId: session.user.id },
    });

    if (existingMembership) {
      return NextResponse.json({ message: "Tu es déjà membre d\"une escouade." }, { status: 400 });
    }

    // 4. Anti-Sybil Check (IP Overlap)
    const ipOverlap = await prisma.member.findFirst({
      where: {
        organizationId,
        user: {
            sessions: {
                some: {
                    ipAddress: ip
                }
            }
        }
      }
    });

    if (ipOverlap) {
        console.warn(`[SECURITY_ALERT] Sybil detection: IP ${ip} already present in squad ${organizationId}`);
        // We allow it for now but log it. For stricter security, we could block it.
    }

    const request = await prisma.joinRequest.create({
      data: {
        userId: session.user.id,
        organizationId,
        ipAddress: ip,
        userAgent: ua,
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
