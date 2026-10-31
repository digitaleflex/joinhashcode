import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { AuthError, requireSession } from "@/lib/auth-guard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const noStoreHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  Vary: "Cookie, Authorization",
};

function problem(
  requestId: string,
  status: number,
  code: string,
  title: string,
  detail: string,
) {
  return NextResponse.json(
    {
      type: `https://joinhashcode.com/problems/${code.toLowerCase().replaceAll("_", "-")}`,
      title,
      status,
      code,
      detail,
      requestId,
    },
    { status, headers: noStoreHeaders },
  );
}

/**
 * Returns the authenticated member's integration-safe profile.
 * Never returns the raw Prisma User record.
 */
export async function GET() {
  const requestId = `req_${randomUUID()}`;

  try {
    const session = await requireSession();

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        pseudo: true,
        country: true,
        city: true,
        language: true,
        primaryDomain: true,
        mainObjective: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return problem(
        requestId,
        404,
        "MEMBER_NOT_FOUND",
        "Member not found",
        "The authenticated member profile could not be found.",
      );
    }

    return NextResponse.json(
      {
        data: {
          id: user.id,
          displayName: user.name,
          email: user.email,
          avatarUrl: user.image,
          username: user.pseudo,
          location: {
            country: user.country,
            city: user.city,
          },
          language: user.language,
          primaryDomain: user.primaryDomain,
          declaredObjective: user.mainObjective,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        meta: { requestId },
      },
      { headers: noStoreHeaders },
    );
  } catch (error) {
    if (error instanceof AuthError) {
      const code = error.status === 403 ? "FORBIDDEN" : "UNAUTHENTICATED";
      const title = error.status === 403 ? "Forbidden" : "Authentication required";
      return problem(requestId, error.status, code, title, error.message);
    }

    console.error("[API_V1_MEMBER_ME]", { requestId, error });
    return problem(
      requestId,
      500,
      "INTERNAL_ERROR",
      "Internal server error",
      "The request could not be completed.",
    );
  }
}
