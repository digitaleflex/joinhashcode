"use client";

import { useRouter } from "next/navigation";
import { ProfilingFlow } from "./components/profiling-flow";
import { track } from "@/lib/acquisition/analytics";
import { recordProfilingConsent } from "@/app/actions/acquisition/consent";
import { createProspectFromProfiling } from "@/app/actions/acquisition/prospect";
import type { ProfileAnswers } from "@/lib/acquisition/types";

const PROFILE_STORAGE_KEY = "hashcode:acq:profile";

export default function AcquisitionProfilingPage() {
  const router = useRouter();

  function handleComplete(answers: ProfileAnswers) {
    // Carry the profile to the invite step (best-effort — storage may be unavailable).
    try {
      sessionStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(answers));
    } catch {
      // ignore private-mode / storage quota failures
    }

    // Preuve de consentement côté SERVEUR (horodatée, non modifiable par le
    // client). Obligatoire dès lors qu'on crée un compte et qu'on envoie un
    // email — le tracking client seul ne suffit pas en cas de contrôle.
    // Fire-and-forget : on ne bloque jamais la navigation pour ça.
    if (answers.email) {
      void recordProfilingConsent({ email: answers.email }).catch(() => {
        // déjà loggé côté serveur — ne pas casser le parcours utilisateur
      });

      // Persiste le prospect : sans ça, tout le profiling était perdu à la
      // fermeture de l'onglet (il ne vivait que dans le sessionStorage).
      void createProspectFromProfiling({
        firstName: answers.firstName,
        lastName: answers.lastName,
        email: answers.email,
        phone: answers.phone,
        country: answers.country,
        city: answers.city,
        gender: answers.gender,
        primaryDomain: answers.primaryDomain,
        domainSpecialty: answers.domainSpecialty,
        level: answers.level,
        goal: answers.goal,
        goalProjectStage: answers.goalProjectStage,
        goalSituation: answers.goalSituation,
        availability: answers.availability,
        availabilityTimes: answers.availabilityTimes,
        learningStyle: answers.learningStyle,
        mentoringInterest: answers.mentoringInterest === "yes",
      }).catch(() => {
        // idem — le parcours ne doit pas casser si la base est indisponible
      });
    }

    track({ type: "profiling_completed" });
    router.push("/acquisition/invite");
  }

  return (
    <ProfilingFlow
      onBack={() => router.push("/acquisition")}
      onComplete={handleComplete}
    />
  );
}
