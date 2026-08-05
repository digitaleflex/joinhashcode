import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { prisma } from "@/lib/prisma"
import { SpecializationQuiz } from "@/components/quiz/specialization-quiz"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"

export default async function SpecializationPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    redirect("/signin?callbackURL=/specialization")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      pseudo: true,
      primaryDomain: true,
      subDomain: true,
      technicalLevel: true,
      tools: true,
      learningTools: true,
      practiceMode: true,
      certifications: true,
    },
  })

  if (!user) {
    redirect("/signin")
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-gradient-mesh opacity-40 pointer-events-none" />
      <div className="scanline opacity-20" />
      <Nav />
      <main className="flex-1 p-4 pt-24 md:pt-32 relative z-10">
        <div className="max-w-lg mx-auto text-center mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">
            Spécialisation
          </h1>
          <p className="text-sm text-zinc-500 mt-2">
            ~3 minutes — Personnalise ton parcours pour recevoir des missions adaptées à ton domaine.
          </p>
        </div>
        <SpecializationQuiz
          pseudo={user.pseudo}
          existingData={{
            primaryDomain: user.primaryDomain,
            subDomain: user.subDomain,
            technicalLevel: user.technicalLevel,
            tools: user.tools,
            learningTools: user.learningTools,
            practiceMode: user.practiceMode,
            certifications: user.certifications,
          }}
        />
      </main>
      <Footer />
    </div>
  )
}
