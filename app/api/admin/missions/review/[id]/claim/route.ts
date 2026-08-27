import { checkAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await checkAdmin();
  if (!admin)
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { id } = await params;

    const submission = await prisma.missionSubmission.findUnique({
      where: { id },
      select: { id: true, status: true, reviewerId: true },
    });

    if (!submission)
      return NextResponse.json(
        { message: "Soumission introuvable" },
        { status: 404 }
      );

    if (submission.status !== "PENDING" && submission.status !== "REVISION_REQUIRED") {
      return NextResponse.json(
        { message: "Cette soumission ne peut pas être réclamée" },
        { status: 400 }
      );
    }

    if (submission.reviewerId && submission.reviewerId !== admin.id) {
      return NextResponse.json(
        { message: "Déjà réclamée par un autre reviewer" },
        { status: 409 }
      );
    }

    await prisma.missionSubmission.update({
      where: { id },
      data: {
        status: "IN_REVIEW",
        reviewerId: admin.id,
        reviewerType: "ADMIN",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_REVIEW_CLAIM_POST]", error);
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 });
  }
}
