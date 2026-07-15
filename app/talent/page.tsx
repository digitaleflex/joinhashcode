import type { Metadata } from "next"
import { TalentPublicPage } from "./talent-public"

export const metadata: Metadata = {
  title: "Talents HASHCODE | Développeurs africains certifiés",
  description:
    "Découvrez les profils tech validés par missions réelles — développeurs africains certifiés par le programme HASHCODE.",
  openGraph: {
    title: "Talents HASHCODE — Profils validés par missions réelles",
    description: "Recrutez les meilleurs talents tech africains, filtrés par profil et niveau.",
  },
}

export default function Page() {
  return <TalentPublicPage />
}
