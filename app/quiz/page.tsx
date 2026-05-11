import { Quiz } from "@/components/quiz/quiz"
import { Nav } from "@/components/landing/nav"
import { Footer } from "@/components/landing/footer"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const metadata = {
  title: "Profilage — HASHCODE",
  description: "Découvre ton profil et rejoins la communauté qui te correspond.",
}

export default async function QuizPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/signin")
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Nav />
      <div className="flex-1 flex flex-col items-center justify-center pt-24 pb-12">
        <div className="w-full max-w-4xl px-4">
          <div className="text-center mb-12">
            <h1 className="text-sm font-mono uppercase tracking-[0.2em] text-primary mb-4">
              Analyse de potentiel
            </h1>
            <p className="text-muted-foreground text-sm">
              Réponds sincèrement pour obtenir le profilage le plus précis possible.
            </p>
          </div>
          <Quiz />
        </div>
      </div>
      <Footer />
    </main>
  )
}
