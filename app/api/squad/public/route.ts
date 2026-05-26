import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const squads = await prisma.organization.findMany({
      where: {
        isPrivate: false,
      },
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

    return NextResponse.json(squads);
  } catch (error) {
    console.error("[SQUAD_PUBLIC_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
