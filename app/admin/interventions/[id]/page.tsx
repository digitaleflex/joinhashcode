import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { InterventionDetailClient } from "./InterventionDetailClient";

export default async function AdminInterventionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!dbUser || !["ADMIN", "MODERATOR"].includes(dbUser.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const intervention = await prisma.intervention.findUnique({
    where: { id },
    include: {
      attendees: {
        include: {
          user: {
            select: { id: true, name: true, email: true, pseudo: true, image: true, class: true, level: true },
          },
        },
        orderBy: { registeredAt: "asc" },
      },
      _count: { select: { attendees: true } },
    },
  });

  if (!intervention) {
    notFound();
  }

  return (
    <InterventionDetailClient
      intervention={intervention}
      userRole={dbUser.role}
    />
  );
}