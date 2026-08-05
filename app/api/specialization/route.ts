import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const specializationSchema = z.object({
  primaryDomain: z.string().max(50),
  subDomain: z.string().max(50).nullable().optional(),
  technicalLevel: z.enum(["BEGINNER", "INTERMEDIATE", "ADVANCED"]).nullable().optional(),
  tools: z.array(z.string().max(50)).max(5),
  learningTools: z.array(z.string().max(50)).max(3),
  practiceMode: z.string().max(50).nullable().optional(),
  certifications: z.array(z.string().max(100)).max(5),
})

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 })
    }

    const body = await req.json()
    const parsed = specializationSchema.safeParse(body)

    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0]
      return NextResponse.json({ message: firstError || "Données invalides" }, { status: 400 })
    }

    const { primaryDomain, subDomain, technicalLevel, tools, learningTools, practiceMode, certifications } = parsed.data

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        primaryDomain,
        subDomain: subDomain ?? null,
        technicalLevel: technicalLevel ?? null,
        tools,
        learningTools,
        practiceMode: practiceMode ?? null,
        certifications,
        specializationAt: new Date(),
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[SPECIALIZATION_POST]", error)
    return NextResponse.json({ message: "Erreur interne" }, { status: 500 })
  }
}
