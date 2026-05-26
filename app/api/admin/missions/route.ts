import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const missionSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  shortDesc: z.string().optional(),
  slug: z.string().min(1),
  category: z.string().min(1),
  difficulty: z.number().min(1).max(5),
  xp: z.number().min(0),
  weightBuilder: z.number().min(0).max(1),
  weightCreator: z.number().min(0).max(1),
  weightStrategist: z.number().min(0).max(1),
  weightCatalyst: z.number().min(0).max(1),
  duration: z.string().optional(),
  missionLevel: z.string().optional(),
  requirements: z.array(z.string()).default([]),
  targetProfiles: z.array(z.string()).default([]),
  deliverables: z.array(z.string()).default([]),
  submissionMethod: z.string().default("ANY_LINK"),
  acceptanceCriteria: z.array(z.string()).default([]),
  isWeeklyChallenge: z.boolean().default(false),
  weeklySlot: z.number().optional().nullable(),
});

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN", "MODERATOR"].includes(user.role)) return null;

  return session.user;
}

export async function GET() {
  const admin = await checkAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const missions = await prisma.mission.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(missions);
  } catch (error) {
    console.error("[ADMIN_MISSIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  const admin = await checkAdmin();
  if (!admin) return new NextResponse("Unauthorized", { status: 401 });

  try {
    const body = await req.json();
    const validatedData = missionSchema.parse(body);

    const mission = await prisma.mission.create({
      data: {
        ...validatedData,
        acceptanceCriteria: validatedData.acceptanceCriteria as any,
      },
    });

    return NextResponse.json(mission);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(error.errors, { status: 400 });
    }
    console.error("[ADMIN_MISSIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
