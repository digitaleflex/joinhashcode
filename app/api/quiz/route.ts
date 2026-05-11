import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { profileType, answers, responseTimes, averageResponseTime } = body;

    const quizResult = await prisma.quizResult.create({
      data: {
        userId: session.user.id,
        profileType,
        answers,
        detailedResponseTimes: responseTimes,
        averageResponseTime,
      },
    });

    return NextResponse.json(quizResult);
  } catch (error) {
    console.error("[QUIZ_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
