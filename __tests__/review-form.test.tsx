import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { ReviewForm } from "@/components/reviewer/review-form"

const push = vi.fn()
const refresh = vi.fn()
const toastError = vi.fn()
const toastSuccess = vi.fn()

vi.mock("next/navigation", () => ({ useRouter: () => ({ push, refresh }) }))
vi.mock("sonner", () => ({ toast: { error: (m: string) => toastError(m), success: (m: string) => toastSuccess(m) } }))

const criteria = [
  { id: "c1", label: "Lien accessible", weight: "REQUIRED" as const },
  { id: "c2", label: "Rapport clair", weight: "REQUIRED" as const },
  { id: "c3", label: "Tests présents", weight: "BONUS" as const },
]

const LONG_FEEDBACK = "Bon travail, mais il manque une conclusion claire."

function fillFeedback(text: string) {
  fireEvent.change(screen.getByLabelText(/ton retour au membre/i), { target: { value: text } })
}

describe("ReviewForm", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("fetch", vi.fn())
  })

  it("désactive l'envoi tant que le retour fait moins de 20 caractères", () => {
    render(<ReviewForm submissionId="s1" criteria={criteria} />)
    const button = screen.getByRole("button", { name: /demander une révision/i })
    expect(button).toBeDisabled()
    fillFeedback("trop court")
    expect(button).toBeDisabled()
    fillFeedback(LONG_FEEDBACK)
    expect(button).toBeEnabled()
  })

  it("propose de valider seulement quand tous les critères obligatoires sont cochés", () => {
    render(<ReviewForm submissionId="s1" criteria={criteria} />)
    expect(screen.getByRole("button", { name: /demander une révision/i })).toBeInTheDocument()
    expect(screen.getByText(/2 critère\(s\) obligatoire\(s\) non coché/i)).toBeInTheDocument()

    fireEvent.click(screen.getByLabelText(/lien accessible/i))
    fireEvent.click(screen.getByLabelText(/rapport clair/i))

    expect(screen.getByRole("button", { name: /valider la soumission/i })).toBeInTheDocument()
    expect(screen.queryByText(/non coché/i)).not.toBeInTheDocument()
  })

  it("envoie chaque critère (coché ou non) et le retour, puis retourne à la file", async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, json: async () => ({ success: true }) } as Response)
    render(<ReviewForm submissionId="s1" criteria={criteria} />)

    fireEvent.click(screen.getByLabelText(/lien accessible/i))
    fireEvent.click(screen.getByLabelText(/rapport clair/i))
    fillFeedback(`  ${LONG_FEEDBACK}  `)
    fireEvent.click(screen.getByRole("button", { name: /valider la soumission/i }))

    await waitFor(() => expect(push).toHaveBeenCalledWith("/reviewer"))
    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe("/api/missions/s1/review")
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      criteria: { c1: true, c2: true, c3: false },
      feedback: LONG_FEEDBACK,
    })
  })

  it("affiche le message d'erreur de l'API et ne quitte pas la page", async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Tu n'es pas le reviewer assigné à cette soumission." }),
    } as Response)
    render(<ReviewForm submissionId="s1" criteria={criteria} />)

    fillFeedback(LONG_FEEDBACK)
    fireEvent.click(screen.getByRole("button", { name: /demander une révision/i }))

    await waitFor(() => expect(toastError).toHaveBeenCalledWith("Tu n'es pas le reviewer assigné à cette soumission."))
    expect(push).not.toHaveBeenCalled()
  })
})
