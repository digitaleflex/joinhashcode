"use client"

import dynamic from "next/dynamic"

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

interface QuizUser {
  id: string
  pseudo: string | null
  name: string
  memberNumber: number | null
  class: string | null
  level: number
  experience: number
  createdAt: Date | string
}

interface QuizWrapperProps {
  user?: QuizUser
}

export function QuizWrapper({ user }: QuizWrapperProps) {
  return <Quiz user={user} />
}
