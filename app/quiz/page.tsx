import dynamic from "next/dynamic"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import { cookies } from "next/headers"
import { getSessionSafe } from "@/lib/get-session-safe"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"

const Quiz = dynamic(() => import("@/components/quiz/quiz").then((mod) => mod.Quiz), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-24">
      <div className="animate-pulse space-y-4 text-center">
        <div className="h-4 w-48 bg-muted rounded mx-auto" />
        <div className="h-24 w-96 bg-muted rounded mx-auto" />
        <div className="h-8 w-64 bg-muted rounded mx-auto" />
      </div>
    </div>
  ),
})

export const metadata = {
  title: "Évaluation — HASHCODE",
  description: "Découvre ton profil et rejoins la communauté qui te correspond.",
}

export default async function QuizPage() {
  const session = await getSessionSafe()

  if (!session) {
    redirect("/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      pseudo: true,
      name: true,
      memberNumber: true,
      class: true,
      createdAt: true,
      progress: { select: { level: true, experience: true } },
    },
  })

  if (user?.class) {
    const lastQuiz = await prisma.quizResult.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    })

    if (lastQuiz) {
      const now = new Date()
      const quizCreatedAt = new Date(lastQuiz.createdAt)
      const userCreatedAt = new Date(user.createdAt)

      const isNewAccount = (now.getTime() - userCreatedAt.getTime()) < 24 * 60 * 60 * 1000
      const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000
      const cooldownEnd = new Date(quizCreatedAt.getTime() + COOLDOWN_MS)
      const isCooldownElapsed = now.getTime() >= cooldownEnd.getTime()

      if (!isNewAccount && !isCooldownElapsed) {
        redirect("/missions")
      }
    }
  }

  const cookieStore = await cookies()
  const pendingSquad = cookieStore.get("pending-squad")?.value ?? null

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center pt-16 pb-12">
        <div className="w-full max-w-4xl px-4">
          <Link
            href="/onboarding"
            className="inline-flex items-center gap-2 text-[10px] font-mono text-muted-foreground hover:text-primary transition-colors mb-12 group"
          >
            <ChevronLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
            RETOUR AU PROFIL
          </Link>

          <div className="text-center mb-6">
            <h1 className="text-sm font-mono uppercase text-primary mb-2">
              Diagnostic de ton profil · ~3 minutes
            </h1>
            <p className="text-muted-foreground text-sm">
              Réponds instinctivement — il n&apos;y a pas de bonne ou mauvaise réponse.
            </p>
          </div>
          <Quiz
            user={user ? { ...user, level: user.progress?.level ?? 1, experience: user.progress?.experience ?? 0 } : undefined}
            pendingSquad={pendingSquad}
          />
        </div>
      </div>
      <Footer />
    </main>
  )
}
