export const dynamic = 'force-dynamic'
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { emailService } from "@/lib/email"
import { z } from "zod"
import { getClientIp } from "@/lib/utils"
import { mutationLimiter, checkRateLimit } from "@/lib/ratelimit"

const CONTACT_TYPES = ["BUG", "FEATURE", "PARTNERSHIP", "TEAM", "OTHER"] as const;
// ... existing schema ...
const contactSchema = z.object({
  type: z.enum(CONTACT_TYPES).default("OTHER"),
  email: z.string().email().max(254),
  subject: z.string().min(1).max(200),
  content: z.string().min(1).max(5000),
  github: z.string().max(500).optional(),
  portfolio: z.string().max(500).optional(),
  skills: z.string().max(1000).optional(),
  honeypot: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req.headers);

    const { limited, reset } = await checkRateLimit(mutationLimiter, ip);

    if (limited) {
      return NextResponse.json(
        { error: "Trop de messages envoyés. Réessaie plus tard." },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Reset': reset?.toString() ?? ''
          }
        }
      );
    }

    const body = await req.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? "Données invalides."
      return NextResponse.json({ error: firstError }, { status: 400 })
    }

    const { type, email, subject, content, github, portfolio, skills, honeypot } = parsed.data

    // 1. Honeypot Check
    if (honeypot) {
      console.warn("[CONTACT_API] Honeypot triggered by IP:", ip);
      return NextResponse.json({ success: true }); // Silent fail for bots
    }

    const message = await prisma.contactMessage.create({
      data: { type, email, subject, content, github, portfolio, skills },
    })

    await emailService.sendContactNotification({ type, email, subject, content })

    return NextResponse.json({ success: true, messageId: message.id })
  } catch (error: unknown) {
    console.error("[CONTACT_API_ERROR]", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la transmission" },
      { status: 500 }
    )
  }
}
