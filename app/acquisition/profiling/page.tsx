"use client";

import { useRouter } from "next/navigation";
import { ProfilingFlow } from "./components/profiling-flow";
import { track } from "@/lib/acquisition/analytics";
import { recordProfilingConsent } from "@/app/actions/acquisition/consent";
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
