import { describe, it, expect, vi, beforeEach } from "vitest"
import type { ReactElement } from "react"

const mocks = vi.hoisted(() => ({
  findUnique: vi.fn(),
  getPublicEvidence: vi.fn(),
}))

vi.mock("@/lib/prisma", () => ({ prisma: { user: { findUnique: mocks.findUnique } } }))
vi.mock("@/lib/evidence", () => ({ getPublicEvidence: mocks.getPublicEvidence }))
vi.mock("@/components/dossier/dossier-view", () => ({ DossierView: () => null }))
vi.mock("@/components/landing/nav", () => ({ Nav: () => null }))
vi.mock("@/components/landing/footer", () => ({ Footer: () => null }))
vi.mock("next/navigation", () => ({ notFound: () => { throw new Error("NOT_FOUND") } }))

import PublicProfilePage from "@/app/u/[pseudo]/page"

const member = (over: Record<string, unknown> = {}) => ({
  id: "u1",
  name: "Awa Diallo",
  pseudo: "awa",
  image: null,
  bio: null,
  role: "MEMBER",
  language: "fr",
  city: null,
  country: null,
  class: null,
  talentVisible: false,
  technicalLevel: null,
  mainObjective: null,
  domains: [],
  tools: [],
  badges: [],
  memberNumber: 1,
  createdAt: new Date("2026-11-01"),
  githubUrl: null,
  linkedinUrl: null,
  twitterUrl: null,
  portfolioUrl: null,
  level: 1,
  experience: 0,
  missionsCompletedCount: 3,
  banned: false,
  ...over,
})

const evidence = [
  {
    id: "s1",
    missionId: "m1",
    mission: { title: "Triage d'alertes", category: "NETWORK", slug: "triage", missionLevel: "INIT" },
    status: "APPROVED",
    qualityLevel: "GOOD",
    validatedAt: new Date("2026-11-10"),
    artifacts: [],
  },
]

interface DossierProps {
  isPrivate: boolean
  user: { missionSubmissions: unknown[] }
}

/** Une page serveur renvoie un arbre d'éléments React : on y cherche les props passées à DossierView. */
function findDossierProps(node: unknown): DossierProps | null {
  if (!node || typeof node !== "object") return null
  const el = node as ReactElement<{ children?: unknown } & Partial<DossierProps>>
  if (el.props && "isPrivate" in el.props && "user" in el.props) return el.props as DossierProps
  const children = el.props?.children
  for (const child of Array.isArray(children) ? children : [children]) {
    const found = findDossierProps(child)
    if (found) return found
  }
  return null
}

const render = async () => {
  const tree = await PublicProfilePage({ params: Promise.resolve({ pseudo: "awa" }) })
  const props = findDossierProps(tree)
  if (!props) throw new Error("DossierView introuvable dans l'arbre rendu")
  return props
}

describe("/u/[pseudo] — les preuves suivent la visibilité du profil", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.getPublicEvidence.mockResolvedValue(evidence)
  })

  it("n'expose aucune preuve pour un profil privé (valeur par défaut)", async () => {
    mocks.findUnique.mockResolvedValue(member({ talentVisible: false }))
    const props = await render()

    expect(mocks.getPublicEvidence).not.toHaveBeenCalled()
    expect(props.isPrivate).toBe(true)
    expect(props.user.missionSubmissions).toEqual([])
  })

  it("charge et affiche les preuves d'un profil rendu visible", async () => {
    mocks.findUnique.mockResolvedValue(member({ talentVisible: true }))
    const props = await render()

    expect(mocks.getPublicEvidence).toHaveBeenCalledWith("u1")
    expect(props.isPrivate).toBe(false)
    expect(props.user.missionSubmissions).toHaveLength(1)
  })

  it("renvoie 404 pour un membre banni, sans charger de preuve", async () => {
    mocks.findUnique.mockResolvedValue(member({ banned: true, talentVisible: true }))

    await expect(render()).rejects.toThrow("NOT_FOUND")
    expect(mocks.getPublicEvidence).not.toHaveBeenCalled()
  })
})
