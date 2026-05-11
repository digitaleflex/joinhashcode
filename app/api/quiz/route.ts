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
    const { profileType, answers, responseTimes, averageResponseTime, level } = body;

    const quizResult = await prisma.quizResult.create({
      data: {
        user: { connect: { id: session.user.id } },
        profileType,
        answers,
        detailedResponseTimes: responseTimes,
        averageResponseTime,
      },
    });

    // Update user class/profile and level with psychometric and behavioral data
    const analysis = body.analysis; // Assuming we pass the full analysis now or recalculate it
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        class: profileType,
        level: level || 1,
        // 6. DONNÉES PSYCHOMÉTRIQUES
        builderScore: body.scores?.builder || 0,
        creatorScore: body.scores?.creator || 0,
        strategistScore: body.scores?.strategist || 0,
        catalystScore: body.scores?.catalyst || 0,
        polarization: body.consistencyScore || 0,
        // 5. DONNÉES COMPORTEMENTALES
        answerConsistency: body.consistencyScore || 0,
        onboardingSpeed: body.totalTime || 0, // Total time for quiz
      }
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
