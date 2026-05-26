import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "12");
    const cursor = searchParams.get("cursor");

    const squads = await prisma.organization.findMany({
      where: {
        isPrivate: false,
      },
      take: limit + 1, // Fetch one extra to see if there is a next page
      cursor: cursor ? { id: cursor } : undefined,
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    let nextCursor: string | null = null;
    if (squads.length > limit) {
      const nextItem = squads.pop();
      nextCursor = nextItem!.id;
    }

    return NextResponse.json({
      data: squads,
      nextCursor,
    });
  } catch (error) {
    console.error("[SQUAD_PUBLIC_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
