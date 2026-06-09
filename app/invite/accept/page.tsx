import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AcceptInvitationClient } from "./accept-client"

export default async function AcceptInvitationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  if (!id) redirect("/squad")

  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect(`/signin?callbackURL=/invite/accept?id=${id}`)

  // Load invitation details for the UI
  const invitation = await prisma.invitation.findUnique({
    where: { id },
    include: {
      organization: { select: { name: true, slug: true, description: true } },
    },
  })

  if (!invitation || invitation.status !== "pending") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Invitation invalide</h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm">
          {invitation ? "Cette invitation a déjà été utilisée ou annulée." : "Invitation introuvable ou expirée."}
        </p>
        <a href="/squad" className="mt-6 text-primary text-sm font-mono hover:underline">← Retour à mon escouade</a>
      </div>
    )
  }

  // Check if user is already in a squad
  const existingMembership = await prisma.member.findFirst({
    where: { userId: session.user.id },
  })

  if (existingMembership) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter">Déjà dans une escouade</h1>
        <p className="text-zinc-500 mt-2 font-mono text-sm">Tu dois quitter ton escouade actuelle avant d'en rejoindre une autre.</p>
        <a href="/squad" className="mt-6 text-primary text-sm font-mono hover:underline">← Voir mon escouade</a>
      </div>
    )
  }

  return (
    <AcceptInvitationClient
      invitationId={id}
      squadName={invitation.organization.name}
      squadDescription={invitation.organization.description ?? null}
      squadSlug={invitation.organization.slug ?? ""}
    />
  )
}
