import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { emailService } from "@/lib/email"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { type, email, subject, content } = body

    if (!email || !subject || !content) {
      return NextResponse.json(
        { error: "Données manquantes" },
        { status: 400 }
      )
    }

    // 1. Sauvegarder en base de données
    const message = await prisma.contactMessage.create({
      data: {
        type,
        email,
        subject,
        content,
      },
    })

    // 2. Envoyer la notification à l'admin
    await emailService.sendContactNotification({
      type,
      email,
      subject,
      content
    })

    return NextResponse.json({ 
      success: true, 
      messageId: message.id 
    })

  } catch (error) {
    console.error("[CONTACT_API_ERROR]", error)
    return NextResponse.json(
      { error: "Une erreur est survenue lors de la transmission" },
      { status: 500 }
    )
  }
}
