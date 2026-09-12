"use client";

import { useRouter } from "next/navigation";
import { ProfilingFlow } from "./components/profiling-flow";
import { track } from "@/lib/acquisition/analytics";
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
