import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { emailService } from "@/lib/email";

export async function GET() {
  let dbStatus = "offline";
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "online";
  } catch (e) {
    console.error("DB Status Error:", e);
    dbStatus = "error";
  }

  const emailStatus = await emailService.getStatus();

  return NextResponse.json({
    database: dbStatus,
    email: emailStatus.connected ? "online" : "mocked",
  });
}
