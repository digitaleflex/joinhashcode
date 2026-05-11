import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { emailService } from "@/lib/email";

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
        user: { connect: { id: session.user.id } },
        profileType,
        answers,
        detailedResponseTimes: responseTimes,
        averageResponseTime,
      },
    });

    // Update user class/profile
    await prisma.user.update({
      where: { id: session.user.id },
      data: { class: profileType }
    });

    // Send email asynchronously (don't block the response)
    emailService.sendQuizResults({
      email: session.user.email,
      name: session.user.name,
      profileType
    }).catch(console.error);

    return NextResponse.json(quizResult);
  } catch (error) {
    console.error("[QUIZ_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
