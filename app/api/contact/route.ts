export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { emailService } from "@/lib/email"
import { z } from "zod"

const CONTACT_TYPES = ["BUG", "FEATURE", "PARTNERSHIP", "OTHER"] as const;

const contactSchema = z.object({
  type: z.enum(CONTACT_TYPES).default("OTHER"),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
});

// In-memory rate limiter: max 3 requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return false;
  }

  if (entry.count >= 3) return true;

  entry.count++;
  return false;
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Trop de messages envoyÃ©s. RÃ©essaie dans une heure." },
        { status: 429 }
      );
    }

    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: "DonnÃ©es invalides", details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { type, email, subject, content } = parsed.data

    const message = await prisma.contactMessage.create({
      data: { type, email, subject, content },
    })

    await emailService.sendContactNotification({ type, email, subject, content })

    return NextResponse.json({ success: true, messageId: message.id })
  } catch (error) {
    console.error("[CONTACT_API_ERROR]", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la transmission" },
      { status: 500 }
    )
  }
}
