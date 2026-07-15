import { getSessionSafe } from "@/lib/get-session-safe"
import { redirect } from "next/navigation"
import { ReactivateForm } from "./reactivate-form"

export default async function ReactivatePage() {
  const session = await getSessionSafe()

  if (!session) {
    redirect("/signin");
  }

  const user = session.user as { deactivatedAt: string | null } | null;
  const isDeactivated = user?.deactivatedAt && new Date(user.deactivatedAt) <= new Date();

  if (!isDeactivated) {
    redirect("/dashboard");
  }

  return <ReactivateForm />
}
